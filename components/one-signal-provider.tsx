"use client"

import type React from "react"
import Script from "next/script"

export function OneSignalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="onesignal-sdk"
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("OneSignal SDK loaded")

          window.OneSignalDeferred = window.OneSignalDeferred || []
          window.OneSignalDeferred.push(async (OneSignal) => {
            try {
              console.log("Initializing OneSignal v16...")
              await OneSignal.init({
                appId: "5addc5f0-43e0-41c3-9c2b-309f5dc658c7",
                safari_web_id: "web.onesignal.auto.6a162863-2269-421e-a6d3-46e81aa6d2f4",
                notifyButton: {
                  enable: false, // Set to true if you want the notify button
                },
                allowLocalhostAsSecureOrigin: true,
              })
              console.log("OneSignal initialized successfully")
            } catch (error) {
              console.error("Error initializing OneSignal:", error)
            }
          })
        }}
        onError={(e) => console.error("Error loading OneSignal SDK:", e)}
      />
      {children}
    </>
  )
}

