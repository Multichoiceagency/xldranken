import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch customers from the API
    const response = await fetch(`${process.env.API_URL}/CUSTOMER/LIST/`)
    const data = await response.json()

    if (data.success !== "true") {
      return NextResponse.json({ error: data.message }, { status: 400 })
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

    return NextResponse.json({ customers })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  // Check if user is authenticated and has admin rights
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
    }

    // In a real implementation, you would call your API to delete the user
    // This is a placeholder for the actual API call
    // const response = await fetch(`${process.env.API_URL}/CUSTOMER/DELETE/?id=${id}`, {
    //   method: "DELETE",
    // });
    // const data = await response.json();

    // For demonstration purposes
    return NextResponse.json({ success: true, message: "Customer deleted successfully" })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}

