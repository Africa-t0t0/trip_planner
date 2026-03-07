import { Place } from "@/data/places";
import { Plan } from "@/types";
import {
  Trash2,
  MapPin,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Save,
  Route
} from "lucide-react";
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
      setTimeout(() => setIsSaving(false), 800);
    }
  };

  const daysWithPlaces = Object.keys(itinerary).map(Number);
  const daysWithPlans = Object.keys(dayPlans).map(Number);
  const allDays = Array.from(
    new Set([...daysWithPlaces, ...daysWithPlans]),
  ).sort((a, b) => a - b);

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
    <div className="space-y-6 lg:p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 shadow-sm border border-rose-100">
            <Route size={22} className="fill-rose-100" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mi Ruta</h2>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              Itinerario de viaje por día
            </p>
          </div>
        </div>
        {onSave && (
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${isSaving
                ? "bg-emerald-100 text-emerald-700 pointer-events-none"
                : "bg-rose-600 text-white hover:bg-rose-700 active:scale-95 shadow-[0_4px_14px_rgb(225,29,72,0.2)] hover:shadow-[0_6px_20px_rgb(225,29,72,0.3)] transform hover:-translate-y-0.5"
              }`}
          >
            <Save size={16} className={isSaving ? "animate-pulse" : ""} />
            {isSaving ? "Guardando..." : "Guardar Ruta"}
          </button>
        )}
      </div>

      {allDays.length === 0 && (
        <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
          <Route className="mx-auto text-slate-300 mb-3" size={32} />
          <p className="text-[15px] font-semibold text-slate-600">No hay días planificados</p>
          <p className="text-[13px] font-medium text-slate-400 mt-1">Explora lugares para empezar armar tu viaje</p>
        </div>
      )}

      {/* Days List */}
      <div className="space-y-5">
        {allDays.map((day) => {
          const dayPlaces = itinerary[day] || [];
          const planIds = dayPlans[day] || [];
          const dayPlansData = planIds
            .map((id) => plans.find((p) => p.id === id))
            .filter(Boolean) as Plan[];
          const totalItems =
            dayPlaces.length +
            dayPlansData.reduce(
              (acc, plan) =>
                acc + (plan.items?.length || plan.placeIds?.length || 0),
              0,
            );

          return (
            <div
              key={day}
              className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden"
            >
              {/* Day Header */}
              <div className="bg-rose-50/80 px-4 py-3 border-b border-rose-100/50 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                <span className="font-bold text-slate-800 text-[15px] tracking-tight pl-2">Día {day}</span>
                <span className="text-[11px] font-bold text-rose-700 bg-white px-2.5 py-1 rounded-md border border-rose-100 shadow-sm">
                  {dayPlansData.length > 0 &&
                    `${dayPlansData.length} plan${dayPlansData.length !== 1 ? "es" : ""} • `}
                  {totalItems} destino{totalItems !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="p-3 space-y-3">
                {/* Display Plans */}
                {dayPlansData.map((plan) => {
                  const isExpanded = expandedPlans.has(plan.id);
                  const planPlaces = places.filter(
                    (p) =>
                      plan.items?.some((item) => item.placeId === p.id) ||
                      plan.placeIds?.includes(p.id),
                  );

                  return (
                    <div
                      key={plan.id}
                      className={`rounded-xl border transition-all duration-300 ${isExpanded ? "bg-emerald-50/30 border-emerald-200" : "bg-white border-slate-200 hover:border-emerald-300"}`}
                    >
                      {/* Plan Header */}
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50/50 transition-colors group">
                        <div
                          className="flex items-center gap-2.5 cursor-pointer flex-1"
                          onClick={() => togglePlanExpansion(plan.id)}
                        >
                          <div className="text-emerald-500 bg-emerald-100/50 p-1 rounded-md">
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </div>
                          <FolderOpen size={16} className="text-emerald-500" />
                          <span className="text-[14px] font-bold text-slate-800">
                            {plan.nombre}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                            {planPlaces.length}
                          </span>
                        </div>
                        <button
                          onClick={() => onRemovePlanFromDay(plan.id, day)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          title="Eliminar plan del día"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Expanded Plan Places */}
                      {isExpanded && (
                        <div className="px-4 pb-3 pt-1 space-y-1.5 border-t border-emerald-100/60 bg-white rounded-b-xl">
                          {planPlaces.map((place, idx) => {
                            const planItem = plan.items?.find(
                              (item) => item.placeId === place.id,
                            );
                            const notes = planItem?.notes || [];
                            return (
                              <div key={place.id} className="relative">
                                {/* Timeline line */}
                                {idx !== planPlaces.length - 1 && (
                                  <div className="absolute left-[9px] top-6 bottom-[-10px] w-[2px] bg-slate-100"></div>
                                )}
                                <div
                                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group/item relative z-10"
                                  onClick={() => onSelectPlace(place.id)}
                                >
                                  <div className="w-[20px] h-[20px] rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[13px] font-semibold text-slate-700 truncate block group-hover/item:text-emerald-700 transition-colors">
                                      {place.nombre}
                                    </span>
                                  </div>
                                  <div className="p-1 text-slate-300 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                    <MapPin size={14} />
                                  </div>
                                </div>
                                {notes.length > 0 && (
                                  <div className="ml-[31px] mb-2 space-y-1 py-1 px-2.5 bg-slate-50/80 rounded-lg border border-slate-100/50">
                                    {notes.map((note, noteIdx) => (
                                      <p
                                        key={noteIdx}
                                        className="text-[11px] font-medium text-slate-500 leading-snug"
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

                {/* Display Individual Places */}
                {dayPlaces.length > 0 && (
                  <div className="space-y-1.5 relative pt-1">
                    {dayPlaces.map((place, index) => (
                      <div key={`${place.id}-${day}-${index}`} className="relative pl-2">
                        {/* Timeline line individual places */}
                        {index !== dayPlaces.length - 1 && (
                          <div className="absolute left-[17px] top-6 bottom-[-10px] w-[2px] bg-slate-100"></div>
                        )}
                        <div
                          className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl group/indiv border border-transparent hover:border-slate-100 transition-all cursor-pointer relative z-10 bg-white"
                          onClick={() => onSelectPlace(place.id)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-[20px] h-[20px] rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                              <div className="w-1.5 h-1.5 bg-rose-400 rounded-full group-hover/indiv:scale-150 transition-transform"></div>
                            </div>
                            <span className="text-[14px] font-semibold text-slate-700 group-hover/indiv:text-rose-600 transition-colors">
                              {place.nombre}
                            </span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); onRemoveFromDay(place.id, day); }}
                            className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md opacity-0 group-hover/indiv:opacity-100 transition-all"
                            title="Eliminar del día"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {dayPlaces.length === 0 && dayPlansData.length === 0 && (
                  <div className="py-6 text-center border-2 border-dashed border-slate-100 rounded-xl">
                    <p className="text-[13px] font-medium text-slate-400">
                      Agrega destinos o planes para tu día {day}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
