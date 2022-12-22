import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";

import '../../styles/Profile.css';
import React from 'react';
import { default as Img1 } from '../../images/img1.jpg';

import ProfileManager from '../ProfileManager';
import ProfileLocalGuide from '../ProfileLocalGuide';
import ProfileHutWorker from "../ProfileHutWorker";

function Profile(props) {


  return (
    <Container fluid className="external-box-profile">
      <Container fluid className='internal-box-profile' >
        <Row className="center-top">
          <div className="overflow-profile">
            <img src={Img1} alt="profile_photo" className="profile-img" />
          </div>
          <h1 className="profile-role"> PLATFORM MANAGER </h1>
        </Row>
        <Row >
          <Col md={4} className="center-top-side mb-4">
            <Col md={3}>
              <h4 className="pe-2 mb-0 email" id="fadeshow1"> Email: </h4>
            </Col>
            <Col md={8}>
              <h3 className="profile-email"> tracker@gmail.com</h3>
            </Col>
          </Col>
          <Col md={{ span: 4, offset: 4 }} className="center-top-side mb-4">
            <Button variant="warning" className="mx-4 profile-img-btn"> Update Photo </Button>
            <Button variant="danger" className="mx-4 logout-btn" onClick={props.doLogout}> Logout </Button>
          </Col>
        </Row>
        <Row className="end-top-profile" />
        <Row className="component">
           {<ProfileLocalGuide />}
          {/*<ProfileManager />*/} 
          {/*<ProfileHutWorker />*/ }
          {/*<ProfileHiker /> */}
        </Row>
      </Container>
    </Container>
  );
}

export default Profile;