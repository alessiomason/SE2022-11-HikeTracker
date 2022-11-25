import { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import SingleHikeCard from '../SingleHikeCard';
import Map from '../Map';
import API from '../../API';
import '../../App.css';

function HikePage(props) {
    const [hike, setHike] = useState({});
    const [dirty, setDirty] = useState(true);

    let { hikeId } = useParams();
    hikeId = parseInt(hikeId);

    useEffect(() => {
        if (dirty) {
            API.getHike(hikeId)
                .then((hike) => setHike(hike))
                .catch(err => console.log(err))
            setDirty(false);
        }
    }, [dirty, hikeId]);

    return (
        <>
            <Row>
                <div className=' d-flex justify-content-center'>
                    <SingleHikeCard key={hike.id} hike={hike} user={props.user} />
                </div>
            </Row>
            <Row>
                <div className=' d-flex justify-content-center'>
                    {/* Map is rendered only when hike is loaded */}
                    {hike.id && <Map length={hike.length} points={hike.points} />}
                </div>
            </Row>
        </>
    );
}

export default HikePage;