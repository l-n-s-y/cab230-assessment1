import { useState, setState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { apiFetch } from '../util/api';

import { Header, Footer } from "../index.js";
import { Character } from "./Person";

/* Rating data JSON format */
/* source	- string
 * value	- float
 */
const Rating = (props) => {
	return (
		<div>
			<h2>{props.source}</h2>
			<h2>{props.value}</h2>
		</div>
	);
};

/* Principal data JSON format */
/* category	- string
 * characters	- array(string)
 * id		- string
 * name		- string
 */

const Principal = (props) => {
	const borderStyle = {
		border: "1px black solid"
	};

	const principalHyperlink = `/person?id=${props.id}`;
	return (
		<div style={borderStyle}>
			<h2><a href={principalHyperlink}>{props.name} - {props.category}</a></h2>
			{props.characters && props.characters.map((character) => (
				<Character
				key={character}
				character={character}	
				/>
			))}
			<h2>{props.id}</h2>
		</div>
	);
};

/* Movie data JSON format */
/* title 	- string
 * year 	- int
 * runtime	- int
 * genres	- array(string)
 * country 	- string
 * principals	- array(object) // Primary people associated with production
 * ratings	- array(object) // Independent critical ratings and their sources.
 * boxoffice 	- int
 * poster	- string 	 // Poster image hyperlink
 * plot		- string
 */

const Movie = (props) => {
	const [searchParams] = useSearchParams();
	const movieID = searchParams.get("id")

	const [movie, setMovie] = useState({});

	useEffect(() => {
		// Only query API if 'movie' is unpopulated.
		if (Object.entries(movie).length === 0) {
			apiFetch(`/movies/data/${movieID}`)
			.then(response => response.json())
			.then(movieData => {
				setMovie(movieData);
				console.log(movieData);
			})
			.catch(err => {
				// TODO: Implement better error handling
				console.log("ERROR: Request timed out.");
			});

		}
	});

	return (
		<div>
			<Header />
			<h1>{movie.title}</h1>
			<h1>{movie.year}</h1>
			<h1>{movie.runtime}</h1>
		
			{movie.genres && movie.genres.map((genre) => (
				<h1>{genre}</h1>
			))}
			<h1>{movie.country}</h1>

			{/* Conditional Rendering */}
			{movie.principals && movie.principals.map((principal) => (
				<Principal
					key={principal.category}
					category={principal.category}
					id={principal.id}
					name={principal.name}
				/>
			))}

			{movie.ratings && movie.ratings.map((rating) => (
				<Rating
					key={rating.source}
					source={rating.source}
					value={rating.value}
				/>
			))}

			<h1>{movie.boxoffice}</h1>
			<img src={movie.poster} />
			<h1>{movie.plot}</h1>
			<Footer />
		</div>
	);
};


export default Movie;
