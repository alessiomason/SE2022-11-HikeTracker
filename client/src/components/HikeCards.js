import { Row, Col, Container, Button } from "react-bootstrap";
import SingleHikeCard from './SingleHikeCard';
import { default as Arrow } from "../icons/arrow.svg";
import '../styles/Cards.css';

function HikesCards(props) {

    return (
        <Container fluid className="cards p-5">
            <Row className='mb-3 box_centered'>
                {props.hikes.filter(h => {
                    console.log(props.province && h.province !== props.province)
                    if (props.minLength && h.length < props.minLength
                    || props.maxLength && h.length > props.maxLength
                    || props.minTime && h.expTime < props.minTime
                    || props.maxTime && h.expTime > props.maxTime
                    || props.minAscent && h.ascent < props.minAscent
                    || props.maxAscent && h.ascent > props.maxAscent
                    || !props.difficulties.find(d => d.level === parseInt(h.difficulty)).isChecked
                    || props.state && h.state !== props.state
                    || props.region && h.region !== props.region
                    || props.province && h.province !== props.province
                    || props.municipality && h.municipality !== props.municipality )
                        return false;

                    return true;
                }).map(h => {
                    return (
                        <Col xl={4} lg="auto" md="auto" sm="auto" xs="auto" key={h.id} >
                            <SingleHikeCard fromHikeCards key={h.id} hike={h} user={props.user} />
                        </Col>
                    );
                })}
            </Row>
            <Row className="box_centered">
                <Button variant="primary" className="btn_show my-3" >
                    Show more <img className="ms-2 " src={Arrow} alt="arrow_image" />
                </Button>
            </Row>
        </Container>
    );
}

export default HikesCards;