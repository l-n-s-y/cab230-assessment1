import React, { useState, setState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// App
import App from "./App";

// Custom Components
import { UserMenu, Header, Footer } from "./components/universal";

// Default Pages
import Movie from "./pages/Movie";
import Person from "./pages/Person";
import User from "./pages/User";

// Error handling
import Error from "./pages/Error";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<div>
		<BrowserRouter>
			<Routes>
				<Route path='*' element={<Error errorCode="404" />} />
				<Route path="/" element={<App />} /> 
				<Route path="/movie" element={<Movie />} />
				<Route path="/person" element={<Person />} />
				<Route path="/user" element={<User />} />
				<Route path="/error" element={<Error />} />
			</Routes>
		</BrowserRouter>
	</div>
);