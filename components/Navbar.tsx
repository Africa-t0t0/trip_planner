import { MapPin, Compass } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
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
            </div>

            {/* Mobile indicator */}
            <div className="ml-auto md:hidden">
                <Compass size={20} className="text-red-200" />
            </div>
        </nav>
    );
}
