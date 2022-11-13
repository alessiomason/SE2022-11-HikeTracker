import { Alert, Form } from 'react-bootstrap';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/HikeForm.css';


function Editform(props) {
  
    const { hikeId } = useParams();

    const [hike, setHike] = useState( null );
    const [label, setLabel] = useState( '' );
    const [length, setLength] = useState(1);
    const [expTime, setExpTime] = useState ( 1);
    const [ascent, setAscent] = useState (1);
    const [difficulty, setDifficulty] = useState ('' );
    const [description, setDescription] = useState ('');
   
    console.log(props.hike);

    if(hike === null) {
      if(Array.isArray(props.hike)) {
        const hikeToEdit = props.hike.find( (h) => h.id == hikeId );
       //  console.log(hikeToEdit);
   
        if(hikeToEdit !== undefined) {
        
          setHike(hikeToEdit);
         setLabel( hikeToEdit.label );
         setLength(hikeToEdit.length);
           setExpTime(hikeToEdit.expTime);
           setAscent(hikeToEdit.ascent);
         setDifficulty(hikeToEdit.difficulty );
           setDescription(hikeToEdit.description);
        }
         
       }
    }
      
  
  
    
// 
    // console.log(hikeToEdit);
    



  const [errorMsg, setErrorMsg] = useState(''); 

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
     if (label.trim().length === 0) {
      setErrorMsg('The label of the hike cannot be consisted of only empty spaces');
    } else {
      // add
      const updatedHike = {id:hike.id, label: label, length: length, expTime: expTime, ascent: ascent, difficulty: difficulty, description: description }
      props.updateHike(updatedHike);
      navigate('/');
    }
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
             <h1 className="hike_form-title">Edit hike</h1>
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

                <Button className= 'save-button' type='submit' >Save</Button>
                <Button className= 'back-button' onClick={ ()=> navigate('/')} variant='secondary' >Back</Button>
                <Button className= 'delete-button' onClick={()=>props.deleteHike(hike.id)} variant='secondary' >Delete</Button>
                </Form>
            </Col>
        </Row>
      </Container>
    </>
  );
}

export default Editform;