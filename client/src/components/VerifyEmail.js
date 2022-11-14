import { Container, Button } from "react-bootstrap";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../API";
import "./../styles/VerifyEmail.css";

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
			<h1 className="verify-email-title">Verify email</h1>
			<h3 className="verify-email-message">Please click on the link in the email you received to verify your account.</h3>
		</Container>
	);
}

function EmailAlreadyVerified() {
	const navigate = useNavigate();

	return (
		<Container>
			<h1 className="verify-email-title">Email verified</h1>
			<h3 className="verify-email-message">You have successfully verified your email! Please head over to the login page to continue.</h3>
			<Button className="verify-email-message" onClick={() => navigate('/login')}>Login</Button>
		</Container>
	);
}

export default VerifyEmailPage;