import React from 'react';
import '../styles/Cards.css';
import { Col, Row, Card, Container, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { default as Img1 } from "../images/img1.jpg";
import { default as Img2 } from "../images/img2.jpg";
import { default as Img3 } from "../images/img3.jpg";
import { default as Arrow } from "../icons/arrow.svg";

function Cards() {

  return (

    <Container fluid className="cards p-5">
      <Row className='mb-3'>
        <Col xl={4} lg="auto" md="auto" sm="auto" xs="auto" >
          <Card className="card mb-2 mx-1">
            <Link className='card_text'>
              <div className='overflow'>
                <Card.Img variant="top" src={Img1} className="card_img" />
              </div>
              <Card.Body>
                <Card.Title >Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
              </Card.Body>
            </Link>
          </Card>
        </Col>
        <Col xl={4} lg="auto" md="auto" sm="auto" xs="auto">
          <Card className="card mb-2 mx-1">
            <Link className='card_text'>
              <div className='overflow'>
                <Card.Img variant="top" src={Img2} className="card_img" />
              </div>
              <Card.Body>
                <Card.Title >Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
              </Card.Body>
            </Link>
          </Card>
        </Col>
        <Col xl={4} lg="auto" md="auto" sm="auto" xs="auto">
          <Card className="card mb-2 mx-1">
            <Link className='card_text'>
              <div className='overflow'>
                <Card.Img variant="top" src={Img3} className="card_img" />
              </div>
              <Card.Body>
                <Card.Title >Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the
                  bulk of the card's content.
                </Card.Text>
              </Card.Body>
            </Link>
          </Card>
        </Col>
      </Row>
      
      <Row className="show_more">
        <Button variant="success" className="btn_show_more">
          Show more
          <img className="ms-2 " src={Arrow} alt="arrow_image" />
        </Button>
      </Row>
    </Container>

  );
}

export default Cards;
