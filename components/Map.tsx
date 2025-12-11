"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Place } from "@/data/places";
import { Icon } from "leaflet";
import { useEffect } from "react";

// Fix for default marker icon in Next.js
const customIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface MapProps {
    places: Place[];
    selectedPlaceId?: string | null;
    onSelectPlace: (placeId: string) => void;
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 14);
    }, [center, map]);
    return null;
}

export default function Map({ places, selectedPlaceId, onSelectPlace }: MapProps) {
    const selectedPlace = places.find((p) => p.id === selectedPlaceId);
    const center: [number, number] = selectedPlace
        ? [selectedPlace.coordenadas.latitud, selectedPlace.coordenadas.longitud]
        : [-33.4489, -70.6693]; // Santiago default center

    return (
        <MapContainer
            center={center}
            zoom={12}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {places.map((place) => (
                <Marker
                    key={place.id}
                    position={[place.coordenadas.latitud, place.coordenadas.longitud]}
                    icon={customIcon}
                    eventHandlers={{
                        click: () => onSelectPlace(place.id),
                    }}
                >
                    <Popup>
                        <div className="font-sans">
                            <h3 className="font-bold text-lg">{place.nombre}</h3>
                            <p className="text-sm">{place.descripcion}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
            <MapUpdater center={center} />
        </MapContainer>
    );
}
