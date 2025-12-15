import { MapPin, Compass, LogOut } from "lucide-react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="w-full bg-red-600 text-white shadow-lg z-50 h-16 flex items-center px-4 md:px-6 sticky top-0 border-b border-red-700">
            <div className="flex items-center gap-3">


                <Image
                    src="/domi-cat.svg"
                    alt="Domi Cat"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                />

                <div className="flex flex-col">
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">
                        Domi Trip 3.0
                    </h1>
                    <p className="text-xs text-red-100 hidden md:block">
                        Trips for you cutie {"<3"}
                    </p>
                </div>
            </div>

            <div className="hidden md:flex items-center ml-auto gap-4">
                {session && (
                    <span className="text-xs font-semibold bg-red-700 px-2 py-1 rounded-full">
                        {session.user?.name || session.user?.email}
                    </span>
                )}

                <a
                    href="/management"
                    className="text-sm font-medium text-white/90 hover:text-white hover:underline transition-all"
                >
                    Management
                </a>
                <a
                    href="/"
                    className="text-sm font-medium text-white/90 hover:text-white hover:underline transition-all"
                >
                    Home
                </a>

                <button
                    onClick={() => signOut()}
                    className="p-1 hover:bg-red-700 rounded-full transition-colors"
                    title="Cerrar Sesión"
                >
                    <LogOut size={20} className="text-white/90 hover:text-white" />
                </button>
            </div>

            {/* Mobile indicator */}
            <div className="ml-auto md:hidden flex items-center gap-4">
                <button
                    onClick={() => signOut()}
                    className="p-1"
                >
                    <LogOut size={20} className="text-red-200" />
                </button>
                <Compass size={20} className="text-red-200" />
            </div>
        </nav>
    );
}
