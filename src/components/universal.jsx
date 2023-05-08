import React, { useState, setState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { Button, Input, Select } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from "@mui/styles";
import Link from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import MenuItem from  "@mui/material/MenuItem";
import InputLabel from  "@mui/material/InputLabel";
import FormControl from  "@mui/material/FormControl";
import FormGroup from  "@mui/material/FormGroup";
import Typography from  "@mui/material/Typography";
import Toolbar from  "@mui/material/Toolbar";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';


const useStyles = makeStyles((theme) => ({
		/* Header Styling */
		title: {
			flexGrow: 1
		},

		searchBar: {
			minWidth: 500
		},

		selectDropdown: {
			minWidth: 100,
			minHeight: 50,
			maxHeight: 50,
		},

		submitButton: {
			minHeight: 50,
			maxHeight: 50,
		},

		start: {
			display: "flex",
			justifyContent: "flex-start",
			alignItems: "flex-start"
		},

		center: {
			display: "flex",
			// flexGrow: 1,
			justifyContent: "center",
			alignItems: "center",
		},

		end: {
			display: "flex",
			flexGrow: 1,
			justifyContent: "flex-end",
			alignItems: "flex-end"
		},

		
		/* Footer Styling */
		footer: {
			spacing: 0,
			direction: "column",
			alignItems: "center",
			justifyContent: "center",
			paddingTop: 150,
			bottom: 10,
			left: "50%",
			marginLeft: -100,
		},
	}));




const UserMenu = (props) => {
	const userName = localStorage.getItem("userName");
	const signedIn = userName !== null;


	if (signedIn) {
		return (
			<div>
				<a>{userName}{', '} 
				<Link color="inherit" href="/user?mode=logout" {...props}>Logout</Link>
				</a>
			</div>
		);
	}

	return (
		<Box  {...props}>
			<Link color="inherit" href="/user?mode=login">Login</Link>
			<a>/</a>
			<Link color="inherit" href="/user?mode=register">Register</Link>
		</Box>
	);
};

export function Header(props) {
	const [movieTitle, setMovieTitle] = useState('');
	const [movieYear, setMovieYear] = useState('');

	const navigate = useNavigate();
	const classes = useStyles();
	const theme = createTheme({
		components: {

		}
	});

	const handleSearchSubmit = (event) => {
		event.preventDefault();
		
		let url = `/`;
		if (movieTitle !== '') {
			url += `?title=${movieTitle}`;
		}
		if (movieYear !== '') {
			// If 'title' parameter is specified first
			if (url.length > 1) {
				url += `&year=${movieYear}`;
			} else {
				url += `?year=${movieYear}`;
			}
		}

		navigate(url);
		window.location.reload();
	};

	const movieTitleChange = (event) => {
		setMovieTitle(event.target.value);
	};

	const movieYearChange = (event) => {
		setMovieYear(event.target.value);
	};

	// Populate year selection dropdown menu.
	const minYear = 1990, maxYear = 2023;
	let dropdownItems = [];
	for (let i=minYear; i<=maxYear; i++) {
		dropdownItems.push({name: `${i}`, value: i});
	}

	return (
		<ThemeProvider theme={theme}>
			<AppBar position="sticky">
				<Toolbar>
					<Box className={classes.start}>
						<IconButton edge="start" color="inherit" onClick={() => {navigate('/');window.location.reload()}}>MovieSearch</IconButton>
					</Box>
					
					<Box className={classes.center}>
						<FormControl sx={{ marginLeft: 1, marginRight: 1 }}>
							<InputLabel sx={{color: "white"}}>Title...</InputLabel>
							<Input
								sx={{
									color: "white"
								}}
								className={classes.searchBar}
								id="title-input"
								value={movieTitle}
								onChange={movieTitleChange}
							/>
						</FormControl>

						<FormControl sx={{ marginLeft: 1, marginRight: 1 }}>
							<InputLabel sx={{color: "white"}} htmlFor="year-dropdown" id="year-dropdown-label">Year</InputLabel>
							<Select
								sx={{
									color: "white"
								}}
								label="Year"
								className={classes.selectDropdown}
								value={movieYear}
								onChange={movieYearChange}
							>
								<MenuItem key={0} value="">None</MenuItem>
								{dropdownItems.map((item) => (
									<MenuItem 
										key={item.value}
										value={item.value}
									>{item.name}</MenuItem>
								))}
							</Select>
						</FormControl>
						<Button sx={{ marginLeft: 1, marginRight: 1 }} color="inherit" variant="outlined" className={classes.submitButton} onClick={handleSearchSubmit} endIcon={<SearchIcon />}>Search</Button>
					</Box>

					<Box className={classes.end}>
						<UserMenu/>
					</Box>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export function Footer(props) {
	const classes = useStyles();

	return (
		<div className={classes.footer}>
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			Data taken from IMDb, Metacritic, and RottenTomatoes.
		</Typography>
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'© MovieSearch - Lindsay Fry '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
    </div>
  );
}