import { useNavigate } from 'react-router-dom';
import { Card } from "react-bootstrap";
import { default as Img1 } from "../images/img1.jpg";
import '../styles/Cards.css';

function SingleHikeCard(props) {
    const navigate = useNavigate();

    const cardClassName = "card mb-3 mx-1" + (props.fromHikeCards ? " hike-list-card" : " hike-page-card");
    const difficultiesNames = ['Tourist', 'Hiker', 'Professional hiker'];

    return (
        <Card className={cardClassName} onClick={() => { if (props.fromHikeCards) navigate('/hike/' + props.hike.id) }}>
            <div className='overflow'>
                <Card.Img variant="top" src={Img1} className="card_img" />
            </div>
            <Card.Body className='card-body'>
                <Card.Title className='card-title'>{props.hike.label}</Card.Title>
                {props.hike.length && <Card.Text className="card-text">Length: {props.hike.length} m</Card.Text>}
                {props.hike.expTime && <Card.Text className="card-text">Expected time: {props.hike.expTime} hours</Card.Text>}
                {props.hike.ascent && <Card.Text className="card-text">Ascent: {Math.round(props.hike.ascent)} m</Card.Text>}
                {props.hike.difficulty && <Card.Text className="card-text">Difficulty: {difficultiesNames[props.hike.difficulty-1]}</Card.Text>}
                {/*props.hike.description && <Card.Text>Description: {props.hike.description}</Card.Text>*/}
                {props.hike.state && <Card.Text className="card-text">State: {props.hike.state}</Card.Text>}
                {props.hike.region && <Card.Text className="card-text">Region: {props.hike.region}</Card.Text>}
                {props.hike.province && <Card.Text className="card-text">Province: {props.hike.province}</Card.Text>}
                {props.hike.municipality && <Card.Text className="card-text">Municipality: {props.hike.municipality}</Card.Text>}
                <p className='card-credit'> Credit: HikeTracker </p>
            </Card.Body>
        </Card>
    );
}

export default SingleHikeCard;