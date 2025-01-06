import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function CheckoutCompletePage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Bedankt voor je bestelling!</h1>
      <p className="mb-8">We hebben je bestelling ontvangen en zullen deze zo snel mogelijk verwerken.</p>
      <Button asChild>
        <Link href="/">Terug naar de homepagina</Link>
      </Button>
    </div>
  )
}

