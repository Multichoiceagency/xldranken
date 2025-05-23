"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

export default function ContactSuccessPage() {
  const searchParams = useSearchParams()
  const referentieNummer = searchParams.get("referentieNummer") || "UNKNOWN"

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="container max-w-md mx-auto px-4">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-green-100 dark:bg-green-900 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Bericht verzonden!</CardTitle>
            <CardDescription>Bedankt voor uw bericht</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">We hebben uw bericht ontvangen en zullen zo spoedig mogelijk contact met u opnemen.</p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Referentienummer</p>
              <p className="font-medium">{referentieNummer}</p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bewaar dit referentienummer voor toekomstige correspondentie.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/contact" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug naar contact
              </Link>
            </Button>
            <Button asChild className="bg-[#BEA46A] hover:bg-[#A89050] text-black">
              <Link href="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Naar homepage
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
