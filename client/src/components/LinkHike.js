import { Alert, Form } from 'react-bootstrap';
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Container, Row, Col, OverlayTrigger, Tooltip, Button, Tabs, Tab, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '..//styles/SinglePageHike.css';
import '..//styles/LinkHike.css';
import '../styles/Map.css';
import 'leaflet/dist/leaflet.css';
import API from '../API';
import { default as Hiking } from '..//icons/hiking.svg';
import { default as LinkedHutIcon} from '../images/linked_hut_icon.png'

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
  const [linkedHut, setLinkedHut] = useState([]);
  const [alreadyLinkedHut, setAlreadyLinkedHut] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [showChooseStartPoint, setShowChooseStartPoint] = useState(false);
  const [showChooseEndPoint, setShowChooseEndPoint] = useState(false);
  const [showLinkHut, setShowLinkHut] = useState(false);
  const [startOrEnd, setStartOrEnd]= useState("");
  const [showLinkedHutBanner, setShowLinkedHutBanner] = useState(false);
  const [message, setMessage] = useState('');
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
    let alreadyHutStartPoint = hike.points.filter((h) => (h.startPoint === 1 && h.endPoint === 0 && h.referencePoint === 0 && h.hutID) && coordinatesDistanceInMeter(startPoint[0], startPoint[1], h.latitude, h.longitude) < radiusDistance);
    let alreadyParkingStartPoint = hike.points.filter((h) => (h.startPoint === 1 && h.endPoint === 0 && h.referencePoint === 0 && h.parkingID) && coordinatesDistanceInMeter(startPoint[0], startPoint[1], h.latitude, h.longitude) < radiusDistance);
    
    // verifico quali hut sono entro 5 km dallo starting point attuale dell'hike, che non siano già start point
    let tempFilteredHuts = huts.filter(h => coordinatesDistanceInMeter(startPoint[0], startPoint[1], h.lat, h.lon) < radiusDistance);
    tempFilteredHuts = tempFilteredHuts.filter(h => !alreadyHutStartPoint.map((a)=> a.hutID).includes(h.id));
    setFilteredHuts(tempFilteredHuts);
    // verifico quali parking lots sono entro 5 km dallo starting point attuale dell'hike, che non siano già start point
    let tempFilteredParkingLots = parkingLots.filter(pl => coordinatesDistanceInMeter(startPoint[0], startPoint[1], pl.lat, pl.lon) < radiusDistance);
    tempFilteredParkingLots = tempFilteredParkingLots.filter(h => !alreadyParkingStartPoint.map((a)=> a.parkingID).includes(h.id));
    setFilteredParkingLots(tempFilteredParkingLots);
    setStartOrEnd("Start Point");
    setLinkedHut([]);
    setAlreadyLinkedHut([]);
    setDirty(true);
  }

  const chooseNewEndPoint = () => {
    let alreadyHutEndPoint = hike.points.filter((h) => (h.startPoint === 0 && h.endPoint === 1 && h.referencePoint === 0 && h.hutID) && coordinatesDistanceInMeter(endPoint[0], endPoint[1], h.latitude, h.longitude) < radiusDistance);
    let alreadyParkingEndPoint = hike.points.filter((h) => (h.startPoint === 0 && h.endPoint === 1 && h.referencePoint === 0 && h.parkingID) && coordinatesDistanceInMeter(endPoint[0], endPoint[1], h.latitude, h.longitude) < radiusDistance);

    // verifico quali hut sono entro 5 km dall'end point attuale dell'hike, che non siano già end point
    let tempFilteredHuts = huts.filter(h => coordinatesDistanceInMeter(endPoint[0], endPoint[1], h.lat, h.lon) < radiusDistance);
    tempFilteredHuts = tempFilteredHuts.filter(h => !alreadyHutEndPoint.map((a)=> a.hutID).includes(h.id));
    setFilteredHuts(tempFilteredHuts);
    // verifico quali parking lots sono entro 5 km dall'end point attuale dell'hike, che non siano già end point
    let tempFilteredParkingLots = parkingLots.filter(pl => coordinatesDistanceInMeter(endPoint[0], endPoint[1], pl.lat, pl.lon) < radiusDistance);
    tempFilteredParkingLots = tempFilteredParkingLots.filter(h => !alreadyParkingEndPoint.map((a)=> a.parkingID).includes(h.id));
    setFilteredParkingLots(tempFilteredParkingLots);
    setStartOrEnd("End Point");
    setLinkedHut([]);
    setAlreadyLinkedHut([]);
    setDirty(true);
  }

  const chooseLinkHut = () => {
    // let mediumPoint = Math.round(hike.points.length/2);

    // verifico quali hut sono già linkati che sono entro 5 km dallo starting point attuale dell'hike

    // già linkati
    let tempAlreadyLinkedHut = hike.points.filter((h) => (h.startPoint === 0 && h.endPoint === 0 && h.referencePoint === 0 && h.hutID));
    // entro 5 km (VERSIONE 1: 1 punto ogni 25)
    for(let i=0;i<hike.points.length;i=i+25){
      // per ogni punto dell'hike verifico la distanza dall'hut linkato
      tempAlreadyLinkedHut.concat(tempAlreadyLinkedHut.filter((h) => coordinatesDistanceInMeter(hike.points[i].latitude, hike.points[i].longitude, h.latitude, h.longitude) < radiusDistance));
    }
    // VERSIONE 2: VALUTO SOLO START POINT, MEDIUM POINT, END POINT
    // tempAlreadyLinkedHut = tempAlreadyLinkedHut.filter((h) => coordinatesDistanceInMeter(startPoint[0], startPoint[1], h.latitude, h.longitude) < radiusDistance);
    // tempAlreadyLinkedHut.concat(tempAlreadyLinkedHut.filter((h) => coordinatesDistanceInMeter(endPoint[0], endPoint[1], h.latitude, h.longitude) < radiusDistance));
    // tempAlreadyLinkedHut.concat(tempAlreadyLinkedHut.filter((h) => coordinatesDistanceInMeter(hike.points[mediumPoint].latitude, hike.points[mediumPoint].longitude, h.latitude, h.longitude) < radiusDistance));
    setAlreadyLinkedHut(tempAlreadyLinkedHut);
    
    let tempLinkedHuts =[];
    for(let i=0;i<hike.points.length;i=i+25){
      // per ogni punto dell'hike verifico la distanza dal potenziale hut linkabile (VERSIONE 1: 1 PUNTO OGNI 25)
      tempLinkedHuts = huts.filter((h) => coordinatesDistanceInMeter(hike.points[i].latitude, hike.points[i].longitude, h.lat, h.lon) < radiusDistance);
    }
    // VERSIONE 2: VALUTO SOLO START POINT, MEDIUM POINT, END POINT
    // let tempLinkedHuts = huts.filter(h => coordinatesDistanceInMeter(startPoint[0], startPoint[1], h.lat, h.lon) < radiusDistance);
    // tempLinkedHuts.concat(huts.filter(h => coordinatesDistanceInMeter(endPoint[0], endPoint[1], h.lat, h.lon) < radiusDistance));
    // tempLinkedHuts.concat(huts.filter(h => coordinatesDistanceInMeter(hike.points[mediumPoint].latitude, hike.points[mediumPoint].longitude, h.lat, h.lon) < radiusDistance));
    
    // mi passo come hut linkabili quelli sono in range e che non sono già linkati
    tempLinkedHuts = tempLinkedHuts.filter(h => !tempAlreadyLinkedHut.map((a)=> a.hutID).includes(h.id));
    setLinkedHut(tempLinkedHuts);
    setFilteredHuts([]);
    setFilteredParkingLots([]);
    setDirty(true);
  }

  return (
    <Container fluid className="external-box">
      <Container fluid className='internal-box' >
        <Row className="center-box mb-4">
          <h2 className="background double single-hike-title"><span><img src={Hiking} alt="hiking_image" className='me-2 hike-img single-hike-icon' />{hike.label}</span></h2>
          {showLinkedHutBanner && <Alert className='alertStyle' variant='success' onClose={() => { setShowLinkedHutBanner(false); setMessage('') }} dismissible>{message}</Alert>}
          {showChooseStartPoint ? <p className='linkSubTitleStartPoint'>Select a new Start point</p> : ""}
          {showChooseEndPoint ? <p className='linkSubTitleEndPoint'>Select a new End point</p> : ""}
          {showLinkHut ? <p className='linkSubTitleHut'>Link a new Hut</p> : ""}
        </Row>
        <Row className="mx-4">
          <Col >
            <Row className='mt-3'>
              {hike.id && <LinkHikeMap length={hike.length} points={hike.points} filteredHuts={filteredHuts} filteredParkingLots={filteredParkingLots} startOrEnd={startOrEnd} hikeId={hikeId} setDirty={setDirty} linkedHut={linkedHut} alreadyLinkedHut={alreadyLinkedHut} setFilteredHuts={setFilteredHuts} setFilteredParkingLots={setFilteredParkingLots} setLinkedHut={setLinkedHut} setAlreadyLinkedHut={setAlreadyLinkedHut} setShowChooseStartPoint={setShowChooseStartPoint} setShowChooseEndPoint={setShowChooseEndPoint} setShowLinkHut={setShowLinkHut} setShowLinkedHutBanner={setShowLinkedHutBanner} setMessage={setMessage}/>}
              {/* hike.id ensures that the map is rendered only when the hike is loaded  */}
            </Row>
            <Row className='btn-row'>
            <Button className="mx-1 mt-2 choose_start slide" onClick={() => { chooseNewStartPoint(); setShowChooseStartPoint(true); setShowChooseEndPoint(false); setShowLinkHut(false); setDirty(true); setShowLinkedHutBanner(false); }} > Choose new Start Point </Button>
              <Button className="mx-1 mt-2 choose_end slide" onClick={() => { chooseNewEndPoint(); setShowChooseEndPoint(true); setShowChooseStartPoint(false); setShowLinkHut(false); setDirty(true); setShowLinkedHutBanner(false); }} > Choose new End Point  </Button>
              <Button className="mx-1 mt-2 link_hut slide" onClick={() => { chooseLinkHut(); setShowLinkHut(true); setShowChooseEndPoint(false); setShowChooseStartPoint(false); setDirty(true); setShowLinkedHutBanner(false); }} > Link hut </Button>
            </Row>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}


function LinkHikeMap(props) {

  const [dirty, setDirty] = useState(true);
  const [startPoint, setStartPoint] = useState(props.points?.filter(p => p.startPoint).map(p => [p.latitude, p.longitude]).pop());
  const [endPoint, setEndPoint] = useState(props.points?.filter(p => p.endPoint).map(p => [p.latitude, p.longitude]).pop());
  const [startPointLabel, setStartPointLabel] = useState(props.points?.filter(p => p.startPoint).pop().label);
  const [endPointLabel, setEndPointLabel] = useState(props.points?.filter(p => p.endPoint).pop().label);
  const [nPoints, setNPoints] = useState(props.points?.length);
  const [positions, setPositions] = useState(props.points?.filter(p => !p.referencePoint && !p.hutID && !p.parkingID).map(p => [p.latitude, p.longitude]));

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
    iconUrl: 'https://wiki.openstreetmap.org/w/images/thumb/f/f1/Alpinehut.svg/120px-Alpinehut.svg.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const iconParkingLot = new Icon({
    iconUrl: 'https://wiki.openstreetmap.org/w/images/archive/b/b2/20190301014443%21Purple-car.svg',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const iconLinkedHut = new Icon({
    iconUrl: LinkedHutIcon,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  useEffect(() => {
    setStartPoint(props.points?.filter(p => p.startPoint).map(p => [p.latitude, p.longitude]).pop());
    setEndPoint(props.points?.filter(p => p.endPoint).map(p => [p.latitude, p.longitude]).pop());
    setStartPointLabel(props.points?.filter(p => p.startPoint).pop().label);
    setEndPointLabel(props.points?.filter(p => p.endPoint).pop().label);
    setNPoints(props.points?.length);
    setPositions(props.points?.filter(p => !p.referencePoint && !p.hutID && !p.parkingID).map(p => [p.latitude, p.longitude]));
    setDirty(false);
    props.setDirty(false);
  }, [dirty, props]);

  // const startPoint = props.points?.filter(p => p.startPoint).map(p => [p.latitude, p.longitude]).pop();
  // const startPointLabel = props.points?.filter(p => p.startPoint).pop().label;
  // const endPoint = props.points?.filter(p => p.endPoint).map(p => [p.latitude, p.longitude]).pop();
  // const endPointLabel = props.points?.filter(p => p.endPoint).pop().label;
  // const nPoints = props.points?.length;
  
  
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

    // const positions = props.points?.filter(p => !p.referencePoint && !p.hutID && !p.parkingID).map(p => [p.latitude, p.longitude]);
  
    const defineNewStartPoint = (point, type) => {
    if(type === "hut"){
      
      const hutPoint = {
        hikeID: props.hikeId,
        lat: point.lat,
        lon: point.lon,
        altitude: point.altitude,
        SP: 1,
        EP: 0,
        RP: 0,
        label: point.name,
        parkingID: null,
        hutID: point.id 
      }

      API.AddPoint(hutPoint)
        .then( () => {props.setDirty(true); setDirty(true);})
        .catch( (err) => console.log(err));
      
    }else if (type === "parking lot"){

      const parkingLotPoint = {
        hikeID: props.hikeId,
        lat: point.lat,
        lon: point.lon,
        altitude: point.altitude,
        SP: 1,
        EP: 0,
        RP: 0,
        label: point.label,
        hutID: null,
        parkingID: point.id }

      API.AddPoint(parkingLotPoint)
        .then( () => {props.setDirty(true); setDirty(true);})
        .catch( (err) => console.log(err)); 
    }
  }

  const defineNewEndPoint = (point, type) => {
    if(type === "hut"){

      const hutPoint = {
        hikeID: props.hikeId,
        lat: point.lat,
        lon: point.lon,
        altitude: point.altitude,
        SP: 0,
        EP: 1,
        RP: 0,
        label: point.name,
        parkingID: null,
        hutID: point.id }
      
      API.AddPoint(hutPoint)
        .then( () => {props.setDirty(true); setDirty(true);})
        .catch( (err) => console.log(err));
    }else if (type === "parking lot"){
      
      const parkingLotPoint = {
        hikeID: props.hikeId,
        lat: point.lat,
        lon: point.lon,
        altitude: point.altitude,
        SP: 0,
        EP: 1,
        RP: 0,
        label: point.label,
        hutID: null,
        parkingID: point.id }

      API.AddPoint(parkingLotPoint)
        .then( () => {props.setDirty(true); setDirty(true);})
        .catch( (err) => console.log(err));
    }
  }

  const linkHut = (point) => {

    const hutPoint = {
      hikeID: props.hikeId,
      lat: point.lat,
      lon: point.lon,
      altitude: point.altitude,
      SP: 0,
      EP: 0,
      RP: 0,
      label: point.name,
      parkingID: null,
      hutID: point.id 
    }

    API.AddPoint(hutPoint)
        .then( () => {props.setDirty(true); setDirty(true);})
        .catch( (err) => console.log(err));
  } 

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
      {props.filteredHuts.length !== 0 ? props.filteredHuts.map(p => {
        return (
          <Marker position={[p.lat, p.lon]} icon={iconHut} key={p.id} >
            {p.name && 
            <Popup>
              <p>{p.name}</p> 
              <p><Button onClick={ () => {props.startOrEnd === "Start Point" ? defineNewStartPoint(p, "hut") : defineNewEndPoint(p, "hut"); props.setFilteredHuts([]); props.setFilteredParkingLots([]); props.setAlreadyLinkedHut([]); props.setShowChooseStartPoint(false); props.setShowChooseEndPoint(false); props.setShowLinkHut(false); } }>{`Set as ${props.startOrEnd}`}</Button></p>
            </Popup>}
          </Marker>
        );
      }) : false}
      {props.filteredParkingLots.length !== 0 ? props.filteredParkingLots?.map(p => {
        return (
          <Marker position={[p.lat, p.lon]} icon={iconParkingLot} key={p.id} >
            {p.label && 
            <Popup>
              <p>{p.label}</p> 
              <p><Button onClick={ () => {props.startOrEnd === "End Point" ? defineNewEndPoint(p, "parking lot") : defineNewStartPoint(p, "parking lot"); props.setFilteredHuts([]); props.setFilteredParkingLots([]); props.setAlreadyLinkedHut([]); props.setShowChooseStartPoint(false); props.setShowChooseEndPoint(false); props.setShowLinkHut(false); } }>{`Set as ${props.startOrEnd}`}</Button></p>
            </Popup>}
          </Marker>
        );
      }) : false}
      {props.linkedHut.length !== 0 ? props.linkedHut.map(p => {
        return (
          <Marker position={[p.lat, p.lon]} icon={iconHut} key={p.id} >
            {p.name && 
            <Popup>
              <p>{p.name}</p>
              <p><Button onClick={ () => { linkHut(p); props.setLinkedHut([]); props.setAlreadyLinkedHut([]); props.setShowChooseStartPoint(false); props.setShowChooseEndPoint(false); props.setShowLinkHut(false); props.setShowLinkedHutBanner(true); props.setMessage(`Hut "${p.name}" linked successfully!`)} }>{`Link Hut`}</Button></p>
            </Popup>}
          </Marker>
        );
      }) : false}
      {props.alreadyLinkedHut.length !== 0 ? props.alreadyLinkedHut.map(p => {
        return (
          <Marker position={[p.latitude, p.longitude]} icon={iconLinkedHut} key={p.id} >
            {p.label && 
            <Popup>
              <p>{p.label}</p>
            </Popup>}
          </Marker>
        );
      }) : false}
    </MapContainer>
  );
}



export default LinkHike;