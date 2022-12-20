import { useState, useEffect } from 'react';
import { Container, Row, Col, OverlayTrigger, Tooltip, Button, Tabs, Tab, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import HikeMap from '../HikeMap';
import API from '../../API';
import '../../styles/SinglePageHut.css';
import { default as Hut } from '../../icons/hut.svg';
import { default as Location } from "../../icons/map.svg";
import { default as Ascent } from "../../icons/mountain.svg";
import { default as Bed } from "../../icons/bed.svg";
import { default as Phone } from "../../icons/phone.svg";
import { default as Email } from "../../icons/email.svg";
import { default as Website } from "../../icons/website.svg";
import { default as Difficulty } from "../../icons/volume.svg";
import { default as Img1 } from "../../images/image3.jpg";
import { default as FakeMap } from "../../images/fakeMap.jpg";



function HutPage(props) {

  const [modalShow, setModalShow] = useState(false);

  const navigate = useNavigate();


  return (
    <Container fluid className="external-box">
      <MyImageModal hikeId={1} hikeLabel={"Rifugio Rocciamelone"} show={modalShow} onHide={() => setModalShow(false)} />
      <Container fluid className='internal-box-hut' >
        <Row className="center-box mb-4">
          <h2 className="background double single-hut-title "><span><img src={Hut} alt="hut_image" className='me-2 hike-img single-hut-icon' />{"Rifugio Rocciamelone"}</span></h2>
        </Row>
        <Row className="mx-4">
          <Col md={3} >
            <Row>
              <Col md={12} className='mb-4 align'>
                <img src={`http://localhost:3001/images/hike-${1}.jpg`}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = Img1;
                  }} alt="photo" className="side-hut-img" onClick={() => setModalShow(true)} />
              </Col>
            </Row>
            <Row>
              <h6 className='side-title-hut'>Location:</h6>
            </Row>
            <Row className="info-row-hut">
              <Col md={12} className='mb-4 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Location</Tooltip>}>
                  <img src={Location} alt="location_image" className='me-3 single-hut-icon ' />
                </OverlayTrigger>
                <p className='p-hike'>{"Torino, TO, Piemonte, Italia"}</p>
              </Col>
            </Row>
            <Row>
              <h6 className='side-title-hut'>Information:</h6>
            </Row>
            <Row className="info-row-hut">
              <Col lg={6} md={12} sm={6} xs={6} className='mb-3 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Ascent</Tooltip>}>
                  <img src={Ascent} alt="ascent_image" className='me-3 single-hut-icon' />
                </OverlayTrigger>
                <p className='p-hike'>{"2500"} m</p>
              </Col>
              <Col lg={6} md={12} sm={6} xs={6} className='mb-3 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Beds number</Tooltip>}>
                  <img src={Bed} alt="bed_image" className='me-3 single-hut-icon' />
                </OverlayTrigger>
                <p className='p-hike'>{"150"} </p>
              </Col>
            </Row>
            <Row>
              <h6 className='side-title-hut'>Contacts:</h6>
            </Row>
            <Row className="info-row-hut">
              <Col md={12} className='mb-3 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Phone number</Tooltip>}>
                  <img src={Phone} alt="phone_image" className='me-3 single-hut-icon' />
                </OverlayTrigger>
                <p className='p-hike'>{"329 137 0642"}</p>
              </Col>
              <Col md={12} className='mb-3 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Email</Tooltip>}>
                  <img src={Email} alt="email_image" className='me-3 single-hut-icon' />
                </OverlayTrigger>
                <p className='p-hike'>{"rifugio.rocciamelone@gmail.com"}</p>
              </Col>
              <Col md={12} className='mb-3 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">WebSite</Tooltip>}>
                  <img src={Website} alt="website_image" className='me-3 single-hut-icon' />
                </OverlayTrigger>
                <p className='p-hike'>{"RifugioRocciamelone.com"}</p>
              </Col>
            </Row>
          </Col>
          <Col md={{ span: 7, offset: 1 }} >
            <Row className='mt-3'>
              {true ?
                <div className="hut-page-container">
                  <img src={FakeMap} alt="fake_map" className="fake-image" />
                  <div className="middle">
                    <h3 className='mb-5 text'> Sign In to look the Map!</h3>
                    <Button variant="primary log_btn slide" type="submit" onClick={() => { props.setShowLogin(true); navigate("/"); }} > Sign In </Button>
                  </div>
                </div> : false} {/* Create a correct if with the hut map */}
            </Row>
            
            <Row className="hut-tab-box mt-5">
              <Tabs defaultActiveKey="description" id="justify-tab-example" className="mb-3 " justify >
                <Tab eventKey="description" title="Description" >
                  <p>{"L'itinerario descritto si sviluppa sul versante valsusino del Rocciamelone, percorrendo il classico tragitto che sale da La Riposa fino alla Ca' d'Asti.   Si tenga comunque presente che la salita del Rocciamelone resta un'ascensione abbastanza impegnativa, sia per la quota raggiunta che per il dislivello da superare: inoltre se l'escursione non viene effettuata in piena estate ed in assenza di neve il tratto finale può presentare qualche difficoltà sia nell'attraversamento del versante est, subito dopo La Crocetta, sia per il superamento di un punto un po' esposto collocato appena sotto la vetta, punto dove alcune corde fisse facilitano comunque il passaggio."}</p>
                </Tab>
                <Tab eventKey="condition" title="Condition"  >
                  <p>Function to be implemented</p>
                </Tab>
                <Tab eventKey="weather" title="Weather Alert"  >
                  <p>Function to be implemented</p>
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
      <Modal.Header closeButton className='box-modal hut-page-modal-header'>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.hikeLabel}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='box-modal hut-page-modal-body'>
        <img src={`http://localhost:3001/images/hike-${props.hikeId}.jpg`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = Img1;
          }} alt="photo" className="" />
      </Modal.Body>

    </Modal>
  );
}

export default HutPage;