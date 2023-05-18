import { useState, setState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";

// AG-Grid Stylesheets
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// MUI 5 Components
import Grid from  "@mui/material/Grid";
import IconButton from  "@mui/material/IconButton";
import Box from  "@mui/material/Box";
import Typography from  "@mui/material/Typography";
import Link from "@mui/material/Link";

// Custom components
import { Header, Footer } from "../components/universal";
import ErrorPopup from "../components/ErrorPopup";

// Utility functions
import { apiFetch } from '../util/api';


/* Movie data JSON format */
/* title 		- string
 * year 		- int
 * runtime		- int
 * genres		- array(string)
 * country 		- string
 * principals	- array(object) 	// Primary people associated with production
 * ratings		- array(object) 	// Independent critical ratings and their sources.
 * boxoffice 	- int
 * poster		- string 	 		// Poster image hyperlink
 * plot			- string
 */

/* Rating data JSON format */
/* source		- string
 * value		- float
 */

/* Principal data JSON format */
/* category		- string
 * characters	- array(string)
 * id			- string
 * name			- string
 */

const Movie = (props) => {
	const navigate = useNavigate();

	const [error, setError] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");

	const [searchParams] = useSearchParams();
	const movieID = searchParams.get("id");
	const [movie, setMovie] = useState({});

	const [imdbRating, setIMDb] = useState(null);
	const [rottenRating, setRotten] = useState(null);
	const [metaRating, setMeta] = useState(null);

	const [columnDefs, setColumnDefs] = useState([
		{ headerName: "Person ID", field: "id",
			cellRenderer: (props) => {
				if (props.value !== undefined) {
					return props.value;
				}
			}, 
		},
		{ headerName: "Name", field: "name"},
		{ headerName: "Category", field: "category" },
	]);

	const getRandomColour = () => {
		// High contrast colours for increased visibility with white typography.
		const colours = ["#3300FF", "#FF007E","#FF6500","#0055FF","#AE00FF","#FF0012"];
		
		return colours[Math.floor(Math.random()*colours.length)];
	};

	// Convert raw currency value into decimal-seperated string.
	const formatCurrency = (currency) => {
		if (currency === undefined) {
			return "";
		}
		return currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	useEffect(() => {
		// Only query API if 'movie' is unpopulated.
		if (Object.entries(movie).length === 0) {
			apiFetch(`/movies/data/${movieID}`)
			.then(response => {
				if (response.status !== 200) {
					setError(response.status);
				}
				return response.json();
			})
			.then(movieData => {			
				if (movieData.error || movieData.status === "error") {
					setErrorMessage(movieData.message);
					return;
				} else {
					setMovie(movieData);
					for (let i=0;i<movieData.ratings.length;i++) {
						let source = movieData.ratings[i].source;
						let value = movieData.ratings[i].value;
						
						// Skip null values.
						if (value === "" || value === null) {
							continue;	
						}

						if (source === "Internet Movie Database") {
							setIMDb(value);
						} else if (source === "Rotten Tomatoes") {
							setRotten(value);
						} else if (source === "Metacritic") {
							setMeta(value);
						}
					}
				}
			})
			.catch(err => {
				console.error("[MOVIE] Unanticipated Error: ", err);
			});

		}
	});

	// Display error message.
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

			<Box sx={{display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"center", paddingTop: 5}}>
				<Box sx={{display: "flex"}}>
					<Box sx={{display: "flex", justifyContent: "flex-start", flexDirection: "column", padding: 1, bgcolor: "lightgrey", borderRadius: 2}}>
						<Typography variant="h4">{movie.title}</Typography>
						<Box>
							<Typography variant="h6">Released in: {movie.year}</Typography>
						</Box>

						<Box>
							<Typography variant="h6">Runtime: {movie.runtime} minutes</Typography>
						</Box>

						<Box>
							<Typography variant="h6">Box office: ${formatCurrency(movie.boxoffice)}</Typography>
						</Box>

						<Box>
							<Typography variant="h6">Country: {movie.country}</Typography>
						</Box>
					
						<Box>
							<Grid container>
								<Typography variant="h6">Genres: </Typography>
								{movie.genres && movie.genres.map((genre) => (
									<Grid item sx={{
										fontSize: 20,
										paddingLeft: 1,
										paddingRight: 1, 
										bgcolor: getRandomColour(), 
										color: "white",
										borderRadius: 2}} 
										key={genre}>
									{genre}
									</Grid>
								))}
							</Grid>
						</Box>

						{/* Pre-wrapping the white space in this instance allows newline chars to be inserted into the Typography */}
						<Box sx={{whiteSpace: "pre-wrap", paddingTop: 2}}>
							{/* Conditional rendering excludes undefined ratings */}
							{imdbRating && <Typography variant="body" sx={{fontSize: 21}}>IMDb: {imdbRating}/10{'\n'}</Typography>}
							{rottenRating && <Typography variant="body" sx={{fontSize: 21}}>Rotten Tomatoes: {rottenRating}%{'\n'}</Typography>}
							{metaRating && <Typography variant="body" sx={{fontSize: 21}}>Metacritic: {metaRating}/100{'\n'}</Typography>}
						</Box>

						{/* maxWidth works best for line wrapping in this context as the synopsis can't be mapped into lines */}
						<Box sx={{maxWidth: 350, paddingTop: 2}}>
							<Typography variant="body" sx={{fontSize: 21}}>Synopsis: {movie.plot}</Typography>
						</Box>

					</Box>
					<Box sx={{display: "flex", justifyContent: "flex-end", alignItems: "center", paddingLeft: 10}}>
						<img src={movie.poster}/>
					</Box>
				</Box>

				<Box className="ag-theme-alpine" sx={{ height: "300px", width: "1000px", paddingTop: 2 }}>
					<AgGridReact
						columnDefs={columnDefs}
						rowData={movie.principals}
						onFirstDataRendered={(props) => {
							props.api.sizeColumnsToFit();
						}}
						onRowClicked={row => navigate(`/person?id=${row.data.id}`)}
					/>
				</Box>
				</Box>
			<Footer />
		</div>
	);
};


export default Movie;
