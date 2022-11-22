import React, { useState, useEffect } from 'react';
import { Row, Container, Button } from "react-bootstrap";
import SingleHikeCard from './SingleHikeCard';
import { default as Arrow } from "../icons/arrow.svg";
import API from '../API.js';
import '../styles/Cards.css';

function HikesCards(props) {

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
      <Row className='mb-3 box_centered'>
        {hikes.map(h => <SingleHikeCard key={h.id} hike={h} user={props.user} />)}
      </Row>
      <Row className="box_centered">
        <Button variant="primary" className="btn_show my-3" >
          Show more <img className="ms-2 " src={Arrow} alt="arrow_image" />
        </Button>
      </Row>
    </Container>

  );
}

export default HikesCards;