import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button, Modal, Col, Row, Form, Container, ButtonToolbar, ButtonGroup, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';
import '../styles/FilterSection.css';
import { default as Close } from '../icons/close.svg';
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
    props.setHikesLatitude(-1);
    props.setHikesLongitude(-1);
    props.setHikesRadius(-1);
  }

  console.log(props.hikesDifficulties);

  const applyUserPreferences = () => {

    console.log(props.preferences);
    props.setHikesMinLength(props.preferences[0].minLength)
    props.setHikesMaxLength(props.preferences[0].maxLength)
    props.setHikesMinTime(props.preferences[0].minTime)
    props.setHikesMaxTime(props.preferences[0].maxTime)
    props.setHikesMinAscent(props.preferences[0].minAscent)
    props.setHikesMaxAscent(props.preferences[0].maxAscent)
    props.setHikesState(props.preferences[0].state)
    props.setHikesRegion(props.preferences[0].region)
    props.setHikesProvince(props.preferences[0].province)
    props.setHikesMunicipality(props.preferences[0].municipality)
    props.setHikesRadius(props.preferences[0].radius)
    
    // console.log(props.hikesDifficulties);
    // if(props.preferences[0].difficulty === "Tourist")
    //  props.setHikesDifficulties(props.hikes)

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
              <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Expected time"); setDesc("Select a specific expected time:") }}>Time</Button>
              <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Ascent (meters)"); setDesc("Select a specific ascent:") }}>Ascent</Button>
              <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Difficulty"); setDesc("Select a specific difficulty:") }}>Difficulty</Button>
              <Button variant='success' className='btn_filter' onClick={() => { setModalShow(true); setTitle("Location"); setDesc("Select a specific state, region, province or municipality:") }}>Location</Button>
            </ButtonGroup>
            <ButtonGroup size="lg" className='my-1 me-2'>
              <Button variant="success" className='btn_filter' onClick={() => { setModalShow(true); setTitle("Point from map"); setDesc("Select a specific point on the map:") }}>Point from map</Button>
              <Button variant="success" className='btn_filter' onClick={()=>{applyUserPreferences()}}>Set Personal Filter</Button>
            </ButtonGroup>
            <ButtonGroup className="my-1" aria-label="Second group">
              <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip} >
                <Button className="delete-btn"><img src={Delete} alt="delete_image" className='' onClick={clearStates} /></Button>
              </OverlayTrigger>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>

      <MyModal className={title === 'Point from map' && 'wide-modal'} show={modalShow} onHide={() => setModalShow(false)} hikes={props.hikes} title={title} desc={desc} hikesMinLength={props.hikesMinLength} setHikesMinLength={props.setHikesMinLength} hikesMaxLength={props.hikesMaxLength} setHikesMaxLength={props.setHikesMaxLength}
        hikesMinTime={props.hikesMinTime} setHikesMinTime={props.setHikesMinTime} hikesMaxTime={props.hikesMaxTime} setHikesMaxTime={props.setHikesMaxTime} hikesMinAscent={props.hikesMinAscent} setHikesMinAscent={props.setHikesMinAscent} hikesMaxAscent={props.hikesMaxAscent} setHikesMaxAscent={props.setHikesMaxAscent}
        hikesDifficulties={props.hikesDifficulties} setHikesDifficulties={props.setHikesDifficulties} hikesState={props.hikesState} setHikesState={props.setHikesState} hikesRegion={props.hikesRegion} setHikesRegion={props.setHikesRegion} hikesProvince={props.hikesProvince} setHikesProvince={props.setHikesProvince}
        hikesMunicipality={props.hikesMunicipality} setHikesMunicipality={props.setHikesMunicipality} hikesLatitude={props.hikesLatitude} setHikesLatitude={props.setHikesLatitude} hikesLongitude={props.hikesLongitude} setHikesLongitude={props.setHikesLongitude} hikesRadius={props.hikesRadius} setHikesRadius={props.setHikesRadius} startPoint={props.startPoint} setStartPoint={props.setStartPoint} refPoint={props.refPoint} setRefPoint={props.setRefPoint} endPoint={props.endPoint} setEndPoint={props.setEndPoint} />
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
          {props.hikesLatitude !== -1 && props.hikesLongitude !== -1 && props.hikesRadius !== -1 && <Button variant="info" size="sm" className='mx-2 my-1 btn_info px-2 filter-label'>Point from map in a radius of {props.hikesRadius} km<img src={Close} alt="close" className='ms-1 my-1 close-filter-label' onClick={() => { props.setHikesLatitude(-1); props.setHikesLongitude(-1); props.setHikesRadius(-1); }} /></Button>}

        </ButtonToolbar>
      </Row>
    </Container>

  );
}

function MyModal(props) {
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
  const [tempHikesLatitude, setTempHikesLatitude] = useState(props.hikesLatitude !== -1 ? props.hikesLatitude : 45.17731777167853);
  const [tempHikesLongitude, setTempHikesLongitude] = useState(props.hikesLongitude !== -1 ? props.hikesLongitude : 7.090988159179688);
  const [tempHikesRadius, setTempHikesRadius] = useState(props.hikesRadius !== -1 ? props.hikesRadius : 3);

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
    setTempHikesLatitude(props.hikesLatitude !== -1 ? props.hikesLatitude : 45.17731777167853);
    setTempHikesLongitude(props.hikesLongitude !== -1 ? props.hikesLongitude : 7.090988159179688);
    setTempHikesRadius(props.hikesRadius !== -1 ? props.hikesRadius : 3);
  }

  const changeCheckDifficulties = (level) => {
    let temp = [...tempHikesDifficulties];
    const index = temp.findIndex((t) => t.level === level);
    if (index === -1) return;
    temp[index].isChecked = !temp[index].isChecked;
    setTempHikesDifficulties(temp);
  };

  const confirmButton = () => {
    if (props.title === 'Difficulty')
      props.setHikesDifficulties(tempHikesDifficulties);
    if (props.title === 'Length (meters)' && tempHikesMinLength !== props.hikesMinLength)
      props.setHikesMinLength(tempHikesMinLength);
    if (props.title === 'Length (meters)' && tempHikesMaxLength !== props.hikesMaxLength)
      props.setHikesMaxLength(tempHikesMaxLength);
    if (props.title === 'Expected time' && tempHikesMinTime !== props.hikesMinTime)
      props.setHikesMinTime(tempHikesMinTime);
    if (props.title === 'Expected time' && tempHikesMaxTime !== props.hikesMaxTime)
      props.setHikesMaxTime(tempHikesMaxTime);
    if (props.title === 'Ascent (meters)' && tempHikesMinAscent !== props.hikesMinAscent)
      props.setHikesMinAscent(tempHikesMinAscent);
    if (props.title === 'Ascent (meters)' && tempHikesMaxAscent !== props.hikesMaxAscent)
      props.setHikesMaxAscent(tempHikesMaxAscent);
    if (props.title === 'Location' && tempHikesState !== props.hikesState && tempHikesState !== "Select a state")
      props.setHikesState(tempHikesState);
    if (props.title === 'Location' && tempHikesRegion !== props.hikesRegion && tempHikesRegion !== "Select a region")
      props.setHikesRegion(tempHikesRegion);
    if (props.title === 'Location' && tempHikesProvince !== props.hikesProvince && tempHikesProvince !== "Select a province")
      props.setHikesProvince(tempHikesProvince);
    if (props.title === 'Location' && tempHikesMunicipality !== props.hikesMunicipality && tempHikesMunicipality !== "Select a municipality")
      props.setHikesMunicipality(tempHikesMunicipality);
    if (props.title === 'Point from map' && tempHikesLatitude !== props.hikesLatitude)
      props.setHikesLatitude(tempHikesLatitude);
    if (props.title === 'Point from map' && tempHikesLongitude !== props.hikesLongitude)
      props.setHikesLongitude(tempHikesLongitude);
    if (props.title === 'Point from map' && tempHikesRadius !== props.hikesRadius)
      props.setHikesRadius(tempHikesRadius);
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

    <Modal show={props.show} className={props.className} onShow={clearTempStates} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body >
        <Container>
          {(props.title === "Difficulty") ?
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
                (props.title === 'Ascent (meters)') ?
                  <Row className="mb-2 modal_label">
                    <Form.Label>Enter min ascent (in meters)</Form.Label>
                    <Form.Control type="number" placeholder="Min"
                      value={tempHikesMinAscent} onChange={event => setTempHikesMinAscent(event.target.value)} />
                    <Form.Label>Enter max ascent (in meters)</Form.Label>
                    <Form.Control type="number" placeholder="Max"
                      value={tempHikesMaxAscent} onChange={event => setTempHikesMaxAscent(event.target.value)} />
                  </Row> :
                  (props.title === 'Location') ?
                    <>
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
                    </> :
                    (props.title === 'Point from map') ?
                      <>
                        <HikesFiltersMap hikes={props.hikes} tempHikesLatitude={tempHikesLatitude} setTempHikesLatitude={setTempHikesLatitude} tempHikesLongitude={tempHikesLongitude} setTempHikesLongitude={setTempHikesLongitude} tempHikesRadius={tempHikesRadius} setTempHikesRadius={setTempHikesRadius} />
                        <h4>Select the maximum distance from the point</h4>
                        <h5 className="text-center">Radius of {tempHikesRadius} km</h5>
                        <Row>
                          <Col xs={1} className='slider-label'>1 km</Col>
                          <Col xs={10}>
                            <input type='range' value={tempHikesRadius} min={1} max={5} step={1} onChange={event => setTempHikesRadius(event.target.value)} className='my-slider' />
                          </Col>
                          <Col xs={1} className='slider-label'>5 km</Col>
                        </Row>
                      </> : 'false'

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

function HikesFiltersMap(props) {
  const startPointIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <MapContainer center={[props.tempHikesLatitude, props.tempHikesLongitude]} zoom={12} scrollWheelZoom={true} className='hikes-filter-map'>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.hikes.map(h => {
        return (
          <Marker key={h.label} position={[h.startPoint.latitude, h.startPoint.longitude]} icon={startPointIcon}>
            <Popup>
              {h.label && <p><strong>{h.label}</strong></p>}
              {h.startPoint.label && <p>{h.startPoint.label}</p>}
              {<p><Link to={'/hike/' + h.id}>See hike page</Link></p>}
            </Popup>
          </Marker>
        );
      })}
      <LocationMarker tempHikesLatitude={props.tempHikesLatitude} setTempHikesLatitude={props.setTempHikesLatitude} tempHikesLongitude={props.tempHikesLongitude} setTempHikesLongitude={props.setTempHikesLongitude} />
      <Circle center={{ lat: props.tempHikesLatitude, lng: props.tempHikesLongitude }}
        fillColor="blue"
        radius={props.tempHikesRadius * 1000} />
    </MapContainer>
  );
}

function LocationMarker(props) {
  const markerIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const [marker, setMarker] = useState([props.tempHikesLatitude, props.tempHikesLongitude]);

  useMapEvents({
    click(e) {
      props.setTempHikesLatitude(e.latlng.lat);
      props.setTempHikesLongitude(e.latlng.lng);
      setMarker([e.latlng.lat, e.latlng.lng]);
    }
  });

  return (<Marker position={marker} icon={markerIcon} />);
}

export default HikesFilters;