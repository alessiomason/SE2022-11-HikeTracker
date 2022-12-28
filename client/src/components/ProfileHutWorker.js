import { useNavigate } from "react-router-dom";
import { Button, Navbar, Nav, Container, Row, Col, Form, OverlayTrigger, Tooltip, FloatingLabel, Image, Modal, Alert } from "react-bootstrap";

import '../styles/ProfileLocalGuide.css';
import React, { useState, useEffect } from 'react';

import { default as Img1 } from '../images/img1.jpg';
import { default as Email } from "../icons/email.svg";
import { default as Parking } from "../icons/parking.svg";
import { default as Hut } from "../icons/hut.svg";
import { default as Hike } from "../icons/hiking.svg";
import { default as Alert1 } from "../icons/alert.svg";
import { default as User } from '../icons/user.svg';

import '../styles/ProfileHutWorker.css';

import { default as Close2 } from '../icons/close2.svg';
import { func } from "prop-types";



function ProfileHutWorker(props) {

  const [task1, setTask1] = useState(true);

  return (
    <Container fluid className="">
      <Row className="box-btn mb-5">
        <Button className={task1 ? 'user-btn-fix me-2' : 'user-btn me-2'} onClick={() => setTask1(true)}> Your Hut </Button>
        <Button className={!task1 ? 'user-btn-fix ms-2 ' : 'user-btn ms-2'} onClick={() => setTask1(false)}> Hike Condition </Button>
      </Row>
      {task1 ? <YourHut /> : <HikeCondition />}

    </Container>
  );
}

function YourHut() {

  const imgs = [
    { id: 0, value: require('../images/img1.jpg') },
    { id: 1, value: require('../images/img2.jpg') },
    { id: 2, value: require('../images/img3.jpg') },
    { id: 3, value: require('../images/img4.jpg') },
    { id: 4, value: require('../images/img5.jpg') },
    { id: 5, value: require('../images/img6.jpg') },
    { id: 6, value: require('../images/img7.jpg') },
  ]

  const [mainImg, setMainImg] = useState(imgs[0]);
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);

  return (
    <Container fluid className="">
      <MyImageModal show={modalShow} onHide={() => setModalShow(false)} />
      <Row className="hut-man-box py-5 px-2  ">
        <Col md={5}  >
          <Container fluid>
            <Row className="box_img ">
              <img className=" main_img  hut-man-img" src={mainImg.value} alt="main_image" onClick={() => setModalShow(true)} />
              <Button variant="danger" className="close_btn">
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}>
                  <img src={Close2} alt="user_image" className="x-img " />
                </OverlayTrigger>
              </Button>
            </Row>
            <Row className="thumb_row">
              {imgs.map((item, index) => (
                <Button key={index} className="hut-man-box-thumb mb-2" >
                  <img className={mainImg.id == index ? "hut-man-clicked thumb_img" : "thumb_img"} src={item.value} alt="hut images" onClick={() => setMainImg(imgs[index])} />
                </Button>
              ))}
            </Row>
            <Row className="center-box mt-3 mb-5">
              <Button className="upload_btn"> Upload Image </Button>
            </Row>
          </Container>
        </Col>

        <Col md={7} className="px-3 hut-label">
          <Form >
            <Row>
              <Col md={6} >
                <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                  <Form.Control required={true} type="text" placeholder="Rifugio x" />
                </FloatingLabel>
              </Col>
              <Col md={6} >
                <FloatingLabel controlId="floatingInput" label="Ascent" className="mb-3">
                  <Form.Control required={true} type="text" placeholder="2400 m" />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={6} >
                <FloatingLabel controlId="floatingInput" label="State" className="mb-3">
                  <Form.Control required={true} type="text" disabled readOnly value={"Italia"}></Form.Control>
                </FloatingLabel>
              </Col>
              <Col md={6} >
                <FloatingLabel controlId="floatingInput" label="Region" className="mb-3">
                  <Form.Control required={true} type="text" disabled readOnly value={"Piemonte"}></Form.Control>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={6} >
                <FloatingLabel controlId="floatingInput" label="Province" className="mb-3">
                  <Form.Control required={true} type="text" disabled readOnly value={"Torino"}></Form.Control>
                </FloatingLabel>
              </Col>
              <Col md={6} >
                <FloatingLabel controlId="floatingInput" label="Municipality" className="mb-3">
                  <Form.Control required={true} type="text" disabled readOnly value={"Torino"}></Form.Control>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={6} >
                <FloatingLabel controlId="floatingInput" label="Number of beds" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} placeholder="#" />
                </FloatingLabel>
              </Col>
              <Col md={6} >
                <FloatingLabel controlId="floatingInput" label="Phone number" className="mb-3">
                  <Form.Control required={true} type="text" placeholder="+39 xxx xxx xxxx"></Form.Control>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={6} >
                <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                  <Form.Control required={true} type="email" placeholder="name@example.com"></Form.Control>
                </FloatingLabel>
              </Col>
              <Col md={6} >
                <FloatingLabel controlId="floatingInput" label="Website (optional)" className="mb-3">
                  <Form.Control type="text" placeholder="nameexample.com" ></Form.Control>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12} >
                <FloatingLabel controlId="floatingTextarea2" label="Description" className="mb-3">
                  <Form.Control as="textarea" style={{ height: '100px' }} placeholder="description" />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className='btn_box mt-3'>
              <Button variant="danger" className="cancel-btn mx-2 mb-2" >Undo</Button>
              <Button variant="success" type='submit' className="save-btn mx-2 mb-2">Save</Button>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

function MyImageModal(props) {
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
      <Modal.Header closeButton className='box-modal man-hut-page-modal-header'>
        <Modal.Title id="contained-modal-title-vcenter">
          YOUR HUT
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='box-modal man-hut-page-modal-body'>
        <img src={Img1} alt="photo" className="modal-imgs" />
      </Modal.Body>

    </Modal>
  );
}

function HikeCondition() {

  const [show, setShow] = useState(false);

  return (
    <>

      {show ? <Row className="mb-4">
        <Col md={{ span: 6, offset: 3 }} sm={{ span: 8, offset: 2 }} xs={12}>
          <Alert variant="success" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>Update Hike Condition with success!</Alert.Heading>
          </Alert>
        </Col>
      </Row> : false}

      <Row className=" val-user-box3 mx-5 p-4">
        <Col md={2} className="box-center margin-bottom">
          <img src={Alert1} alt="user_image" />
        </Col>
        <Col md={3} className="align margin-bottom box-center">
          <FloatingLabel controlId="floatingSelect" label="Hike Condition" className="form-sel2">
            <Form.Select aria-label="Floating label select example" placeholder="Select an Hike Condition">
              <option>~ Choose a Condition ~</option>
              <option value="1"> Open</option>
              <option value="2">Close</option>
              <option value="3">Partly blocked</option>
              <option value="4">Requires special gear</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col md={5} className="align margin-bottom box-center ">
          <FloatingLabel controlId="floatingTextarea2" label="Description" className="form-desc">
            <Form.Control as="textarea" style={{ height: '80px' }} placeholder="description" />
          </FloatingLabel>
        </Col>
        <Col md={2} className="box-center">
          <Row className='btn_box mt-3'>
            <Button variant="success" type='submit' className="save-btn mx-2 mb-2" onClick={() => setShow(true)}>Save</Button>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default ProfileHutWorker;