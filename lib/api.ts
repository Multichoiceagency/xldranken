import type { ProductProps } from "@/types/product"

// Get environment variables
const PRODUCT_API_URL = process.env.NEXT_PUBLIC_API_URL
const CUSTOMER_API_URL = process.env.NEXT_PUBLIC_CUSTOMER_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

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

export async function getProductsByFam2ID(fam2ID: string): Promise<ProductProps[]> {
  try {
    // Construct the URL for products
    const url = constructApiUrl("", { fam2ID }, false)
    console.log("Fetching products from URL:", url) // Debug log

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Ensure products is always an array
    return Array.isArray(data.result?.product) ? data.result.product : []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
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
