"use client"

// Helper functions for working with OneSignal v16

export const NotificationService = {
  // Check if notifications are supported
  isSupported: () => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return false

    // Check for notification support
    return "Notification" in window
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
        try {
          // For OneSignal v16, we use the User model
          if (window.OneSignal.User?.PushSubscription?.optIn) {
            await window.OneSignal.User.PushSubscription.optIn()
            console.log("Called User.PushSubscription.optIn")
            return true
          }
          // Fallback to older methods if available
          else if (typeof window.OneSignal.registerForPushNotifications === "function") {
            window.OneSignal.registerForPushNotifications()
            console.log("Called registerForPushNotifications")
            return true
          } else {
            console.log("No suitable OneSignal subscription method found")
          }
        } catch (error) {
          console.error("Error with OneSignal subscription:", error)
        }
      }

      return false
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
      // For OneSignal v16, we use the User model
      if (window.OneSignal.User?.addTag) {
        await window.OneSignal.User.addTag(key, value)
        console.log(`Added tag ${key}:${value} using User.addTag`)
        return true
      }
      // Fallback to older methods if available
      else if (typeof window.OneSignal.sendTag === "function") {
        window.OneSignal.sendTag(key, value)
        console.log(`Added tag ${key}:${value} using sendTag`)
        return true
      }

      console.log("No suitable OneSignal tag method found")
      return false
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
      // For OneSignal v16, we use the User model
      if (window.OneSignal.User?.getUser) {
        const user = await window.OneSignal.User.getUser()
        console.log("Got user using User.getUser:", user)
        return user?.onesignal_id || null
      }
      // Fallback to older methods if available
      else if (typeof window.OneSignal.getUserId === "function") {
        const userId = await window.OneSignal.getUserId()
        console.log("Got user ID using getUserId:", userId)
        return userId
      }

      console.log("No suitable OneSignal getUserId method found")
      return null
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
      // For OneSignal v16, we use the User model
      if (window.OneSignal.User?.getPushSubscription) {
        try {
          const pushSubscription = await window.OneSignal.User.getPushSubscription()
          console.log("Push enabled check using User.getPushSubscription:", pushSubscription)
          return pushSubscription?.optedIn || false
        } catch (e) {
          console.log("Error with User.getPushSubscription:", e)
        }
      }

      // Fallback to older methods if available
      if (typeof window.OneSignal.isPushNotificationsEnabled === "function") {
        const enabled = await window.OneSignal.isPushNotificationsEnabled()
        console.log("Push enabled check using isPushNotificationsEnabled:", enabled)
        return enabled
      }

      // Fall back to checking browser notification permission
      console.log("No suitable OneSignal method found, checking browser permission")
      return Notification.permission === "granted"
    } catch (error) {
      console.error("Error checking push status:", error)
      // Fall back to checking browser notification permission
      return Notification.permission === "granted"
    }
  },
}

