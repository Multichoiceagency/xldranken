import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { deleteCustomer } from "@/lib/api_gisteren"

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  // Check if user is authenticated
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

    // Call the API function to delete the customer
    await deleteCustomer(id)

    return ({ success: true, message: "Account deleted successfully" })
  } catch (error) {
    console.error("Error deleting account:", error)
    return ({ error: "Failed to delete account" })
  }
}

