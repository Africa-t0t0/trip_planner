import { MapPin, Compass, LogOut } from "lucide-react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import NavbarLayout from "./NavbarLayout";

export default function Navbar() {
    const { data: session } = useSession();

    const playMeow = () => {
        const audio = new Audio("/meow.mp3");
        audio.volume = 0.2; // Low volume as requested
        audio.play().catch(e => console.error("Error playing sound:", e));
    };


    const leftContent = (
        <>
            <button
                onClick={playMeow}
                className="focus:outline-none transition-transform active:scale-95"
                title="Miau?"
            >
                <Image
                    src="/domi-cat.svg"
                    alt="Domi Cat"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                />
            </button>

            <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">
                    Trip Planner
                </h1>
                <p className="text-xs text-red-100 hidden md:block">
                    Local guidance system
                </p>
            </div>
        </>
    );

    const centerContent = (
        <a
            href="/management"
            className="text-sm font-medium text-white/90 hover:text-white hover:underline transition-all"
        >
            Agregar Lugar
        </a>
    );

    const rightContent = (
        <>
            {session && (
                <span className="text-xs font-semibold bg-red-700 px-2 py-1 rounded-full">
                    {session.user?.name || session.user?.email}
                </span>
            )}

            <button
                onClick={() => signOut()}
                className="p-1 hover:bg-red-700 rounded-full transition-colors"
                title="Cerrar Sesión"
            >
                <LogOut size={20} className="text-white/90 hover:text-white" />
            </button>
        </>
    );

    const mobileRightContent = (
        <>
            <button
                onClick={() => signOut()}
                className="p-1"
            >
                <LogOut size={20} className="text-red-200" />
            </button>
            <Compass size={20} className="text-red-200" />
        </>
    );

    return (
        <NavbarLayout
            left={leftContent}
            center={centerContent}
            right={rightContent}
            mobileRight={mobileRightContent}
        />
    );
}
