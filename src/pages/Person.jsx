import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";

// AG-Grid Stylesheets
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// MUI 5 Components
import { makeStyles } from "@mui/styles";
import Grid from  "@mui/material/Grid";
import IconButton from  "@mui/material/IconButton";
import Box from  "@mui/material/Box";
import Typography from  "@mui/material/Typography";
import Link from "@mui/material/Link";

// Chart.js Components
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Bar } from "react-chartjs-2";

// Custom components
import { Header, Footer } from "../components/universal";
import ErrorPopup from "../components/ErrorPopup";

// Utility functions
import { apiFetch, refreshTokens, hasTokenExpired } from '../util/api';

/* Role data JSON format */
/* movieName	- string
 * movieId		- string
 * category		- string
 * characters	- array(string)
 * imdbRating	- float
 */

/* Person data JSON format */
/* name			- string
 * birthYear	- int
 * deathYear	- int/null
 * roles		- array(Role)
 */

const Person = (props) => {
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();
	const personID = searchParams.get("id");
	
	const [error, setError] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");

	const [person, setPerson] = useState({});
	const [chartData, setChartData] = useState({labels: [], datasets: []});

	const [columnDefs, setColumnDefs] = useState([
		{ headerName: "Movie Name", field: "movieName",
			cellRenderer: (props) => {
				if (props.value !== undefined) {
					return props.value;
				}
			}, 
		},
		{ headerName: "Category", field: "category"},
		{ headerName: "Characters", field: "characters",
			cellRenderer: (props) => {
				if (props.value.length !== 0) {
					console.log(props.value);
					return props.value;
				} else {
					return "*** Played no characters. ***";
				}
			},
		}
	]);

	Chart.register(CategoryScale);

	useEffect(() => {
		const redirectURL = `/person?id=${personID}`;
		const encodedRedirect = encodeURIComponent(redirectURL);
		if (Object.entries(person).length === 0) {
			// Check token expiration period
			const bearerToken = localStorage.getItem("bearerToken");
			if (bearerToken === null) { 
				alert("Unauthorised. Please sign-in");
				navigate(`/user?mode=login&redirect=${encodedRedirect}`);
				return;
			}

			const bearerExpiry = localStorage.getItem("bearerExp");
			const issuedAt = localStorage.getItem("issuedAt");
			if (hasTokenExpired(bearerExpiry,issuedAt) === true) {
				if (refreshTokens() === false) {
					alert("Unauthorised. Please sign-in");
					navigate(`/user?mode=login&redirect=${encodedRedirect}`);
				}
			}

			apiFetch(`/people/${personID}`,bearerToken)
			.then(response => {
				if (response.status !== 200) {
					setError(response.status);
				}
				return response.json();
			})
			.then(personData => {
				if (personData.error || personData.status === "error") {
					// Refresh auth or request sign in
					setErrorMessage(personData.message);
				} else {
					setPerson(personData);
					const imdbData = personData.roles.map((role) => {
						return ({
							name: role.movieName,
							imdbRating: role.imdbRating
						});
					});

					setChartData({
						labels: imdbData.map((data) => data.name), 
						datasets: [{
							label: "Rating /10",
							barPercentage: 0.75,
							data: imdbData.map((data) => data.imdbRating),
							backgroundColor: [
								"#f3ba2f",
								"#2a71d0"
							],
							
							borderWidth: 2
						}]
					});
				}
			})
			.catch(err => {
				console.error("[PERSON] Unanticipated Error: ", err);
			});
		}
	});

	if (error) {
		return (
			<div>
				<Header />
				<Box sx={{display: "flex", justifyContent:"center", alignItems:"center", paddingTop: 5}}>
					<ErrorPopup value={error} message={errorMessage} />
				</Box>
				<Footer />
			</div>
		);
	}

	return (
		<div>
			<Header />

			<Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop: 5}}>
				<Box>
					{person.deathYear
					? <Typography variant="h5">{person.name}: {person.birthYear}-{person.deathYear}</Typography> 
					: <Typography variant="h5">{person.name}: {person.birthYear}-</Typography>}
				</Box>

				<Box sx={{display: "flex" , flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
				<Box className="ag-theme-alpine" sx={{ height: "400px", width: "1000px", paddingTop: 2, paddingBottom: 2 }}>
					<AgGridReact
						columnDefs={columnDefs}
						rowData={person.roles}
						onFirstDataRendered={(props) => {
							props.api.sizeColumnsToFit();
						}}
						onRowClicked={row => navigate(`/movie?id=${row.data.movieId}`)}
					/>
				</Box>

				<Box sx={{border: "1px solid grey", minWidth: 1100, maxWidth: 1500}}>
					<Bar
						data={chartData}
						options={{
							plugins: {
								title: {
									display: true,
									text: "Movies by IMDb ratings"
								},
								legend: {
									display: true
								}
							},
							scales: {
								y: {
									min: 1,
									max: 10
								}
							}

						}}
					/>
				</Box>
				</Box>
			</Box>

			<Footer />
		</div>
	);
};

export default Person;