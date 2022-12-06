import React, { useState,useEffect } from 'react';
import { Button, ListGroup, Modal, Col, Row, Form, Container, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import '../styles/FilterSection.css';
import { default as Close } from '../icons/close.svg';
import API from '../API.js';
import { default as Hiking } from '../icons/hiking.svg';

function FilterSection(props) {

  const [modalShow, setModalShow] = useState(false);
  const [title, setTitle] = useState(false);
  const [desc, setDesc] = useState(false); 

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Remove all filters
    </Tooltip>
  );
  
    return (

      <Container fluid className='filterSection' id="hikeSec">
        <Row> 
          <h2 class="background double filter-title"><span><img src={Hiking} alt="hiking_image" className='me-2 hike-img'/>Hikes</span></h2>
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
              <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip} >
                  <Button className="delete-btn"><img src={Delete} alt="delete_image" className='' onClick={ () => {props.setMinLength(0); props.setMaxLength(1000000); props.setMinTime(0); props.setMaxTime(24); props.setMinAscent(0); props.setMaxAscent(10000); props.setDifficulty(null); props.setStartPoint(null); props.setEndPoint(null); props.setRefPoint(null); props.setProvince(null); props.setMunicipality(null)  }} /></Button>
                </OverlayTrigger>
              </ButtonGroup>
              </ButtonToolbar>
          </Col>
        </Row>
        <MyModal show={modalShow} onHide={() => setModalShow(false)} hikes={props.hikes} title={title} desc={desc} minLength={props.minLength} setMinLength={props.setMinLength} maxLength={props.maxLength} setMaxLength={props.setMaxLength} 
                 minTime={props.minTime} setMinTime={props.setMinTime} maxTime={props.maxTime} setMaxTime={props.setMaxTime} minAscent={props.minAscent} setMinAscent={props.setMinAscent} maxAscent={props.maxAscent} setMaxAscent={props.setMaxAscent} 
                 difficulty={props.difficulty} setDifficulty={props.setDifficulty} municipality={props.municipality} setMunicipality={props.setMunicipality} province={props.province} setProvince={props.setProvince} startPoint={props.startPoint} setStartPoint={props.setStartPoint} refPoint={props.refPoint} setRefPoint={props.setRefPoint} endPoint={props.endPoint} setEndPoint={props.setEndPoint}/>
        <Row className='mt-3'>
          <ButtonToolbar aria-label="Toolbar with button groups" >
            <Button variant="info" disabled size="sm" className='mx-2 my-1 btn_info px-2'>Length: {props.minLength} - {props.maxLength} meters  {/*<img src={Close} alt="close" className='ms-1 my-1' />*/}</Button>
            <Button variant="info" disabled size="sm" className='mx-2 my-1 btn_info px-2'>Time: {props.minTime} - {props.maxTime}h {/*<img src={Close} alt="close" className='ms-1 my-1' />*/}</Button>
            <Button variant="info" disabled size="sm" className='mx-2 my-1 btn_info px-2'>Ascent: {props.minAscent} - {props.maxAscent} meters  {/*<img src={Close} alt="close" className='ms-1 my-1' />*/}</Button>
            <Button variant="info" disabled size="sm" className='mx-2 my-1 btn_info px-2'>Difficulty: {(props.difficulty)?props.difficulty:"all"} {/*<img src={Close} alt="close" className='ms-1 my-1' />*/}</Button>
            <Button variant="info" disabled size="sm" className='mx-2 my-1 btn_info px-2'>Province: {(props.province)?props.province:"all"} {/*<img src={Close} alt="close" className='ms-1 my-1' />*/}</Button>
            <Button variant="info" disabled size="sm" className='mx-2 my-1 btn_info px-2'>Municipality: {(props.municipality)?props.municipality:"all"} {/*<img src={Close} alt="close" className='ms-1 my-1' />*/}</Button>
            
            
          </ButtonToolbar>
        </Row>
      </Container>

    );
  }

  function MyModal(props) {

    // const [dirty, setDirty] = useState(true);
    const [startPoints,setStartPoints] = useState ([]);
    const [endPoints,setEndPoints] = useState ([]);
    const [refPoints,setRefPoints] = useState ([]);
    const [tempMinLength,setTempMinLength] = useState(0);
    const [tempMaxLength,setTempMaxLength] = useState(10000000);
    const [tempMinTime,setTempMinTime] = useState(0);
    const [tempMaxTime,setTempMaxTime] = useState(24);
    const [tempMinAscent,setTempMinAscent] = useState(0);
    const [tempMaxAscent,setTempMaxAscent] = useState(10000);
    const [tempDifficulty,setTempDifficulty] = useState(0);
    const [tempMunicipality,setTempMunicipality] = useState('');
    const [tempProvince,setTempProvince] = useState('');
    const [tempStartPoint,setTempStartPoint] = useState ('');
    const [tempEndPoint,setTempEndPoint] = useState ('');
    const [tempRefPoint,setTempRefPoint] = useState ('');
    

  
    
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
  

      console.log("province: " + props.province);
      console.log("municipality: " + props.municipality);

    const confirmButton = () =>{
      if (props.title == 'Difficulty' && tempDifficulty !== props.difficulty  ){
      props.setDifficulty(tempDifficulty);}
      else if(props.title == 'Length (meters)' && tempMinLength !== props.minLength ){
        props.setMinLength(tempMinLength);
      }
      else if(props.title == 'Length (meters)' && tempMaxLength !== props.maxLength ){
        props.setMaxLength(tempMaxLength);
      }
      else if(props.title == 'Expected time' && tempMinTime !== props.minTime ){
        props.setMinTime(tempMinTime);
      }
      else if(props.title == 'Expected time' && tempMaxTime !== props.maxTime ){
        props.setMaxTime(tempMaxTime);
      }
      else if(props.title == 'Ascent (meters)' && tempMinAscent !== props.minAscent ){
        props.setMinAscent(tempMinAscent);
      }
      else if(props.title == 'Ascent (meters)' && tempMaxAscent !== props.maxAscent ){
        props.setMaxAscent(tempMaxAscent);
      }
      else if(props.title == 'Start point' && tempStartPoint !== props.startPoint ){
        props.setStartPoint(tempStartPoint);
      }
      else if(props.title == 'End point' && tempEndPoint !== props.endPoint ){
        props.setEndPoint(tempEndPoint);
      }
      else if(props.title == 'Reference points' && tempRefPoint !== props.refPoint ){
        props.setRefPoint(tempRefPoint);
      }
      else if(props.title == 'Province' && tempProvince !== props.province   ){
        props.setProvince(tempProvince);
        
      }
      else if(props.title == 'Municipality' && tempMunicipality !== props.municipality){
        props.setMunicipality(tempMunicipality);
      }
      
    }


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
                {/* <h6> {props.desc} </h6> */}
              </Col>
              {/* {(props.title == "Start point" || props.title == "End point" || props.title == "Reference points") ?
                <Col md={6} sm={6} xs={6}>
                  <Form.Control autoFocus className="mx-3 my-2 w-auto" placeholder="Type to filter..." />
                </Col> : false
              } */}
            </Row>
            {(props.title == "Difficulty") ?
              <Row>
              <Col md="auto" sm="auto" xs="auto">
                <Button variant="success" size="sm" className='m-1' value={1} onClick={ event => setTempDifficulty(event.target.value)}>Tourist</Button>
              </Col>
              <Col md="auto" sm="auto" xs="auto">
                <Button variant="warning" size="sm" className='m-1' value={2} onClick={event => setTempDifficulty(event.target.value)}>Hiker</Button>
              </Col>
              <Col md="auto" sm="auto" xs="auto">
                <Button variant="dark" size="sm" className='m-1' value={3} onClick={event => setTempDifficulty(event.target.value)}>Professional hiker</Button>
              </Col>
              </Row>:
              (props.title == "Start point") ?
              <Row className='mb-3 box_centered'>
                {startPoints.map(sp => {
                  return (
                      <ListGroup variant="flush" key={sp.pointID} >
                        <ListGroup.Item action value={sp.hikeID} onClick={event =>setTempStartPoint(event.target.value)}>{sp.label}</ListGroup.Item>
                      </ListGroup>
                  );
                })}
              </Row>:
                 ( props.title == "End point")?
                 <Row className='mb-3 box_centered'>
                 {endPoints.map(sp => {
                   return (
                       <ListGroup variant="flush" key={sp.pointID} >
                         <ListGroup.Item action value={sp.hikeID} onClick={event =>setTempEndPoint(event.target.value)}>{sp.label}</ListGroup.Item>
                       </ListGroup>
                   );
                 })}
               </Row>:
              (props.title == "Reference points")?
              <Row className='mb-3 box_centered'>
              {refPoints.map(sp => {
                return (
                    <ListGroup variant="flush" key={sp.pointID} >
                      <ListGroup.Item action value={sp.hikeID} onClick={event =>setTempRefPoint(event.target.value)}>{sp.label}</ListGroup.Item>
                    </ListGroup>
                );
              })}
            </Row>:
              (props.title == "Province") ? 
              <Form.Select className="my-3" aria-label="Select a province" onChange={event => setTempProvince(event.target.value)}>
              <option>Select a province</option>
                {props.hikes.map(sp => {
                  return (
                    <option value={sp.province}>{sp.province}</option>
                  );
                })}
                </Form.Select>:
                (props.title == "Municipality") ?
                <Form.Select className="my-3" aria-label="Select a municipality" onChange={event => setTempMunicipality(event.target.value)}>
              <option>Select a municipality</option>
                {props.hikes.map(sp => {
                  return (
                    <option value={sp.municipality}>{sp.municipality}</option>
                  );
                })}
                </Form.Select>:
              (props.title === 'Length (meters)' )?
              <Row className="mb-2 modal_label">
                <Form.Group className="mb-3">
                  <Form.Label>Enter min length (in meters)</Form.Label>
                  <Form.Control type="number" placeholder="Min"
                  value={tempMinLength} onChange={ event => setTempMinLength(event.target.value) } />
                  <Form.Label>Enter max length (in meters)</Form.Label>
                  <Form.Control type="number" placeholder="Max"
                  value={tempMaxLength} onChange={ event => setTempMaxLength(event.target.value) } />
                  </Form.Group>
              </Row>:
              (props.title === 'Expected time')?
                  <Row className="mb-2 modal_label">
                  <Form.Label>Enter min time (in hours)</Form.Label>
                  <Form.Control type="number" placeholder="Min"
                  value={tempMinTime} onChange={ event => setTempMinTime(event.target.value) } />
                  <Form.Label>Enter max time (in hours)</Form.Label>
                  <Form.Control type="number" placeholder="Max"
                  value={tempMaxTime} onChange={ event => setTempMaxTime(event.target.value) } />
                  </Row>:
              (props.title == 'Ascent (meters)')?
              <Row className="mb-2 modal_label">
              <Form.Label>Enter min ascent (in meters)</Form.Label>
                  <Form.Control type="number" placeholder="Min"
                  value={tempMinAscent} onChange={ event => setTempMinAscent(event.target.value) } />
                  <Form.Label>Enter max ascent (in meters)</Form.Label>
                  <Form.Control type="number" placeholder="Max"
                  value={tempMaxAscent} onChange={ event => setTempMaxAscent(event.target.value) } />
              </Row>:false
                        
            }
          </Container>
        </Modal.Body>
  
        <Modal.Footer>
          <Row>
            <Col md="auto" sm="auto" xs="auto">
              <Button variant="danger" onClick={props.onHide}>Cancel</Button>
            </Col>
            <Col md="auto" sm="auto" xs="auto" >
              <Button variant="primary" onClick={()=>{confirmButton(); props.onHide();}}>Confirm</Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    );
  }
  
  export default FilterSection;
  