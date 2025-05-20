"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Send, MapPin, Phone, Mail, Clock, CheckCircle, XCircle } from "lucide-react"
import clsx from "clsx"

type FieldStatus = "idle" | "success" | "error"

type FormField = "naam" | "email" | "telefoon" | "onderwerp" | "bericht"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
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
      toast({
        title: "Fout",
        description: "Controleer de velden en probeer opnieuw.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Bericht verzonden",
          description: "Bedankt voor uw bericht. We nemen zo spoedig mogelijk contact met u op.",
          variant: "default",
        })
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
      } else {
        throw new Error(data.error || "Er is iets misgegaan")
      }
    } catch (error) {
      toast({
        title: "Fout",
        description: error instanceof Error ? error.message : "Er is iets misgegaan bij het verzenden van uw bericht",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper for field border color
  const fieldClass = (name: FormField) =>
    clsx(
      "w-full",
      fieldStatus[name] === "success" && "border-green-500 focus-visible:ring-green-500",
      fieldStatus[name] === "error" && "border-red-500 focus-visible:ring-red-500",
    )

  // Helper for field icon
  const FieldIcon = ({ status }: { status: FieldStatus }) =>
    status === "success" ? (
      <CheckCircle className="text-green-500 ml-2" size={20} />
    ) : status === "error" ? (
      <XCircle className="text-red-500 ml-2" size={20} />
    ) : null

  return (
    <div>
      {/* Hero Section with Google Maps */}
      <div className="relative w-full h-[350px] md:h-[450px] lg:h-[550px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2456.6501567043876!2d4.2825814!3d52.0095339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b1e2d3d8eaab%3A0x89b8e5b4fc4a7a9e!2sTurfschipper%20116%2C%202292%20JB%20Wateringen!5e0!3m2!1sen!2snl!4v1652345678901!5m2!1sen!2snl"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full"
        ></iframe>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center">Contact</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="w-24 h-1 bg-[#D0C298] mx-auto mb-12"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mx-auto my-auto md:h-auto">
            <h2 className="text-2xl font-semibold mb-6 text-[#0F3059]">Stuur ons een bericht</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="naam" className="block text-sm font-medium text-gray-700 mb-1">
                    Naam *
                  </label>
                  <div className="flex items-center">
                    <Input
                      id="naam"
                      name="naam"
                      value={formData.naam}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={fieldClass("naam")}
                    />
                    <FieldIcon status={fieldStatus.naam} />
                  </div>
                  {fieldStatus.naam === "error" && <p className="text-xs text-red-500 mt-1">Vul uw naam in.</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail *
                  </label>
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
                  <label htmlFor="telefoon" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefoon
                  </label>
                  <div className="flex items-center">
                    <Input
                      id="telefoon"
                      name="telefoon"
                      value={formData.telefoon}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={fieldClass("telefoon")}
                    />
                    <FieldIcon status={fieldStatus.telefoon} />
                  </div>
                  {fieldStatus.telefoon === "error" && (
                    <p className="text-xs text-red-500 mt-1">Vul een geldig telefoonnummer in.</p>
                  )}
                </div>
                <div>
                  <label htmlFor="onderwerp" className="block text-sm font-medium text-gray-700 mb-1">
                    Onderwerp *
                  </label>
                  <div className="flex items-center">
                    <Input
                      id="onderwerp"
                      name="onderwerp"
                      value={formData.onderwerp}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={fieldClass("onderwerp")}
                    />
                    <FieldIcon status={fieldStatus.onderwerp} />
                  </div>
                  {fieldStatus.onderwerp === "error" && (
                    <p className="text-xs text-red-500 mt-1">Vul het onderwerp in.</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="bericht" className="block text-sm font-medium text-gray-700 mb-1">
                  Bericht *
                </label>
                <div className="flex items-center">
                  <Textarea
                    id="bericht"
                    name="bericht"
                    value={formData.bericht}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    rows={6}
                    className={fieldClass("bericht")}
                  />
                  <FieldIcon status={fieldStatus.bericht} />
                </div>
                {fieldStatus.bericht === "error" && <p className="text-xs text-red-500 mt-1">Vul uw bericht in.</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0F3059] hover:bg-[#0F3059]/90 text-white w-full md:w-auto"
              >
                {isSubmitting ? "Verzenden..." : "Verstuur bericht"}
                <Send size={16} className="ml-2" />
              </Button>
            </form>
          </div>

          {/* Store Information */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
              <h3 className="text-xl font-semibold mb-6 text-[#BEA46A]">Bezoek Onze Winkel</h3>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <div className="relative h-64 md:h-full w-full rounded-lg overflow-hidden">
                    <Image src="/winkel/winkel3.jpeg" alt="XL Dranken winkel" fill className="object-cover" />
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="flex items-start mb-4">
                    <Clock className="text-[#0F3059] mr-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-medium text-lg mb-2">Openingstijden</h4>
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between">
                          <span>Maandag t/m Vrijdag</span>
                          <span>09:00 - 18:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Zaterdag</span>
                          <span>09:00 - 17:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Zondag</span>
                          <span>Gesloten</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start mb-4">
                    <MapPin className="text-[#0F3059] mr-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-medium text-lg mb-2">Adres</h4>
                      <p className="text-gray-700 mb-4">
                        Turfschipper 116
                        <br />
                        2292 JB Wateringen
                        <br />
                        Nederland
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center">
                        <Phone className="text-[#0F3059] mr-3 flex-shrink-0" size={20} />
                        <a href="tel:+31618495949" className="text-gray-700 hover:text-[#0F3059] hover:underline">
                          +31 6 18495949
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Mail className="text-[#0F3059] mr-3 flex-shrink-0" size={20} />
                        <a
                          href="mailto:info@xlgroothandelbv.nl"
                          className="text-gray-700 hover:text-[#0F3059] hover:underline"
                        >
                          info@xlgroothandelbv.nl
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4 text-[#BEA46A]">Locatie</h3>
              <div className="relative w-full h-80 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2456.6501567043876!2d4.2825814!3d52.0095339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b1e2d3d8eaab%3A0x89b8e5b4fc4a7a9e!2sTurfschipper%20116%2C%202292%20JB%20Wateringen!5e0!3m2!1sen!2snl!4v1652345678901!5m2!1sen!2snl"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
