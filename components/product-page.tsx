'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Heart, Star, Clock, Truck, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ReCAPTCHA } from "@/components/recaptcha"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from '@/contexts/cart-context'
import { AddToCartAnimation } from "./add-to-cart-animation"

// Sample related products data
const relatedProducts = [
  {
    id: "1",
    name: "Pommery Brut Noir",
    price: 29.99,
    originalPrice: 35.99,
    rating: 4.5,
    image: "/placeholder.svg?height=400&width=300",
    country: "Frankrijk",
    volume: "75CL",
  },
  {
    id: "2",
    name: "Moët & Chandon Brut Impérial",
    price: 54.65,
    rating: 4.9,
    image: "/placeholder.svg?height=400&width=300",
    country: "Frankrijk",
    volume: "75CL",
  },
  {
    id: "3",
    name: "Pommery Brut Rosé",
    price: 55.00,
    rating: 4.8,
    image: "/placeholder.svg?height=400&width=300",
    country: "Frankrijk",
    volume: "75CL",
  },
  {
    id: "4",
    name: "Champagne Pannier Brut",
    price: 29.99,
    rating: 4.4,
    image: "/placeholder.svg?height=400&width=300",
    country: "Frankrijk",
    volume: "75CL",
  },
]

// Placeholder function for checking if user is logged in
const isUserLoggedIn = () => {
  // In a real application, this would check the user's authentication state
  return true // For demonstration purposes, always return true
}

export function ProductPage({ id }: { id: string }) {
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([
    { id: 1, author: "Jan D.", rating: 5, comment: "Uitstekende champagne, perfect voor speciale gelegenheden.", date: "2024-01-02" },
    { id: 2, author: "Marie V.", rating: 4, comment: "Heerlijk fris en elegant, goede prijs-kwaliteitverhouding.", date: "2024-01-01" },
  ])

  const [reviewForm, setReviewForm] = useState({
    rating: "5",
    name: "",
    comment: ""
  })

  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { toast } = useToast()
  const [showAnimation, setShowAnimation] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    setIsLoggedIn(isUserLoggedIn())
  }, [])

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!recaptchaToken) {
      toast({
        title: "reCAPTCHA verificatie vereist",
        description: "Voltooi de reCAPTCHA verificatie om uw review te plaatsen.",
        variant: "destructive",
      })
      return
    }
    const newReview = {
      id: reviews.length + 1,
      author: reviewForm.name,
      rating: parseInt(reviewForm.rating),
      comment: reviewForm.comment,
      date: new Date().toISOString().split('T')[0]
    }
    setReviews([newReview, ...reviews])
    setReviewForm({ rating: "5", name: "", comment: "" })
    setRecaptchaToken(null)
    toast({
      title: "Review geplaatst",
      description: "Bedankt voor uw review!",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <Link href="/mousserend" className="text-muted-foreground hover:text-foreground">
          Mousserend
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <Link href="/champagne" className="text-muted-foreground hover:text-foreground">
          Champagne
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-[#FF6B35]">Pommery Brut Royal</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/80 hover:bg-white"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <img
            src="/placeholder.svg?height=600&width=600"
            alt="Pommery Brut Royal"
            className="object-contain p-8 h-full w-full"
          />
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img
              src="/placeholder.svg?height=20&width=30"
              alt="French flag"
              className="rounded h-6 w-10"
            />
            <span className="text-sm">Champagne</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">4.8 (174)</span>
          </div>

          <h1 className="text-3xl font-bold mb-4">Pommery Brut Royal</h1>
          <p className="text-sm text-muted-foreground mb-4">Frankrijk • Pinot noir, Chardonnay</p>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold text-[#FF6B35]">34.99</span>
            <span className="text-sm text-muted-foreground line-through">42.99</span>
          </div>

          <p className="text-sm mb-6">
            Met deze levendige en delicate champagne uit de koningsklasse fles kom je zeker goed voor de dag. 
            Geschikt voor een bijzonder moment om te proosten op het leven. De wijn is rond, uitgebreid, delicaat en langdurig. 
            De smaak is zuiver zonder droog te zijn.
          </p>

          <div className="flex gap-4 mb-6">
            <Button 
              className="flex-1 bg-[#FF6B35] hover:bg-[#E85A24]"
              onClick={() => {
                addToCart({
                  id,
                  name: "Pommery Brut Royal",
                  price: 34.99,
                  quantity: 1,
                  image: "/placeholder.svg?height=600&width=600",
                })
                setShowAnimation(true)
              }}
            >
              FLES
              <span className="ml-2">+</span>
            </Button>
            <Button className="flex-1" variant="outline">
              DOOS IN
              <span className="ml-2">+</span>
            </Button>
          </div>

          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-[#FF6B35]" />
              <span>Bestel voor 22:00 vandaag, morgen in huis</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-[#FF6B35]" />
              <span>Gratis bezorging vanaf € 55,-</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-[#FF6B35]" />
              <span>Veilig betalen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="taste">
              <AccordionTrigger>SMAAK</AccordionTrigger>
              <AccordionContent>
                Fris en elegant...
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pairing">
              <AccordionTrigger>LEKKER BIJ</AccordionTrigger>
              <AccordionContent>
                Het aperitief - lunch en recepties
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="reviews">
              <AccordionTrigger>REVIEWS</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  {/* Existing Reviews */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.author}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Review Form */}
                  {isLoggedIn ? (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Schrijf een review</h4>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Beoordeling</Label>
                          <RadioGroup
                            className="flex gap-4"
                            defaultValue="5"
                            onValueChange={(value) => setReviewForm({ ...reviewForm, rating: value })}
                          >
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <Label
                                key={rating}
                                className="flex items-center gap-2 cursor-pointer [&:has(:checked)]:text-[#FF6B35]"
                              >
                                <RadioGroupItem value={rating.toString()} className="peer" />
                                <div className="flex">
                                  {[...Array(rating)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="h-4 w-4 peer-checked:fill-yellow-400 peer-checked:text-yellow-400"
                                    />
                                  ))}
                                </div>
                              </Label>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="name">Naam</Label>
                          <Input
                            id="name"
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="comment">Review</Label>
                          <Textarea
                            id="comment"
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            required
                            className="min-h-[100px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>reCAPTCHA Verificatie</Label>
                          <ReCAPTCHA
                            sitekey="YOUR_RECAPTCHA_SITE_KEY"
                            onChange={setRecaptchaToken}
                          />
                        </div>

                        <Button type="submit" className="bg-[#FF6B35] hover:bg-[#E85A24]">
                          Review plaatsen
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <div className="border-t pt-6">
                      <p className="text-center text-muted-foreground">
                        U moet ingelogd zijn om een review te plaatsen.{" "}
                        <Link href="/login" className="text-[#FF6B35] hover:underline">
                          Log in
                        </Link>
                        {" "}om een review te schrijven.
                      </p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="grapes">
              <AccordionTrigger>DRUIVENSOORT</AccordionTrigger>
              <AccordionContent>
                Pinot noir, Chardonnay
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Ontdek wijnhuis POMMERY</h3>
            <img
              src="/placeholder.svg?height=200&width=400"
              alt="Pommery winery"
              className="rounded-lg mb-4 h-48 w-full"
            />
            <p className="text-sm text-muted-foreground mb-4">
              Madame Pommery was haar tijd ver vooruit toen ze in 1858 het nog jonge champagnehuis overnam. 
              Vooral met het verzamelen van de beste wijngaarden...
            </p>
            <Button variant="link" className="p-0 h-auto text-[#FF6B35]">
              LEES VERDER
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Related Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">ANDEREN KOCHTEN OOK</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {relatedProducts.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/4">
                <Card>
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 z-10 rounded-full bg-white/80 hover:bg-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-contain p-4 h-full w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <img
                          src="/placeholder.svg?height=16&width=24"
                          alt={`${product.country} flag`}
                          className="rounded h-5 w-8"
                        />
                        <span className="text-xs">{product.country}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">€{product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            €{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.volume}</p>
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-[#FF6B35] hover:bg-[#E85A24]">
                          FLES
                          <span className="ml-2">+</span>
                        </Button>
                        <Button className="flex-1" variant="outline">
                          DOOS IN
                          <span className="ml-2">+</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <AddToCartAnimation
        isVisible={showAnimation}
        onAnimationComplete={() => setShowAnimation(false)}
        productName="Pommery Brut Royal"
        productPrice={34.99}
        productImage="/placeholder.svg?height=600&width=600"
      />
    </div>
  )
}

