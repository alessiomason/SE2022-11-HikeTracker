import { Alert, Form } from 'react-bootstrap';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { default as Img1 } from "../images/img1.jpg";
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/HikeForm.css';

function ParkingForm(props) {

    const navigate = useNavigate();


    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [province, setProvince] = useState('');
    const [municipality, setMunicipality] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        if (label.trim().length === 0)
            setErrorMsg('The label of the hike cannot be consisted of only empty spaces');
        else {
            const newParkingLot = { 
                label: label,
                description: description,
                province: province,
                municipality: municipality,
                lat:2.0,
                lon:2.0,
                altitude:2.0
            }
            props.addParkingLot(newParkingLot);
            props.setDirty(true);
            navigate('/parkingManager');
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="hike_form-title">Add new Parking Lot</h1>
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
                                <Form.Label>Label</Form.Label>
                                <Form.Control required={true} value={label} onChange={ev => setLabel(ev.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Municipality</Form.Label>
                                <Form.Control required={true} value={municipality} onChange={ev => setMunicipality(ev.target.value)} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Province</Form.Label>
                                <Form.Control required={true} value={province} onChange={ev => setProvince(ev.target.value)} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} />
                            </Form.Group>
                            <Row className='my-3 box_btn'>
                                <Button variant="primary" className="btn_ref" >Add a reference point </Button>
                            </Row>
                            <Button className='save-button' type='submit' >Save</Button>
                            <Button className='back-button' onClick={() => navigate('/parkingManager')} variant='secondary' >Back</Button>
                        </Form>
                    </Col>
                </Row>
            </Row>
        </Container>
    );
}

export default ParkingForm;