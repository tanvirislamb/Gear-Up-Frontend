import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/navbar";
import Footer from "@/component/Footer";
import { AuthProvider } from "@/context/AuthProvider";
import { ToastProvider } from "@/context/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GearUp 🏋️ | Rent Sports & Outdoor Gear Instantly",
  description: "GearUp is a modern platform to rent sports equipment, outdoor gear, bikes, tents, kayaks, skis, and climbing tools from verified local providers.",
  keywords: ["outdoor gear rental", "sports equipment rental", "bike rental", "tent rental", "kayak rental", "GearUp"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full dark antialiased`}>
      <body className="min-h-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
