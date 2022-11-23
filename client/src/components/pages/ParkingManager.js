import HikesCards from '../HikeCards';
import MyTopHome from '../TopHome';
import MyFilterSection from '../FilterSection';
import '../../styles/HikeManager.css';
import { Container, Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { default as Image2 } from "../../images/image2.jpg";
import { useNavigate, useParams } from 'react-router-dom';

function MyParkingManager(props) {


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

    <Container fluid className='back3'>
      <Row className='title_box'>
        <h1 className='title'> PARKING MANAGER </h1>
      </Row>
      <Row className='input-group my-5 mx-auto search_row'>
        <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }} xs={12} >
          <InputGroup >
            <Form.Control placeholder="Insert a parking label" />
            <Button variant="success">Search</Button>
          </InputGroup>
        </Col>
        <Col className='search_row'>
          <Button variant='primary' size="lg" className='mx-5 my-3' onClick={() => navigate("/newHike")}>Add new Parking</Button>
        </Col>
      </Row>

      <Row className='box_btn2'>
        <Col md={10}>
          <Row className="hut_box mx-5 py-5 px-5 mb-4">
            <Col md={3} className="box_img_box" >
              <img className=" img_box mb-3" src={Image2} alt="First slide" />
              <Button variant="primary" size="sm" className="btn_box"> Update Image </Button>
            </Col>
            <Col md={9} className="px-4" >
              <Form onSubmit={handleSubmit}>
                <Row>
                <Col md={10} className="pe-4">
                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-2 mt-1'>
                        <Form.Label>Label</Form.Label>
                        <Form.Control required={true} value={label} onChange={ev => setLabel(ev.target.value)}></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-2 mt-1'>
                        <Form.Label>Location</Form.Label>
                        <Form.Control></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} as="textarea" rows={3} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>

                <Col md={2} className="box_btn2">
                  <Button variant="primary" className="btn_box2 mx-3 mb-2" >Ref Point</Button>
                  <Button variant="danger" onClick={() => props.deleteHike(hike.id)} className="btn_box2 mx-3 mb-2" >Delete</Button>
                  <Button variant="success" type='submit' className="btn_box2 mx-3 mb-2">Save</Button>
                </Col>
                </Row>
              </Form>
            </Col>



          </Row>
        </Col>
      </Row>
    </Container>

  );
}

export default MyParkingManager;