"use client";

import { useState } from "react";
import { Database, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function DatabaseStatus() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const testConnection = async () => {
        setStatus("loading");
        setMessage("");

        try {
            const response = await fetch("/api/test-db");
            const data = await response.json();

            if (data.success) {
                setStatus("success");
                setMessage(data.message);
            } else {
                setStatus("error");
                setMessage(data.message || data.error);
            }
        } catch (error) {
            setStatus("error");
            setMessage("Error al conectar con el servidor");
        }
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80 z-50">
            <div className="flex items-center gap-2 mb-3">
                <Database className="text-blue-500" size={20} />
                <h3 className="font-semibold text-gray-800">MongoDB Atlas</h3>
            </div>

            <button
                onClick={testConnection}
                disabled={status === "loading"}
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                {status === "loading" ? (
                    <>
                        <Loader2 className="animate-spin" size={18} />
                        Probando...
                    </>
                ) : (
                    "Probar Conexión"
                )}
            </button>

            {status !== "idle" && status !== "loading" && (
                <div
                    className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${status === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                        }`}
                >
                    {status === "success" ? (
                        <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                    ) : (
                        <XCircle size={18} className="flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm">{message}</p>
                </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    Asegúrate de configurar <code className="bg-gray-100 px-1 rounded">DB_USERNAME</code> y{" "}
                    <code className="bg-gray-100 px-1 rounded">DB_PASSWORD</code> en tu archivo{" "}
                    <code className="bg-gray-100 px-1 rounded">.env</code>
                </p>
            </div>
        </div>
    );
}
