import dynamic from "next/dynamic"
import { Spinner } from "@/components/ui/spinner"

// Dynamically import the client component with no SSR
// This ensures it only runs on the client side
const AccountDetailsPage = dynamic(
  () => import("@/components/account/account-details-page").then((mod) => ({ default: mod.AccountDetailsPage })),
  {
    ssr: true,
    loading: () => (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="large" className="text-[#E2B505]" />
        <span className="ml-3 text-gray-600">Gegevens laden...</span>
      </div>
    ),
  },
)

export default function AccountDetails() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AccountDetailsPage />
    </div>
  )
}

