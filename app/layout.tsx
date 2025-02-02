import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BottomNav } from "@/components/bottom-nav"
import { CartProvider } from "@/lib/cart-context"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ProductProvider } from "@/context/ProductContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "XL Dranken",
  description: "Your one-stop shop for all beverages",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Manifest voor PWA */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Icons voor verschillende platforms */}
        <link rel="icon" href="icons/favicon.ico" />
        <link rel="apple-touch-icon" href="icons/web-app-manifest-192x192.png" />
        
        {/* Theme kleur voor browsers */}
        <meta name="theme-color" content="#ffffff" />
        
        {/* Meta-gegevens voor PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="XL Dranken" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <ProductProvider>
          <CartProvider>
            <SiteHeader />
            <main className="min-h-screen w-screen pb-16 md:pb-0">{children}</main>
            <SiteFooter />
            <BottomNav />
            <WhatsAppButton />
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  )
}
