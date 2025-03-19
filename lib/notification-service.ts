"use client"

// Helper functions for working with OneSignal

export const NotificationService = {
  // Check if notifications are supported
  isSupported: () => {
    return typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator
  },

  // Request permission for notifications
  requestPermission: async () => {
    if (!NotificationService.isSupported()) {
      return false
    }

    try {
      // First, request browser permission
      const permission = await Notification.requestPermission()

      if (permission !== "granted") {
        return false
      }

      // Then, register with OneSignal
      if (window.OneSignal) {
        await window.OneSignal.User.PushSubscription.optIn()
        console.log("Successfully subscribed to OneSignal notifications")
      }

      return true
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  },

  // Subscribe user to a specific topic/tag
  addUserTag: async (key: string, value: string) => {
    if (typeof window === "undefined" || !window.OneSignal) {
      return false
    }

    try {
      await window.OneSignal.User.addTag(key, value)
      console.log(`Added tag ${key}:${value}`)
      return true
    } catch (error) {
      console.error("Error adding user tag:", error)
      return false
    }
  },

  // Get the OneSignal user ID (useful for targeting specific users)
  getUserId: async () => {
    if (typeof window === "undefined" || !window.OneSignal) {
      return null
    }

    try {
      const user = await window.OneSignal.User.getUser()
      return user?.onesignal_id || null
    } catch (error) {
      console.error("Error getting OneSignal user ID:", error)
      return null
    }
  },

  // Check if push notifications are enabled
  isPushEnabled: async () => {
    if (typeof window === "undefined" || !window.OneSignal) {
      return false
    }

    try {
      const pushSubscription = await window.OneSignal.User.getPushSubscription()
      return pushSubscription.optedIn || false
    } catch (error) {
      console.error("Error checking push status:", error)
      return false
    }
  },
}

