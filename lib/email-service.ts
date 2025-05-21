import { EmailFormData } from "@/app/api/email/types";

/**
 * Sends the return form data to the email API endpoint
 */
export async function sendReturnFormEmail(formData: EmailFormData): Promise<{ success: boolean; message: string }> {
  try {
    console.log("Sending email with form data:", formData.bestelnummer)

    // Add debugging to see the full URL being used
    const apiUrl = "/api/email"
    console.log("Sending request to:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      // Prevent caching
      cache: "no-store",
    })

    console.log("Email API response status:", response.status, response.statusText)

    // Handle 404 errors specifically
    if (response.status === 404) {
      console.error("API route not found:", apiUrl)
      return {
        success: false,
        message: "API route not found. Please check server configuration.",
      }
    }

    let data
    try {
      data = await response.json()
      console.log("Email API response data:", data)
    } catch (error) {
      console.error("Failed to parse API response:", error)
      return {
        success: false,
        message: "Er is een fout opgetreden bij het verwerken van de server response.",
      }
    }

    if (!response.ok) {
      console.error("Email API error:", data.error || "Unknown error", "Status:", response.status)
      return {
        success: false,
        message: data.error || "Er is een fout opgetreden bij het verzenden van de e-mail",
      }
    }

    return {
      success: true,
      message: "Uw retourverzoek is succesvol verzonden. We nemen zo spoedig mogelijk contact met u op.",
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message:
        "Er is een fout opgetreden bij het verzenden van uw retourverzoek. Probeer het later opnieuw of neem contact op met onze klantenservice.",
    }
  }
}
