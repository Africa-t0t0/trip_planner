import { Place } from "@/data/places";
import { Plan } from "@/types";
import { Plus, MapPin, Calendar, FolderOpen, Search, ParkingCircle, Navigation } from "lucide-react";
import Image from "next/image";
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
    const [dropdownOpenPlaceId, setDropdownOpenPlaceId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPlaces = places.filter(place =>
        place.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.comunas.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 lg:p-4">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 shadow-sm border border-rose-100">
                    <Navigation size={22} className="fill-rose-100" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Descubrir Lugares
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                        Encuentra tu próximo destino en Santiago
                    </p>
                </div>
            </div>

            {/* Premium Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center justify-center pointer-events-none text-slate-400 group-focus-within:text-rose-500 transition-colors">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Buscar por nombre o comuna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-300 transition-all shadow-sm"
                />
            </div>

            {/* SaaS Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredPlaces.map((place) => (
                    <div
                        key={place.id}
                        className={`
                            relative group flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer
                            transition-all duration-300 ease-out border
                            ${selectedPlaceId === place.id
                                ? "border-rose-400 shadow-[0_4px_20px_rgb(225,29,72,0.15)] ring-1 ring-rose-400"
                                : "border-slate-100 shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-slate-200"
                            }
                        `}
                        onClick={() => onSelectPlace(place.id)}
                    >
                        {/* Image Section */}
                        <div className="relative w-full h-40 bg-slate-100 overflow-hidden">
                            <Image
                                src={place.imageUrl}
                                alt={place.nombre}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                unoptimized={place.imageUrl.startsWith("http")}
                            />
                            {/* Gradient Overlay for Add Button readability if needed */}
                            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            {/* Floating Action Button */}
                            <button
                                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 hover:text-rose-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDropdownOpenPlaceId(
                                        dropdownOpenPlaceId === place.id ? null : place.id
                                    );
                                }}
                                title="Agregar al Itinerario"
                            >
                                <Plus size={18} strokeWidth={2.5} />
                            </button>

                            {/* Dropdown Menu (Z-Indexed over image) */}
                            {dropdownOpenPlaceId === place.id && (
                                <div className="absolute top-14 right-3 w-52 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-3 py-1.5 border-b border-slate-100/80">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Calendar size={12} />
                                            Agregar a Día
                                        </p>
                                    </div>
                                    <div className="max-h-32 overflow-y-auto custom-scrollbar border-b border-slate-100/80">
                                        {[1, 2, 3, 4, 5].map((day) => (
                                            <button
                                                key={day}
                                                className="w-full text-left px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-between group/day"
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

                                    <div className="px-3 py-1.5 border-b border-slate-100/80 mt-1">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <FolderOpen size={12} />
                                            Agregar a Plan
                                        </p>
                                    </div>
                                    <div className="max-h-32 overflow-y-auto custom-scrollbar">
                                        {plans.length === 0 ? (
                                            <div className="px-3 py-2 text-xs font-medium text-slate-400 text-center">
                                                No hay planes
                                            </div>
                                        ) : (
                                            plans.map((plan) => {
                                                const alreadyInPlan = plan.items?.some(item => item.placeId === place.id) || plan.placeIds?.includes(place.id);
                                                return (
                                                    <button
                                                        key={plan.id}
                                                        className={`w-full text-left px-3 py-1.5 text-sm font-medium transition-colors flex items-center justify-between group/plan ${alreadyInPlan
                                                            ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                                                            : "text-slate-600 hover:bg-rose-50 hover:text-rose-600"
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

                            {/* Tags Floating on Image */}
                            <div className="absolute bottom-3 left-3 flex gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-700 uppercase tracking-wide shadow-sm">
                                    <MapPin size={10} className="text-rose-500" />
                                    {place.comunas[0]}
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1.5 group-hover:text-rose-600 transition-colors">
                                {place.nombre}
                            </h3>

                            <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                                {place.descripcion}
                            </p>

                            <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                    <ParkingCircle size={14} className={place.estacionamiento.includes("Sí") ? "text-emerald-500" : "text-slate-400"} />
                                    <span>{place.estacionamiento.includes("Sí") ? "Parking" : "Sin Parking"}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
