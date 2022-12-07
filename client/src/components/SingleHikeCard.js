import { useNavigate } from 'react-router-dom';
import { Card, Tooltip, OverlayTrigger, Button, Image, Row, Col } from "react-bootstrap";
import { default as Img1 } from "../images/img1.jpg";
import '../styles/Cards.css';
import { default as Location } from "../icons/map.svg";
import { default as Length } from "../icons/location-on-road.svg";
import { default as Time } from "../icons/stopwatch.svg";
import { default as Ascent } from "../icons/mountain.svg";
import { default as Difficulty } from "../icons/volume.svg";

function SingleHikeCard(props) {

  const navigate = useNavigate();

  const cardClassName = "card mb-3 mx-1" + (props.fromHikeCards ? " hike-list-card" : " hike-page-card");
  const difficultiesNames = ['Tourist', 'Hiker', 'Pro Hiker'];

  
  function lengths(){
    const len = props.hike.length.toString()
    return len.substring(0, len.indexOf('.'))
  }

  return (
    <Card className={cardClassName} onClick={() => { if (props.fromHikeCards) navigate('/hike/' + props.hike.id) }}>
      <div className='overflow'>
        <Card.Img variant="top" src={Img1} className="card_img" />
      </div>
      <Card.Body className='card-body'>
        <Row className='card-title-box'>
        <Card.Title className='card-title'>{props.hike.label}</Card.Title>
        </Row>
        <Row>
          <Col md={6} sm={6} xs={6} className='mb-3 align'>
          <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Length</Tooltip>}>
            <img src={Length} alt="length_image" className='me-3' />
          </OverlayTrigger>
          {props.hike.length && <Card.Text className="card-text p-card"> {lengths()} m</Card.Text>}
          </Col>
          <Col md={6} sm={6} xs={6} className='mb-3 align'>
          <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Expected time</Tooltip>}>
            <img src={Time} alt="time_image"  className='me-3' />
          </OverlayTrigger>
          {props.hike.expTime && <Card.Text className="card-text p-card"> {props.hike.expTime} hours</Card.Text>}
          </Col>
        </Row>
        <Row>
          <Col md={6} sm={6} xs={6} className='mb-3 align'>
          <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Ascent</Tooltip>}>
            <img src={Ascent} alt="ascent_image"  className='me-3' />
          </OverlayTrigger>
          {props.hike.ascent && <Card.Text className="card-text p-card"> {Math.round(props.hike.ascent)} m</Card.Text>}
          </Col>
          <Col md={6} sm={6} xs={6} className='mb-3 align'>
          <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Difficulty</Tooltip>}>
            <img src={Difficulty} alt="difficulty_image"   className='me-3'/>
          </OverlayTrigger>
          {props.hike.difficulty && <Card.Text className="card-text p-card"> {difficultiesNames[props.hike.difficulty - 1]}</Card.Text>}
          </Col>
        </Row>
        <Row>
          <Col md={12}  className='mb-4 align'>
          <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip-2">Location</Tooltip>}>
            <img src={Location} alt="location_image"   className='me-3'/>
          </OverlayTrigger>
          <Card.Text className="card-text p-card"> {props.hike.municipality}, {props.hike.province}, {props.hike.region}, {props.hike.state}</Card.Text>
          </Col>
        </Row>
        
        {/*props.hike.description && <Card.Text>Description: {props.hike.description}</Card.Text>*/}
        {/*props.hike.state && <Card.Text className="card-text ">State: {props.hike.state}</Card.Text>}
        {props.hike.region && <Card.Text className="card-text">Region: {props.hike.region}</Card.Text>}
        {props.hike.province && <Card.Text className="card-text">Province: {props.hike.province}</Card.Text>}
        {props.hike.municipality && <Card.Text className="card-text p-card">Municipality: {props.hike.municipality}</Card.Text>*/}

        <p className='card-credit'> Credit: HikeTracker </p>
      </Card.Body>
    </Card>
  );
}

export default SingleHikeCard;