import { useSearchParams } from "react-router-dom";
import { Header, Footer } from "../index.js";

const Error = (props) => {
	const [searchParams] = useSearchParams();
	let errorCode = searchParams.get("code");
	if (errorCode === null || errorCode === "") {
		errorCode = "I AM A TEAPOT";
	}

	return (
		<div>
			<h1>ERROR: {errorCode}</h1>
		</div>
	);
};

export default Error;
