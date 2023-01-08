
import '../../styles/HikeManager.css';
import { Container, Row, Col, InputGroup, Form, Button, Alert, FloatingLabel } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../API.js';

import { default as Img1 } from "../../images/img1.jpg";

function MyParkingManager(props) {


  const navigate = useNavigate();

  const [parkingLots, setParkingLots] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [message, setMessage] = useState('');
  const [searchField, setSearchField] = useState('');

  useEffect(() => {
    if (dirty) {
      API.getParkingLots()
        .then((pls) => setParkingLots(pls))
        .catch(err => console.log(err))
      setDirty(false);
    }
  }, [dirty]);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  return (

    <Container fluid className='back'>
      <Row className='title_box'>
        <h1 className='title'> PARKING MANAGER </h1>
      </Row>
      <Row className='input-group my-5 mx-auto search_row'>
        <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }} xs={12} >
          <InputGroup >
            <Form.Control value={searchField} onChange={ev => setSearchField(ev.target.value)} placeholder="Type to search a parking lot by label" />
            <Button variant="success" onClick={() => setSearchField('')}>Clear</Button>
          </InputGroup>
        </Col>
        <Col className='search_row'>
          <Button variant='primary' size="lg" className='mx-5 my-3 add-man-btn' onClick={() => navigate("/newParking")}>Add new Parking Lot</Button>
        </Col>
      </Row>
      {showUpdateBanner && <Alert variant='success' onClose={() => { setShowUpdateBanner(false); setMessage('') }} dismissible>{message}</Alert>}
      {parkingLots.filter(pl => searchField === '' || searchField !== '' && pl.label.toLowerCase().indexOf(searchField) !== -1)
      .filter((p)=> p.authorId===props.user.id).sort((a, b) => (a.id > b.id) ? 1 : -1)
        .map(pl => <SingleUpdateParkingCard key={pl.id} parking={pl} user={props.user}
          updateParkingLot={props.updateParkingLot} deleteParkingLot={props.deleteParkingLot} setDirty={setDirty}
          setShowUpdateBanner={setShowUpdateBanner} setMessage={setMessage} />)}
    </Container>

  );
}

function SingleUpdateParkingCard(props) {


  let plId = props.parking.id;
  const plToEdit = props.parking;

  const [label, setLabel] = useState(plToEdit?.label ?? '');
  const [description, setDescription] = useState(plToEdit ? plToEdit.description : '');
  const [lat, setLat] = useState(plToEdit ? plToEdit.lat : 0);
  const [lon, setLon] = useState(plToEdit ? plToEdit.lon : 0);
  const [altitude, setAltitude] = useState(plToEdit ? plToEdit.altitude : 0);
  const [state, setState] = useState(plToEdit ? plToEdit.state : '');
  const [region, setRegion] = useState(plToEdit ? plToEdit.region : '');
  const [province, setProvince] = useState(plToEdit ? plToEdit.province : '');
  const [municipality, setMunicipality] = useState(plToEdit ? plToEdit.municipality : '');
  const [occupied, setOccupied] = useState(plToEdit ? plToEdit.occupied : '');
  const [total, setTotal] = useState(plToEdit ? plToEdit.total : '');
  const [errorMsg, setErrorMsg] = useState('');
  const [image, setImage] = useState(`http://localhost:3001/images/parkingLot-${plId}.jpg`);
  const [preview, setPreview] = useState(`http://localhost:3001/images/parkingLot-${plId}.jpg`);


  const handleSubmit = (event) => {
    event.preventDefault();

    if (label.trim().length === 0)
      setErrorMsg('The label of the hike cannot be consisted of only empty spaces');
    else {
      const updatedParkingLot = {
        id: plId,
        label: label,
        lat: lat,
        lon: lon,
        altitude: altitude,
        description: description,
        state: state,
        region: region,
        province: province,
        municipality: municipality,
        total: total,
        occupied: occupied,
        image: image
      }
      props.updateParkingLot(updatedParkingLot);
      props.setDirty(true);
      props.setShowUpdateBanner(true);
      props.setMessage(`Parking Lot #${plId} ${label} has been updated successfully!`);
    }
  }

  return (

    <Row className="hike_box mx-5 py-5 px-5 mb-4">
      <Col lg={3} md={6} sm={12} className="box-center"  >
        <img className=" img_box-park mb-3"
          src={preview}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = Img1;
          }}
        />
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label className='updateImageButton'>Update Image</Form.Label>
          <Form.Control type="file" accept='.jpg'
            onChange={(e) => { setImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])) }} />
        </Form.Group>
      </Col>
      <Col Col lg={9} md={6} sm={12}>
        <Form onSubmit={handleSubmit}>
          <Row className='man-park-label'>
          <Col lg={6} md={12} sm={12} xs={12} >
              <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                <Form.Control required={true} value={label} onChange={ev => setLabel(ev.target.value)} type="text" placeholder="Rifugio x" />
              </FloatingLabel>
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
                <FloatingLabel controlId="floatingInput" label="Total Slots" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} value={total} onChange={ev => setTotal(ev.target.value)} />
                </FloatingLabel>
              </Col>
              <Col lg={3} md={6} sm={6} xs={12}>
                <FloatingLabel controlId="floatingInput" label="Occupied Slots" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} value={occupied} onChange={ev => setOccupied(ev.target.value)} />
                </FloatingLabel>
              </Col>
          </Row>
          <Row className='man-park-label'>
            <Col lg={3} md={6} sm={6} xs={12}>
              <FloatingLabel controlId="floatingInput" label="State" className="mb-3">
                <Form.Control required={true} value={state} type="text" disabled readOnly></Form.Control>
              </FloatingLabel>
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <FloatingLabel controlId="floatingInput" label="Region" className="mb-3">
                <Form.Control required={true} value={region} type="text" disabled readOnly ></Form.Control>
              </FloatingLabel>
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <FloatingLabel controlId="floatingInput" label="Province" className="mb-3">
                <Form.Control required={true} value={province} type="text" disabled readOnly></Form.Control>
              </FloatingLabel>
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <FloatingLabel controlId="floatingInput" label="Municipality" className="mb-3">
                <Form.Control required={true} value={municipality} type="text" disabled readOnly></Form.Control>
              </FloatingLabel>
            </Col>
          </Row>
          <Row className='man-park-label'>
          <Col lg={6} md={12} sm={12}>
              <FloatingLabel controlId="floatingTextarea2" label="Description" className="mb-3">
                <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} as="textarea" style={{ height: '80px' }} placeholder="description" />
              </FloatingLabel>
            </Col>
          <Col lg={6} md={12} sm={12}>
            <Row className='btn_box mt-3'>
                <Button variant="danger" onClick={() => props.deleteParkingLot(plId)} className="cancel-btn2 mx-2 mb-2" >Delete</Button>
                <Button variant="success" type='submit' className="save-btn2 mx-2 mb-2">Save</Button>
              </Row>
          </Col>
          </Row>
          
        </Form>
      </Col>
    </Row>
  );
}


export default MyParkingManager;