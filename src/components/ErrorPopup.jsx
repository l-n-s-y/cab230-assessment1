import { makeStyles } from "@mui/styles";
import Box from  "@mui/material/Box";
import Typography from  "@mui/material/Typography";

const ErrorPopup = (props) => {
	let errorSize = {"x":"25","y":"50"};

	if (props.width) {
		errorSize["x"] = props.width;
	}

	if (props.height) {
		errorSize["y"] = props.height;
	}

	return (
		<Box sx={{display: "flex", justifyContent: "center"}}>
			<Box sx={{width: errorSize.x, height: errorSize.y, display: "flex", justifyContent: "center", flexDirection: "column", color: "white", bgcolor: "#FF9F9F", border: "5px solid red", borderRadius: 3, paddingLeft: 5, paddingRight: 5}}>
				{props.value && <Typography variant="h6" sx={{display: "flex", justifyContent: "center", fontSize: "200%"}}>ERROR: {props.value}</Typography>}
				<Typography variant="h6" sx={{display: "flex", justifyContent: "center", fontSize: "150%"}}>{props.message}</Typography>
			</Box>
		</Box>
	);
};

export default ErrorPopup;