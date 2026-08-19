import type { Metadata } from "next"
import { Inter, Bebas_Neue } from "next/font/google"
import "./globals.css"
import Navbar from "@/component/navbar"
import Footer from "@/component/Footer"
import { AuthProvider } from "@/context/AuthProvider"
import { ToastProvider } from "@/context/ToastProvider"
import SplashScreen from "@/component/SplashScreen"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
})

export const metadata: Metadata = {
  title: "GearUp",
  description: "GearUp is a modern platform to rent sports equipment, outdoor gear, bikes, tents, kayaks, skis, and climbing tools from verified local providers.",
  keywords: ["outdoor gear rental", "sports equipment rental", "bike rental", "tent rental", "kayak rental", "GearUp"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans selection:bg-primary/60 selection:text-white">
        <AuthProvider>
          <ToastProvider>
            <SplashScreen />
            <Navbar />
            <main className="flex-grow pt-15">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
