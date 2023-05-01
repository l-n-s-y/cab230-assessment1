const API_URL = "http://sefdb02.qut.edu.au:3000";

export function apiFetch(endpoint,authToken=null) {
	if (authToken) {
		const bearerHeader = `Bearer ${authToken}`;
		return fetch(API_URL+endpoint, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Authorization': bearerHeader
			}
		});
	}

	return fetch(API_URL+endpoint);
	
}

export function apiPost(endpoint,data) {
	return fetch(API_URL+endpoint, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: data
	});
}

export function hasTokenExpired(tokenExpiry,issuedAt) {
	let currentTime = Date.now()/1000;

	if (currentTime-issuedAt >= tokenExpiry) {
		return true;
	}

	return false;
}

export function storeTokens(bearerToken, refreshToken) {
	// Store auth tokens
	console.log(localStorage.getItem("bearerToken"));
	localStorage.setItem("bearerToken",bearerToken.token);
	console.log(localStorage.getItem("bearerToken"));
	localStorage.setItem("refreshToken",refreshToken.token);

	// Store auth time (for expiration calculation)
	localStorage.setItem("issuedAt",Date.now()/1000);

	// Store token expirations
	localStorage.setItem("bearerExp",bearerToken.expires_in);
	localStorage.setItem("refreshExp",refreshToken.expires_in);
}

function clearUserCache() {
	localStorage.setItem("bearerToken",null);
	localStorage.setItem("refreshToken",null);

	localStorage.setItem("issuedAt",null);

	localStorage.setItem("bearerExp",null);
	localStorage.setItem("refreshExp",null);

	localStorage.setItem("userName",null);
}

export function refreshTokens() {
	console.log("DEBUG: Refreshing tokens.");
	const rToken = localStorage.getItem("refreshToken");

	/*const issuedAt = localStorage.getItem("issuedAt");
	const rExp = localStorage.getItem("refreshExp");
	const bExp = localStorage.getItem("bearerExp");

	console.log(rExp);
	console.log(issuedAt);
	console.log(Date.now()/1000);
	console.log(Number(rExp)+Number(issuedAt));

	console.log(hasTokenExpired(rExp,issuedAt));
	console.log(hasTokenExpired(bExp,issuedAt));*/

	if (rToken) {
		const tokenContent = JSON.stringify({refreshToken: rToken});
		apiPost("/user/refresh",tokenContent)
		.then(response => response.json())
		.then(response => {
			if (response.error) {
				console.log(`ERROR: Failed to refresh tokens\nServer error: ${response.message}`);
				clearUserCache();
				// User must sign in again.
				//navigate("/user?mode=login");
				return false;
			} else {
				// Store auth tokens
				storeTokens(response.bearerToken,response.refreshToken);
				console.log("DEBUG: Tokens refreshed.");
			}
		})
		.catch(err => {
			console.log(`ERROR: Failed to refresh tokens\nRequest error: ${err}`);
			return false;
		});

		return true;
	}

	return false;
}
