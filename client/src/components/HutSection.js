import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tooltip } from "react-bootstrap";
import '../styles/HutSection.css';
import { default as Hut } from '../icons/hut.svg';
import { default as arrowRight } from '../icons/arrow-right.svg';
import { default as arrowLeft } from '../icons/arrow-left.svg';
import { FaSearch,FaBed, FaLocationArrow,FaMountain   } from "react-icons/fa";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { default as image4 } from "../images/image4.jpg";
import API from './../API.js';

function MyHutSection() {
  const [huts, setHuts] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [search, setSearch] = useState(true);
  const [tempName1, setTempName1] = useState('');
  const [tempName2, setTempName2] = useState('');

  const clearHuts = () => {
    setSearch(true);
  }


  useEffect(() => {
    if (dirty) {
      API.getHuts()
        .then((huts) => setHuts(huts))
        .catch(err => console.log(err))
      setDirty(false);
    }
  }, [dirty]);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props} >
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
            <button className="btn-search"><FaSearch className="icon" onClick={() => { setTempName2(tempName1); setSearch(false) }} /></button>
            <input type="text" className="input-search" placeholder="Type to Search..." value={tempName1} onChange={ev => { setTempName1(ev.target.value) }} />
          </div>
        </Row>

      </Container>
      <Container fluid className="hutCardSection">

        <Row>
          <HutCards huts={huts} search={search} tempName={tempName2} />
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

  const hutsOnScreen = props.huts.filter(h => props.search || (props.search === false && (h.name.toLowerCase().match(props.tempName.toLowerCase()) || h.description.toLowerCase().match(props.tempName.toLowerCase())))).length;

  const settings = {
    dots: true,
    infinite: hutsOnScreen > 4,
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
          infinite: hutsOnScreen > 3
        },
      },
      {
        breakpoint: 720,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: hutsOnScreen > 2
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: hutsOnScreen > 1
        },
      },
    ],
  };

  return (
    <div className="hutCardBox">
      <Slider {...settings}>
        {props.huts.sort((a, b) => (a.id > b.id) ? 1 : -1).map((hut) => {

          let locationsArray = [];
          if (hut.municipality) locationsArray.push(hut.municipality);
          if (hut.province) locationsArray.push(hut.province);
          if (hut.region) locationsArray.push(hut.region);
          if (hut.state) locationsArray.push(hut.state);

          if (props.search || (props.search === false && (hut.name.toLowerCase().match(props.tempName.toLowerCase()) || hut.description.toLowerCase().match(props.tempName.toLowerCase())))) {
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
          }
        })}

      </Slider>
    </div>
  );
}

export default MyHutSection;