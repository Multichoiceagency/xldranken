import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { mkdir } from "fs/promises"

// Make sure to export this function correctly
export async function POST(request: NextRequest) {
  console.log("Email API route handler called")

  try {
    // For multipart form data, we need to use formData()
    const formData = await request.formData()
    console.log("Received form data")

    // Extract files from the form data
    const files = formData.getAll("files") as File[]
    console.log(`Received ${files.length} files`)

    // Extract other form fields
    const naam = formData.get("naam") as string
    const email = formData.get("email") as string
    const telefoon = (formData.get("telefoon") as string) || ""
    const bestelnummer = formData.get("bestelnummer") as string
    const aankoopdatum = formData.get("aankoopdatum") as string
    const productnaam = formData.get("productnaam") as string
    const aantal = formData.get("aantal") as string
    const redenVanRetour = formData.get("redenVanRetour") as string
    const andereReden = (formData.get("andereReden") as string) || ""
    const opmerkingen = (formData.get("opmerkingen") as string) || ""

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
    if (!email || !naam || !bestelnummer) {
      console.error("Missing required fields in email request")
      return NextResponse.json({ error: "Verplichte velden ontbreken: email, naam, bestelnummer" }, { status: 400 })
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

    // Process files for attachment
    const attachments = []

    if (files.length > 0) {
      try {
        // Create a temporary directory for file uploads if it doesn't exist
        const uploadDir = join(process.cwd(), "tmp", "uploads")
        await mkdir(uploadDir, { recursive: true })

        for (const file of files) {
          const buffer = Buffer.from(await file.arrayBuffer())
          const filename = `${uuidv4()}-${file.name}`
          const filepath = join(uploadDir, filename)

          // Write the file to disk
          await writeFile(filepath, buffer)

          // Add to email attachments
          attachments.push({
            filename: file.name,
            path: filepath,
          })
        }
      } catch (fileError) {
        console.error("Error processing file attachments:", fileError)
      }
    }

    // Format email content
    const emailContent = formatEmailContent({
      naam,
      email,
      telefoon,
      bestelnummer,
      aankoopdatum,
      productnaam,
      aantal,
      redenVanRetour,
      andereReden,
      opmerkingen,
      fileCount: files.length,
    })

    // Email options
    const mailOptions = {
      from: `"XL Dranken Website" <${process.env.EMAIL_FROM || "noreply@xlgroothandelbv.nl"}>`,
      to: process.env.EMAIL_TO || "info@xlgroothandelbv.nl",
      replyTo: email,
      subject: `Retourverzoek - Bestelnummer: ${bestelnummer}`,
      text: emailContent.text,
      html: emailContent.html,
      attachments: attachments,
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
  bestelnummer: string
  aankoopdatum: string
  productnaam: string
  aantal: string
  redenVanRetour: string
  andereReden: string
  opmerkingen: string
  fileCount: number
}) {
  // Create plain text version
  const text = `
Nieuw Retourverzoek

Klantgegevens:
Naam: ${data.naam}
E-mail: ${data.email}
Telefoon: ${data.telefoon || "Niet opgegeven"}

Bestelgegevens:
Bestelnummer: ${data.bestelnummer}
Aankoopdatum: ${data.aankoopdatum}

Productgegevens:
Productnaam: ${data.productnaam}
Aantal: ${data.aantal}
Reden van retour: ${data.redenVanRetour}
${data.redenVanRetour === "Anders" ? `Andere reden: ${data.andereReden || ""}` : ""}

Opmerkingen:
${data.opmerkingen || "Geen opmerkingen"}

Bijlagen: ${data.fileCount > 0 ? `${data.fileCount} bestand(en) bijgevoegd` : "Geen bijlagen"}
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
    <h1>Nieuw Retourverzoek</h1>
    
    <div class="section">
      <h2>Klantgegevens</h2>
      <p><span class="label">Naam:</span> ${data.naam}</p>
      <p><span class="label">E-mail:</span> ${data.email}</p>
      <p><span class="label">Telefoon:</span> ${data.telefoon || "Niet opgegeven"}</p>
    </div>
    
    <div class="section">
      <h2>Bestelgegevens</h2>
      <p><span class="label">Bestelnummer:</span> ${data.bestelnummer}</p>
      <p><span class="label">Aankoopdatum:</span> ${data.aankoopdatum}</p>
    </div>
    
    <div class="section">
      <h2>Productgegevens</h2>
      <p><span class="label">Productnaam:</span> ${data.productnaam}</p>
      <p><span class="label">Aantal:</span> ${data.aantal}</p>
      <p><span class="label">Reden van retour:</span> ${data.redenVanRetour}</p>
      ${data.redenVanRetour === "Anders" ? `<p><span class="label">Andere reden:</span> ${data.andereReden || ""}</p>` : ""}
    </div>
    
    <div class="section">
      <h2>Opmerkingen</h2>
      <p>${data.opmerkingen || "Geen opmerkingen"}</p>
    </div>
    
    <div class="section">
      <h2>Bijlagen</h2>
      <p>${data.fileCount > 0 ? `${data.fileCount} bestand(en) bijgevoegd` : "Geen bijlagen"}</p>
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
