// SERVER-ONLY EMAIL SERVICE
// This file should only be imported in API routes

interface EmailData {
  to: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType: string
  }>
}

interface PackingSlipData {
  orderNumber: string
  orderDate: string
  customer: {
    clcleunik: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    address?: string
    city?: string
    postalCode?: string
  }
  items: Array<{
    arcleunik: string
    productName: string
    quantity: number
    price: number
    total: number
    category?: string
    fam2ID?: string
  }>
  totals: {
    subtotal: number
    vat: number
    shipping: number
    total: number
  }
  deliveryInfo: {
    option: string
    date: string
    address: string
    comment?: string
  }
  categorizedItems?: { [category: string]: any[] }
}

interface OrderData {
  items: Array<{
    id: string
    name: string
    arcleunik?: string
    quantity: number
    price: number
    priceExclVAT?: number
    fam2ID?: string
  }>
  totalItems: number
  deliveryOption: string
  deliveryDate: string
  deliveryAddress: string
  deliveryComment?: string
  subtotalExclVAT: number
  totalVatAmount: number
  shippingCost: number
  totalExclVAT: number
  totalInclVAT: number
}

interface CustomerData {
  clcleunik: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
}

// Email configuration - Updated to match your env variables
const SMTP_HOST = process.env.EMAIL_SERVER
const SMTP_PORT = process.env.EMAIL_PORT
const SMTP_USER = process.env.EMAIL_USER
const SMTP_PASS = process.env.EMAIL_PASSWORD
const ADMIN_EMAIL = process.env.EMAIL_TO
const FROM_EMAIL = process.env.EMAIL_FROM
const SMTP_SECURE = process.env.EMAIL_SECURE === "true"

// Helper function to get category name by fam2ID
function getCategoryName(fam2ID: string): string {
  const categoryMap: { [key: string]: string } = {
    "1": "LIMONADEN",
    "3": "POOLSE BIER FLES",
    "4": "POOLSE BIER BLIK",
    "5": "MIX DRANK / NL BIER",
    "6": "FRISDRANKEN",
    "7": "WATER NL",
    "10": "COCKTAILS",
    "13": "WIJN",
    "16": "STERKE DRANK",
    "18": "WATER PL / NON-FOOD",
    "20": "FOOD / HOUTSKOOL",
    "22": "SCHOONMAAK",
  }
  return categoryMap[fam2ID] || `Categorie ${fam2ID}`
}

// Helper function to get category color
function getCategoryColor(fam2ID: string): string {
  const colorMap: { [key: string]: string } = {
    "1": "#4CAF50", // Green - Limonaden
    "3": "#FF9800", // Orange - Poolse Bier Fles
    "4": "#FF5722", // Deep Orange - Poolse Bier Blik
    "5": "#2196F3", // Blue - Mix Drank / NL Bier
    "6": "#00BCD4", // Cyan - Frisdranken
    "7": "#03A9F4", // Light Blue - Water NL
    "10": "#E91E63", // Pink - Cocktails
    "13": "#9C27B0", // Purple - Wijn
    "16": "#F44336", // Red - Sterke Drank
    "18": "#607D8B", // Blue Grey - Water PL / Non-Food
    "20": "#795548", // Brown - Food / Houtskool
    "22": "#9E9E9E", // Grey - Schoonmaak
  }
  return colorMap[fam2ID] || "#757575"
}

// Helper function to categorize items
async function categorizeOrderItems(items: any[]): Promise<{ [category: string]: any[] }> {
  const categorized: { [category: string]: any[] } = {}

  for (const item of items) {
    let fam2ID = item.fam2ID

    // If no fam2ID, try to get it from the product API
    if (!fam2ID && item.arcleunik) {
      try {
        // Dynamic import to get product details
        const { getProductByArcleunik } = await import("@/lib/api")
        const product = await getProductByArcleunik(item.arcleunik)
        fam2ID = product?.fam2ID
      } catch (error) {
        console.warn(`Could not fetch fam2ID for ${item.arcleunik}:`, error)
      }
    }

    const categoryName = getCategoryName(fam2ID || "unknown")

    if (!categorized[categoryName]) {
      categorized[categoryName] = []
    }

    categorized[categoryName].push({
      ...item,
      fam2ID,
      categoryColor: getCategoryColor(fam2ID || "unknown"),
    })
  }

  return categorized
}

export async function generatePackingSlipPDF(packingSlipData: PackingSlipData): Promise<Buffer> {
  try {
    // Dynamic import to prevent client-side bundling
    const { jsPDF } = await import("jspdf")

    const doc = new jsPDF()

    // A4 dimensions and margins
    const pageWidth = 210
    const pageHeight = 297
    const margin = 20
    const contentWidth = pageWidth - margin * 2

    let currentY = margin

    // Helper function to add new page if needed
    const checkPageBreak = (requiredHeight: number) => {
      if (currentY + requiredHeight > pageHeight - 60) {
        // Leave space for footer
        doc.addPage()
        currentY = margin
        return true
      }
      return false
    }

    // Simple black header
    doc.setFillColor(0, 0, 0)
    doc.rect(margin, currentY, contentWidth, 25, "F")

    // White text on black background
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("PAKBON", margin + 5, currentY + 15)

    // Order number and date
    doc.setFontSize(12)
    doc.text(`#${packingSlipData.orderNumber}`, pageWidth - margin - 50, currentY + 10)
    doc.setFontSize(10)
    doc.text(packingSlipData.orderDate, pageWidth - margin - 50, currentY + 20)

    currentY += 35

    // Products section header
    doc.setTextColor(0, 0, 0)
    doc.setFillColor(240, 240, 240)
    doc.rect(margin, currentY, contentWidth, 15, "F")

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("BESTELDE PRODUCTEN", margin + 5, currentY + 10)
    doc.setFontSize(10)
    doc.text(`${packingSlipData.items.length} artikelen`, pageWidth - margin - 30, currentY + 10)

    currentY += 20

    // Group items by category
    const categorizedItems: { [category: string]: any[] } = {}

    for (const item of packingSlipData.items) {
      const category = item.category || "Overige"
      if (!categorizedItems[category]) {
        categorizedItems[category] = []
      }
      categorizedItems[category].push(item)
    }

    // Render each category as a simple table
    for (const [category, items] of Object.entries(categorizedItems)) {
      checkPageBreak(30)

      // Category header - simple black bar
      doc.setFillColor(0, 0, 0)
      doc.rect(margin, currentY, contentWidth, 12, "F")

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text(category.toUpperCase(), margin + 5, currentY + 8)
      doc.text(`${items.length} artikelen`, pageWidth - margin - 30, currentY + 8)

      currentY += 15

      // Table header
      doc.setFillColor(220, 220, 220)
      doc.rect(margin, currentY, contentWidth, 10, "F")

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.text("ARTIKELCODE", margin + 3, currentY + 7)
      doc.text("PRODUCT", margin + 40, currentY + 7)
      doc.text("AANTAL", pageWidth - margin - 25, currentY + 7)

      currentY += 12

      // Items in simple table rows
      items.forEach((item, index) => {
        checkPageBreak(8)

        // Alternating row background
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250)
          doc.rect(margin, currentY - 1, contentWidth, 8, "F")
        }

        doc.setTextColor(0, 0, 0)
        doc.setFontSize(8)
        doc.setFont("helvetica", "normal")

        // Article code
        doc.setFont("helvetica", "bold")
        doc.text(item.arcleunik || "N/A", margin + 3, currentY + 5)

        // Product name (truncated if too long)
        doc.setFont("helvetica", "normal")
        const maxProductLength = 50
        const productName = item.productName || "Unknown Product"
        const displayName =
          productName.length > maxProductLength ? productName.substring(0, maxProductLength) + "..." : productName
        doc.text(displayName, margin + 40, currentY + 5)

        // Quantity
        doc.setFont("helvetica", "bold")
        doc.text(`${item.quantity}x`, pageWidth - margin - 20, currentY + 5)

        currentY += 8
      })

      currentY += 5 // Space between categories
    }

    // Footer with customer and delivery info (small text at bottom)
    const footerY = pageHeight - 50

    // Customer info (left side)
    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100)

    doc.text("KLANTGEGEVENS:", margin, footerY)
    doc.text(
      `${packingSlipData.customer.firstName || ""} ${packingSlipData.customer.lastName || ""}`.trim(),
      margin,
      footerY + 5,
    )
    doc.text(`${packingSlipData.customer.email || ""}`, margin, footerY + 10)
    if (packingSlipData.customer.phone) {
      doc.text(`Tel: ${packingSlipData.customer.phone}`, margin, footerY + 15)
    }
    doc.text(`Klant ID: ${packingSlipData.customer.clcleunik}`, margin, footerY + 20)

    // Delivery info (right side)
    doc.text("LEVERINGSGEGEVENS:", margin + 90, footerY)
    const deliveryType = packingSlipData.deliveryInfo.option === "1" ? "Bezorging" : "Afhalen"
    doc.text(deliveryType, margin + 90, footerY + 5)
    doc.text(`Datum: ${packingSlipData.deliveryInfo.date}`, margin + 90, footerY + 10)

    // Split long addresses
    const address = packingSlipData.deliveryInfo.address
    if (address.length > 40) {
      const words = address.split(" ")
      let line1 = ""
      let line2 = ""
      let currentLine = 1

      for (const word of words) {
        if (currentLine === 1 && (line1 + word).length <= 40) {
          line1 += (line1 ? " " : "") + word
        } else {
          currentLine = 2
          line2 += (line2 ? " " : "") + word
        }
      }

      doc.text(`Adres: ${line1}`, margin + 90, footerY + 15)
      if (line2) {
        doc.text(`${line2}`, margin + 90, footerY + 20)
      }
    } else {
      doc.text(`Adres: ${address}`, margin + 90, footerY + 15)
    }

    // Company info at very bottom
    doc.setFontSize(6)
    doc.setTextColor(150, 150, 150)
    doc.text("XL Groothandel B.V. | Turfschipper 116, 2292 JB Wateringen", margin, pageHeight - 15)
    doc.text(`Gegenereerd: ${new Date().toLocaleString("nl-NL")}`, margin, pageHeight - 10)

    // Add page numbers if multiple pages
    const totalPages = doc.getNumberOfPages()
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setTextColor(100, 100, 100)
        doc.setFontSize(8)
        doc.text(`Pagina ${i} van ${totalPages}`, pageWidth - margin - 20, pageHeight - 5)
      }
    }

    return Buffer.from(doc.output("arraybuffer"))
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error("Failed to generate packing slip PDF")
  }
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
    : [102, 126, 234] // Default blue
}

export async function sendCustomerConfirmationEmail(
  customerData: CustomerData,
  orderData: OrderData,
  orderNumber: string,
): Promise<void> {
  // Categorize items for better display
  const categorizedItems = await categorizeOrderItems(orderData.items)

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Orderbevestiging - ${orderNumber}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #2c3e50; 
                background-color: #f8f9fa;
            }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
                border-radius: 10px 10px 0 0;
            }
            .header h1 { font-size: 28px; margin-bottom: 10px; }
            .header p { font-size: 16px; opacity: 0.9; }
            .content { padding: 30px 20px; }
            .greeting { font-size: 18px; margin-bottom: 20px; color: #2c3e50; }
            .order-summary { 
                background: #f8f9fa; 
                border-left: 4px solid #667eea; 
                padding: 20px; 
                margin: 20px 0; 
                border-radius: 5px;
            }
            .order-summary h3 { color: #2c3e50; margin-bottom: 15px; }
            .order-detail { margin: 8px 0; }
            .order-detail strong { color: #34495e; }
            .category-section { margin: 25px 0; }
            .category-header { 
                padding: 12px 15px; 
                border-radius: 8px; 
                color: white; 
                font-weight: bold; 
                margin-bottom: 10px;
                font-size: 16px;
            }
            .items-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 10px 0 20px 0; 
                border-radius: 8px; 
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .items-table th { 
                background: #34495e; 
                color: white; 
                padding: 12px 8px; 
                text-align: left; 
                font-weight: 600;
            }
            .items-table td { 
                padding: 12px 8px; 
                border-bottom: 1px solid #ecf0f1; 
                background: white;
            }
            .items-table tr:nth-child(even) td { background: #f8f9fa; }
            .items-table tr:hover td { background: #e8f4fd; }
            .total-section { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0;
            }
            .total-row { 
                display: flex; 
                justify-content: space-between; 
                margin: 8px 0; 
                font-size: 16px;
            }
            .total-final { 
                font-size: 20px; 
                font-weight: bold; 
                border-top: 2px solid rgba(255,255,255,0.3); 
                padding-top: 10px; 
                margin-top: 10px;
            }
            .footer { 
                background: #2c3e50; 
                color: white; 
                padding: 20px; 
                text-align: center; 
                border-radius: 0 0 10px 10px;
            }
            .status-badge { 
                display: inline-block; 
                background: #27ae60; 
                color: white; 
                padding: 6px 12px; 
                border-radius: 20px; 
                font-size: 14px; 
                font-weight: bold;
            }
            .delivery-info { 
                background: #e8f5e8; 
                border: 1px solid #27ae60; 
                padding: 15px; 
                border-radius: 8px; 
                margin: 15px 0;
            }
            .delivery-info h4 { color: #27ae60; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Bedankt voor uw bestelling!</h1>
                <p>Uw bestelling is succesvol ontvangen en wordt verwerkt</p>
                <div class="status-badge">✅ Bevestigd</div>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Beste ${customerData.firstName} ${customerData.lastName},
                </div>
                
                <p>Hartelijk dank voor uw bestelling bij XL Groothandel! Wij hebben uw bestelling succesvol ontvangen en bevestigen deze hierbij.</p>
                
                <div class="order-summary">
                    <h3>📋 Ordergegevens</h3>
                    <div class="order-detail"><strong>Bestelnummer:</strong> ${orderNumber}</div>
                    <div class="order-detail"><strong>Besteldatum:</strong> ${new Date().toLocaleDateString("nl-NL")}</div>
                    <div class="order-detail"><strong>Aantal artikelen:</strong> ${orderData.totalItems}</div>
                </div>
                
                <div class="delivery-info">
                    <h4>🚚 Leveringsinformatie</h4>
                    <div class="order-detail"><strong>Leveringsoptie:</strong> ${orderData.deliveryOption === "1" ? "🚚 Bezorging" : "🏪 Afhalen"}</div>
                    <div class="order-detail"><strong>Gewenste leveringsdatum:</strong> ${orderData.deliveryDate}</div>
                    <div class="order-detail"><strong>Leveringsadres:</strong> ${orderData.deliveryAddress}</div>
                    ${orderData.deliveryComment ? `<div class="order-detail"><strong>Opmerking:</strong> ${orderData.deliveryComment}</div>` : ""}
                </div>
                
                <h3>📦 Bestelde producten per categorie</h3>
                
                ${Object.entries(categorizedItems)
                  .map(
                    ([category, items]) => `
                    <div class="category-section">
                        <div class="category-header" style="background-color: ${items[0]?.categoryColor || "#667eea"};">
                            ${category} (${items.length} ${items.length === 1 ? "artikel" : "artikelen"})
                        </div>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Artikelcode</th>
                                    <th>Aantal</th>
                                    <th>Prijs</th>
                                    <th>Totaal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${items
                                  .map(
                                    (item) => `
                                    <tr>
                                        <td><strong>${item.name}</strong></td>
                                        <td>${item.arcleunik || item.id}</td>
                                        <td>${item.quantity}x</td>
                                        <td>€${item.price.toFixed(2)}</td>
                                        <td><strong>€${(item.quantity * item.price).toFixed(2)}</strong></td>
                                    </tr>
                                `,
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </div>
                `,
                  )
                  .join("")}
                
                <div class="total-section">
                    <h3>💰 Financieel overzicht</h3>
                    <div class="total-row">
                        <span>Subtotaal (excl. BTW):</span>
                        <span>€${orderData.subtotalExclVAT.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>BTW (21%):</span>
                        <span>€${orderData.totalVatAmount.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Verzendkosten:</span>
                        <span>€${orderData.shippingCost.toFixed(2)}</span>
                    </div>
                    <div class="total-row total-final">
                        <span>Totaal (incl. BTW):</span>
                        <span>€${orderData.totalInclVAT.toFixed(2)}</span>
                    </div>
                </div>
                
                <p>Wij zullen uw bestelling zo spoedig mogelijk verwerken en u op de hoogte houden van de status. Bij vragen kunt u contact met ons opnemen.</p>
            </div>
            
            <div class="footer">
                <p><strong>Met vriendelijke groet,</strong></p>
                <p>Het XL Groothandel Team</p>
                <p>📧 info@xlgroothandelbv.nl | 📞 06184959494</p>
            </div>
        </div>
    </body>
    </html>
  `

  await sendEmail({
    to: customerData.email,
    subject: `✅ Orderbevestiging - Bestelnummer ${orderNumber} - €${orderData.totalInclVAT.toFixed(2)}`,
    html: emailHtml,
  })
}

export async function sendAdminNotificationEmail(
  customerData: CustomerData,
  orderData: OrderData,
  orderNumber: string,
  packingSlipPDF: Buffer,
): Promise<void> {
  // Categorize items for better display
  const categorizedItems = await categorizeOrderItems(orderData.items)

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>🚨 Nieuwe Bestelling - ${orderNumber}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #2c3e50; 
                background-color: #f8f9fa;
            }
            .container { max-width: 700px; margin: 0 auto; background: white; }
            .header { 
                background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); 
                color: white; 
                padding: 25px 20px; 
                text-align: center; 
                border-radius: 10px 10px 0 0;
            }
            .header h1 { font-size: 26px; margin-bottom: 10px; }
            .urgent-badge { 
                background: #f39c12; 
                color: white; 
                padding: 8px 16px; 
                border-radius: 25px; 
                font-weight: bold; 
                display: inline-block; 
                margin-top: 10px;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            .content { padding: 25px 20px; }
            .alert-box { 
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); 
                color: white; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0; 
                text-align: center;
            }
            .alert-box h3 { margin-bottom: 10px; }
            .info-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 20px; 
                margin: 20px 0;
            }
            .info-card { 
                background: #f8f9fa; 
                border-left: 4px solid #3498db; 
                padding: 20px; 
                border-radius: 5px;
            }
            .info-card h3 { color: #2c3e50; margin-bottom: 15px; }
            .info-detail { margin: 8px 0; }
            .info-detail strong { color: #34495e; }
            .category-section { margin: 20px 0; }
            .category-header { 
                padding: 12px 15px; 
                border-radius: 8px; 
                color: white; 
                font-weight: bold; 
                margin-bottom: 10px;
                font-size: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .items-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 10px 0; 
                border-radius: 8px; 
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .items-table th { 
                background: #2c3e50; 
                color: white; 
                padding: 12px 8px; 
                text-align: left; 
                font-weight: 600;
            }
            .items-table td { 
                padding: 12px 8px; 
                border-bottom: 1px solid #ecf0f1; 
                background: white;
            }
            .items-table tr:nth-child(even) td { background: #f8f9fa; }
            .total-section { 
                background: linear-gradient(135deg, #27ae60 0%, #229954 100%); 
                color: white; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0;
            }
            .total-row { 
                display: flex; 
                justify-content: space-between; 
                margin: 8px 0; 
                font-size: 16px;
            }
            .total-final { 
                font-size: 22px; 
                font-weight: bold; 
                border-top: 2px solid rgba(255,255,255,0.3); 
                padding-top: 10px; 
                margin-top: 10px;
            }
            .action-steps { 
                background: #fff3cd; 
                border: 1px solid #ffeaa7; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0;
            }
            .action-steps h3 { color: #856404; margin-bottom: 15px; }
            .action-steps ol { margin-left: 20px; }
            .action-steps li { margin: 8px 0; color: #856404; }
            .footer { 
                background: #2c3e50; 
                color: white; 
                padding: 20px; 
                text-align: center; 
                border-radius: 0 0 10px 10px;
            }
            .priority-high { border-left-color: #e74c3c !important; }
            .priority-medium { border-left-color: #f39c12 !important; }
            .priority-low { border-left-color: #27ae60 !important; }
            @media (max-width: 600px) {
                .info-grid { grid-template-columns: 1fr; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚨 NIEUWE BESTELLING ONTVANGEN</h1>
                <p>Bestelnummer: ${orderNumber}</p>
                <div class="urgent-badge">⚡ ACTIE VEREIST</div>
            </div>
            
            <div class="content">
                <div class="alert-box">
                    <h3>🔔 Nieuwe bestelling ter waarde van €${orderData.totalInclVAT.toFixed(2)}</h3>
                    <p>Er is een nieuwe bestelling binnengekomen die onmiddellijk verwerkt moet worden.</p>
                </div>
                
                <div class="info-grid">
                    <div class="info-card priority-high">
                        <h3>📋 Orderinformatie</h3>
                        <div class="info-detail"><strong>Bestelnummer:</strong> ${orderNumber}</div>
                        <div class="info-detail"><strong>Besteldatum:</strong> ${new Date().toLocaleDateString("nl-NL")} ${new Date().toLocaleTimeString("nl-NL")}</div>
                        <div class="info-detail"><strong>Totaal aantal items:</strong> ${orderData.totalItems}</div>
                        <div class="info-detail"><strong>Totaalwaarde:</strong> <span style="color: #e74c3c; font-weight: bold;">€${orderData.totalInclVAT.toFixed(2)}</span></div>
                    </div>
                    
                    <div class="info-card priority-medium">
                        <h3>👤 Klantgegevens</h3>
                        <div class="info-detail"><strong>Naam:</strong> ${customerData.firstName} ${customerData.lastName}</div>
                        <div class="info-detail"><strong>Email:</strong> ${customerData.email}</div>
                        <div class="info-detail"><strong>Klant ID:</strong> ${customerData.clcleunik}</div>
                        ${customerData.phone ? `<div class="info-detail"><strong>Telefoon:</strong> ${customerData.phone}</div>` : ""}
                    </div>
                </div>
                
                <div class="info-card priority-low">
                    <h3>🚚 Leveringsgegevens</h3>
                    <div class="info-detail"><strong>Leveringsoptie:</strong> ${orderData.deliveryOption === "1" ? "🚚 Bezorging" : "🏪 Afhalen"}</div>
                    <div class="info-detail"><strong>Gewenste leveringsdatum:</strong> ${orderData.deliveryDate}</div>
                    <div class="info-detail"><strong>Leveringsadres:</strong> ${orderData.deliveryAddress}</div>
                    ${orderData.deliveryComment ? `<div class="info-detail"><strong>Opmerking:</strong> ${orderData.deliveryComment}</div>` : ""}
                </div>
                
                <h3>📦 Bestelde producten per categorie</h3>
                
                ${Object.entries(categorizedItems)
                  .map(([category, items]) => {
                    const categoryTotal = items.reduce(
                      (sum, item) => sum + item.quantity * (item.priceExclVAT || item.price),
                      0,
                    )
                    return `
                    <div class="category-section">
                        <div class="category-header" style="background-color: ${items[0]?.categoryColor || "#667eea"};">
                            <span>${category}</span>
                            <span>${items.length} artikelen - €${categoryTotal.toFixed(2)}</span>
                        </div>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Artikelcode</th>
                                    <th>Product</th>
                                    <th>Aantal</th>
                                    <th>Prijs (excl. BTW)</th>
                                    <th>Totaal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${items
                                  .map(
                                    (item) => `
                                    <tr>
                                        <td><strong>${item.arcleunik || item.id}</strong></td>
                                        <td>${item.name}</td>
                                        <td>${item.quantity}x</td>
                                        <td>€${(item.priceExclVAT || item.price).toFixed(2)}</td>
                                        <td><strong>€${(item.quantity * (item.priceExclVAT || item.price)).toFixed(2)}</strong></td>
                                    </tr>
                                `,
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </div>
                  `
                  })
                  .join("")}
                
                <div class="total-section">
                    <h3>💰 Financiële samenvatting</h3>
                    <div class="total-row">
                        <span>Subtotaal (excl. BTW):</span>
                        <span>€${orderData.subtotalExclVAT.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>BTW (21%):</span>
                        <span>€${orderData.totalVatAmount.toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Verzendkosten:</span>
                        <span>€${orderData.shippingCost.toFixed(2)}</span>
                    </div>
                    <div class="total-row total-final">
                        <span>TOTAAL (incl. BTW):</span>
                        <span>€${orderData.totalInclVAT.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="action-steps">
                    <h3>📋 Volgende stappen - Actieplan</h3>
                    <ol>
                        <li><strong>Controleer de pakbon</strong> (bijgevoegd als PDF)</li>
                        <li><strong>Controleer voorraad</strong> voor alle artikelen</li>
                        <li><strong>Bereid de bestelling voor</strong> volgens pakbon</li>
                        <li><strong>Plan de levering/afhaling</strong> voor ${orderData.deliveryDate}</li>
                        <li><strong>Informeer de klant</strong> bij eventuele wijzigingen of vertragingen</li>
                        <li><strong>Update orderstatus</strong> in het systeem</li>
                    </ol>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>XL Groothandel - Orderverwerking</strong></p>
                <p>Deze email is automatisch gegenereerd op ${new Date().toLocaleString("nl-NL")}</p>
            </div>
        </div>
    </body>
    </html>
  `

  await sendEmail({
    to: ADMIN_EMAIL || "admin@megawin.nl",
    subject: `🚨 NIEUWE BESTELLING - ${orderNumber} - €${orderData.totalInclVAT.toFixed(2)} - ${orderData.totalItems} artikelen`,
    html: emailHtml,
    attachments: [
      {
        filename: `pakbon-${orderNumber}.pdf`,
        content: packingSlipPDF,
        contentType: "application/pdf",
      },
    ],
  })
}

async function sendEmail(emailData: EmailData): Promise<void> {
  try {
    // Dynamic import to prevent client-side bundling
    const nodemailer = await import("nodemailer")

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE, // Use the EMAIL_SECURE setting
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })

    const mailOptions = {
      from: FROM_EMAIL,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      attachments: emailData.attachments,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Email sent to ${emailData.to}`)
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}
