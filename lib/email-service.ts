import nodemailer from "nodemailer"
import {
  type OrderConfirmationData,
  generateOrderConfirmationHTML,
  generateOrderConfirmationText,
  categoryMapping,
} from "./email-templates"
import { generateCompletePackingSlipPDF, groupItemsByCategory, type CompletePackingSlipData } from "./pdf-generator"
import { categorizeProduct } from "./product-categorizer"

// Re-export the type for convenience
export type { OrderConfirmationData } from "./email-templates"

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  console.log("Creating email transporter...")
  console.log("Email config check:", {
    server: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER ? "SET" : "NOT SET",
    password: process.env.EMAIL_PASSWORD ? "SET" : "NOT SET",
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
  })

  if (!process.env.EMAIL_SERVER || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error("Email configuration missing - check EMAIL_SERVER, EMAIL_USER, EMAIL_PASSWORD")
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: Number.parseInt(process.env.EMAIL_PORT || "465"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
  })
}

// Update the sendOrderConfirmationEmail function to preserve exact fam2id values
export async function sendOrderConfirmationEmail(data: OrderConfirmationData): Promise<boolean> {
  try {
    console.log("=== SENDING CUSTOMER EMAIL ===")
    console.log(`Customer: ${data.customerEmail}`)
    console.log(`Order: ${data.orderNumber}`)
    console.log(`Items before processing: ${data.items.length}`)

    // Log the categoryMapping to see what mappings are available
    console.log("Category Mapping in email service:", categoryMapping)

    // Before generating HTML content, ensure all products have fam2id
    console.log("Checking products for email...")
    const categorizedItems = data.items.map((item) => {
      // IMPORTANT: Only categorize if fam2id is completely missing
      if (item.fam2id === undefined) {
        const categorizedFam2id = categorizeProduct(item.name, item.volume)
        console.log(
          `Auto-categorized (fallback): ${item.name} -> fam2id: ${categorizedFam2id} -> category: ${categoryMapping[categorizedFam2id] || "UNKNOWN"}`,
        )
        return { ...item, fam2id: categorizedFam2id }
      }

      console.log(
        `Preserving original fam2id: ${item.name} -> ${item.fam2id} -> category: ${categoryMapping[item.fam2id] || "UNKNOWN"}`,
      )
      return item
    })

    // Create a new data object with processed items
    const emailData = {
      ...data,
      items: categorizedItems,
    }

    console.log(`Items after processing: ${emailData.items.length}`)
    console.log(`Categories found: ${[...new Set(emailData.items.map((item) => item.fam2id))].join(", ")}`)
    console.log(
      `Category names: ${[...new Set(emailData.items.map((item) => categoryMapping[item.fam2id || "21"] || "UNKNOWN"))].join(", ")}`,
    )

    // Log each item with its category for debugging
    emailData.items.forEach((item, index) => {
      console.log(
        `Item ${index}: ${item.name}, fam2id: ${item.fam2id}, category: ${categoryMapping[item.fam2id || "21"] || "UNKNOWN"}`,
      )
    })

    const htmlContent = generateOrderConfirmationHTML(emailData)
    const textContent = generateOrderConfirmationText(emailData)
    const transporter = createTransporter()

    console.log("Verifying SMTP connection for customer email...")
    await transporter.verify()
    console.log("SMTP connection verified")

    const info = await transporter.sendMail({
      from: `"XL Groothandel B.V." <${process.env.EMAIL_FROM}>`,
      to: data.customerEmail,
      subject: `Orderbevestiging ${data.orderNumber} - XL Groothandel`,
      text: textContent,
      html: htmlContent,
    })

    console.log(`✅ Customer email sent successfully: ${info.messageId}`)
    transporter.close()
    return true
  } catch (error) {
    console.error("❌ Error sending customer email:", error)
    if (error instanceof Error) {
      console.error("Error details:", error.message)
    }
    return false
  }
}

// Update the sendCompletePackingSlipToAdmin function to preserve exact fam2id values
export async function sendCompletePackingSlipToAdmin(data: OrderConfirmationData): Promise<boolean> {
  try {
    console.log("=== SENDING ADMIN EMAIL WITH PDF ===")
    console.log(`Order: ${data.orderNumber}`)
    console.log(`Admin email configured: ${process.env.EMAIL_TO}`)
    console.log(`Items count: ${data.items?.length || 0}`)

    // Check admin email configuration
    if (!process.env.EMAIL_TO) {
      console.error("❌ EMAIL_TO not configured - cannot send admin email")
      console.error(
        "Available env vars:",
        Object.keys(process.env).filter((key) => key.startsWith("EMAIL")),
      )
      return false
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("❌ Email credentials not configured")
      return false
    }

    // Ensure all items have fam2id, but preserve original values exactly
    const categorizedItems = data.items.map((item) => {
      // IMPORTANT: Only categorize if fam2id is completely missing
      if (item.fam2id === undefined) {
        const categorizedFam2id = categorizeProduct(item.name, item.volume)
        console.log(
          `Admin PDF: Auto-categorized (fallback): ${item.name} -> fam2id: ${categorizedFam2id} -> category: ${categoryMapping[categorizedFam2id] || "UNKNOWN"}`,
        )
        return { ...item, fam2id: categorizedFam2id }
      }

      console.log(
        `Admin PDF: Preserving original fam2id: ${item.name} -> ${item.fam2id} -> category: ${categoryMapping[item.fam2id] || "UNKNOWN"}`,
      )
      return item
    })

    // Create a new data object with processed items
    const emailData = {
      ...data,
      items: categorizedItems,
    }

    const transporter = createTransporter()
    const groupedItems = groupItemsByCategory(emailData.items)
    const categoryCount = Object.keys(groupedItems).length

    console.log(`Processing ${categoryCount} categories for PDF:`, Object.keys(groupedItems))

    // Generate customer content
    console.log("Generating customer HTML content...")
    const customerHtmlContent = generateOrderConfirmationHTML(emailData)
    const customerTextContent = generateOrderConfirmationText(emailData)

    // Generate PDF
    console.log("Generating PDF...")
    const packingSlipData: CompletePackingSlipData = {
      orderNumber: emailData.orderNumber,
      customerName: emailData.customerName,
      customerEmail: emailData.customerEmail,
      deliveryAddress: emailData.deliveryAddress,
      deliveryDate: emailData.deliveryDate,
      deliveryOption: emailData.deliveryOption,
      deliveryInstructions: emailData.deliveryInstructions,
      items: emailData.items,
      totalAmount: emailData.total,
    }

    const pdfBuffer = generateCompletePackingSlipPDF(packingSlipData)
    console.log(`✅ PDF generated successfully: ${pdfBuffer.length} bytes`)

    // Validate PDF
    if (pdfBuffer.length === 0) {
      throw new Error("Generated PDF is empty")
    }

    const pdfHeader = pdfBuffer.toString("ascii", 0, 4)
    if (pdfHeader !== "%PDF") {
      throw new Error(`Invalid PDF header: ${pdfHeader}`)
    }
    console.log("✅ PDF validation passed")

    // Admin email content
    const adminEmailContent = `
NIEUWE BESTELLING ONTVANGEN - ADMIN KOPIE
=========================================

BESTELLING: ${data.orderNumber}
KLANT: ${data.customerName} (${data.customerEmail})
TOTAAL: €${data.total.toFixed(2)}
BEZORGING: ${data.deliveryOption === "delivery" ? "Bezorgen" : "Afhalen"} op ${data.deliveryDate}

CATEGORIEËN (${categoryCount}):
${Object.entries(groupedItems)
  .map(([categoryName, items], index) => {
    const categoryItemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const categoryTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return `${index + 1}. ${categoryName}: ${categoryItemCount} stuks - €${categoryTotal.toFixed(2)}`
  })
  .join("\n")}

TOTAAL: ${data.items.reduce((sum, item) => sum + item.quantity, 0)} stuks

${data.deliveryAddress ? `ADRES: ${data.deliveryAddress}\n` : ""}
${data.deliveryInstructions ? `INSTRUCTIES: ${data.deliveryInstructions}\n` : ""}

ACTIES VEREIST:
==============
1. Print bijgevoegde pakbon PDF uit
2. Start order picking volgens pakbon
3. Bereid bestelling voor volgens bezorgoptie
4. Bevestig wanneer bestelling klaar is

BIJLAGEN:
========
- pakbon-order-picking-${data.orderNumber}.pdf (voor magazijn)

HIERONDER: Orderbevestiging zoals klant ontvangt
===============================================

${customerTextContent}
`

    console.log("Verifying SMTP connection for admin email...")
    await transporter.verify()
    console.log("SMTP connection verified")

    const mailOptions = {
      from: `"XL Groothandel System" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: `📦 BESTELLING ${data.orderNumber} - Admin Kopie + Pakbon PDF`,
      text: adminEmailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #ff6b35; margin: 0 0 10px 0;">📦 NIEUWE BESTELLING - ADMIN KOPIE</h2>
            <p style="margin: 0; color: #666;">
              Orderbevestiging + pakbon PDF voor order picking
            </p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <h3 style="margin: 0 0 10px 0; color: #856404;">⚠️ ACTIES VEREIST:</h3>
            <ul style="margin: 0; color: #856404;">
              <li>Print de bijgevoegde pakbon PDF</li>
              <li>Start order picking volgens pakbon</li>
              <li>Bereid bestelling voor volgens bezorgoptie</li>
            </ul>
          </div>

          <div style="border: 2px solid #ff6b35; border-radius: 8px; overflow: hidden;">
            <div style="background: #ff6b35; color: white; padding: 15px;">
              <h3 style="margin: 0;">ORDERBEVESTIGING (zoals klant ontvangt):</h3>
            </div>
            <div style="padding: 20px;">
              ${customerHtmlContent}
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `pakbon-order-picking-${data.orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
          contentDisposition: "attachment" as const,
        },
      ],
    }

    console.log("Sending admin email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      attachmentCount: mailOptions.attachments.length,
      attachmentSize: pdfBuffer.length,
    })

    const info = await transporter.sendMail(mailOptions)

    console.log(`✅ Admin email sent successfully!`)
    console.log(`Message ID: ${info.messageId}`)
    console.log(`Response: ${info.response}`)
    console.log(`Accepted: ${JSON.stringify(info.accepted)}`)
    console.log(`Rejected: ${JSON.stringify(info.rejected)}`)

    transporter.close()
    return true
  } catch (error) {
    console.error("❌ CRITICAL ERROR sending admin email:", error)
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    return false
  }
}

export async function sendAdminOrderNotification(data: OrderConfirmationData): Promise<boolean> {
  console.log("Admin notification skipped - all info included in main admin email")
  return true
}
