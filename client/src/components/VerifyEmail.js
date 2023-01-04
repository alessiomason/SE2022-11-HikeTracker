import { Container, Button } from "react-bootstrap";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../API";
import "./../styles/VerifyEmail.css";

function VerifyEmailPage(props) {
    const [verified, setVerified] = useState(false);

    const search = useLocation().search;
    const token = new URLSearchParams(search).get('token');
    if (!verified && token) {
        API.verifyEmail(token)
            .then(() => setVerified(true))
            .catch(err => console.log(err))
    }

    return (<> {verified ? <EmailAlreadyVerified setShowLogin={props.setShowLogin} /> : <EmailToBeVerified />} </>);
}

function EmailToBeVerified() {
    const navigate = useNavigate();

    return (
        <Container>
            <h1 className="verify-email-title">Verify email</h1>
            <h3 className="verify-email-message">Please click on the link in the email you received to verify your account.</h3>
            <div className="d-flex justify-content-center">
                <Button className="verify-email-btn" onClick={() => navigate('/')}>Go back to home page</Button>
            </div>
        </Container>
    );
}

function EmailAlreadyVerified(props) {
    const navigate = useNavigate();

    return (
        <Container>
            <h1 className="verify-email-title">Email verified</h1>
            <h3 className="verify-email-message">You have successfully verified your email!</h3>
            <h4>Please head over to the home page and login to continue.</h4>
            <div className="d-flex justify-content-center">
                <Button className="verify-email-btn" onClick={() => { props.setShowLogin(true); navigate('/'); }}>Login</Button>
            </div>
        </Container>
    );
}

export default VerifyEmailPage;