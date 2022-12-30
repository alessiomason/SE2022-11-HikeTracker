import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function OpenPageOnTop(props) {
	const location = useLocation();
	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'auto'
		});
	}, [location]);

	return <>{props.children}</>
};

// de-comment to revert behaviour of App to normal
/* const OpenPageOnTop = (props) => {
	return (<>{props.children}</>);
} */

export default OpenPageOnTop;