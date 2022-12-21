import '../../styles/HutManager.css';
import { Container, Row, Col, InputGroup, Form, Button, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../API.js';
import { default as Img1 } from "../../images/img1.jpg";

function MyHutManager(props) {


  const navigate = useNavigate();

  const [huts, setHuts] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [message, setMessage] = useState('');
  const [name,setName] = useState('');

  useEffect(() => {
    if (dirty) {
      API.getHuts()
        .then((h) => setHuts(h))
        .catch(err => console.log(err))
      setDirty(false);
    }
  }, [dirty]);

  

  return (

    <Container fluid className='back'>
      <Row className='title_box'>
        <h1 className='title'> HUT MANAGER </h1>
      </Row>
      <Row className='input-group my-5 mx-auto search_row'>
        <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }} xs={12} >
          <InputGroup >
            <Form.Control placeholder="Type to search an hut by name or description" value={name} onChange={ev => {setName(ev.target.value)}}/>
            <Button variant="success" onClick={()=>{setName('')}} >Clear</Button>
          </InputGroup>
        </Col>
        <Col className='search_row'>
          <Button variant='primary' size="lg" className='mx-5 my-3' onClick={() => navigate("/newHut")}>Add new Hut</Button>
        </Col>
      </Row>
      {showUpdateBanner && <Alert variant='success' onClose={() => {setShowUpdateBanner(false); setMessage('')}} dismissible>{message}</Alert>}
      {huts.sort((a, b) => (a.id > b.id) ? 1 : -1).map(h => <SingleUpdateHutCard key={h.id} hut={h} user={props.user}
        updateHut={props.updateHut} deleteHut={props.deleteHut} setDirty={setDirty}
        setShowUpdateBanner={setShowUpdateBanner} setMessage={setMessage} name={name} />)}
    </Container>

  );
}

function SingleUpdateHutCard(props) { 


  let hutID = props.hut.id;
  const hutToEdit = props.hut;

  const [name, setName] = useState(hutToEdit ? hutToEdit.name : '');
  const [description, setDescription] = useState(hutToEdit ? hutToEdit.description : '');
  const [lat, setLat] = useState(hutToEdit ? hutToEdit.lat : 0);
  const [lon, setLon] = useState(hutToEdit ? hutToEdit.lon : 0);
  const [altitude, setAltitude] = useState(hutToEdit ? hutToEdit.altitude : 0);
  const [beds, setBeds] = useState(hutToEdit ? hutToEdit.beds : 0);
  const [state, setState] = useState(hutToEdit ? hutToEdit.state : '');
  const [region, setRegion] = useState(hutToEdit ? hutToEdit.region : '');
  const [province, setProvince] = useState(hutToEdit ? hutToEdit.province : '');
  const [municipality, setMunicipality] = useState(hutToEdit ? hutToEdit.municipality : '');
  const [errorMsg, setErrorMsg] = useState('');
  const [image, setImage] = useState(`http://localhost:3001/images/hut-${hutID}.jpg`);
  const [preview, setPreview] = useState(`http://localhost:3001/images/hut-${hutID}.jpg`);



  const handleSubmit = (event) => {
    event.preventDefault();

    if (name.trim().length === 0)
      setErrorMsg('The name of the hut cannot be consisted of only empty spaces');
    else {
      const updatedHut = { 
        id: hutID, 
        name: name, 
        description: description, 
        lat: lat, 
        lon: lon, 
        altitude: altitude, 
        beds: beds,
        state: state,
        region: region,
        province: province,
        municipality: municipality,
        image: image
      }
      props.updateHut(updatedHut);
      props.setDirty(true);
      props.setShowUpdateBanner(true);
      props.setMessage(`Hut #${hutID} ${name} has been updated successfully!`);
    }
  }
    
    if(props.name === '' ||  name.toLowerCase().match(props.name.toLowerCase()) || description.toLowerCase().match(props.name.toLowerCase())){
  return (
      
    
      <Row className="hut_box mx-5 py-5 px-5 mb-4">
        <Col md={5} className="box_img_box" >
          <img className=" img_box mb-3"
            src={preview}
              onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = Img1;
            }}
           />
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label className='updateImageHut'>Update Image</Form.Label>
            <Form.Control type="file" accept='.jpg'
              onChange={(e) => { setImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0]))} }/>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6} >
              <Form.Group className="mb-3" >
                <Form.Label>Name</Form.Label>
                <Form.Control required={true} value={name} onChange={ev => setName(ev.target.value)}></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6} >
              <Form.Group className="mb-3" >
                <Form.Label>Number of Beds</Form.Label>
                <Form.Control required={true} type='number' step="any" min={0} value={beds} onChange={ev => setBeds(ev.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} >
              <Form.Group className="mb-3" >
                <Form.Label>State</Form.Label>
                <Form.Control required={true} value={state} disabled readOnly></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6} >
              <Form.Group className="mb-3" >
                <Form.Label>Region</Form.Label>
                <Form.Control required={true} value={region} disabled readOnly></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} >
              <Form.Group className="mb-3" >
                <Form.Label>Province</Form.Label>
                <Form.Control required={true} value={province} disabled readOnly></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6} >
              <Form.Group className="mb-3" >
                <Form.Label>Municipality</Form.Label>
                <Form.Control required={true} value={municipality} disabled readOnly></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Description</Form.Label>
              <Form.Control required={true} value={description} onChange={ev => setDescription(ev.target.value)} as="textarea" rows={3} />
            </Form.Group>
          </Row>
          <Row className='btn_box mt-3'>
            <Button variant="danger" onClick={() => props.deleteHut(hutID)} className="btn_box2 mx-2 mb-2" >Delete</Button>
            <Button variant="success" type='submit' className="btn_box2 mx-2 mb-2">Save</Button>
          </Row>
        </Form>
      </Col>
    </Row>
  )}
  

}

export default MyHutManager;