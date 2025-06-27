import { CheckCircle, Home, ShoppingBag } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

interface CheckoutCompleteProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function CheckoutComplete({ searchParams }: CheckoutCompleteProps) {
  const orderNumber = searchParams["orderNumber"]
  const error = searchParams["error"]

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Er is iets fout gegaan!</h2>
        <p className="mb-4">
          Er is een fout opgetreden bij het verwerken van je bestelling. Probeer het later opnieuw.
        </p>
        <Link href="/">
          <Button className="w-full bg-[#FF6B35] hover:bg-[#E85A24]">Terug naar webwinkel</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
      <h2 className="text-2xl font-bold">Bedankt voor je bestelling!</h2>
      <p className="mb-4">
        Je bestelling is succesvol geplaatst en wordt zo snel mogelijk verwerkt. Je ordernummer is: <b>{orderNumber}</b>
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/">
          <Button variant="outline" className="w-full h-12 bg-transparent">
            <Home className="w-5 h-5 mr-2" />
            Terug naar webwinkel
          </Button>
        </Link>
        <Link href="/categorie">
          <Button className="w-full h-12 bg-[#FF6B35] hover:bg-[#E85A24]">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Verder winkelen
          </Button>
        </Link>
      </div>
    </div>
  )
}
