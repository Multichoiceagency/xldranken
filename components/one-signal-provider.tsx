"use client"

import type React from "react"

import { useEffect } from "react"
import Script from "next/script"

export function OneSignalProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This ensures OneSignal initialization happens only on the client side
    if (typeof window !== "undefined") {
      window.OneSignalDeferred = window.OneSignalDeferred || []

      window.OneSignalDeferred.push(async (OneSignal: any) => {
        await OneSignal.init({
          appId: "5addc5f0-43e0-41c3-9c2b-309f5dc658c7",
          safari_web_id: "web.onesignal.auto.6a162863-2269-421e-a6d3-46e81aa6d2f4",
          serviceWorkerPath: "/OneSignalSDKWorker.js", // Specify the service worker path
          serviceWorkerUpdaterPath: "/OneSignalSDKUpdaterWorker.js", // Optional updater worker
          notifyButton: {
            enable: false, // Disable the default notify button
          },
          allowLocalhostAsSecureOrigin: true,
        })
      })
    }
  }, [])

  return (
    <>
      <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="afterInteractive" />
      {children}
    </>
  )
}

