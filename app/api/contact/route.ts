import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  console.log("Contact API route handler called")

  try {
    // Parse JSON request body
    const body = await request.json()
    console.log("Received form data:", body)

    // Extract form fields
    const { naam, email, telefoon, onderwerp, bericht } = body

    // Log environment variables (without exposing sensitive data)
    console.log("Environment variables check:", {
      EMAIL_SERVER: process.env.EMAIL_SERVER ? "✓ Set" : "✗ Missing",
      EMAIL_PORT: process.env.EMAIL_PORT ? "✓ Set" : "✗ Missing",
      EMAIL_SECURE: process.env.EMAIL_SECURE ? "✓ Set" : "✗ Missing",
      EMAIL_USER: process.env.EMAIL_USER ? "✓ Set" : "✗ Missing",
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? "✓ Set" : "✗ Missing",
      EMAIL_FROM: process.env.EMAIL_FROM ? "✓ Set" : "✗ Missing",
      EMAIL_TO: process.env.EMAIL_TO ? "✓ Set" : "✗ Missing",
    })

    // Validate required fields
    if (!email || !naam || !onderwerp || !bericht) {
      console.error("Missing required fields in contact request")
      return NextResponse.json({ error: "Verplichte velden ontbreken" }, { status: 400 })
    }

    // Create transporter - using environment variables with fallbacks
    const transporterConfig = {
      host: process.env.EMAIL_SERVER || "smtp.gmail.com",
      port: Number.parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER || "your-email@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "your-app-password",
      },
    }

    console.log("Creating nodemailer transporter with config:", {
      host: transporterConfig.host,
      port: transporterConfig.port,
      secure: transporterConfig.secure,
      auth: { user: transporterConfig.auth.user, pass: "********" },
    })

    const transporter = nodemailer.createTransport(transporterConfig)

    // Format email content
    const emailContent = formatEmailContent({
      naam,
      email,
      telefoon: telefoon || "Niet opgegeven",
      onderwerp,
      bericht,
    })

    // Email options
    const mailOptions = {
      from: `"XL Dranken Website" <${process.env.EMAIL_FROM || "noreply@xlgroothandelbv.nl"}>`,
      to: process.env.EMAIL_TO || "info@xlgroothandelbv.nl",
      replyTo: email,
      subject: `Contactformulier: ${onderwerp}`,
      text: emailContent.text,
      html: emailContent.html,
    }

    console.log("Attempting to send email to:", mailOptions.to, "from:", mailOptions.from)

    // Verify SMTP connection
    try {
      await transporter.verify()
      console.log("SMTP connection verified successfully")
    } catch (verifyError) {
      console.error("SMTP connection verification failed:", verifyError)
      return NextResponse.json(
        {
          error: "SMTP connection failed",
          details: verifyError instanceof Error ? verifyError.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    // Send the email
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.messageId)

    return NextResponse.json({
      success: true,
      message: "E-mail succesvol verzonden",
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het verzenden van de e-mail",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Helper function to format the email content
function formatEmailContent(data: {
  naam: string
  email: string
  telefoon: string
  onderwerp: string
  bericht: string
}) {
  // Create plain text version
  const text = `
Nieuw bericht via contactformulier

Contactgegevens:
Naam: ${data.naam}
E-mail: ${data.email}
Telefoon: ${data.telefoon}

Onderwerp: ${data.onderwerp}

Bericht:
${data.bericht}
`

  // Create HTML version
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #0F3059; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    h2 { color: #BEA46A; margin-top: 20px; }
    .section { margin-bottom: 20px; }
    .label { font-weight: bold; }
    .footer { margin-top: 30px; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Nieuw bericht via contactformulier</h1>
    
    <div class="section">
      <h2>Contactgegevens</h2>
      <p><span class="label">Naam:</span> ${data.naam}</p>
      <p><span class="label">E-mail:</span> ${data.email}</p>
      <p><span class="label">Telefoon:</span> ${data.telefoon}</p>
    </div>
    
    <div class="section">
      <h2>Onderwerp</h2>
      <p>${data.onderwerp}</p>
    </div>
    
    <div class="section">
      <h2>Bericht</h2>
      <p>${data.bericht.replace(/\n/g, "<br>")}</p>
    </div>
    
    <div class="footer">
      <p>Dit bericht is automatisch gegenereerd vanaf de XL Dranken website.</p>
    </div>
  </div>
</body>
</html>
`

  return { text, html }
}
