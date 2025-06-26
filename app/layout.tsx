import type React from "react"
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
import { Providers } from "./providers"
import ScrollReset from "@/components/ScrollReset"
import InstallPrompt from "@/components/InstallPrompt"
import Script from "next/script"
import SmoothScrollProvider from "@/components/smooth-scroll-provider"

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
        <meta name="apple-mobile-web-app-title" content="XL Groothandel" />
      </head>
      <body className={`${poppins.className} antialiased bg-background text-text`}>
        {/* OneSignal Scripts */}
        <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="afterInteractive" />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "32d3547f-ec7c-4a28-818f-f01357f4e9c9",
                safari_web_id: "web.onesignal.auto.0893d0c7-c315-4498-a086-d9071f0f29e9",
                notifyButton: {
                  enable: true,
                },
                allowLocalhostAsSecureOrigin: true,
              });
            });
          `}
        </Script>

        <ScrollReset />
        <Providers>
          <InstallPrompt />
          <AgeVerificationPopup />
          <SiteHeader />
          <main className="min-h-screen w-screen pb-16 md:pb-0">
          <SmoothScrollProvider>
          {children}          
          </SmoothScrollProvider>
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
