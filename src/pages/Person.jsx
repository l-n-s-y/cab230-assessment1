import { useState, setState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { Header, Footer } from "../index.js";
import { apiFetch, refreshTokens, hasTokenExpired } from '../util/api';

const Character = (props) => {
	return (
		<h3>{props.character}</h3>
	);
};


/* Role data JSON format */
/* category	- string
 * characters	- array(string)
 * imdbRating	- float
 * movieId	- string
 * movieName	- string
 */

const Role = (props) => {
	return (
		<div>
		<h2>{props.movieName} - {props.imdbRating}</h2>
		{props.characters && props.characters.map((character) => (
			<Character
				key={character}
				character={character}
			/>
		))}
		</div>
	);
};


/* Person data JSON format */
/* birthYear	- int
 * deathYear	- int/null
 * name		- string
 * roles	- array(object)
 */

const Person = (props) => {
	const [searchParams] = useSearchParams();
	const personID = searchParams.get("id");

	const navigate = useNavigate();

	const [person, setPerson] = useState({});

	useEffect(() => {
		if (Object.entries(person).length === 0) {
			// Check token expiration period
			const bearerToken = localStorage.getItem("bearerToken");
			if (bearerToken === false) { 
				alert("Unauthorised. Please sign-in");
				navigate("/user?mode=login");
			}

			const bearerExpiry = localStorage.getItem("bearerExp");
			const issuedAt = localStorage.getItem("issuedAt");
			if (hasTokenExpired(bearerExpiry,issuedAt)) {
				// TODO: Attempt to refresh auth tokens
				if (refreshTokens() === false) {
					alert("Unauthorised. Please sign-in");
					navigate("/user?mode=login");
				} else {
					// Refresh page to reload content with valid auth
					//window.location.reload(false);
				}
			}

			apiFetch(`/people/${personID}`,bearerToken)
			.then(response => response.json())
			.then(personData => {
				if (personData.error) {
					console.log(personData.message);
					// Refresh auth or request sign in
					/*if (refreshTokens() === false) {
						alert("Unauthorised. Please sign in");
						navigate("/user?mode=login");
					}*/
				} else {
					setPerson(personData);
					console.log(personData);
				}
			})
			.catch(err => {
				console.log(`ERROR: Failed to fetch people\n${err}`);
			});
		}
	});

	return (
		<div>
			<Header />
			<h1>{person.name}</h1>
			// Conditional rendering
			{person.deathYear ? <h1>{person.birthYear} - {person.deathYear}</h1> : <h1>{person.birthYear}</h1>}
			{person.roles && person.roles.map((role) => (
				<Role
					key={role.movieName}
					category={role.category}
					characters={role.characters}
					imdbRating={role.imdbRating}
					movieId={role.movieId}
					movieName={role.movieName}
				/>
			))}
			<Footer />
		</div>
	);
};

export default Person;
export { Character };
