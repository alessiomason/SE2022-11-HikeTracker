
import '../../styles/HutManager.css';
import { Container, Row, Col, InputGroup, Form, Button, Carousel } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MyHutImages from "../HutImages";


function MyHutManager(props) {


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

    <Container fluid className='back2'>
      <Row className='title_box mb-5'>
        <h1 className='title'> HUT MANAGER </h1>
      </Row>
      <Row className='input-group my-5 mx-auto search_row'>
        <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }} xs={12} >
          <InputGroup >
            <Form.Control placeholder="Insert an hut label" />
            <Button variant="success">Search</Button>
          </InputGroup>
        </Col>
        <Col className='search_row'>
          <Button variant='primary' size="lg" className='mx-5 my-3' onClick={() => navigate("/newHut")}>Add new Hut</Button>
        </Col>
      </Row>
      <Row className="hut_box mx-5 py-5 px-5 mb-4">
        <Col md={6}>
        <MyHutImages/>
        </Col>
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6} >
              <Form.Group className="mb-3" >
                <Form.Label>Label</Form.Label>
                <Form.Control required={true} value={label} onChange={ev => setLabel(ev.target.value)}></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6} >
              <Form.Group className="mb-3" >
                <Form.Label>Location</Form.Label>
                <Form.Control></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Description</Form.Label>
              <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} as="textarea" rows={3} />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Hike condition</Form.Label>
              <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} as="textarea" rows={3} />
            </Form.Group>
          </Row>
          <Row className='btn_box mt-3'>
            <Button variant="info" className="btn_ref mx-2 mb-2" >Add Image</Button>
            <Button variant="primary" className="btn_box2 mx-2 mb-2" >Ref Point</Button>
            <Button variant="danger" onClick={() => props.deleteHike(hike.id)} className="btn_box2 mx-2 mb-2" >Delete</Button>
            <Button variant="success" type='submit' className="btn_box2 mx-2 mb-2">Save</Button>
          </Row>
        </Form>
      </Col>
    </Row>
    </Container>

  );
}

export default MyHutManager;