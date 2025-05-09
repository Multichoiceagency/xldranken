import type React from "react"
import type {Metadata} from "next"
import { Poppins } from 'next/font/google'
import "./globals.css"
import {SiteHeader} from "@/components/site-header"
import {SiteFooter} from "@/components/site-footer"
import {BottomNav} from "@/components/bottom-nav"
import {CartProvider} from "@/lib/cart-context"
import {WhatsAppButton} from "@/components/whatsapp-button"
import {ProductProvider} from "@/context/ProductContext"
import {Toaster} from "@/components/ui/toaster"
import {NotificationPopup} from "@/components/notification-popup"
import {AgeVerificationPopup} from "@/components/AgeVerificationPopup"
import {AuthProvider} from '@/context/AuthContext';

// Voeg alle beschikbare gewichten toe
const poppins = Poppins({
    subsets: ["latin-ext"],
    weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
    title: "XL Dranken",
    description: "Your one-stop shop for all beverages",
}

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <AuthProvider>
            <html lang="en">
            <head>
                {/* Viewport meta tag for proper mobile rendering */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                
                {/* Manifest voor PWA */}
                <link rel="manifest" href="/manifest.json"/>

                {/* Icons voor verschillende platforms */}
                <link rel="icon" href="icons/favicon.ico"/>
                <link rel="apple-touch-icon" href="icons/web-app-manifest-192x192.png"/>

                {/* Theme kleur voor browsers */}
                <meta name="theme-color" content="#ffffff"/>

                {/* Meta-gegevens voor PWA */}
                <meta name="mobile-web-app-capable" content="yes"/>
                <meta name="apple-mobile-web-app-capable" content="yes"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                <meta name="apple-mobile-web-app-title" content="XL Dranken"/>
            </head>
            <body className={`${poppins.className} bg-background text-text`}>
            <AgeVerificationPopup/>
            <ProductProvider>
                <CartProvider>
                    <SiteHeader/>
                    <main className="min-h-screen w-screen pb-16 md:pb-0">
                        {children}
                        <Toaster/>
                    </main>
                    <SiteFooter/>
                    <BottomNav/>
                    <WhatsAppButton/>
                    <NotificationPopup/>
                </CartProvider>
            </ProductProvider>
            </body>
            </html>
            </AuthProvider>
    )
}