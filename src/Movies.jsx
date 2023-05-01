import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate, Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { Header, Footer } from "./index.js";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

import './App.css';

// Util functions
import { apiFetch } from "./util/api";

const Movies = ({ initialData }) => {
	const navigate = useNavigate();

	const [gridApi,setGridApi] = useState(null);
	const [pageNumber,setPageNumber] = useState(0);	
	const [movieData,setMovieData] = useState([]);
	useEffect(() => {
		setMovieData(initialData);
	});
	

	/*const infiniteScrollHandler = (e) => {
		console.log(e.target.scrollTop);
		console.log(e.target.scrollHeight);
		console.log(e.target.clientHeight);
		if (e.target.scrollTop + 10 >= e.target.scrollHeight - e.target.clientHeight) {
			setPageNumber(pageNumber+1);
			apiFetch(`/movies/search?page=${pageNumber}`)
			.then(response => response.json())
			.then(movieData => {
				const movieArray = movieData.data.map(movie => {
					return {
						classification: movie.classification,
						imdbID: movie.imdbID,
						imdbRating: movie.imdbRating,
						metacriticRating: movie.metacriticRating,
						rottenTomatoesRating: movie.rottenTomatoesRating,
						title: movie.title,
						year: movie.year
					};
				});
				setMovieData(movieData.concat(movieArray));
			});
		}
	};*/


	const onGridReady = useCallback((params) => {
		apiFetch(`/movies/search?page=${pageNumber}`)
		.then(response => response.json())
		.then(data => {
			const dataSource = {
				rowCount: undefined,
				getRows: (params) => {
					setTimeout(function () {
						
					},500);
				},
			};
			params.api.setDatasource(dataSource);
		});
		//setGridApi(params);

		// params is gridOptions?
		//gridApi.rowModelType = "infinite";
		//params.api.setDatasource(dataSource);
		//params.api.setDatasource(movieData);
	},[]);

	const columns = [
		{ headerName: "Title", field: "title" },
		{ headerName: "Classification", field: "classification" },
		{ headerName: "IMDB ID", field: "imdbID" },
		{ headerName: "IMDB Rating", field: "imdbRating" },
		{ headerName: "Metacritic Rating", field: "metacriticRating" },
		{ headerName: "Rotten Tomatoes Rating", field: "rottenTomatoesRating" },
		{ headerName: "Year", field: "year" },
	];


	// onRowClicked={row => navigate(`/movie?id=${row.data.imdbID}`)}

	return (
		<div className="Movies">
			<Header />
			<div className="ag-theme-balham" style={{ height: "300px", width: "75%" }}>
				<AgGridReact
					columnDefs={columns}
					rowModelType="infinite"
					datasource={dataSource}
					onGridReady={onGridReady}
					components={components}
					defaultColDef={{ filter: true, floatingFilter: true, sortable: true }}
				/>
			</div>
			<Footer />
		</div>
	);
}

export default Movies;
