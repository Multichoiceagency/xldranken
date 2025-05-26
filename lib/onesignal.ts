// Remove the initializeOneSignal function

// Keep any utility functions you still need
export const sendTestNotification = async (message: string): Promise<boolean> => {
  try {
    // Get the OneSignal player ID
    const playerId = await (window as any).OneSignal.getUserId()

    if (!playerId) {
      console.error("No OneSignal player ID found")
      return false
    }

    // For testing purposes only - in production, use your backend API
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.NEXT_PUBLIC_ONESIGNAL_REST_API_KEY || ""}`,
      },
      body: JSON.stringify({
        app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "",
        include_player_ids: [playerId],
        contents: {
          en: message,
          nl: message,
        },
        headings: {
          en: "Test Notification",
          nl: "Test Melding",
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`OneSignal API returned ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    console.log("Test notification sent:", result)
    return true
  } catch (error) {
    console.error("Error sending test notification:", error)
    return false
  }
}
