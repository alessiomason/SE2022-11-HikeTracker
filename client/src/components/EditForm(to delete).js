import { Alert, Form } from 'react-bootstrap';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/HikeForm.css';


function EditForm(props) {

    const navigate = useNavigate();
    let { hikeId } = useParams();
    hikeId = parseInt(hikeId);
    const hikeToEdit = hikeId ? props.hike.find((hike) => hike.id == hikeId) : undefined;
    
    const [label, setLabel] = useState(hikeToEdit ? hikeToEdit.label : '');
    const [length, setLength] = useState(hikeToEdit ? hikeToEdit.length : 0);
    const [expTime, setExpTime] = useState(hikeToEdit ? hikeToEdit.expTime : 0);    
    const [ascent, setAscent] = useState(hikeToEdit ? hikeToEdit.ascent : 0);    
    const [difficulty, setDifficulty] = useState(hikeToEdit ? hikeToEdit.difficulty : '');
    const [description, setDescription] = useState(hikeToEdit ? hikeToEdit.description : '');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        if (label.trim().length === 0)
            setErrorMsg('The label of the hike cannot be consisted of only empty spaces');
        else {
            // add

            const updatedHike = { label: label, length: length, expTime: expTime, ascent: ascent, difficulty: difficulty, description: description }
            props.updateHike(updatedHike);
            props.setDirty(true);
            navigate('/');
        }
    }

    return (
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
                            <Form.Label>Length [m]</Form.Label>
                            <Form.Control type='number' step="any" min={0} value={length} onChange={ev => setLength(ev.target.value)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Expected time [h]</Form.Label>
                            <Form.Control type='number' step="any" min={0} value={expTime} onChange={ev => setExpTime(ev.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Ascent [m]</Form.Label>
                            <Form.Control type='number' step="any" value={ascent} onChange={ev => setAscent(ev.target.value)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Difficulty</Form.Label>
                            <Form.Select onChange={ev => setDifficulty(ev.target.value)}>
                                <option></option>
                                <option>Tourist</option>
                                <option>Hiker</option>
                                <option>Professional hiker</option>
                                <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} />
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} />
                        </Form.Group>

                        <Button className='save-button' type='submit' >Save</Button>
                        <Button className='back-button' onClick={() => navigate('/')} variant='secondary' >Back</Button>
                        <Button className='delete-button' onClick={() => props.deleteHike(hikeId)} variant='secondary' >Delete</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default EditForm;