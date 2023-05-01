import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Link } from "react-router-dom";

import App from './App';

const UserMenu = (props) => {
	const userName = localStorage.getItem("userName");
	const signedIn = userName !== null;

	if (signedIn) {
		return (
			<div>
				<a>{userName}, </a>
				<Link to="/user?mode=logout">Logout</Link>
			</div>
		);
	}

	return (
		<div>
			<Link to="/user?mode=login">Login</Link>
			<a>/</a>
			<Link to="/user?mode=register">Register</Link>
		</div>
	);
};

export function Header(props) {
	return (
		<div className="Header">
			<Link to="/">Home</Link>
			<input />
			<UserMenu />
		</div>
	);
}

export function Footer(props) {
	return (
		<h3>2023 (c) Lindsay Fry</h3>
	);
}

const test="hello";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<App />
);

