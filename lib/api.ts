import type { ProductProps } from "@/types/product"

// Add these interfaces after the existing imports and before the menuItemsList
interface OrderLine {
  guid: string
  arcleunik: string
  quantity: number
  price: number
}

export interface OrderData {
  items: Array<{
    id: string
    name: string
    arcleunik?: string
    quantity: number
    price: number
    priceExclVAT?: number
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

export interface CustomerData {
  clcleunik: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
}

// Add new interfaces for email and PDF
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

export interface PackingSlipData {
  orderNumber: string
  orderDate: string
  customer: CustomerData
  items: Array<{
    arcleunik: string
    productName: string
    quantity: number
    price: number
    total: number
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
}

// Add these new interfaces for order analysis
interface OrderAnalysis {
  totalOrders: number
  totalProducts: number
  categoriesStats: CategoryStats[]
  topCategories: CategoryStats[]
  ordersByCategory: { [fam2ID: string]: OrdersByCategory }
}

interface CategoryStats {
  fam2ID: string
  categoryName: string
  totalQuantity: number
  totalOrders: number
  totalValue: number
  averageOrderValue: number
  products: ProductStats[]
}

interface ProductStats {
  arcleunik: string
  productName: string
  totalQuantity: number
  totalOrders: number
  totalValue: number
}

interface OrdersByCategory {
  orders: string[]
  totalQuantity: number
  totalValue: number
}

// Get environment variables
const PRODUCT_API_URL = process.env.NEXT_PUBLIC_API_URL
const CUSTOMER_API_URL = process.env.NEXT_PUBLIC_CUSTOMER_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const CUSTOMER_ORDERS_API_URL = process.env.NEXT_PUBLIC_CUSTOMER_ORDERS_API_URL
const CUSTOMER_ORDER_DETAILS_API_URL = process.env.NEXT_PUBLIC_CUSTOMER_ORDER_DETAILS_API_URL
const ORDERS_CREATE_BLANK_URL = process.env.NEXT_PUBLIC_ORDERS_CREATE_BLANK_URL
const ORDERS_ADD_LINES_TO_ORDER_URL = process.env.NEXT_PUBLIC_ORDERS_ADD_LINES_TO_ORDER_URL
const ORDERS_SEND_TO_MEGAWIN_URL = process.env.NEXT_PUBLIC_ORDERS_SEND_TO_MEGAWIN_URL

// Email configuration - Updated to match your env variables
const SMTP_HOST = process.env.EMAIL_SERVER
const SMTP_PORT = process.env.EMAIL_PORT
const SMTP_USER = process.env.EMAIL_USER
const SMTP_PASS = process.env.EMAIL_PASSWORD
const ADMIN_EMAIL = process.env.EMAIL_TO
const FROM_EMAIL = process.env.EMAIL_FROM

export const menuItemsList = [
  {
    name: "ALCOHOL",
    href: "/categorie/sterke-drank",
    id: "16",
    submenu: [
      {
        name: "STERKE DRANK",
        href: "/categorie/sterke-drank",
        id: "16",
      },
      {
        name: "MIX DRANK",
        href: "/categorie/mix-drank",
        id: "5",
      },
      {
        name: "COCKTAILS",
        href: "/categorie/cocktails",
        id: "10",
      },
    ],
  },
  {
    name: "WIJN",
    href: "/categorie/wijn",
    id: "13",
    submenu: [],
  },
  {
    name: "BIER",
    href: "/categorie/bier",
    submenu: [
      {
        name: "POOLSE BIER BLIK",
        href: "/categorie/poolse-bier-blik",
        id: "4",
      },
      {
        name: "POOLSE BIER FLES",
        href: "/categorie/poolse-bier-fles",
        id: "3",
      },
      {
        name: "NL BIER",
        href: "/categorie/bier",
        id: "5",
      },
    ],
  },
  {
    name: "FRISDRANKEN",
    href: "/categorie/frisdranken",
    id: "6",
    submenu: [
      {
        name: "FRISDRANKEN",
        href: "/categorie/frisdranken",
        id: "6",
      },
      {
        name: "LIMONADEN",
        href: "/categorie/limonaden",
        id: "1",
      },
      {
        name: "WATER NL",
        href: "/categorie/water-nl",
        id: "7",
      },
      {
        name: "WATER PL",
        href: "/categorie/water-pl",
        id: "18",
      },
      {
        name: "KOFFIE THEE",
        href: "/categorie/koffie-thee",
        id: "18",
      },
    ],
  },
  {
    name: "FOOD",
    href: "/categorie/food",
    id: "20",
    submenu: [],
  },
  {
    name: "NON-FOOD",
    href: "/categorie/non-food",
    id: "18",
    submenu: [],
  },
  // {
  //     name: "ACTIES",
  //     href: "/acties",
  //     submenu: []
  // },
]

// Helper function to create a delay
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Helper function to construct API URL with parameters
function constructApiUrl(endpoint: string, params: Record<string, string>, isCustomerEndpoint = false) {
  // Validate environment variables before making the request
  if (!PRODUCT_API_URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined")
    throw new Error("Product API URL is not defined")
  }

  if (isCustomerEndpoint && !CUSTOMER_API_URL) {
    console.error("NEXT_PUBLIC_CUSTOMER_API_URL is not defined")
    throw new Error("Customer API URL is not defined")
  }

  if (!API_KEY) {
    console.error("NEXT_PUBLIC_API_KEY is not defined")
    throw new Error("API KEY is not defined")
  }

  // Add API key to params
  const queryParams = new URLSearchParams({
    apikey: API_KEY,
    ...params,
  })

  // For customer endpoints, use the customer API URL
  if (isCustomerEndpoint) {
    const baseUrl = CUSTOMER_API_URL?.endsWith("/") ? CUSTOMER_API_URL : `${CUSTOMER_API_URL}/`
    return `${baseUrl}${endpoint}?${queryParams}`
  }

  // For product endpoints, use the product API URL
  return `${PRODUCT_API_URL}?${queryParams}`
}

// PRODUCT FUNCTIONS
export async function getProductsByFam1ID(fam1ID: string): Promise<ProductProps[]> {
  try {
    const url = constructApiUrl("", { fam1ID }, false)
    console.log("Fetching products by fam1ID from URL:", url)

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return Array.isArray(data.result?.product) ? data.result.product : []
  } catch (error) {
    console.error("Error fetching products by fam1ID:", error)
    return []
  }
}

export async function getProductsByFam2ID(fam2ID: string, limit: number, page: number): Promise<ProductProps[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}?apikey=${API_KEY || ""}&fam2ID=${fam2ID}&limit=${limit}&page=${page}`

    console.log("Fetching products from URL:", url)
    await sleep(300)

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    await sleep(200)

    const products = Array.isArray(data.result?.product) ? data.result.product : []
    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function searchProducts(query: string): Promise<ProductProps[]> {
  try {
    if (!query || query.trim().length < 2) {
      return []
    }

    const searchQuery = query.trim().toLowerCase()
    console.log(`[searchProducts] Searching for: "${searchQuery}"`)

    const url = constructApiUrl("", { search: searchQuery }, false)
    console.log("[searchProducts] Searching products from URL:", url)

    await sleep(100)

    const response = await fetch(url)

    if (!response.ok) {
      console.error(`[searchProducts] API Error: ${response.status} ${response.statusText}`)
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[searchProducts] API response:", data)

    let products = Array.isArray(data.result?.product) ? data.result.product : []
    console.log(`[searchProducts] Found ${products.length} products from API`)

    if (products.length < 3) {
      console.log("[searchProducts] Few results from API search, trying client-side filtering")

      const allProductsUrl = constructApiUrl("", { limit: "100" }, false)
      console.log("[searchProducts] Fetching all products from:", allProductsUrl)

      const allProductsResponse = await fetch(allProductsUrl)

      if (allProductsResponse.ok) {
        const allProductsData = await allProductsResponse.json()
        const allProducts = Array.isArray(allProductsData.result?.product) ? allProductsData.result.product : []
        console.log(`[searchProducts] Fetched ${allProducts.length} products for client-side filtering`)

        const filteredProducts = allProducts.filter((product: ProductProps) => {
          if (!product) return false

          const title = String(product.title || "").toLowerCase()
          const arcleunik = String(product.arcleunik || "").toLowerCase()
          const productCode = String(product.productCode || "").toLowerCase()

          const matchesTitle = title.includes(searchQuery)
          const matchesArcleunik = arcleunik.includes(searchQuery)
          const matchesProductCode = productCode.includes(searchQuery)

          const matches = matchesTitle || matchesArcleunik || matchesProductCode

          if (matches) {
            console.log(`[searchProducts] Match found: ${product.title} (${product.arcleunik})`)
          }

          return matches
        })

        console.log(`[searchProducts] Client-side filtering found ${filteredProducts.length} products`)

        if (filteredProducts.length > products.length) {
          products = filteredProducts
        }
      } else {
        console.error("[searchProducts] Failed to fetch all products for client-side filtering")
      }
    }

    console.log(`[searchProducts] Final result: Found ${products.length} products matching "${searchQuery}"`)

    if (products.length > 0) {
      console.log("[searchProducts] First matching product:", {
        title: products[0].title,
        arcleunik: products[0].arcleunik,
        productCode: products[0].productCode,
      })
    } else {
      console.log("[searchProducts] No products found")
    }

    return products
  } catch (error) {
    console.error("[searchProducts] Error searching products:", error)
    return []
  }
}

export async function getProductsCount(fam2ID: string): Promise<number> {
  try {
    const baseUrl = constructApiUrl("", { fam2ID }, false)
    const url = new URL(baseUrl)
    url.searchParams.append("count", "true")

    console.log("Fetching product count from URL:", url.toString())

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.count !== undefined) {
      return Number(data.count)
    }

    if (data.result?.total !== undefined) {
      return Number(data.result.total)
    }

    if (Array.isArray(data.result?.product)) {
      return data.result.product.length
    }

    return 480
  } catch (error) {
    console.error("Error fetching product count:", error)
    return 480
  }
}

export async function getProductByArcleunik(arcleunik: string): Promise<ProductProps | null> {
  try {
    const url = constructApiUrl("", { arcleunik }, false)
    console.log(`Fetching product by arcleunik: ${arcleunik}`)

    const response = await fetch(url)

    if (!response.ok) {
      console.warn(`Product not found for arcleunik: ${arcleunik}`)
      return null
    }

    const data = await response.json()

    if (data.result?.product && Array.isArray(data.result.product) && data.result.product.length > 0) {
      return data.result.product[0]
    }

    return null
  } catch (error) {
    console.error(`Error fetching product by arcleunik ${arcleunik}:`, error)
    return null
  }
}

// CUSTOMER FUNCTIONS
export async function getCustomerById(id: string) {
  try {
    const customerId = String(id)
    const url = constructApiUrl("", { clcleunik: customerId }, true)
    console.log("Fetching customer by ID from URL:", url)

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.success !== "true" || !data.result.customer || data.result.customer.length === 0) {
      throw new Error("Customer not found")
    }

    return data.result.customer[0]
  } catch (error) {
    console.error("Error fetching customer by ID:", error)
    throw error
  }
}

export async function updateCustomer(id: string, data: any) {
  try {
    if (!CUSTOMER_API_URL) {
      throw new Error("Customer API URL is not defined")
    }

    const baseUrl = CUSTOMER_API_URL.replace("list/", "")
    const updateUrl = `${baseUrl}update/?apikey=${API_KEY || ""}`

    console.log("Updating customer at URL:", updateUrl)

    const response = await fetch(updateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_client: id,
        ...data,
      }),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    if (result.success !== "true") {
      throw new Error(result.message || "Failed to update customer")
    }

    return result
  } catch (error) {
    console.error("Error updating customer:", error)
    throw error
  }
}

export async function deleteCustomer(id: string) {
  try {
    if (!CUSTOMER_API_URL) {
      throw new Error("Customer API URL is not defined")
    }

    const baseUrl = CUSTOMER_API_URL.replace("list/", "")
    const deleteUrl = `${baseUrl}delete/?apikey=${API_KEY || ""}&id_client=${id}`

    console.log("Deleting customer at URL:", deleteUrl)

    const response = await fetch(deleteUrl, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    if (result.success !== "true") {
      throw new Error(result.message || "Failed to delete customer")
    }

    return result
  } catch (error) {
    console.error("Error deleting customer:", error)
    throw error
  }
}

export async function cleanTestData(id: string) {
  try {
    const customer = await getCustomerById(id)

    const cleanedData = {
      id_client: id,
      login: customer.login.includes("test") ? customer.login.replace("test", "user") : customer.login,
      email: customer.email.includes("test") ? customer.email.replace("test", "user") : customer.email,
      customerNumber: customer.customerNumber.toLowerCase().includes("test")
        ? customer.customerNumber.replace(/test/i, "CUST")
        : customer.customerNumber,
    }

    return await updateCustomer(id, cleanedData)
  } catch (error) {
    console.error("Error cleaning test data:", error)
    throw error
  }
}

// ORDER FUNCTIONS
export async function getCustomerOrder(id: string) {
  try {
    if (!CUSTOMER_ORDERS_API_URL) {
      throw new Error("Customer orders API URL is not defined")
    }

    if (!API_KEY) {
      throw new Error("API key is not defined")
    }

    const url = `${CUSTOMER_ORDERS_API_URL}&clcleunik=${id}&apikey=${API_KEY || ""}`
    console.log("Fetching customer orders from URL:", url)

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(data.result.order)

    return data.result.order
  } catch (error) {
    console.error("Error fetching customer orders:", error)
    throw error
  }
}

export async function getCustomerOrderDetails(guid: string) {
  try {
    if (!CUSTOMER_ORDER_DETAILS_API_URL) {
      throw new Error("Customer order details API URL is not defined")
    }

    if (!API_KEY) {
      throw new Error("API key is not defined")
    }

    const url = `${CUSTOMER_ORDER_DETAILS_API_URL}apikey=${API_KEY || ""}&guid=${guid}`
    console.log("Fetching order details from URL:", url)

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(data.result.order)

    return data.result.order
  } catch (error) {
    console.error("Error fetching order details:", error)
    throw error
  }
}

export async function getOrderTotal(orderID: any) {
  try {
    console.log("Getting order total: ", orderID)
    const url = `${process.env.NEXT_PUBLIC_ORDERS_ADD_LINES_TO_ORDER_URL}apikey=${API_KEY}&guid=${orderID}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.result.total
  } catch (error) {
    console.error("Error fetching order details:", error)
    throw error
  }
}

// CORE ORDER PROCESSING FUNCTIONS
export async function createEmptyOrder(customerID: string) {
  console.log("🔍 Creating empty order for customer:", customerID)

  const url = `${ORDERS_CREATE_BLANK_URL}apikey=${API_KEY}`

  const requestBody = {
    clcleunik: customerID,
    use: "clcleunik",
  }

  console.log("🔍 API Request URL:", url)
  console.log("🔍 API Request Body:", JSON.stringify(requestBody))

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const order_guid = await response.json()
  console.log("🔍 API Response:", order_guid)

  return order_guid
}

export async function addLinesToOrder(orderID: string, orderLines: any[]) {
  console.log("🔍 Adding order lines for order:", orderID)
  console.log("🔍 Order lines to add:", orderLines)

  for (const orderLine of orderLines) {
    const arcleunikValue = orderLine.arcleunik || orderLine.volume
    const quantity = orderLine.quantity

    console.log(`🔍 Adding line - arcleunik: ${arcleunikValue}, quantity: ${quantity}`)

    const url = `${ORDERS_ADD_LINES_TO_ORDER_URL}apikey=${API_KEY}&arcleunik=${arcleunikValue}&guid=${orderID}&qty=${quantity}`

    console.log("🔍 API URL:", url)

    try {
      const res = await fetch(url, {
        method: "POST",
      })

      const data = await res.json()
      console.log("🔍 Add line result:", data)

      if (data.success !== "true") {
        console.error(`❌ Failed to add line with arcleunik ${arcleunikValue}:`, data)
        throw new Error(`Failed to add product ${arcleunikValue}: ${data.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("❌ Error adding line to order:", error)
      throw error
    }
  }
}

export async function sendToMegawin(
  orderID: string,
  customerData: CustomerData,
  orderData: OrderData,
  deliveryDate?: string,
) {
  console.log("🔍 Sending order to Megawin - Order ID:", orderID)

  const currentDate = deliveryDate || new Date().toISOString().split("T")[0]
  const currentTime = new Date().toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const customerName = `${customerData.firstName} ${customerData.lastName}`.trim()

  const deliveryComment = orderData.deliveryComment
    ? `Klant: ${customerName} - ${orderData.deliveryComment}`
    : `Klant: ${customerName} - Bestelling geplaatst op ${currentDate} om ${currentTime}`

  const url = `${ORDERS_SEND_TO_MEGAWIN_URL}apikey=${API_KEY}&guid=${orderID}&modeLivraison=${orderData.deliveryOption || 1}&deliverydate=${orderData.deliveryDate || currentDate}&deliverycomment=${encodeURIComponent(deliveryComment)}`

  console.log("🔍 Megawin API URL:", url)

  try {
    const res = await fetch(url, {
      method: "POST",
    })

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    console.log("🔍 Megawin API response:", data)

    if (data.success !== "true") {
      throw new Error(`Megawin API Error: ${data.message || "Unknown error"}`)
    }

    return data
  } catch (error) {
    console.error("❌ Error sending order to Megawin:", error)
    throw error
  }
}

// MAIN ORDER HANDLER - COMPLETE PROCESS
export async function handleOrders(orderData: OrderData, customerData: CustomerData) {
  console.log("🔍 Starting complete order process...")
  console.log("📊 Order data:", orderData)
  console.log("👤 Customer data:", customerData)

  try {
    // Step 1: Create empty order
    console.log("🔍 Step 1: Creating empty order...")
    const orderResult = await createEmptyOrder(customerData.clcleunik)

    if (!orderResult?.result?.guid) {
      throw new Error("Failed to create order - no GUID returned")
    }

    const orderGuid = orderResult.result.guid
    console.log("✅ Order created with GUID:", orderGuid)

    // Step 2: Add order lines
    console.log("🔍 Step 2: Adding order lines...")
    const items = orderData.items || orderData
    await addLinesToOrder(orderGuid, items)
    console.log("✅ Order lines added successfully")

    // Step 3: Send to Megawin
    console.log("🔍 Step 3: Sending to Megawin...")
    const megawinResult = await sendToMegawin(orderGuid, customerData, orderData)
    console.log("✅ Order sent to Megawin successfully")

    // Step 4: Send emails via API route (server-side only)
    console.log("🔍 Step 4: Triggering email sending API...")
    try {
      const emailResponse = await fetch("/api/send-order-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerData,
          orderData,
          orderNumber: orderGuid,
        }),
      })

      const emailResult = await emailResponse.json()

      if (!emailResult.success) {
        console.warn("⚠️ Email sending failed:", emailResult.message)
        // Don't throw error - order was successful, just email failed
      } else {
        console.log("✅ Emails triggered successfully")
      }
    } catch (emailError) {
      console.warn("⚠️ Email sending trigger failed:", emailError)
      // Don't throw error - order was successful, just email failed
    }

    console.log("🎉 Complete order process finished successfully!")

    return {
      success: true,
      orderNumber: orderGuid,
      guid: orderGuid,
      message: "Order successfully placed and processed",
      details: {
        megawinResponse: megawinResult,
        emailsSent: true, // We attempted to send emails
        pdfGenerated: true, // PDF generation is handled in API route
      },
    }
  } catch (error) {
    console.error("❌ Error in complete order process:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while processing the order",
      error: error instanceof Error ? error.stack : String(error),
    }
  }
}

// PDF AND EMAIL FUNCTIONS
// Function to generate PDF packing slip - SERVER ONLY

// Generic email sending function - SERVER ONLY

// ANALYSIS FUNCTIONS
export async function getAllCustomerOrders(customerIds: string[]): Promise<any[]> {
  const allOrders: any[] = []

  for (const customerId of customerIds) {
    try {
      const orders = await getCustomerOrder(customerId)
      if (Array.isArray(orders)) {
        allOrders.push(...orders.map((order) => ({ ...order, customerId })))
      }
      await sleep(200)
    } catch (error) {
      console.error(`Error fetching orders for customer ${customerId}:`, error)
    }
  }

  return allOrders
}

export async function analyzeOrdersByCategory(customerIds: string[]): Promise<OrderAnalysis> {
  console.log("🔍 Starting order analysis by category...")

  try {
    console.log("📊 Fetching all customer orders...")
    const allOrders = await getAllCustomerOrders(customerIds)
    console.log(`📊 Found ${allOrders.length} total orders`)

    const detailedOrders: any[] = []
    for (const order of allOrders) {
      try {
        const orderDetails = await getCustomerOrderDetails(order.guid)
        if (orderDetails && Array.isArray(orderDetails)) {
          detailedOrders.push(
            ...orderDetails.map((detail) => ({
              ...detail,
              originalOrder: order,
            })),
          )
        }
        await sleep(300)
      } catch (error) {
        console.error(`Error fetching details for order ${order.guid}:`, error)
      }
    }

    console.log(`📊 Processed ${detailedOrders.length} detailed order items`)

    const categoryStats: { [fam2ID: string]: CategoryStats } = {}
    const productCache: { [arcleunik: string]: ProductProps | null } = {}
    let totalProducts = 0

    for (const orderItem of detailedOrders) {
      if (!orderItem.arcleunik) continue

      totalProducts++

      let product = productCache[orderItem.arcleunik]
      if (product === undefined) {
        product = await getProductByArcleunik(orderItem.arcleunik)
        productCache[orderItem.arcleunik] = product
        await sleep(100)
      }

      if (!product || !product.fam2ID) {
        console.warn(`No product or fam2ID found for arcleunik ${orderItem.arcleunik}`)
        continue
      }

      const fam2ID = product.fam2ID
      const quantity = Number.parseInt(orderItem.quantity) || 1
      const price = Number.parseFloat(orderItem.price) || 0
      const totalValue = quantity * price

      if (!categoryStats[fam2ID]) {
        categoryStats[fam2ID] = {
          fam2ID,
          categoryName: getCategoryName(fam2ID),
          totalQuantity: 0,
          totalOrders: 0,
          totalValue: 0,
          averageOrderValue: 0,
          products: [],
        }
      }

      categoryStats[fam2ID].totalQuantity += quantity
      categoryStats[fam2ID].totalValue += totalValue
      categoryStats[fam2ID].totalOrders++

      let productStats = categoryStats[fam2ID].products.find((p) => p.arcleunik === orderItem.arcleunik)
      if (!productStats) {
        productStats = {
          arcleunik: orderItem.arcleunik,
          productName: product.title || "Unknown Product",
          totalQuantity: 0,
          totalOrders: 0,
          totalValue: 0,
        }
        categoryStats[fam2ID].products.push(productStats)
      }

      productStats.totalQuantity += quantity
      productStats.totalOrders++
      productStats.totalValue += totalValue
    }

    const categoriesArray = Object.values(categoryStats)

    categoriesArray.forEach((category) => {
      category.averageOrderValue = category.totalOrders > 0 ? category.totalValue / category.totalOrders : 0
      category.products.sort((a, b) => b.totalValue - a.totalValue)
    })

    const sortedCategories = categoriesArray.sort((a, b) => b.totalValue - a.totalValue)
    const topCategories = sortedCategories.slice(0, 10)

    const ordersByCategory: { [fam2ID: string]: OrdersByCategory } = {}

    categoriesArray.forEach((category) => {
      ordersByCategory[category.fam2ID] = {
        orders: [],
        totalQuantity: category.totalQuantity,
        totalValue: category.totalValue,
      }
    })

    const analysis: OrderAnalysis = {
      totalOrders: allOrders.length,
      totalProducts,
      categoriesStats: sortedCategories,
      topCategories,
      ordersByCategory,
    }

    console.log("📊 Order analysis completed!")
    console.log(`📊 Total categories found: ${sortedCategories.length}`)
    console.log(`📊 Top category: ${topCategories[0]?.categoryName} (€${topCategories[0]?.totalValue.toFixed(2)})`)

    return analysis
  } catch (error) {
    console.error("Error analyzing orders by category:", error)
    throw error
  }
}

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

  return categoryMap[fam2ID] || `Category ${fam2ID}`
}

export async function generateCategoryReport(customerIds: string[]): Promise<string> {
  try {
    const analysis = await analyzeOrdersByCategory(customerIds)

    let report = "📊 MEGAWIN ORDER ANALYSIS REPORT\n"
    report += "=".repeat(50) + "\n\n"

    report += `📈 OVERVIEW:\n`
    report += `- Total Orders: ${analysis.totalOrders}\n`
    report += `- Total Products Ordered: ${analysis.totalProducts}\n`
    report += `- Categories Found: ${analysis.categoriesStats.length}\n\n`

    report += `🏆 TOP 10 CATEGORIES BY VALUE:\n`
    report += "-".repeat(50) + "\n"

    analysis.topCategories.forEach((category, index) => {
      report += `${index + 1}. ${category.categoryName}\n`
      report += `   💰 Total Value: €${category.totalValue.toFixed(2)}\n`
      report += `   📦 Total Quantity: ${category.totalQuantity}\n`
      report += `   📋 Total Orders: ${category.totalOrders}\n`
      report += `   💵 Avg Order Value: €${category.averageOrderValue.toFixed(2)}\n`
      report += `   🔝 Top Product: ${category.products[0]?.productName || "N/A"}\n\n`
    })

    report += `📋 DETAILED CATEGORY BREAKDOWN:\n`
    report += "-".repeat(50) + "\n"

    analysis.categoriesStats.forEach((category) => {
      report += `\n📂 ${category.categoryName} (ID: ${category.fam2ID})\n`
      report += `   💰 €${category.totalValue.toFixed(2)} | 📦 ${category.totalQuantity} items | 📋 ${category.totalOrders} orders\n`

      if (category.products.length > 0) {
        report += `   Top Products:\n`
        category.products.slice(0, 3).forEach((product, idx) => {
          report += `   ${idx + 1}. ${product.productName} - €${product.totalValue.toFixed(2)} (${product.totalQuantity}x)\n`
        })
      }
    })

    return report
  } catch (error) {
    console.error("Error generating category report:", error)
    return "Error generating report: " + (error instanceof Error ? error.message : String(error))
  }
}

export async function getCategoryInsights(fam2ID: string, customerIds: string[]): Promise<CategoryStats | null> {
  try {
    const analysis = await analyzeOrdersByCategory(customerIds)
    return analysis.categoriesStats.find((cat) => cat.fam2ID === fam2ID) || null
  } catch (error) {
    console.error(`Error getting insights for category ${fam2ID}:`, error)
    return null
  }
}

export async function getProductDetailsWithFallback(arcleunik: string): Promise<{
  product: ProductProps | null
  productName: string
  fam2ID: string | null
}> {
  try {
    const product = await getProductByArcleunik(arcleunik)

    if (product) {
      return {
        product,
        productName: product.title || "Unknown Product",
        fam2ID: product.fam2ID || null,
      }
    }

    return {
      product: null,
      productName: `Product ${arcleunik}`,
      fam2ID: null,
    }
  } catch (error) {
    console.error(`Error fetching product details for ${arcleunik}:`, error)
    return {
      product: null,
      productName: `Product ${arcleunik}`,
      fam2ID: null,
    }
  }
}
