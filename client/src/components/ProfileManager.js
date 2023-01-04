import { Button, Container, Row, Col, Form, OverlayTrigger, Tooltip, FloatingLabel, Card } from "react-bootstrap";
import { Icon } from 'leaflet';
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';
import API from './../API.js';
import '../styles/ProfileManager.css';
import React, { useState, useEffect } from 'react';
import { default as Location } from "../icons/map.svg";
import { default as Radius } from "../icons/radius.svg";
import { default as Delete } from "../icons/delete.svg";
import { default as Clock } from "../icons/stopwatch.svg";
import { default as Alert1 } from "../icons/alert.svg";
import { default as Cloud } from "../icons/cloud.svg";
import { default as Rain } from "../icons/rain.svg";
import { default as Storm } from "../icons/storm.svg";
import { default as Snow } from "../icons/snow.svg";
import { default as Wind } from "../icons/wind.svg";
import DateTimePicker from 'react-datetime-picker';
const dayjs = require('dayjs');

function ProfileManager(props) {


  const [task1, setTask1] = useState(true);

  return (
    <Container fluid className="">
      <Row className="box-btn mb-5">
        <Button className={task1 ? 'user-btn-fix me-2' : 'user-btn me-2'} onClick={() => setTask1(true)}> Validate User </Button>
        <Button className={!task1 ? 'user-btn-fix ms-2 ' : 'user-btn ms-2'} onClick={() => setTask1(false)}> Weather Alert </Button>
      </Row>
      {task1 ? <ValidateUser /> : <WeatherAlert />}

    </Container>
  );
}

function ValidateUser(props) {

  const [approved, setApproved] = useState(true);

  return (
    <Row className={approved ? "val-user-box mx-5 mb-4 p-4" : "val-user-box2 mx-5 mb-4 p-4"}>
      <Col md={4}>
        <h5> Local Guide</h5>
      </Col>
      <Col md={4} className="box-center">
        <h4> tracker@gmail.com </h4>
      </Col>
      <Col md={{ offset: 2, span: 2 }}>
        <Form>
          <Form.Check type="switch" id="custom-switch" label={approved ? "Approved" : "Not Approved"} onClick={() => { approved ? setApproved(false) : setApproved(true) }} />
        </Form>
      </Col>
    </Row>
  );
}

function WeatherAlert(props) {

  const [newAlert, setNewAlert] = useState(false);
  const [tempHikesLatitude, setTempHikesLatitude] = useState(45.17731777167853);
  const [tempHikesLongitude, setTempHikesLongitude] = useState(7.090988159179688);
  const [state, setState] = useState('Italy');
  const [region, setRegion] = useState('Piedmont');
  const [province, setProvince] = useState('Torino');
  const [municipality, setMunicipality] = useState('Mompantero');
  const [tempHikesRadius, setTempHikesRadius] = useState(20);
  const [weather, setWeather] = useState('');
  const [time, setTime] = useState(new Date());
  const [description, setDescription] = useState('');

  const [hikes, setHikes] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
	const [dirty, setDirty] = useState(true);

	useEffect(() => {
		if (dirty) {
			API.getHikes()
				.then((hikes) => setHikes(hikes))
				.catch(err => console.log(err))
        API.getWeatherAlerts()
				.then((weatherAlerts) => setWeatherAlerts(weatherAlerts))
				.catch(err => console.log(err))
			setDirty(false);
		}
	}, [dirty]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let weatherAlert = {
      type: weather,
      radius: tempHikesRadius,
      lat: tempHikesLatitude,
      lon: tempHikesLongitude,
      time: time,
      description: description
    };
    
    await API.addWeatherAlert(weatherAlert)
        .then()
        .catch(err => console.log(err));
    
    resetValues();
    setNewAlert(false);
    setDirty(true);
  }

  const resetValues = () => {
    setDescription('');
    setTempHikesLatitude(45.17731777167853);
    setTempHikesLongitude(7.090988159179688);
    setTempHikesRadius(20);
    setWeather('');
    setState('Italy');
    setRegion('Piedmont');
    setProvince('Torino');
    setMunicipality('Mompantero');
    setTime(new Date());
  }


  return (
    <>
    <Form onSubmit={handleSubmit}>
      <Row className={!newAlert ? "box-btn" : " box-Alert val-user-box mx-5 mb-4 p-4"}>
        {!newAlert ? <Button className="log_btn" onClick={() => setNewAlert(true)}> Create a new Weather Alert </Button> :
          <Row >
            <Col md={5} >
              <Row >
                <Col md={12}>
                <WeatherAlertMap hikes={hikes} tempHikesLatitude={tempHikesLatitude} setTempHikesLatitude={setTempHikesLatitude} tempHikesLongitude={tempHikesLongitude} setTempHikesLongitude={setTempHikesLongitude} tempHikesRadius={tempHikesRadius} setTempHikesRadius={setTempHikesRadius}
                setState={setState} setRegion={setRegion} setProvince={setProvince} setMunicipality={setMunicipality} weather={weather}/>
                </Col>
                        <h5 className="text-center">Radius of {tempHikesRadius} km</h5>
                        <Row className="mt-3 box-btn">
                          <Col xs={1} className='slider-label'>1 km</Col>
                          <Col xs={9}>
                            <input type='range' value={tempHikesRadius} min={1} max={500} step={1} onChange={event => setTempHikesRadius(event.target.value)} className='my-slider back-bar' />
                          </Col>
                          <Col xs={1} className='slider-label'>500 km</Col>
                        </Row>
              </Row>
              
            </Col>
            <Col md={{ span: 6, offset: 1 }}>
              <Row className="mt-3">
                <h3> Create a new weather alert: </h3>
              </Row>
              <Row className=" mt-4">
                <Col md={12} className='mb-4 align'>
                  <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Location</Tooltip>}>
                    <img src={Location} alt="location_image" className='me-3 profile-icon' />
                  </OverlayTrigger>
                  <h5 className="card-text p-card">{`${state}, ${region}, ${province}, ${municipality}`}</h5>
                </Col>
              </Row>
              <Row>
                <Col md={12} className='mb-4 align'>
                  <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Radius</Tooltip>}>
                    <img src={Radius} alt="radius_image" className='me-3' />
                  </OverlayTrigger>
                  <h5 className="card-text p-card">{`${tempHikesRadius} km`}</h5>
                </Col>
              </Row>
              <Row>
                <Col md={12} className='mb-4 align'>
                  <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Weather</Tooltip>}>
                    <img src={Alert1} alt="weather_image" className='me-3' />
                  </OverlayTrigger>
                  <Form.Select required={true} value={weather} onChange={ev => setWeather(ev.target.value)}>
                      <option selected disabled value="">~ Choose the weather condition ~</option>
                      <option>Cloudy</option>
                      <option>Windy</option>
                      <option>Rainy</option>
                      <option>Stormy</option>
                      <option>Snowy</option>
                      <option>Other</option>
                    </Form.Select>
                </Col>
              </Row>
              <Row>
              <Col md={12} className='d-flex justify-content-center'>
							<Card>
								<Card.Body className='tracked-hikes-card-body'>
									<Card.Title className='tracked-hikes-card-title text-center'>
										Attempt end of the weather alert
									</Card.Title>
									<div className='d-flex justify-content-center'>
										<DateTimePicker format='MM/dd/y h:mm a' value={time} onChange={setTime} />
									</div>
								</Card.Body>
							</Card>
						</Col>
              </Row>
              <Row className="desc">
                <Col md={12}>
                  <FloatingLabel controlId="floatingTextarea2" label="Description" className="mb-3">
                  <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} as="textarea" style={{ height: '100px' }} placeholder="description" />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className='btn_box mt-3'>
                <Button variant="danger" className="cancel-btn mx-2 mb-2" onClick={() => { setNewAlert(false); resetValues() }}>Cancel</Button>
                <Button variant="success" type='submit' className="save-btn mx-2 mb-2">Save</Button>
              </Row>
            </Col>
          </Row>}
      </Row>
    </Form>
    <Row className="val-user-box mx-5 mb-4 p-4 mt-5">
       {weatherAlerts.map((w) => <ListWeatherAlert key={w.weatherAlertID} weatherAlert={w} setDirty={setDirty}/>)}
    </Row>
    </>
  );
}

function WeatherAlertMap(props) {
  const startPointIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <MapContainer center={[props.tempHikesLatitude, props.tempHikesLongitude]} zoom={9} scrollWheelZoom={true} className='hikes-filter-map'>
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
      <LocationMarker tempHikesLatitude={props.tempHikesLatitude} setTempHikesLatitude={props.setTempHikesLatitude} tempHikesLongitude={props.tempHikesLongitude} setTempHikesLongitude={props.setTempHikesLongitude} setState={props.setState} setRegion={props.setRegion} setProvince={props.setProvince} setMunicipality={props.setMunicipality} weather={props.weather}/>
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
  
  const cloudyIcon = new Icon({
    iconUrl: Cloud,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  const windyIcon = new Icon({
    iconUrl: Wind,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const stormyIcon = new Icon({
    iconUrl: Storm,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  const rainyIcon = new Icon({
    iconUrl: Rain,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const snowyIcon = new Icon({
    iconUrl: Snow,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  const [marker, setMarker] = useState([props.tempHikesLatitude, props.tempHikesLongitude]);
  let weatherIcon;
  if (props.weather === "Cloudy") {
    weatherIcon = cloudyIcon;
  } else if (props.weather === "Windy") {
    weatherIcon = windyIcon;
  } else if (props.weather === "Rainy") {
    weatherIcon = rainyIcon;
  } else if (props.weather === "Stormy") {
    weatherIcon = stormyIcon;
  } else if (props.weather === "Snowy") {
    weatherIcon = snowyIcon;
  } else {
    weatherIcon = markerIcon;
  }

  useMapEvents({
    click(e) {
      props.setTempHikesLatitude(e.latlng.lat);
      props.setTempHikesLongitude(e.latlng.lng);
      setMarker([e.latlng.lat, e.latlng.lng]);
      API.reverseNominatim(e.latlng.lat, e.latlng.lng)
        .then((locationInfo) => {
          props.setState(locationInfo.address.country);
          props.setRegion(locationInfo.address.state);
          props.setProvince(locationInfo.address.county);
          props.setMunicipality(locationInfo.address.city || locationInfo.address.town || locationInfo.address.village || locationInfo.address.municipality
            || locationInfo.address.isolated_dwelling || locationInfo.address.croft || locationInfo.address.hamlet);
        })
    }
  });

  return (<Marker position={marker} icon={weatherIcon} />);
}

function ListWeatherAlert(props) {

  const [stateList, setStateList] = useState('Italy');
  const [regionList, setRegionList] = useState('Piedmont');
  const [provinceList, setProvinceList] = useState('Torino');
  const [municipalityList, setMunicipalityList] = useState('Mompantero');
  const [dirtyList, setDirtyList] = useState(true);  

  let weatherIcon;
  if (props.weatherAlert.type === "Cloudy") {
    weatherIcon = Cloud;
  } else if (props.weatherAlert.type === "Windy") {
    weatherIcon = Wind;
  } else if (props.weatherAlert.type === "Rainy") {
    weatherIcon = Rain;
  } else if (props.weatherAlert.type === "Stormy") {
    weatherIcon = Storm;
  } else if (props.weatherAlert.type === "Snowy") {
    weatherIcon = Snow;
  } else {
    weatherIcon = Alert1;
  }


  useEffect(() => {
		if (dirtyList) {
      API.reverseNominatim(props.weatherAlert.lat, props.weatherAlert.lon)
      .then((locationInfo) => {
        setStateList(locationInfo.address.country);
        setRegionList(locationInfo.address.state);
        setProvinceList(locationInfo.address.county);
        setMunicipalityList(locationInfo.address.city || locationInfo.address.town || locationInfo.address.village || locationInfo.address.municipality
            || locationInfo.address.isolated_dwelling || locationInfo.address.croft || locationInfo.address.hamlet);
    })
			setDirtyList(false);
		}
	}, [dirtyList, props]);

  

     return (
      <>
        <Col md={1} className="box-center margin-bottom">
          <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Weather Alert</Tooltip>}>
            <img src={weatherIcon} alt="weather_image" />
          </OverlayTrigger>
        </Col>
        <Col md={3} className="align margin-bottom">
          <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Location</Tooltip>}>
            <img src={Location} alt="location_image" className='me-3 profile-icon' />
          </OverlayTrigger>
          <h6 className="card-text p-card">{`${stateList}, ${regionList}, ${provinceList}, ${municipalityList}`}</h6>
        </Col>
        <Col md={1} className="align margin-bottom">
          <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Radius</Tooltip>}>
            <img src={Radius} alt="radius_image" className='me-3' />
          </OverlayTrigger>
          <h6 className="card-text p-card">{`${props.weatherAlert.radius} km`}</h6>
        </Col>
        <Col md={2} className="align margin-bottom">
          <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Attempt End</Tooltip>}>
            <img src={Clock} alt="clock_image" className='me-3' />
          </OverlayTrigger>
          <h6 className="card-text p-card">{dayjs(props.weatherAlert.time).format('DD/MM/YYYY HH:mm')}</h6>
        </Col>
        <Col md={4} className="align margin-bottom desc">
          <FloatingLabel controlId="floatingTextarea2" label="Description" className=" desc-box">
            <Form.Control as="textarea" style={{ height: '90px' }} readOnly disabled value={props.weatherAlert.description} />
          </FloatingLabel>
        </Col>
        <Col md={1} className="box-center">
          <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}>
            <Button className="delete-btn"><img src={Delete} alt="delete_image" className='' onClick={() => { API.deleteWeatherAlert(props.weatherAlert.weatherAlertID); props.setDirty(true)}}/></Button>
          </OverlayTrigger>
        </Col>
        </>
     )
}



export default ProfileManager;