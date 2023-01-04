import { useState, useEffect } from 'react';
import { Container, Row, Col, OverlayTrigger, Tooltip, Button, Tabs, Tab, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import API from '../../API';
import '../../styles/SinglePageHut.css';
import { default as Hut } from '../../icons/hut.svg';
import { default as Location } from "../../icons/map.svg";
import { default as Ascent } from "../../icons/mountain.svg";
import { default as Bed } from "../../icons/bed.svg";
import { default as Phone } from "../../icons/phone.svg";
import { default as Email } from "../../icons/email.svg";
import { default as Website } from "../../icons/website.svg";
import { default as Img1 } from "../../images/image3.jpg";
import { default as FakeMap } from "../../images/fakeMap.jpg";
import { default as HutIcon } from '../../images/linked_hut_icon.png';


function HutPage(props) {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [hut, setHut] = useState({});
  const [dirty, setDirty] = useState(true);

  let { hutId } = useParams();
  hutId = parseInt(hutId);

  useEffect(() => {
    if (dirty) {
      API.getHut(hutId)
        .then((hut) => setHut(hut))
        .catch(err => console.log(err));

      setDirty(false);
    }
  }, [dirty, hutId])

  const imgs = [
    { id: 0, value: require('../../images/img1.jpg') },
    { id: 1, value: require('../../images/img2.jpg') },
    { id: 2, value: require('../../images/img3.jpg') },
    { id: 3, value: require('../../images/img4.jpg') },
    { id: 4, value: require('../../images/img5.jpg') },
    { id: 5, value: require('../../images/img6.jpg') },
    { id: 6, value: require('../../images/img7.jpg') },
  ]

  const [mainImg, setMainImg] = useState(imgs[0]);

  let locationsArray = [];
  if (hut.municipality) locationsArray.push(hut.municipality);
  if (hut.province) locationsArray.push(hut.province);
  if (hut.region) locationsArray.push(hut.region);
  if (hut.state) locationsArray.push(hut.state);

  return (
    <Container fluid className="external-box-hut">
      <MyImageModal hikeId={1} hikeLabel={hut.name} show={modalShow} onHide={() => setModalShow(false)} />
      <Container fluid className='internal-box-hut' >
        <Row className="center-box mb-4">
          <Col md={12} className="center-box">


            <h2 className="background double single-hut-title "><span><img src={Hut} alt="hut_image" className='me-2 hut-img' />{hut.name}</span></h2>
          </Col>
        </Row>
        <Row className="mx-4">
          <Col md={4} >
            <Row>
              <Col md={12} className='mb-4 '>
                <Row className="box_img mt-3">
                  <img className=" main_img side-hut-img mb-3" src={mainImg.value} alt="main_image" onClick={() => setModalShow(true)} />
                </Row>
                <Row className="thumb_row">
                  {imgs.map((item, index) => (
                    <Button key={index} className="hut-box-thumb mb-2" >
                      <img className={mainImg.id == index ? "hut-clicked thumb_img" : "thumb_img"} src={item.value} alt="hut images" onClick={() => setMainImg(imgs[index])} />
                    </Button>
                  ))}
                </Row>
              </Col>
            </Row>

            <Row>
              <h6 className='side-title-hut'>Location:</h6>
            </Row>
            <Row className="info-row-hut">
              <Col md={12} className='mb-4 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Location</Tooltip>}>
                  <img src={Location} alt="location_image" className='me-3 single-hut-icon icon-hut-filter' />
                </OverlayTrigger>
                <p className='p-hike'>{locationsArray.join(", ")}</p>
              </Col>
            </Row>
            <Row>
              <h6 className='side-title-hut'>Information:</h6>
            </Row>
            <Row className="info-row-hut">
              <Col lg={6} md={12} sm={6} xs={6} className='mb-3 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Ascent</Tooltip>}>
                  <img src={Ascent} alt="ascent_image" className='me-3 single-hut-icon icon-hut-filter' />
                </OverlayTrigger>
                <p className='p-hike'>{hut.altitude} m</p>
              </Col>
              <Col lg={6} md={12} sm={6} xs={6} className='mb-3 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Number of beds</Tooltip>}>
                  <img src={Bed} alt="bed_image" className='me-3 single-hut-icon icon-hut-filter' />
                </OverlayTrigger>
                <p className='p-hike'>{hut.beds} beds</p>
              </Col>
            </Row>
            <Row>
              <h6 className='side-title-hut'>Contacts:</h6>
            </Row>
            <Row className="info-row-hut">
              <Col md={12} className='mb-3 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Phone number</Tooltip>}>
                  <img src={Phone} alt="phone_image" className='me-3 single-hut-icon icon-hut-filter' />
                </OverlayTrigger>
                <p className='p-hike'>{"329 137 0642"}</p>
              </Col>
              <Col md={12} className='mb-3 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Email</Tooltip>}>
                  <img src={Email} alt="email_image" className='me-3 single-hut-icon icon-hut-filter' />
                </OverlayTrigger>
                <p className='p-hike'>{"rifugio.rocciamelone@gmail.com"}</p>
              </Col>
              <Col md={12} className='mb-3 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">WebSite</Tooltip>}>
                  <img src={Website} alt="website_image" className='me-3 single-hut-icon icon-hut-filter' />
                </OverlayTrigger>
                <p className='p-hike'>{"RifugioRocciamelone.com"}</p>
              </Col>
            </Row>
          </Col>
          <Col md={{ span: 7, offset: 1 }} >
            <Row className='mt-3'>
              {!props.loggedIn ?
                <div className="hut-page-container">
                  <img src={FakeMap} alt="fake_map" className="fake-image" />
                  <div className="middle">
                    <h3 className='mb-5 text'> Sign In to look the Map!</h3>
                    <Button variant="primary log_btn slide" type="submit" onClick={() => { props.setShowLogin(true); navigate("/"); }} > Sign In </Button>
                  </div>
                </div> : hut.id && <HutMap coordinates={[hut.lat, hut.lon]} />}
            </Row>

            <Row className="hut-tab-box mt-5">
              <Tabs defaultActiveKey="description" id="justify-tab-example" className="mb-3 " /*justify*/ >
                <Tab eventKey="description" title="Description" >
                  <p>{hut.description}</p>
                </Tab>
                {/*<Tab eventKey="condition" title="Condition"  >
                  <p>Function to be implemented</p>
                </Tab>
                <Tab eventKey="weather" title="Weather Alert"  >
                  <p>Function to be implemented</p>
              </Tab>*/}
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
    <Modal show={props.show} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
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
          }} alt="photo" className="modal-imgs" />
      </Modal.Body>

    </Modal>
  );
}

function HutMap(props) {

  const hutIcon = new Icon({
    iconUrl: HutIcon,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <MapContainer className='single-hut-map' center={props.coordinates} zoom={10}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={props.coordinates} icon={hutIcon} />

    </MapContainer>
  );
}

export default HutPage;