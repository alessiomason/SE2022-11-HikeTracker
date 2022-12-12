import React, { useState } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import SingleHikeCard from './SingleHikeCard';
import { default as Arrow } from "../icons/arrow-down.svg";
import '../styles/Cards.css';

// from https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
function coordinatesDistanceInMeter(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
    const R = 6378.137; // Radius of earth in KM
    const dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    const dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 1000; // meters
}

function HikesCards(props) {

    const [showingAll, setShowingAll] = useState(false);    // state for Show more button

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
                        || props.hikesMunicipality && h.municipality !== props.hikesMunicipality
                        || props.hikesLatitude !== -1 && props.hikesLongitude !== -1 && props.hikesRadius !== -1 &&
                        coordinatesDistanceInMeter(h.startPoint.latitude, h.startPoint.longitude, props.hikesLatitude, props.hikesLongitude) > props.hikesRadius * 1000)
                        return false;

                    return true;
                }).sort((a, b) => (a.id > b.id) ? 1 : -1).slice(0, showingAll ? undefined : 9).map(h => {
                    return (
                        <Col xl={4} lg="auto" md="auto" sm="auto" xs="auto" key={h.id} >
                            <SingleHikeCard fromHikeCards key={h.id} hike={h} user={props.user} />
                        </Col>
                    );
                })}
            </Row>
            <Row className="box_centered">
                {!showingAll && <Button variant="primary" className="btn_show my-3" onClick={() => setShowingAll(true)}>
                    Show more <img className="ms-2 " src={Arrow} alt="arrow_image" />
                </Button>}
                {/*<div id="container">
                    <button class=" learn-more">
                        <span class="circle" aria-hidden="true">
                            <span class="icon arrow"></span>
                        </span>
                        <span class="button-text">Learn More</span>
                    </button>
            </div>*/}
            </Row>
        </Container>
    );
}

export default HikesCards;