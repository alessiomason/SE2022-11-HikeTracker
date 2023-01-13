import { Form, Container, Row, Col, Button, FloatingLabel } from 'react-bootstrap';
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { default as Img1 } from "../images/img1.jpg";
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/HikeForm.css';
import API from '../API';
const dayjs = require('dayjs');

function EditForm(props) {

  const navigate = useNavigate();
  const [hikePoints, setHikePoints] = useState('');
  const [dirty, setDirty] = useState(true);

  let { hikeId } = useParams();
  hikeId = parseInt(hikeId);
  const hikeToEdit = props.hike.filter((h) => h.id === hikeId)[0];
  let difficulty_text;

  useEffect(() => {
    if (dirty) {
      API.getHike(hikeId)
        .then((hike) => {
          setHikePoints(hike);
        });
    }
    setDirty(false)
  }, [dirty, hikeId]);

  if (parseInt(props.hike.difficulty) === 1)
    difficulty_text = "Tourist";
  else if (parseInt(props.hike.difficulty) === 2)
    difficulty_text = "Hiker";
  else if (parseInt(props.hike.difficulty) === 3)
    difficulty_text = "Professional hiker";

  const [label, setLabel] = useState(hikeToEdit ? hikeToEdit.label : '');
  const [length, setLength] = useState(hikeToEdit ? hikeToEdit.length : 0);
  const [expTime, setExpTime] = useState(hikeToEdit ? hikeToEdit.expTime : 0);
  const [ascent, setAscent] = useState(hikeToEdit ? hikeToEdit.ascent : 0);

  const [difficultyText, setDifficultyText] = useState(difficulty_text);
  const [description, setDescription] = useState(hikeToEdit ? hikeToEdit.description : '');
  const [state, setState] = useState(hikeToEdit ? hikeToEdit.state : '');
  const [region, setRegion] = useState(hikeToEdit ? hikeToEdit.region : '');
  const [province, setProvince] = useState(hikeToEdit ? hikeToEdit.province : '');
  const [municipality, setMunicipality] = useState(hikeToEdit ? hikeToEdit.municipality : '');
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (label.trim().length === 0)
      setErrorMsg('The label of the hike cannot be consisted of only empty spaces');
    else {
      const updatedHike = {
        id: hikeId,
        label: label,
        length: length,
        expTime: expTime,
        ascent: ascent,
        difficulty: difficultyText,
        description: description,
        state: state,
        region: region,
        province: province,
        municipality: municipality,
        image: image
      }
      props.updateHike(updatedHike);
      props.setDirty(true);
      navigate('/hikeManager');
    }
  }

  return (
    <Container fluid className="external-box-hike">
      <Container fluid className='internal-box-hut pb-3' >
        <Row>
          <Col>
            <h1 className="hike_form-title">{`Edit hike #${hikeId}: ${label}`}</h1>
          </Col>
        </Row>

        <Form onSubmit={handleSubmit}>
          <Row className="hut_box px-5 pt-5">
            <Col md={4} className="box_img_box" >
              <img className=" img_box-hike mb-3"
                src={preview}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = Img1;
                }}
              />
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label className='updateImage'>Upload Image</Form.Label>
                <Form.Control type="file" accept='.jpg'
                  onChange={(e) => { setImage(e.currentTarget.files[0]); setPreview(URL.createObjectURL(e.currentTarget.files[0])) }} />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Row className='man-hike-label'>
                <Col md={12}>
                  <FloatingLabel controlId="floatingInput" label="Label" className="mb-3">
                    <Form.Control required={true} value={label} onChange={ev => setLabel(ev.target.value)}></Form.Control>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className='man-hike-label'>
                <Col md={6}>
                  <FloatingLabel controlId="floatingInput" label="Length [m]" className="mb-3">
                    <Form.Control required={true} type='number' step="any" min={0} value={length} onChange={ev => setLength(ev.target.value)} />
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel controlId="floatingInput" label="Ascent [m]" className="mb-3">
                    <Form.Control required={true} type='number' step="any" value={ascent} onChange={ev => setAscent(ev.target.value)} />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className='man-hike-label'>
                <Col md={6}>
                  <FloatingLabel controlId="floatingInput" label="Expected time [h] " className="mb-3">
                    <Form.Control required={true} type='number' step="any" min={0} value={expTime} onChange={ev => setExpTime(ev.target.value)}></Form.Control>
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel controlId="floatingSelect" label="Difficulty" className="form-sel2 mb-3">
                    <Form.Select required={true} value={difficultyText} onChange={ev => setDifficultyText(ev.target.value)}>
                      <option selected disabled value="">~ Choose a Difficulty ~</option>
                      <option>Tourist</option>
                      <option>Hiker</option>
                      <option>Professional hiker</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className='man-hike-label'>
                <Col md={12}>
                  <FloatingLabel controlId="floatingTextarea2" label="Description" className="mb-3">
                    <Form.Control required={true} value={description} as="textarea" style={{ height: '130px' }} onChange={ev => setDescription(ev.target.value)} />
                  </FloatingLabel>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="hut_box px-5 man-hike-label">
            <Col md={8} >
              {hikeId && <EditHikeMap length={hikePoints.length} points={hikePoints.points} ></EditHikeMap>}
            </Col>
            <Col md={4}>
              <Row >
                <Col md={12} >
                  <FloatingLabel controlId="floatingInput" label="State" className="mb-3 mt-3">
                    <Form.Control required={true} value={state} disabled readOnly />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FloatingLabel controlId="floatingInput" label="Region" className="mb-3">
                    <Form.Control required={true} value={region} disabled readOnly />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FloatingLabel controlId="floatingInput" label="Province" className="mb-3">
                    <Form.Control required={true} value={province} disabled readOnly />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FloatingLabel controlId="floatingInput" label="Municipality" className="mb-3">
                    <Form.Control required={true} value={municipality} disabled readOnly />
                  </FloatingLabel>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className='btn_box mx-2 mt-3 my-new'>
            <Button variant="danger" onClick={() => navigate('/hikeManager')} className="cancel-btn mx-2 mb-2" >Back</Button>
            <Button variant="success" type='submit' className="save-btn mx-2 mb-2">Save</Button>
          </Row>
        </Form>
      </Container >
    </Container>
  );
}

function EditHikeMap(props) {

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

  const iconNotReachedReferencePoint = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [20, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const iconReachedReferencePoint = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [20, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const startPoint = props.points?.filter(p => p.startPoint).map(p => [p.latitude, p.longitude]).pop();
  const startPointLabel = props.points?.filter(p => p.startPoint).pop().label;
  const endPoint = props.points?.filter(p => p.endPoint).map(p => [p.latitude, p.longitude]).pop();
  const endPointLabel = props.points?.filter(p => p.endPoint).pop().label;
  const nPoints = props.points?.length;
  let middlePoint;
  if (nPoints)
    middlePoint = props.points?.map(p => [p.latitude, p.longitude])[Math.round(nPoints / 2)];

  let center = [44.66926331584312, 7.077110435048376];     // default point
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

  const reachedPositions = props.points?.filter(p => p.reachedInOngoingHike && !p.referencePoint && !p.hutID && !p.parkingID).map(p => [p.latitude, p.longitude]);
  const notReachedPositions = props.points?.filter(p => !p.reachedInOngoingHike && !p.referencePoint && !p.hutID && !p.parkingID).map(p => [p.latitude, p.longitude]);
  return (
    <MapContainer className='single-hike-map' center={center} zoom={zoom}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reachedPositions && <Polyline pathOptions={{ color: '#a972cb' }} positions={reachedPositions} />}
      {notReachedPositions && <Polyline pathOptions={{ color: 'blue' }} positions={notReachedPositions} />}
      {startPoint && <Marker position={startPoint} icon={iconStartPoint}>
        {startPointLabel || props.showStartHike &&
          <Popup>
            {startPointLabel}
            {props.showStartHike && <Button className='start_btn' onClick={() => props.setTrackedHikeModalShow('start')}>Start hike</Button>}
          </Popup>}
      </Marker>}
      {endPoint && <Marker position={endPoint} icon={iconEndPoint}>
        {endPointLabel && <Popup>{endPointLabel}</Popup>}
        {endPointLabel || props.showTerminateHike &&
          <Popup>
            {endPointLabel}
            {props.showTerminateHike && <Button className='terminate_btn' onClick={() => props.setTrackedHikeModalShow('terminate')}>Terminate hike</Button>}
          </Popup>}
      </Marker>}
      {props.points?.filter(p => p.referencePoint).map(p => {
        return (
          <Marker position={[p.latitude, p.longitude]} icon={p.reachedInOngoingHike ? iconReachedReferencePoint : iconNotReachedReferencePoint} key={p.pointID}>
            {(p.label || props.showTerminateHike) &&
              <Popup>
                <p><strong>{p.label}</strong></p>
                {!p.reachedInOngoingHike && props.showTerminateHike &&  // not shown if hike is not started
                  <Button className='reach_ref_point_btn' onClick={() => props.setReferencePointReachedModalShow(p.pointID)}>Mark as reached</Button>}
                {p.reachedInOngoingHike && p.timeOfReach && <p>Reached on {dayjs(p.timeOfReach).format('MMM DD, YYYY h:mm:ss a')}</p>}
                {p.reachedInOngoingHike && !p.timeOfReach && <p>Point reached, time of reach not marked</p>}
              </Popup>
            }
          </Marker>
        );
      })}

    </MapContainer>
  );
}

export default EditForm;