"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { PlusCircle, MapPin, Save, ArrowLeft, Pencil } from "lucide-react";

function ManagementContent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const isEditing = !!editId;

    const [formData, setFormData] = useState({
        id: "",
        nombre: "",
        latitud: "",
        longitud: "",
        comunas: "",
        estacionamiento: "",
        descripcion: "",
        tips: "",
        imageUrl: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        const fetchPlace = async () => {
            if (!editId) return;
            setLoading(true);
            try {
                const res = await fetch("/api/places");
                if (!res.ok) throw new Error("Failed to fetch places");
                const places = await res.json();
                const place = places.find((p: any) => p.id === editId);

                if (place) {
                    setFormData({
                        id: place.id,
                        nombre: place.nombre,
                        latitud: place.coordenadas.latitud.toString(),
                        longitud: place.coordenadas.longitud.toString(),
                        comunas: place.comunas.join(", "),
                        estacionamiento: place.estacionamiento,
                        descripcion: place.descripcion,
                        tips: place.tips,
                        imageUrl: place.imageUrl
                    });
                } else {
                    setMessage({ type: "error", text: "Lugar no encontrado" });
                }
            } catch (error) {
                console.error("Error fetching place:", error);
                setMessage({ type: "error", text: "Error al cargar el lugar" });
            } finally {
                setLoading(false);
            }
        };

        fetchPlace();
    }, [editId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const placeData = {
                id: isEditing ? formData.id : crypto.randomUUID(),
                nombre: formData.nombre,
                coordenadas: {
                    latitud: parseFloat(formData.latitud),
                    longitud: parseFloat(formData.longitud)
                },
                comunas: formData.comunas.split(",").map(c => c.trim()).filter(Boolean),
                estacionamiento: formData.estacionamiento,
                descripcion: formData.descripcion,
                tips: formData.tips,
                imageUrl: formData.imageUrl
            };

            const response = await fetch("/api/places", {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(placeData)
            });

            if (!response.ok) {
                throw new Error("Failed to save place");
            }

            setMessage({ type: "success", text: isEditing ? "Lugar actualizado exitosamente!" : "Lugar creado exitosamente!" });
            if (!isEditing) {
                setFormData({
                    id: "",
                    nombre: "",
                    latitud: "",
                    longitud: "",
                    comunas: "",
                    estacionamiento: "",
                    descripcion: "",
                    tips: "",
                    imageUrl: ""
                });
            }

            setTimeout(() => router.push("/management"), 1500);

        } catch (error) {
            console.error("Error creating place:", error);
            setMessage({ type: "error", text: "Error al guardar el lugar. Inténtalo de nuevo." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push("/management")}
                        className="p-2 hover:bg-white rounded-full transition-colors text-slate-600"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        {isEditing ? (
                            <Pencil className="text-red-600" size={32} />
                        ) : (
                            <PlusCircle className="text-red-600" size={32} />
                        )}
                        {isEditing ? "Editar Lugar" : "Agregar Nuevo Lugar"}
                    </h1>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${message.type === "success" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                        }`}>
                        {message.type === "success" ? <Save size={20} /> : <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">!</div>}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 flex items-center gap-2">
                            <MapPin size={18} /> Información Básica
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-600">Nombre del Lugar</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    placeholder="Ej: Cerro San Cristóbal"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-600">Imagen URL</label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-600">Descripción</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                placeholder="Breve descripción del lugar..."
                            />
                        </div>
                    </div>

                    {/* Location Info */}
                    <div className="space-y-4 pt-2">
                        <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Ubicación</h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-600">Latitud</label>
                                <input
                                    type="number"
                                    step="any"
                                    name="latitud"
                                    value={formData.latitud}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    placeholder="-33.xxxx"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-600">Longitud</label>
                                <input
                                    type="number"
                                    step="any"
                                    name="longitud"
                                    value={formData.longitud}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    placeholder="-70.xxxx"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-600">Comunas (separadas por coma)</label>
                            <input
                                type="text"
                                name="comunas"
                                value={formData.comunas}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                placeholder="Santiago, Providencia..."
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 pt-2">
                        <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Detalles Adicionales</h3>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-600">Estacionamiento</label>
                            <input
                                type="text"
                                name="estacionamiento"
                                value={formData.estacionamiento}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                placeholder="Sí, gratuito..."
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-600">Tips / Recomendaciones</label>
                            <textarea
                                name="tips"
                                value={formData.tips}
                                onChange={handleChange}
                                required
                                rows={2}
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                placeholder="Llevar agua, ir temprano..."
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    {isEditing ? <Save size={20} /> : <PlusCircle size={20} />}
                                    {isEditing ? "Guardar Cambios" : "Crear Lugar"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function FormPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ManagementContent />
        </Suspense>
    );
}
