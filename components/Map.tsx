"use client";

import { Map as GoogleMap, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Place } from '@/app/models/places';
import { useState, useEffect } from 'react';

interface MapProps {
    places: Place[];
    selectedPlaceId?: string | null;
    onSelectPlace: (placeId: string) => void;
}

export default function Map({ places, selectedPlaceId, onSelectPlace }: MapProps) {
    const [openInfoWindowId, setOpenInfoWindowId] = useState<string | null>(null);
    const map = useMap();

    // Find the selected place
    const selectedPlace = places.find((p) => p.id === selectedPlaceId);
    const center = selectedPlace
        ? { lat: selectedPlace.coordenadas.latitud, lng: selectedPlace.coordenadas.longitud }
        : { lat: -33.4489, lng: -70.6693 }; // Santiago default center

    // Pan to selected place when it changes
    useEffect(() => {
        if (map && selectedPlace) {
            map.panTo({
                lat: selectedPlace.coordenadas.latitud,
                lng: selectedPlace.coordenadas.longitud
            });
            map.setZoom(14);
            setOpenInfoWindowId(selectedPlace.id);
        }
    }, [selectedPlaceId, selectedPlace, map]);

    const handleMarkerClick = (placeId: string) => {
        onSelectPlace(placeId);
        setOpenInfoWindowId(placeId);
    };

    return (
        <GoogleMap
            defaultCenter={center}
            defaultZoom={12}
            mapId="santiago-roadmap" // Required for AdvancedMarker
            gestureHandling="greedy"
            disableDefaultUI={false}
            className="w-full h-full"
        >
            {places.map((place) => (
                <AdvancedMarker
                    key={place.id}
                    position={{
                        lat: place.coordenadas.latitud,
                        lng: place.coordenadas.longitud
                    }}
                    onClick={() => handleMarkerClick(place.id)}
                >
                    {/* Custom marker pin */}
                    <div className="relative">
                        <div className="w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                    </div>

                    {/* Info Window */}
                    {openInfoWindowId === place.id && (
                        <InfoWindow
                            position={{
                                lat: place.coordenadas.latitud,
                                lng: place.coordenadas.longitud
                            }}
                            onCloseClick={() => setOpenInfoWindowId(null)}
                            pixelOffset={[0, -50]} // Move up 50px to show above marker
                        >
                            <div className="p-2 max-w-xs">
                                <h3 className="font-bold text-lg mb-1">{place.nombre}</h3>
                                <p className="text-sm text-gray-700">{place.descripcion}</p>
                            </div>
                        </InfoWindow>
                    )}
                </AdvancedMarker>
            ))}
        </GoogleMap>
    );
}
