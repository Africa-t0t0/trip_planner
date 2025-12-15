import { Place } from "@/data/places";
import { Plan } from "@/types";
import { Plus, MapPin, Calendar, Image, FolderOpen } from "lucide-react";
import { useState } from "react";

interface PlaceListProps {
    places: Place[];
    plans: Plan[];
    onSelectPlace: (placeId: string) => void;
    onAddToDay: (place: Place, day: number) => void;
    onAddToPlan: (placeId: string, planId: string) => void;
    selectedPlaceId?: string | null;
}

export default function PlaceList({
    places,
    plans,
    onSelectPlace,
    onAddToDay,
    onAddToPlan,
    selectedPlaceId,
}: PlaceListProps) {
    const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
    const [dropdownOpenPlaceId, setDropdownOpenPlaceId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPlaces = places.filter(place =>
        place.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.comunas.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 p-2">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                    <MapPin className="text-red-600" size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        Destinos Turísticos
                    </h2>
                    <p className="text-sm text-gray-500">
                        Explora los mejores lugares de Santiago
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre o comuna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredPlaces.map((place) => (
                    <div
                        key={place.id}
                        className={`
                            relative group cursor-pointer rounded-xl overflow-hidden 
                            transition-all duration-500 ease-out transform
                            ${hoveredPlaceId === place.id
                                ? "h-80 shadow-2xl z-30 scale-[1.02] -translate-y-1"
                                : "h-32 shadow-md hover:shadow-lg"
                            }
                            ${selectedPlaceId === place.id
                                ? "ring-2 ring-red-500 ring-offset-2 bg-white"
                                : "bg-white hover:bg-red-50/30"
                            }
                        `}
                        onMouseEnter={() => setHoveredPlaceId(place.id)}
                        onMouseLeave={() => setHoveredPlaceId(null)}
                        onClick={() => onSelectPlace(place.id)}
                    >
                        {/* Background gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Header / Condensed View */}
                        <div className="relative p-4 flex justify-between items-start z-10">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 group-hover:text-red-700 transition-colors">
                                    {place.nombre}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <MapPin size={12} />
                                    <span className="truncate">{place.comunas.join(", ")}</span>
                                </div>
                            </div>

                            {hoveredPlaceId === place.id && (
                                <div className="relative">
                                    <button
                                        className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-110"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDropdownOpenPlaceId(
                                                dropdownOpenPlaceId === place.id ? null : place.id
                                            );
                                        }}
                                    >
                                        <Plus size={18} />
                                    </button>

                                    {/* Enhanced Dropdown with Days and Plans */}
                                    {dropdownOpenPlaceId === place.id && (
                                        <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                                            {/* Days Section */}
                                            <div className="px-3 py-2 border-b border-gray-200">
                                                <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                                    <Calendar size={12} />
                                                    Agregar a Día:
                                                </p>
                                            </div>
                                            <div className="max-h-32 overflow-y-auto border-b border-gray-100">
                                                {[1, 2, 3, 4, 5].map((day) => (
                                                    <button
                                                        key={day}
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors flex items-center justify-between group/day"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onAddToDay(place, day);
                                                            setDropdownOpenPlaceId(null);
                                                        }}
                                                    >
                                                        <span>Día {day}</span>
                                                        <Plus size={14} className="opacity-0 group-hover/day:opacity-100 transition-opacity" />
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Plans Section */}
                                            <div className="px-3 py-2 border-b border-gray-100">
                                                <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                                    <FolderOpen size={12} />
                                                    Agregar a Plan:
                                                </p>
                                            </div>
                                            <div className="max-h-32 overflow-y-auto">
                                                {plans.length === 0 ? (
                                                    <div className="px-4 py-3 text-xs text-gray-400 text-center">
                                                        No hay planes creados
                                                    </div>
                                                ) : (
                                                    plans.map((plan) => {
                                                        const alreadyInPlan = plan.placeIds.includes(place.id);
                                                        return (
                                                            <button
                                                                key={plan.id}
                                                                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between group/plan ${alreadyInPlan
                                                                    ? "bg-green-50 text-green-700 cursor-not-allowed"
                                                                    : "hover:bg-green-50 text-gray-700 hover:text-green-600"
                                                                    }`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (!alreadyInPlan) {
                                                                        onAddToPlan(place.id, plan.id);
                                                                        setDropdownOpenPlaceId(null);
                                                                    }
                                                                }}
                                                                disabled={alreadyInPlan}
                                                            >
                                                                <span className="truncate">{plan.nombre}</span>
                                                                {alreadyInPlan ? (
                                                                    <span className="text-xs">✓</span>
                                                                ) : (
                                                                    <Plus size={14} className="opacity-0 group-hover/plan:opacity-100 transition-opacity" />
                                                                )}
                                                            </button>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* Expanded Content */}
                        <div
                            className={`px-4 pb-4 transition-all duration-500 ${hoveredPlaceId === place.id
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-2 pointer-events-none"
                                }`}
                        >
                            {/* Real Image */}
                            <div className="w-full h-36 rounded-lg mb-4 overflow-hidden shadow-md">
                                <img
                                    src={place.imageUrl}
                                    alt={place.nombre}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                        {place.descripcion}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin size={12} />
                                        <span>{place.comunas.join(", ")}</span>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {place.estacionamiento.includes("Sí") ? "🅿️ Estacionamiento" : "🚶 Caminata"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hover hint */}
                        {hoveredPlaceId !== place.id && (
                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-full">
                                    Ver más →
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
