import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message, userId, title } = await request.json()

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    // OneSignal API key should be stored as a server-side environment variable
    const oneSignalApiKey = process.env.ONESIGNAL_REST_API_KEY
    const oneSignalAppId = "32d3547f-ec7c-4a28-818f-f01357f4e9c9" // Using the app ID from your script

    if (!oneSignalApiKey) {
      return NextResponse.json({ success: false, error: "OneSignal API key missing" }, { status: 500 })
    }

    // Prepare notification data
    const notificationData: any = {
      app_id: oneSignalAppId,
      contents: {
        en: message,
        nl: message,
      },
      headings: {
        en: title || "XL Groothandel",
        nl: title || "XL Groothandel",
      },
    }

    // Target specific user if userId is provided, otherwise send to all subscribers
    if (userId) {
      notificationData.include_external_user_ids = [userId]
    } else {
      notificationData.included_segments = ["Subscribed Users"]
    }

    // Send notification via OneSignal API
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${oneSignalApiKey}`,
      },
      body: JSON.stringify(notificationData),
    })

    const result = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: result,
      })
    } else {
      console.error("OneSignal API error:", result)
      return NextResponse.json(
        { success: false, error: "Failed to send notification", details: result },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
