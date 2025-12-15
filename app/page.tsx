"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import PlaceList from "@/components/PlaceList";
import Itinerary from "@/components/Itinerary";
import PlansManager from "@/components/PlansManager";
import DatabaseStatus from "@/components/DatabaseStatus";
import { Place } from "@/app/models/places";
import { Plan } from "@/types";
import { Calendar, List, FolderPlus } from "lucide-react";

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

        if (plan.placeIds.includes(placeId)) return;

        const updatedPlan = { ...plan, placeIds: [...plan.placeIds, placeId] };

        // Update locally
        setPlans(prev => prev.map(p => p.id === planId ? updatedPlan : p));

        // Update API
        fetch(`/api/plans/${planId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ placeIds: updatedPlan.placeIds })
        }).catch(err => console.error("Failed to update plan", err));
    };


    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            {/* Top Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Sidebar Panel */}
                <div className="w-full md:w-2/5 lg:w-1/2 flex flex-col border-r border-gray-200 bg-white h-1/2 md:h-full z-10 shadow-lg relative">

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 bg-gray-50">
                        <button
                            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === "places"
                                ? "text-red-600 border-b-2 border-red-600 bg-white"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("places")}
                        >
                            <List size={18} />
                            Lugares
                        </button>
                        <button
                            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === "plans"
                                ? "text-red-600 border-b-2 border-red-600 bg-white"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("plans")}
                        >
                            <FolderPlus size={18} />
                            Planes
                        </button>
                        <button
                            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === "itinerary"
                                ? "text-red-600 border-b-2 border-red-600 bg-white"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("itinerary")}
                        >
                            <Calendar size={18} />
                            Mi Ruta
                        </button>
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
                                onDeletePlan={handleDeletePlan}
                                onAddPlanToDay={handleAddPlanToDay}
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
                    />
                </div>
            </main>

            {/* Database Connection Status */}
            <DatabaseStatus />
        </div>
    );
}

