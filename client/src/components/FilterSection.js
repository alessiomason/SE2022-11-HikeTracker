import React, { useState, useEffect } from 'react';
import { Button, ListGroup, Modal, Col, Row, Form, Container, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import '../styles/FilterSection.css';
import { default as Close } from '../icons/close.svg';
import API from '../API.js';

function FilterSection(props) {

    const [modalShow, setModalShow] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

    return (

        <Container fluid className='filterSection'>
            <Row>
                <h1>Find your perfect destinations!</h1>
            </Row>
            <Row className='mt-5'>
                <Col md="auto" sm="auto" xs="auto" >
                    <ButtonToolbar aria-label="Toolbar with button groups" >
                        <ButtonGroup className='my-1' size="lg" aria-label="First group">
                            <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Length (meters)"); setDesc("Select a specific length:") }}>Length</Button>
                            <Button variant="success" onClick={() => { setModalShow(true); setTitle("Expected time"); setDesc("Select a specific expected time:") }}>Time</Button>
                            <Button variant="success" onClick={() => { setModalShow(true); setTitle("Ascent (meters)"); setDesc("Select a specific ascent:") }}>Ascent</Button>
                            <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Difficulty"); setDesc("Select a specific difficulty:") }}>Difficulty</Button>
                            <Button variant='success' className='btn_filter' onClick={() => { setModalShow(true); setTitle("Province"); setDesc("Select a specific province:") }}>Province</Button>
                            <Button variant='success' className='btn_filter' onClick={() => { setModalShow(true); setTitle("Municipality"); setDesc("Select a specific municipality:") }}>Municipality</Button>
                        </ButtonGroup>
                        <ButtonGroup size="lg" className='my-1 me-2'>
                            <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Start point"); setDesc("Select a specific start point:") }}>Start point</Button>
                            <Button variant="success" onClick={() => { setModalShow(true); setTitle("End point"); setDesc("Select a specific end point:") }}>End point</Button>
                            <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Reference points"); setDesc("Select reference points:") }}>Reference points</Button>
                        </ButtonGroup>
                        <ButtonGroup className="my-1" aria-label="Second group">
                            <Button variant="danger" onClick={() => { props.setMinLength(''); props.setMaxLength(''); props.setMinTime(''); props.setMaxTime(''); props.setMinAscent(''); props.setMaxAscent(''); props.setDifficulty(''); }}>Remove all filters</Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </Col>
            </Row>

            <MyModal show={modalShow} onHide={() => setModalShow(false)} hikes={props.hikes} title={title} desc={desc} minLength={props.minLength} setMinLength={props.setMinLength} maxLength={props.maxLength} setMaxLength={props.setMaxLength}
                minTime={props.minTime} setMinTime={props.setMinTime} maxTime={props.maxTime} setMaxTime={props.setMaxTime} minAscent={props.minAscent} setMinAscent={props.setMinAscent} maxAscent={props.maxAscent} setMaxAscent={props.setMaxAscent}
                difficulty={props.difficulty} setDifficulty={props.setDifficulty} municipality={props.municipality} setMunicipality={props.setMunicipality} province={props.province} setProvince={props.setProvince} startPoint={props.startPoint} setStartPoint={props.setStartPoint} refPoint={props.refPoint} setRefPoint={props.setRefPoint} endPoint={props.endPoint} setEndPoint={props.setEndPoint} />
            <Row className='mt-3'>
                <ButtonToolbar aria-label="Toolbar with button groups" >
                    {props.minLength && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2'>Minimum length: {props.minLength} m <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' /></Button>}
                    {props.maxLength && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2'>Maximum length: {props.maxLength} m <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setMaxLength('')} /></Button>}
                    {props.minTime && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2'>Minimum time: {props.minTime} h <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' /></Button>}
                    {props.maxTime && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2'>Maximum time: {props.maxTime} h <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' /></Button>}
                    {props.minAscent && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2'>Minimum ascent: {props.minAscent} m <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' /></Button>}
                    {props.maxAscent && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2'>Maximum ascent: {props.maxAscent} m <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' /></Button>}
                    {props.difficulty && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2'>Difficulty: {props.difficulty} m <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' /></Button>}

                </ButtonToolbar>
            </Row>
        </Container>

    );
}

function MyModal(props) {

    const [startPoints, setStartPoints] = useState([]);
    const [endPoints, setEndPoints] = useState([]);
    const [refPoints, setRefPoints] = useState([]);
    const [tempMinLength, setTempMinLength] = useState(props.minLength);
    const [tempMaxLength, setTempMaxLength] = useState(props.maxLength);
    const [tempMinTime, setTempMinTime] = useState(props.minTime);
    const [tempMaxTime, setTempMaxTime] = useState(props.maxTime);
    const [tempMinAscent, setTempMinAscent] = useState(props.minAscent);
    const [tempMaxAscent, setTempMaxAscent] = useState(props.maxAscent);
    const [tempDifficulty, setTempDifficulty] = useState(props.difficulty);

    useEffect(() => {
        API.getStartPoint()
            .then((startPoints) => setStartPoints(startPoints))
            .catch(err => console.log(err))
    }, []);

    useEffect(() => {
        API.getEndPoint()
            .then((endPoints) => setEndPoints(endPoints))
            .catch(err => console.log(err))
    }, []);

    useEffect(() => {
        API.getReferencePoint()
            .then((refPoints) => setRefPoints(refPoints))
            .catch(err => console.log(err))
    }, []);

    const confirmButton = () => {
        if (props.title == 'Difficulty' && tempDifficulty !== props.difficulty)
            props.setDifficulty(tempDifficulty);
        if (props.title == 'Length (meters)' && tempMinLength !== props.minLength)
            props.setMinLength(tempMinLength);
        if (props.title == 'Length (meters)' && tempMaxLength !== props.maxLength)
            props.setMaxLength(tempMaxLength);
        if (props.title == 'Expected time' && tempMinTime !== props.minTime)
            props.setMinTime(tempMinTime);
        if (props.title == 'Expected time' && tempMaxTime !== props.maxTime)
            props.setMaxTime(tempMaxTime);
        if (props.title == 'Ascent (meters)' && tempMinAscent !== props.minAscent)
            props.setMinAscent(tempMinAscent);
        if (props.title == 'Ascent (meters)' && tempMaxAscent !== props.maxAscent)
            props.setMaxAscent(tempMaxAscent);
    }

    return (

        <Modal {...props} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body >
                <Container>
                    {(props.title == "Difficulty") ?
                        <Row>
                            <Col md="auto" sm="auto" xs="auto">
                                <Button variant="success" size="sm" className='m-1' value={1} onClick={event => setTempDifficulty(event.target.value)}>Tourist</Button>
                            </Col>
                            <Col md="auto" sm="auto" xs="auto">
                                <Button variant="warning" size="sm" className='m-1' value={2} onClick={event => setTempDifficulty(event.target.value)}>Hiker</Button>
                            </Col>
                            <Col md="auto" sm="auto" xs="auto">
                                <Button variant="dark" size="sm" className='m-1' value={3} onClick={event => setTempDifficulty(event.target.value)}>Professional hiker</Button>
                            </Col>
                        </Row> :
                        (props.title === 'Length (meters)') ?
                            <Row className="mb-2 modal_label">
                                <Form.Group className="mb-3">
                                    <Form.Label>Enter min length (in meters)</Form.Label>
                                    <Form.Control type="number" placeholder="Min"
                                        value={tempMinLength} onChange={event => setTempMinLength(event.target.value)} />
                                    <Form.Label>Enter max length (in meters)</Form.Label>
                                    <Form.Control type="number" placeholder="Max"
                                        value={tempMaxLength} onChange={event => setTempMaxLength(event.target.value)} />
                                </Form.Group>
                            </Row> :
                            (props.title === 'Expected time') ?
                                <Row className="mb-2 modal_label">
                                    <Form.Label>Enter min time (in hours)</Form.Label>
                                    <Form.Control type="number" placeholder="Min"
                                        value={tempMinTime} onChange={event => setTempMinTime(event.target.value)} />
                                    <Form.Label>Enter max time (in hours)</Form.Label>
                                    <Form.Control type="number" placeholder="Max"
                                        value={tempMaxTime} onChange={event => setTempMaxTime(event.target.value)} />
                                </Row> :
                                (props.title == 'Ascent (meters)') ?
                                    <Row className="mb-2 modal_label">
                                        <Form.Label>Enter min ascent (in meters)</Form.Label>
                                        <Form.Control type="number" placeholder="Min"
                                            value={tempMinAscent} onChange={event => setTempMinAscent(event.target.value)} />
                                        <Form.Label>Enter max ascent (in meters)</Form.Label>
                                        <Form.Control type="number" placeholder="Max"
                                            value={tempMaxAscent} onChange={event => setTempMaxAscent(event.target.value)} />
                                    </Row> : 'false'

                    }
                </Container>
            </Modal.Body>

            <Modal.Footer>
                <Row>
                    <Col md="auto" sm="auto" xs="auto">
                        <Button variant="danger" onClick={props.onHide}>Cancel</Button>
                    </Col>
                    <Col md="auto" sm="auto" xs="auto" >
                        <Button variant="primary" onClick={() => { confirmButton(); props.onHide(); }}>Confirm</Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
    );
}

export default FilterSection;
