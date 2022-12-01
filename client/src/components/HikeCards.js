import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Button } from "react-bootstrap";
import SingleHikeCard from './SingleHikeCard';
import { default as Arrow } from "../icons/arrow-down.svg";
import API from '../API.js';
import '../styles/Cards.css';

function HikesCards(props) {

  // const [hikes, setHikes] = useState([]);
  // const [dirty, setDirty] = useState(true);


  // useEffect(() => {
  //   if (dirty) {
  //     API.getHikes()
  //       .then((hikes) => setHikes(hikes))
  //       .catch(err => console.log(err))
  //     setDirty(false);
  //   }
  // }, [dirty]);


  return (

    <Container fluid className="cards p-5">
      <Row className='mb-3 box_centered'>
        {props.hikes.map(h => {



          return (

            (props.minLength <= h.length && props.maxLength >= h.length && props.minTime <= h.expTime && props.maxTime >= h.expTime && props.minAscent <= h.ascent && props.maxAscent >= h.ascent && (props.difficulty == null || (props.difficulty != null && props.difficulty == h.difficulty)) && (props.startPoint == null || (props.startPoint !== null && props.startPoint == h.id)) && (props.endPoint == null || (props.endPoint !== null && props.endPoint == h.id)) && (props.refPoint == null || (props.refPoint !== null && props.refPoint == h.id)) && (props.municipality == null || (props.municipality !== null && props.municipality == h.municipality)) && (props.province == null || (props.province !== null && props.province == h.province))) ?
              <Col xl={4} lg="auto" md="auto" sm="auto" xs="auto" key={h.id} >
                <SingleHikeCard fromHikeCards key={h.id} hike={h} user={props.user} />
              </Col> : ""

          );

        })}
      </Row>
      {/*<Row className="box_centered">
        <Button variant="primary" className="btn_show my-3" >
          Show more <img className="ms-2 " src={Arrow} alt="arrow_image" />
        </Button>
      </Row>*/}
    </Container>

  );
}

export default HikesCards;