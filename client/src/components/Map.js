import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../styles/Map.css';
import 'leaflet/dist/leaflet.css';

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css" />


function Map(props) {
    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    );
}

export default Map;