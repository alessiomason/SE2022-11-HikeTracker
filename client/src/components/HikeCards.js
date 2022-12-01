import { Row, Col, Container, Button } from "react-bootstrap";
import SingleHikeCard from './SingleHikeCard';
import { default as Arrow } from "../icons/arrow-down.svg";
import '../styles/Cards.css';

function HikesCards(props) {

    return (
        <Container fluid className="cards p-5">
            <Row className='mb-3 box_centered'>
                {props.hikes.filter(h => {
                    if (props.hikesMinLength && h.length < props.hikesMinLength
                    || props.hikesMaxLength && h.length > props.hikesMaxLength
                    || props.hikesMinTime && h.expTime < props.hikesMinTime
                    || props.hikesMaxTime && h.expTime > props.hikesMaxTime
                    || props.hikesMinAscent && h.ascent < props.hikesMinAscent
                    || props.hikesMaxAscent && h.ascent > props.hikesMaxAscent
                    || !props.hikesDifficulties.find(d => d.level === parseInt(h.difficulty)).isChecked
                    || props.hikesState && h.state !== props.hikesState
                    || props.hikesRegion && h.region !== props.hikesRegion
                    || props.hikesProvince && h.province !== props.hikesProvince
                    || props.hikesMunicipality && h.municipality !== props.hikesMunicipality )
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