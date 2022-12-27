import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Container, Alert, Modal } from "react-bootstrap";
import { default as UserLogin } from "../icons/user-login.svg";
import { default as Password } from "../icons/password.svg";
import { default as UserKind } from "../icons/user_kind.svg";
import { default as Hut } from "../icons/hut.svg";
import '../styles/SignInSignUp.css';
import { Navigate, useNavigate } from 'react-router-dom';

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

    <Modal className="mt-3 me-5 " show={props.showSignup} onHide={() => { props.setShowSignup(false); props.setShowEmailAlert(false) }}>
      <Container fluid className="me-5 box-signup">
        <Row>
          <h1 className='my-5' >Sign Up</h1>
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
              <Row className='mb-4 box_center'>
                <Col md="auto" sm="auto" xs="auto" className='box_center'>
                  <img src={UserKind} alt="user" />
                </Col>
                <Col md="auto" sm="auto" xs="auto">
                  <Form.Select aria-label="Default select example" value={accessRight} onChange={ev => setAccessRight(ev.target.value)} className="form-sel">
                    <option>- Choose a role -</option>
                    <option value="hiker">Hiker</option>
                    <option value="local-guide">Local guide</option>
                    {/*<option value="platform-manager">Platform manager</option>*/}
                    <option value="hut-worker">Hut worker</option>
                    {/*<option value="emergency-operator">Emergency operator</option>*/}
                  </Form.Select>
                </Col>
              </Row>
              {(accessRight == "hut-worker") ? <Row className='mb-3 box_center'>
                <Col md="auto" sm="auto" xs="auto" className='box_center fit'>
                  <img src={Hut} alt="hut" className='log-hut-icon' />
                </Col>
                <Col md="auto" sm="auto" xs="auto"> {/* it appear only when hut worker is selected */}
                  <Form.Select aria-label="Default select example" value={accessRight} onChange={ev => setAccessRight(ev.target.value)} className="form-sel">
                    <option>~ Choose an hut ~</option>
                    <option value="r1">Rifugio1</option>
                    <option value="r2">Rifugio2</option>
                    {/*<option value="platform-manager">Platform manager</option>*/}
                    <option value="r3">Rifugio3</option>
                    {/*<option value="emergency-operator">Emergency operator</option>*/}
                  </Form.Select>
                </Col>
              </Row> : false}

              <Row className="my-4 box_center">
                <Button variant="primary signup_btn" type="submit" > Sign Up </Button>
              </Row>
            </Form>
          </Col>
        </Row>
        <Row className='end-signup align'>
          <p className='p-sign'>Already have an account?</p>
          <h6 className='h6-sign' onClick={() => { props.setShowSignup(false); props.setShowLogin(true); props.setShowEmailAlert(false) }}> Sign In</h6>
        </Row>
      </Container>
    </Modal>

  );
}

export default MyModalSignup;