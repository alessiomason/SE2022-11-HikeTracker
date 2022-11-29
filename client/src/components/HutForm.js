import { Alert, Form } from 'react-bootstrap';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState } from 'react';
import { default as Img1 } from "../images/img8.jpg";
import { useNavigate } from 'react-router-dom';
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import API from '../API';
import '../styles/Map.css';
import 'leaflet/dist/leaflet.css';
import '../styles/HikeForm.css';

function HutForm(props) {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);
    const [altitude, setAltitude] = useState(0);
    const [beds, setBeds] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        if (name.trim().length === 0)
            setErrorMsg('The name of the hut cannot be consisted of only empty spaces');
        else {
            let newHut = {
                name: name,
                description: description,
                lat: latitude,
                lon: longitude,
                altitude: altitude,
                beds: beds
            }
            // retrieve location info and address from coordinates
            API.reverseNominatim(latitude, longitude)
                .then((locationInfo) => {
                    newHut.province = locationInfo.address.county;
                    newHut.municipality = locationInfo.address.city || locationInfo.address.town || locationInfo.address.village;
                    props.addHut(newHut);
                    props.setDirty(true);
                    navigate('/hutManager');
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="hike_form-title">Add new Hut</h1>
                </Col>
            </Row>

            <Row className="hut_box mx-5 py-5 px-5 mb-4">
                <Col md={13} className="box_img_box" >
                    <img className=" img_box mb-3" src={Img1} alt="First slide" />
                    <Button variant="primary" size="sm" className="btn_box"> Update Image </Button>
                </Col>

                <Row>
                    <Col>
                        {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control required={true} value={name} onChange={ev => setName(ev.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Altitude [m]</Form.Label>
                                <Form.Control required={true} type='number' step="any" value={altitude} onChange={ev => setAltitude(ev.target.value)} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Number of Beds</Form.Label>
                                <Form.Control required={true} type='number' step="any" min={0} value={beds} onChange={ev => setBeds(ev.target.value)} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} />
                            </Form.Group>
                            <Row className='my-3 box_btn'>
                                <div className='d-flex justify-content-center'>
                                    <h3>Click on the map to select the hut's location</h3>
                                </div>
                                <HutMap setLatitude={setLatitude} setLongitude={setLongitude} />
                            </Row>
                            <Button className='save-button' type='submit' >Save</Button>
                            <Button className='back-button' onClick={() => navigate('/hutManager')} variant='secondary' >Back</Button>
                        </Form>
                    </Col>
                </Row>
            </Row>
        </Container >
    );
}

function HutMap(props) {
    return (
        <MapContainer center={[45.177786, 7.083372]} zoom={10} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker setLatitude={props.setLatitude} setLongitude={props.setLongitude} />
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
        }
    });

    return (<Marker position={marker} icon={markerIcon} />);
}

export default HutForm;