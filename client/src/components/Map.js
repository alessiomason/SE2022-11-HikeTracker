import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import '../styles/Map.css';
import 'leaflet/dist/leaflet.css';

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css" />


function Map(props) {
    const startPoint = props.points?.filter(p => p.startPoint).map(p => [p.latitude, p.longitude]).pop();
    const endPoint = props.points?.filter(p => p.endPoint).map(p => [p.latitude, p.longitude]).pop();
    let center = [45.177786, 7.083372];
    if (startPoint && endPoint)
        center = [(startPoint[0] + endPoint[0]) / 2, (startPoint[1] + endPoint[1]) / 2];
    const positions = props.points?.map(p => [p.latitude, p.longitude]);

    return (
        <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {positions && <Polyline pathOptions={{ fillColor: 'red', color: 'blue' }} positions={positions} />}
        </MapContainer>
    );
}

export default Map;