import { Container, Row, Col, Button, Alert, Form, FloatingLabel } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HikeForm.css';

import { default as Img1 } from "../images/img1.jpg";

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

  
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [formShow, setFormShow] = useState(false);

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

        {!formShow ? 
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
            <Button variant="success" type='submit' className="save-btn mx-2 mb-2" onClick={() => setFormShow(true)}>Send</Button>
          </Row>
            </Form>
          </Col>
        </Row> : 
        
        <Form onSubmit={handleSubmit}>
          <Row className="hut_box px-5 pt-5">
            <Col md={4} className="box_img_box" >
              <img className=" img_box-hike mb-3"
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
              <Row className='man-hike-label'>
                <Col md={12}>
                  <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                    <Form.Control required={true} value={"name"} type="text" placeholder="Rifugio x" />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className='man-hike-label'>
                <Col md={6}>
                <FloatingLabel controlId="floatingInput" label="Length [m]" className="mb-3">
                <Form.Control required={true} type='number' step="any" min={0} value={"length"} />
              </FloatingLabel>
                </Col>
                <Col md={6}>
                <FloatingLabel controlId="floatingInput" label="Ascent [m]" className="mb-3">
                    <Form.Control required={true} type='number' step="any" value={"altitude"}  placeholder="2400" />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className='man-hike-label'>
                <Col md={6}>
                <FloatingLabel controlId="floatingInput" label="Expected time [h] " className="mb-3">
                    <Form.Control required={true} type='number' step="any" min={0} value={"expTime"}  />
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                <FloatingLabel controlId="floatingSelect" label="Difficulty" className="form-sel2 mb-3">
                    <Form.Select aria-label="Floating label select example" placeholder="Select an Hike Condition" required={true} value={"difficultyText"}>
                      <option>~ Choose a Difficulty ~</option>
                      <option>Tourist</option>
                      <option>Hiker</option>
                      <option>Professional hiker</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className='man-hike-label'>
                <Col md={12}>
                  <FloatingLabel controlId="floatingTextarea2" label="Description" className="mb-3">
                    <Form.Control required={true} value={"description"}  as="textarea" style={{ height: '130px' }} placeholder="description" />
                  </FloatingLabel>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="hut_box px-5 man-hike-label">
            <Col md={8} >

                {/* Mettere qui la mappa  */}

            </Col>
            <Col md={4}>
              <Row className='mt-2'>
                <h5 >Choose a Point on the Map</h5>
              </Row>
              <Row >
                <Col md={12} >
                  <FloatingLabel controlId="floatingInput" label="State" className="mb-3 mt-3">
                    <Form.Control required={true} value={"state"} type="text" disabled readOnly ></Form.Control>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FloatingLabel controlId="floatingInput" label="Region" className="mb-3">
                    <Form.Control required={true} value={"region"} type="text" disabled readOnly ></Form.Control>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FloatingLabel controlId="floatingInput" label="Province" className="mb-3">
                    <Form.Control required={true} value={"province"} type="text" disabled readOnly ></Form.Control>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FloatingLabel controlId="floatingInput" label="Municipality" className="mb-3">
                    <Form.Control required={true} value={"municipality"} type="text" disabled readOnly ></Form.Control>
                  </FloatingLabel>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className='btn_box mx-2 mt-3 my-new'>
            <Button variant="danger" onClick={() => navigate('/hikeManager')} className="cancel-btn mx-2 mb-2" >Back</Button>
            <Button variant="success" type='submit' className="save-btn mx-2 mb-2">Save</Button>
          </Row>
        </Form>
        }
        


        
      </Container >
    </Container>
  );
}

export default HikeForm;
