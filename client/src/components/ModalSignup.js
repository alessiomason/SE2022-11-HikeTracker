import { useState } from 'react';
import { Button, Col, Form, Row, Container, Alert, Modal } from "react-bootstrap";
import { default as UserLogin } from "../icons/user-login.svg";
import { default as Password } from "../icons/password.svg";
import { default as UserKind } from "../icons/user_kind.svg";
import '../App.css';

function MyModalSignup(props) {

  function validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordReenter, setPasswordReenter] = useState('');
  const [accessRight, setAccessRight] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    let valid = true;
    props.setMessage('');
    const credentials = { email, password, accessRight };

    if (email.trim() === '') {
      valid = false;
      props.setMessage('Email cannot be empty or contain whitespaces.');
    }

    if (valid && password.trim() === '') {
      valid = false;
      props.setMessage('Password cannot be empty or contain whitespaces.');
    }

    if (valid && passwordReenter !== password) {
      valid = false;
      props.setMessage('Passwords do not match.');
    }

    if (valid && !validateEmail(email)) {
      valid = false;
      props.setMessage('Invalid email.');
    }

    if (valid)
      props.doSignUp(credentials);
  };

  return (

    <Modal className="mt-3 me-5 " show={props.showSignup} onHide={() => props.setShowSignup(false)}>
      <Container fluid className="me-5">
        <Row>
          <h1 className='my-5' >Sign Up</h1>
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
              <Row className='my-4 box_center'>
                <Col md="auto" sm="auto" xs="auto" className='box_center'>
                  <img src={Password} alt="password" />
                </Col>
                <Col md="auto" sm="auto" xs="auto">
                  <Form.Group controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Reenter password" value={passwordReenter} onChange={ev => setPasswordReenter(ev.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
              <Row className='mb-3 box_center'>
                <Col md="auto" sm="auto" xs="auto" className='box_center'>
                  <img src={UserKind} alt="user" />
                </Col>
                <Col md="auto" sm="auto" xs="auto">
                  <Form.Select aria-label="Default select example" value={accessRight} onChange={ev => setAccessRight(ev.target.value)}>
                    <option value="hiker">Hiker</option>
                    <option value="local-guide">Local guide</option>
                    <option value="platform-manager">Platform manager</option>
                    <option value="hut-worker">Hut worker</option>
                    <option value="emergency-operator">Emergency operator</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row className="my-5 box_center">
                <Button variant="primary login_btn" type="submit" > Sign Up </Button>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </Modal>

  );
}

export default MyModalSignup;