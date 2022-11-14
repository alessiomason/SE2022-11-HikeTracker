import React, { useState } from 'react';
import { Button, ListGroup, Modal, Col, Row, Form, Container, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import '../styles/FilterSection.css';

function FilterSection() {

  const [modalShow, setModalShow] = useState(false);
  const [title, setTitle] = useState(false);
  const [desc, setDesc] = useState(false); 

    return (

      <Container fluid className='filterSection'>
        <Row>
          <h1>Find your perfect destinations!</h1>
        </Row>
        <Row className='mt-5 '>
          <Col md="auto" sm="auto" xs="auto" >
            <ButtonToolbar aria-label="Toolbar with button groups" >
              <ButtonGroup className='my-1' size="lg" aria-label="First group">
                <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Length (kms)"); setDesc("Select a specific length:") }}>Length</Button>
                <Button variant="success" onClick={() => { setModalShow(true); setTitle("Expected time"); setDesc("Select a specific expected time:") }}>Time</Button>
                <Button variant="success" onClick={() => { setModalShow(true); setTitle("Ascent (meters)"); setDesc("Select a specific ascent:") }}>Ascent</Button>
                <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Difficulty"); setDesc("Select a specific difficulty:") }}>Difficulty</Button>
              </ButtonGroup>
              <ButtonGroup size="lg" className='my-1 me-2'>
                <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Start point"); setDesc("Select a specific start point:") }}>Start point</Button>
                <Button variant="success" onClick={() => { setModalShow(true); setTitle("End point"); setDesc("Select a specific end point:") }}>End point</Button>
                <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Reference points"); setDesc("Select reference points:") }}>Reference points</Button>
              </ButtonGroup>
              <ButtonGroup className="my-1" aria-label="Second group">
                <Button variant="danger">Remove filter</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Col>
        </Row>
        <MyModal show={modalShow} onHide={() => setModalShow(false)} title={title} desc={desc} />
      </Container>

    );
  }

  function MyModal(props) {

    return (
  
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.title}
          </Modal.Title>
        </Modal.Header>
  
        <Modal.Body >
          <Container>
            <Row className="mb-2 modal_label">
              <Col md="auto" sm="auto" xs="auto">
                <h6> {props.desc} </h6>
              </Col>
              {(props.title == "Start point" || props.title == "End point" || props.title == "Reference points") ?
                <Col md={6} sm={6} xs={6}>
                  <Form.Control autoFocus className="mx-3 my-2 w-auto" placeholder="Type to filter..." />
                </Col> : false
              }
            </Row>
            {(props.title == "Difficulty") ?
              <Row>
                <Col md="auto" sm="auto" xs="auto">
                  <Button variant="success" size="sm" className='m-1'>Tourist</Button>
                </Col>
                <Col md="auto" sm="auto" xs="auto">
                  <Button variant="warning" size="sm" className='m-1'>Hiker</Button>
                </Col>
                <Col md="auto" sm="auto" xs="auto">
                  <Button variant="dark" size="sm" className='m-1'>Professional hiker</Button>
                </Col>
              </Row> :
              (props.title == "Start point" || props.title == "End point" || props.title == "Reference points") ?
                <ListGroup variant="flush" >
                  <ListGroup.Item action>Cras justo odio</ListGroup.Item>
                  <ListGroup.Item action>Dapibus ac facilisis in</ListGroup.Item>
                  <ListGroup.Item action>Morbi leo risus</ListGroup.Item>
                  <ListGroup.Item action>Porta ac consectetur ac</ListGroup.Item>
                </ListGroup> :
                <Form.Range />}
          </Container>
        </Modal.Body>
  
        <Modal.Footer>
          <Row>
            <Col md="auto" sm="auto" xs="auto">
              <Button variant="danger" onClick={props.onHide}>Cancel</Button>
            </Col>
            <Col md="auto" sm="auto" xs="auto" >
              <Button variant="primary" onClick={props.onHide}>Confirm</Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    );
  }
  
  export default FilterSection;
  