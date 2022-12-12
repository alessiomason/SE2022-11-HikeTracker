import { Alert, Form } from 'react-bootstrap';
import { Icon, point } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '..//styles/singlePageHike.css';
import '..//styles/ReferencePoints.css';
import '../styles/Map.css';
import 'leaflet/dist/leaflet.css';
import API from '../API';
import { default as Hiking } from '..//icons/hiking.svg';

function ReferencePoints() {


  const navigate = useNavigate();

  const [hike, setHike] = useState({});
  const [dirty, setDirty] = useState(true);
  const [referencePoint, setReferencePoint] = useState([]);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [pointID, setPointID] = useState(0);
  const [adding,setAdding ] = useState(Boolean);
  const [deleting, setDeleting] = useState (Boolean);  
  const [newRefPointID, setNewRefPointId] = useState (0);  
  const [validPoint, setValidPoint] = useState(false);
  const [marker, setMarker] = useState([0, 0]);
  const [disable,setDisable] = useState(true);



  let { hikeId } = useParams();
  hikeId = parseInt(hikeId);

  useEffect(() => {
    if (dirty) {
      API.getHike(hikeId)
        .then((h) => setHike(h))
        .catch(err => console.log(err))
     API.getReferencePoint()
        .then((rp) => setReferencePoint(rp))
        .catch(err => console.log(err))
      setDirty(false);
    }
  }, [dirty, hikeId]);

  const confirmationButton = async (pointID) => {

    if (adding && pointID != 0 && validPoint ) {
    await API.setNewReferencePoint(newRefPointID)
    .then( )
    .catch( err => console.log("error " + err));
    navigate('/hikeManager');
    };
    console.log("deleting: " + deleting + "  point: " + pointID);
    if (pointID != 0 ){
      await API.clearReferencePoint(pointID)
      .then( )
      .catch( err => console.log(err));
      navigate('/hikeManager');
    } 
    // else {
    //   setErrorMsg('This point cannot be selected as a reference point');
    
    // }
  }

  return (
    <Container fluid className="external-box">
      <Container fluid className='internal-box' >
        <Row className="center-box mb-4">
          <h2 className="background double single-hike-title"><span><img src={Hiking} alt="hiking_image" className='me-2 hike-img single-hike-icon' />{hike.label}</span></h2>
          {adding ? "Select a point on a hike to add a new reference point" 
          :"To delete a reference point, click on it on the hike map"
          }
        </Row>
        <Row className="mx-4">
          <Col >
            <Row className='mt-3'>
              {hike.id && <ManageReferencePoints length={hike.length} points={hike.points} pointID={pointID} setPointID={setPointID} marker={marker} setMarker={setMarker}
               referencePoint={referencePoint} setReferencePoint={setReferencePoint} newRefPointID={newRefPointID} setNewRefPointId={setNewRefPointId}
                latitude={latitude} setLatitude={setLatitude}  longitude={longitude} setLongitude={setLongitude} adding={adding} deleting={deleting} setDeleting={setDeleting} 
                confirmationButton={confirmationButton} validPoint={validPoint} setValidPoint={setValidPoint}
                />}
              {/* hike.id ensures that the map is rendered only when the hike is loaded  */}
            </Row>
            <Row className='btn-row' md="auto" >
              <Button className="mx-1 mt-2 choose_start slide"  onClick={() => {setAdding(true) } } > Add a new reference point </Button>
                <Col>
                  <Row >
                  <Button className="mx-1 mt-2 cancel_refPoint slide" type="submit"  onClick={()=>{navigate('/hikeManager')}} > Cancel </Button>
                  </Row>
                  <Row >
                  <Button className="mx-1 mt-2 save_refPoint slide"   onClick={()=>{if(adding && validPoint){confirmationButton(); }}} > Save </Button>
                  </Row>
                </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

function ManageReferencePoints(props) {

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
      
       {(props.adding)? <LocationMarker setLatitude={props.setLatitude} setLongitude={props.setLongitude} points={props.points} marker={props.marker} setMarker={props.setMarker}
       pointID={props.pointID} setPointID={props.setPointID} referencePoint={props.referencePoint} setReferencePoint={props.setReferencePoint} 
       newRefPointID={props.newRefPointID} setNewRefPointId={props.setNewRefPointId} adding={props.adding} validPoint={props.validPoint} setValidPoint={props.setValidPoint}
       />
        :
        false}

      {positions && <Polyline pathOptions={{ fillColor: 'red', color: 'blue' }} positions={positions} />}
      {startPoint && <Marker position={startPoint} icon={iconStartPoint}>
        {startPointLabel && <Popup>{startPointLabel}</Popup>}
      </Marker>}
      {endPoint && <Marker position={endPoint} icon={iconEndPoint}>
        {endPointLabel && <Popup>{endPointLabel}</Popup>}
      </Marker>}

      {props.points?.filter(p => p.referencePoint).map(p => {
        return (
          <Marker position={[p.latitude, p.longitude]} icon={iconReferencePoint} key={p.pointID} onClick={()=>{if (props.deleting) {  props.setPointID(p.pointID) }}}>
            {p.pointID && <Popup>
             <p>Are you sure you want to delete this point?</p> 
             <div className ="text-center" >
             <p><Button variant='danger' onClick={() =>{props.setDeleting(true); props.confirmationButton(p.pointID)}} >Delete</Button></p>
             </div>
              </Popup>}
          </Marker>
        );
      })}
    </MapContainer>
  );
}

function LocationMarker(props) {
  
  const markerIcon = new Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
  });
  // const [marker, setMarker] = useState([0, 0]);

  useMapEvents({
      click(e) {
          props.setLatitude(e.latlng.lat);
          props.setLongitude(e.latlng.lng);
          props.setMarker([e.latlng.lat, e.latlng.lng]);
        }
  });

  props.points.map(p =>{ 
    let lat = p.latitude.toString();
    let lon = p.longitude.toString();

    if( props.marker[0]!=0 &&props.marker[1]!=0 && props.adding && lat.match(props.marker[0].toString().slice(0,6)) && lon.match(props.marker[1].toString().slice(0,6))){
        props.setNewRefPointId(p.pointID);
        props.setValidPoint(true);

    
    }
   })

  return (<Marker position={props.marker} icon={markerIcon} />);
}

export default ReferencePoints;