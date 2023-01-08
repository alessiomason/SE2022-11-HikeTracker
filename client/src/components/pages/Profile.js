import { Button, Container, Row, Col } from "react-bootstrap";

import {  useEffect } from 'react';
import '../../styles/Profile.css';

import React from 'react';
import { default as User } from '../../images/user.png';

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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Container fluid className="external-box-profile">
      <Container fluid className='internal-box-profile' >
        <Row className="center-top ">
          <div className="overflow-profile">
            <img src={User} alt="profile_photo" className="profile-img" />
          </div>
          <h1 className="profile-role ">{props.user.surname} {props.user.name}</h1>
        </Row>
        <Row className="sub-title-profile center-box2">
          <Col md={4} className='box-center'>
            <h4 className="pe-2 mb-0 email" >Email:</h4>
            <h3 className="profile-email">{props.user.email}</h3>
          </Col>
          <Col md={4} className='box-center'>
            <h4 className="pe-2 mb-0 email" >Role:</h4>
            <h3 className="profile-email">{rolesNames[props.user.access_right]}</h3>
          </Col>
          {(props.user.access_right == "local-guide" || props.user.access_right == "hut-worker") ?
            <Col md={4} className='box-center'>
              <h4 className="pe-2 mb-0 email" >Phone:</h4>
              <h3 className="profile-email">{props.user.phone}</h3>
            </Col> : false}
        </Row>
        <Row>
          <Col md={12} className="center-top-side mb-4">
            <Button variant="danger" className="mx-4 logout-btn" onClick={props.doLogout}> Logout </Button>
          </Col>
        </Row>
        <Row className="end-top-profile" />
        <Row className="component">
          {<SpecificProfile updateHut={props.updateHut} setDirty={props.setDirty} user={props.user} hikes={props.hikes} hut={props.hut} />}
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
      return (<ProfileHutWorker setDirty={props.setDirty} updateHut={props.updateHut} user={props.user} hut={props.hut} />);
    case 'manager':
      return (<ProfileManager />);
    default:
      return (<></>);
  }
}

export default Profile;