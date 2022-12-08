import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, ButtonGroup, ButtonToolbar, OverlayTrigger, Tooltip } from "react-bootstrap";
import '../styles/HutSection.css';
import { default as Hut } from '../icons/hut.svg';
import { default as arrowRight } from '../icons/arrow-right.svg';
import { default as arrowLeft } from '../icons/arrow-left.svg';
import { default as Delete } from '../icons/delete.svg';
import { FaSearch } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa";
import { FaMountain } from "react-icons/fa";
import { ImPriceTag } from "react-icons/im";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { default as image4 } from "../images/image4.jpg";
import API from './../API.js';

function MyHutSection() {
  const [huts, setHuts] = useState([]);
  const [dirty, setDirty] = useState(true);

  useEffect(() => {
    if (dirty) {
      API.getHuts()
        .then((huts) => setHuts(huts))
        .catch(err => console.log(err))
      setDirty(false);
    }
  }, [dirty]);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Remove all filters
    </Tooltip>
  );

  return (
    <>
      <Container fluid className="hutSection" id="hutSec">
        <Row>
          <h2 className="background double hut-title"><span><img src={Hut} alt="hut_image" className='me-2 hike-img' />HUTS</span></h2>
        </Row>
        <Row className='mt-5'>
          <div className="search-box">
            <button className="btn-search"><FaSearch className="icon" /></button>
            <input type="text" className="input-search" placeholder="Type to Search..." />
          </div>
        </Row>
        <Row className='mt-5'>
          <Col md="auto" sm="auto" xs="auto" >
            <ButtonToolbar aria-label="Toolbar with button groups" >
              <ButtonGroup className='my-1  me-3' size="lg" aria-label="First group">
                <Button variant="success" className='btn_filter btn-filter-hut'>Location</Button>
                <Button variant="success" className='btn_filter btn-filter-hut'>Ascent</Button>
                <Button variant="success" className='btn_filter btn-filter-hut' >Number of beds</Button>
                <Button variant='success' className='btn_filter btn-filter-hut' >Services</Button>
              </ButtonGroup>
              <ButtonGroup className="my-1" aria-label="Second group">
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip} >
                  <Button className="delete-btn"><img src={Delete} alt="delete_image" className='' /></Button>
                </OverlayTrigger>
              </ButtonGroup>
            </ButtonToolbar>
          </Col>
        </Row>

      </Container>
      <Container fluid className="hutCardSection">
        <Row>
          <HutCards huts={huts} />
        </Row>
      </Container>
    </>
  );

}

function HutCards(props) {

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
    infinite: true,
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
        {props.huts.map((hut) => {
          let locationsArray = [];
          if (hut.municipality) locationsArray.push(hut.municipality);
          if (hut.province) locationsArray.push(hut.province);
          if (hut.region) locationsArray.push(hut.region);
          if (hut.state) locationsArray.push(hut.state);

          return (<div className="hut-card" key={hut.id}>
            <div className="card-top">
              <img src={`http://localhost:3001/images/hut-${hut.id}.jpg`}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = image4;
                }} alt={hut.name} className="card-top-img" />
            </div>
            <div className="card-bottom">
              <div>
                <h1 className="hut-card-title">{hut.name}</h1>
              </div>
              <Row >
                <Col xs={2}>
                  <FaLocationArrow className="card-symbol me-3" />
                </Col>
                <Col>
                  <h6 className="card-details">{locationsArray.join(", ")}</h6>
                </Col>
              </Row>
              <Row >
                <Col xs={2}>
                  <FaMountain className="card-symbol me-3" />
                </Col>
                <Col>
                  <h6 className="card-details">{hut.altitude} m</h6>
                </Col>
              </Row>
              <Row >
                <Col xs={2}>
                  <FaBed className="card-symbol me-3" />
                </Col>
                <Col>
                  <h6 className="card-details">{hut.beds} beds</h6>
                </Col>
              </Row>
            </div>
          </div>);
        })}


        {huts.map((hut) => (
          <div className="hut-card" key={hut.id}>
            <div className="card-top">
              <img src={image4} alt={hut.title} className="card-top-img" />
            </div>
            <div className="card-bottom">
              <div>
                <h1 className="hut-card-title">{hut.title}</h1>
              </div>
              <Row >
                <Col md={12} lg={12} xl={12} xxl={6} className="mb-1">
                  <FaLocationArrow className="card-symbol me-3" /><h6 className="card-details">{hut.location}</h6>
                </Col>
                <Col md={12} lg={12} xl={12} xxl={6} className="mb-1">
                  <FaMountain className="card-symbol me-3" /> <h6 className="card-details">{hut.ascent}</h6>
                </Col>
              </Row>
              <Row>
                <Col md={12} lg={6} sm={12} className="mb-1" >
                  <ImPriceTag className="card-symbol me-3" /> <h6 className="card-details">{hut.price}</h6>
                </Col>
                <Col md={12} lg={6} sm={12} className="mb-1">
                  <FaBed className="card-symbol me-3" /> <h6 className="card-details">{hut.beds}</h6>
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
    title: 'Delete these cards when more than 4 huts in DB',
    location: 'Garessio, Cuneo',
    ascent: '1200m',
    price: '200$',
    beds: '150',
  },
  {
    id: 2,
    title: 'Delete these cards when more than 4 huts in DB',
    location: 'politecnico',
    ascent: '1200m',
    price: '200$',
    beds: '150',
  },
  {
    id: 3,
    title: 'Delete these cards when more than 4 huts in DB',
    location: 'politecnico',
    ascent: '1200m',
    price: '200$',
    beds: '150',
  },
  {
    id: 4,
    title: 'Delete these cards when more than 4 huts in DB',
    location: 'politecnico',
    ascent: '1200m',
    price: '200$',
    beds: '150',
  },
  {
    id: 5,
    title: 'Delete these cards when more than 4 huts in DB',
    location: 'politecnico',
    ascent: '1200m',
    price: '200$',
    beds: '150',
  },
  {
    id: 6,
    title: 'Delete these cards when more than 4 huts in DB',
    location: 'politecnico',
    ascent: '1200m',
    price: '200$',
    beds: '150',
  },
  {
    id: 7,
    title: 'Delete these cards when more than 4 huts in DB',
    location: 'politecnico',
    ascent: '1200m',
    price: '200$',
    beds: '150',
  },
  {
    id: 8,
    title: 'Delete these cards when more than 4 huts in DB',
    location: 'politecnico',
    ascent: '1200m',
    price: '200$',
    beds: '150',
  }
];

export default MyHutSection;