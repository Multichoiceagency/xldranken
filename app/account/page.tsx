import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import AccountDetails from "./account-details"
import { getCustomerById } from "@/lib/api_gisteren"

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Get customer data using the best available identifier
  let customerData

  try {
    // First try to get customer by clcleunik if available
    if (session.user.clcleunik) {
      customerData = await getCustomerById(String(session.user.clcleunik))
    }
    // If neither is available, redirect to login
    else {
      console.error("No valid identifier found in session")
      redirect("/login")
    }
  } catch (error) {
    console.error("Error fetching customer data:", error)
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-[#0F3059]">Mijn Account</h1>
      <AccountDetails customerData={customerData} />
    </div>
  )
}

