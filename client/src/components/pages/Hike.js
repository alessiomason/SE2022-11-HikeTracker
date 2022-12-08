import { useState, useEffect } from 'react';
import { Container, Row, Col, OverlayTrigger, Tooltip, Button, Tabs, Tab, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import SingleHikeCard from '../SingleHikeCard';
import HikeMap from '../HikeMap';
import API from '../../API';
import '../../styles/singlePageHike.css';
import { default as Hiking } from '../../icons/hiking.svg';
import { default as Location } from "../../icons/map.svg";
import { default as Length } from "../../icons/location-on-road.svg";
import { default as Time } from "../../icons/stopwatch.svg";
import { default as Ascent } from "../../icons/mountain.svg";
import { default as Difficulty } from "../../icons/volume.svg";
import { default as Img1 } from "../../images/image3.jpg";
import { default as FakeMap } from "../../images/fakeMap.jpg";

function HikePage(props) {
  const [hike, setHike] = useState({});
  const [dirty, setDirty] = useState(true);

  let { hikeId } = useParams();
  hikeId = parseInt(hikeId);

  useEffect(() => {
    if (dirty) {
      API.getHike(hikeId)
        .then((hike) => setHike(hike))
        .catch(err => console.log(err))
      setDirty(false);
    }
  }, [dirty, hikeId]);

  const [modalShow, setModalShow] = useState(false);

  const [log, setLog] = useState(false); //to remove

  return (
    <Container fluid className="external-box">
      <MyImageModal show={modalShow} onHide={() => setModalShow(false)} />
      <Container fluid className='internal-box' >
        <Row className="center-box mb-4">
          <h2 className="background double single-hike-title "><span><img src={Hiking} alt="hiking_image" className='me-2 hike-img single-hike-icon' />Titolo dell'hike</span></h2>
        </Row>
        <Row className="mx-4">
          <Col md={3} >
            <Row>
              <h6 className='side-title'>Location:</h6>
            </Row>
            <Row className="info-row">
              <Col md={12} className='mb-4 align'>
                <img src={Img1} alt="photo" className="side-hike-img" onClick={() => setModalShow(true)}/>
              </Col>
              <Col md={12} className='mb-4 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Location</Tooltip>}>
                  <img src={Location} alt="location_image" className='me-3 single-hike-icon' />
                </OverlayTrigger>
                <p className='p-hike'>Vinovo, Torino, Piemonte, IT</p>
              </Col>
            </Row>
            <Row>
              <h6 className='side-title'>Track:</h6>
            </Row>
            <Row className="info-row">
              <Col lg={6} md={12} sm={6} xs={6} className='mb-3 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Length</Tooltip>}>
                  <img src={Length} alt="length_image" className='me-3 single-hike-icon' />
                </OverlayTrigger>
                <p className='p-hike'>10000 m</p>
              </Col>
              <Col lg={6} md={12} sm={6} xs={6} className='mb-3 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Ascent</Tooltip>}>
                  <img src={Ascent} alt="ascent_image" className='me-3 single-hike-icon' />
                </OverlayTrigger>
                <p className='p-hike'>1200 m</p>
              </Col>

            </Row>
            <Row>
              <h6 className='side-title'>Experience:</h6>
            </Row>
            <Row className="info-row">
              <Col lg={6} md={12} sm={6} xs={6} className='mb-3 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Expected time</Tooltip>}>
                  <img src={Time} alt="time_image" className='me-3 single-hike-icon' />
                </OverlayTrigger>
                <p className='p-hike'>6 hours</p>
              </Col>
              <Col lg={6} md={12} sm={6} xs={6} className='mb-3 align '>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Difficulty</Tooltip>}>
                  <img src={Difficulty} alt="difficulty_image" className='me-3 single-hike-icon ' />
                </OverlayTrigger>
                <p className='p-hike'>Pro Hiker</p>
              </Col>
            </Row>
          </Col>
          <Col md={{ span: 7, offset: 1 }} >
            <Row className='mt-3'>
            
              {log ? <HikeMap length={hike.length} points={hike.points} /> : 
                <div className="container">
                  <img src={FakeMap} alt="fake_map" className="fake-image" />
                  <div className="middle">
                  <h3 className='mb-5 text'> Sign In to look the Map!</h3>
                  <Button variant="primary log_btn slide" type="submit" > Sign In </Button>
                  </div>
                </div>}

            </Row>
            <Row className='btn-row'>
            <Button className="mx-1 mt-2 share_btn slide" type="submit" > Share Track </Button>
            <Button className="mx-1 mt-2 terminate_btn slide" type="submit" > Terminate  </Button>
            <Button className="mx-1 mt-2 start_btn slide" type="submit" > Start Track </Button>  
            </Row>
            <Row className="tab-box">
              <Tabs defaultActiveKey="description" id="justify-tab-example" className="mb-3 " justify >
                <Tab eventKey="description" title="Description" >
                  <p >The hike starts from the parking area located just south of Grant Lake. From the parking lot, head north on Halls Valley Trail which heads along the eastern shore of Grant Lake. After about 0.3 miles, at the junction with Bernal Trail, take a right to stay on Halls Valley Trail which heads off to the east.
                    At about 0.5 miles into the hike, you'll reach a junction with Los Huecos Trail which heads right, but to follow the hike as mapped, stay left on Halls Valley Trail. The trail begins to climb an easy to moderate grade as it ascends the north side of the drainage. At 2.7 miles, when Halls Valley Trail trail ends at Canada de Pala Trail, take a right and continue climbing. After about 0.3 miles, take a right onto Los Huecos Trail and you'll soon reach the highest point on this loop. </p>
                </Tab>
                <Tab eventKey="condition" title="Condition"  >
                  <p >The hike starts from the parking area located just south of Grant Lake. From the parking lot, head north on Halls Valley Trail which heads along the eastern shore of Grant Lake. After about 0.3 miles, at the junction with Bernal Trail, take a right to stay on Halls Valley Trail which heads off to the east.
                    At about 0.5 miles into the hike, you'll reach a junction with Los Huecos Trail which heads right, but to follow the hike as mapped, stay left on Halls Valley Trail. The trail begins to climb an easy to moderate grade as it ascends the north side of the drainage. At 2.7 miles, when Halls Valley Trail trail ends at Canada de Pala Trail, take a right and continue climbing. After about 0.3 miles, take a right onto Los Huecos Trail and you'll soon reach the highest point on this loop. </p>
                </Tab>
                <Tab eventKey="weather" title="Weather Alert"  >
                  <p >The hike starts from the parking area located just south of Grant Lake. From the parking lot, head north on Halls Valley Trail which heads along the eastern shore of Grant Lake. After about 0.3 miles, at the junction with Bernal Trail, take a right to stay on Halls Valley Trail which heads off to the east.
                    At about 0.5 miles into the hike, you'll reach a junction with Los Huecos Trail which heads right, but to follow the hike as mapped, stay left on Halls Valley Trail. The trail begins to climb an easy to moderate grade as it ascends the north side of the drainage. At 2.7 miles, when Halls Valley Trail trail ends at Canada de Pala Trail, take a right and continue climbing. After about 0.3 miles, take a right onto Los Huecos Trail and you'll soon reach the highest point on this loop. </p>
                </Tab>
              </Tabs>
            </Row>
          </Col>  
        </Row>
      </Container>
    </Container>
  );
}

function MyImageModal(props) {
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
      <Modal.Header closeButton className='box-modal'>
        <Modal.Title id="contained-modal-title-vcenter">
          Titolo dell'hike 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='box-modal'>
        <img src={Img1} alt="photo" className="" />
      </Modal.Body>
      
    </Modal>
  );
}

export default HikePage;


/*
<Row>
                <div className=' d-flex justify-content-center'>
                    <SingleHikeCard key={hike.id} hike={hike} user={props.user} />
                </div>
            </Row>
            <Row>
                <div className=' d-flex justify-content-center'>
                     Map is rendered only when hike is loaded 
                    {hike.id && <HikeMap length={hike.length} points={hike.points} />}
                </div>
            </Row>*/