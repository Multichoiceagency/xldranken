'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      localStorage.removeItem("token")
      await signOut({ redirect: false }) // voorkomt redirect naar default page
      router.push("/") // terug naar homepage
    }

    logout()
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex items-center space-x-3 animate-pulse mb-4">
        <Loader2 className="h-6 w-6 text-[#E2B505] animate-spin" />
        <p className="text-lg font-medium text-gray-700">Bezig met uitloggen...</p>
      </div>
      <p className="text-sm text-gray-500">U wordt zo meteen teruggestuurd naar de homepage.</p>
    </div>
  )
}
