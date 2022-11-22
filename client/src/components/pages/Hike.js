import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SingleHikeCard from '../SingleHikeCard';
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
    }, [dirty]);

    return (
        <SingleHikeCard key={hike.id} hike={hike} user={props.user} />
    );
}

export default HikePage;