import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

// Context
import { AppContext } from "./index";

// Pages
import Movies from "./Movies";
import Movie from "./pages/Movie";
import Person from "./pages/Person";
import User from "./pages/User";

// Error handling
import Error from "./pages/Error";

// Util functions
import { apiFetch } from "./util/api";

const App = (props) => {
	const [movieData, setMovieData] = useState([]);

	useEffect(() => {
		console.log("DEBUG: Fetching movie listings.");
		apiFetch("/movies/search")
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
			setMovieData(movieArray);
		});
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Movies initialData={movieData} />} />
				<Route path="/movie" element={<Movie />} />
				<Route path="/person" element={<Person />} />
				<Route path="/user" element={<User />} />
				<Route path="/error" element={<Error />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;