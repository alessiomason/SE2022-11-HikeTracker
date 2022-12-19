import { Alert, Form } from 'react-bootstrap';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState } from 'react';
import { default as Img1 } from "../images/img1.jpg";
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
    const [state, setState] = useState('Italy');
    const [region, setRegion] = useState('Piedmont');
    const [province, setProvince] = useState('Torino');
    const [municipality, setMunicipality] = useState('Mompantero');
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);
    const [altitude, setAltitude] = useState(0);
    const [beds, setBeds] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [image, setImage] = useState('');
    const [preview, setPreview] = useState('');
    const [newHutID, setNewHutID] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (name.trim().length === 0)
            setErrorMsg('The name of the hut cannot be consisted of only empty spaces');
        else {
            const newHut = {
                name: name,
                description: description,
                lat: latitude,
                lon: longitude,
                altitude: altitude,
                state: state,
                region: region,
                province: province,
                municipality: municipality,
                beds: beds
            }

            await API.addHut(newHut)
                .then( async (h) => { setNewHutID( (h) ); await API.uploadHutImage(h, image) } )
                .catch( err => console.log(err));

            // props.addHut(newHut);
            props.setDirty(true);
            navigate('/hutManager');
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
                    <img className=" img_box mb-3"
                        src={preview}
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = Img1;
                        }}
                    />
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label className='updateImage'>Upload Image</Form.Label>
                        <Form.Control type="file" accept='.jpg'
                            onChange={(e) =>  { setImage(e.currentTarget.files[0]); setPreview(URL.createObjectURL(e.currentTarget.files[0])) } } />
                    </Form.Group>
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
                                <Form.Label>State (defined from map)</Form.Label>
                                <Form.Control required={true} value={state} disabled readOnly></Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Region (defined from map)</Form.Label>
                                <Form.Control required={true} value={region} disabled readOnly></Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Province (defined from map)</Form.Label>
                                <Form.Control required={true} value={province} disabled readOnly></Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Municipality (defined from map)</Form.Label>
                                <Form.Control required={true} value={municipality} disabled readOnly></Form.Control>
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
                                <HutMap setLatitude={setLatitude} setLongitude={setLongitude} setState={setState} setRegion={setRegion} setProvince={setProvince} setMunicipality={setMunicipality} />
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

export default HutForm;