import { Place } from "@/data/places";
import { Plan } from "@/types";
import { Trash2, MapPin, FolderOpen, ChevronDown, ChevronRight, Save } from "lucide-react";
import { useState } from "react";

interface ItineraryProps {
    itinerary: Record<number, Place[]>;
    dayPlans: Record<number, string[]>;
    plans: Plan[];
    places: Place[];
    onRemoveFromDay: (placeId: string, day: number) => void;
    onRemovePlanFromDay: (planId: string, day: number) => void;
    onSelectPlace: (placeId: string) => void;
    onSave?: () => Promise<void>;
}

export default function Itinerary({
    itinerary,
    dayPlans,
    plans,
    places,
    onRemoveFromDay,
    onRemovePlanFromDay,
    onSelectPlace,
    onSave,
}: ItineraryProps) {
    const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveClick = async () => {
        if (!onSave) return;
        setIsSaving(true);
        try {
            await onSave();
        } finally {
            setTimeout(() => setIsSaving(false), 1000); // Visual feedback delay
        }
    };

    // Get all days that have either places or plans
    const daysWithPlaces = Object.keys(itinerary).map(Number);
    const daysWithPlans = Object.keys(dayPlans).map(Number);
    const allDays = Array.from(new Set([...daysWithPlaces, ...daysWithPlans])).sort((a, b) => a - b);

    const togglePlanExpansion = (planId: string) => {
        setExpandedPlans((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(planId)) {
                newSet.delete(planId);
            } else {
                newSet.add(planId);
            }
            return newSet;
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h2 className="text-xl font-bold text-gray-800">Mi Ruta</h2>
                {onSave && (
                    <button
                        onClick={handleSaveClick}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isSaving
                            ? "bg-green-100 text-green-700"
                            : "bg-red-600 text-white hover:bg-red-700 shadow-sm"
                            }`}
                    >
                        <Save size={16} />
                        {isSaving ? "Guardando..." : "Guardar Ruta"}
                    </button>
                )}
            </div>
            {allDays.length === 0 && (
                <div className="text-center text-gray-500 py-8 italic">
                    No hay días planificados aún. Agrega lugares o planes.
                </div>
            )}
            {allDays.map((day) => {
                const dayPlaces = itinerary[day] || [];
                const planIds = dayPlans[day] || [];
                const dayPlansData = planIds.map((id) => plans.find((p) => p.id === id)).filter(Boolean) as Plan[];
                const totalItems = dayPlaces.length + dayPlansData.reduce((acc, plan) => acc + (plan.items?.length || plan.placeIds?.length || 0), 0);

                return (
                    <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-red-500 px-4 py-2 text-white font-bold flex justify-between items-center">
                            <span>Día {day}</span>
                            <span className="text-xs font-normal bg-red-600 px-2 py-0.5 rounded-full">
                                {dayPlansData.length > 0 && `${dayPlansData.length} plan${dayPlansData.length !== 1 ? "es" : ""} • `}
                                {totalItems} destino{totalItems !== 1 ? "s" : ""}
                            </span>
                        </div>
                        <div className="p-2 space-y-2">
                            {/* Display Plans */}
                            {dayPlansData.map((plan) => {
                                const isExpanded = expandedPlans.has(plan.id);
                                const planPlaces = places.filter((p) =>
                                    plan.items?.some(item => item.placeId === p.id) || plan.placeIds?.includes(p.id)
                                );

                                return (
                                    <div key={plan.id} className="border border-green-200 bg-green-50 rounded-lg overflow-hidden">
                                        {/* Plan Header */}
                                        <div className="flex items-center justify-between p-2 hover:bg-green-100 transition-colors">
                                            <div
                                                className="flex items-center gap-2 cursor-pointer flex-1"
                                                onClick={() => togglePlanExpansion(plan.id)}
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown size={16} className="text-green-600" />
                                                ) : (
                                                    <ChevronRight size={16} className="text-green-600" />
                                                )}
                                                <FolderOpen size={16} className="text-green-600" />
                                                <span className="text-sm font-bold text-green-800">{plan.nombre}</span>
                                                <span className="text-xs text-green-600">({planPlaces.length})</span>
                                            </div>
                                            <button
                                                onClick={() => onRemovePlanFromDay(plan.id, day)}
                                                className="text-gray-400 hover:text-red-500 transition-opacity"
                                                title="Eliminar plan del día"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        {/* Expanded Plan Places */}
                                        {isExpanded && (
                                            <div className="px-4 pb-2 space-y-1 bg-white border-t border-green-200">
                                                {planPlaces.map((place, idx) => (
                                                    <div
                                                        key={place.id}
                                                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                                        onClick={() => onSelectPlace(place.id)}
                                                    >
                                                        <span className="text-xs font-bold text-gray-300 w-4">{idx + 1}</span>
                                                        <MapPin size={12} className="text-gray-400" />
                                                        <span className="text-xs font-medium text-gray-700">{place.nombre}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Display Individual Places */}
                            {dayPlaces.map((place, index) => (
                                <div
                                    key={`${place.id}-${day}-${index}`}
                                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md group"
                                >
                                    <div
                                        className="flex items-center gap-2 cursor-pointer flex-1"
                                        onClick={() => onSelectPlace(place.id)}
                                    >
                                        <div className="text-gray-400">
                                            <span className="text-xs font-bold text-gray-300 w-4 inline-block">{index + 1}</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{place.nombre}</span>
                                    </div>
                                    <button
                                        onClick={() => onRemoveFromDay(place.id, day)}
                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Eliminar del día"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {dayPlaces.length === 0 && dayPlansData.length === 0 && (
                                <p className="text-xs text-gray-400 p-2 text-center text-gray-500">Agrega destinos o planes para este día</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
