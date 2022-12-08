import { Container, Col, Row } from 'react-bootstrap';
import '../styles/Footer.css';
import { Link } from "react-router-dom";

function Footer() {

  const scrollIntoViewWithOffset = (id, offset) => {
    const element = document.getElementById(id);
    const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({top: y, behavior: 'smooth'});
  }

  return (
    <footer className="site-footer">
    <Container fluid className='px-5'>
      <Row >
        <Col md={5} sm={12}>
          <h6>About</h6>
          <p className="text-justify"><i> HIKE TRACKER </i> is a web application created for the Software Engineering 2 course of the Computer Science Master's degree at the Turin Polytechnic.</p>
        </Col>
        <Col md={{span:3, offset:1}} xs={6} >
          <h6>Creators</h6>
          <p>Group 11</p>
          <ul >
            <li> Luca Rota, s303941</li>
            <li> Alessio Mason, s306017</li>
            <li> Salvatore Mallemaci, s303357</li>
            <li> Viola Mudu, s295156</li>
            <li> Eren Gul, s297978</li>
            <li> Islom Khoshimov, s301783</li>
          </ul>
        </Col>
        <Col md={3} xs={6} >
          <h6>Quick Links</h6>
          <ul >  
          <li><Link to="/" onClick={() => scrollIntoViewWithOffset("hikeSec", 40)}> Hikes </Link></li>
          <li><Link to="/"  onClick={() => scrollIntoViewWithOffset("hutSec", 40)}> Huts </Link></li>
          <li><Link to="/"  onClick={() => scrollIntoViewWithOffset("parkSec", 40)}> Parkings </Link></li>
          </ul>
        </Col>
      </Row>
      <hr/>
    </Container>
    <Container fluid className='px-4'>
      <Row className='center-box'>
        <p className="copyright-text">Copyright &copy; 2022 All Rights Reserved by <i>HIKETRACKER</i></p>
      </Row>
    </Container>
    </footer>
  );
}

export default Footer;
