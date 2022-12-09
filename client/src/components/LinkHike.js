import { Alert, Form } from 'react-bootstrap';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../API';
import HikeMap from './HikeMap';

function LinkHike(props) {

  const navigate = useNavigate();

  const [hikeToLink, setHikeToLink] = useState({});
  const [dirty, setDirty] = useState(true);
  const [modalShow, setModalShow] = useState(false);




  let { hikeId } = useParams();
  hikeId = parseInt(hikeId);


  useEffect(() => {
    if (dirty) {
      API.getHike(hikeId)
        .then((h) => setHikeToLink(h))
        .catch(err => console.log(err))
      setDirty(false);
    }
  }, [dirty, hikeId]);

    const handleSubmit = (event) => {
        event.preventDefault();

        // azione da fare dopo il submit
        
        // props.linkHike(hikeId);
        props.setDirty(true);
        navigate('/hikeManager');

    }
}
    


export default LinkHike;