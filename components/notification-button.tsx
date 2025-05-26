"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"
// Remove this line:
// import { requestNotificationPermission, sendTestNotification } from "@/lib/onesignal"
// Remove this line if you're not using it:
// import OneSignal from "react-onesignal"

export default function NotificationButton() {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check notification permission status when component mounts
    const checkPermission = async () => {
      try {
        // Wait for OneSignal to be initialized
        if (typeof window !== "undefined" && window.OneSignal) {
          // Wait a bit to ensure OneSignal is fully initialized
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Check if user is subscribed to notifications
          const isPushSupported = await window.OneSignal.isPushNotificationsSupported()
          if (!isPushSupported) {
            console.log("Push notifications are not supported in this browser")
            setNotificationsEnabled(false)
            return
          }

          // Get the current permission state
          const permission = await window.OneSignal.isPushNotificationsEnabled()
          setNotificationsEnabled(permission)
          console.log("Notification permission status:", permission)
        }
      } catch (error) {
        console.error("Error checking notification permission:", error)
        setNotificationsEnabled(false)
      }
    }

    // Only run on client side
    if (typeof window !== "undefined") {
      checkPermission()
    }
  }, [])

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      if (window.OneSignal) {
        // Request notification permission
        await window.OneSignal.registerForPushNotifications()

        // Check the updated status
        const isEnabled = await window.OneSignal.isPushNotificationsEnabled()
        setNotificationsEnabled(isEnabled)
        console.log("Notification subscription status:", isEnabled)
      }
    } catch (error) {
      console.error("Error subscribing to notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTestNotification = async () => {
    setLoading(true)
    try {
      // Send a test notification via the API
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Dit is een testmelding van XL Groothandel!",
          title: "Test Melding",
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.status}`)
      }

      const result = await response.json()
      console.log("Test notification sent:", result)
    } catch (error) {
      console.error("Error sending test notification:", error)
    } finally {
      setLoading(false)
    }
  }

  if (notificationsEnabled === null) {
    return (
      <Button variant="outline" disabled>
        Laden...
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {notificationsEnabled ? (
        <>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-green-50 text-green-700 border-green-200"
            disabled
          >
            <Bell className="h-4 w-4" />
            Meldingen ingeschakeld
          </Button>
          <Button
            onClick={handleTestNotification}
            disabled={loading}
            variant="default"
            className="bg-[#FF6B35] hover:bg-[#E85A24]"
          >
            Verstuur testmelding
          </Button>
        </>
      ) : (
        <Button
          onClick={handleSubscribe}
          disabled={loading}
          className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#E85A24]"
        >
          <BellOff className="h-4 w-4" />
          {loading ? "Bezig..." : "Meldingen inschakelen"}
        </Button>
      )}
    </div>
  )
}
