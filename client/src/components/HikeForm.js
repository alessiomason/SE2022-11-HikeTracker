import { Container, Row, Col, Button,Alert, Form  } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HikeForm.css';
let gpxParser = require('gpxparser');

function HikeForm(props) {

    const navigate = useNavigate();

    const [file, setFile] = useState();
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        props.setInitialLoading(true);

        let gpx = new gpxParser(); //Create gpxParser Object
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

    useEffect(() => {
      window.scrollTo(0, 0)
    }, [])


    return (
      <Container fluid className="external-box-hike">
      <Container fluid className='internal-box-hut pb-3' >
        <Row>
          <Col>
            <h1 className="hike_form-title">Add new Hike</h1>
          </Col>
        </Row >
        <Row>
          <Col>
            {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Row className='box-add-hike'>
                <Form.Group controlId="formFile" className="mb-3 box-add-hike mt-4">
                  <Form.Label><h5 className='display pe-4'>Upload GPX File</h5></Form.Label>
                  <Form.Control type="file" accept='.gpx' onChange={(e) => setFile(e.target.files[0])} className="width" />
                </Form.Group>
              </Row>
              <Row className='box-add-hike mx-2 mt-3 mb-4'>
            <Button variant="danger" onClick={() => navigate('/hikeManager')} className="cancel-btn mx-2 mb-2" >Back</Button>
            <Button variant="success" type='submit' className="save-btn mx-2 mb-2" >Send</Button>
          </Row>
            </Form>
          </Col>
        </Row>
        </Container >
    </Container>
    );
}

export default HikeForm;