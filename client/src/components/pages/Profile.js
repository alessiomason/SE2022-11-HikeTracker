import { useNavigate} from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import API from '../../API.js';

import '../../styles/Profile.css';

import React, { useState, useEffect } from 'react';
import { default as Img1 } from '../../images/img1.jpg';

import ProfileManager from '../ProfileManager';
import ProfileLocalGuide from '../ProfileLocalGuide';
import ProfileHutWorker from "../ProfileHutWorker";
import ProfileHiker from "../ProfileHiker";

function Profile(props) {
  const rolesNames = {
    'hiker': 'Hiker',
    'local-guide': 'Local guide',
    'hut-worker': 'Hut worker',
    'manager': 'Platform manager',
    'emergency-operator': 'Emergency operator'
  };


  return (
    <Container fluid className="external-box-profile">
      <Container fluid className='internal-box-profile' >
        <Row className="center-top">
          <div className="overflow-profile">
            <img src={Img1} alt="profile_photo" className="profile-img" />
          </div>
          <h1 className="profile-role">{props.user.surname}</h1>
        </Row>
        <Row >
          <Col md={4} className="center-top-side mb-4">
            <Container>
              <Row>
                <Col md={3}>
                  <h4 className="pe-2 mb-0 email" id="fadeshow1">Email:</h4>
                </Col>
                <Col md={8}>
                  <h3 className="profile-email">{props.user.email}</h3>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <h4 className="pe-2 mb-0 email" id="fadeshow1">Role:</h4>
                </Col>
                <Col md={8}>
                  <h3 className="profile-email">{rolesNames[props.user.access_right]}</h3>
                </Col>
              </Row>
            </Container>
          </Col>
          <Col md={{ span: 4, offset: 4 }} className="center-top-side mb-4">
            <Button variant="warning" className="mx-4 profile-img-btn"> Update Photo </Button>
            <Button variant="danger" className="mx-4 logout-btn" onClick={props.doLogout}> Logout </Button>
          </Col>
        </Row>
        <Row className="end-top-profile" />
        <Row className="component">
          {<SpecificProfile  updateHut={props.updateHut} setDirty={props.setDirty} user={props.user} hikes={props.hikes} hut={props.hut}/>}
        </Row>
      </Container>
    </Container>
  );
}

function SpecificProfile(props) {

  

  switch (props.user.access_right) {
    case 'hiker':
      return (<ProfileHiker hikes={props.hikes} user={props.user} />);
    case 'local-guide':
      return (<ProfileLocalGuide />);
    case 'hut-worker':
      return (<ProfileHutWorker  setDirty={props.setDirty}  updateHut={props.updateHut} user= {props.user} hut={props.hut}/>);
    case 'manager':
      return (<ProfileManager />);
    default:
      return(<></>);
  }
}

export default Profile;