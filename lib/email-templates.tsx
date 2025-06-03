import type { CartItem } from "@/lib/cart-context"
import { categorizeProduct, getCategoryName } from "./product-categorizer"

// Updated category mapping based on fam2id - with clearer distinctions
export const categoryMapping: Record<string, string> = {
  "1": "BIER",
  "2": "NL BIER",
  "3": "POOLSE BIER FLES",
  "4": "POOLSE BIER BLIK",
  "5": "MIX DRANK",
  "6": "FRISDRANKEN",
  "7": "WATER",
  "10": "COCKTAILS",
  "13": "WIJN",
  "16": "STERKE DRANK",
  "18": "KOFFIE THEE",
  "19": "HOUTSKOOL",
  "20": "FOOD",
  "21": "NON-FOOD",
  "22": "SCHOONMAAK",
  "23": "KRATTEN",
}

export interface OrderConfirmationData {
  orderNumber: string
  customerName: string
  customerEmail: string
  orderDate: string
  deliveryDate: string
  deliveryOption: "delivery" | "pickup"
  deliveryAddress?: string
  items: CartItem[]
  subtotal: number
  total: number
  deliveryInstructions?: string
}

// Updated function to use live GUID-based categorization
export async function generateOrderConfirmationHTML(data: OrderConfirmationData): Promise<string> {
  console.log("Starting email HTML generation with items:", data.items.length)
  console.log("Category Mapping in email template:", categoryMapping)

  // Use live categorization for items that need it
  const itemsWithCategories = await Promise.all(
    data.items.map(async (item) => {
      // IMPORTANT: Only categorize if fam2id is completely missing
      if (item.fam2id === undefined || item.fam2id === null || item.fam2id === "") {
        console.log(`Email generation: Live categorizing "${item.name}" with GUID: ${item.guid || "N/A"}`)

        try {
          const result = await categorizeProduct(
            item.name,
            item.volume,
            item.arcleunik || item.volume,
            item.fam2id,
            item.guid, // Use GUID for live API lookup
          )

          const fam2id = typeof result === "string" ? result : result.fam2id
          const matchType = typeof result === "string" ? "fallback" : result.matchType

          console.log(`Email generation: Live categorized "${item.name}" -> fam2id: ${fam2id} (${matchType})`)
          return { ...item, fam2id }
        } catch (error) {
          console.error(`Email generation: Error categorizing "${item.name}":`, error)
          return { ...item, fam2id: "21" } // Fallback to NON-FOOD
        }
      }

      console.log(`Email generation: Using existing fam2id for "${item.name}" -> fam2id: ${item.fam2id}`)
      return item
    }),
  )

  // Log each item with its category for debugging
  itemsWithCategories.forEach((item, index) => {
    console.log(
      `Email item ${index}: ${item.name}, fam2id: ${item.fam2id}, category: ${categoryMapping[item.fam2id || "21"] || "OVERIGE PRODUCTEN"}`,
    )
  })

  // Group items by fam2id with better logging
  const groupedItems = itemsWithCategories.reduce(
    (acc, item) => {
      // Make sure fam2id is not undefined before using it as an index
      const fam2id = item.fam2id || "21" // Default to NON-FOOD if missing
      const categoryName = getCategoryName(fam2id)

      console.log(
        `EMAIL categorization: Item "${item.name}" with fam2id "${fam2id}" -> category "${categoryName}" (from fam2idMapping)`,
      )

      if (!acc[categoryName]) {
        acc[categoryName] = []
      }
      acc[categoryName].push(item)
      return acc
    },
    {} as Record<string, CartItem[]>,
  )

  console.log(`EMAIL categories found: ${Object.keys(groupedItems).join(", ")}`)

  // Log the final grouping for debugging with fam2id verification
  Object.entries(groupedItems).forEach(([category, items]) => {
    console.log(`EMAIL category "${category}" has ${items.length} items:`)
    items.forEach((item) => {
      const expectedCategory = getCategoryName(item.fam2id || "21")
      console.log(`  - ${item.name} (fam2id: ${item.fam2id} -> ${expectedCategory})`)
    })
  })

  // Log the final grouping for debugging
  Object.entries(groupedItems).forEach(([category, items]) => {
    console.log(`Email category "${category}" has ${items.length} items:`)
    items.forEach((item) => console.log(`  - ${item.name} (fam2id: ${item.fam2id})`))
  })

  const categorySections = Object.entries(groupedItems)
    .map(([categoryName, items]) => {
      const categoryTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      const itemRows = items
        .map(
          (item) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 8px; text-align: left;">
            <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">${item.name}</div>
            <div style="font-size: 12px; color: #6b7280;">
              Art.nr: ${item.arcleunik || "N/A"} | SKU: #${item.volume}
              ${item.guid ? ` | GUID: ${item.guid.substring(0, 8)}...` : ""}
            </div>
          </td>
          <td style="padding: 12px 8px; text-align: center; color: #374151;">
            ${item.quantity}x
          </td>
          <td style="padding: 12px 8px; text-align: right; color: #374151;">
            €${item.price.toFixed(2)}
          </td>
          <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #059669;">
            €${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `,
        )
        .join("")

      return `
        <div style="margin-bottom: 32px;">
          <h3 style="background: linear-gradient(135deg, #ff6b35 0%, #f56500 100%); color: white; padding: 12px 16px; margin: 0 0 16px 0; border-radius: 8px 8px 0 0; font-size: 16px; font-weight: 700; text-transform: uppercase;">
            ${categoryName}
          </h3>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 0 0 8px 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 2px solid #e5e7eb;">
                <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151;">Product</th>
                <th style="padding: 12px 8px; text-align: center; font-weight: 600; color: #374151;">Aantal</th>
                <th style="padding: 12px 8px; text-align: right; font-weight: 600; color: #374151;">Prijs</th>
                <th style="padding: 12px 8px; text-align: right; font-weight: 600; color: #374151;">Totaal</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
              <tr style="background: #f0fdf4; border-top: 2px solid #059669;">
                <td colspan="3" style="padding: 12px 8px; font-weight: 700; color: #059669; text-align: right;">
                  ${categoryName} Subtotaal:
                </td>
                <td style="padding: 12px 8px; font-weight: 700; color: #059669; text-align: right;">
                  €${categoryTotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    })
    .join("")

  return `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Orderbevestiging - ${data.orderNumber}</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; }
          .content { padding: 16px !important; }
          table { font-size: 14px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; line-height: 1.6;">
      <div class="container" style="max-width: 800px; margin: 0 auto; background: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ff6b35 0%, #f56500 100%); color: white; padding: 32px 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">XL Groothandel B.V.</h1>
          <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Bedankt voor uw bestelling!</p>
        </div>

        <!-- Order Info -->
        <div class="content" style="padding: 32px 24px; background: #f8fafc; border-bottom: 1px solid #e5e7eb;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px;">
            <div>
              <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Bestelnummer</h3>
              <p style="margin: 0; font-size: 18px; font-weight: 700; color: #ff6b35;">${data.orderNumber}</p>
            </div>
            <div>
              <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Besteldatum</h3>
              <p style="margin: 0; font-size: 16px; color: #374151;">${data.orderDate}</p>
            </div>
            <div>
              <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${data.deliveryOption === "delivery" ? "Bezorgdatum" : "Afhaaldatum"}</h3>
              <p style="margin: 0; font-size: 16px; color: #059669; font-weight: 600;">${data.deliveryDate}</p>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="content" style="padding: 24px; background: white;">
          <h2 style="margin: 0 0 16px 0; color: #374151; font-size: 20px; font-weight: 700;">Klantgegevens</h2>
          <p style="margin: 0 0 8px 0; color: #374151;"><strong>Naam:</strong> ${data.customerName}</p>
          <p style="margin: 0 0 8px 0; color: #374151;"><strong>E-mail:</strong> ${data.customerEmail}</p>
          ${data.deliveryAddress ? `<p style="margin: 0; color: #374151;"><strong>${data.deliveryOption === "delivery" ? "Bezorgadres" : "Afhaaladres"}:</strong> ${data.deliveryAddress}</p>` : ""}
          ${data.deliveryInstructions ? `<p style="margin: 8px 0 0 0; color: #6b7280; background: #f0fdf4; padding: 8px; border-radius: 4px; border-left: 4px solid #059669;"><strong>${data.deliveryOption === "delivery" ? "Bezorginstructies" : "Opmerkingen"}:</strong> ${data.deliveryInstructions}</p>` : ""}
        </div>

        <!-- Products by Category -->
        <div class="content" style="padding: 24px; background: #f9fafb;">
          <h2 style="margin: 0 0 24px 0; color: #374151; font-size: 24px; font-weight: 700; text-align: center;">Uw Bestelling</h2>
          ${categorySections}
        </div>

        <!-- Order Total -->
        <div class="content" style="padding: 24px; background: white; border-top: 3px solid #ff6b35;">
          <div style="max-width: 400px; margin-left: auto;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
              <span style="color: #374151; font-weight: 600;">Subtotaal:</span>
              <span style="color: #374151; font-weight: 600;">€${data.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
              <span style="color: #374151; font-weight: 600;">Verzendkosten:</span>
              <span style="color: #059669; font-weight: 600;">Gratis</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 16px 0; border-top: 2px solid #ff6b35;">
              <span style="color: #374151; font-size: 20px; font-weight: 700;">Totaal:</span>
              <span style="color: #ff6b35; font-size: 20px; font-weight: 700;">€${data.total.toFixed(2)}</span>
            </div>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280; text-align: right;">Prijzen zijn inclusief BTW</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="content" style="padding: 32px 24px; background: #374151; color: white; text-align: center;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700;">XL Groothandel B.V.</h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; opacity: 0.8;">Turfschipper 116, 2292 JB Wateringen</p>
          <p style="margin: 0 0 16px 0; font-size: 14px; opacity: 0.8;">Voor vragen over uw bestelling, neem contact met ons op.</p>
          <div style="border-top: 1px solid #4b5563; padding-top: 16px; margin-top: 16px;">
            <p style="margin: 0; font-size: 12px; opacity: 0.7;">
              Deze e-mail is automatisch gegenereerd. Bewaar deze e-mail als bewijs van uw bestelling.
            </p>
          </div>
        </div>

      </div>
    </body>
    </html>
  `
}

export async function generateOrderConfirmationText(data: OrderConfirmationData): Promise<string> {
  // Use live categorization for items that need it
  const itemsWithCategories = await Promise.all(
    data.items.map(async (item) => {
      if (item.fam2id === undefined || item.fam2id === null || item.fam2id === "") {
        try {
          const result = await categorizeProduct(
            item.name,
            item.volume,
            item.arcleunik || item.volume,
            item.fam2id,
            item.guid,
          )
          const fam2id = typeof result === "string" ? result : result.fam2id
          return { ...item, fam2id }
        } catch (error) {
          return { ...item, fam2id: "21" }
        }
      }
      return item
    }),
  )

  // Group items by fam2id
  const groupedItems = itemsWithCategories.reduce(
    (acc, item) => {
      const fam2id = item.fam2id || "21"
      const categoryName = categoryMapping[fam2id] || "OVERIGE PRODUCTEN"

      if (!acc[categoryName]) {
        acc[categoryName] = []
      }
      acc[categoryName].push(item)
      return acc
    },
    {} as Record<string, CartItem[]>,
  )

  let text = `
ORDERBEVESTIGING - XL GROOTHANDEL B.V.
=====================================

Bedankt voor uw bestelling!

BESTELLING DETAILS:
------------------
Bestelnummer: ${data.orderNumber}
Besteldatum: ${data.orderDate}
${data.deliveryOption === "delivery" ? "Bezorgdatum" : "Afhaaldatum"}: ${data.deliveryDate}

KLANTGEGEVENS:
-------------
Naam: ${data.customerName}
E-mail: ${data.customerEmail}
${data.deliveryAddress ? `${data.deliveryOption === "delivery" ? "Bezorgadres" : "Afhaaladres"}: ${data.deliveryAddress}` : ""}
${data.deliveryInstructions ? `${data.deliveryOption === "delivery" ? "Bezorginstructies" : "Opmerkingen"}: ${data.deliveryInstructions}` : ""}

BESTELDE PRODUCTEN:
------------------
`

  Object.entries(groupedItems).forEach(([categoryName, items]) => {
    const categoryTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    text += `\n${categoryName}:\n`
    text += `${"-".repeat(categoryName.length + 1)}\n`

    items.forEach((item) => {
      text += `• ${item.name}\n`
      text += `  Art.nr: ${item.arcleunik || "N/A"} | SKU: #${item.volume}\n`
      if (item.guid) {
        text += `  GUID: ${item.guid}\n`
      }
      text += `  ${item.quantity}x €${item.price.toFixed(2)} = €${(item.price * item.quantity).toFixed(2)}\n\n`
    })

    text += `${categoryName} Subtotaal: €${categoryTotal.toFixed(2)}\n\n`
  })

  text += `
TOTAAL OVERZICHT:
----------------
Subtotaal: €${data.subtotal.toFixed(2)}
Verzendkosten: Gratis
TOTAAL: €${data.total.toFixed(2)} (incl. BTW)

--
XL Groothandel B.V.
Turfschipper 116, 2292 JB Wateringen

Deze e-mail is automatisch gegenereerd.
Bewaar deze e-mail als bewijs van uw bestelling.
`

  return text
}
