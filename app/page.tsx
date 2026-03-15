"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import PlaceList from "@/components/PlaceList";
import Itinerary from "@/components/Itinerary";
import PlansManager from "@/components/PlansManager";
import DatabaseStatus from "@/components/DatabaseStatus";
import { Place } from "@/app/models/places";
import { Plan } from "@/types";
import { Calendar, List, FolderPlus } from "lucide-react";
import type { PolylineData } from "@/components/Map";

// Dynamically import Map to prevent SSR issues with Leaflet
const Map = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            Cargando mapa...
        </div>
    ),
});

export default function Home() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
    const [itinerary, setItinerary] = useState<Record<number, Place[]>>({});
    const [plans, setPlans] = useState<Plan[]>([]);
    const [dayPlans, setDayPlans] = useState<Record<number, string[]>>({});
    const [activeTab, setActiveTab] = useState<"places" | "plans" | "itinerary">("places");
    const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

    // Fetch places and plans from MongoDB API
    useEffect(() => {
        async function fetchData() {
            try {
                const [placesRes, plansRes, itineraryRes] = await Promise.all([
                    fetch('/api/places'),
                    fetch('/api/plans'),
                    fetch('/api/itinerary')
                ]);

                let fetchedPlaces: Place[] = [];
                if (placesRes.ok) {
                    fetchedPlaces = await placesRes.json();
                    setPlaces(fetchedPlaces);
                }

                if (plansRes.ok) {
                    const data = await plansRes.json();
                    setPlans(data);
                }

                if (itineraryRes.ok) {
                    const data = await itineraryRes.json();
                    if (data.days) {
                        const newItinerary: Record<number, Place[]> = {};
                        const newDayPlans: Record<number, string[]> = {};

                        Object.entries(data.days).forEach(([key, value]: [string, any]) => {
                            const day = Number(key);

                            // Map place IDs back to objects
                            if (value.placeIds && Array.isArray(value.placeIds)) {
                                newItinerary[day] = value.placeIds
                                    .map((id: string) => fetchedPlaces.find(p => p.id === id))
                                    .filter((p: Place | undefined): p is Place => !!p);
                            }

                            if (value.planIds && Array.isArray(value.planIds)) {
                                newDayPlans[day] = value.planIds;
                            }
                        });

                        setItinerary(newItinerary);
                        setDayPlans(newDayPlans);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleSelectPlace = (placeId: string) => {
        setSelectedPlaceId(placeId);
    };

    const handleSaveItinerary = async () => {
        try {
            const daysPayload: Record<string, { planIds: string[], placeIds: string[] }> = {};

            // Merge keys from both states
            const allDays = new Set([
                ...Object.keys(itinerary).map(String),
                ...Object.keys(dayPlans).map(String)
            ]);

            allDays.forEach(dayStr => {
                const day = Number(dayStr);
                daysPayload[dayStr] = {
                    planIds: dayPlans[day] || [],
                    placeIds: (itinerary[day] || []).map(p => p.id)
                };
            });

            await fetch('/api/itinerary', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ days: daysPayload }),
            });
        } catch (error) {
            console.error("Error saving itinerary:", error);
            alert("Error saving itinerary");
        }
    };

    const handleAddToDay = (place: Place, day: number) => {
        setItinerary((prev) => {
            const currentDayPlaces = prev[day] || [];
            if (currentDayPlaces.find((p) => p.id === place.id)) {
                return prev;
            }
            return {
                ...prev,
                [day]: [...currentDayPlaces, place],
            };
        });
    };

    const handleRemoveFromDay = (placeId: string, day: number) => {
        setItinerary((prev) => {
            const currentDayPlaces = prev[day] || [];
            return {
                ...prev,
                [day]: currentDayPlaces.filter((p) => p.id !== placeId),
            };
        });
    };

    const handleCreatePlan = async (planData: Omit<Plan, "id">) => {
        try {
            const res = await fetch('/api/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(planData),
            });

            if (res.ok) {
                const newPlan = await res.json();
                setPlans((prev) => [newPlan, ...prev]);
            } else {
                console.error('Failed to create plan');
                alert('Failed to create plan');
            }
        } catch (error) {
            console.error('Error creating plan:', error);
            alert('Error creating plan');
        }
    };

    const handleDeletePlan = async (planId: string) => {
        if (!confirm("Are you sure you want to delete this plan?")) return;

        try {
            const res = await fetch(`/api/plans/${planId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setPlans((prev) => prev.filter((p) => p.id !== planId));
                // Also remove from all days
                setDayPlans((prev) => {
                    const newDayPlans = { ...prev };
                    Object.keys(newDayPlans).forEach((day) => {
                        newDayPlans[Number(day)] = newDayPlans[Number(day)].filter((id) => id !== planId);
                    });
                    return newDayPlans;
                });
            } else {
                console.error('Failed to delete plan');
            }
        } catch (error) {
            console.error('Error deleting plan:', error);
        }
    };

    const handleAddPlanToDay = (planId: string, day: number) => {
        setDayPlans((prev) => {
            const currentDayPlans = prev[day] || [];
            if (currentDayPlans.includes(planId)) {
                return prev;
            }
            return {
                ...prev,
                [day]: [...currentDayPlans, planId],
            };
        });
    };

    const handleUpdatePlan = async (planId: string, updatedData: Partial<Plan>) => {
        try {
            const res = await fetch(`/api/plans/${planId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (res.ok) {
                setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, ...updatedData } : p)));
            } else {
                console.error('Failed to update plan');
                alert('Failed to update plan');
            }
        } catch (error) {
            console.error('Error updating plan:', error);
            alert('Error updating plan');
        }
    };

    const handleRemovePlanFromDay = (planId: string, day: number) => {
        setDayPlans((prev) => {
            const currentDayPlans = prev[day] || [];
            return {
                ...prev,
                [day]: currentDayPlans.filter((id) => id !== planId),
            };
        });
    };

    const handleAddToPlan = (placeId: string, planId: string) => {
        // Optimistic update, but strictly we should API call too.
        // For now, let's keep it simple or implement API PUT.
        // The current generic Plan type structure allows this. 
        // We'll update state locally and ideally save.

        const plan = plans.find(p => p.id === planId);
        if (!plan) return;

        // Check if place is already in plan
        const exists = plan.items?.some(item => item.placeId === placeId) || plan.placeIds?.includes(placeId);
        if (exists) return;

        const newItem = { placeId, duration: 60 };
        const updatedPlan = {
            ...plan,
            items: [...(plan.items || []), newItem]
        };

        // Update locally
        setPlans(prev => prev.map(p => p.id === planId ? updatedPlan : p));

        // Update API
        fetch(`/api/plans/${planId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: updatedPlan.items })
        }).catch(err => console.error("Failed to update plan", err));
    };

    // Compute polylines
    const polylines = useMemo<PolylineData[]>(() => {
        const result: PolylineData[] = [];

        if (activeTab === "itinerary") {
            const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];
            const allDays = Array.from(
                new Set([...Object.keys(itinerary).map(Number), ...Object.keys(dayPlans).map(Number)])
            ).sort((a, b) => a - b);

            allDays.forEach((day, index) => {
                const path: { lat: number; lng: number }[] = [];

                // First plans
                const plansForDay = (dayPlans[day] || [])
                    .map(id => plans.find(p => p.id === id))
                    .filter((p): p is Plan => !!p);

                plansForDay.forEach(plan => {
                    const planItems = plan.items || [];
                    if (planItems.length === 0 && plan.placeIds) {
                        plan.placeIds.forEach(id => planItems.push({ placeId: id, duration: 60 }));
                    }
                    planItems.forEach(item => {
                        const place = places.find(p => p.id === item.placeId);
                        if (place) {
                            path.push({ lat: place.coordenadas.latitud, lng: place.coordenadas.longitud });
                        }
                    });
                });

                // Then individual places
                (itinerary[day] || []).forEach(place => {
                    path.push({ lat: place.coordenadas.latitud, lng: place.coordenadas.longitud });
                });

                if (path.length > 1) {
                    result.push({
                        id: `day-${day}`,
                        path,
                        color: colors[index % colors.length]
                    });
                }
            });
        } else if (activeTab === "plans" && expandedPlanId) {
            const plan = plans.find(p => p.id === expandedPlanId);
            if (plan) {
                const path: { lat: number; lng: number }[] = [];
                const planItems = plan.items ? [...plan.items] : [];
                if (planItems.length === 0 && plan.placeIds) {
                    plan.placeIds.forEach(id => planItems.push({ placeId: id, duration: 60 }));
                }
                planItems.forEach(item => {
                    const place = places.find(p => p.id === item.placeId);
                    if (place) {
                        path.push({ lat: place.coordenadas.latitud, lng: place.coordenadas.longitud });
                    }
                });
                if (path.length > 1) {
                    result.push({
                        id: `plan-${plan.id}`,
                        path,
                        color: "#e11d48"
                    });
                }
            }
        }

        return result;
    }, [activeTab, itinerary, dayPlans, plans, places, expandedPlanId]);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            {/* Top Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Sidebar Panel */}
                <div className="w-full md:w-2/5 lg:w-1/2 flex flex-col border-r border-gray-200 bg-white h-1/2 md:h-full z-10 shadow-lg relative">

                    {/* Tabs */}
                    <div className="flex px-4 pt-4 pb-2 bg-slate-50 border-b border-slate-200/60 sticky top-0 z-20">
                        <div className="flex w-full bg-slate-100/80 p-1 rounded-xl shadow-sm">
                            <button
                                className={`flex-1 py-2 text-sm font-semibold flex items-center justify-center gap-2 rounded-lg transition-all duration-200 ${activeTab === "places"
                                    ? "text-rose-600 bg-white shadow-[0_1px_3px_rgb(0,0,0,0.1)]"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                    }`}
                                onClick={() => setActiveTab("places")}
                            >
                                <List size={16} />
                                Lugares
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-semibold flex items-center justify-center gap-2 rounded-lg transition-all duration-200 ${activeTab === "plans"
                                    ? "text-rose-600 bg-white shadow-[0_1px_3px_rgb(0,0,0,0.1)]"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                    }`}
                                onClick={() => setActiveTab("plans")}
                            >
                                <FolderPlus size={16} />
                                Planes
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-semibold flex items-center justify-center gap-2 rounded-lg transition-all duration-200 ${activeTab === "itinerary"
                                    ? "text-rose-600 bg-white shadow-[0_1px_3px_rgb(0,0,0,0.1)]"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                    }`}
                                onClick={() => setActiveTab("itinerary")}
                            >
                                <Calendar size={16} />
                                Mi Ruta
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50">
                        {loading ? (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                Cargando lugares...
                            </div>
                        ) : activeTab === "places" ? (
                            <PlaceList
                                places={places}
                                plans={plans}
                                onSelectPlace={handleSelectPlace}
                                onAddToDay={handleAddToDay}
                                onAddToPlan={handleAddToPlan}
                                selectedPlaceId={selectedPlaceId}
                            />
                        ) : activeTab === "plans" ? (
                            <PlansManager
                                plans={plans}
                                places={places}
                                onCreatePlan={handleCreatePlan}
                                onUpdatePlan={handleUpdatePlan}
                                onDeletePlan={handleDeletePlan}
                                onAddPlanToDay={handleAddPlanToDay}
                                expandedPlanId={expandedPlanId}
                                setExpandedPlanId={setExpandedPlanId}
                            />
                        ) : (
                            <Itinerary
                                itinerary={itinerary}
                                dayPlans={dayPlans}
                                plans={plans}
                                places={places}
                                onRemoveFromDay={handleRemoveFromDay}
                                onRemovePlanFromDay={handleRemovePlanFromDay}
                                onSelectPlace={handleSelectPlace}
                                onSave={handleSaveItinerary}
                            />
                        )}
                    </div>
                </div>

                {/* Map Panel */}
                <div className="flex-1 h-1/2 md:h-full relative">
                    <Map
                        places={places}
                        selectedPlaceId={selectedPlaceId}
                        onSelectPlace={handleSelectPlace}
                        polylines={polylines}
                    />
                </div>
            </main>

            {/* Database Connection Status */}
            <DatabaseStatus />
        </div>
    );
}

