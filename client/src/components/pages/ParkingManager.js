
import '../../styles/HikeManager.css';
import { Container, Row, Col, InputGroup, Form, Button,Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../API.js';

import { default as Img1 } from "../../images/img1.jpg";

function MyParkingManager(props) {


  const navigate = useNavigate();

  const [parkingLots, setParkingLots] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (dirty) {
      API.getParkingLots()
        .then((pls) => setParkingLots(pls))
        .catch(err => console.log(err))
      setDirty(false);
    }
  }, [dirty]);

  return (

    <Container fluid className='back'>
      <Row className='title_box'>
        <h1 className='title'> PARKING MANAGER </h1>
      </Row>
      <Row className='input-group my-5 mx-auto search_row'>
        <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }} xs={12} >
          <InputGroup >
            <Form.Control placeholder="Insert an parking lot label" />
            <Button variant="success">Search</Button>
          </InputGroup>
        </Col>
        <Col className='search_row'>
          <Button variant='primary' size="lg" className='mx-5 my-3' onClick={() => navigate("/newParking")}>Add new Parking Lot</Button>
        </Col>
      </Row>
      {showUpdateBanner && <Alert variant='success' onClose={() => {setShowUpdateBanner(false); setMessage('')}} dismissible>{message}</Alert>}
      {parkingLots.map(pl => <SingleUpdateParkingCard key={pl.id} parking={pl} user={props.user}
        updateParkingLot={props.updateParkingLot} deleteParkingLot={props.deleteParkingLot} setDirty={setDirty}
        setShowUpdateBanner={setShowUpdateBanner} setMessage={setMessage} />)}
    </Container>

  );
}

function SingleUpdateParkingCard(props) {

  const navigate = useNavigate();

  let plId = props.parking.id;
  const plToEdit = props.parking;

  const [label, setLabel] = useState(plToEdit?.label ?? '');
  const [description, setDescription] = useState(plToEdit ? plToEdit.description : '');
  const [province, setProvince] = useState(plToEdit ? plToEdit.province : '');
  const [municipality, setMunicipality] = useState(plToEdit ? plToEdit.municipality : '');
  const [occupied, setOccupied] = useState(plToEdit ? plToEdit.occupied : '');
  const [total, setTotal] = useState(plToEdit ? plToEdit.total : '');
  const [errorMsg, setErrorMsg] = useState('');

  
  const handleSubmit = (event) => {
    event.preventDefault();

    if (label.trim().length === 0)
      setErrorMsg('The label of the hike cannot be consisted of only empty spaces');
    else {
      const updatedParkingLot = { 
        id: plId, 
        label: label,
        description: description,
        province: province,
        municipality: municipality,
        total: total,
        occupied: occupied
      }
      props.updateParkingLot(updatedParkingLot);
      props.setDirty(true);
      props.setShowUpdateBanner(true);
      props.setMessage(`Parking Lot #${plId} ${label} has been updated successfully!`);
      // navigate('/');
    }
  }

  return (

    <Row className="hike_box mx-5 py-5 px-5 mb-4">
      <Col md={2} className="box_img_box" >
        <img className=" img_box mb-3" src={Img1} alt="First slide" />
        <Button variant="primary" size="sm" className="btn_box"> Update Image </Button>
      </Col>

      <Col md={10} className="px-4" >
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4} >
              <Form.Group>
                <Form.Label>Label</Form.Label>
                <Form.Control required={true} value={label} onChange={ev => setLabel(ev.target.value)}></Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Municipality</Form.Label>
                <Form.Control required={true} value={municipality} onChange={ev => setMunicipality(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4} >
              <Form.Group>
                <Form.Label>Province</Form.Label>
                <Form.Control required={true} value={province} onChange={ev => setProvince(ev.target.value)} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} />
              </Form.Group>
            </Col> 
            <Col>
              <Form.Group>
                <Form.Label>Total Slots</Form.Label>
                <Form.Control required={true} value={total} onChange={ev => setTotal(ev.target.value)} />
              </Form.Group>
            </Col> 
            <Col>
              <Form.Group>
                <Form.Label>Occupied Slots</Form.Label>
                <Form.Control required={true} value={occupied} onChange={ev => setOccupied(ev.target.value)} />
              </Form.Group>
            </Col> 
            </Row>
            <Row>
            <Col className="pt-4">
              <Row> 
              <Button variant="success" type='submit' className="btn_box2 mx-2">Save</Button>
                <Button variant="danger" onClick={() => props.deleteParkingLot(plId)} className="btn_box2 mx-2" >Delete</Button>
               
              </Row>
            </Col>
         </Row>
        </Form>
      </Col>
    </Row>
  );
}


export default MyParkingManager;