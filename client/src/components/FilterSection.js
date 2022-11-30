import React, { useState, useEffect } from 'react';
import { Button, ListGroup, Modal, Col, Row, Form, Container, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import '../styles/FilterSection.css';
import { default as Close } from '../icons/close.svg';
import API from '../API.js';
import { default as Hiking } from '../icons/hiking.svg';

function FilterSection(props) {

  const [modalShow, setModalShow] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const clearStates = () => {
    props.setMinLength('');
    props.setMaxLength('');
    props.setMinTime('');
    props.setMaxTime('');
    props.setMinAscent('');
    props.setMaxAscent('');
    props.setDifficulties(props.difficultiesList);
    props.setState('');
    props.setRegion('');
    props.setProvince('');
    props.setMunicipality('');
  }

  return (

    <Container fluid className='filterSection' id="hikeSec">
      <Row> 
        <h2 class="background double"><span><img src={Hiking} alt="hiking_image" className='me-2 hike-img'/>Hikes</span></h2>
      </Row>
      <Row className='mt-5'>
        <Col md="auto" sm="auto" xs="auto" >
          <ButtonToolbar aria-label="Toolbar with button groups" >
            <ButtonGroup className='my-1' size="lg" aria-label="First group">
              <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Length (meters)"); setDesc("Select a specific length:") }}>Length</Button>
              <Button variant="success" onClick={() => { setModalShow(true); setTitle("Expected time"); setDesc("Select a specific expected time:") }}>Time</Button>
              <Button variant="success" onClick={() => { setModalShow(true); setTitle("Ascent (meters)"); setDesc("Select a specific ascent:") }}>Ascent</Button>
              <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Difficulty"); setDesc("Select a specific difficulty:") }}>Difficulty</Button>
              <Button variant='success' className='btn_filter' onClick={() => { setModalShow(true); setTitle("Location"); setDesc("Select a specific state, region, province or municipality:") }}>Location</Button>
            </ButtonGroup>
            <ButtonGroup size="lg" className='my-1 me-2'>
              <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Point from map"); setDesc("Select a specific point on the map:") }}>Point from map</Button>
            </ButtonGroup>
            <ButtonGroup className="my-1" aria-label="Second group">
              <Button variant="danger" onClick={clearStates}>Remove all filters</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>

      <MyModal show={modalShow} onHide={() => setModalShow(false)} hikes={props.hikes} title={title} desc={desc} minLength={props.minLength} setMinLength={props.setMinLength} maxLength={props.maxLength} setMaxLength={props.setMaxLength}
        minTime={props.minTime} setMinTime={props.setMinTime} maxTime={props.maxTime} setMaxTime={props.setMaxTime} minAscent={props.minAscent} setMinAscent={props.setMinAscent} maxAscent={props.maxAscent} setMaxAscent={props.setMaxAscent}
        difficulties={props.difficulties} setDifficulties={props.setDifficulties} state={props.state} setState={props.setState} region={props.region} setRegion={props.setRegion} province={props.province} setProvince={props.setProvince} municipality={props.municipality} setMunicipality={props.setMunicipality} startPoint={props.startPoint} setStartPoint={props.setStartPoint} refPoint={props.refPoint} setRefPoint={props.setRefPoint} endPoint={props.endPoint} setEndPoint={props.setEndPoint} />
      <Row className='mt-3'>
        <ButtonToolbar aria-label="Toolbar with button groups" >
          {props.minLength && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Minimum length: {props.minLength} m <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setMinLength('')} /></Button>}
          {props.maxLength && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Maximum length: {props.maxLength} m <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setMaxLength('')} /></Button>}
          {props.minTime && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Minimum time: {props.minTime} h <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setMinTime('')} /></Button>}
          {props.maxTime && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Maximum time: {props.maxTime} h <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setMaxTime('')} /></Button>}
          {props.minAscent && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Minimum ascent: {props.minAscent} m <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setMinAscent('')} /></Button>}
          {props.maxAscent && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Maximum ascent: {props.maxAscent} m <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setMaxAscent('')} /></Button>}
          {props.difficulties.filter(d => d.isChecked).map((d) => {
            return (
              <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label' key={'difficulty-label-' + d.level}>Difficulty: {d.difficulty} <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => {
                let temp = [...props.difficulties];
                const index = temp.findIndex((t) => t.level === d.level);
                if (index === -1) return;
                temp[index].isChecked = false;
                props.setDifficulties(temp);
              }} /></Button>
            );
          })}
          {props.state && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>State: {props.state} <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setState('')} /></Button>}
          {props.region && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Region: {props.region} <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setRegion('')} /></Button>}
          {props.province && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Province: {props.province} <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setProvince('')} /></Button>}
          {props.municipality && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Municipality: {props.municipality} <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setMunicipality('')} /></Button>}

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
  const [tempDifficulties, setTempDifficulties] = useState(props.difficulties);
  const [tempState, setTempState] = useState(props.state);
  const [tempRegion, setTempRegion] = useState(props.region);
  const [tempProvince, setTempProvince] = useState(props.province);
  const [tempMunicipality, setTempMunicipality] = useState(props.municipality);

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

  const clearTempStates = () => {
    setTempMinLength(props.minLength);
    setTempMaxLength(props.maxLength);
    setTempMinTime(props.minTime);
    setTempMaxTime(props.maxTime);
    setTempMinAscent(props.minAscent);
    setTempMaxAscent(props.maxAscent);
    setTempDifficulties(props.difficulties);
    setTempState(props.state);
    setTempRegion(props.region);
    setTempProvince(props.province);
    setTempMunicipality(props.municipality);
  }

  const changeCheckDifficulties = (level) => {
    let temp = [...tempDifficulties];
    const index = temp.findIndex((t) => t.level === level);
    if (index === -1) return;
    temp[index].isChecked = !temp[index].isChecked;
    setTempDifficulties(temp);
  };

  const confirmButton = () => {
    if (props.title == 'Difficulty')
      props.setDifficulties(tempDifficulties);
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
    if (props.title == 'Location' && tempState !== props.state)
      props.setState(tempState);
    if (props.title == 'Location' && tempRegion !== props.region)
      props.setRegion(tempRegion);
    if (props.title == 'Location' && tempProvince !== props.province)
      props.setProvince(tempProvince);
    if (props.title == 'Location' && tempMunicipality !== props.municipality)
      props.setMunicipality(tempMunicipality);
  }

  return (

    <Modal {...props} onShow={clearTempStates} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body >
        <Container>
          {(props.title == "Difficulty") ?
            <Form>
              {tempDifficulties.map((tempDifficulty) => (
                <div key={`difficulty-${tempDifficulty.level}`} className="mb-3">
                  <Form.Check
                    type='checkbox'
                    id={'difficulty-' + tempDifficulty.level}
                    checked={tempDifficulty.isChecked}
                    label={tempDifficulty.difficulty}
                    onChange={() => changeCheckDifficulties(tempDifficulty.level)}
                  />
                </div>
              ))}
            </Form>
            :
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
                  </Row> :
                  (props.title == 'Location') ?
                    <Container>
                      <Row className="align-items-center">
                        <Col md={3} ><Form.Label>State</Form.Label></Col>
                        <Col>
                          <Form.Select className="my-3" aria-label="Select a state" value={tempState} onChange={event => setTempState(event.target.value)} >
                            <option>Select a state</option>
                            {props.hikes.filter(h => h.state).map(h => <option value={h.state}>{h.state}</option>)}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="align-items-center">
                        <Col md={3} ><Form.Label>Region</Form.Label></Col>
                        <Col>
                          <Form.Select className="my-3" aria-label="Select a region" value={tempRegion} onChange={event => setTempRegion(event.target.value)} >
                            <option>Select a region</option>
                            {props.hikes.filter(h => {
                              let showRegion = true;
                              // only show the regions in the selected state
                              if (tempState !== '') showRegion = h.state === tempState;
                              return showRegion && h.region;  // only create option from hikes that have a region
                            }).map(h => <option value={h.region}>{h.region}</option>)}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="align-items-center">
                        <Col md={3} ><Form.Label>Province</Form.Label></Col>
                        <Col>
                          <Form.Select className="my-3" aria-label="Select a province" value={tempProvince} onChange={event => setTempProvince(event.target.value)} >
                            <option>Select a province</option>
                            {props.hikes.filter(h => {
                              // only show the provinces in the selected region and state
                              let showProvince = true;
                              if (tempState !== '') showProvince = h.state === tempState;
                              if (tempRegion !== '') showProvince = showProvince && h.region === tempRegion;
                              return showProvince && h.province;  // only create option from hikes that have a province
                            }).map(h => <option value={h.province}>{h.province}</option>)}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="align-items-center">
                        <Col md={3} ><Form.Label>Municipality</Form.Label></Col>
                        <Col>
                          <Form.Select className="my-3" aria-label="Select a municipality" value={tempMunicipality} onChange={event => setTempMunicipality(event.target.value)} >
                            <option>Select a municipality</option>
                            {props.hikes.filter(h => {
                              // only show the municipalities in the selected province, region and state
                              let showMunicipality = true;
                              if (tempState !== '') showMunicipality = h.state === tempState;
                              if (tempRegion !== '') showMunicipality = showMunicipality && h.region === tempRegion;
                              if (tempProvince !== '') showMunicipality = showMunicipality && h.province === tempProvince;
                              return showMunicipality && h.municipality;  // only create option from hikes that have a municipality
                            }).map(h => <option value={h.municipality}>{h.municipality}</option>)}
                          </Form.Select>
                        </Col>
                      </Row>
                    </Container> : 'false'

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