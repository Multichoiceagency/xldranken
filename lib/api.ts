import type { ProductProps } from "@/types/product"

// Get environment variables
const PRODUCT_API_URL = process.env.NEXT_PUBLIC_API_URL
const CUSTOMER_API_URL = process.env.NEXT_PUBLIC_CUSTOMER_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export const menuItemsList = [
  {
    name: "ALCOHOL",
    href: "/categorie/sterke-drank",
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
    id: "18",
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
        id: "12",
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
    id: "14",
    submenu: [],
  },
  {
    name: "NON-FOOD",
    href: "/categorie/non-food",
    id: "21",
    submenu: [
      {
        name: "SCHOONMAAK",
        href: "/categorie/schoonmaak",
        id: "22",
      },
      {
        name: "HOUTSKOOL",
        href: "/categorie/houtskool",
        id: "19",
      },
    ],
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
export async function getProductsByFam2ID(fam2ID: string, limit: number, page: number): Promise<ProductProps[]> {
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
export function addLinesToOeder(orderLines: any) {
  console.log(orderLines)
}

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

export async function handleOrders(orderData: any, customerID: any) {
  console.log("order data: ", orderData)
  console.log("customer id: ", customerID)
  try {
    const orderID = await createEmptyORder(customerID.clcleunik)

    console.log(orderID)
  } catch (error) {
    console.log(error)
  }
}
