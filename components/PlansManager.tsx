import { useState } from "react";
import { Plan } from "@/types";
import { Place } from "@/data/places";
import {
  Plus,
  Trash2,
  Calendar,
  CheckSquare,
  Square,
  Pencil,
  X,
  ListPlus,
  FolderOpen
} from "lucide-react";

interface PlansManagerProps {
  plans: Plan[];
  places: Place[];
  onCreatePlan: (plan: Omit<Plan, "id">) => void;
  onUpdatePlan: (planId: string, plan: Partial<Plan>) => void;
  onDeletePlan: (planId: string) => void;
  onAddPlanToDay: (planId: string, day: number) => void;
  expandedPlanId: string | null;
  setExpandedPlanId: (id: string | null) => void;
}

interface SelectedItem {
  placeId: string;
  duration: number;
  notes: string[];
}

export default function PlansManager({
  plans,
  places,
  onCreatePlan,
  onUpdatePlan,
  onDeletePlan,
  onAddPlanToDay,
  expandedPlanId,
  setExpandedPlanId,
}: PlansManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [newPlanName, setNewPlanName] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [showDaySelector, setShowDaySelector] = useState<string | null>(null);
  const [daySelectorPos, setDaySelectorPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleTogglePlace = (placeId: string) => {
    setSelectedItems((prev) => {
      const exists = prev.find((item) => item.placeId === placeId);
      if (exists) {
        return prev.filter((item) => item.placeId !== placeId);
      } else {
        return [...prev, { placeId, duration: 60, notes: [] }]; // Default 60 mins
      }
    });
  };

  const handleDurationChange = (placeId: string, duration: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.placeId === placeId ? { ...item, duration } : item,
      ),
    );
  };

  const handleAddNote = (placeId: string) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.placeId === placeId
          ? { ...item, notes: [...item.notes, ""] }
          : item,
      ),
    );
  };

  const handleUpdateNote = (placeId: string, index: number, value: string) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.placeId === placeId
          ? {
            ...item,
            notes: item.notes.map((n, i) => (i === index ? value : n)),
          }
          : item,
      ),
    );
  };

  const handleRemoveNote = (placeId: string, index: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.placeId === placeId
          ? { ...item, notes: item.notes.filter((_, i) => i !== index) }
          : item,
      ),
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
    const items = plan.items
      ? plan.items.map((item) => ({ ...item, notes: item.notes || [] }))
      : plan.placeIds
        ? plan.placeIds.map((id) => ({
          placeId: id,
          duration: 60,
          notes: [] as string[],
        }))
        : [];
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
    <div className="space-y-6 lg:p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 shadow-sm border border-rose-100">
            <FolderOpen size={22} className="fill-rose-100" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mis Planes</h2>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              Agrupa destinos en colecciones
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="p-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-full shadow-md transition-all flex items-center justify-center transform hover:-translate-y-0.5"
          title="Crear Nuevo Plan"
        >
          <Plus size={20} className={isCreating ? "rotate-45 transition-transform" : "transition-transform"} />
        </button>
      </div>

      {/* Create/Edit Plan Form */}
      {isCreating && (
        <div className="bg-white border-2 border-rose-400 rounded-2xl p-5 md:p-6 space-y-6 shadow-[0_8px_30px_rgb(225,29,72,0.12)] animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-slate-900">
            {editingPlanId ? "Editar Plan" : "Crear Nuevo Plan"}
          </h3>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Nombre del Plan
            </label>
            <input
              type="text"
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
              placeholder="Ej: Tour Centro Histórico"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Selecciona Destinos <span className="text-rose-600 bg-rose-50 px-2 font-bold py-0.5 rounded-full text-[10px] items-center justify-center ml-1">{selectedItems.length}</span>
            </label>
            <div className="max-h-64 overflow-y-auto space-y-2.5 p-1 rounded-xl">
              {places.map((place) => {
                const selectedItem = selectedItems.find(
                  (item) => item.placeId === place.id,
                );
                const isSelected = !!selectedItem;
                return (
                  <div
                    key={place.id}
                    className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${isSelected
                      ? "bg-rose-50 border-rose-300 shadow-[0_2px_8px_rgb(225,29,72,0.1)]"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                      }`}
                    onClick={() => handleTogglePlace(place.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 flex items-center justify-center transition-transform active:scale-90">
                        {isSelected ? (
                          <div className="w-5 h-5 bg-rose-500 rounded flex items-center justify-center">
                            <CheckSquare className="text-white" size={14} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-slate-100 border border-slate-300 rounded hover:border-slate-400 transition-colors flex items-center justify-center">
                            <Square className="text-slate-400 opacity-0" size={14} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-[15px] truncate transition-colors ${isSelected ? "text-rose-900" : "text-slate-800"}`}>
                          {place.nombre}
                        </p>
                        <p className={`text-xs truncate transition-colors ${isSelected ? "text-rose-600/70" : "text-slate-500"}`}>
                          {place.comunas.join(", ")}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1.5 bg-white px-2 py-1.5 rounded-lg border border-rose-100 shadow-sm shrink-0">
                          <input
                            type="number"
                            value={selectedItem.duration}
                            onChange={(e) =>
                              handleDurationChange(
                                place.id,
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="w-12 text-sm font-semibold text-center text-slate-700 bg-transparent focus:outline-none"
                            placeholder="min"
                            min="0"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-xs font-semibold text-slate-400 pr-1">min</span>
                        </div>
                      )}
                    </div>

                    {/* Notes for selected place */}
                    {isSelected && (
                      <div className="mt-3 pl-8 space-y-2 border-t border-rose-200/50 pt-2" onClick={(e) => e.stopPropagation()}>
                        {selectedItem.notes.map((note, noteIdx) => (
                          <div
                            key={noteIdx}
                            className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200"
                          >
                            <input
                              type="text"
                              value={note}
                              onChange={(e) =>
                                handleUpdateNote(
                                  place.id,
                                  noteIdx,
                                  e.target.value,
                                )
                              }
                              placeholder="Escribe una nota..."
                              className="flex-1 px-3 py-1.5 text-[13px] border border-rose-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 bg-white shadow-sm"
                            />
                            <button
                              onClick={() => handleRemoveNote(place.id, noteIdx)}
                              className="p-1.5 text-slate-300 hover:bg-rose-100 hover:text-rose-600 rounded-md transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddNote(place.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-100/50 px-2 py-1 rounded-md transition-colors mt-1"
                        >
                          <ListPlus size={14} />
                          <span>Agregar nota extra</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={cancelEditing}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreatePlan}
              disabled={!newPlanName.trim() || selectedItems.length === 0}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none text-white font-semibold text-sm rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              {editingPlanId ? "Guardar Cambios" : "Guardar Plan"}
            </button>
          </div>
        </div>
      )}

      {/* Plans List */}
      <div className="space-y-4">
        {plans.length === 0 && !isCreating && (
          <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
            <FolderOpen className="mx-auto text-slate-300 mb-3" size={32} />
            <p className="text-[15px] font-semibold text-slate-600">No hay planes creados</p>
            <p className="text-[13px] font-medium text-slate-400 mt-1">Crea tu primer plan con el botón de &quot;+&quot;</p>
          </div>
        )}

        {plans.map((plan) => {
          const planItems = plan.items || [];
          if (planItems.length === 0 && plan.placeIds) {
            plan.placeIds.forEach((id) =>
              planItems.push({ placeId: id, duration: 60 }),
            );
          }

          const isExpanded = expandedPlanId === plan.id;

          return (
            <div
              key={plan.id}
              className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${isExpanded
                ? "border-rose-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                : "border-slate-100 hover:border-slate-200 hover:shadow-md"
                }`}
              onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
            >
              {/* Plan Header */}
              <div className="p-4 flex items-center justify-between bg-white relative">
                <div className="flex-1 pr-4">
                  <h3 className="font-bold text-slate-900 leading-tight mb-1">{plan.nombre}</h3>
                  <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block"></span>
                    {planItems.length} destino{planItems.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {/* Add to Day Button */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (showDaySelector === plan.id) {
                          setShowDaySelector(null);
                          setDaySelectorPos(null);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setDaySelectorPos({
                            top: rect.bottom + 8,
                            left: rect.right - 180,
                          });
                          setShowDaySelector(plan.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                      title="Agregar a un día"
                    >
                      <Calendar size={18} />
                    </button>

                    {showDaySelector === plan.id && daySelectorPos && (
                      <div
                        className="fixed w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-200"
                        style={{
                          top: `${daySelectorPos.top}px`,
                          left: `${daySelectorPos.left}px`,
                        }}
                      >
                        <div className="px-3 py-1.5 border-b border-slate-100/80">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            Agregar a día:
                          </p>
                        </div>
                        {[1, 2, 3, 4, 5].map((day) => (
                          <button
                            key={day}
                            className="w-full text-left px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddPlanToDay(plan.id, day);
                              setShowDaySelector(null);
                              setDaySelectorPos(null);
                            }}
                          >
                            Destino Día {day}
                          </button>
                        ))}
                        <div className="fixed inset-0 z-[-1]" onClick={(e) => { e.stopPropagation(); setShowDaySelector(null); setDaySelectorPos(null); }} />
                      </div>
                    )}
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(plan);
                    }}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Editar plan"
                  >
                    <Pencil size={18} />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePlan(plan.id);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Eliminar plan"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Expanded Places List */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-2 bg-slate-50/30">
                  {planItems.map((item, idx) => {
                    const place = places.find((p) => p.id === item.placeId);
                    if (!place) return null;
                    return (
                      <div
                        key={item.placeId}
                        className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-[11px] font-bold text-slate-500 shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold text-slate-800 truncate">
                              {place.nombre}
                            </p>
                            <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                              {place.comunas.join(", ")}
                            </p>
                          </div>
                          <div className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                            {item.duration} min
                          </div>
                        </div>
                        {item.notes && item.notes.length > 0 && (
                          <div className="mt-2.5 ml-9 space-y-1.5 border-l-2 border-rose-100 pl-2">
                            {item.notes.map((note, noteIdx) => (
                              <p
                                key={noteIdx}
                                className="text-[12px] font-medium text-slate-500 flex items-start leading-snug"
                              >
                                {note}
                              </p>
                            ))}
                          </div>
                        )}
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
