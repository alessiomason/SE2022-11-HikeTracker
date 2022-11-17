import { useState } from 'react';
import { Button, Col, Modal, Form, Row, Container, Alert } from "react-bootstrap";
import { default as UserLogin } from "../icons/user-login.svg";
import { default as Password } from "../icons/password.svg";
import '../App.css';

function MyModalLogin(props) {

  function validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const [email, setEmail] = useState('u3@p.it');
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

    <Modal className="mt-3 me-5" show={props.showLogin} onHide={() => props.setShowLogin(false)}>
      <Container fluid className="me-5">
        <Row>
          <h1 className='my-5' >Login</h1>
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
                <Button variant="primary login_btn" type="submit" > Login </Button>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </Modal>

  );
}

export default MyModalLogin;