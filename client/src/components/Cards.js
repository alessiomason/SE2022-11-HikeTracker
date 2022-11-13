import React from 'react';
import '../styles/Cards.css';
import { Col, Row, Card, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { default as Img1 } from "../images/img1.jpg";
import { default as Img2 } from "../images/img2.jpg";
import { default as Img3 } from "../images/img3.jpg";
import { default as Arrow } from "../icons/arrow.svg";
import { useState, useEffect } from 'react';
import API from '../API.js';

function Cards(props) {
  const navigate = useNavigate();

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
      <Row className="add-new-hike">
        {props.user.access_right === 'local-guide' && <Button variant="danger" className="btn-add-new-hike" onClick={() => { navigate("/newHike"); }}>
          Add new hike
          <img className="ms-2 " src={Arrow} alt="arrow_image" />
        </Button>}
      </Row>

      <Row className='mb-3'>
        {hikes.map(h => <SingleCard key={h.id} hike={h} user={props.user} />)}
      </Row>
    </Container>

  );
}

function SingleCard(props) {
  const navigate = useNavigate();

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
            {props.user.access_right === 'local-guide' && <Button variant="danger" className="btn-add-new-hike" onClick={() => navigate("updateHike/" + props.hike.id)}>
              Edit hike {props.hike.id}
              <img className="ms-2 " src={Arrow} alt="arrow_image" />
            </Button>}
          </Card.Body>
        </Link>
      </Card>
    </Col>
  );
}

export default Cards;
