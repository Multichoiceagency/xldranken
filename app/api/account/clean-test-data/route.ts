import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import { cleanTestData } from "@/lib/api"

export async function POST(request: Request) {
  // Check if user is authenticated
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

    // Call the API function to clean test data
    await cleanTestData(id)

    return NextResponse.json({ success: true, message: "Test data cleaned successfully" })
  } catch (error) {
    console.error("Error cleaning test data:", error)
    return NextResponse.json({ error: "Failed to clean test data" }, { status: 500 })
  }
}

