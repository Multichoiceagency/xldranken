import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BottomNav } from "@/components/bottom-nav"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Toaster } from "@/components/ui/toaster"
import { NotificationPopup } from "@/components/notification-popup"
import { AgeVerificationPopup } from "@/components/AgeVerificationPopup"
import { Providers } from "./providers" // <== import new wrapper

const poppins = Poppins({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "XL Groothandel B.V.",
  description: "De groothandel in al uw dranken",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="icons/favicon.ico" />
        <link rel="apple-touch-icon" href="icons/web-app-manifest-192x192.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="XL Dranken" />
      </head>
      <body className={`${poppins.className} bg-background text-text`}>
        <Providers>
          <AgeVerificationPopup />
          <SiteHeader />
          <main className="min-h-screen w-screen pb-16 md:pb-0">
            {children}
            <Toaster />
          </main>
          <SiteFooter />
          <BottomNav />
          <WhatsAppButton />
          <NotificationPopup />
        </Providers>
      </body>
    </html>
  )
}
