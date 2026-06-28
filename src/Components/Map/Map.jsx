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
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
});


const MapLifecycleManager = ({ position }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const container = map.getContainer();

        // 1. ResizeObserver: recalculate size on container size changes
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
            map.setView(position, map.getZoom());
        });
        resizeObserver.observe(container);

        // 2. IntersectionObserver: recalculate size and center when map enters viewport
        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            map.invalidateSize();
                            map.setView(position, map.getZoom());
                        }, 100);
                    }
                });
            },
            { threshold: 0.1 }
        );
        intersectionObserver.observe(container);

        // 3. Fallback initial load timeouts
        const timer1 = setTimeout(() => {
            map.invalidateSize();
            map.setView(position, map.getZoom());
        }, 300);

        const timer2 = setTimeout(() => {
            map.invalidateSize();
            map.setView(position, map.getZoom());
        }, 1000);

        return () => {
            resizeObserver.unobserve(container);
            intersectionObserver.unobserve(container);
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [map, position]);

    return null;
};

const Map = () => {
    const position = [19.0674785, 72.8664663];

    return (
        <section className="custom-map-section" id="venue">
            <div className="custom-map-container">
                <div className="custom-map-wrapper">
                    <MapContainer
                        center={position}
                        zoom={20}
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

                        <MapLifecycleManager position={position} />
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
