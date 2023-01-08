import { Container, Row, Col, Button, Alert, Form, FloatingLabel } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { default as Img1 } from "../images/img1.jpg";
import { useNavigate } from 'react-router-dom';
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import API from '../API';
import '../styles/Map.css';
import 'leaflet/dist/leaflet.css';
import '../styles/HikeForm.css';

function ParkingForm(props) {

  const navigate = useNavigate();

  const [label, setLabel] = useState('');
  const [state, setState] = useState('Italy');
  const [region, setRegion] = useState('Piedmont');
  const [province, setProvince] = useState('Torino');
  const [municipality, setMunicipality] = useState('Mompantero');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(0.0);
  const [longitude, setLongitude] = useState(0.0);
  const [altitude, setAltitude] = useState(0);
  const [occupied, setOccupied] = useState(0);
  const [total, setTotal] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [newParkingLotID, setNewParkingLotID] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (label.trim().length === 0)
      setErrorMsg('The label of the hike cannot be consisted of only empty spaces');
    else {
      const newParkingLot = {
        label: label,
        description: description,
        state: state,
        region: region,
        province: province,
        municipality: municipality,
        lat: latitude,
        lon: longitude,
        altitude: altitude,
        total: total,
        occupied: occupied
      }

      await API.addParkingLot(newParkingLot)
        .then(async (pl) => { setNewParkingLotID((pl)); await API.uploadParkingLotImage(pl, image) })
        .catch(err => console.log(err));

      props.setDirty(true);
      navigate('/parkingManager');
    }
  }

  return (
    <Container fluid className="external-box-park">
      <Container fluid className='internal-box-hut pb-3' >
      <Row>
        <Col>
          <h1 className="park_form-title">Add new Parking Lot</h1>
        </Col>
      </Row >
      <Row>
        <Col>
      {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
      </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
      <Row className="hut_box px-5 pt-5">
        <Col md={4} className="box_img_box" >
          <img className=" img_box-park mb-3"
            src={preview}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = Img1;
            }}
          />
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label className='updateImage'>Upload Image</Form.Label>
            <Form.Control type="file" accept='.jpg'
              onChange={(e) => { setImage(e.currentTarget.files[0]); setPreview(URL.createObjectURL(e.currentTarget.files[0])) }} />
          </Form.Group>
        </Col>
        <Col md={8}>
            <Row className='man-park-label'>
            <Col md={6}>
            <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                  <Form.Control required={true} value={label} onChange={ev => setLabel(ev.target.value)} type="text" placeholder="Rifugio x" />
                </FloatingLabel>
              </Col>
              <Col md={6}>
              <FloatingLabel controlId="floatingInput" label="Ascent" className="mb-3">
                  <Form.Control required={true} type='number' step="any" value={altitude} onChange={ev => setAltitude(ev.target.value)}  placeholder="2400" />
                </FloatingLabel>
              </Col>   
            </Row>
            <Row className='man-park-label'>
              <Col md={6}>
              <FloatingLabel controlId="floatingInput" label="Total Slots" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} value={total} onChange={ev => setTotal(ev.target.value)} placeholder="#" />
                </FloatingLabel>
              </Col>
              <Col md={6}>
              <FloatingLabel controlId="floatingInput" label="Occupied Slots" className="mb-3">
                    <Form.Control required={true} type='number' step="any" min={0} value={occupied} onChange={ev => setOccupied(ev.target.value)} placeholder="#"></Form.Control>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className='man-park-label'>
                <Col md={12}>
                  <FloatingLabel controlId="floatingTextarea2" label="Description" className="mb-3">
                    <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} as="textarea" style={{ height: '130px' }} placeholder="description" />
                  </FloatingLabel>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="hut_box px-5 man-park-label">
            <Col md={8}>
            <ParkingMap setLatitude={setLatitude} setLongitude={setLongitude} setState={setState} setRegion={setRegion} setProvince={setProvince} setMunicipality={setMunicipality} />
         </Col>
            <Col md={4}>
              <Row className='mt-2'>
                <h5 >Choose a Point on the Map</h5>
              </Row>
              <Row>
                <Col md={12}>
                  <FloatingLabel controlId="floatingInput" label="State" className="mb-3 mt-3">
                    <Form.Control required={true} value={state} type="text" disabled readOnly ></Form.Control>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FloatingLabel controlId="floatingInput" label="Region" className="mb-3">
                    <Form.Control required={true} value={region} type="text" disabled readOnly ></Form.Control>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FloatingLabel controlId="floatingInput" label="Province" className="mb-3">
                    <Form.Control required={true} value={province} type="text" disabled readOnly ></Form.Control>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FloatingLabel controlId="floatingInput" label="Municipality" className="mb-3">
                    <Form.Control required={true} value={municipality} type="text" disabled readOnly ></Form.Control>
                  </FloatingLabel>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className='btn_box mx-2 mt-3 my-new'>
            <Button variant="danger" onClick={() => navigate('/parkingManager')} className="cancel-btn mx-2 mb-2" >Back</Button>
            <Button variant="success" type='submit' className="save-btn mx-2 mb-2">Save</Button>
          </Row>
        </Form>
    </Container >
    </Container>
  );
}

function ParkingMap(props) {
  return (
    <MapContainer center={[45.177786, 7.083372]} zoom={10}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker setLatitude={props.setLatitude} setLongitude={props.setLongitude} setState={props.setState} setRegion={props.setRegion} setProvince={props.setProvince} setMunicipality={props.setMunicipality} />
    </MapContainer>
  );
}

function LocationMarker(props) {
  const markerIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const [marker, setMarker] = useState([45.177786, 7.083372]);

  useMapEvents({
    click(e) {
      props.setLatitude(e.latlng.lat);
      props.setLongitude(e.latlng.lng);
      setMarker([e.latlng.lat, e.latlng.lng]);
      API.reverseNominatim(e.latlng.lat, e.latlng.lng)
        .then((locationInfo) => {
          props.setState(locationInfo.address.country);
          props.setRegion(locationInfo.address.state);
          props.setProvince(locationInfo.address.county);
          props.setMunicipality(locationInfo.address.city || locationInfo.address.town || locationInfo.address.village || locationInfo.address.municipality
            || locationInfo.address.isolated_dwelling || locationInfo.address.croft || locationInfo.address.hamlet);
        })
    }
  });

  return (<Marker position={marker} icon={markerIcon} />);
}

export default ParkingForm;