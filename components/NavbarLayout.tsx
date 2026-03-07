import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavbarLayoutProps {
    left?: ReactNode;
    center?: ReactNode;
    right?: ReactNode;
    mobileRight?: ReactNode;
}

export default function NavbarLayout({ left, center, right, mobileRight }: NavbarLayoutProps) {
    return (
        <nav className="w-full bg-white/80 backdrop-blur-md text-slate-800 shadow-sm z-50 h-16 flex items-center px-4 md:px-6 sticky top-0 border-b border-slate-100 transition-colors">
            {/* Left Side */}
            <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    {left}
                </Link>
            </div>

            {/* Left-Center Zone */}
            {center && (
                <div className="hidden md:flex items-center ml-8">
                    {center}
                </div>
            )}

            {/* Right Side (Desktop) */}
            <div className="hidden md:flex items-center ml-auto gap-4">
                {right}
            </div>

            {/* Right Side (Mobile) */}
            {mobileRight && (
                <div className="ml-auto md:hidden flex items-center gap-4">
                    {mobileRight}
                </div>
            )}
        </nav>
    );
}
