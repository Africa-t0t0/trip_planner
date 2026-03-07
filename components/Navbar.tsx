import { MapPin, Compass, LogOut } from "lucide-react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import NavbarLayout from "./NavbarLayout";

export default function Navbar() {
    const { data: session } = useSession();

    const leftContent = (
        <>
            <div className="p-1 bg-red-50 rounded-xl text-red-600">
                <MapPin size={28} strokeWidth={2.5} />
            </div>

            <div className="flex flex-col">
                <h1 className="text-xl md:text-xl font-bold tracking-tight text-slate-900 leading-none">
                    Trip Planner
                </h1>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest hidden md:block mt-0.5">
                    Guidance System
                </p>
            </div>
        </>
    );

    const centerContent = (
        <a
            href="/management"
            className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
        >
            Panel Admin
        </a>
    );

    const rightContent = (
        <>
            {session && (
                <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200">
                    {session.user?.name || session.user?.email}
                </span>
            )}

            <button
                onClick={() => signOut()}
                className="p-2 hover:bg-red-50 rounded-full transition-colors text-slate-400 hover:text-red-600"
                title="Cerrar Sesión"
            >
                <LogOut size={20} />
            </button>
        </>
    );

    const mobileRightContent = (
        <>
            <button
                onClick={() => signOut()}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
            >
                <LogOut size={20} />
            </button>
            <Compass size={20} className="text-slate-400" />
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
