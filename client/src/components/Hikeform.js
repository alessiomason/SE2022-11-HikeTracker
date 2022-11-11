import { Alert, Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button} from "rsuite";
import "rsuite/dist/rsuite.min.css";


function Hikeform(props) {

    const [label, setLabel] = useState('');
    const [length, setLength] = useState('');
    const [expTime, setExpTime] = useState('');
    const [ascent, setAscent] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [description, setDescription] = useState('');

  const [errorMsg, setErrorMsg] = useState(''); 

  const navigate = useNavigate();
    
  const handleSubmit = (event) => {
    event.preventDefault();
     if (label.trim().length === 0) {
      setErrorMsg('The label of the hike cannot be consisted of only empty spaces');
    } else {
      // add
      const newHike = { label: label, length: length, expTime: expTime, ascent: ascent, difficulty: difficulty, description: description }
      props.addHike(newHike);
      navigate('/');
    }
  }

  

  return (
   
   <>
      <Container>

        <Row>
          <Col>
          {
            <h1>Create new hike</h1>
          }
            
          </Col>
        </Row>

        <Row>
            <Col>
                {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Label</Form.Label>
                    <Form.Control required={true} value={label} onChange={ev => setLabel(ev.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Length</Form.Label>
                    <Form.Control type='number' min={0} value={length} onChange={ev => setLength(ev.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Expected time</Form.Label>
                    <Form.Control type='number' min={0} value={expTime} onChange={ev => setExpTime(ev.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Ascent</Form.Label>
                    <Form.Control type='number' min={0} value={ascent} onChange={ev => setAscent(ev.target.value)} />
                </Form.Group>
                
                <Form.Group>
                    <Form.Label>Difficulty</Form.Label>
                    <Form.Select onChange={ev => setDifficulty(ev.target.value)}> 
                        <option></option>
                        <option>Tourist</option>
                        <option>Hiker</option>
                        <option>Professional hiker</option>
                        <Form.Control required={true}  value={description} onChange={ev => setDescription(ev.target.value)} />
                    </Form.Select>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control required={true}  value={description} onChange={ev => setDescription(ev.target.value)} />
                </Form.Group>

                <Button className= 'm-3' type='submit' >Save</Button>
                <Button className= 'm-3' color='red' appearance="primary" onClick={ ()=> navigate('/')} variant='secondary' >Cancel</Button>
                </Form>
            </Col>
        </Row>
      </Container>
    </>
  );
}

export default Hikeform;