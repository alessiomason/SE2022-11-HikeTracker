import { Alert, Form } from 'react-bootstrap';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HikeForm.css';
let gpxParser = require('gpxparser');

function HikeForm(props) {

    const navigate = useNavigate();

    /*
  const [label, setLabel] = useState('');
  const [length, setLength] = useState('');
  const [expTime, setExpTime] = useState('');
  const [ascent, setAscent] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [description, setDescription] = useState('');
  */
    const [file, setFile] = useState();
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        props.setInitialLoading(true);

        var gpx = new gpxParser(); //Create gpxParser Object
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function () {

            gpx.parse(reader.result);
            let geoJSON = gpx.toGeoJSON();
            console.log(geoJSON);
            props.addGPXTrack(geoJSON);
        };

        reader.onerror = function () {
            console.log(reader.error);
        };

        navigate("/");
    }

    return (
        <Container>
            <Row>
                <Col><h1 className="hike_form-title">Create new hike</h1></Col>
            </Row>
            <Row>
                <Col>
                    {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload GPX File</Form.Label>
                            <Form.Control type="file"
                                onChange={(e) => setFile(e.target.files[0])} />
                        </Form.Group>
                        <Button className='save-button' type='submit'>Send</Button>
                        <Button className='back-button' onClick={() => navigate('/hikeManager')} variant='secondary'>Back</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default HikeForm;
