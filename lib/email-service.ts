import nodemailer from "nodemailer"
import {
  type OrderConfirmationData,
  generateOrderConfirmationHTML,
  generateOrderConfirmationText,
} from "./email-templates"
import { generateCompletePackingSlipPDF, groupItemsByCategory, type CompletePackingSlipData } from "./pdf-generator"
import { categorizeProduct, getCategoryName } from "./product-categorizer"

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
    // Optimized connection settings
    pool: false, // Disable pooling for faster single sends
    maxConnections: 1,
    maxMessages: 1,
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 15000, // 15 seconds
    socketTimeout: 30000, // 30 seconds
    // Add retry logic
    retryDelay: 1000,
    // Disable some features for speed
    disableFileAccess: true,
    disableUrlAccess: true,
  })
}

// Update the sendOrderConfirmationEmail function to preserve exact fam2id values
export async function sendOrderConfirmationEmail(data: OrderConfirmationData): Promise<boolean> {
  const timeout = 25000 // 25 second timeout

  try {
    console.log("=== SENDING CUSTOMER EMAIL ===")
    console.log(`Customer: ${data.customerEmail}`)
    console.log(`Order: ${data.orderNumber}`)

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Email timeout after 25 seconds")), timeout)
    })

    // Create email sending promise
    const emailPromise = (async () => {
      // Process items quickly without extensive logging
      const categorizedItems = data.items.map((item) => {
        if (item.fam2id === undefined) {
          const result = categorizeProduct(item.name, item.volume)
          const fam2id = typeof result === "string" ? result : result.fam2id
          const categoryName = getCategoryName(fam2id)
          return { ...item, fam2id, category: categoryName }
        }
        return { ...item, category: getCategoryName(item.fam2id) }
      })

      const emailData = { ...data, items: categorizedItems }
      const htmlContent = generateOrderConfirmationHTML(emailData)
      const textContent = generateOrderConfirmationText(emailData)
      const transporter = createTransporter()

      console.log("Sending customer email...")
      const info = await transporter.sendMail({
        from: `"XL Groothandel B.V." <${process.env.EMAIL_FROM}>`,
        to: data.customerEmail,
        subject: `Orderbevestiging ${data.orderNumber} - XL Groothandel`,
        text: textContent,
        html: htmlContent,
      })

      transporter.close()
      return info
    })()

    // Race between email sending and timeout
    await Promise.race([emailPromise, timeoutPromise])

    console.log(`✅ Customer email sent successfully`)
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
  const timeout = 45000 // 45 second timeout for admin email (larger due to PDF)

  try {
    console.log("=== SENDING ADMIN EMAIL WITH PDF ===")
    console.log(`Order: ${data.orderNumber}`)

    if (!process.env.EMAIL_TO) {
      console.error("❌ EMAIL_TO not configured - cannot send admin email")
      return false
    }

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Admin email timeout after 45 seconds")), timeout)
    })

    // Create email sending promise
    const emailPromise = (async () => {
      // Process items quickly
      const categorizedItems = data.items.map((item) => {
        if (item.fam2id === undefined) {
          const result = categorizeProduct(item.name, item.volume)
          const fam2id = typeof result === "string" ? result : result.fam2id
          const categoryName = getCategoryName(fam2id)
          return { ...item, fam2id, category: categoryName }
        }
        return { ...item, category: getCategoryName(item.fam2id) }
      })

      const emailData = { ...data, items: categorizedItems }
      const transporter = createTransporter()
      const groupedItems = groupItemsByCategory(emailData.items)

      console.log("Generating customer content...")
      const customerHtmlContent = generateOrderConfirmationHTML(emailData)
      const customerTextContent = generateOrderConfirmationText(emailData)

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
      console.log(`✅ PDF generated: ${pdfBuffer.length} bytes`)

      // Validate PDF quickly
      if (pdfBuffer.length === 0 || pdfBuffer.toString("ascii", 0, 4) !== "%PDF") {
        throw new Error("Invalid PDF generated")
      }

      // Create detailed admin email with complete order information
      const adminEmailContent = `
NIEUWE BESTELLING - ${data.orderNumber}
========================================
Klant: ${data.customerName} (${data.customerEmail})
Totaal: €${data.total.toFixed(2)}
Bezorging: ${data.deliveryOption === "delivery" ? "Bezorgen" : "Afhalen"} op ${data.deliveryDate}
${data.deliveryAddress ? `Adres: ${data.deliveryAddress}\n` : ""}
${data.deliveryInstructions ? `Instructies: ${data.deliveryInstructions}\n` : ""}

BESTELDE PRODUCTEN:
------------------
${Object.entries(groupedItems)
  .map(([category, items]) => {
    const categoryTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const itemsList = items
      .map((item) => `  • ${item.quantity}x ${item.name} (€${item.price.toFixed(2)}/st)`)
      .join("\n")

    return `${category} - €${categoryTotal.toFixed(2)}:\n${itemsList}\n`
  })
  .join("\n")}

TOTAAL: ${data.items.reduce((sum, item) => sum + item.quantity, 0)} stuks - €${data.total.toFixed(2)}

Zie bijgevoegde pakbon PDF voor order picking.
`

      console.log("Sending admin email...")
      const info = await transporter.sendMail({
        from: `"XL Groothandel System" <${process.env.EMAIL_FROM}>`,
        to: process.env.EMAIL_TO,
        subject: `📦 BESTELLING ${data.orderNumber} - Admin Kopie + Pakbon PDF`,
        text: adminEmailContent,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #ff6b35; margin: 0 0 10px 0;">📦 NIEUWE BESTELLING</h2>
              <p style="margin: 0; color: #666;">Order: ${data.orderNumber}</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">⚠️ ACTIES VEREIST:</h3>
              <ul style="margin: 0; color: #856404;">
                <li>Print de bijgevoegde pakbon PDF</li>
                <li>Start order picking volgens pakbon</li>
              </ul>
            </div>

            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h3>Order Details:</h3>
              <p><strong>Klant:</strong> ${data.customerName}</p>
              <p><strong>Email:</strong> ${data.customerEmail}</p>
              <p><strong>Totaal:</strong> €${data.total.toFixed(2)}</p>
              <p><strong>Items:</strong> ${data.items.reduce((sum, item) => sum + item.quantity, 0)} stuks</p>
              ${data.deliveryAddress ? `<p><strong>Adres:</strong> ${data.deliveryAddress}</p>` : ""}
              ${data.deliveryInstructions ? `<p><strong>Instructies:</strong> ${data.deliveryInstructions}</p>` : ""}
            </div>

            <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
              <div style="background: #f8f9fa; padding: 10px 15px; border-bottom: 1px solid #ddd;">
                <h3 style="margin: 0; color: #ff6b35;">Bestelde Producten</h3>
              </div>
              <div style="padding: 0;">
                ${Object.entries(groupedItems)
                  .map(([category, items]) => {
                    const categoryTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
                    const itemsList = items
                      .map(
                        (item) => `
                          <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}x</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">€${item.price.toFixed(
                              2,
                            )}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">€${(
                              item.price * item.quantity
                            ).toFixed(2)}</td>
                          </tr>
                        `,
                      )
                      .join("")

                    return `
                      <div style="margin-bottom: 15px;">
                        <h4 style="margin: 0; padding: 10px 15px; background: #f0f0f0; color: #333;">${category} - €${categoryTotal.toFixed(
                          2,
                        )}</h4>
                        <table style="width: 100%; border-collapse: collapse;">
                          <thead>
                            <tr style="background: #f8f9fa;">
                              <th style="padding: 8px; text-align: left;">Aantal</th>
                              <th style="padding: 8px; text-align: left;">Product</th>
                              <th style="padding: 8px; text-align: right;">Prijs</th>
                              <th style="padding: 8px; text-align: right;">Subtotaal</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${itemsList}
                          </tbody>
                        </table>
                      </div>
                    `
                  })
                  .join("")}
              </div>
              <div style="background: #f8f9fa; padding: 10px 15px; border-top: 1px solid #ddd; text-align: right;">
                <strong>TOTAAL: €${data.total.toFixed(2)}</strong>
              </div>
            </div>

            <div style="border-top: 1px solid #ddd; padding-top: 15px; color: #666; font-size: 12px;">
              <p>Deze email is automatisch gegenereerd. Zie bijgevoegde pakbon PDF voor order picking.</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `pakbon-${data.orderNumber}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      })

      transporter.close()
      return info
    })()

    // Race between email sending and timeout
    await Promise.race([emailPromise, timeoutPromise])

    console.log(`✅ Admin email sent successfully`)
    return true
  } catch (error) {
    console.error("❌ CRITICAL ERROR sending admin email:", error)
    if (error instanceof Error) {
      console.error("Error details:", error.message)
    }
    return false
  }
}

export async function sendAdminOrderNotification(data: OrderConfirmationData): Promise<boolean> {
  console.log("Admin notification skipped - all info included in main admin email")
  return true
}
