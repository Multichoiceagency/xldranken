'use client'

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"

const paymentMethods = [
  { id: 'ideal', name: 'iDEAL', logo: '/placeholder.svg?height=30&width=60' },
  { id: 'credit-card', name: 'Credit Card', logo: '/placeholder.svg?height=30&width=60' },
  { id: 'paypal', name: 'PayPal', logo: '/placeholder.svg?height=30&width=60' },
  { id: 'afterpay', name: 'Betalen na 7 dagen van factuurdatum', logo: '/placeholder.svg?height=30&width=60' },
  { id: 'bancontact', name: 'Bancontact', logo: '/placeholder.svg?height=30&width=60' },
]

export function PaymentMethodsPage({ onBack, onComplete }: { onBack: () => void, onComplete: () => void }) {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id)
  const [isProcessing, setIsProcessing] = useState(false)
  const { getCartTotal } = useCart()
  const { totalPrice } = getCartTotal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    // Placeholder for payment processing
    console.log('Payment processing placeholder')
    setIsProcessing(false)
    // For now, just call onComplete to simulate successful payment
    onComplete()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Kies je betaalmethode</h1>
      <form onSubmit={handleSubmit}>
        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-2 border p-4 rounded-md mb-4">
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="flex items-center justify-between flex-1">
                <span>{method.name}</span>
                <Image src={method.logo} alt={method.name} width={60} height={30} />
              </Label>
            </div>
          ))}
        </RadioGroup>

        {selectedMethod === 'ideal' && (
          <div className="mt-4">
            <Label htmlFor="bank">Kies je bank</Label>
            <select id="bank" className="w-full mt-1 p-2 border rounded-md">
              <option>ABN AMRO</option>
              <option>ING</option>
              <option>Rabobank</option>
              <option>SNS Bank</option>
              <option>ASN Bank</option>
              <option>RegioBank</option>
              <option>Bunq</option>
              <option>Knab</option>
              <option>Triodos Bank</option>
              <option>Van Lanschot</option>
            </select>
          </div>
        )}

        {selectedMethod === 'credit-card' && (
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <Input id="card-number" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="flex-1">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between items-center">
          <Button type="button" variant="outline" onClick={onBack}>
            Terug
          </Button>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Totaal te betalen</p>
            <p className="text-2xl font-bold">€ {totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full mt-4 bg-[#FF6B35] hover:bg-[#E85A24] text-white"
          disabled={isProcessing}
        >
          {isProcessing ? 'Verwerken...' : 'Betalen'}
        </Button>
      </form>
    </div>
  )
}

