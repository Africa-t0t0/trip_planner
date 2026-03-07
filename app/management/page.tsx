"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { PlusCircle, Pencil, Trash2, MapPin } from "lucide-react";
import Image from "next/image";

interface Place {
    id: string;
    nombre: string;
    comunas: string[];
    imageUrl: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchPlaces = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/places");
            if (!res.ok) throw new Error("Failed to fetch places");
            const data = await res.json();
            setPlaces(data);
        } catch (err) {
            console.error("Error fetching places:", err);
            setError("Error al cargar los lugares.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, []);

    const handleDelete = async (id: string, nombre: string) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        try {
            setDeletingId(id);
            const res = await fetch(`/api/places/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Failed to delete place");

            // Remove from state without re-fetching everything
            setPlaces(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error("Error deleting place:", err);
            alert("Hubo un error al eliminar el lugar.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <MapPin className="text-red-600" size={32} />
                        Panel de Administración
                    </h1>
                    <button
                        onClick={() => router.push("/management/form")}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all flex items-center gap-2"
                    >
                        <PlusCircle size={20} />
                        Agregar Nuevo Lugar
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
                    </div>
                ) : places.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <p className="text-slate-500 mb-4">No hay lugares registrados aún.</p>
                        <button
                            onClick={() => router.push("/management/form")}
                            className="text-red-600 font-medium hover:underline"
                        >
                            Comienza agregando uno
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                                        <th className="p-4 font-semibold">Lugar</th>
                                        <th className="p-4 font-semibold hidden sm:table-cell">Comunas</th>
                                        <th className="p-4 font-semibold text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {places.map((place) => (
                                        <tr key={place.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    {place.imageUrl && (
                                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                                            <Image
                                                                src={place.imageUrl}
                                                                alt={place.nombre}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized={place.imageUrl.startsWith("http")}
                                                            />
                                                        </div>
                                                    )}
                                                    <span className="font-semibold text-slate-800">{place.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-600 hidden sm:table-cell">
                                                {place.comunas?.join(", ") || "-"}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => router.push(`/management/form?edit=${place.id}`)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(place.id, place.nombre)}
                                                        disabled={deletingId === place.id}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Eliminar"
                                                    >
                                                        {deletingId === place.id ? (
                                                            <div className="w-4 h-4 border-2 border-slate-300 border-t-red-600 rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Trash2 size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
