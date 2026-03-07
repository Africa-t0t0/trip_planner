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
            {places.map((place) => {
                const isSelected = selectedPlaceId === place.id;

                return (
                    <AdvancedMarker
                        key={place.id}
                        position={{
                            lat: place.coordenadas.latitud,
                            lng: place.coordenadas.longitud
                        }}
                        onClick={() => handleMarkerClick(place.id)}
                        zIndex={isSelected ? 50 : 1}
                    >
                        {/* Custom Modern marker pin */}
                        <div className="relative group cursor-pointer outline-none">
                            <div className={`
                            flex items-center justify-center rounded-full transition-all duration-300 ease-out shadow-md
                            ${isSelected
                                    ? "w-10 h-10 bg-white border-[3px] border-rose-600 scale-110 shadow-[0_4px_16px_rgb(225,29,72,0.4)]"
                                    : "w-8 h-8 bg-white border-[2.5px] border-rose-500 group-hover:border-rose-600 group-hover:scale-110"
                                }
                        `}>
                                <div className={`
                                rounded-full transition-colors duration-300 
                                ${isSelected ? "w-4 h-4 bg-rose-600" : "w-2.5 h-2.5 bg-rose-500 group-hover:bg-rose-600"}
                            `}></div>
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
                                pixelOffset={[0, -40]}
                                className="p-0 border-0"
                            >
                                <div className="p-3 max-w-[240px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 font-sans">
                                    <div className="relative w-full h-28 mb-3 rounded-lg overflow-hidden bg-slate-100">
                                        <img
                                            src={place.imageUrl}
                                            alt={place.nombre}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="font-bold text-[15px] text-slate-800 mb-1 leading-tight">{place.nombre}</h3>
                                    <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed">{place.descripcion}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </AdvancedMarker>
                )
            })}
        </GoogleMap>
    );
}
