import type { ProductProps } from "@/types/product"

// Get environment variables
const PRODUCT_API_URL = process.env.NEXT_PUBLIC_API_URL
const CUSTOMER_API_URL = process.env.NEXT_PUBLIC_CUSTOMER_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

// Helper function to create a delay
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

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

// This is the handleOrders function used by the checkout process
// It's a wrapper that adapts the cart data to work with the Megawin API
export async function handleOrders(cart: any[], customerData: any) {
  console.log("Processing order with Megawin API...")
  console.log("Cart:", cart)
  console.log("Customer Data:", customerData)

  try {
    // Use the existing Megawin order creation flow
    const orderID = await createEmptyORder(customerData.clcleunik)
    const fullOrder = await addLinesToOrder(orderID.result.guid, cart)
    const completeOrder = await sendToMegawin(orderID.result.guid)

    console.log("Order created with ID:", orderID.result.guid)
    console.log("Order lines added:", fullOrder)
    console.log("Order sent to Megawin:", completeOrder)

    return { success: true, orderGuid: orderID.result.guid }
  } catch (error) {
    console.error("Error processing order:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getProductsByFam1ID(fam1ID: string): Promise<ProductProps[]> {
  try {
    const url = `${PRODUCT_API_URL}?apikey=${API_KEY}&fam1ID=${fam1ID}`
    console.log("Fetching products by fam1ID from API from URL:", url)

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const products = Array.isArray(data.result?.product) ? data.result.product : []

    return products
  } catch (error) {
    console.error("Error fetching products by fam1ID:", error)
    return []
  }
}

export async function getProductsByFam2ID(fam2ID: string, limit = 100, page = 1): Promise<ProductProps[]> {
  try {
    const url = `${PRODUCT_API_URL}?apikey=${API_KEY}&fam2ID=${fam2ID}&limit=${limit}&page=${page}`
    console.log("Fetching products by fam2ID from API from URL:", url)

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
    console.error("Error fetching products by fam2ID:", error)
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
    const url = `${PRODUCT_API_URL}?apikey=${API_KEY}&search=${searchQuery}`
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
      const allProductsUrl = `${PRODUCT_API_URL}?apikey=${API_KEY}&limit=100`
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
    const baseUrl = `${PRODUCT_API_URL}?apikey=${API_KEY}&fam2ID=${fam2ID}`

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
  const customerId = String(id)

  try {
    const url = `${CUSTOMER_API_URL}?apikey=${API_KEY}&clcleunik=${customerId}`
    console.log("Fetching customer by ID from API from URL:", url)

    const response = await fetch(url)
    console.log(`Customer API response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      console.error(`Customer API error: ${response.status} ${response.statusText}`)
      console.error(`Customer ID: ${customerId}`)
      console.error(`API URL: ${url}`)
      try {
        const errorData = await response.json()
        console.error("Error response:", errorData)
      } catch (e) {
        console.error("Could not parse error response")
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Customer API response data:", data)

    if (!data.success || !data.result?.customer || data.result.customer.length === 0) {
      console.error("Customer not found in API response:", data)
      throw new Error("Customer not found")
    }

    const customer = data.result.customer[0]
    return customer
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

// Get customer orders - returns an array of orders
export async function getCustomerOrder(clcleunik: string): Promise<any[]> {
  try {
    // Validate the customer ID
    if (!clcleunik) {
      console.error("No customer ID provided")
      return []
    }

    // Use customer API URL for customer endpoints
    const url = `${process.env.NEXT_PUBLIC_CUSTOMER_ORDERS_API_URL}&clcleunik=${clcleunik}&apikey=${API_KEY}`
    console.log("Fetching customer orders from URL:", url) // Debug log

    const response = await fetch(url)

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`)
      // Return empty array instead of throwing to handle gracefully
      return []
    }

    const data = await response.json()
    console.log("Customer orders response:", data)

    // Ensure we always return an array
    if (data.result?.order && Array.isArray(data.result.order)) {
      return data.result.order
    }

    // If no orders found, return empty array
    return []
  } catch (error) {
    console.error("Error fetching customer orders:", error)
    // Return empty array on error to handle gracefully
    return []
  }
}

export async function getCustomerOrderDetails(guid: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_CUSTOMER_ORDER_DETAILS_API_URL}apikey=${API_KEY}&guid=${guid}`
    console.log("Fetching order details from API from URL:", url)

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.success || !data.result?.order) {
      console.error("Order details not found in API response:", data)
      throw new Error("Order details not found")
    }

    console.log("Order details retrieved successfully from API:", {
      guid,
      hasLines: !!data.result.order.lines,
      lineCount: data.result.order.lines?.length || 0,
    })

    const orderDetails = data.result.order
    return orderDetails
  } catch (error) {
    console.error("Error fetching order details:", error)
    throw error
  }
}

// Update the getOrderDetails function to use the customer order details API properly
export async function getOrderDetails(orderGuid: string, customerClcleunik?: string) {
  try {
    // First, try to use the customer order details API
    if (process.env.NEXT_PUBLIC_CUSTOMER_ORDER_DETAILS_API_URL) {
      const orderDetails = await getCustomerOrderDetails(orderGuid)

      // Transform the data to match our expected format
      if (orderDetails && orderDetails.lines) {
        return orderDetails.lines.map((line: any) => ({
          id: line.arcleunik || line.id,
          name: line.title || line.name,
          quantity: Number.parseInt(line.qty || "1", 10),
          price: Number.parseFloat(line.prix_vente_groupe || line.price || "0"),
          image: line.photo1_base64
            ? `data:image/jpeg;base64,${line.photo1_base64}`
            : `/placeholder.svg?height=50&width=50&query=${encodeURIComponent(line.title || "product")}`,
        }))
      }

      return []
    }

    // Fallback to a generic order details endpoint if available
    if (process.env.API_BASE_URL) {
      const response = await fetch(`${process.env.API_BASE_URL}/orders/${orderGuid}/details`, {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN || API_KEY}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch order details")
      }

      const data = await response.json()

      // Transform the data to match our expected format
      return data.items.map((item: any) => ({
        id: item.product_id || item.arcleunik,
        name: item.product_name || item.title,
        quantity: item.quantity,
        price: item.unit_price || item.price,
        image:
          item.product_image ||
          (item.photo1_base64
            ? `data:image/jpeg;base64,${item.photo1_base64}`
            : `/placeholder.svg?height=50&width=50&query=${encodeURIComponent(item.product_name || "product")}`),
      }))
    }

    // If no API is available, throw an error
    throw new Error("No order details API configured")
  } catch (error) {
    console.error("Error fetching order details:", error)
    throw error
  }
}

// BESTELLINGEN AANMAKEN //DIAZ CODE
export async function createEmptyORder(customerID: string) {
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

export async function addLinesToOrder(orderID: any, orderLines: any[]) {
  console.log("adding order lines for order: ", orderID)
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

// GET ORDER TOTAL FORM MEGAWIN
// TODO: cannot update the order total after the order is created, and order is not automatically calculated
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

export async function sendToMegawin(orderID: any) {
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
  } catch (error) {
    console.error("Error adding line to order:", error)
  }
}
