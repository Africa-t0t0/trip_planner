"use client";

import { useActionState } from "react";
// We need to implement a server action for login, or use client-side signIn from next-auth/react
// But next-auth/react requires SessionProvider.
// For simplicity, let's use a Server Component wrapper or just use 'next-auth/react' 
// actually 'next-auth' v5 has 'authenticate' server action helper usually.
// Let's stick to client side 'signIn' for now which is easiest for simple credential auth.

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Usuario o contraseña incorrectos");
                setLoading(false);
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Ocurrió un error inesperado");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <Image
                            src="/domi-cat.svg"
                            alt="Logo"
                            width={50}
                            height={50}
                            className="object-contain"
                        />
                    </div>
                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        Bienvenido
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Ingresa tus credenciales para continuar
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Usuario</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                placeholder="Usuario"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? "Entrando..." : "Ingresar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
