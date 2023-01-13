import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Button } from 'react-bootstrap';
import '../styles/Map.css';
import '../styles/SinglePageHike.css';
import 'leaflet/dist/leaflet.css';
import { default as LinkedHutIcon } from '../images/linked_hut_icon.png';
const dayjs = require('dayjs');

function HikeMap(props) {

    const iconStartPoint = new Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const iconEndPoint = new Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const iconNotReachedReferencePoint = new Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [20, 35],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const iconReachedReferencePoint = new Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [20, 35],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const iconLinkedHut = new Icon({
        iconUrl: LinkedHutIcon,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [30, 30],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const startPoint = props.points?.filter(p => p.startPoint).map(p => [p.latitude, p.longitude]).pop();
    const startPointLabel = props.points?.filter(p => p.startPoint).pop().label;
    const endPoint = props.points?.filter(p => p.endPoint).map(p => [p.latitude, p.longitude]).pop();
    const endPointLabel = props.points?.filter(p => p.endPoint).pop().label;
    const nPoints = props.points?.length;
    let middlePoint;
    if (nPoints)
        middlePoint = props.points?.map(p => [p.latitude, p.longitude])[Math.round(nPoints / 2)];

    let center = [45.177786, 7.083372];     // default point
    if (startPoint && endPoint) {
        if (middlePoint)    // centering on start, end and middle point: covers both linear and circular tracks
            center = [(startPoint[0] + endPoint[0] + middlePoint[0]) / 3, (startPoint[1] + endPoint[1] + middlePoint[1]) / 3];
        else
            center = [(startPoint[0] + endPoint[0]) / 2, (startPoint[1] + endPoint[1]) / 2];
    }

    let zoom = 13;
    if (props.length && props.length >= 21000)
        zoom = 8;
    else if (props.length && props.length >= 14000)
        zoom = 10;

    const reachedPositions = props.points?.filter(p => (props.showOngoing && p.reachedInOngoingHike || !props.showOngoing && p.reachedInTrackedHike || !props.showOngoing && props.trackedHikeStatus === 'completed') && !p.referencePoint && !p.hutID && !p.parkingID).map(p => [p.latitude, p.longitude]);
    const notReachedPositions = props.points?.filter(p => (props.showOngoing && !p.reachedInOngoingHike || !props.showOngoing && !p.reachedInTrackedHike && props.trackedHikeStatus !== 'completed') && !p.referencePoint && !p.hutID && !p.parkingID).map(p => [p.latitude, p.longitude]);

    return (
        <MapContainer className='single-hike-map' center={center} zoom={zoom}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reachedPositions && <Polyline pathOptions={{ color: '#a972cb' }} positions={reachedPositions} />}
            {notReachedPositions && <Polyline pathOptions={{ color: 'blue' }} positions={notReachedPositions} />}
            {startPoint && <Marker position={startPoint} icon={iconStartPoint}>
                {(startPointLabel || props.showStartHike || props.trackedHikeStatus === 'completed') &&
                    <Popup>
                        {<p><strong>{startPointLabel}</strong></p>}
                        {props.showStartHike && <Button className='start_btn' onClick={() => props.setTrackedHikeModalShow('start')}>Start hike</Button>}
                        {(props.trackedHikeStatus === 'completed' || props.trackedHikeStatus === 'stopped') && <p>Reached on {dayjs(props.startTime).format('MMM DD, YYYY h:mm:ss a')}</p>}
                    </Popup>}
            </Marker>}
            {endPoint && <Marker position={endPoint} icon={iconEndPoint}>
                {endPointLabel && <Popup>{endPointLabel}</Popup>}
                {(endPointLabel || props.showTerminateHike || props.trackedHikeStatus === 'completed') &&
                    <Popup>
                        {<p><strong>{endPointLabel}</strong></p>}
                        {props.showTerminateHike && <Button className='terminate_btn' onClick={() => props.setTrackedHikeModalShow('terminate')}>Terminate hike</Button>}
                        {props.trackedHikeStatus === 'completed' && <p>Reached on {dayjs(props.endTime).format('MMM DD, YYYY h:mm:ss a')}</p>}
                    </Popup>}
            </Marker>}
            {props.points?.filter(p => p.referencePoint).map(p => {
                return (
                    <Marker position={[p.latitude, p.longitude]} icon={(props.showOngoing && p.reachedInOngoingHike || !props.showOngoing && p.reachedInTrackedHike || props.trackedHikeStatus === 'completed') ? iconReachedReferencePoint : iconNotReachedReferencePoint} key={p.pointID}>
                        {(p.label || props.showTerminateHike || !props.showOngoing && p.reachedInTrackedHike || props.trackedHikeStatus === 'completed') &&
                            <Popup>
                                <p><strong>{p.label}</strong></p>
                                {!p.reachedInOngoingHike && props.showTerminateHike &&  // not shown if hike is not started
                                    <Button className='reach_ref_point_btn' onClick={() => props.setReferencePointReachedModalShow(p.pointID)}>Mark as reached</Button>}
                                {props.showOngoing && p.reachedInOngoingHike && p.timeOfReachInOngoingHike && <p>Reached on {dayjs(p.timeOfReachInOngoingHike).format('MMM DD, YYYY h:mm:ss a')}</p>}
                                {!props.showOngoing && p.reachedInTrackedHike && p.timeOfReachInTrackedHike && <p>Reached on {dayjs(p.timeOfReachInTrackedHike).format('MMM DD, YYYY h:mm:ss a')}</p>}
                                {(props.showOngoing && p.reachedInOngoingHike && !p.timeOfReachInOngoingHike || !props.showOngoing && p.reachedInTrackedHike && !p.timeOfReachInTrackedHike || !p.reachedInTrackedHike && props.trackedHikeStatus === 'completed') &&
                                <p>Point reached, time of reach not marked</p>}
                            </Popup>
                        }
                    </Marker>
                );
            })}
            {props.alreadyLinkedHut.length !== 0 && props.alreadyLinkedHut.map(p => {
                return (
                    <Marker position={[p.latitude, p.longitude]} icon={iconLinkedHut} key={p.hutID} >
                        {p.label &&
                            <Popup>
                                <p>{p.label}</p>
                            </Popup>}
                    </Marker>
                );
            })}

        </MapContainer>
    );
}

export default HikeMap;