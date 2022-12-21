import React, { useState, useEffect } from 'react';
import '../styles/ParkingSection.css';
import { Container, Row, Col } from "react-bootstrap";
import { default as Parking } from '../icons/parking.svg';
import { default as arrowRight } from '../icons/arrow-next-park.svg';
import { default as arrowLeft } from '../icons/arrow-prev-park.svg';
import { FaParking } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";
import { FaMountain } from "react-icons/fa";
import { ImPriceTag } from "react-icons/im";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { default as image3 } from "../images/image3.jpg";
import API from './../API.js';

function MyParkingSection() {
  const [parkings, setParkings] = useState([]);
  const [dirty, setDirty] = useState(true);

  useEffect(() => {
    if (dirty) {
      API.getParkingLots()
        .then((parkings) => setParkings(parkings))
        .catch(err => console.log(err))
      setDirty(false);
    }
  }, [dirty]);

  return (
    <>
      <Container fluid className="parkingSection" id="parkSec">
        <Row>
          <h2 className="background double parking-title"><span><img src={Parking} alt="hut_image" className='me-2 park-img' />PARKINGS</span></h2>
        </Row>
      </Container>
      <Container fluid className="parkingCardSection">
        <Row>
          <ParkingCards parkings={parkings} />
        </Row>
      </Container>
    </>
  );

}

function ParkingCards(props) {

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
    infinite: props.parkings.length > 4,
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
          infinite: props.parkings.length > 3
        },
      },
      {
        breakpoint: 720,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: props.parkings.length > 2
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: props.parkings.length > 1
        },
      },
    ],
  };

  return (
    <div className="hutCardBox">
      <Slider {...settings}>
        {props.parkings.sort((a, b) => (a.id > b.id) ? 1 : -1).map((parking) => {
          let locationsArray = [];
          if (parking.municipality) locationsArray.push(parking.municipality);
          if (parking.province) locationsArray.push(parking.province);
          if (parking.region) locationsArray.push(parking.region);
          if (parking.state) locationsArray.push(parking.state);

          return (<div className="parking-card" key={parking.id}>
            <div className="card-top">
              <img src={`http://localhost:3001/images/parkingLot-${parking.id}.jpg`}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = image3;
                }} alt={parking.label} className="card-top-img-park" />
            </div>
            <div className="card-bottom-park">
              <div>
                <h1 className="hut-card-title-park">{parking.label}</h1>
              </div>
              <Row className="mb-2" >
                <Col xs={2}>
                  <FaLocationArrow className="card-symbol-park me-3" />
                </Col>
                <Col>
                  <h6 className="card-details">{locationsArray.join(", ")}</h6>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={2} >
                  <FaParking className="card-symbol-park me-3" />
                </Col>
                <Col>
                  <h6 className="card-details">{parking.occupied} / {parking.total} occupied {parking.occupied === 1 ? 'slot' : 'slots'}</h6>
                </Col>
              </Row>
              <Row className="mb-2" >
                <Col xs={2}>
                  <FaMountain className="card-symbol-park me-3" />
                </Col>
                <Col>
                  <h6 className="card-details">{parking.altitude} m</h6>
                </Col>
              </Row>
            </div>
          </div>);
        })}
      </Slider>
    </div>
  );
}

export default MyParkingSection;