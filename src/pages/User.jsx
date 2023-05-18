import { useState, setState, useEffect } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

// Custom components
import { Header, Footer } from "../components/universal";
import ErrorPopup from "../components/ErrorPopup";

// Utility functions
import { apiPost, apiFetch, storeTokens, clearUserCache } from "../util/api";


function LoginForm(props) {
	const navigate = useNavigate();

	const [error, setError] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");
	
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const emailChange = (event) => {
		setEmail(event.target.value);
	};

	const passwordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		const loginData = JSON.stringify({email: email, password: password});

		apiPost("/user/login",loginData)
		.then(response => response.json())
		.then(response => {
			if (response.error || response.status === "error") {
				setErrorMessage(response.message);
			} else {
				storeTokens(response.bearerToken,response.refreshToken);

				// Store current username
				localStorage.setItem("userName",email);

				// Redirect to home
				if (props.redirect) {
					navigate(props.redirect);
				} else {
					navigate("/");
				}
			}
		})
		.catch(err => {
			console.error("[LOGIN] Unanticipated Error: ", err);
		});
	};

	return (
		<div>
			<Typography components="h1" variant="h5">Login</Typography>
				<TextField
					margin="normal"
					required
					fullWidth
					id="email"
					label="Email Address"
					name="email"
					autoComplete="email"
					autoFocus
					onChange={emailChange}
				/>
				
				<TextField
					margin="normal"
					required
					fullWidth
					name="password"
					label="Password"
					type="password"
					id="password"
					autoComplete="current-password" 
					onChange={passwordChange}
				/>

				{error && <ErrorPopup value={error} message={errorMessage} />}
				{(errorMessage !== "" && error === null) && <ErrorPopup message={errorMessage} />}

				<Button
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
					onClick={handleSubmit}
				>
					Sign In
				</Button>
		</div>
	);
};

function RegisterForm(props) {
	const navigate = useNavigate();

	const [error, setError] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");


	const emailChange = (event) => {
		setEmail(event.target.value);
	};

	const passwordChange = (event) => {
		setPassword(event.target.value);
	};

	const repeatPasswordChange = (event) => {
		setRepeatPassword(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (password !== repeatPassword) {
			setErrorMessage("Passwords do not match.");
			return;
		}

		const loginData = JSON.stringify({email: email, password: password});
		apiPost("/user/register",loginData)
		.then(response => response.json())
		.then(response => {
			if (response.error || response.status === "error") {
				setErrorMessage(response.message);
			} else {
				navigate("/user?mode=login");
			}
		})
		.catch(err => {
			console.error("[REGISTER] Unanticipated Error: ", err);
		});
	};

	return (
		<div>
			<Typography components="h1" variant="h5">Register</Typography>
				<TextField
					margin="normal"
					required
					fullWidth
					id="email"
					label="Email Address"
					name="email"
					autoComplete="email"
					autoFocus
					onChange={emailChange}
				/>
				
				<TextField
					margin="normal"
					required
					fullWidth
					name="password"
					label="Password"
					type="password"
					id="password"
					autoComplete="current-password"
					onChange={passwordChange}
				/>
				<TextField
					margin="normal"
					required
					fullWidth
					name="repeatPassword"
					label="Repeat Password"
					type="password"
					id="repeatPassword"
					onChange={repeatPasswordChange}
				/>
				{error && <ErrorPopup value={error} message={errorMessage} />}
				{(errorMessage !== "" && error === null) && <ErrorPopup message={errorMessage} />}
				<Button
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 1 }}
					onClick={handleSubmit}
				>
					Register
				</Button>
		</div>
	);
};

function LogoutForm(props) {
	const navigate = useNavigate();

	// Post refresh to /user/logout
	const refreshToken = localStorage.getItem("refreshToken");
	const tokenData = JSON.stringify({refreshToken: refreshToken});
	apiPost("/user/logout",tokenData)
	.then(response => response.json())
	.then(response => {
		if (response.error || response.status === "error") {
			alert(`${response.message}`);
		}
	})
	.catch(err => {
		console.error("[LOGOUT] Unanticipated Error: ", err);
	})

	// Clear tokens and other.
	clearUserCache();

	return (
		<Navigate to="/" />
	);
}


const User = (props) => {
	const [searchParams] = useSearchParams();
	const userMode = searchParams.get("mode");
	const toRedirect = searchParams.get("redirect");

	const navigate = useNavigate();

	const validModes = {"login":LoginForm,"register":RegisterForm,"logout":LogoutForm};

	if (userMode === null || validModes[userMode] === undefined) {
		return (<Navigate to="/error?code=404" />);
	}


	let CurrentForm = () => { return <></>; };
	const currentMode = validModes[userMode.toLowerCase()];
	if (currentMode !== undefined) {
		CurrentForm = currentMode;
	} else {
		return (<Navigate to="/error?code=404" />);
	}
		
	return (
		<div>
			<Header />
			<Container component="main" maxWidth="xs">
				<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}
				>
					<CurrentForm redirect={toRedirect}/>
				</Box>
			</Container>
			<Footer />
		</div>
	);
};

export default User;
