import { useNavigate } from "react-router-dom";
import { Button, Navbar, Nav, Container } from "react-bootstrap";
import { default as Logo } from "../icons/logo.svg";
import { default as User } from '../icons/user.svg';
import '../styles/Navbar.css';
import React from 'react';


function MyNavbar(props) {

  const navigate = useNavigate();

  const scrollIntoViewWithOffset = (id, offset) => {
    const element = document.getElementById(id);
    const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({top: y, behavior: 'smooth'});
  }

  const goToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

  return (

    <Navbar collapseOnSelect expand="lg" fixed="top" bg="dark" variant="dark">
      <Container fluid >
        <Navbar.Brand type="button" onClick={() => {navigate("/");  goToTop()}}>
          <img src={Logo} alt="logo" />
        </Navbar.Brand>
        <Navbar.Brand >
          <h3 onClick={() => {navigate("/");  goToTop()}} className="logo-name">HikeTracker</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <button className="button type1" onClick={() => {navigate("/"); scrollIntoViewWithOffset("hikeSec", 40);}}>  HIKES</button>
            <button className="button type2" onClick={() => {navigate("/"); scrollIntoViewWithOffset("hutSec", 40)}}> HUTS</button>
            <button className="button type3" onClick={() => {navigate("/"); scrollIntoViewWithOffset("parkSec", 40)}}> PARKINGS </button>
          </Nav>
          <Nav>
            {(!props.loggedIn) ?
              <Nav>
                <Button className="mx-2 my-1 btn-log" onClick={() => {navigate("/");props.setShowLogin(true)}}>Sign In</Button>
                <Button className="mx-2 my-1 btn-sign" onClick={() => {navigate("/");props.setShowSignup(true)}}>Sign Up</Button>
              </Nav> :
              <Nav>
                <Button variant="outline-success" className="mx-2 my-1 btn-profile" onClick={() => {navigate("/profile")}}><img src={User} alt="user_image" className="me-2" /> YOUR PROFILE </Button>
              </Nav>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
}

export default MyNavbar;
