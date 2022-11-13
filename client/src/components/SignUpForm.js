import { useState } from 'react';
import { Button, Col, Form, Row, Container, Alert } from "react-bootstrap";
import { default as UserLogin } from "../icons/user-login.svg";
import { default as Password } from "../icons/password.svg";
import '../App.css';

function MySignUpForm(props) {

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
    <>
      <Container>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Container className="login-border">
              <Row className="mb-5">
                <Col md={{ span: 10, offset: 2 }}>
                  <h2 className="login-title">Sign Up</h2>
                </Col>
              </Row>
              <Row>
                <Col >
                  <Form onSubmit={handleSubmit}>
                    {props.message && <Alert variant='danger' onClose={() => props.setMessage('')} dismissible>{props.message}</Alert>}
                    <Row>
                      <Col md={1}>
                        <img src={UserLogin} alt="user" />
                      </Col>
                      <Col md={11}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Control type="email" placeholder="Enter email address" value={email} onChange={ev => setEmail(ev.target.value)} />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={1}>
                        <img src={Password} alt="password" className='me-2 svg login' />
                      </Col>
                      <Col md={11}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Control type="password" placeholder="Enter password" value={password} onChange={ev => setPassword(ev.target.value)} />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={1}>
                        <img src={Password} alt="password" className='me-2 svg login' />
                      </Col>
                      <Col md={11}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Control type="password" placeholder="Reenter password" value={passwordReenter} onChange={ev => setPasswordReenter(ev.target.value)} />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={1}>
                        <img src={UserLogin} alt="access-right" className='me-2 svg login' />
                      </Col>
                      <Col md={11}>
                        <select value={accessRight} onChange={ev => setAccessRight(ev.target.value)}>
                        <option value="hiker">Hiker</option>
                          <option value="friend">Friend</option>
                          <option value="local-guide">Local guide</option>
                          <option value="platform-manager">Platform manager</option>
                          <option value="hut-worker">Hut worker</option>
                          <option value="emergency-operator">Emergency operator</option>
                        </select>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col md={{ span: 4, offset: 4 }}>
                        <Button variant="primary" type="submit" > Submit </Button>
                      </Col>
                    </Row>

                  </Form>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>

    </>
  );
}

export default MySignUpForm;