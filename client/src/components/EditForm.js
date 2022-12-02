import { Alert, Form } from 'react-bootstrap';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { default as Img1 } from "../images/img1.jpg";
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/HikeForm.css';

function EditForm(props) {

    const navigate = useNavigate();


    let { hikeId } = useParams();
    hikeId = parseInt(hikeId);
    const hikeToEdit = props.hike.filter((h) => h.id == hikeId)[0];
    let difficulty_text;

    if (props.hike.difficulty == 1) {
        difficulty_text = "Tourist";
    } else if (props.hike.difficulty == 2) {
        difficulty_text = "Hiker";
    } else if (props.hike.difficulty == 3) {
        difficulty_text = "Professional hiker";
    }

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
                province: province,
                municipality: municipality
            }
            props.updateHike(updatedHike);
            props.setDirty(true);
            navigate('/hikeManager');
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="hike_form-title">{`Edit hike #${hikeId}: ${label}`}</h1>
                </Col>
            </Row>

            <Row className="hut_box mx-5 py-5 px-5 mb-4">
                <Col md={13} className="box_img_box" >
                    <img className=" img_box mb-3" src={Img1} alt="First slide" />
                    <Button variant="primary" size="sm" className="btn_box"> Update Image </Button>
                </Col>

                <Row>
                    <Col>
                        {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Label</Form.Label>
                                <Form.Control required={true} value={label} onChange={ev => setLabel(ev.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>State</Form.Label>
                                <Form.Control required={true} value={state} disabled readOnly />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Region</Form.Label>
                                <Form.Control required={true} value={region} disabled readOnly />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Province</Form.Label>
                                <Form.Control required={true} value={province} disabled readOnly />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Municipality</Form.Label>
                                <Form.Control required={true} value={municipality} disabled readOnly />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Length [m]</Form.Label>
                                <Form.Control required={true} type='number' step="any" min={0} value={length} onChange={ev => setLength(ev.target.value)} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Expected time [h]</Form.Label>
                                <Form.Control required={true} type='number' step="any" min={0} value={expTime} onChange={ev => setExpTime(ev.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Ascent [m]</Form.Label>
                                <Form.Control required={true} type='number' step="any" value={ascent} onChange={ev => setAscent(ev.target.value)} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Difficulty</Form.Label>
                                <Form.Select required={true} value={difficultyText} onChange={ev => setDifficultyText(ev.target.value)}>
                                    <option selected disabled value="">Choose...</option>
                                    <option>Tourist</option>
                                    <option>Hiker</option>
                                    <option>Professional hiker</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} />
                            </Form.Group>
                            <Row className='my-3 box_btn'>
                                <Button variant="primary" className="btn_ref" >Add a reference point </Button>
                            </Row>
                            <Button className='save-button' type='submit' >Save</Button>
                            <Button className='back-button' onClick={() => navigate('/')} variant='secondary' >Back</Button>
                            <Button className='delete-button' onClick={() => props.deleteHike(hikeId)} variant='secondary' >Delete</Button>
                        </Form>
                    </Col>
                </Row>
            </Row>
        </Container>
    );
}

export default EditForm;