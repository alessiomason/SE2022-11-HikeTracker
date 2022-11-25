import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import '../styles/Map.css';
import 'leaflet/dist/leaflet.css';


function HikeMap(props) {
    const iconSP = new Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const iconEP = new Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const iconRP = new Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [20, 35],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })
   

    // <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css" />
    const startPoint = props.points?.filter(p => p.startPoint).map(p => [p.latitude, p.longitude]).pop();
    const startPointLabel = props.points?.filter(p => p.startPoint).pop().label;
    const endPoint = props.points?.filter(p => p.endPoint).map(p => [p.latitude, p.longitude]).pop();
    const endPointLabel = props.points?.filter(p => p.endPoint).pop().label;

    let center = [45.177786, 7.083372];     // default point
    if (startPoint && endPoint)
        center = [(startPoint[0] + endPoint[0]) / 2, (startPoint[1] + endPoint[1]) / 2];

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
            {startPoint && <Marker position={startPoint} icon={iconSP}>
                {startPointLabel && <Popup>{startPointLabel}</Popup>}
            </Marker>}
            {endPoint && <Marker position={endPoint} icon={iconEP}>
                {endPointLabel && <Popup>{endPointLabel}</Popup>}
            </Marker>}
            {props.points?.filter(p => p.referencePoint).map(p => {
                return (
                    <Marker position={[p.latitude, p.longitude]} icon={iconRP} key={p.pointID} >
                        {p.label && <Popup>{p.label}</Popup>}
                    </Marker>
                );
            })}
        </MapContainer>
    );
}

export default HikeMap;