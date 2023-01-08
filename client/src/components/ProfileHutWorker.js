import { Button, Container, Row, Col, Form, OverlayTrigger, Tooltip, FloatingLabel, Modal, Alert } from "react-bootstrap";
import API from '../API.js';
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../styles/ProfileLocalGuide.css';
import React, { useState, useEffect } from 'react';
import { default as LinkedHutIcon } from '../images/linked_hut_icon.png';
import '../styles/SinglePageHut.css';
import { default as Img1 } from '../images/img1.jpg';
import { default as Hut } from "../icons/hut.svg";
import { default as Hike } from "../icons/hiking.svg";
import { default as Alert1 } from "../icons/alert.svg";
import { default as Delete } from "../icons/delete.svg";

import '../styles/ProfileHutWorker.css';



function ProfileHutWorker(props) {

  const [task1, setTask1] = useState(true);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [message, setMessage] = useState('');

  const hutId = props.user.hut;
  return (
    <Container fluid className="">
      <Row className="box-btn mb-5">
        <Button className={task1 ? 'user-btn-fix me-2' : 'user-btn me-2'} onClick={() => setTask1(true)}> Your Hut </Button>
        <Button className={!task1 ? 'user-btn-fix ms-2 ' : 'user-btn ms-2'} onClick={() => setTask1(false)}> Hike Condition </Button>
      </Row>
      {showUpdateBanner && <Alert variant='success' onClose={() => { setShowUpdateBanner(false); setMessage('') }} dismissible>{message}</Alert>}
      {task1 ? <YourHut hut={props.hut} setDirty={props.setDirty} updateHut={props.updateHut} setShowUpdateBanner={setShowUpdateBanner}
        setMessage={setMessage} /> : <HikeCondition hut={props.hut} />}
    </Container>
  );
}

function YourHut(props) {

  const hutId = props.hut.id;
  const [image, setImage] = useState(`http://localhost:3001/images/hut-${props.hut.id}.jpg`);
  const [images, setImages] = useState([{ posID: 0, image: image }]);
  const [hut, setHut] = useState({});

  let imgs = [
    { posID: 0, image: image }
  ]
 
  const [newImage, setNewImage] = useState({});
  const [dirty, setDirty] = useState(true);
  const [mainImg, setMainImg] = useState(imgs[0]);
  const [modalShow, setModalShow] = useState(false);
  const [name, setName] = useState(props.hut ? props.hut.name : '');
  const [description, setDescription] = useState(props.hut ? props.hut.description : '');
  const [lat, setLat] = useState(props.hut ? props.hut.lat : 0);
  const [lon, setLon] = useState(props.hut ? props.hut.lon : 0);
  const [altitude, setAltitude] = useState(props.hut ? props.hut.altitude : 0);
  const [beds, setBeds] = useState(props.hut ? props.hut.beds : 0);
  const [state, setState] = useState(props.hut ? props.hut.state : '');
  const [region, setRegion] = useState(props.hut ? props.hut.region : '');
  const [province, setProvince] = useState(props.hut ? props.hut.province : '');
  const [municipality, setMunicipality] = useState(props.hut ? props.hut.municipality : '');

  const [phone, setPhone] = useState(props.hut ? props.hut.phone : '');
  const [email, setEmail] = useState(props.hut ? props.hut.email : '');
  const [website, setWebsite] = useState(props.hut ? props.hut.website : '');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (dirty) {
      API.getHut(hutId)
        .then((hut) => {
          setHut(hut);
          API.getMyHutImages(hutId)
          .then((h) => setImages(h))
          .catch(err => console.log(err))
        })
      setDirty(false);
    }
  }, [dirty, hutId])

  const handleSubmit = (event) => {
    event.preventDefault();

    if (name.trim().length === 0)
      setErrorMsg('The name of the hut cannot be consisted of only empty spaces');
    else {
      const updatedHut = {
        id: props.hut.id,
        name: name,
        description: description,
        lat: lat,
        lon: lon,
        altitude: altitude,
        beds: beds,
        state: state,
        region: region,
        province: province,
        municipality: municipality,
        image: mainImg,
        email: email,
        phone:phone,
        website:website
      }
      props.updateHut(updatedHut);
      setDirty(true);
      props.setShowUpdateBanner(true);
      props.setMessage(`Hut #${hutId} ${name} has been updated successfully!`);
    }
  }

  const uploadImage = async () => {
    setImages(current => [...current, {id: images.length, value: `http://localhost:3001/images/myHut-${images.length}-${props.hut.id}.jpg`}]);
    await API.uploadMyHutImage(hut.id, hut.images+1, newImage);
    setDirty(true);
  }

  return (
    <Container fluid className="">
      <MyImageModal show={modalShow} image={mainImg} hut={hut} onHide={() => setModalShow(false)} />
      <Row className="hut-man-box py-5 px-2  ">
        <Col md={5}  >
          <Container fluid>
            <Row className="box_img ">
              <img className=" main_img  hut-man-img" src={mainImg.image} alt="main_image" onClick={() => setModalShow(true)} />
              {/*<Button variant="danger" className="close_btn">
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}>
                  <img src={Close2} alt="user_image" className="x-img " />
                </OverlayTrigger>
              </Button>*/}
            </Row>
            <Row className="thumb_row">
              {images.map((item, index) => (
                <Button key={index} className="hut-man-box-thumb mb-2" >
                  <img className={mainImg.posID == index ? "hut-man-clicked thumb_img" : "thumb_img"} src={item.image} onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = Img1;

                  }} alt="hut images" onClick={() => setMainImg(images[index])} />
                </Button>
              ))}
            </Row>
            <Row className="thumb_row">
            <Form.Group controlId="formFile" className="center-box mt-3 mb-5">
              <Form.Label>Insert an image of your hut!</Form.Label>
              <Form.Control type="file" accept='.jpg' 
                  onChange={(e) => { setNewImage(e.target.files[0]); }} />
                <Button variant="success" className="save-btn2 mx-2 mb-2" onClick={() => uploadImage()}>Upload</Button>
            </Form.Group>
            </Row>
          </Container>
        </Col>

        <Col >
          <Form onSubmit={handleSubmit}>

            <Row className='man-hut-label'>
              <Col>
                <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                  <Form.Control required={true} value={name} onChange={ev => setName(ev.target.value)} type="text" placeholder="Rifugio x" />
                </FloatingLabel>
              </Col>
              <Col>
              <FloatingLabel controlId="floatingInput" label="Ascent" className="mb-3">
                  <Form.Control required={true} type="text" value={altitude} onChange={ev => setAltitude(ev.target.value)} placeholder="2400 m" />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <FloatingLabel controlId="floatingInput" label="Number of beds" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} value={beds} onChange={ev => setBeds(ev.target.value)} placeholder="#" />
                </FloatingLabel>
              </Col>
              <Col>
              <FloatingLabel controlId="floatingInput" label="Phone number" className="mb-3">
                  <Form.Control required={true} type="text" value={phone} onChange={ev => setPhone(ev.target.value)} placeholder="+39 xxx xxx xxxx"></Form.Control>
                </FloatingLabel>
              </Col>
            </Row>
            <Row className='man-hut-label'>
              <Col>
                <FloatingLabel controlId="floatingInput" label="State" className="mb-3">
                  <Form.Control required={true} value={state} type="text" disabled readOnly ></Form.Control>
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel controlId="floatingInput" label="Region" className="mb-3">
                  <Form.Control required={true} value={region} type="text" disabled readOnly ></Form.Control>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <FloatingLabel controlId="floatingInput" label="Province" className="mb-3">
                  <Form.Control required={true} value={province} type="text" disabled readOnly ></Form.Control>
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel controlId="floatingInput" label="Municipality" className="mb-3">
                  <Form.Control required={true} value={municipality} type="text" disabled readOnly ></Form.Control>
                </FloatingLabel>
              </Col>
            </Row>

            <Row>
              <Col>
                <Row>
                  <Col lg={6} md={6} sm={6} xs={12}>
                  <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                      <Form.Control required={true} type="email" value={email} onChange={ev => setEmail(ev.target.value)} placeholder="name@example.com"></Form.Control>
                    </FloatingLabel>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={12}>
                  <FloatingLabel controlId="floatingInput" label="Website (optional)" className="mb-3">
                      <Form.Control type="text" value={website} onChange={ev => setWebsite(ev.target.value)} placeholder="nameexample.com" ></Form.Control>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='man-hut-label'>
                  <Col>
                    <FloatingLabel controlId="floatingTextarea2" label="Description" className="mb-3">
                      <Form.Control value={description} onChange={ev => setDescription(ev.target.value)} as="textarea" style={{ height: '130px' }} placeholder="description" />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='btn_box mt-3'>
                  <Button variant="success" type='submit' className="save-btn2 mx-2 mb-2">Save</Button>
                </Row>
              </Col>
            </Row>

          </Form>
        </Col>
      </Row>
    </Container>
  );
}

function MyImageModal(props) {
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
      <Modal.Header closeButton className='box-modal man-hut-page-modal-header'>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.hut.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='box-modal man-hut-page-modal-body'>
        <img src={props.image.image} alt="hut" className="modal-imgs" />
      </Modal.Body>

    </Modal>
  );
}

function HikeCondition(props) {

  const [show, setShow] = useState(false);
  const [dirty, setDirty] = useState(true);
  const [linkedHut, setLinkedHut] = useState([]);
  const [hike, setHike] = useState([]);
  const [typeCondition, setTypeCondition] = useState('');
  const [description, setDescription] = useState('');
  const [hikeCondition, setHikeCondition] = useState([]);

  let flagLinked = false;

  useEffect(() => {
    if (dirty) {
      API.getLinkedHuts()
        .then((points) => {
          setLinkedHut(points);
          if (points.filter((p) => p.hutID === props.hut.id).length !== 0) {
            API.getHike(points.filter((p) => p.hutID === props.hut.id)[0].hikeID)
              .then((hike) => setHike(hike))
              .catch(err => console.log(err))
            API.getHikeConditions()
              .then((hikeCondition) => setHikeCondition(hikeCondition.filter((h) => h.hutID === props.hut.id)))
              .catch(err => console.log(err))
          }
        })
        .catch(err => console.log(err))

      setDirty(false);
    }
  }, [dirty, props.hut.id])

  if (linkedHut.filter((p) => p.hutID === props.hut.id).length !== 0) {
    flagLinked = true;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    let hikeCondition = {
      hikeID: hike.id,
      hutID: props.hut.id,
      typeCondition: typeCondition,
      description: description
    };

    await API.addHikeCondition(hikeCondition)
      .then()
      .catch(err => console.log(err));

    setShow(true);
    resetValues();
    setDirty(true);
  }

  const resetValues = () => {
    setDescription('');
    setTypeCondition('');
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {/*show ? <Row className="mb-4">
        <Col md={{ span: 6, offset: 3 }} sm={{ span: 8, offset: 2 }} xs={12}>
          <Alert className="mx-3" variant="success" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>Hike Condition uploaded successfully!</Alert.Heading>
          </Alert>
        </Col>
      </Row> : false*/}
        <Row>
          {linkedHut.filter((p) => p.hutID === props.hut.id).length === 0 ?
            <h4 className="box-center margin-bottom">{`The hut "${props.hut.name}" is not yet linked`}</h4> :
            <h4 className="box-center margin-bottom">{`The hut "${props.hut.name}" is linked to the hike "${hike.label}"`}</h4>}
        </Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Row className="mb-4">
            <div>
              {props.hut.id && <HutMapHikeCondition coordinates={[props.hut.lat, props.hut.lon]} hut={props.hut} flagLinked={flagLinked}></HutMapHikeCondition>}
            </div>
          </Row>
        </Col>
        {linkedHut.filter((p) => p.hutID === props.hut.id).length === 0 ?
          <Row className="val-user-box3 mx-5 p-4">
            <Col md={3} className="box-center margin-bottom">
              <img src={Alert1} alt="user_image" />
            </Col>
            <Col md={4} className="align margin-bottom box-center">
              <FloatingLabel controlId="floatingSelect" label="Hike Condition" className="form-sel2">
                <Form.Select aria-label="Floating label select example" placeholder="Select an Hike Condition" disabled readOnly>
                  <option selected disabled value="">~ Choose a condition ~</option>
                  <option value="Open"> Open</option>
                  <option value="Close">Close</option>
                  <option value="Partly blocked">Partly blocked</option>
                  <option value="Requires special gear">Requires special gear</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col md={5} className="align margin-bottom box-center ">
              <FloatingLabel controlId="floatingTextarea2" label="Description" className="form-desc">
                <Form.Control as="textarea" style={{ height: '80px' }} placeholder="description" disabled readOnly />
              </FloatingLabel>
            </Col>
          </Row> :
          <Row className="val-user-box3 mx-5 p-4">
            <Col md={2} className="box-center margin-bottom">
              <img src={Alert1} alt="user_image" />
            </Col>
            <Col md={3} className="align margin-bottom box-center">
              <FloatingLabel controlId="floatingSelect" label="Hike Condition" className="form-sel2">
                <Form.Select aria-label="Floating label select example" required={true} value={typeCondition} onChange={ev => setTypeCondition(ev.target.value)}>
                  <option selected disabled value="">~ Choose a condition ~</option>
                  <option value="Open"> Open</option>
                  <option value="Close">Close</option>
                  <option value="Partly blocked">Partly blocked</option>
                  <option value="Requires special gear">Requires special gear</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col md={5} className="align margin-bottom box-center ">
              <FloatingLabel controlId="floatingTextarea2" label="Description" className="form-desc">
                <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} as="textarea" style={{ height: '100px' }} placeholder="description" />
              </FloatingLabel>
            </Col>
            <Col md={2} className="box-center">
              <Row className='btn_box mt-3'>
                <Button variant="success" type='submit' className="save-btn mx-2 mb-2">Save</Button>
              </Row>
            </Col>
          </Row>
        }
      </Form>
      <Row className="val-user-box mx-5 mb-4 p-4 mt-5">
        {hikeCondition.map((w) => <ListHikeCondition key={w.conditionID} hikeCondition={w} hut={props.hut} hike={hike} setDirty={setDirty} />)}
      </Row>
    </>
  );
}

function HutMapHikeCondition(props) {

  let hutIcon;

  const iconHut = new Icon({
    iconUrl: 'https://wiki.openstreetmap.org/w/images/thumb/f/f1/Alpinehut.svg/120px-Alpinehut.svg.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const iconLinkedHut = new Icon({
    iconUrl: LinkedHutIcon,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  if (props.flagLinked) {
    hutIcon = iconLinkedHut;
  } else {
    hutIcon = iconHut;
  }

  return (
    <MapContainer className='single-hut-map' center={props.coordinates} zoom={14}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={props.coordinates} icon={hutIcon}>
        {props.hut.name &&
          <Popup>
            <p>{props.hut.name}</p>
          </Popup>}
      </Marker>

    </MapContainer>
  );
}

function ListHikeCondition(props) {

  return (
    <>
      <Col md={2} className="align margin-bottom">
        <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Type Condition</Tooltip>}>
          <img src={Alert1} alt="location_image" className='me-3 profile-icon' />
        </OverlayTrigger>
        <h6 className="card-text p-card">{`Condition: ${props.hikeCondition.typeCondition}`}</h6>
      </Col>
      <Col md={2} className="align margin-bottom">
        <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Hut</Tooltip>}>
          <img src={Hut} alt="location_image" className='me-3 profile-icon' />
        </OverlayTrigger>
        <h6 className="card-text p-card">{props.hut.name}</h6>
      </Col>
      <Col md={2} className="align margin-bottom">
        <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Hike</Tooltip>}>
          <img src={Hike} alt="location_image" className='me-3 profile-icon' />
        </OverlayTrigger>
        <h6 className="card-text p-card">{props.hike.label}</h6>
      </Col>
      <Col md={5} className="align margin-bottom desc">
        <FloatingLabel controlId="floatingTextarea2" label="Description" className=" desc-box">
          <Form.Control as="textarea" style={{ height: '90px' }} readOnly disabled value={props.hikeCondition.description} />
        </FloatingLabel>
      </Col>
      <Col md={1} className="box-center">
        <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}>
          <Button className="delete-btn"><img src={Delete} alt="delete_image" className='' onClick={() => { API.deleteHikeCondition(props.hikeCondition.conditionID); props.setDirty(true) }} /></Button>
        </OverlayTrigger>
      </Col>
    </>
  )
}

export default ProfileHutWorker;