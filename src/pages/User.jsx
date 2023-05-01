import { useState, setState, useEffect } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";

import { Header, Footer } from "../index.js";
import { apiPost, apiFetch, storeTokens } from "../util/api";


function LoginForm(props) {
	const [credentials, setCredentials] = useState({});
	const navigate = useNavigate();

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setCredentials(values => ({...values, [name]: value}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("DEBUG: POSTing to /user/login");

		const loginData = JSON.stringify({email: credentials.email, password: credentials.password});

		apiPost("/user/login",loginData)
		.then(response => response.json())
		.then(response => {
			if (response.error) {
				// TODO: Alert user
				console.log(`ERROR: ${response.message}`);
			} else {
				storeTokens(response.bearerToken,response.refreshToken);

				// Store current username
				//localStorage.setItem("userName",credentials.email);
				

				console.log("DEBUG: Tokens saved.");

				// Redirect to home
				navigate("/");
			}
		})
		.catch(err => {
			//console.log(`ERROR: ${err}`);
			alert(`ERROR: ${err}`);
		});
	};

	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<label>Email:
					<input
					type="text"
					name="email"
					value={credentials.email || ""}
					onChange={handleChange}
					/>
				</label>
				<label>Password:
					<input 
					type="password"
					name="password"
					value={credentials.password || ""}
					onChange={handleChange}
					/>
				</label>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

function RegisterForm(props) {
	const [credentials, setCredentials] = useState({});

	const navigate = useNavigate();

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setCredentials(values => ({...values, [name]: value}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log("DEBUG: POSTing to /user/register");


		const loginData = JSON.stringify({email: credentials.email, password: credentials.password});
		apiPost("/user/register",loginData)
		.then(response => response.json())
		.then(response => {
			if (response.error) {
				// TODO: Alert user
				//console.log(`ERROR: ${response.message}`);
				console.log(`ERROR: ${response.message}`);
			} else {
				console.log(`User created successfully.`);

				// TODO: Swap to login page or just login straight away?
				navigate("/user?mode=login");
			}
		})
		.catch(err => {
			//console.log(`ERROR: ${err}`);
			console.log(`ERROR: ${err}`);
		});
	};

	return (
		<div>
			<h1>Register</h1>
			<form onSubmit={handleSubmit}>
				<label>Email:
					<input
					type="text"
					name="email"
					value={credentials.email || ""}
					onChange={handleChange}
					/>
				</label>
				<label>Password:
					<input
					type="password"
					name="password"
					value={credentials.password || ""}
					onChange={handleChange}
					/>
				</label>
				<button type="submit">Register</button>
			</form>
		</div>
	);
};

function LogoutForm() {
	return (
		<Navigate to="/" />
	);
}


const User = (props) => {
	const [searchParams] = useSearchParams();
	const userMode = searchParams.get("mode");
	
	//const navigate = useNavigate();

	const validModes = {"login":LoginForm,"register":RegisterForm,"logout":LogoutForm};

	let CurrentForm = () => { return <></>; };
	const currentMode = validModes[userMode.toLowerCase()];
	if (currentMode !== undefined) {
		CurrentForm = currentMode;
	} else {
		//navigate("/error?code=404");
		return (<Navigate to="/error?code=404" />);
	}
		
	return (
		<div>
			<Header />
				<CurrentForm />
			<Footer />
		</div>
	);
};

export default User;
