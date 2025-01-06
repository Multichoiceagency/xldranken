'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCart } from "@/lib/cart-context"
import { PaymentMethodsPage } from "./payment-methods-page"

const getDeliveryDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip Sunday (0) and Saturday (6)
      dates.push({
        day: date.toLocaleDateString('nl-NL', { weekday: 'short' }),
        date: date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
      });
    }
  }
  return dates;
};

const deliveryDates = getDeliveryDates();

const deliveryTimes = [
  { label: 'Standaard levering (+ € 0.00)', value: 'standard' },
  { label: 'Ochtend (+ € 2.00)', value: 'morning' },
  { label: 'Middag (+ € 2.00)', value: 'afternoon' },
  { label: 'Avond (+ € 2.00)', value: 'evening' },
]

export function CheckoutPage() {
  const [step, setStep] = useState<'delivery' | 'payment'>('delivery')
  const [deliveryOption, setDeliveryOption] = useState<"delivery" | "pickup">("delivery")
  const [selectedDate, setSelectedDate] = useState(deliveryDates[0])
  const [differentBillingAddress, setDifferentBillingAddress] = useState(false)
  const { cart, getCartTotal } = useCart()
  const { totalPrice } = getCartTotal()
  const shippingCost = deliveryOption === "delivery" ? 4.95 : 0
  const subtotal = totalPrice;
  const total = subtotal + shippingCost

  const handleContinue = () => {
    setStep('payment')
  }

  const handleBack = () => {
    setStep('delivery')
  }

  const handleComplete = () => {
    // Here you would typically handle the completion of the checkout process
    console.log('Checkout completed')
  }

  if (step === 'payment') {
    return <PaymentMethodsPage onBack={handleBack} onComplete={handleComplete} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Delivery Options */}
          <div className="flex-1 space-y-8">
            <nav className="flex gap-8 border-b">
              <button className="font-medium text-primary border-b-2 border-primary pb-4">
                Bezorging
              </button>
              <button className="font-medium text-gray-400 pb-4">
                Betaalmethode
              </button>
            </nav>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold mb-6">BEZORGING</h1>

              <RadioGroup
                defaultValue="delivery"
                onValueChange={(value) => setDeliveryOption(value as "delivery" | "pickup")}
              >
                <div className="space-y-6">
                  {/* Home Delivery Option */}
                  <div className="flex items-start">
                    <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                    <div className="ml-3 flex-1">
                      <Label htmlFor="delivery" className="font-medium">
                        Bezorgen (thuis of op een ander adres)
                      </Label>
                      <div className="text-right text-primary font-medium">€ 4,95</div>

                      {deliveryOption === "delivery" && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <Label>MIJN ADRES</Label>
                            <Input placeholder="Naam" className="mt-1" />
                            <Input placeholder="Straat en huisnummer" className="mt-2" />
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <Input placeholder="Postcode" />
                              <Input placeholder="Plaats" />
                            </div>
                          </div>

                          <div className="flex gap-4 text-sm">
                            <button className="text-primary hover:underline">
                              Wijzig mijn adres
                            </button>
                            <button className="text-primary hover:underline">
                              Ander bezorgadres
                            </button>
                          </div>

                          <div>
                            <Label>Bezorgdag</Label>
                            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                              {deliveryDates.map((date) => (
                                <button
                                  key={date.date}
                                  onClick={() => setSelectedDate(date)}
                                  className={`flex flex-col items-center min-w-[64px] p-2 border rounded-md ${
                                    selectedDate === date
                                      ? "border-primary bg-primary/5"
                                      : "border-gray-200"
                                  }`}
                                >
                                  <span className="text-sm font-medium">{date.day}</span>
                                  <span className="text-sm">{date.date}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label>Bezorgtijd</Label>
                            <Select defaultValue="standard">
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecteer bezorgtijd" />
                              </SelectTrigger>
                              <SelectContent>
                                {deliveryTimes.map((time) => (
                                  <SelectItem key={time.value} value={time.value}>
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center gap-2 bg-blue-50 p-4 rounded-md">
                            <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <p className="text-sm">
                              Let op! Het is niet mogelijk om je pakket te laten leveren bij je buren
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <Checkbox
                              id="billing"
                              checked={differentBillingAddress}
                              onCheckedChange={(checked) => 
                                setDifferentBillingAddress(checked as boolean)
                              }
                            />
                            <Label htmlFor="billing" className="text-sm">
                              Afwijkend factuuradres (factuur wordt verstuurd per email)
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Store Pickup Option */}
                  <div className="flex items-start">
                    <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor="pickup" className="font-medium">
                        Ophalen in een Gall & Gall winkel
                      </Label>
                      <div className="text-right text-green-600 font-medium">Gratis</div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-bold mb-4">JOUW OVERZICHT</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.quantity} × {item.name}</span>
                    <span>€ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-medium pt-4 border-t">
                  <span>Subtotaal</span>
                  <span>€ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Verzendkosten</span>
                  <span>€ {shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-4 border-t">
                  <span>Totaal</span>
                  <span>€ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col m</continuation_point>d:flex-row justify-between items-center gap-4">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            TERUG NAAR WINKELWAGEN
          </Button>
          <div className="flex flex-col items-center gap-4">
            <Button className="bg-[#FF6B35] hover:bg-[#E85A24] text-white min-w-[200px]" onClick={handleContinue}>
              DOORGAAN
            </Button>
            <div className="flex gap-4">
              <Image
                src="/placeholder.svg?height=24&width=38"
                alt="iDEAL"
                width={38}
                height={24}
              />
              <Image
                src="/placeholder.svg?height=24&width=38"
                alt="Mastercard"
                width={38}
                height={24}
              />
              <Image
                src="/placeholder.svg?height=24&width=38"
                alt="Visa"
                width={38}
                height={24}
              />
            </div>
            <div className="text-sm text-center text-gray-500">
              <p>Heb je onze hulp nodig?</p>
              <div className="flex gap-2 justify-center">
                <Link href="/chat" className="text-primary hover:underline">
                  Chat met ons
                </Link>
                <span>of</span>
                <Link href="/feedback" className="text-primary hover:underline">
                  geef feedback
                </Link>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Dit formulier is beschermd met reCaptcha, het{" "}
              <Link href="/privacy" className="underline">
                privacybeleid
              </Link>
              {" "}en{" "}
              <Link href="/terms" className="underline">
                servicevoorwaarden
              </Link>
              {" "}zijn van toepassing.
            </div>
          </div>
          <div className="w-[200px]" /> {/* Spacer for layout balance */}
        </div>
      </div>
    </div>
  )
}

