import { Container } from "react-bootstrap";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../API";

function VerifyEmailPage() {
	const [verified, setVerified] = useState(false);

	const search = useLocation().search;
	const token = new URLSearchParams(search).get('token');
	if (!verified && token) {
		API.verifyEmail(token)
			.then(() => setVerified(true))
			.catch(err => console.log(err))
	}

	return (<> {verified ? <EmailAlreadyVerified /> : <EmailToBeVerified />} </>);
}

function EmailToBeVerified() {
	return (
		<Container>
			<h1>Verify email</h1>
			<h3>Please click on the link in the email you received to verify your account.</h3>
		</Container>
	);
}

function EmailAlreadyVerified() {
	return (
		<Container>
			<h1>Email verified</h1>
			<h3>Login</h3>
		</Container>
	);
}

export default VerifyEmailPage;