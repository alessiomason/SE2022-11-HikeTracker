import { Link } from "react-router-dom";
import { Col, Card } from "react-bootstrap";
import { default as Img1 } from "../images/img1.jpg";
import '../styles/Cards.css';

function SingleHikeCard(props) {

    return (
      <Col xl={4} lg="auto" md="auto" sm="auto" xs="auto" >
        <Card className="card mb-2 mx-1">
          <Link className='card_link'>
            <div className='overflow'>
              <Card.Img variant="top" src={Img1} className="card_img" />
            </div>
            <Card.Body>
              <Card.Title>{props.hike.label}</Card.Title>
              {props.hike.length && <Card.Text>Length: {props.hike.length} m</Card.Text>}
              {props.hike.expTime && <Card.Text>Expected time: {props.hike.expTime} hours</Card.Text>}
              {props.hike.ascent && <Card.Text>Ascent: {Math.round(props.hike.ascent)} m</Card.Text>}
              {props.hike.difficulty && <Card.Text>Difficulty level: {props.hike.difficulty}</Card.Text>}
              {props.hike.description && <Card.Text>Description: {props.hike.description}</Card.Text>}
            </Card.Body>
          </Link>
        </Card>
      </Col>
    );
  }

export default SingleHikeCard;