"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertCircle,
  Loader2,
  Send,
  Phone,
  Mail,
  Clock,
  MapPin,
  ExternalLink,
  Facebook,
  Instagram,
  HelpCircle,
  Truck,
  CheckCircle,
  ArrowLeft,
  Home,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import Link from "next/link"

type FieldStatus = "idle" | "success" | "error"
type FormField = "naam" | "email" | "telefoon" | "onderwerp" | "bericht"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("contact")
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [referentieNummer, setReferentieNummer] = useState("")

  const [formData, setFormData] = useState<Record<FormField, string>>({
    naam: "",
    email: "",
    telefoon: "",
    onderwerp: "",
    bericht: "",
  })

  const [fieldStatus, setFieldStatus] = useState<Record<FormField, FieldStatus>>({
    naam: "idle",
    email: "idle",
    telefoon: "idle",
    onderwerp: "idle",
    bericht: "idle",
  })

  // Simple validation for required fields
  const validateField = (name: string, value: string) => {
    if (["naam", "email", "onderwerp", "bericht"].includes(name)) {
      if (!value.trim()) return "error"
      if (name === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value)) return "error"
      return "success"
    }
    if (name === "telefoon" && value.trim() && !/^[\d+\s-]+$/.test(value)) return "error"
    return value.trim() ? "success" : "idle"
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFieldStatus((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFieldStatus((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }))
  }

  // Helper for field border color
  const fieldClass = (name: FormField) =>
    cn(
      "w-full transition-all duration-200",
      fieldStatus[name] === "success" && "border-green-500 focus-visible:ring-green-500",
      fieldStatus[name] === "error" && "border-red-500 focus-visible:ring-red-500",
    )

  // Helper for field icon
  const FieldIcon = ({ status }: { status: FieldStatus }) =>
    status === "success" ? (
      <div className="ml-2">
        <AlertCircle className="text-green-500 h-5 w-5" />
      </div>
    ) : status === "error" ? (
      <div className="ml-2">
        <AlertCircle className="text-red-500 h-5 w-5" />
      </div>
    ) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields before submit
    const newStatus: Record<FormField, FieldStatus> = { ...fieldStatus }
    let hasError = false
    ;(Object.keys(formData) as FormField[]).forEach((key: FormField) => {
      newStatus[key] = validateField(key, formData[key])
      if (newStatus[key] === "error") hasError = true
    })
    setFieldStatus(newStatus)

    if (hasError) {
      setError("Vul alle verplichte velden in")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Maak een FormData object voor het versturen van het formulier
      const submitData = new FormData()

      // Voeg alle formuliervelden toe
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value.toString())
      })

      console.log("Versturen naar /api/contact route...")

      // Simulate API call for demo
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a reference number
      const refNumber = `REF-${Date.now().toString().slice(-6)}`
      setReferentieNummer(refNumber)

      toast({
        title: "Bericht verzonden",
        description: "Bedankt voor uw bericht. We nemen zo spoedig mogelijk contact met u op.",
      })

      // Reset form
      setFormData({
        naam: "",
        email: "",
        telefoon: "",
        onderwerp: "",
        bericht: "",
      })

      setFieldStatus({
        naam: "idle",
        email: "idle",
        telefoon: "idle",
        onderwerp: "idle",
        bericht: "idle",
      })

      // Show success state instead of redirecting
      setIsSubmitSuccess(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      setError(error instanceof Error ? error.message : "Er is een fout opgetreden bij het versturen van het formulier")
    } finally {
      setIsSubmitting(false)
    }
  }

  // If form was successfully submitted, show success component
  if (isSubmitSuccess) {
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
              <p className="mb-4">
                We hebben uw bericht ontvangen en zullen zo spoedig mogelijk contact met u opnemen.
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Referentienummer</p>
                <p className="font-medium">{referentieNummer}</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bewaar dit referentienummer voor toekomstige correspondentie.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => setIsSubmitSuccess(false)} className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug naar contact
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

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-[300px]">
      {/* Hero Section with Image */}
      <div className="relative">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-background"></div>
        <div className="absolute inset-0 z-0">
          <Image src="/winkel/winkel3.jpeg" alt="XL Groothandel showroom" fill className="object-cover" priority />
        </div>
        <div className="relative z-20 container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#BEA46A] to-[#D0C298] bg-clip-text text-transparent">
              Neem direct contact met ons op
            </h1>
            <p className="text-base md:text-lg mb-6 text-white">
              Onze specialisten staan klaar om je te helpen met persoonlijk en vrijblijvend advies. Heeft u vragen of
              opmerkingen? Wij staan voor u klaar en helpen u graag verder.
            </p>
            <Button
              className="bg-gradient-to-r from-[#BEA46A] to-[#D0C298] text-black hover:from-[#A89050] hover:to-[#C0B288] font-medium px-6 py-4 text-base"
              onClick={() => {
                const contactFormElement = document.getElementById("contact-form")
                if (contactFormElement) {
                  contactFormElement.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Neem Contact Op
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold dark:text-white">Contact</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Neem contact met ons op voor vragen of informatie</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-12">
        <Tabs defaultValue="contact" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white shadow-lg">
              <TabsTrigger value="contact" className="px-6 py-3">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="locatie" className="px-6 py-3">
                <MapPin className="mr-2 h-4 w-4" />
                Locatie
              </TabsTrigger>
              <TabsTrigger value="openingstijden" className="px-6 py-3">
                <Clock className="mr-2 h-4 w-4" />
                Openingstijden
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="contact" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card id="contact-form">
                  <CardHeader className="bg-gradient-to-r from-[#0F3059] to-[#1A4980] text-white rounded-t-lg">
                    <CardTitle>Stuur ons een bericht</CardTitle>
                    <CardDescription className="text-white/80">
                      Vul het onderstaande formulier in en we nemen zo snel mogelijk contact met u op
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8">
                    {error && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="naam" className="block text-sm font-medium text-gray-700 mb-1">
                            Naam <span className="text-red-500">*</span>
                          </Label>
                          <div className="flex items-center">
                            <Input
                              id="naam"
                              name="naam"
                              value={formData.naam}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                              className={fieldClass("naam")}
                              placeholder="Uw volledige naam"
                            />
                            <FieldIcon status={fieldStatus.naam} />
                          </div>
                          {fieldStatus.naam === "error" && <p className="text-xs text-red-500 mt-1">Vul uw naam in.</p>}
                        </div>
                        <div>
                          <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            E-mail <span className="text-red-500">*</span>
                          </Label>
                          <div className="flex items-center">
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                              className={fieldClass("email")}
                              placeholder="uw@email.nl"
                            />
                            <FieldIcon status={fieldStatus.email} />
                          </div>
                          {fieldStatus.email === "error" && (
                            <p className="text-xs text-red-500 mt-1">Vul een geldig e-mailadres in.</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="telefoon" className="block text-sm font-medium text-gray-700 mb-1">
                            Telefoon
                          </Label>
                          <div className="flex items-center">
                            <Input
                              id="telefoon"
                              name="telefoon"
                              value={formData.telefoon}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={fieldClass("telefoon")}
                              placeholder="+31 6 18495949"
                            />
                            <FieldIcon status={fieldStatus.telefoon} />
                          </div>
                          {fieldStatus.telefoon === "error" && (
                            <p className="text-xs text-red-500 mt-1">Vul een geldig telefoonnummer in.</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="onderwerp" className="block text-sm font-medium text-gray-700 mb-1">
                            Onderwerp <span className="text-red-500">*</span>
                          </Label>
                          <div className="flex items-center">
                            <Input
                              id="onderwerp"
                              name="onderwerp"
                              value={formData.onderwerp}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                              className={fieldClass("onderwerp")}
                              placeholder="Waar gaat uw vraag over?"
                            />
                            <FieldIcon status={fieldStatus.onderwerp} />
                          </div>
                          {fieldStatus.onderwerp === "error" && (
                            <p className="text-xs text-red-500 mt-1">Vul het onderwerp in.</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bericht" className="block text-sm font-medium text-gray-700 mb-1">
                          Bericht <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-start">
                          <Textarea
                            id="bericht"
                            name="bericht"
                            value={formData.bericht}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            rows={6}
                            className={fieldClass("bericht")}
                            placeholder="Typ hier uw bericht..."
                          />
                          <div className="mt-2">
                            <FieldIcon status={fieldStatus.bericht} />
                          </div>
                        </div>
                        {fieldStatus.bericht === "error" && (
                          <p className="text-xs text-red-500 mt-1">Vul uw bericht in.</p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-[#BEA46A] hover:bg-[#A89050] text-white transition-all duration-300 relative overflow-hidden group"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Versturen...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              Verstuur bericht
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <div className="mt-8">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-[#0F3059] to-[#1A4980] text-white rounded-t-lg">
                      <CardTitle className="flex items-center">
                        <MapPin className="mr-2 h-5 w-5" /> Onze Locatie
                      </CardTitle>
                      <CardDescription className="text-white/80">Bezoek onze winkel in Wateringen</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="aspect-video w-full">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2456.6501567043876!2d4.2825814!3d52.0095339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b1e2d3d8eaab%3A0x89b8e5b4fc4a7a9e!2sTurfschipper%20116%2C%202292%20JB%20Wateringen!5e0!3m2!1sen!2snl!4v1652345678901!5m2!1sen!2snl"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full"
                          onLoad={() => setIsMapLoaded(true)}
                        ></iframe>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Onze winkel is gemakkelijk te bereiken met zowel auto als openbaar vervoer. Er is voldoende
                          gratis parkeergelegenheid voor de deur.
                        </p>
                        <Button variant="outline" className="mt-4" asChild>
                          <a
                            href="https://www.google.com/maps/dir//Turfschipper+116,+2292+JB+Wateringen/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <MapPin className="h-4 w-4" />
                            <span>Route plannen</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-6">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-[#BEA46A] to-[#D0C298] text-white rounded-t-lg">
                      <CardTitle className="flex items-center">
                        <Phone className="mr-2 h-5 w-5" /> Contact Informatie
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-[#BEA46A] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Adres</p>
                            <p className="text-gray-600 dark:text-gray-300">
                              Turfschipper 116
                              <br />
                              2292 JB Wateringen
                              <br />
                              Nederland
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-[#BEA46A] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Telefoon</p>
                            <p className="text-gray-600 dark:text-gray-300">
                              <a href="tel:+31618495949" className="hover:underline">
                                +31 6 18495949
                              </a>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-[#BEA46A] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">E-mail</p>
                            <p className="text-gray-600 dark:text-gray-300">
                              <a href="mailto:info@xlgroothandelbv.nl" className="hover:underline">
                                info@xlgroothandelbv.nl
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Volg ons</h4>
                        <div className="flex space-x-3">
                          <a
                            href="#"
                            className="bg-[#0F3059] text-white p-2 rounded-full hover:bg-[#BEA46A] transition-colors"
                          >
                            <Facebook size={20} />
                          </a>
                          <a
                            href="#"
                            className="bg-[#0F3059] text-white p-2 rounded-full hover:bg-[#BEA46A] transition-colors"
                          >
                            <Instagram size={20} />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-gradient-to-r from-[#0F3059] to-[#1A4980] text-white rounded-t-lg">
                      <CardTitle className="flex items-center">
                        <Clock className="mr-2 h-5 w-5" /> Openingstijden
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Maandag</span>
                          <span className="font-medium">08:00 - 17:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Dinsdag</span>
                          <span className="font-medium">08:00 - 17:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Woensdag</span>
                          <span className="font-medium">08:00 - 17:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Donderdag</span>
                          <span className="font-medium">08:00 - 17:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Vrijdag</span>
                          <span className="font-medium">08:00 - 17:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Zaterdag</span>
                          <span className="font-medium">08:00 - 15:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Zondag</span>
                          <span className="font-medium text-red-500">Gesloten</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4 text-[#BEA46A]" />
                          <span>Tijdens feestdagen kunnen onze openingstijden afwijken</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-0 overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image src="/winkel/winkel3.jpeg" alt="XL Groothandel winkel" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-4 text-white">
                          <h3 className="font-bold text-xl">Onze Winkel</h3>
                          <p className="text-white/80 text-sm">Bezoek onze locatie in Wateringen</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="locatie" className="mt-0">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-[#0F3059] to-[#1A4980] text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" /> Onze Locatie
                </CardTitle>
                <CardDescription className="text-white/80">Gemakkelijk te bereiken vanaf de A4 en A13</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative w-full h-[500px]">
                  {!isMapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <Loader2 className="h-8 w-8 animate-spin text-[#BEA46A]" />
                    </div>
                  )}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2456.6501567043876!2d4.2825814!3d52.0095339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b1e2d3d8eaab%3A0x89b8e5b4fc4a7a9e!2sTurfschipper%20116%2C%202292%20JB%20Wateringen!5e0!3m2!1sen!2snl!4v1652345678901!5m2!1sen!2snl"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className={cn("absolute inset-0 w-full h-full", !isMapLoaded && "opacity-0")}
                    onLoad={() => setIsMapLoaded(true)}
                  ></iframe>
                </div>

                <div className="p-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start">
                      <MapPin className="text-[#BEA46A] mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="font-medium text-gray-900">Adres</h4>
                        <p className="text-gray-600">
                          Turfschipper 116
                          <br />
                          2292 JB Wateringen
                          <br />
                          Nederland
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Truck className="text-[#BEA46A] mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="font-medium text-gray-900">Bereikbaarheid</h4>
                        <p className="text-gray-600">
                          Gemakkelijk bereikbaar met auto
                          <br />
                          Gratis parkeren beschikbaar
                          <br />
                          Laad- en losmogelijkheden
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <HelpCircle className="text-[#BEA46A] mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="font-medium text-gray-900">Hulp nodig?</h4>
                        <p className="text-gray-600">
                          Bel ons voor routebeschrijving
                          <br />
                          <a href="tel:+31618495949" className="text-[#0F3059] hover:underline">
                            +31 6 18495949
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="openingstijden" className="mt-0">
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-[#0F3059] to-[#1A4980] text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" /> Openingstijden
                  </CardTitle>
                  <CardDescription className="text-white/80">Wanneer u bij ons terecht kunt</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Maandag</div>
                      <div className="bg-[#BEA46A] text-white px-3 py-1 rounded-full text-sm">08:00 - 17:00</div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Dinsdag</div>
                      <div className="bg-[#BEA46A] text-white px-3 py-1 rounded-full text-sm">08:00 - 17:00</div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Woensdag</div>
                      <div className="bg-[#BEA46A] text-white px-3 py-1 rounded-full text-sm">08:00 - 17:00</div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Donderdag</div>
                      <div className="bg-[#BEA46A] text-white px-3 py-1 rounded-full text-sm">08:00 - 17:00</div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Vrijdag</div>
                      <div className="bg-[#BEA46A] text-white px-3 py-1 rounded-full text-sm">08:00 - 17:00</div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Zaterdag</div>
                      <div className="bg-[#BEA46A] text-white px-3 py-1 rounded-full text-sm">08:00 - 15:00</div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Zondag</div>
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">Gesloten</div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-start">
                      <HelpCircle className="text-[#BEA46A] mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="font-medium text-gray-900">Speciale openingstijden</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Tijdens feestdagen kunnen onze openingstijden afwijken. Neem contact met ons op voor de
                          actuele openingstijden tijdens feestdagen.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F3059]">Veelgestelde Vragen</h2>
            <div className="w-24 h-1 bg-[#BEA46A] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-start">
                  <HelpCircle className="text-[#BEA46A] mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>Wat zijn de minimale bestelhoeveelheden?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Wij hanteren verschillende minimale bestelhoeveelheden afhankelijk van het product. Voor de meeste
                  producten geldt een minimale afname van één doos of krat. Neem contact met ons op voor specifieke
                  informatie over uw gewenste producten.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-start">
                  <HelpCircle className="text-[#BEA46A] mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>Bezorgen jullie ook aan huis?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ja, wij bezorgen in de regio bij bestellingen boven een bepaald bedrag. Voor exacte informatie over
                  bezorgkosten en -mogelijkheden kunt u contact met ons opnemen.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-start">
                  <HelpCircle className="text-[#BEA46A] mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>Kan ik een zakelijk account aanmaken?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Zeker! Zakelijke klanten kunnen een account aanmaken om van speciale zakelijke prijzen en voordelen te
                  profiteren. Neem contact op met onze klantenservice voor meer informatie.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-start">
                  <HelpCircle className="text-[#BEA46A] mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>Wat is de levertijd van bestellingen?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  De meeste bestellingen worden binnen 1-3 werkdagen geleverd, afhankelijk van uw locatie en de
                  beschikbaarheid van de producten. Bij grote bestellingen nemen we contact met u op om een geschikte
                  levertijd af te spreken.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#0F3059] to-[#1A4980] py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Klaar om contact op te nemen?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Ons team staat klaar om al uw vragen te beantwoorden en u te helpen met uw bestellingen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                setActiveTab("contact")
                const contactFormElement = document.getElementById("contact-form")
                if (contactFormElement) {
                  contactFormElement.scrollIntoView({ behavior: "smooth" })
                }
              }}
              className="bg-[#BEA46A] hover:bg-[#A89050] text-white"
            >
              <Mail className="mr-2 h-4 w-4" />
              Stuur een bericht
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-[#0F3059]"
              asChild
            >
              <a href="tel:+31618495949">
                <Phone className="mr-2 h-4 w-4" />
                Bel ons direct
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
