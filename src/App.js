import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";

// AG-Grid Stylesheets
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Custom Components
import { Header, Footer } from "./components/universal";

// Utility functions
import { apiFetch } from "./util/api";

const App = (props) => {
	const useStyles = makeStyles((theme) => ({
		centerGrid: {
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			paddingTop: 50,
			paddingBottom: 40
		}
	}));

	const classes = useStyles();
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();
	const queryTitle = searchParams.get("title");
	const queryYear = searchParams.get("year");
	
	const defaultColDef = useMemo(() => {
		return {
			resizable: true,
			minWidth: 300
		};
	}, []);

	const [columnDefs, setColumnDefs] = useState([
		{ headerName: "IMDB ID", field: "imdbID", minWidth: 50},
		{ headerName: "Title", field: "title",
			cellRenderer: (props) => {
				if (props.value !== undefined) {
					return props.value;
				}
			},
		},
		{ headerName: "Classification", field: "classification"},
		{ headerName: "IMDB Rating", field: "imdbRating"},
		{ headerName: "Year", field: "year"}
	]);

	const fetchData = (pageNum) => {
		let apiQuery = `/movies/search?page=${pageNum}`;
		if (queryTitle) {
			apiQuery += `&title=${queryTitle}`;
		}

		if (queryYear) {
			apiQuery += `&year=${queryYear}`;
		}

		return apiFetch(apiQuery)
		.then((resp) => resp.json())
		.then((resp) => {
			if (resp.error) {
				console.error("[MAIN GRID] Unanticipated Error: ", resp.error);
				return ({error: true, message: resp.message});
			}
			return resp;
		})
		.catch(err => console.error("[MAIN GRID] Unanticipated Error: ", err));
	};

	const onGridReady = useCallback((params) => {
		let pageNumber = 1;
		let totalRows = 0;
		const dataSource = {
			rowCount: undefined,
			getRows: (params) => {
				fetchData(pageNumber)
				.then((data) => {
					if (data.error) {
						// Output error message to grid
						params.successCallback([{title: data.message}], 1);
						return;
					}

					pageNumber = data.pagination.nextPage;
					
					let lastRow = -1;

					// Data is shorter than default row cache block.
					if (params.startRow + data.data.length <= params.endRow) {
						lastRow = params.startRow + data.data.length;
					}
					
					params.successCallback(data.data, lastRow);
				})
				.catch((err) => {
					params.successCallback({title: err}, 1);
				})
			}
		}
		params.api.setDatasource(dataSource);
	}, []);

	return (
		<div>
			<Header />

			<div className={classes.centerGrid}>
				<Typography variant="h4">Lindsay Fry presents: Movie Search</Typography>
				<Typography sx={{paddingBottom: 3}} variant="h5">The easy-to-use film detail database. Enjoy your stay.</Typography>
				<div className="ag-theme-alpine" style={{ height: "600px", width: "75%" }}>
					<AgGridReact
						columnDefs={columnDefs}
						defaultColDef={defaultColDef}
						rowBuffer={0}
						rowSelection={'single'}
						rowModelType={'infinite'}
						cacheBlockSize={99}
						cacheOverflowSize={2}
						maxConcurrentDatasourceRequests={1}
						infiniteInitialRowCount={1}
						maxBlocksInCache={13000}
						onGridReady={onGridReady}
						onRowClicked={row => navigate(`/movie?id=${row.data.imdbID}`)}
					/>
				</div>
			</div>

			<Footer />
		</div>
	);
}

export default App;
