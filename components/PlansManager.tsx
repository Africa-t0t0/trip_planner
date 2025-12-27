import { useState } from "react";
import { Plan } from "@/types";
import { Place } from "@/data/places";
import { Plus, Trash2, Calendar, CheckSquare, Square, Pencil } from "lucide-react";

interface PlansManagerProps {
    plans: Plan[];
    places: Place[];
    onCreatePlan: (plan: Omit<Plan, "id">) => void;
    onUpdatePlan: (planId: string, plan: Partial<Plan>) => void;
    onDeletePlan: (planId: string) => void;
    onAddPlanToDay: (planId: string, day: number) => void;
}

interface SelectedItem {
    placeId: string;
    duration: number;
}

export default function PlansManager({
    plans,
    places,
    onCreatePlan,
    onUpdatePlan,
    onDeletePlan,
    onAddPlanToDay,
}: PlansManagerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
    const [newPlanName, setNewPlanName] = useState("");
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
    const [showDaySelector, setShowDaySelector] = useState<string | null>(null);
    const [daySelectorPos, setDaySelectorPos] = useState<{ top: number, left: number } | null>(null);

    const handleTogglePlace = (placeId: string) => {
        setSelectedItems((prev) => {
            const exists = prev.find(item => item.placeId === placeId);
            if (exists) {
                return prev.filter((item) => item.placeId !== placeId);
            } else {
                return [...prev, { placeId, duration: 60 }]; // Default 60 mins
            }
        });
    };

    const handleDurationChange = (placeId: string, duration: number) => {
        setSelectedItems((prev) =>
            prev.map(item =>
                item.placeId === placeId ? { ...item, duration } : item
            )
        );
    };

    const handleCreatePlan = () => {
        if (newPlanName.trim() && selectedItems.length > 0) {
            if (editingPlanId) {
                onUpdatePlan(editingPlanId, {
                    nombre: newPlanName.trim(),
                    items: selectedItems,
                });
                setEditingPlanId(null);
            } else {
                onCreatePlan({
                    nombre: newPlanName.trim(),
                    items: selectedItems,
                });
            }
            setNewPlanName("");
            setSelectedItems([]);
            setIsCreating(false);
        }
    };

    const startEditing = (plan: Plan) => {
        setNewPlanName(plan.nombre);
        // Ensure legacy plans are handled
        const items = plan.items || (plan.placeIds ? plan.placeIds.map(id => ({ placeId: id, duration: 60 })) : []);
        setSelectedItems(items);
        setEditingPlanId(plan.id);
        setIsCreating(true);
    };

    const cancelEditing = () => {
        setIsCreating(false);
        setEditingPlanId(null);
        setNewPlanName("");
        setSelectedItems([]);
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

            {/* Create/Edit Plan Form */}
            {isCreating && (
                <div className="bg-white border-2 border-red-500 rounded-xl p-4 space-y-4 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-800">
                        {editingPlanId ? "Editar Plan" : "Crear Nuevo Plan"}
                    </h3>
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
                            Selecciona Destinos ({selectedItems.length})
                        </label>
                        <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
                            {places.map((place) => {
                                const selectedItem = selectedItems.find(item => item.placeId === place.id);
                                const isSelected = !!selectedItem;
                                return (
                                    <div
                                        key={place.id}
                                        className={`p-3 rounded-lg border transition-all ${isSelected
                                            ? "bg-red-50 border-red-500"
                                            : "bg-gray-50 border-gray-200 hover:border-red-300"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div onClick={() => handleTogglePlace(place.id)} className="cursor-pointer">
                                                {isSelected ? (
                                                    <CheckSquare className="text-red-500" size={20} />
                                                ) : (
                                                    <Square className="text-gray-400" size={20} />
                                                )}
                                            </div>
                                            <div className="flex-1 cursor-pointer" onClick={() => handleTogglePlace(place.id)}>
                                                <p className="font-medium text-gray-900">{place.nombre}</p>
                                                <p className="text-xs text-gray-500">{place.comunas.join(", ")}</p>
                                            </div>
                                            {isSelected && (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        value={selectedItem.duration}
                                                        onChange={(e) => handleDurationChange(place.id, parseInt(e.target.value) || 0)}
                                                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                                                        placeholder="min"
                                                        min="0"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <span className="text-xs text-gray-500">min</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleCreatePlan}
                            disabled={!newPlanName.trim() || selectedItems.length === 0}
                            className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-all"
                        >
                            {editingPlanId ? "Guardar Cambios" : "Crear Plan"}
                        </button>
                        <button
                            onClick={cancelEditing}
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
                    const planItems = plan.items || [];
                    // Fallback for legacy if not handled by API yet
                    if (planItems.length === 0 && plan.placeIds) {
                        plan.placeIds.forEach(id => planItems.push({ placeId: id, duration: 60 }));
                    }

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
                                        {planItems.length} destino{planItems.length !== 1 ? "s" : ""}
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

                                    {/* Edit Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startEditing(plan);
                                        }}
                                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                                        title="Editar plan"
                                    >
                                        <Pencil size={18} />
                                    </button>

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
                                    {planItems.map((item, idx) => {
                                        const place = places.find(p => p.id === item.placeId);
                                        if (!place) return null;
                                        return (
                                            <div
                                                key={item.placeId}
                                                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                                            >
                                                <span className="text-xs font-bold text-gray-400 w-6">{idx + 1}</span>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{place.nombre}</p>
                                                    <p className="text-xs text-gray-500">{place.comunas.join(", ")}</p>
                                                </div>
                                                <div className="text-sm font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded">
                                                    {item.duration} min
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
