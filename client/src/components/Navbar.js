import { useNavigate } from "react-router-dom";
import { Button, Navbar, Nav, Container } from "react-bootstrap";
import { default as Logo } from "../icons/logo.svg";
import { default as User } from '../icons/user.svg';
import '../styles/Navbar.css';

function MyNavbar(props) {

  const navigate = useNavigate();

  return (

    <Navbar collapseOnSelect expand="lg" fixed="top" bg="dark" variant="dark">
      <Container fluid >
        <Navbar.Brand type="button" onClick={() => navigate("/")}>
          <img src={Logo} alt="logo" />
        </Navbar.Brand>
        <Navbar.Brand >
          <h3 onClick={() => navigate("/")} className="logo-name">HikeTracker</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          </Nav>
          <Nav>
            {(!props.loggedIn) ?
              <Nav>
                <Button variant="light" className="mx-2 my-1" onClick={() => props.setShowLogin(true)}>Sign In</Button>
                <Button variant="primary" className="mx-2 my-1" onClick={() => props.setShowSignup(true)}>Sign Up</Button>
              </Nav> :
              <Nav>
                {props.user.access_right === 'local-guide' ? <Button variant="outline-warning"  className="mx-2 my-2  btn--outline" onClick={() => navigate("/hikeManager")}> Manage Hike</Button> : false}
                {props.user.access_right === 'local-guide' ? <Button variant="outline-warning"  className="mx-2 my-2 btn--outline" onClick={() => navigate("/hutManager")}> Manage Hut</Button> : false}
                {props.user.access_right === 'local-guide' ? <Button variant="outline-warning"  className="mx-2 my-2  btn--outline" onClick={() => navigate("/parkingManager")}> Manage Parking</Button> : false}
                <Button variant="outline-success" className="mx-2 my-1 btn--outline" onClick={props.doLogout}><img src={User} alt="user_image" /> Logout</Button>
              </Nav>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
}

export default MyNavbar;
