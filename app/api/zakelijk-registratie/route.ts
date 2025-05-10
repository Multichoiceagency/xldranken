import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const formData = await request.json()
    console.log("Received business registration form data")

    // Validate required fields
    const requiredFields = [
      "bedrijfsnaam",
      "kvkNummer",
      "btwNummer",
      "adres",
      "postcode",
      "plaats",
      "contactpersoonVoornaam",
      "contactpersoonAchternaam",
      "email",
    ]

    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          {
            success: false,
            message: `Veld '${field}' is verplicht`,
          },
          { status: 400 },
        )
      }
    }

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
    const emailContent = formatEmailContent(formData)

    // Email options
    const mailOptions = {
      from: `"XL Dranken Website" <${process.env.EMAIL_FROM || "noreply@xlgroothandelbv.nl"}>`,
      to: process.env.EMAIL_TO || "zakelijk@xlgroothandelbv.nl",
      replyTo: formData.email,
      subject: `Nieuwe zakelijke registratie - ${formData.bedrijfsnaam}`,
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
          success: false,
          message: "Er is een fout opgetreden bij het verzenden van uw aanvraag. Probeer het later opnieuw.",
          details: verifyError instanceof Error ? verifyError.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    // Send the email
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.messageId)

    // Store the registration in a database (mock implementation)
    // In a real application, you would store this in a database
    console.log("Storing business registration in database (mock)")

    return NextResponse.json({
      success: true,
      message: "Uw aanvraag is succesvol verzonden. We nemen binnen 1-2 werkdagen contact met u op.",
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("Error processing business registration:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Er is een fout opgetreden bij het verwerken van uw aanvraag.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Helper function to format the email content
function formatEmailContent(data: any) {
  // Create plain text version
  const text = `
Nieuwe Zakelijke Registratie

Bedrijfsgegevens:
Bedrijfsnaam: ${data.bedrijfsnaam}
KVK-nummer: ${data.kvkNummer}
BTW-nummer: ${data.btwNummer}
Adres: ${data.adres}
Postcode: ${data.postcode}
Plaats: ${data.plaats}
Branche: ${data.branche || "Niet opgegeven"}

Contactpersoon:
Naam: ${data.contactpersoonVoornaam} ${data.contactpersoonAchternaam}
Functie: ${data.functie || "Niet opgegeven"}
E-mail: ${data.email}
Telefoon: ${data.telefoon || "Niet opgegeven"}

Aanvullende informatie:
Aantal medewerkers: ${data.aantalMedewerkers || "Niet opgegeven"}
Geschatte maandelijkse afname: ${data.geschatteAfname || "Niet opgegeven"}
Opmerkingen: ${data.opmerkingen || "Geen opmerkingen"}
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
    <h1>Nieuwe Zakelijke Registratie</h1>
    
    <div class="section">
      <h2>Bedrijfsgegevens</h2>
      <p><span class="label">Bedrijfsnaam:</span> ${data.bedrijfsnaam}</p>
      <p><span class="label">KVK-nummer:</span> ${data.kvkNummer}</p>
      <p><span class="label">BTW-nummer:</span> ${data.btwNummer}</p>
      <p><span class="label">Adres:</span> ${data.adres}</p>
      <p><span class="label">Postcode:</span> ${data.postcode}</p>
      <p><span class="label">Plaats:</span> ${data.plaats}</p>
      <p><span class="label">Branche:</span> ${data.branche || "Niet opgegeven"}</p>
    </div>
    
    <div class="section">
      <h2>Contactpersoon</h2>
      <p><span class="label">Naam:</span> ${data.contactpersoonVoornaam} ${data.contactpersoonAchternaam}</p>
      <p><span class="label">Functie:</span> ${data.functie || "Niet opgegeven"}</p>
      <p><span class="label">E-mail:</span> ${data.email}</p>
      <p><span class="label">Telefoon:</span> ${data.telefoon || "Niet opgegeven"}</p>
    </div>
    
    <div class="section">
      <h2>Aanvullende informatie</h2>
      <p><span class="label">Aantal medewerkers:</span> ${data.aantalMedewerkers || "Niet opgegeven"}</p>
      <p><span class="label">Geschatte maandelijkse afname:</span> ${data.geschatteAfname || "Niet opgegeven"}</p>
      <p><span class="label">Opmerkingen:</span> ${data.opmerkingen || "Geen opmerkingen"}</p>
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
