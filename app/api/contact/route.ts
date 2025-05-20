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

    // Format email content for admin notification
    const adminEmailContent = formatAdminEmailContent({
      naam,
      email,
      telefoon: telefoon || "Niet opgegeven",
      onderwerp,
      bericht,
    })

    // Format confirmation email content for customer
    const customerEmailContent = formatCustomerEmailContent({
      naam,
      email,
      telefoon: telefoon || "Niet opgegeven",
      onderwerp,
      bericht,
    })

    // Email options for admin notification
    const adminMailOptions = {
      from: `"XL Dranken Website" <${process.env.EMAIL_FROM || "noreply@xlgroothandelbv.nl"}>`,
      to: process.env.EMAIL_TO || "info@xlgroothandelbv.nl",
      replyTo: email,
      subject: `Contactformulier: ${onderwerp}`,
      text: adminEmailContent.text,
      html: adminEmailContent.html,
    }

    // Email options for customer confirmation
    const customerMailOptions = {
      from: `"XL Dranken" <${process.env.EMAIL_FROM || "noreply@xlgroothandelbv.nl"}>`,
      to: email,
      subject: `Bevestiging: Uw bericht aan XL Dranken`,
      text: customerEmailContent.text,
      html: customerEmailContent.html,
    }

    console.log("Attempting to send admin email to:", adminMailOptions.to, "from:", adminMailOptions.from)
    console.log("Attempting to send confirmation email to:", customerMailOptions.to)

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

    // Send the admin notification email
    const adminInfo = await transporter.sendMail(adminMailOptions)
    console.log("Admin email sent successfully:", adminInfo.messageId)

    // Send the customer confirmation email
    const customerInfo = await transporter.sendMail(customerMailOptions)
    console.log("Customer confirmation email sent successfully:", customerInfo.messageId)

    return NextResponse.json({
      success: true,
      message: "E-mails succesvol verzonden",
      adminMessageId: adminInfo.messageId,
      customerMessageId: customerInfo.messageId,
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

// Helper function to format the admin email content
function formatAdminEmailContent(data: {
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

// Helper function to format the customer confirmation email content
function formatCustomerEmailContent(data: {
  naam: string
  email: string
  telefoon: string
  onderwerp: string
  bericht: string
}) {
  // Create plain text version
  const text = `
Beste ${data.naam},

Bedankt voor uw bericht aan XL Dranken. We hebben uw contactaanvraag in goede orde ontvangen.

Hieronder vindt u een kopie van uw bericht:

Onderwerp: ${data.onderwerp}

Bericht:
${data.bericht}

We streven ernaar om binnen 1-2 werkdagen te reageren op uw bericht.

Met vriendelijke groet,
Het team van XL Dranken

Turfschipper 116
2292 JB Wateringen
Tel: +31 6 18495949
Email: info@xlgroothandelbv.nl
Website: www.xlgroothandelbv.nl
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
    .message-box { background-color: #f9f9f9; border-left: 4px solid #BEA46A; padding: 15px; margin: 15px 0; }
    .footer { margin-top: 30px; font-size: 14px; color: #555; border-top: 1px solid #eee; padding-top: 20px; }
    .contact-info { margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Bevestiging van uw bericht</h1>
    
    <div class="section">
      <p>Beste ${data.naam},</p>
      <p>Bedankt voor uw bericht aan XL Dranken. We hebben uw contactaanvraag in goede orde ontvangen.</p>
      <p>Hieronder vindt u een kopie van uw bericht:</p>
      
      <div class="message-box">
        <h2>Onderwerp: ${data.onderwerp}</h2>
        <p>${data.bericht.replace(/\n/g, "<br>")}</p>
      </div>
      
      <p>We streven ernaar om binnen 1-2 werkdagen te reageren op uw bericht.</p>
    </div>
    
    <div class="footer">
      <p>Met vriendelijke groet,<br>Het team van XL Dranken</p>
      
      <div class="contact-info">
        Turfschipper 116<br>
        2292 JB Wateringen<br>
        Tel: <a href="tel:+31618495949">+31 6 18495949</a><br>
        Email: <a href="mailto:info@xlgroothandelbv.nl">info@xlgroothandelbv.nl</a><br>
        Website: <a href="https://www.xlgroothandelbv.nl">www.xlgroothandelbv.nl</a>
      </div>
    </div>
  </div>
</body>
</html>
`

  return { text, html }
}
