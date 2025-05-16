import type { ProductProps } from "@/types/product"

// Get environment variables
const PRODUCT_API_URL = process.env.NEXT_PUBLIC_API_URL
const CUSTOMER_API_URL = process.env.NEXT_PUBLIC_CUSTOMER_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

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
    href: "/categorie/poolse-bier-blik",
    id: "1",
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
        id: "4",
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
        name: "KRATTEN",
        href: "/categorie/krat",
        id: "23",
      },
      {
        name: "LIMONADEN",
        href: "/categorie/limonaden",
        id: "1",
      },
      {
        name: "WATER",
        href: "/categorie/water-nl",
        id: "7",
      },
      {
        name: "PETFLESSEN",
        href: "/categorie/poolse",
        id: "2",
      },
    ],
  },
  {
    name: "FOOD",
    href: "/categorie/food",
    id: "20",
    submenu: [
      {
        name: "FOOD",
        href: "/categorie/food",
        id: "20",
      },
    ],
  },
  {
    name: "NON-FOOD",
    href: "/categorie/non-food",
    id: "21",
    submenu: [
      {
        name: "NON-FOOD",
        href: "/categorie/non-food",
        id: "21",
      },
      {
        name: "KOFFIE THEE",
        href: "/categorie/koffie-thee",
        id: "18",
      },
      {
        name: "HOUTSKOOL",
        href: "/categorie/houtskool",
        id: "19",
      },
      {
        name: "SCHOONMAAK",
        href: "/categorie/schoonmaak",
        id: "22",
      },
    ],
  },
]

// Helper function to create a delay
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Helper function to construct API URL with parameters
export function constructApiUrl(endpoint: string, params: Record<string, string>, isCustomerEndpoint = false) {
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

export async function getProductsByFam1ID(fam1ID: string): Promise<ProductProps[]> {
  try {
    // Construct the URL for products
    const url = constructApiUrl("", { fam1ID }, false)
    console.log("Fetching products by fam1ID from URL:", url) // Debug log

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Ensure products is always an array
    return Array.isArray(data.result?.product) ? data.result.product : []
  } catch (error) {
    console.error("Error fetching products by fam1ID:", error)
    return []
  }
}

// Updated to handle larger batch sizes
export async function getProductsByFam2ID(fam2ID: string, limit = 100, page = 1): Promise<ProductProps[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}?apikey=${API_KEY}&fam2ID=${fam2ID}&limit=${limit}&page=${page}`

    // Log the final URL with all parameters
    console.log("Fetching products from URL:", url)

    // Add a delay before fetching (300ms)
    await sleep(300)

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Add a delay after fetching (200ms)
    await sleep(200)

    // Ensure products is always an array
    const products = Array.isArray(data.result?.product) ? data.result.product : []

    // Return products without adding any additional fields
    // We'll use arcleunik as the unique identifier
    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

// Update the searchProducts function to ensure it's properly searching through the fields in ProductProps
export async function searchProducts(query: string): Promise<ProductProps[]> {
  try {
    if (!query || query.trim().length < 2) {
      return []
    }

    // Clean and prepare the search query
    const searchQuery = query.trim().toLowerCase()
    console.log(`[searchProducts] Searching for: "${searchQuery}"`)

    // First try to search using the API's search parameter
    const url = constructApiUrl("", { search: searchQuery }, false)
    console.log("[searchProducts] Searching products from URL:", url)

    // Add a small delay to prevent too many rapid requests
    await sleep(100)

    const response = await fetch(url)

    if (!response.ok) {
      console.error(`[searchProducts] API Error: ${response.status} ${response.statusText}`)
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[searchProducts] API response:", data)

    // Get products from API response
    let products = Array.isArray(data.result?.product) ? data.result.product : []
    console.log(`[searchProducts] Found ${products.length} products from API`)

    // If no products found or very few, try to get all products and filter client-side
    if (products.length < 3) {
      console.log("[searchProducts] Few results from API search, trying client-side filtering")

      // Get a larger set of products to search through
      const allProductsUrl = constructApiUrl("", { limit: "100" }, false)
      console.log("[searchProducts] Fetching all products from:", allProductsUrl)

      const allProductsResponse = await fetch(allProductsUrl)

      if (allProductsResponse.ok) {
        const allProductsData = await allProductsResponse.json()
        const allProducts = Array.isArray(allProductsData.result?.product) ? allProductsData.result.product : []
        console.log(`[searchProducts] Fetched ${allProducts.length} products for client-side filtering`)

        // Filter products by title, arcleunik, and productCode only
        const filteredProducts = allProducts.filter((product: ProductProps) => {
          if (!product) return false

          // Convert all values to lowercase strings for case-insensitive comparison
          const title = String(product.title || "").toLowerCase()
          const arcleunik = String(product.arcleunik || "").toLowerCase()
          const productCode = String(product.productCode || "").toLowerCase()

          // Check if any of these fields contain the search query
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

        // If we found more products with client-side filtering, use those results
        if (filteredProducts.length > products.length) {
          products = filteredProducts
        }
      } else {
        console.error("[searchProducts] Failed to fetch all products for client-side filtering")
      }
    }

    // Log the number of products found
    console.log(`[searchProducts] Final result: Found ${products.length} products matching "${searchQuery}"`)

    // Log the first product for debugging if any were found
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

// Add this new function to get the total count of products for a category
export async function getProductsCount(fam2ID: string): Promise<number> {
  try {
    // Get the base URL from constructApiUrl with the fam2ID parameter
    const baseUrl = constructApiUrl("", { fam2ID }, false)

    // Create URL object to easily add parameters
    const url = new URL(baseUrl)

    // Add count parameter to only get the count, not the actual products
    url.searchParams.append("count", "true")

    // Log the final URL with all parameters
    console.log("Fetching product count from URL:", url.toString())

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Check if the API returns a count directly
    if (data.count !== undefined) {
      return Number(data.count)
    }

    // If not, try to get the total from the result
    if (data.result?.total !== undefined) {
      return Number(data.result.total)
    }

    // If the API doesn't provide a count, estimate based on the products returned
    if (Array.isArray(data.result?.product)) {
      // If we get all products at once, use the length
      return data.result.product.length
    }

    // Default fallback - return a reasonable estimate
    return 480
  } catch (error) {
    console.error("Error fetching product count:", error)
    // Return a default estimate if count fetch fails
    return 480
  }
}

export async function getCustomerById(id: string) {
  try {
    // Ensure id is a string
    const customerId = String(id)

    // Use customer API URL for customer endpoints
    const url = constructApiUrl("", { clcleunik: customerId }, true)
    console.log("Fetching customer by ID from URL:", url) // Debug log

    const response = await fetch(url)

    // Log the response status for debugging
    console.log(`Customer API response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      // Instead of throwing immediately, log more details
      console.error(`Customer API error: ${response.status} ${response.statusText}`)
      console.error(`Customer ID: ${customerId}`)
      console.error(`API URL: ${url}`)

      // Try to get error details from response body
      try {
        const errorData = await response.json()
        console.error("Error response:", errorData)
      } catch (e) {
        console.error("Could not parse error response")
      }

      // Now throw the error
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Log the response data for debugging
    console.log("Customer API response data:", data)

    if (!data.success || !data.result?.customer || data.result.customer.length === 0) {
      console.error("Customer not found in API response:", data)
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
    // Extract the base URL from CUSTOMER_API_URL
    if (!CUSTOMER_API_URL) {
      throw new Error("Customer API URL is not defined")
    }

    // Remove "list/" from the URL and add "update/"
    const baseUrl = CUSTOMER_API_URL.replace("list/", "")
    const updateUrl = `${baseUrl}update/?apikey=${API_KEY}`

    console.log("Updating customer at URL:", updateUrl) // Debug log

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
    // Extract the base URL from CUSTOMER_API_URL
    if (!CUSTOMER_API_URL) {
      throw new Error("Customer API URL is not defined")
    }

    // Remove "list/" from the URL and add "delete/"
    const baseUrl = CUSTOMER_API_URL.replace("list/", "")
    const deleteUrl = `${baseUrl}delete/?apikey=${API_KEY}&id_client=${id}`

    console.log("Deleting customer at URL:", deleteUrl) // Debug log

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
    // First get the current customer data
    const customer = await getCustomerById(id)

    // Clean test data by updating the customer with cleaned values
    const cleanedData = {
      id_client: id,
      login: customer.login.includes("test") ? customer.login.replace("test", "user") : customer.login,
      email: customer.email.includes("test") ? customer.email.replace("test", "user") : customer.email,
      customerNumber: customer.customerNumber.toLowerCase().includes("test")
        ? customer.customerNumber.replace(/test/i, "CUST")
        : customer.customerNumber,
      // Add other fields that need cleaning
    }

    // Update the customer with cleaned data
    return await updateCustomer(id, cleanedData)
  } catch (error) {
    console.error("Error cleaning test data:", error)
    throw error
  }
}

export async function getCustomerOrder(id: string) {
  try {
    // Use customer API URL for customer endpoints
    const url = `${process.env.NEXT_PUBLIC_CUSTOMER_ORDERS_API_URL}&clcleunik=${id}&apikey=${API_KEY}`
    console.log("Fetching customer orders from URL:", url) // Debug log

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
    // Use customer API URL for customer endpoints
    const url = `${process.env.NEXT_PUBLIC_CUSTOMER_ORDER_DETAILS_API_URL}apikey=${API_KEY}&guid=${guid}`
    console.log("Fetching order details from URL:", url) // Debug log

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

// BESTELLINGEN AANMAKEN
export async function addLinesToOrder(orderGuid: string, item: any) {
  try {
    const url = `${process.env.NEXT_PUBLIC_ORDERS_ADD_LINE_URL}apikey=${process.env.NEXT_PUBLIC_API_KEY}`

    console.log(`Adding item ${item.id} to order ${orderGuid}`)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guid: orderGuid,
        arcleunik: item.id,
        qty: item.quantity,
        data: `${item.id}_${item.quantity}`,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to add item to order: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || `Failed to add item ${item.id} to order`)
    }

    return data
  } catch (error) {
    console.error("Error adding line to order:", error)
    throw error
  }
}

// Legacy function - kept for backward compatibility
export async function addLinesToOeder(orderLines: any) {
  console.log("Warning: Using deprecated function addLinesToOeder. Please use addLinesToOrder instead.")
  console.log(orderLines)
}

// Legacy function for adding multiple lines at once
export async function addLinesToOrderBatch(orderID: any, orderLines: any[]) {
  console.log("Adding order lines for order: ", orderID)
  for (const orderLine of orderLines) {
    const url = `${process.env.NEXT_PUBLIC_ORDERS_ADD_LINES_TO_ORDER_URL}apikey=${API_KEY}
    &arcleunik=${orderLine.volume}
    &guid=${orderID}
    &qty=${orderLine.quantity}`

    try {
      const res = await fetch(url, {
        method: "POST",
      })
      const data = await res.json()
      console.log("Added line:", data)
    } catch (error) {
      console.error("Error adding line to order:", error)
    }
  }
}

export async function createEmptyOrder(customerID: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_ORDERS_CREATE_BLANK_URL}apikey=${process.env.NEXT_PUBLIC_API_KEY}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clcleunik: customerID,
        use: "clcleunik",
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create empty order: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Failed to create empty order")
    }

    return data.result?.guid || data.guid
  } catch (error) {
    console.error("Error creating empty order:", error)
    throw error
  }
}

// Legacy function - kept for backward compatibility
export async function createEmptyORder(customerID: string) {
  console.log("Warning: Using deprecated function createEmptyORder. Please use createEmptyOrder instead.")
  const url = `${process.env.NEXT_PUBLIC_ORDERS_CREATE_BLANK_URL}apikey=${API_KEY}`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clcleunik: customerID,
      use: "clcleunik",
    }),
  })

  const order_guid = await response.json()
  console.log(order_guid)

  return order_guid
}

export async function sendOrderToMegawin(orderGuid: string, deliveryData: any) {
  try {
    const url = `${process.env.NEXT_PUBLIC_ORDERS_SEND_TO_MEGAWIN_URL}apikey=${process.env.NEXT_PUBLIC_API_KEY}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guid: orderGuid,
        ...deliveryData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send order to Megawin: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Failed to send order to Megawin")
    }

    return data
  } catch (error) {
    console.error("Error sending order to Megawin:", error)
    throw error
  }
}

// Legacy function - kept for backward compatibility
export async function sendToMegawin(orderID: any) {
  console.log("Warning: Using deprecated function sendToMegawin. Please use sendOrderToMegawin instead.")
  console.log("Sending order to megawin....")
  const url = `${process.env.NEXT_PUBLIC_ORDERS_SEND_TO_MEGAWIN_URL}apikey=${API_KEY}
  &guid=${orderID}
  &modeLivraison=1
  &deliverydate=2025-05-01
  &deliverycomment=TEST-API-DIAZ`

  try {
    const res = await fetch(url, {
      method: "POST",
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error adding line to order:", error)
    throw error
  }
}

export async function handleOrder(cart: any[], customerData: any, deliveryData: any) {
  console.log("Processing order with items:", cart.length)

  try {
    // Step 1: Create an empty order
    const orderGuid = await createEmptyOrder(customerData.clcleunik || customerData.id)
    console.log("Created empty order with GUID:", orderGuid)

    // Step 2: Add each item to the order
    for (const item of cart) {
      await addLinesToOrder(orderGuid, item)
      console.log(`Added item ${item.id} to order`)
    }

    // Step 3: Send the order to Megawin
    const result = await sendOrderToMegawin(orderGuid, deliveryData)
    console.log("Order sent to Megawin successfully")

    return {
      success: true,
      orderNumber: result.result?.orderNumber || orderGuid,
      orderData: result.result,
    }
  } catch (error) {
    console.error("Error processing order:", error)
    throw error
  }
}

// Legacy function - kept for backward compatibility
export async function handleOrders(orderData: any, customerID: any) {
  console.log("Warning: Using deprecated function handleOrders. Please use handleOrder instead.")
  console.log("order data: ", orderData)
  console.log("customer id: ", customerID.clcleunik)
  try {
    const orderID = await createEmptyORder(customerID.clcleunik)
    const fullOrder = await addLinesToOrderBatch(orderID.result.guid, orderData)
    const completeOrder = await sendToMegawin(orderID.result.guid)

    console.log(orderID.result.guid)
    console.log(fullOrder)
    console.log(completeOrder)

    return {
      success: true,
      orderNumber: orderID.result.guid,
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

// GET ORDER TOTAL FROM MEGAWIN
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
