import { useEffect } from "react";
import L from "leaflet";
import "./Map.css";
import "leaflet/dist/leaflet.css";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";


const customIcon = L.divIcon({
    className: "custom-pin-container",
    html: `<div class="custom-pin-marker"></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});


const MapLifecycleManager = ({ center }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const container = map.getContainer();

        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
            map.setView(center, map.getZoom());
        });
        resizeObserver.observe(container);

        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            map.invalidateSize();
                            map.setView(center, map.getZoom());
                        }, 100);
                    }
                });
            },
            { threshold: 0.1 }
        );
        intersectionObserver.observe(container);


        const timer1 = setTimeout(() => {
            map.invalidateSize();
            map.setView(center, map.getZoom());
        }, 300);

        const timer2 = setTimeout(() => {
            map.invalidateSize();
            map.setView(center, map.getZoom());
        }, 1000);

        return () => {
            resizeObserver.unobserve(container);
            intersectionObserver.unobserve(container);
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [map, center]);

    return null;
};

const Map = () => {
    const position = [19.0674785, 72.8690412];


    const mapCenter = [position[0] + 0.0006, position[1]];

    return (
        <section className="custom-map-section" id="venue">
            <div className="custom-map-container">
                <div className="custom-map-wrapper">
                    <MapContainer
                        center={mapCenter}
                        zoom={16}
                        scrollWheelZoom={false}
                        className="leaflet-map-element"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={position} icon={customIcon}>
                            <Popup>
                                <strong>Sofitel Mumbai BKC</strong><br />
                                Grand Ballroom
                            </Popup>
                        </Marker>

                        <MapLifecycleManager center={mapCenter} />
                    </MapContainer>
                </div>

                <div className="custom-map-footer">
                    <h4>Sofitel Mumbai BKC</h4>
                    <p>C 57 Bandra Kurla Complex, Bandra East, Maharashtra 400 051 MUMBAI</p>
                </div>
            </div>
        </section>
    );
};

export default Map;
