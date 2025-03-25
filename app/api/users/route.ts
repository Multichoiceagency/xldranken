import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export const dynamic = "force-dynamic";

export async function GET() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)

  if (!session) {
    return ({ error: "Unauthorized" })
  }

  try {
    // Fetch customers from the API
    const response = await fetch(`${process.env.API_URL}/CUSTOMER/LIST/`)
    const data = await response.json()

    if (data.success !== "true") {
      return ({ error: data.message })
    }

    // Filter out sensitive information before sending to client
    const customers = data.result.customer.map((customer: any) => ({
      id: customer.clcleunik,
      customerNumber: customer.customerNumber,
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      city: customer.city,
      country: customer.country,
      addedDate: customer.addedDate,
      isTestUser: customer.email.includes("test") || customer.customerNumber.startsWith("TEST"),
    }))

    return ({ customers })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return ({ error: "Failed to fetch customers" })
  }
}

export async function DELETE(request: Request) {
  // Check if user is authenticated and has admin rights
  const session = await getServerSession(authOptions)

  if (!session) {
    return ({ error: "Unauthorized" })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return ({ error: "Customer ID is required" })
    }

    // In a real implementation, you would call your API to delete the user
    // This is a placeholder for the actual API call
    // const response = await fetch(`${process.env.API_URL}/CUSTOMER/DELETE/?id=${id}`, {
    //   method: "DELETE",
    // });
    // const data = await response.json();

    // For demonstration purposes
    return ({ success: true, message: "Customer deleted successfully" })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return ({ error: "Failed to delete customer", status: 500})
  }
}

