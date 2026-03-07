import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GoogleMapsProvider from "@/components/GoogleMapsProvider";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trip Planner",
  description: "Advanced local guidance system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased text-slate-800 bg-slate-50`}
      >
        <AuthProvider>
          <GoogleMapsProvider>
            {children}
          </GoogleMapsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
