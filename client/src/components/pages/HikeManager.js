import '../../styles/HikeManager.css';
import { Container, Row, Col, InputGroup, Form, Button, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { default as Img1 } from "../../images/img1.jpg";
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../API.js';

function MyHikeManager(props) {

  const navigate = useNavigate();

  const [hikes, setHikes] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [message, setMessage] = useState('');

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
            <Form.Control placeholder="Insert an hike label" />
            <Button variant="success">Search</Button>
          </InputGroup>
        </Col>
        <Col className='search_row'>
          <Button variant='primary' size="lg" className='mx-5 my-3' onClick={() => navigate("/newHike")}>Add new Hike</Button>
        </Col>
      </Row>
      {showUpdateBanner && <Alert variant='success' onClose={() => { setShowUpdateBanner(false); setMessage('') }} dismissible>{message}</Alert>}
      {hikes.map(h => <SingleUpdateHikeCard key={h.id} hike={h} user={props.user}
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

  if (props.hike.difficulty == 1)
    difficulty_text = "Tourist";
  else if (props.hike.difficulty == 2)
    difficulty_text = "Hiker";
  else if (props.hike.difficulty == 3)
    difficulty_text = "Professional hiker";


  const [label, setLabel] = useState(hikeToEdit ? hikeToEdit.label : '');
  const [length, setLength] = useState(hikeToEdit ? hikeToEdit.length : 0);
  const [expTime, setExpTime] = useState(hikeToEdit ? hikeToEdit.expTime : 0);
  const [ascent, setAscent] = useState(hikeToEdit ? hikeToEdit.ascent : 0);
  const [difficulty, setDifficulty] = useState(hikeToEdit ? hikeToEdit.text : '');
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
      props.setShowUpdateBanner(true);
      props.setMessage(`Hike #${hikeId} ${label} has been updated successfully!`);
      // navigate('/');
    }
  }

  return (

    <Row className="hike_box mx-5 py-5 px-5 mb-4">
      <Col md={2} className="box_img_box" >
        <img className=" img_box mb-3"
          src={preview}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = Img1;
          }}
        />
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label className='updateImageButton'>Update Image</Form.Label>
          <Form.Control type="file"
            onChange={(e) => { setImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])) }} />
        </Form.Group>
      </Col>

      <Col md={10} className="px-4" >
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Label</Form.Label>
                <Form.Control required={true} value={label} onChange={ev => setLabel(ev.target.value)}></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Control required={true} value={state} disabled readOnly/>
              </Form.Group>
            </Col>
            <Col md={3} >
              <Form.Group>
                <Form.Label>Region</Form.Label>
                <Form.Control required={true} value={region} disabled readOnly/>
              </Form.Group>
            </Col>
            <Col md={3} >
              <Form.Group>
                <Form.Label>Province</Form.Label>
                <Form.Control required={true} value={province} disabled readOnly />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Municipality</Form.Label>
                <Form.Control required={true} value={municipality} disabled readOnly />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={3} >
              <Form.Group>
                <Form.Label>Length [m]</Form.Label>
                <Form.Control required={true} type='number' step="any" min={0} value={length} onChange={ev => setLength(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Expected time [h]</Form.Label>
                <Form.Control required={true} type='number' step="any" min={0} value={expTime} onChange={ev => setExpTime(ev.target.value)}></Form.Control>
              </Form.Group>
            </Col>
            <Col md={3} >
              <Form.Group>
                <Form.Label>Ascent [m]</Form.Label>
                <Form.Control required={true} type='number' step="any" value={ascent} onChange={ev => setAscent(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Difficulty</Form.Label>
                <Form.Select required={true} value={difficultyText} onChange={ev => setDifficultyText(ev.target.value)}>
                  <option selected disabled value="">Choose...</option>
                  <option>Tourist</option>
                  <option>Hiker</option>
                  <option>Professional hiker</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={8}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} as="textarea" rows={3} />
              </Form.Group>
            </Col>
            <Col md={4} >
              <Row className='my-3 box_btn'>
                <Button variant="primary" className="btn_ref" >Manage reference points </Button>
              </Row>
              <Row className='box_btn my-2'>
                <Button variant="danger" onClick={() => props.deleteHike(hikeId)} className="btn_box2 mx-2" >Delete</Button>
                <Button variant="success" type='submit' className="btn_box2 mx-2">Save</Button>
              </Row>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}

export default MyHikeManager;