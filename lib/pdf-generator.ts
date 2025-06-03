import { jsPDF } from "jspdf"
import type { CartItem } from "@/lib/cart-context"
import { categorizeProduct, getCategoryName } from "./product-categorizer"

export interface CompletePackingSlipData {
  orderNumber: string
  customerName: string
  customerEmail: string
  deliveryAddress?: string
  deliveryDate: string
  deliveryOption: "delivery" | "pickup"
  deliveryInstructions?: string
  items: CartItem[]
  totalAmount: number
}

// Updated groupItemsByCategory function to use live GUID-based categorization
export async function groupItemsByCategory(items: CartItem[]): Promise<Record<string, CartItem[]>> {
  console.log("Grouping items by category using live API, total items:", items.length)

  // Debug the items to see what data we have
  items.forEach((item, index) => {
    console.log(
      `Item ${index}: ${item.name}, fam2id: ${item.fam2id || "undefined"}, GUID: ${item.guid || "N/A"}, volume: ${item.volume}`,
    )
  })

  // Use live categorization for items that need it
  const itemsWithValidFam2id = await Promise.all(
    items.map(async (item) => {
      // IMPORTANT: Always preserve the exact fam2id if it exists
      if (item.fam2id !== undefined && item.fam2id !== null && item.fam2id !== "") {
        console.log(
          `Using existing fam2id: ${item.name} -> ${item.fam2id} -> category: ${getCategoryName(item.fam2id)}`,
        )
        return item
      }

      // Use live categorization with GUID for missing fam2id
      try {
        console.log(`Live categorizing: ${item.name} with GUID: ${item.guid || "N/A"}`)

        const result = await categorizeProduct(
          item.name,
          item.volume,
          item.arcleunik || item.volume,
          item.fam2id,
          item.guid, // Use GUID for live API lookup
        )

        const fam2id = typeof result === "string" ? result : result.fam2id
        const matchType = typeof result === "string" ? "fallback" : result.matchType

        console.log(
          `Live categorized: ${item.name} -> fam2id: ${fam2id} -> category: ${getCategoryName(fam2id)} (${matchType})`,
        )

        return { ...item, fam2id }
      } catch (error) {
        console.error(`Error in live categorization for ${item.name}:`, error)
        return { ...item, fam2id: "21" } // Fallback to NON-FOOD
      }
    }),
  )

  // Now group by category name
  const grouped = itemsWithValidFam2id.reduce(
    (acc, item) => {
      // Get the category name from the mapping using the item's fam2id
      const categoryName = getCategoryName(item.fam2id || "21")

      console.log(
        `PDF Grouping: ${item.name} -> fam2id: ${item.fam2id} -> category: "${categoryName}" (from fam2idMapping)`,
      )

      // Initialize the category array if it doesn't exist
      if (!acc[categoryName]) {
        acc[categoryName] = []
      }

      // Add the item to its category
      acc[categoryName].push(item)
      return acc
    },
    {} as Record<string, CartItem[]>,
  )

  // Log the final grouping results with fam2id verification
  console.log("PDF Final grouped categories:", Object.keys(grouped))
  Object.entries(grouped).forEach(([category, categoryItems]) => {
    console.log(`PDF Category "${category}" has ${categoryItems.length} items:`)
    categoryItems.forEach((item) => {
      const expectedCategory = getCategoryName(item.fam2id || "21")
      console.log(`  - ${item.name} (fam2id: ${item.fam2id} -> ${expectedCategory})`)
    })
  })

  return grouped
}

// Updated generateCompletePackingSlipPDF function to use live categorization
export async function generateCompletePackingSlipPDF(data: CompletePackingSlipData): Promise<Buffer> {
  try {
    console.log("Starting PDF generation with live categorization for order:", data.orderNumber)

    // Group items by category using live API categorization
    const groupedItems = await groupItemsByCategory(data.items)
    console.log("Grouped items by category using live API:", Object.keys(groupedItems))

    const doc = new jsPDF()

    // Set font
    doc.setFont("helvetica")

    // Header
    doc.setFontSize(16)
    doc.setTextColor(255, 107, 53)
    doc.text("XL GROOTHANDEL B.V.", 20, 20)

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text("Turfschipper 116, 2292 JB Wateringen", 20, 28)

    // Title
    doc.setFontSize(14)
    doc.setTextColor(255, 107, 53)
    doc.text("PAKBON - ORDER PICKING", 20, 40)

    // Order info in one line
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text(`Bestelnummer: ${data.orderNumber}`, 20, 50)
    doc.text(`Datum: ${new Date().toLocaleDateString("nl-NL")}`, 80, 50)
    doc.text(`${data.deliveryOption === "delivery" ? "Bezorgdatum" : "Afhaaldatum"}: ${data.deliveryDate}`, 130, 50)

    // Compact customer info table
    let yPosition = 60
    doc.setFillColor(245, 245, 245)
    doc.rect(20, yPosition, 170, 25, "F")

    doc.setFontSize(10)
    doc.setTextColor(255, 107, 53)
    doc.text("KLANTGEGEVENS", 25, yPosition + 8)

    doc.setFontSize(8)
    doc.setTextColor(0, 0, 0)
    doc.text(`Naam: ${data.customerName}`, 25, yPosition + 15)
    doc.text(`E-mail: ${data.customerEmail}`, 25, yPosition + 21)

    if (data.deliveryAddress) {
      doc.text(`Adres: ${data.deliveryAddress}`, 100, yPosition + 15)
    }
    doc.text(`Type: ${data.deliveryOption === "delivery" ? "Bezorging" : "Afhalen"}`, 100, yPosition + 21)

    yPosition += 30

    // Delivery instructions if present
    if (data.deliveryInstructions) {
      doc.setFillColor(255, 248, 220)
      doc.rect(20, yPosition, 170, 15, "F")
      doc.setDrawColor(255, 193, 7)
      doc.setLineWidth(0.5)
      doc.rect(20, yPosition, 170, 15)

      doc.setFontSize(9)
      doc.setTextColor(133, 77, 14)
      doc.text(`⚠️ ${data.deliveryOption === "delivery" ? "BEZORGINSTRUCTIES" : "OPMERKINGEN"}:`, 25, yPosition + 6)

      doc.setFontSize(8)
      doc.setTextColor(0, 0, 0)
      const maxWidth = 160
      const lines = doc.splitTextToSize(data.deliveryInstructions, maxWidth)
      doc.text(lines, 25, yPosition + 12)

      yPosition += Math.max(15, lines.length * 4 + 8)
    }

    yPosition += 10

    // Main products table header
    doc.setFontSize(12)
    doc.setTextColor(255, 107, 53)
    doc.text("PRODUCTEN OVERZICHT (Live API Categorization)", 20, yPosition)
    yPosition += 10

    // Table headers with adjusted column widths
    doc.setFillColor(240, 240, 240)
    doc.rect(20, yPosition, 170, 10, "F")

    doc.setFontSize(8)
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "bold")
    doc.text("Categorie - Aantal", 25, yPosition + 6)
    doc.text("Product", 85, yPosition + 6)
    doc.text("✓", 180, yPosition + 6)

    // Draw header line
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(20, yPosition + 10, 190, yPosition + 10)
    yPosition += 15

    // Process all items in one table
    let rowCount = 0

    // Define the order of categories for better organization
    const categoryOrder = [
      "BIER",
      "NL BIER",
      "POOLSE BIER FLES",
      "POOLSE BIER BLIK",
      "FRISDRANKEN",
      "WATER",
      "WIJN",
      "STERKE DRANK",
      "MIX DRANK",
      "COCKTAILS",
      "FOOD",
      "NON-FOOD",
      "KOFFIE THEE",
      "HOUTSKOOL",
      "SCHOONMAAK",
      "KRATTEN",
      "OVERIGE PRODUCTEN",
    ]

    // Sort categories according to the defined order
    const sortedCategories = Object.entries(groupedItems).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a[0])
      const indexB = categoryOrder.indexOf(b[0])
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
    })

    sortedCategories.forEach(([categoryName, items]) => {
      // Calculate total quantity for this category
      const categoryQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

      // Category header
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20

        // Repeat headers on new page
        doc.setFillColor(240, 240, 240)
        doc.rect(20, yPosition, 170, 10, "F")
        doc.setFontSize(8)
        doc.setTextColor(0, 0, 0)
        doc.setFont("helvetica", "bold")
        doc.text("Categorie - Aantal", 25, yPosition + 6)
        doc.text("Product", 85, yPosition + 6)
        doc.text("✓", 180, yPosition + 6)
        doc.line(20, yPosition + 10, 190, yPosition + 10)
        yPosition += 15
      }

      // Category header with background
      doc.setFillColor(240, 240, 240)
      doc.rect(20, yPosition - 3, 170, 10, "F")

      // Category name with quantity
      doc.setFontSize(8)
      doc.setTextColor(0, 0, 0)
      doc.setFont("helvetica", "bold")

      // Truncate category name if too long
      const categoryText = `${categoryName} - ${categoryQuantity}st`
      const maxCategoryLength = 25
      const displayCategory =
        categoryText.length > maxCategoryLength
          ? categoryText.substring(0, maxCategoryLength - 3) + "..."
          : categoryText

      doc.text(displayCategory, 25, yPosition + 3)

      yPosition += 10

      // Process items in this category
      items.forEach((item) => {
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20

          // Repeat headers on new page
          doc.setFillColor(240, 240, 240)
          doc.rect(20, yPosition, 170, 10, "F")
          doc.setFontSize(8)
          doc.setTextColor(0, 0, 0)
          doc.setFont("helvetica", "bold")
          doc.text("Categorie - Aantal", 25, yPosition + 6)
          doc.text("Product", 85, yPosition + 6)
          doc.text("✓", 180, yPosition + 6)
          doc.line(20, yPosition + 10, 190, yPosition + 10)
          yPosition += 15

          // Repeat category header
          doc.setFillColor(240, 240, 240)
          doc.rect(20, yPosition - 3, 170, 10, "F")
          doc.text(displayCategory, 25, yPosition + 3)
          yPosition += 10
        }

        // Alternate row background
        if (rowCount % 2 === 0) {
          doc.setFillColor(248, 249, 250)
          doc.rect(20, yPosition - 3, 170, 8, "F")
        }

        // Product name - bold and properly sized
        doc.setFontSize(8)
        doc.setTextColor(0, 0, 0)
        doc.setFont("helvetica", "bold")

        // Format product name with quantity and GUID info
        let productText = `${item.quantity}x ${item.name}`
        if (item.guid) {
          productText += ` [GUID: ${item.guid.substring(0, 8)}...]`
        }

        const maxNameLength = 60
        const displayName =
          productText.length > maxNameLength ? productText.substring(0, maxNameLength - 3) + "..." : productText

        doc.text(displayName, 85, yPosition + 3)

        // Checkbox - thin lines
        doc.setDrawColor(150, 150, 150)
        doc.setLineWidth(0.2)
        doc.rect(180, yPosition - 1, 4, 4)

        yPosition += 8
        rowCount++
      })

      // Category separator line
      doc.setDrawColor(255, 107, 53)
      doc.setLineWidth(0.3)
      doc.line(20, yPosition, 190, yPosition)
      yPosition += 5
    })

    // Category summary table
    yPosition += 10

    // Check if we need a new page for summary
    if (yPosition > 240) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(10)
    doc.setTextColor(255, 107, 53)
    doc.text("CATEGORIE OVERZICHT (Live API Results)", 20, yPosition)
    yPosition += 8

    // Summary table header
    doc.setFillColor(255, 107, 53)
    doc.rect(20, yPosition, 170, 8, "F")

    doc.setFontSize(8)
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.text("Categorie", 25, yPosition + 5)
    doc.text("Aantal Stuks", 120, yPosition + 5)
    doc.text("Compleet ✓", 155, yPosition + 5)

    yPosition += 12

    // Category summaries - use the same sorted order
    sortedCategories.forEach(([categoryName, items], index) => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }

      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(248, 249, 250)
        doc.rect(20, yPosition - 2, 170, 8, "F")
      }

      const categoryItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

      doc.setFontSize(8)
      doc.setTextColor(0, 0, 0)
      doc.setFont("helvetica", "normal")

      // Truncate category name if needed
      const maxCatNameLength = 35
      const displayCatName =
        categoryName.length > maxCatNameLength ? categoryName.substring(0, maxCatNameLength - 3) + "..." : categoryName

      doc.text(displayCatName, 25, yPosition + 3)

      doc.setFont("helvetica", "bold")
      doc.text(`${categoryItemCount} stuks`, 120, yPosition + 3)

      // Category checkbox - thinner
      doc.setDrawColor(100, 100, 100)
      doc.setLineWidth(0.2)
      doc.rect(165, yPosition, 6, 6)

      yPosition += 10
    })

    // Final summary
    yPosition += 10

    // Check if we need a new page for final summary
    if (yPosition > 260) {
      doc.addPage()
      yPosition = 20
    }

    const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0)

    doc.setFillColor(255, 107, 53)
    doc.rect(20, yPosition, 170, 15, "F")

    doc.setFontSize(12)
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.text("TOTAAL BESTELLING", 25, yPosition + 6)
    doc.text(`${totalItems} STUKS`, 25, yPosition + 12)

    // Final approval checkbox - thinner
    doc.setFillColor(255, 255, 255)
    doc.rect(140, yPosition + 3, 8, 8, "F")
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.3)
    doc.rect(140, yPosition + 3, 8, 8)

    doc.setFontSize(9)
    doc.setTextColor(255, 255, 255)
    doc.text("AKKOORD", 155, yPosition + 9)

    // Footer
    yPosition += 25

    // Only add footer if there's space
    if (yPosition < 280) {
      doc.setFontSize(7)
      doc.setTextColor(100, 100, 100)
      doc.setFont("helvetica", "normal")
      doc.text("Deze pakbon is automatisch gegenereerd met live API categorization.", 20, yPosition)
      doc.text(`Gegenereerd op: ${new Date().toLocaleString("nl-NL")}`, 20, yPosition + 6)
    }

    // Convert to buffer
    const pdfOutput = doc.output("arraybuffer")
    const pdfBuffer = Buffer.from(pdfOutput)

    console.log(`PDF generated successfully with live categorization, size: ${pdfBuffer.length} bytes`)
    return pdfBuffer
  } catch (error) {
    console.error("Error generating PDF with live categorization:", error)
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
