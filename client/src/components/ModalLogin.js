import { useState } from 'react';
import { Button, Col, Modal, Form, Row, Container, Alert } from "react-bootstrap";
import { default as UserLogin } from "../icons/user-login.svg";
import { default as Password } from "../icons/password.svg";
import '../styles/SignInSignUp.css';


function MyModalLogin(props) {

  function validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const [email, setEmail] = useState('hiker@p.it');
  const [password, setPassword] = useState('password');

  const handleSubmit = (event) => {
    event.preventDefault();
    let valid = true;
    props.setMessage('');
    const credentials = { email, password };

    if (email.trim() === '') {
      valid = false;
      props.setMessage('Email cannot be empty or contain only spaces.');
    }

    if (valid && password.trim() === '') {
      valid = false;
      props.setMessage('Password cannot be empty or contain only spaces.');
    }

    if (valid && !validateEmail(email)) {
      valid = false;
      props.setMessage('Email not valid.');
    }

    if (valid)
      props.doLogin(credentials);
  };

  return (

    <Modal className="mt-3 me-5 " show={props.showLogin} onHide={() => props.setShowLogin(false)}>
      <Container fluid className="me-5 box-login">
        <Row>
          <h1 className='my-5' >Sign In</h1>
        </Row>
        <Row>
          <Col md={12}>
            {(props.showEmailAlert) &&
              <Alert className="mx-3" variant="success" onClose={() => props.setShowEmailAlert(false)}>
                <Alert.Heading>Verify email</Alert.Heading>
                <p> Please click on the link in the email you received to verify your account. </p>
              </Alert>
            }
          </Col>
        </Row>
        <Row>
          <Col >
            <Form onSubmit={handleSubmit}>
              {props.message && <Alert variant='danger' onClose={() => props.setMessage('')} dismissible>{props.message}</Alert>}
              <Row className='mb-3 box_center'>
                <Col md="auto" sm="auto" xs="auto" className='box_center'>
                  <img src={UserLogin} alt="user" />
                </Col>
                <Col md="auto" sm="auto" xs="auto">
                  <Form.Group controlId="formBasicEmail" autoFocus>
                    <Form.Control type="email" placeholder="Enter email address" value={email} onChange={ev => setEmail(ev.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={12}>
              </Col>
              </Row>
              <Row className='my-4 box_center'>
                <Col md="auto" sm="auto" xs="auto" className='box_center'>
                  <img src={Password} alt="password" />
                </Col>
                <Col md="auto" sm="auto" xs="auto">
                  <Form.Group controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Enter password" value={password} onChange={ev => setPassword(ev.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="my-5 box_center">
                <Button variant="primary login_btn slide" type="submit" > Sign In </Button>
              </Row>
            </Form>
          </Col>
        </Row>
        <Row className='end-signup align'>
          <p className='p-sign'>Don't have an account?</p>
          <h6 className='h6-sign-in' onClick={() => {props.setShowSignup(true);props.setShowLogin(false)}}> Sign Up</h6>
        </Row>
      </Container>
    </Modal>

  );
}

export default MyModalLogin;