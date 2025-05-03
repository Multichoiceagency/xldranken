import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { updateCustomer } from "@/lib/api"

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)

  if (!session) {
    return ({ error: "Unauthorized" })
  }

  try {
    const data = await request.json()
    const { id, ...updateData } = data

    // Validate that the user is only updating their own account
    if (session.user.clcleunik !== id) {
      return "error: Unauthorized to update this account"
    }

    // Call the API function to update the customer
    await updateCustomer(id, updateData)

    return ({ success: true, message: "Account updated successfully" })
  } catch (error) {
    console.error("Error updating account:", error)
    return ({ error: "Failed to update account" })
  }
}

