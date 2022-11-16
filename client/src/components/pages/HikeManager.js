import '../../styles/HikeManager.css';
import { Container, Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { default as Img1 } from "../../images/img1.jpg";
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../API.js';

function MyHikeManager(props) {

  const navigate = useNavigate();

  const [hikes, setHikes] = useState([]);
  const [dirty, setDirty] = useState(true);

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
            <Form.Control placeholder="Insert an hike title" />
            <Button variant="success">Search</Button>
          </InputGroup>
        </Col>
        <Col className='search_row'>
          <Button variant='primary' size="lg" className='mx-5 my-3' onClick={() => navigate("/newHike")}>Add new Hike</Button>
        </Col>
      </Row>
      {hikes.map(h => <SingleUpdateHikeCard key={h.id} hike={h} user={props.user} />)}
    </Container>

  );
}

function SingleUpdateHikeCard(props) {

  const navigate = useNavigate();
  const { hikeId } = useParams();

  const [hike, setHike] = useState(null);
  const [label, setLabel] = useState('');
  const [length, setLength] = useState(1);
  const [expTime, setExpTime] = useState(1);
  const [ascent, setAscent] = useState(1);
  const [difficulty, setDifficulty] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (hike === null) {
    if (Array.isArray(props.hike)) {
      const hikeToEdit = props.hike.find((h) => h.id == hikeId);

      if (hikeToEdit !== undefined) {
        setHike(hikeToEdit);
        setLabel(hikeToEdit.label);
        setLength(hikeToEdit.length);
        setExpTime(hikeToEdit.expTime);
        setAscent(hikeToEdit.ascent);
        setDifficulty(hikeToEdit.difficulty);
        setDescription(hikeToEdit.description);
      }
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (label.trim().length === 0)
      setErrorMsg('The label of the hike cannot be consisted of only empty spaces');
    else {
      // add
      const updatedHike = { id: hike.id, label: label, length: length, expTime: expTime, ascent: ascent, difficulty: difficulty, description: description }
      props.updateHike(updatedHike);
      props.setDirty(true);
      navigate('/');
    }
  }

  return (

    <Row className="hut_box mx-5 py-5 px-5 mb-4">
      <Col md={2} className="box_img_box" >
        <img className=" img_box mb-3" src={Img1} alt="First slide" />
        <Button variant="primary" size="sm" className="btn_box"> Update Image </Button>
      </Col>

      <Col md={10} className="px-4" >
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4} >
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control required={true} value={props.hike.label} onChange={ev => setLabel(ev.target.value)}></Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Municipality</Form.Label>
                <Form.Control></Form.Control>
              </Form.Group>
            </Col>
            <Col md={4} >
              <Form.Group>
                <Form.Label>Province</Form.Label>
                <Form.Control></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4} >
              <Form.Group>
                <Form.Label>Length [m]</Form.Label>
                <Form.Control type='number' step="any" min={0} value={props.hike.length} onChange={ev => setLength(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Expected time [h]</Form.Label>
                <Form.Control type='number' step="any" min={0} value={props.hike.expTime} onChange={ev => setExpTime(ev.target.value)}></Form.Control>
              </Form.Group>
            </Col>
            <Col md={4} >
              <Form.Group>
                <Form.Label>Ascent [m]</Form.Label>
                <Form.Control type='number' step="any" value={props.hike.ascent} onChange={ev => setAscent(ev.target.value)} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Difficulty</Form.Label>
                <Form.Select value={props.hike.difficulty} onChange={ev => setDifficulty(ev.target.value)}>
                  <option></option>
                  <option>Tourist</option>
                  <option>Hiker</option>
                  <option>Professional hiker</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Description</Form.Label>
                <Form.Control required={true} value={props.hike.description} onChange={ev => setDescription(ev.target.value)} as="textarea" rows={2} />
              </Form.Group>
            </Col>
            <Col md={4} >
              <Row className='my-3 box_btn'>
                <Button variant="primary" className="btn_ref" >Add a reference point </Button>
              </Row>
              <Row className='box_btn my-2'>
                <Button variant="danger" onClick={() => props.deleteHike(hike.id)} className="btn_box2 mx-2" >Delete</Button>
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