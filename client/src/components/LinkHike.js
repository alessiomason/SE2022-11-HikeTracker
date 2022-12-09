import { Alert, Form } from 'react-bootstrap';
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Container, Row, Col, OverlayTrigger, Tooltip, Button, Tabs, Tab, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '..//styles/singlePageHike.css';
import '..//styles/LinkHike.css';
import '../styles/Map.css';
import 'leaflet/dist/leaflet.css';
import API from '../API';
import { default as Hiking } from '..//icons/hiking.svg';

// from https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
function coordinatesDistanceInMeter(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
  const R = 6378.137; // Radius of earth in KM
  const dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  const dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d * 1000; // meters
}

function LinkHike(props) {

  const navigate = useNavigate();

  const [hike, setHike] = useState({});
  const [huts, setHuts] = useState({});
  const [parkingLots, setparkingLots] = useState({});
  const [filteredHuts, setFilteredHuts] = useState([]);
  const [filteredParkingLots, setFilteredParkingLots] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [showChooseStartPoint, setShowChooseStartPoint] = useState(false);
  const [showChooseEndPoint, setShowChooseEndPoint] = useState(false);
  const radiusDistance = 5000; // 5km

  let { hikeId } = useParams();
  hikeId = parseInt(hikeId);

  useEffect(() => {
    if (dirty) {
      API.getHike(hikeId)
        .then((h) => setHike(h))
        .catch(err => console.log(err))
      API.getHuts()
        .then((hut) => setHuts(hut))
        .catch(err => console.log(err))
      API.getParkingLots()
        .then((pl) => setparkingLots(pl))
        .catch(err => console.log(err))
      setDirty(false);
    }
  }, [dirty, hikeId]);

  const startPoint = hike.points?.filter(p => p.startPoint).map(p => [p.latitude, p.longitude]).pop();
  const endPoint = hike.points?.filter(p => p.endPoint).map(p => [p.latitude, p.longitude]).pop();

  const chooseNewStartPoint = () => {
    // verifico quali hut sono entro 5 km dallo starting point attuale dell'hike
    const tempFilteredHuts = huts.filter(h => coordinatesDistanceInMeter(startPoint[0], startPoint[1], h.lat, h.lon) < radiusDistance);
    //console.log(coordinatesDistanceInMeter(startPoint[0], startPoint[1], huts[5].lat, huts[5].lon));
    setFilteredHuts(tempFilteredHuts);
    // verifico quali parking lots sono entro 5 km dallo starting point attuale dell'hike
    const tempFilteredParkingLots = parkingLots.filter(pl => coordinatesDistanceInMeter(startPoint[0], startPoint[1], pl.lat, pl.lon) < radiusDistance);
    setFilteredParkingLots(tempFilteredParkingLots);
  }

  const chooseNewEndPoint = () => {
    // verifico quali hut sono entro 5 km dall'end point attuale dell'hike
    const tempFilteredHuts = huts.filter(h => coordinatesDistanceInMeter(endPoint[0], endPoint[1], h.lat, h.lon) < radiusDistance);
    setFilteredHuts(tempFilteredHuts);
    // verifico quali parking lots sono entro 5 km dall'end point attuale dell'hike
    const tempFilteredParkingLots = parkingLots.filter(pl => coordinatesDistanceInMeter(endPoint[0], endPoint[1], pl.lat, pl.lon) < radiusDistance);
    setFilteredParkingLots(tempFilteredParkingLots);
    console.log(coordinatesDistanceInMeter(startPoint[0], startPoint[1], parkingLots[3].lat, parkingLots[3].lon));
    console.log(coordinatesDistanceInMeter(endPoint[0], endPoint[1], parkingLots[3].lat, parkingLots[3].lon));
  }


  const handleSubmit = (event) => {
    event.preventDefault();

    // azione da fare dopo il submit

    // props.linkHike(hikeId);
    props.setDirty(true);
    navigate('/hikeManager');

  }

  return (
    <Container fluid className="external-box">
      <Container fluid className='internal-box' >
        <Row className="center-box mb-4">
          <h2 className="background double single-hike-title"><span><img src={Hiking} alt="hiking_image" className='me-2 hike-img single-hike-icon' />{hike.label}</span></h2>
          {showChooseStartPoint ? "Select a new Start point" : ""}
          {showChooseEndPoint ? "Select a new End point" : ""}
        </Row>
        <Row className="mx-4">
          <Col >
            <Row className='mt-3'>
              {hike.id && <LinkHikeMap length={hike.length} points={hike.points} filteredHuts={filteredHuts} filteredParkingLots={filteredParkingLots} />}
              {/* hike.id ensures that the map is rendered only when the hike is loaded  */}
            </Row>
            <Row className='btn-row'>
              <Button className="mx-1 mt-2 choose_start slide" onClick={() => { chooseNewStartPoint(); setShowChooseStartPoint(true); setShowChooseEndPoint(false)  }} > Choose new Start Point </Button>
              <Button className="mx-1 mt-2 choose_end slide" onClick={() => { chooseNewEndPoint(); setShowChooseEndPoint(true); setShowChooseStartPoint(false) }} > Choose new End Point  </Button>
              <Button className="mx-1 mt-2 link_hut slide" type="submit" > Link hut </Button>
            </Row>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}


function LinkHikeMap(props) {

  const iconStartPoint = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const iconEndPoint = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const iconReferencePoint = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [20, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const iconHut = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [20, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const iconParkingLot = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [20, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const startPoint = props.points?.filter(p => p.startPoint).map(p => [p.latitude, p.longitude]).pop();
  const startPointLabel = props.points?.filter(p => p.startPoint).pop().label;
  const endPoint = props.points?.filter(p => p.endPoint).map(p => [p.latitude, p.longitude]).pop();
  const endPointLabel = props.points?.filter(p => p.endPoint).pop().label;
  const nPoints = props.points?.length;
  let middlePoint;
  if (nPoints)
    middlePoint = props.points?.map(p => [p.latitude, p.longitude])[nPoints / 2];

  let center = [45.177786, 7.083372];     // default point
  if (startPoint && endPoint) {
    if (middlePoint)    // centering on start, end and middle point: covers both linear and circular tracks
      center = [(startPoint[0] + endPoint[0] + middlePoint[0]) / 3, (startPoint[1] + endPoint[1] + middlePoint[1]) / 3];
    else
      center = [(startPoint[0] + endPoint[0]) / 2, (startPoint[1] + endPoint[1]) / 2];
  }

  let zoom = 13;
  if (props.length && props.length >= 21000)
    zoom = 8;
  else if (props.length && props.length >= 14000)
    zoom = 10;

  const positions = props.points?.filter(p => !p.referencePoint).map(p => [p.latitude, p.longitude]);

  return (
    <MapContainer className='single-hike-map' center={center} zoom={zoom} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {positions && <Polyline pathOptions={{ fillColor: 'red', color: 'blue' }} positions={positions} />}
      {startPoint && <Marker position={startPoint} icon={iconStartPoint}>
        {startPointLabel && <Popup>{startPointLabel}</Popup>}
      </Marker>}
      {endPoint && <Marker position={endPoint} icon={iconEndPoint}>
        {endPointLabel && <Popup>{endPointLabel}</Popup>}
      </Marker>}
      {props.points?.filter(p => p.referencePoint).map(p => {
        return (
          <Marker position={[p.latitude, p.longitude]} icon={iconReferencePoint} key={p.pointID} >
            {p.label && <Popup>{p.label}</Popup>}
          </Marker>
        );
      })}
      {props.filteredHuts.length != 0 ? props.filteredHuts.map(p => {
        return (
          <Marker position={[p.lat, p.lon]} icon={iconHut} key={p.id} >
            {p.name && <Popup>{p.name}</Popup>}
          </Marker>
        );
      }) : false}
      {props.filteredParkingLots.length != 0 ? props.filteredParkingLots?.map(p => {
        return (
          <Marker position={[p.lat, p.lon]} icon={iconParkingLot} key={p.id} >
            {p.label && <Popup>{p.label}</Popup>}
          </Marker>
        );
      }) : false}
    </MapContainer>
  );
}



export default LinkHike;