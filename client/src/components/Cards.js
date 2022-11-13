import React from 'react';
import '../styles/Cards.css';
import { Col, Row, Card, Container, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { default as Img1 } from "../images/img1.jpg";
import { default as Img2 } from "../images/img2.jpg";
import { default as Img3 } from "../images/img3.jpg";
import { default as Arrow } from "../icons/arrow.svg";
import { useState, useEffect } from 'react';
import API from '../API.js';

function Cards(props) {
  const [hikes, setHikes] = useState([]);
  const [dirty, setDirty] = useState(true);

  useEffect(() => {
    if (dirty) {
      API.getHikes()
        .then((hikes) => setHikes(hikes))
        .catch(err => console.log(err))
      setDirty(false);
    }
  }, [dirty]);

  return (

    <Container fluid className="cards p-5">
      <Row className='mb-3'>
        {hikes.map(h => <SingleCard hike={h} />)}
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

function SingleCard(props) {
  return (
    <Col xl={4} lg="auto" md="auto" sm="auto" xs="auto" >
      <Card className="card mb-2 mx-1">
        <Link className='card_text'>
          <div className='overflow'>
            <Card.Img variant="top" src={Img1} className="card_img" />
          </div>
          <Card.Body>
            <Card.Title>{props.hike.label}</Card.Title>
            {props.hike.length && <Card.Text>Length: {props.hike.length} m</Card.Text>}
            {props.hike.expTime && <Card.Text>Expected time: {props.hike.expTime} hours</Card.Text>}
            {props.hike.ascent && <Card.Text>Ascent: {Math.round(props.hike.ascent)} m</Card.Text>}
            {props.hike.difficulty && <Card.Text>Difficulty level: {props.hike.difficulty}</Card.Text>}
            {props.hike.description && <Card.Text>Description: {props.hike.description}</Card.Text>}
          </Card.Body>
        </Link>
      </Card>
    </Col>
  );
}

export default Cards;
