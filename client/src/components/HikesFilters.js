import React, { useState, useEffect } from 'react';
import { Button, Modal, Col, Row, Form, Container, ButtonToolbar, ButtonGroup, Tooltip, OverlayTrigger } from "react-bootstrap";
import '../styles/FilterSection.css';
import { default as Close } from '../icons/close.svg';
import API from '../API.js';
import { default as Hiking } from '../icons/hiking.svg';
import { default as Delete } from '../icons/delete.svg';

function HikesFilters(props) {

  const [modalShow, setModalShow] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const clearStates = () => {
    props.setHikesMinLength('');
    props.setHikesMaxLength('');
    props.setHikesMinTime('');
    props.setHikesMaxTime('');
    props.setHikesMinAscent('');
    props.setHikesMaxAscent('');
    props.setHikesDifficulties(props.hikesDifficultiesList);
    props.setHikesState('');
    props.setHikesRegion('');
    props.setHikesProvince('');
    props.setHikesMunicipality('');
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Remove all filters
    </Tooltip>
  );

  const deselectedDifficulties = props.hikesDifficulties.filter(d => !d.isChecked).flatMap(d => d.difficulty).join(", ");

  return (

    <Container fluid className='filterSection' id="hikeSec">
      <Row>
        <h2 className="background double filter-title"><span><img src={Hiking} alt="hiking_image" className='me-2 hike-img' />Hikes</span></h2>
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
            <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip} >
                  <Button className="delete-btn"><img src={Delete} alt="delete_image" className='' onClick={clearStates}/></Button>
                </OverlayTrigger>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>

      <MyModal show={modalShow} onHide={() => setModalShow(false)} hikes={props.hikes} title={title} desc={desc} hikesMinLength={props.hikesMinLength} setHikesMinLength={props.setHikesMinLength} hikesMaxLength={props.hikesMaxLength} setHikesMaxLength={props.setHikesMaxLength}
        hikesMinTime={props.hikesMinTime} setHikesMinTime={props.setHikesMinTime} hikesMaxTime={props.hikesMaxTime} setHikesMaxTime={props.setHikesMaxTime} hikesMinAscent={props.hikesMinAscent} setHikesMinAscent={props.setHikesMinAscent} hikesMaxAscent={props.hikesMaxAscent} setHikesMaxAscent={props.setHikesMaxAscent}
        hikesDifficulties={props.hikesDifficulties} setHikesDifficulties={props.setHikesDifficulties} hikesState={props.hikesState} setHikesState={props.setHikesState} hikesRegion={props.hikesRegion} setHikesRegion={props.setHikesRegion} hikesProvince={props.hikesProvince} setHikesProvince={props.setHikesProvince} hikesMunicipality={props.hikesMunicipality} setHikesMunicipality={props.setHikesMunicipality} startPoint={props.startPoint} setStartPoint={props.setStartPoint} refPoint={props.refPoint} setRefPoint={props.setRefPoint} endPoint={props.endPoint} setEndPoint={props.setEndPoint} />
      <Row className='mt-3'>
        <ButtonToolbar aria-label="Toolbar with button groups" >
          {props.hikesMinLength && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Minimum length: {props.hikesMinLength} m <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setHikesMinLength('')} /></Button>}
          {props.hikesMaxLength && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Maximum length: {props.hikesMaxLength} m <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setHikesMaxLength('')} /></Button>}
          {props.hikesMinTime && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Minimum time: {props.hikesMinTime} h <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setHikesMinTime('')} /></Button>}
          {props.hikesMaxTime && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Maximum time: {props.hikesMaxTime} h <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setHikesMaxTime('')} /></Button>}
          {props.hikesMinAscent && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Minimum ascent: {props.hikesMinAscent} m <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setHikesMinAscent('')} /></Button>}
          {props.hikesMaxAscent && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Maximum ascent: {props.hikesMaxAscent} m <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setHikesMaxAscent('')} /></Button>}
          {deselectedDifficulties !== "" && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Deselected difficulties: {deselectedDifficulties}<img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setHikesDifficulties(props.hikesDifficultiesList)} /></Button>}
          {props.hikesState && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>State: {props.hikesState} <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setHikesState('')} /></Button>}
          {props.hikesRegion && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Region: {props.hikesRegion} <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setHikesRegion('')} /></Button>}
          {props.hikesProvince && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Province: {props.hikesProvince} <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setHikesProvince('')} /></Button>}
          {props.hikesMunicipality && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Municipality: {props.hikesMunicipality} <img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => props.setHikesMunicipality('')} /></Button>}

        </ButtonToolbar>
      </Row>
    </Container>

  );
}

function MyModal(props) {

  const [startPoints, setStartPoints] = useState([]);
  const [endPoints, setEndPoints] = useState([]);
  const [refPoints, setRefPoints] = useState([]);
  const [tempHikesMinLength, setTempHikesMinLength] = useState(props.hikesMinLength);
  const [tempHikesMaxLength, setTempHikesMaxLength] = useState(props.hikesMaxLength);
  const [tempHikesMinTime, setTempHikesMinTime] = useState(props.hikesMinTime);
  const [tempHikesMaxTime, setTempHikesMaxTime] = useState(props.hikesMaxTime);
  const [tempHikesMinAscent, setTempHikesMinAscent] = useState(props.hikesMinAscent);
  const [tempHikesMaxAscent, setTempHikesMaxAscent] = useState(props.hikesMaxAscent);
  const [tempHikesDifficulties, setTempHikesDifficulties] = useState(props.hikesDifficulties);
  const [tempHikesState, setTempHikesState] = useState(props.hikesState);
  const [tempHikesRegion, setTempHikesRegion] = useState(props.hikesRegion);
  const [tempHikesProvince, setTempHikesProvince] = useState(props.hikesProvince);
  const [tempHikesMunicipality, setTempHikesMunicipality] = useState(props.hikesMunicipality);

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
    setTempHikesMinLength(props.hikesMinLength);
    setTempHikesMaxLength(props.hikesMaxLength);
    setTempHikesMinTime(props.hikesMinTime);
    setTempHikesMaxTime(props.hikesMaxTime);
    setTempHikesMinAscent(props.hikesMinAscent);
    setTempHikesMaxAscent(props.hikesMaxAscent);
    setTempHikesDifficulties(props.hikesDifficulties);
    setTempHikesState(props.hikesState);
    setTempHikesRegion(props.hikesRegion);
    setTempHikesProvince(props.hikesProvince);
    setTempHikesMunicipality(props.hikesMunicipality);
  }

  const changeCheckDifficulties = (level) => {
    let temp = [...tempHikesDifficulties];
    const index = temp.findIndex((t) => t.level === level);
    if (index === -1) return;
    temp[index].isChecked = !temp[index].isChecked;
    setTempHikesDifficulties(temp);
  };

  const confirmButton = () => {
    if (props.title == 'Difficulty')
      props.setHikesDifficulties(tempHikesDifficulties);
    if (props.title == 'Length (meters)' && tempHikesMinLength !== props.hikesMinLength)
      props.setHikesMinLength(tempHikesMinLength);
    if (props.title == 'Length (meters)' && tempHikesMaxLength !== props.hikesMaxLength)
      props.setHikesMaxLength(tempHikesMaxLength);
    if (props.title == 'Expected time' && tempHikesMinTime !== props.hikesMinTime)
      props.setHikesMinTime(tempHikesMinTime);
    if (props.title == 'Expected time' && tempHikesMaxTime !== props.hikesMaxTime)
      props.setHikesMaxTime(tempHikesMaxTime);
    if (props.title == 'Ascent (meters)' && tempHikesMinAscent !== props.hikesMinAscent)
      props.setHikesMinAscent(tempHikesMinAscent);
    if (props.title == 'Ascent (meters)' && tempHikesMaxAscent !== props.hikesMaxAscent)
      props.setHikesMaxAscent(tempHikesMaxAscent);
    if (props.title == 'Location' && tempHikesState !== props.hikesState && tempHikesState !== "Select a state")
      props.setHikesState(tempHikesState);
    if (props.title == 'Location' && tempHikesRegion !== props.hikesRegion && tempHikesRegion !== "Select a region")
      props.setHikesRegion(tempHikesRegion);
    if (props.title == 'Location' && tempHikesProvince !== props.hikesProvince && tempHikesProvince !== "Select a province")
      props.setHikesProvince(tempHikesProvince);
    if (props.title == 'Location' && tempHikesMunicipality !== props.hikesMunicipality && tempHikesMunicipality !== "Select a municipality")
      props.setHikesMunicipality(tempHikesMunicipality);
  }

  // preparation for location filter options
  // Set in order to create a list of unique items
  const hikesStatesInDB = new Set(props.hikes.filter(h => h.state).map(h => h.state).sort());

  const hikesRegionsInDB = new Set(props.hikes.filter(h => {
    let showRegion = true;
    // only show the regions in the selected state
    if (tempHikesState !== '') showRegion = h.state === tempHikesState;
    return showRegion && h.region;  // only create option from hikes that have a region
  }).map(h => h.region).sort());

  const hikesProvincesInDB = new Set(props.hikes.filter(h => {
    // only show the provinces in the selected region and state
    let showProvince = true;
    if (tempHikesState !== '') showProvince = h.state === tempHikesState;
    if (tempHikesRegion !== '') showProvince = showProvince && h.region === tempHikesRegion;
    return showProvince && h.province;  // only create option from hikes that have a province
  }).map(h => h.province).sort());

  const hikesMunicipalitiesInDB = new Set(props.hikes.filter(h => {
    // only show the municipalities in the selected province, region and state
    let showMunicipality = true;
    if (tempHikesState !== '') showMunicipality = h.state === tempHikesState;
    if (tempHikesRegion !== '') showMunicipality = showMunicipality && h.region === tempHikesRegion;
    if (tempHikesProvince !== '') showMunicipality = showMunicipality && h.province === tempHikesProvince;
    return showMunicipality && h.municipality;  // only create option from hikes that have a municipality
  }).map(h => h.municipality).sort());

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
              {tempHikesDifficulties.map((tempHikesDifficulty) => (
                <div key={`difficulty-${tempHikesDifficulty.level}`} className="mb-3">
                  <Form.Check
                    type='checkbox'
                    id={'difficulty-' + tempHikesDifficulty.level}
                    checked={tempHikesDifficulty.isChecked}
                    label={tempHikesDifficulty.difficulty}
                    onChange={() => changeCheckDifficulties(tempHikesDifficulty.level)}
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
                    value={tempHikesMinLength} onChange={event => setTempHikesMinLength(event.target.value)} />
                  <Form.Label>Enter max length (in meters)</Form.Label>
                  <Form.Control type="number" placeholder="Max"
                    value={tempHikesMaxLength} onChange={event => setTempHikesMaxLength(event.target.value)} />
                </Form.Group>
              </Row> :
              (props.title === 'Expected time') ?
                <Row className="mb-2 modal_label">
                  <Form.Label>Enter min time (in hours)</Form.Label>
                  <Form.Control type="number" placeholder="Min"
                    value={tempHikesMinTime} onChange={event => setTempHikesMinTime(event.target.value)} />
                  <Form.Label>Enter max time (in hours)</Form.Label>
                  <Form.Control type="number" placeholder="Max"
                    value={tempHikesMaxTime} onChange={event => setTempHikesMaxTime(event.target.value)} />
                </Row> :
                (props.title == 'Ascent (meters)') ?
                  <Row className="mb-2 modal_label">
                    <Form.Label>Enter min ascent (in meters)</Form.Label>
                    <Form.Control type="number" placeholder="Min"
                      value={tempHikesMinAscent} onChange={event => setTempHikesMinAscent(event.target.value)} />
                    <Form.Label>Enter max ascent (in meters)</Form.Label>
                    <Form.Control type="number" placeholder="Max"
                      value={tempHikesMaxAscent} onChange={event => setTempHikesMaxAscent(event.target.value)} />
                  </Row> :
                  (props.title == 'Location') ?
                    <Container>
                      <Row className="align-items-center">
                        <Col md={3} ><Form.Label>State</Form.Label></Col>
                        <Col>
                          <Form.Select className="my-3" aria-label="Select a state" value={tempHikesState} onChange={event => setTempHikesState(event.target.value)} >
                            <option key={'Select a state'}>Select a state</option>
                            {[...hikesStatesInDB].map(s => <option key={s} value={s}>{s}</option>)}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="align-items-center">
                        <Col md={3} ><Form.Label>Region</Form.Label></Col>
                        <Col>
                          <Form.Select className="my-3" aria-label="Select a region" value={tempHikesRegion} onChange={event => setTempHikesRegion(event.target.value)} >
                            <option key={'Select a region'}>Select a region</option>
                            {[...hikesRegionsInDB].map(r => <option key={r} value={r}>{r}</option>)}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="align-items-center">
                        <Col md={3} ><Form.Label>Province</Form.Label></Col>
                        <Col>
                          <Form.Select className="my-3" aria-label="Select a province" value={tempHikesProvince} onChange={event => setTempHikesProvince(event.target.value)} >
                            <option key={'Select a province'}>Select a province</option>
                            {[...hikesProvincesInDB].map(p => <option key={p} value={p}>{p}</option>)}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="align-items-center">
                        <Col md={3} ><Form.Label>Municipality</Form.Label></Col>
                        <Col>
                          <Form.Select className="my-3" aria-label="Select a municipality" value={tempHikesMunicipality} onChange={event => setTempHikesMunicipality(event.target.value)} >
                            <option key={'Select a municipality'}>Select a municipality</option>
                            {[...hikesMunicipalitiesInDB].map(m => <option key={m} value={m}>{m}</option>)}
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

export default HikesFilters;