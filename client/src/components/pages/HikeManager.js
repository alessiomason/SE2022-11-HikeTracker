import '../../styles/HikeManager.css';
import { Container, Row, Col, InputGroup, Form, Button, Alert, FloatingLabel } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { default as Img1 } from "../../images/img1.jpg";
import { useNavigate } from 'react-router-dom';
import API from '../../API.js';

function MyHikeManager(props) {

  const navigate = useNavigate();

  const [hikes, setHikes] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [message, setMessage] = useState('');
  const [searchField, setSearchField] = useState('');

  useEffect(() => {
    if (dirty) {
      API.getHikes()
        .then((hikes) => setHikes(hikes))
        .catch(err => console.log(err))
      setDirty(false);
    }
  }, [dirty]);

  return (

    <Container fluid className='back'>
      <Row className='title_box'>
        <h1 className='title'> HIKE MANAGER </h1>
      </Row>
      <Row className='input-group my-5 mx-auto search_row'>
        <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }} xs={12} >
          <InputGroup >
            <Form.Control value={searchField} onChange={ev => setSearchField(ev.target.value)} placeholder="Type to search an hike by label" />
            <Button variant="success" onClick={() => setSearchField('')}>Clear</Button>
          </InputGroup>
        </Col>
        <Col className='search_row'>
          <Button variant='primary' size="lg" className='mx-5 my-3 add-man-btn' onClick={() => navigate("/newHike")}>Add new Hike</Button>
        </Col>
      </Row>
      {showUpdateBanner && <Alert variant='success' onClose={() => { setShowUpdateBanner(false); setMessage('') }} dismissible>{message}</Alert>}
      {hikes.filter(h => searchField === '' || searchField !== '' && h.label.toLowerCase()
        .indexOf(searchField) !== -1).filter((h) => h.authorId === props.user.id)
        .sort((a, b) => (a.id > b.id) ? 1 : -1).map(h => <SingleUpdateHikeCard key={h.id} hike={h} user={props.user}
          updateHike={props.updateHike} deleteHike={props.deleteHike} setDirty={setDirty}
          setShowUpdateBanner={setShowUpdateBanner} setMessage={setMessage} />)}
    </Container>

  );
}

function SingleUpdateHikeCard(props) {

  const navigate = useNavigate();

  let hikeId = props.hike.id;
  const hikeToEdit = props.hike;
  let difficulty_text;

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
  const [errorMsg, setErrorMsg] = useState('');
  const [image, setImage] = useState(`http://localhost:3001/images/hike-${hikeId}.jpg`);
  const [preview, setPreview] = useState(`http://localhost:3001/images/hike-${hikeId}.jpg`);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (label.trim().length === 0)
      setErrorMsg('The label of the hike cannot consist of only empty spaces');
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
      props.setShowUpdateBanner(true);
      props.setMessage(`Hike #${hikeId} ${label} has been updated successfully!`);
    }
  }

  return (

    <Row className="hike_box mx-5 py-5 px-5 mb-4">
      <Col lg={3} md={6} sm={12} className="box-center" >
        <img className=" img_box-hike mb-3 "
          src={preview}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = Img1;
          }}
        />
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label className='updateImageHut'>Update Image</Form.Label>
          <Form.Control type="file" accept='.jpg'
            onChange={(e) => { setImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])) }} />
        </Form.Group>
      </Col>

      <Col lg={9} md={6} sm={12} >
        <Form onSubmit={handleSubmit}>
          <Row className='man-hike-label'>
            <Col lg={6} md={12} sm={12} xs={12} >
              <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                <Form.Control required={true} value={label} onChange={ev => setLabel(ev.target.value)} type="text" placeholder="Rifugio x" />
              </FloatingLabel>
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <FloatingLabel controlId="floatingInput" label="Length [m]" className="mb-3">
                <Form.Control required={true} type='number' step="any" min={0} value={length} onChange={ev => setLength(ev.target.value)} />
              </FloatingLabel>
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <FloatingLabel controlId="floatingInput" label="Ascent [m]" className="mb-3">
                <Form.Control required={true} type='number' step="any" value={ascent} onChange={ev => setAscent(ev.target.value)}></Form.Control>
              </FloatingLabel>
            </Col>
          </Row>
          <Row className='man-hike-label'>
            <Col lg={3} md={6} sm={6} xs={12}>
              <FloatingLabel controlId="floatingInput" label="State" className="mb-3">
                <Form.Control required={true} value={state} type="text" disabled readOnly></Form.Control>
              </FloatingLabel>
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <FloatingLabel controlId="floatingInput" label="Region" className="mb-3">
                <Form.Control required={true} value={region} type="text" disabled readOnly ></Form.Control>
              </FloatingLabel>
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <FloatingLabel controlId="floatingInput" label="Province" className="mb-3">
                <Form.Control required={true} value={province} type="text" disabled readOnly></Form.Control>
              </FloatingLabel>
            </Col>
            <Col lg={3} md={6} sm={6} xs={12}>
              <FloatingLabel controlId="floatingInput" label="Municipality" className="mb-3">
                <Form.Control required={true} value={municipality} type="text" disabled readOnly></Form.Control>
              </FloatingLabel>
            </Col>
          </Row>
          <Row className='man-hike-label'>
            <Col lg={3} md={6} sm={6} xs={12}>
              <Row>
                <Col md={12}>
                  <FloatingLabel controlId="floatingInput" label="Expected time [h] " className="mb-3">
                    <Form.Control required={true} type='number' step="any" min={0} value={expTime} onChange={ev => setExpTime(ev.target.value)} />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col md={12} >
                  <FloatingLabel controlId="floatingSelect" label="Difficulty" className="form-sel2 mb-3">
                    <Form.Select aria-label="Floating label select example" placeholder="Select an Hike Condition" required={true} value={difficultyText} onChange={ev => setDifficultyText(ev.target.value)}>
                      <option disabled value="">Choose...</option>
                      <option>Tourist</option>
                      <option>Hiker</option>
                      <option>Professional hiker</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Row>
            </Col>
            <Col md={6} sm={6}>
              <FloatingLabel controlId="floatingTextarea2" label="Description" className="mb-3">
                <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} as="textarea" style={{ height: '130px' }} placeholder="description" />
              </FloatingLabel>
            </Col>
            <Col lg={3} md={12} sm={12} xs={12}>
              <Row>
                <Col md={12}>
                  <Button variant="primary" className="ref-btn mx-2 mb-3"
                    onClick={() => navigate(`/refPoints/${hikeId}`)} >Manage Ref Points </Button>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Button variant="warning" className="link-btn mx-2 mb-3"
                    onClick={() => navigate(`/linkHike/${hikeId}`)}>Link Hut/Parking Lot </Button>
                </Col>
              </Row>
              <Row className='btn_box'>
                <Button variant="danger" onClick={() => props.deleteHike(hikeId)} className="cancel-btn2 mx-2 mb-2" >Delete</Button>
                <Button variant="success" type='submit' className="save-btn2 mx-2 mb-2">Save</Button>
              </Row>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}

export default MyHikeManager;