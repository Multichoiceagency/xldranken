"use client"

import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"
import { NotificationService } from "@/lib/notification-service"

export function NotificationPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  useEffect(() => {
    // Check if notifications are supported in this environment
    const supported = NotificationService.isSupported()
    setIsSupported(supported)

    if (!supported) {
      console.log("Notifications are not supported in this environment")
      return
    }

    // Check if the user has already interacted with the popup
    const hasUserInteracted = localStorage.getItem("notification_popup_interacted")

    if (hasUserInteracted === "true") {
      setHasInteracted(true)
      return
    }

    // Check if notifications are already enabled
    const checkNotificationStatus = async () => {
      if (isCheckingStatus) return
      setIsCheckingStatus(true)

      try {
        // First check browser permission directly
        const browserPermission = Notification.permission
        console.log("Browser notification permission:", browserPermission)

        if (browserPermission === "granted") {
          // If browser permission is granted, check OneSignal status
          try {
            const enabled = await NotificationService.isPushEnabled()
            console.log("OneSignal push enabled:", enabled)

            if (enabled) {
              // User already has notifications enabled, no need to show popup
              setHasInteracted(true)
              localStorage.setItem("notification_popup_interacted", "true")
              return
            }
          } catch (e) {
            console.error("Error checking OneSignal status:", e)
          }
        } else if (browserPermission === "denied") {
          // If browser permission is denied, don't show popup
          setHasInteracted(true)
          localStorage.setItem("notification_popup_interacted", "true")
          return
        }
      } catch (error) {
        console.error("Error checking notification status:", error)
      } finally {
        setIsCheckingStatus(false)
      }

      // Show popup after a delay (5 seconds)
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 5000)

      return () => clearTimeout(timer)
    }

    // Wait for OneSignal to initialize
    const checkOneSignal = setInterval(() => {
      if (window.OneSignal) {
        clearInterval(checkOneSignal)
        checkNotificationStatus()
      }
    }, 1000)

    // Clear interval after 10 seconds to prevent infinite checking
    setTimeout(() => {
      clearInterval(checkOneSignal)
      if (!isCheckingStatus && !hasInteracted) {
        setIsVisible(true)
      }
    }, 10000)

    return () => clearInterval(checkOneSignal)
  }, [isCheckingStatus, hasInteracted])

  const handleSubscribe = async () => {
    try {
      const result = await NotificationService.requestPermission()
      console.log("Permission request result:", result)

      if (result) {
        // Add a tag to categorize this user (optional)
        await NotificationService.addUserTag("user_type", "customer")
      }

      // Record that user has interacted with the popup
      setHasInteracted(true)
      localStorage.setItem("notification_popup_interacted", "true")

      // Hide the popup
      setIsVisible(false)
    } catch (error) {
      console.error("Error subscribing to notifications:", error)
    }
  }

  const handleDismiss = () => {
    // Record that user has interacted with the popup
    setHasInteracted(true)
    localStorage.setItem("notification_popup_interacted", "true")

    // Hide the popup
    setIsVisible(false)
  }

  // Don't show anything if notifications aren't supported or popup shouldn't be visible
  if (!isVisible || hasInteracted || !isSupported) {
    return null
  }

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-4 sm:right-4 z-50 max-w-xs bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        aria-label="Sluiten"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start">
        <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
          <Bell className="h-6 w-6 text-blue-600" />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900">Blijf op de hoogte!</h3>
          <p className="mt-1 text-xs text-gray-500">Ontvang meldingen over nieuwe producten, aanbiedingen en meer.</p>

          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleSubscribe}
              className="flex-1 bg-blue-600 text-white text-xs py-1.5 px-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Inschakelen
            </button>

            <button
              onClick={handleDismiss}
              className="flex-1 bg-gray-100 text-gray-700 text-xs py-1.5 px-3 rounded-md hover:bg-gray-200 transition-colors"
            >
              Niet nu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

