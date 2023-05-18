import { useSearchParams } from "react-router-dom";
import { Header, Footer } from "../components/universal";
import ErrorPopup from "../components/ErrorPopup";
import Box from  "@mui/material/Box";

const errorCodes = {
	"400": "Bad request.",
	"401": "Unauthorised.",
	"404": "Page not found.",
	"403": "Access denied.",
	"408": "Request timed out.",
	"418": "I'm a teapot.",
}

const Error = (props) => {
	const [searchParams] = useSearchParams();
	// const [errorMessage, setErrorMessage] = useState("");
	let errorMessage = "";

	let errorCode = searchParams.get("code");
	if (errorCode === null || errorCode === "") {
		if (props.errorCode) {
			errorCode = props.errorCode;
		} else {
			// Placeholder error code: "I'm a teapot."
			errorCode = "418";
		}
	}

	return (
		<div>
			<Header />
			{/*<h1>ERROR: {errorCode}</h1>*/}
			<Box sx={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 2}}>
				<ErrorPopup width="100%" variant="h5" value={errorCode} message={errorCodes[errorCode]}/>
			</Box>
			<Footer />
		</div>
	);
};

export default Error;
