import { Button, Container, Row, Col, Form, OverlayTrigger, Tooltip } from "react-bootstrap";

import '../styles/ProfileManager.css';
import React, { useState } from 'react';
import { default as Location } from "../icons/map.svg";
import { default as Radius } from "../icons/radius.svg";
import { default as Delete } from "../icons/delete.svg";

import { default as Alert1 } from "../icons/alert.svg";

function ProfileManager(props) {


  const [task1, setTask1] = useState(true);

  return (
    <Container fluid className="">
      <Row className="box-btn mb-5">
        <Button className={task1 ? 'user-btn-fix me-2' : 'user-btn me-2'} onClick={() => setTask1(true)}> Validate User </Button>
        <Button className={!task1 ? 'user-btn-fix ms-2 ' : 'user-btn ms-2'} onClick={() => setTask1(false)}> Weather Alert </Button>
      </Row>
      {task1 ? <ValidateUser/> : <WeatherAlert/>} 
      
    </Container>
);
}

function ValidateUser(props){

  const [approved, setApproved] = useState(true);

  return (
    <Row className={approved ? "val-user-box mx-5 mb-4 p-4" : "val-user-box2 mx-5 mb-4 p-4"}>
        <Col md={4}>
          <h5> Local Guide</h5>
        </Col>
        <Col md={4} className="box-center">
          <h4> tracker@gmail.com </h4>
        </Col>
        <Col md={{offset:2, span:2}}>
        <Form>
      <Form.Check type="switch" id="custom-switch" label={approved ? "Approved" : "Not Approved"} onClick={() => {approved ? setApproved(false) : setApproved(true)}} />
    </Form>
        </Col>
      </Row>
  );
}

function WeatherAlert(props){

  const [newAlert, setNewAlert] = useState(false);

  return (
    <>
    <Row className={!newAlert ? "box-btn" : " box-Alert val-user-box mx-5 mb-4 p-4"}>
      {!newAlert ? <Button className="log_btn" onClick={() => setNewAlert(true)}> Create a new Weather Alert </Button> :
        <Row >
          <Col md={5} >
            <Row >
              <Col md={12} className=" map-box">
                {/* bisogna metterci la mappa */}
              </Col>
            </Row>
            <Row className="mt-3 box-btn">
              <Col xs={1} className='slider-label'>1 km</Col>
              <Col xs={9}>
                <input type='range' min={1} max={5} step={1} className='my-slider' />
              </Col>
              <Col xs={1} className='slider-label'>500 km</Col>
            </Row>
          </Col>
          <Col md={{ span: 6, offset: 1 }}>
            <Row className="mt-3">
              <h3> Choose a map point and a radius: </h3>  
            </Row>
            <Row className=" mt-4">
              <Col md={12} className='mb-4 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Location</Tooltip>}>
                  <img src={Location} alt="location_image" className='me-3 profile-icon' />
                </OverlayTrigger>
                <h5 className="card-text p-card">{"Torino, TO, Piemonte, Italia"}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={12} className='mb-4 align'>
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Radius</Tooltip>}>
                  <img src={Radius} alt="radius_image" className='me-3' />
                </OverlayTrigger>
                <h5 className="card-text p-card">{"400 km"}</h5>
              </Col>
            </Row>
            <Row className="desc"> 
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control  as="textarea" rows={3} />
              </Form.Group>
            </Row>
            <Row className='btn_box mt-3'>
            <Button variant="danger"  className="cancel-btn mx-2 mb-2" onClick={() => setNewAlert(false)}>Cancel</Button>
            <Button variant="success" type='submit' className="save-btn mx-2 mb-2">Save</Button>
            </Row>
          </Col>
        </Row>}
    </Row>

    <Row className="val-user-box mx-5 mb-4 p-4 mt-5">
    <Col md={1} className="box-center margin-bottom">
          <img src={Alert1} alt="user_image" />
        </Col>
        <Col md={4} className="align margin-bottom">
        <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Location</Tooltip>}>
                  <img src={Location} alt="location_image" className='me-3 profile-icon' />
                </OverlayTrigger>
                <h6 className="card-text p-card">{"Torino, TO, Piemonte, Italia"}</h6>
        </Col>
        <Col md={2} className="align margin-bottom">
        <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Radius</Tooltip>}>
                  <img src={Radius} alt="radius_image" className='me-3' />
                </OverlayTrigger>
                <h6 className="card-text p-card">{"400 km"}</h6>
        </Col>
        <Col md={4} className="align margin-bottom">
          <Form.Control placeholder="Description" as="textarea" rows={2} />
        </Col>
        <Col md={1} className="box-center">
        <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}>
                <Button className="delete-btn"><img src={Delete} alt="delete_image" className='' /></Button>
              </OverlayTrigger>
        </Col>
      </Row>
      </>
  );
}



export default ProfileManager;