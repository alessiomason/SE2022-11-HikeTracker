import { Col, Form, ButtonGroup, ButtonToolbar, Nav, Row, ListGroup, Navbar, Container, NavDropdown, Table, Button, Alert, } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
let gpxParser = require('gpxparser');

function MyGPXLayout(props) {

    const [file, setFile] = useState();

    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        var gpx = new gpxParser(); //Create gpxParser Object
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function () {
            
            gpx.parse(reader.result); 
            let geoJSON = gpx.toGeoJSON();
            console.log(reader.result);
            console.log(geoJSON);
            props.addGPXTrack(geoJSON);
        };

        reader.onerror = function () {
            console.log(reader.error);
        };

        navigate("/");
    }



    return (
        <>
            <Container>
                <Row>
                    <Col>
                        {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Upload GPX File</Form.Label>
                                <Form.Control type="file"
                                    onChange={(e) => setFile(e.target.files[0])} />
                            </Form.Group>
                            <Button className='m-3' type='submit' >Save</Button>
                        </Form>
                    </Col>
                </Row>
         
                
            </Container>
        </>
    );


}



export default MyGPXLayout;