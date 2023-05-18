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
	console.log(tokenExpiry, issuedAt);
	let currentTime = Date.now()/1000;

	console.log(currentTime-issuedAt);
	if (currentTime-issuedAt >= tokenExpiry) {
		return true;
	}

	return false;
}

export function storeTokens(bearerToken, refreshToken) {
	// Store auth tokens
	localStorage.setItem("bearerToken",bearerToken.token);
	localStorage.setItem("refreshToken",refreshToken.token);

	// Store auth time (for expiration calculation)
	localStorage.setItem("issuedAt",Date.now()/1000);

	// Store token expirations
	localStorage.setItem("bearerExp",bearerToken.expires_in);
	localStorage.setItem("refreshExp",refreshToken.expires_in);
}

export function clearUserCache() {
	localStorage.clear();
}

export function refreshTokens() {
	const rToken = localStorage.getItem("refreshToken");
	const rExp = localStorage.getItem("refreshExp");

	if (hasTokenExpired(rExp,localStorage.getItem("issuedAt")) === true) {
		clearUserCache();
		return false;
	}

	if (rToken) {
		const tokenContent = JSON.stringify({refreshToken: rToken});
		apiPost("/user/refresh",tokenContent)
		.then(response => {
			// Rate limit exceeded. User may be abusing remote server.
			if (response.status === 429) {
				clearUserCache();
				return false;
			}
			return response.json();
		})
		.then(response => {
			console.log(response);
			if (response.error) {
				// User must sign in again.
				clearUserCache();
				return false;
			} else {
				// Store auth tokens
				storeTokens(response.bearerToken,response.refreshToken);

				// Refresh page to reload content with valid auth
				window.location.reload();
			}
		})
		.catch(err => {
			console.error("[API] Unanticipated Error: ", err);
			return false;
		});

		// Tokens were refreshed successfully.
		return true;
	}

	// No refresh token given
	return false;
}