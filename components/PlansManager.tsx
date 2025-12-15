import { useState } from "react";
import { Plan } from "@/types";
import { Place } from "@/data/places";
import { Plus, Trash2, Calendar, CheckSquare, Square } from "lucide-react";

interface PlansManagerProps {
    plans: Plan[];
    places: Place[];
    onCreatePlan: (plan: Omit<Plan, "id">) => void;
    onDeletePlan: (planId: string) => void;
    onAddPlanToDay: (planId: string, day: number) => void;
}

export default function PlansManager({
    plans,
    places,
    onCreatePlan,
    onDeletePlan,
    onAddPlanToDay,
}: PlansManagerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [newPlanName, setNewPlanName] = useState("");
    const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
    const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
    const [showDaySelector, setShowDaySelector] = useState<string | null>(null);
    const [daySelectorPos, setDaySelectorPos] = useState<{ top: number, left: number } | null>(null);

    const handleTogglePlace = (placeId: string) => {
        setSelectedPlaceIds((prev) =>
            prev.includes(placeId)
                ? prev.filter((id) => id !== placeId)
                : [...prev, placeId]
        );
    };

    const handleCreatePlan = () => {
        if (newPlanName.trim() && selectedPlaceIds.length > 0) {
            onCreatePlan({
                nombre: newPlanName.trim(),
                placeIds: selectedPlaceIds,
            });
            setNewPlanName("");
            setSelectedPlaceIds([]);
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-6 p-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Mis Planes</h2>
                    <p className="text-sm text-gray-500">Agrupa destinos en planes personalizados</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Create New Plan Form */}
            {isCreating && (
                <div className="bg-white border-2 border-red-500 rounded-xl p-4 space-y-4 shadow-lg">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre del Plan
                        </label>
                        <input
                            type="text"
                            value={newPlanName}
                            onChange={(e) => setNewPlanName(e.target.value)}
                            placeholder="Ej: Tour Centro Histórico"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Selecciona Destinos ({selectedPlaceIds.length})
                        </label>
                        <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
                            {places.map((place) => {
                                const isSelected = selectedPlaceIds.includes(place.id);
                                return (
                                    <div
                                        key={place.id}
                                        onClick={() => handleTogglePlace(place.id)}
                                        className={`p-3 rounded-lg cursor-pointer transition-all ${isSelected
                                            ? "bg-red-50 border-2 border-red-500"
                                            : "bg-gray-50 border border-gray-200 hover:border-red-300"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {isSelected ? (
                                                <CheckSquare className="text-red-500" size={20} />
                                            ) : (
                                                <Square className="text-gray-400" size={20} />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{place.nombre}</p>
                                                <p className="text-xs text-gray-500">{place.comunas.join(", ")}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleCreatePlan}
                            disabled={!newPlanName.trim() || selectedPlaceIds.length === 0}
                            className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-all"
                        >
                            Crear Plan
                        </button>
                        <button
                            onClick={() => {
                                setIsCreating(false);
                                setNewPlanName("");
                                setSelectedPlaceIds([]);
                            }}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Plans List */}
            <div className="space-y-3">
                {plans.length === 0 && !isCreating && (
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-sm">No hay planes creados</p>
                        <p className="text-xs mt-1">Crea tu primer plan para comenzar</p>
                    </div>
                )}

                {plans.map((plan) => {
                    const planPlaces = places.filter((p) => plan.placeIds.includes(p.id));
                    const isExpanded = expandedPlanId === plan.id;

                    return (
                        <div
                            key={plan.id}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Plan Header */}
                            <div className="p-4 flex items-center justify-between">
                                <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                                >
                                    <h3 className="font-bold text-gray-900">{plan.nombre}</h3>
                                    <p className="text-sm text-gray-500">
                                        {planPlaces.length} destino{planPlaces.length !== 1 ? "s" : ""}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Add to Day Button */}
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                if (showDaySelector === plan.id) {
                                                    setShowDaySelector(null);
                                                    setDaySelectorPos(null);
                                                } else {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    setDaySelectorPos({
                                                        top: rect.bottom + 5,
                                                        left: rect.left - 100 // Adjust to align roughly left or calculate "right"
                                                    });
                                                    // Better alignment logic: align right edge of dropdown to right edge of button
                                                    // Dropdown width is w-40 (10rem = 160px)
                                                    // button right = rect.right
                                                    // dropdown left = rect.right - 160
                                                    setDaySelectorPos({
                                                        top: rect.bottom + 5,
                                                        left: rect.right - 160
                                                    });
                                                    setShowDaySelector(plan.id);
                                                }
                                            }}
                                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                                            title="Agregar a día"
                                        >
                                            <Calendar size={18} />
                                        </button>

                                        {showDaySelector === plan.id && daySelectorPos && (
                                            <div
                                                className="fixed w-40 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[9999]"
                                                style={{
                                                    top: `${daySelectorPos.top}px`,
                                                    left: `${daySelectorPos.left}px`
                                                }}
                                            >
                                                <div className="px-3 py-2 border-b border-gray-100">
                                                    <p className="text-xs font-semibold text-gray-700">Agregar a día:</p>
                                                </div>
                                                {[1, 2, 3, 4, 5].map((day) => (
                                                    <button
                                                        key={day}
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onAddPlanToDay(plan.id, day);
                                                            setShowDaySelector(null);
                                                            setDaySelectorPos(null);
                                                        }}
                                                    >
                                                        Día {day}
                                                    </button>
                                                ))}
                                                {/* Backdrop to close */}
                                                <div
                                                    className="fixed inset-0 z-[-1]"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowDaySelector(null);
                                                        setDaySelectorPos(null);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => onDeletePlan(plan.id)}
                                        className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
                                        title="Eliminar plan"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Places List */}
                            {isExpanded && (
                                <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2">
                                    {planPlaces.map((place, idx) => (
                                        <div
                                            key={place.id}
                                            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                                        >
                                            <span className="text-xs font-bold text-gray-400 w-6">{idx + 1}</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{place.nombre}</p>
                                                <p className="text-xs text-gray-500">{place.comunas.join(", ")}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
