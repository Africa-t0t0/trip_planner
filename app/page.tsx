"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import PlaceList from "@/components/PlaceList";
import Itinerary from "@/components/Itinerary";
import PlansManager from "@/components/PlansManager";
import DatabaseStatus from "@/components/DatabaseStatus";
import { PLACES, Place } from "@/data/places";
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
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
    const [itinerary, setItinerary] = useState<Record<number, Place[]>>({});
    const [plans, setPlans] = useState<Plan[]>([]);
    const [dayPlans, setDayPlans] = useState<Record<number, string[]>>({});
    const [activeTab, setActiveTab] = useState<"places" | "plans" | "itinerary">("places");

    const handleSelectPlace = (placeId: string) => {
        setSelectedPlaceId(placeId);
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

    const handleCreatePlan = (planData: Omit<Plan, "id">) => {
        const newPlan: Plan = {
            ...planData,
            id: `plan-${Date.now()}`,
        };
        setPlans((prev) => [...prev, newPlan]);
    };

    const handleDeletePlan = (planId: string) => {
        setPlans((prev) => prev.filter((p) => p.id !== planId));
        // Also remove from all days
        setDayPlans((prev) => {
            const newDayPlans = { ...prev };
            Object.keys(newDayPlans).forEach((day) => {
                newDayPlans[Number(day)] = newDayPlans[Number(day)].filter((id) => id !== planId);
            });
            return newDayPlans;
        });
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
        setPlans((prev) =>
            prev.map((plan) =>
                plan.id === planId
                    ? { ...plan, placeIds: [...plan.placeIds, placeId] }
                    : plan
            )
        );
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
                        {activeTab === "places" ? (
                            <PlaceList
                                places={PLACES}
                                plans={plans}
                                onSelectPlace={handleSelectPlace}
                                onAddToDay={handleAddToDay}
                                onAddToPlan={handleAddToPlan}
                                selectedPlaceId={selectedPlaceId}
                            />
                        ) : activeTab === "plans" ? (
                            <PlansManager
                                plans={plans}
                                places={PLACES}
                                onCreatePlan={handleCreatePlan}
                                onDeletePlan={handleDeletePlan}
                                onAddPlanToDay={handleAddPlanToDay}
                            />
                        ) : (
                            <Itinerary
                                itinerary={itinerary}
                                dayPlans={dayPlans}
                                plans={plans}
                                places={PLACES}
                                onRemoveFromDay={handleRemoveFromDay}
                                onRemovePlanFromDay={handleRemovePlanFromDay}
                                onSelectPlace={handleSelectPlace}
                            />
                        )}
                    </div>
                </div>

                {/* Map Panel */}
                <div className="flex-1 h-1/2 md:h-full relative">
                    <Map
                        places={PLACES}
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

