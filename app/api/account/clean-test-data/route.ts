import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { cleanTestData } from "@/lib/api_gisteren"
export const dynamic = "force-dynamic";


export async function POST(request: Request) {
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

    // Call the API function to clean test data
    await cleanTestData(id)

    return ({ success: true, message: "Test data cleaned successfully" })
  } catch (error) {
    console.error("Error cleaning test data:", error)
    return ({ error: "Failed to clean test data" })
  }
}

