import { MapPin, Compass } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="w-full bg-red-600 text-white shadow-lg z-50 h-16 flex items-center px-4 md:px-6 sticky top-0 border-b border-red-700">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <MapPin className="text-white" size={28} />
                    <div className="absolute inset-0 bg-white opacity-20 rounded-full blur-md"></div>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">
                        Domi Trip 3.0
                    </h1>
                    <p className="text-xs text-red-100 hidden md:block">
                        Trips for you cutie {"<3"}
                    </p>
                </div>
            </div>

            {/* Mobile indicator */}
            <div className="ml-auto md:hidden">
                <Compass size={20} className="text-red-200" />
            </div>
        </nav>
    );
}
