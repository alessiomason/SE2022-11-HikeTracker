import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import '../styles/Map.css';
import 'leaflet/dist/leaflet.css';

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

    const iconReferencePoint = new Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [20, 35],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })

    const startPoint = props.points?.filter(p => p.startPoint).map(p => [p.latitude, p.longitude]).pop();
    const startPointLabel = props.points?.filter(p => p.startPoint).pop().label;
    const endPoint = props.points?.filter(p => p.endPoint).map(p => [p.latitude, p.longitude]).pop();
    const endPointLabel = props.points?.filter(p => p.endPoint).pop().label;
    const nPoints = props.points?.length;
    let middlePoint;
    if (nPoints)
        middlePoint = props.points?.map(p => [p.latitude, p.longitude])[nPoints / 2];

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

    const positions = props.points?.filter(p => !p.referencePoint).map(p => [p.latitude, p.longitude]);

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {positions && <Polyline pathOptions={{ fillColor: 'red', color: 'blue' }} positions={positions} />}
            {startPoint && <Marker position={startPoint} icon={iconStartPoint}>
                {startPointLabel && <Popup>{startPointLabel}</Popup>}
            </Marker>}
            {endPoint && <Marker position={endPoint} icon={iconEndPoint}>
                {endPointLabel && <Popup>{endPointLabel}</Popup>}
            </Marker>}
            {props.points?.filter(p => p.referencePoint).map(p => {
                return (
                    <Marker position={[p.latitude, p.longitude]} icon={iconReferencePoint} key={p.pointID} >
                        {p.label && <Popup>{p.label}</Popup>}
                    </Marker>
                );
            })}
        </MapContainer>
    );
}

export default HikeMap;