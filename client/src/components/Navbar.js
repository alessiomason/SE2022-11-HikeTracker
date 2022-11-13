import { useState } from 'react';
import '../styles/Navbar.css';
import { Button, Navbar, Nav, Container } from "react-bootstrap";
import { default as Logo} from "../icons/logo.svg";
import { default as User } from '../icons/user.svg';
import { useNavigate } from "react-router-dom";

function MyNavbar(props) {

  const navigate = useNavigate();
  const [loggedIn, setSetLoggedIn] = useState(false);

  return (

    <Navbar collapseOnSelect expand="lg" fixed="top" bg="dark" variant="dark">
      <Container fluid >
        <Navbar.Brand type="button" onClick={() => { navigate("/"); }}>
          <img src={Logo} alt="logo" />
        </Navbar.Brand>
        <Navbar.Brand >
          <h3 onClick={() => { navigate("/"); }}> HikeTracker</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          </Nav>
          <Nav>
            {/*
            <Nav.Link href="#f1" className="nav-links">Function1</Nav.Link>
            <Nav.Link href="#f2" className="nav-links">Function2</Nav.Link>
            <Nav.Link href="#f3" className="nav-links">Function3</Nav.Link>
            */}
            {(!loggedIn) ?
              <Nav>
                <Button variant="light" className="mx-2 my-1" onClick={() => { navigate("/login"); }}> Sign In </Button>
                <Button variant="primary" className="mx-2 my-1" onClick={() => { navigate("/signup"); }}> Sign Up </Button>
              </Nav> :
              <Nav>
                <Button variant="outline-success" className="mx-2 my-1 btn--outline">
                  <img src={User} alt="user_image" /> Profile
                </Button>
              </Nav>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
}

export default MyNavbar;
