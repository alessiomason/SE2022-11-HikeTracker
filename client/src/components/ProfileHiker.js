import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, FloatingLabel } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { TrackedHikesInfoTable, TrackedHikesInfoModal } from './TrackedHikesInfo';
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';
import '../styles/ProfileHiker.css';
import '../styles/ProfileHutWorker.css';
import { default as Params } from '../icons/equalizer.svg';
import '../styles/FilterSection.css';
import { Link } from "react-router-dom";
import { default as Close } from '../icons/close.svg';
import { default as Hiking } from '../icons/hiking.svg';
import { default as Delete } from '../icons/delete.svg';
import API from '../API';
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

function ProfileHiker(props) {

  const [tab, setTab] = useState("hikes");
  const [hikes,setHikes] = useState();
  const [preferences, setPreferences] = useState();

  useEffect(() => {
    API.getHikes()
      .then((hikes) => setHikes(hikes))
      .catch(err => console.log(err))
  
}, []);

useEffect(() => {
    API.getUserPreferences(props.user.id)
      .then((preferences) => setPreferences(preferences))
      .catch(err => console.log(err))
}, []);

  return (
    <Container fluid className="">
      <Row className="box-btn mb-5">
        <Button className={(tab === "hikes") ? 'user-btn-fix me-2 margin-bottom2' : 'user-btn me-2 margin-bottom2'} onClick={() => setTab("hikes")}>Tracked hikes</Button>
        <Button className={(tab === "stats") ? 'user-btn-fix ms-2' : 'user-btn ms-2 '} onClick={() => setTab("stats")}>Performance stats</Button>
        <Button className={(tab === "parameters") ? 'user-btn-fix mx-2 margin-bottom2' : 'user-btn mx-2 margin-bottom2'} onClick={() => setTab("parameters")}>Set parameters</Button>
      </Row>
      {(tab === "hikes") ? <TrackedHikes /> : (tab === "stats") ? <PerformanceStats /> : <Parameters hikes={hikes} sethikes={setHikes} preferences={preferences}/>}

    </Container>
  );
}

function TrackedHikes() {
  const [dirty, setDirty] = useState(true);
  const [hike, setHike] = useState({});
  const [dirtyHike, setDirtyHike] = useState(false);    // allows showing of the map only when loading of the hike is done
  const [trackedHikes, setTrackedHikes] = useState([]);
  const [trackedHikesInfoModalShow, setTrackedHikesInfoModalShow] = useState(false);  // state to show the modal, if true, contains the id of the tracked hike currently showing
  


  useEffect(() => {
    if (dirty) {
      API.getTrackedHikesByUserID()
        .then((trackedHikes) => setTrackedHikes(trackedHikes))
        .catch(err => console.log(err));

      setDirty(false);
    }
  }, [dirty]);

  useEffect(() => {
    if (trackedHikesInfoModalShow) {
      const hikeID = trackedHikes.find(th => th.id === trackedHikesInfoModalShow).hikeID;

      if (hikeID !== hike.id) {
        setDirtyHike(true);

        API.getHike(hikeID)
          .then((hike) => {
            setHike(hike);
            setDirtyHike(false);
          })
          .catch(err => console.log(err));
      }
    }
  }, [trackedHikesInfoModalShow]);

  

  return (
    <Row style={{ '--main-color': '#494681', '--faded-main-color': 'rgba(73, 70, 129, 0.1)' }}>
      <Col xs={{ span: 10, offset: 1 }}>
        {trackedHikes.length > 0 && <TrackedHikesInfoTable inProfilePage trackedHikes={trackedHikes} setTrackedHikesInfoModalShow={setTrackedHikesInfoModalShow} />}
        {trackedHikes.length > 0 && <TrackedHikesInfoModal inProfilePage show={trackedHikesInfoModalShow} onHide={() => setTrackedHikesInfoModalShow(false)} hike={hike} dirtyHike={dirtyHike} trackedHikes={trackedHikes} style={{ '--main-color': '#494681', '--faded-main-color': 'rgba(73, 70, 129, 0.1)' }} />}
      </Col>
    </Row>
  );
}


function Parameters(props) {


  const [minLength, setMinLength] = useState();
  const [maxLength, setMaxLength] = useState();
  const [minAscent, setMinAscent] = useState();
  const [maxAscent, setMaxAscent] = useState();
  const [minTime, setMinTime] = useState();
  const [maxTime, setMaxTime] = useState();
  const [difficulty, setDifficulty] = useState();
  const [state, setState] = useState();
  const [region, setRegion] = useState();
  const [province, setProvince] = useState();
  const [municipality, setMunicipality] = useState();
  const [radius, setRadius] = useState(-1);
  const [latitude, setLatitude] = useState(-1);
  const [longitude, setLongitude] = useState(-1);
  const [title,setTitle] = useState();

  const [tempMinLength, setTempMinLength] = useState(props.preferences? props.preferences[0].minLength : 0);
  const [tempMaxLength, setTempMaxLength] = useState(props.preferences? props.preferences[0].maxLength : 0);
  const [tempMinAscent, setTempMinAscent] = useState(props.preferences? props.preferences[0].minAscent : 0);
  const [tempMaxAscent, setTempMaxAscent] = useState(props.preferences? props.preferences[0].maxAscent : 0);
  const [tempMinTime, setTempMinTime] = useState(props.preferences? props.preferences[0].minTime : 0);
  const [tempMaxTime, setTempMaxTime] = useState(props.preferences? props.preferences[0].maxTime : 0);
  const [tempDifficulty, setTempDifficulty] = useState();
  const [tempState, setTempState] = useState(props.preferences? props.preferences[0].state : "");
  const [tempRegion, setTempRegion] = useState(props.preferences? props.preferences[0].region : "");
  const [tempProvince, setTempProvince] = useState(props.preferences? props.preferences[0].province : "");
  const [tempMunicipality, setTempMunicipality] = useState(props.preferences? props.preferences[0].municipality : null);
  const [tempRadius, setTempRadius] = useState(radius !== -1 ? radius : 3);
  const [tempLatitude, setTempLatitude] = useState(latitude !== -1 ? latitude : 45.17731777167853);
  const [tempLongitude, setTempLongitude] = useState(longitude !== -1 ? longitude : 7.090988159179688);

  const handleSubmit = async () => {
   
      let userPreferences = {};
      if(title === "Length"){
        userPreferences = {
          minLength: minLength,
          maxLength: maxLength
        }
      await API.updateUserPreferencesLength(userPreferences)
        .then((response) => console.log(response))
        .catch(err => console.log(err));
      }

      if(title === "Ascent"){
        userPreferences = {
          minAscent: minAscent,
          maxAscent: maxAscent
        }
      await API.updateUserPreferencesAscent(userPreferences)
        .then((response) => console.log(response))
        .catch(err => console.log(err));
      }
      if(title === "Time"){
        userPreferences = {
          minTime: minTime,
          maxTime: maxTime,
        }
      await API.updateUserPreferencesTime(userPreferences)
        .then((response) => console.log(response))
        .catch(err => console.log(err));
      }
      if(title === "Difficulty"){
        userPreferences = {
          difficulty: difficulty
        }
      await API.updateUserPreferencesDifficulty(userPreferences)
        .then((response) => console.log(response))
        .catch(err => console.log(err));
      }
      if(title === "Location"){
        userPreferences = {
          state: state,
          region: region,
          province: province,
          municipality: municipality
        }
      await API.updateUserPreferencesLocation(userPreferences)
        .then((response) => console.log(response))
        .catch(err => console.log(err));
      }
      if(title === "Radius"){
        userPreferences = {
          radius: radius,
          latitude: latitude,
          longitude: longitude
        }
      await API.updateUserPreferencesRadius(userPreferences)
        .then((response) => console.log(response))
        .catch(err => console.log(err));
      }
    
  }

  // preparation for location filter options
  // Set in order to create a list of unique items
  const hikesStatesInDB = new Set(props.hikes.filter(h => h.state).map(h => h.state).sort());

  const hikesRegionsInDB = new Set(props.hikes.filter(h => {
    let showRegion = true;
    // only show the regions in the selected state
    if (tempState !== '') showRegion = h.state === tempState;
    return showRegion && h.region;  // only create option from hikes that have a region
  }).map(h => h.region).sort());

  const hikesProvincesInDB = new Set(props.hikes.filter(h => {
    // only show the provinces in the selected region and state
    let showProvince = true;
    if (tempState !== '') showProvince = h.state === tempState;
    if (tempRegion !== '') showProvince = showProvince && h.region === tempRegion;
    return showProvince && h.province;  // only create option from hikes that have a province
  }).map(h => h.province).sort());

  const hikesMunicipalitiesInDB = new Set(props.hikes.filter(h => {
    // only show the municipalities in the selected province, region and state
    let showMunicipality = true;
    if (tempState !== '') showMunicipality = h.state === tempState;
    if (tempRegion !== '') showMunicipality = showMunicipality && h.region === tempRegion;
    if (tempProvince !== '') showMunicipality = showMunicipality && h.province === tempProvince;
    return showMunicipality && h.municipality;  // only create option from hikes that have a municipality
  }).map(h => h.municipality).sort());

  console.log("minlength: " + tempMinLength + " maxlength: " + tempMaxLength);
  console.log(props.preferences);


  return (

    <Row className="margin-x box-center">

      <Row>
      
        <Col lg={4} md={6} sm={12} xs={12} className="p-2 ">
          <Col className="val-user-box3 p-4 ">
            <Row>
              <h5 className="filter-hiker-title mb-3"> Length (meters) </h5>
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel controlId="floatingInput" label="Minimum Length" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} placeholder={tempMaxLength} value={tempMinLength} onChange={event => setTempMinLength(event.target.value)}/>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel controlId="floatingInput" label="Maximum Length" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} placeholder={tempMaxLength} value={tempMaxLength} onChange={event => setTempMaxLength(event.target.value)} />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className='btn_box'>
              <Button variant="danger" className="cancel-btn2 mx-2 " onClick={()=> {setTempMinLength(''); setMinLength(); setMaxLength();setTempMaxLength('');}}>Undo</Button>
              <Button variant="success" type='submit' className="save-btn2 mx-2 " onClick={()=> { setTitle("Length"); setMinLength(tempMinLength); setMaxLength(tempMaxLength); handleSubmit();}} >Save</Button>
            </Row>
          </Col>
        </Col>
        
        <Col lg={4} md={6} sm={12} xs={12} className="p-2 ">
          <Col className="val-user-box3 p-4 ">
            <Row>
              <h5 className="filter-hiker-title mb-3"> Ascent (meters) </h5>
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel controlId="floatingInput" label="Minimum Ascent" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} placeholder={minAscent} value={tempMinAscent} onChange={event => setTempMinAscent(event.target.value)} />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel controlId="floatingInput" label="Maximum Ascent" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} placeholder={maxAscent} value={tempMaxAscent} onChange={event => setTempMaxAscent(event.target.value)}/>
                </FloatingLabel>
              </Col>
            </Row>
            <Row className='btn_box'>
              <Button variant="danger" className="cancel-btn2 mx-2 " onClick={()=> {setTempMinAscent(''); setMinAscent(); setMaxAscent();setTempMaxAscent('');}}>Undo</Button>
              <Button variant="success" type='submit' className="save-btn2 mx-2 " onClick={() => { setTitle("Ascent");setMinAscent(tempMinAscent); setMaxAscent(tempMaxAscent);handleSubmit();}}>Save</Button>
            </Row>
          </Col>
        </Col>

        <Col lg={4} md={12} sm={12} xs={12} className="p-2 ">
          <Col className="val-user-box3 p-4 ">
            <Row>
              <h5 className="filter-hiker-title mb-3"> Expected Time (hours)</h5>
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel controlId="floatingInput" label="Minimum Time" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} placeholder={minTime} value={tempMinTime} onChange={event => setTempMinTime(event.target.value)} />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel controlId="floatingInput" label="Maximum Time" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} placeholder={maxTime} value={tempMaxTime} onChange={event => setTempMaxTime(event.target.value)} />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className='btn_box'>
              <Button variant="danger" className="cancel-btn2 mx-2 " onClick={()=> {setTempMinTime(''); setMinTime(); setMaxTime();setTempMaxTime('');}} >Undo</Button>
              <Button variant="success" type='submit' className="save-btn2 mx-2 "  onClick={() => {setTitle("Time");setMinTime(tempMinTime); setMaxTime(tempMaxTime); handleSubmit();}}>Save</Button>
            </Row>
          </Col>
        </Col>
      </Row>

      <Row>
        <Col lg={4} md={6} sm={12} xs={12}>
          <Row>
            <Col className="p-2 ">
              <Col className="val-user-box3 p-4 ">
                <Row>
                  <h5 className="filter-hiker-title mb-3"> Difficulty </h5>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Check inline label="Tourist" type="checkbox" id="1" className="mb-3" onClick={() => {setTempDifficulty("Tourist")}}/>
                    <Form.Check inline label="Hiker" type="checkbox" id="2" className="mb-3" onClick={() => {setTempDifficulty("Hiker")}} />
                    <Form.Check inline label="Pro Hiker" type="checkbox" id="3" className="mb-3" onClick={() => {setTempDifficulty("Pro Hiker")}} />
                  </Col>
                </Row>
                <Row className='btn_box'>
                  <Button variant="danger" className="cancel-btn2 mx-2 " onClick={()=> {setDifficulty('')}}>Undo</Button>
                  <Button variant="success" type='submit' className="save-btn2 mx-2 " onClick={()=>{setTitle("Difficulty");setDifficulty(tempDifficulty); handleSubmit();}}>Save</Button>
                </Row>
              </Col>
            </Col>
          </Row>

          <Row>
            <Col className="p-2 ">
              <Col className="val-user-box3 p-4 ">
                <Row>
                  <h5 className="filter-hiker-title mb-3"> Locality </h5>
                </Row>
                <Row>
                  <Col md={12} >
                    <FloatingLabel controlId="floatingSelect" label="State" className="form-sel2 mb-3">
                      <Form.Select aria-label="Floating label select example" placeholder="State" value={tempState} onChange={event => setTempState(event.target.value)}>
                      <option key={'Select a state'}>Select a state</option>
                            {[...hikesStatesInDB].map(s => <option key={s} value={s}>{s}</option>)}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} >
                    <FloatingLabel controlId="floatingSelect" label="Region" className="form-sel2 mb-3">
                      <Form.Select aria-label="Floating label select example" placeholder="Region" value={tempRegion} onChange={event => setTempRegion(event.target.value)}>
                      <option key={'Select a region'}>Select a region</option>
                            {[...hikesRegionsInDB].map(r => <option key={r} value={r}>{r}</option>)}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} >
                    <FloatingLabel controlId="floatingSelect" label="Province" className="form-sel2 mb-3">
                      <Form.Select aria-label="Floating label select example" placeholder="Province" value={tempProvince} onChange={event => setTempProvince(event.target.value)}>
                      <option key={'Select a province'}>Select a province</option>
                            {[...hikesProvincesInDB].map(p => <option key={p} value={p}>{p}</option>)}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} >
                    <FloatingLabel controlId="floatingSelect" label="Municipality" className="form-sel2 mb-3">
                      <Form.Select aria-label="Floating label select example" placeholder="Municipality" value={tempMunicipality} onChange={event => setTempMunicipality(event.target.value)}>
                      <option key={'Select a municipality'}>Select a municipality</option>
                            {[...hikesMunicipalitiesInDB].map(m => <option key={m} value={m}>{m}</option>)}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='btn_box'>
                  <Button variant="danger" className="cancel-btn2 mx-2 " onClick={() => {setTempState(''); setTempRegion(''); setTempProvince(''); setTempMunicipality(''); }} >Undo</Button>
                  <Button variant="success" type='submit' className="save-btn2 mx-2 "  onClick={() => {setTitle("Location");setState(tempState); setRegion(tempRegion); setProvince(tempProvince); setMunicipality(tempMunicipality); handleSubmit(); }} >Save</Button>
                </Row>
              </Col>
            </Col>
          </Row>
        </Col>

        <Col lg={8} md={6} sm={12} xs={12} className="p-2 ">
          <Col className="val-user-box3 p-4 ">
            <Row>
              <h5 className="filter-hiker-title mb-3"> Point on the Map </h5>
            </Row>
            {/* <Row className="px-2 mb-4">
              <Col md={12} className="filter-hike-map-box ">

              </Col>
            </Row> */}
            <HikesFiltersMap hikes={props.hikes} tempLatitude={tempLatitude} setTempLatitude={setTempLatitude} tempLongitude={tempLongitude} setTempLongitude={setTempLongitude} tempRadius={tempRadius} setTempRadius={setTempRadius} />
            <Row className="mb-3">
              <Col md={12}>
                <h6>Choose a point on the Map and a radius value:</h6>
              </Col>
            </Row>
            <Row className="mb-4 hike-filter-range">
              <Col md={12} >
                <Row >
                  <Col xs={1} className="px-0 mx-0 box-center">1 km</Col>
                  <Col xs={10} className="box-center " >
                    <input type='range' min={1} max={5} step={1} value={tempRadius} onChange={event => setTempRadius(event.target.value)} className='my-slider back-bar' />
                  </Col>
                  <Col xs={1} className="px-0 mx-0 box-center" >5 km</Col>
                </Row>
              </Col>
            </Row>
            <Row className='btn_box'>
              <Button variant="danger" className="cancel-btn2 mx-2 " >Undo</Button>
              <Button variant="success" type='submit' className="save-btn2 mx-2 " onClick={() => {setTitle("Radius");setRadius(tempRadius); setLatitude(tempLatitude); setLongitude(tempLongitude); handleSubmit();}}>Save</Button>
            </Row>
          </Col>
        </Col>
      </Row>
    </Row>
  );
}

function PerformanceStats() {
  const navigate = useNavigate();

  const [userStats, setUserStats] = useState({});
  const [dirty, setDirty] = useState(true);

  useEffect(() => {
    if (dirty) {
      API.getUserStats()
        .then((userStats) => setUserStats(userStats))
        .catch(err => console.log(err));
    }

    setDirty(false);
  }, [dirty]);

  return (
    <Row className=" val-user-box3 mx-5 p-4 box-center">
      <Row>
        <Col lg={3} md={6} sm={12} xs={12} className="box-center ">
          <img src={Params} alt="param_image" className="mb-3" />
        </Col>
        <Col lg={6} md={6} ><h3 className='text-center filter-hiker-title no-pad-text'>Performance statistics</h3></Col>
        <Col><p className='text-center pad-text'>Click on a box to see the relative hike</p></Col>
      </Row>
      <Row>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Total number of hikes finished" className="mb-3">
            <Form.Control required={true} type="text" readOnly value={userStats.hikesFinished}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x "  >
          <FloatingLabel controlId="floatingInput" label="Total number of kms walked" className="mb-3">
            <Form.Control required={true} type="text" readOnly value={(userStats.walkedLength / 1000).toFixed(2) + ' km'}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x "  >
          <FloatingLabel controlId="floatingInput" label="Total hike time" className="mb-3">
            <Form.Control required={true} type="text" readOnly value={dayjs.duration(userStats.totalHikeTime, 'hours').format('H [h] mm [m]')}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Highest altitude reached" className="mb-3">
            <Form.Control required={true} type="text" readOnly value={userStats.highestAltitude + ' m'}></Form.Control>
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Highest altitude range done" className="mb-3">
            <Form.Control required={true} type="text" readOnly value={userStats.highestAltitudeRange + ' m'}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Longest (km) hike completed" className="mb-3" onClick={() => navigate('/hike/' + userStats.longestHikeByKmID)}>
            <Form.Control className='clickable-box' required={true} type="text" readOnly value={(userStats.longestHikeByKmLength)?.toFixed(2) + ' km'}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Longest (hours) hike completed" className="mb-3" onClick={() => navigate('/hike/' + userStats.longestHikeByHoursID)}>
            <Form.Control className='clickable-box' required={true} type="text" readOnly value={dayjs.duration(userStats.longestHikeByHoursTime, 'hours').format('H [h] mm [m]')}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Shortest (km) hike completed" className="mb-3" onClick={() => navigate('/hike/' + userStats.shortestHikeByKmID)}>
            <Form.Control className='clickable-box' required={true} type="text" readOnly value={(userStats.shortestHikeByKmLength)?.toFixed(2) + ' km'}></Form.Control>
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Shortest (hours) hike completed" className="mb-3" onClick={() => navigate('/hike/' + userStats.shortestHikeByHoursID)}>
            <Form.Control className='clickable-box' required={true} type="text" readOnly value={dayjs.duration(userStats.shortestHikeByHoursTime, 'hours').format('H [h] mm [m]')}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Average pace" className="mb-3">
            <Form.Control required={true} type="text" readOnly value={(dayjs.duration(userStats.totalHikeTime, 'hours').asMinutes() / userStats.walkedLength * 1000).toFixed(2) + ' min/km'}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Fastest paced hike" className="mb-3" onClick={() => navigate('/hike/' + userStats.fastestPacedHikeID)}>
            <Form.Control className='clickable-box' required={true} type="text" readOnly value={(userStats.fastestPacedHikePace)?.toFixed(2) + ' min/km'}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x ">
          <FloatingLabel controlId="floatingInput" label="Average vertical ascent speed" className="mb-3">
            <Form.Control required={true} type="text" readOnly value={(userStats.totalAscent / dayjs.duration(userStats.totalHikeTime, 'hours').asHours()).toFixed(2) + ' m/hour'}></Form.Control>
          </FloatingLabel>
        </Col>
      </Row>
    </Row>
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
    <MapContainer center={[props.tempLatitude, props.tempLongitude]} zoom={12} scrollWheelZoom={true} className='hikes-filter-map'>
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
      <LocationMarker tempLatitude={props.tempLatitude} setTempLatitude={props.setTempLatitude} tempLongitude={props.tempLongitude} setTempLongitude={props.setTempLongitude} />
      <Circle center={{ lat: props.tempLatitude, lng: props.tempLongitude }}
        fillColor="blue"
        radius={props.tempRadius * 1000} />
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

  const [marker, setMarker] = useState([props.tempLatitude, props.tempLongitude]);

  useMapEvents({
    click(e) {
      props.setTempLatitude(e.latlng.lat);
      props.setTempLongitude(e.latlng.lng);
      setMarker([e.latlng.lat, e.latlng.lng]);
    }
  });


  return (<Marker position={marker} icon={markerIcon} />);
}


export default ProfileHiker;

