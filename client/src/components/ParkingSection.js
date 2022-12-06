
import '../styles/ParkingSection.css';

import { Container, Row, Col, Button, ButtonGroup, ButtonToolbar, OverlayTrigger, Tooltip, Overlay } from "react-bootstrap";
import { default as Parking } from '../icons/parking.svg';
import { default as arrowRight } from '../icons/arrow-next-park.svg';
import { default as arrowLeft } from '../icons/arrow-prev-park.svg';
import { default as Delete } from '../icons/delete.svg';
import { FaSearch } from "react-icons/fa";
import { FaParking } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";
import { ImPriceTag } from "react-icons/im";


import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { default as image3 } from "../images/image3.jpg";

function MyParkingSection() {


  return (
    <>
      <Container fluid className="parkingSection" id="parkSec">
        <Row>
          <h2 className="background double parking-title"><span><img src={Parking} alt="hut_image" className='me-2 hike-img' />PARKINGS</span></h2>
        </Row>
      </Container>
      <Container fluid className="parkingCardSection">
        <Row>
          <Card />
        </Row>
      </Container>
    </>
  );

}

function Card() {

  function SampleNextArrow(props) {
    const { onClick } = props;
    return (
      <img src={arrowRight} alt="hut_image" className='arrow-next' onClick={onClick} />
    );
  }

  function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
      <img src={arrowLeft} alt="hut_image" className='arrow-prev' onClick={onClick} />
    );
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1120,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 720,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="hutCardBox">
      <Slider {...settings}>
        {huts.map((item) => (
          <div className="parking-card" key={item.id}>
            <div className="card-top">
              <img src={image3} alt={item.title} className="card-top-img-park" />
            </div>
            <div className="card-bottom-park">
              <div>
                <h1 className="hut-card-title-park">{item.title}</h1>
              </div>
              <Row >
                <Col md={12} lg={12} xl={12} xxl={6} className="mb-1">
                  <FaLocationArrow className="card-symbol-park me-3" /><h6 className="card-details">{item.location}</h6>
                </Col>
              </Row>
              <Row>
                <Col md={12} lg={6} sm={12} className="mb-1" >
                  <ImPriceTag className="card-symbol-park me-3" /> <h6 className="card-details">{item.price}</h6>
                </Col>
                <Col md={12} lg={6} sm={12} className="mb-1">
                  <FaParking className="card-symbol-park me-3" /> <h6 className="card-details">{item.parkingNumb}</h6>
                </Col>
              </Row>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

const huts = [
  {
    id: 1,
    title: 'Parking bianca',
    location: 'Garessio, Cuneo',
    price: '10$',
    parkingNumb: '150',
  },
  {
    id: 2,
    title: 'Parking nera',
    location: 'politecnico',
    price: '10$',
    parkingNumb: '150',
  },
  {
    id: 3,
    title: 'Parking corta',
    location: 'politecnico',
    price: '10$',
    parkingNumb: '150',
  },
  {
    id: 4,
    title: 'Parking lunga',
    location: 'politecnico',
    price: '10$',
    parkingNumb: '150',
  },
  {
    id: 5,
    title: 'Parking bella',
    location: 'politecnico',
    price: '10$',
    parkingNumb: '150',
  },
  {
    id: 6,
    title: 'Parking brutta',
    location: 'politecnico',
    price: '10$',
    parkingNumb: '150',
  },
  {
    id: 7,
    title: 'Parking alta',
    location: 'politecnico',
    price: '10$',
    parkingNumb: '150',
  },
  {
    id: 8,
    title: 'Parking bassa',
    location: 'politecnico',
    price: '10$',
    parkingNumb: '150',
  },
];

export default MyParkingSection;