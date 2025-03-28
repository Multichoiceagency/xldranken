import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { updateCustomer } from "@/lib/api"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { id, ...updateData } = data

    // Validate that the user is only updating their own account
    if (session.user.clcleunik !== id) {
      return NextResponse.json({ error: "Unauthorized to update this account" }, { status: 403 })
    }

    // Call the API function to update the customer
    await updateCustomer(id, updateData)

    return NextResponse.json({ success: true, message: "Account updated successfully" })
  } catch (error) {
    console.error("Error updating account:", error)
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 })
  }
}