"use client"

import type React from "react"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"

export function ZakelijkRegistratieForm() {
  const [formData, setFormData] = useState({
    bedrijfsnaam: "",
    kvkNummer: "",
    btwNummer: "",
    adres: "",
    postcode: "",
    plaats: "",
    contactpersoonVoornaam: "",
    contactpersoonAchternaam: "",
    functie: "",
    email: "",
    telefoon: "",
    branche: "",
    aantalMedewerkers: "",
    geschatteAfname: "",
    opmerkingen: "",
    voorwaarden: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.bedrijfsnaam.trim()) newErrors.bedrijfsnaam = "Bedrijfsnaam is verplicht"
    if (!formData.kvkNummer.trim()) newErrors.kvkNummer = "KVK-nummer is verplicht"
    if (!formData.btwNummer.trim()) newErrors.btwNummer = "BTW-nummer is verplicht"
    if (!formData.adres.trim()) newErrors.adres = "Adres is verplicht"
    if (!formData.postcode.trim()) newErrors.postcode = "Postcode is verplicht"
    if (!formData.plaats.trim()) newErrors.plaats = "Plaats is verplicht"
    if (!formData.contactpersoonVoornaam.trim()) newErrors.contactpersoonVoornaam = "Voornaam is verplicht"
    if (!formData.contactpersoonAchternaam.trim()) newErrors.contactpersoonAchternaam = "Achternaam is verplicht"
    if (!formData.email.trim()) newErrors.email = "E-mailadres is verplicht"
    if (!formData.telefoon.trim()) newErrors.telefoon = "Telefoonnummer is verplicht"
    if (!formData.branche) newErrors.branche = "Selecteer uw branche"
    if (!formData.voorwaarden) newErrors.voorwaarden = "U moet akkoord gaan met de voorwaarden"

    // Format validations
    if (formData.kvkNummer.trim() && !/^\d{8}$/.test(formData.kvkNummer.trim())) {
      newErrors.kvkNummer = "KVK-nummer moet 8 cijfers bevatten"
    }

    if (formData.btwNummer.trim() && !/^NL\d{9}B\d{2}$/i.test(formData.btwNummer.trim())) {
      newErrors.btwNummer = "BTW-nummer moet het formaat NL123456789B01 hebben"
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Voer een geldig e-mailadres in"
    }

    if (formData.postcode.trim() && !/^\d{4}\s?[a-zA-Z]{2}$/.test(formData.postcode.trim())) {
      newErrors.postcode = "Voer een geldige postcode in (bijv. 1234 AB)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real application, you would send the data to your API here
      console.log("Form submitted:", formData)

      setSubmitStatus("success")
      // Optionally reset form after successful submission
      // setFormData({ ...initialFormState })
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success/Error Messages */}
      {submitStatus === "success" && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-green-800 font-medium">Aanvraag succesvol ingediend!</h3>
              <p className="text-green-700 text-sm mt-1">
                Bedankt voor uw aanvraag. We nemen binnen 1-2 werkdagen contact met u op om uw zakelijk account te
                activeren.
              </p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-red-800 font-medium">Er is een fout opgetreden</h3>
              <p className="text-red-700 text-sm mt-1">
                We konden uw aanvraag niet verwerken. Probeer het later opnieuw of neem contact op met onze
                klantenservice.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bedrijfsgegevens */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Bedrijfsgegevens</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bedrijfsnaam" className="block text-sm font-medium text-gray-700 mb-1">
              Bedrijfsnaam *
            </label>
            <input
              type="text"
              id="bedrijfsnaam"
              name="bedrijfsnaam"
              value={formData.bedrijfsnaam}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.bedrijfsnaam ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.bedrijfsnaam && <p className="mt-1 text-sm text-red-600">{errors.bedrijfsnaam}</p>}
          </div>

          <div>
            <label htmlFor="kvkNummer" className="block text-sm font-medium text-gray-700 mb-1">
              KVK-nummer *
            </label>
            <input
              type="text"
              id="kvkNummer"
              name="kvkNummer"
              value={formData.kvkNummer}
              onChange={handleChange}
              placeholder="12345678"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.kvkNummer ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.kvkNummer && <p className="mt-1 text-sm text-red-600">{errors.kvkNummer}</p>}
          </div>

          <div>
            <label htmlFor="btwNummer" className="block text-sm font-medium text-gray-700 mb-1">
              BTW-nummer *
            </label>
            <input
              type="text"
              id="btwNummer"
              name="btwNummer"
              value={formData.btwNummer}
              onChange={handleChange}
              placeholder="NL123456789B01"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.btwNummer ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.btwNummer && <p className="mt-1 text-sm text-red-600">{errors.btwNummer}</p>}
          </div>

          <div>
            <label htmlFor="branche" className="block text-sm font-medium text-gray-700 mb-1">
              Branche *
            </label>
            <select
              id="branche"
              name="branche"
              value={formData.branche}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.branche ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            >
              <option value="">Selecteer uw branche</option>
              <option value="horeca">Horeca (café, restaurant, hotel)</option>
              <option value="retail">Retail (avondwinkel, supermarkt)</option>
              <option value="catering">Catering</option>
              <option value="evenementen">Evenementenbureau</option>
              <option value="kantoor">Kantoor/Bedrijf</option>
              <option value="anders">Anders</option>
            </select>
            {errors.branche && <p className="mt-1 text-sm text-red-600">{errors.branche}</p>}
          </div>
        </div>
      </div>

      {/* Adresgegevens */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Adresgegevens</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="adres" className="block text-sm font-medium text-gray-700 mb-1">
              Adres *
            </label>
            <input
              type="text"
              id="adres"
              name="adres"
              value={formData.adres}
              onChange={handleChange}
              placeholder="Straatnaam en huisnummer"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.adres ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.adres && <p className="mt-1 text-sm text-red-600">{errors.adres}</p>}
          </div>

          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
              Postcode *
            </label>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              placeholder="1234 AB"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.postcode ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.postcode && <p className="mt-1 text-sm text-red-600">{errors.postcode}</p>}
          </div>

          <div>
            <label htmlFor="plaats" className="block text-sm font-medium text-gray-700 mb-1">
              Plaats *
            </label>
            <input
              type="text"
              id="plaats"
              name="plaats"
              value={formData.plaats}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.plaats ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.plaats && <p className="mt-1 text-sm text-red-600">{errors.plaats}</p>}
          </div>
        </div>
      </div>

      {/* Contactpersoon */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Contactpersoon</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactpersoonVoornaam" className="block text-sm font-medium text-gray-700 mb-1">
              Voornaam *
            </label>
            <input
              type="text"
              id="contactpersoonVoornaam"
              name="contactpersoonVoornaam"
              value={formData.contactpersoonVoornaam}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.contactpersoonVoornaam ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.contactpersoonVoornaam && (
              <p className="mt-1 text-sm text-red-600">{errors.contactpersoonVoornaam}</p>
            )}
          </div>

          <div>
            <label htmlFor="contactpersoonAchternaam" className="block text-sm font-medium text-gray-700 mb-1">
              Achternaam *
            </label>
            <input
              type="text"
              id="contactpersoonAchternaam"
              name="contactpersoonAchternaam"
              value={formData.contactpersoonAchternaam}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.contactpersoonAchternaam ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.contactpersoonAchternaam && (
              <p className="mt-1 text-sm text-red-600">{errors.contactpersoonAchternaam}</p>
            )}
          </div>

          <div>
            <label htmlFor="functie" className="block text-sm font-medium text-gray-700 mb-1">
              Functie
            </label>
            <input
              type="text"
              id="functie"
              name="functie"
              value={formData.functie}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F3059]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mailadres *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="telefoon" className="block text-sm font-medium text-gray-700 mb-1">
              Telefoonnummer *
            </label>
            <input
              type="tel"
              id="telefoon"
              name="telefoon"
              value={formData.telefoon}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.telefoon ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.telefoon && <p className="mt-1 text-sm text-red-600">{errors.telefoon}</p>}
          </div>
        </div>
      </div>

      {/* Aanvullende informatie */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Aanvullende informatie</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="aantalMedewerkers" className="block text-sm font-medium text-gray-700 mb-1">
              Aantal medewerkers
            </label>
            <select
              id="aantalMedewerkers"
              name="aantalMedewerkers"
              value={formData.aantalMedewerkers}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F3059]"
            >
              <option value="">Selecteer</option>
              <option value="1-5">1-5 medewerkers</option>
              <option value="6-10">6-10 medewerkers</option>
              <option value="11-25">11-25 medewerkers</option>
              <option value="26-50">26-50 medewerkers</option>
              <option value="50+">Meer dan 50 medewerkers</option>
            </select>
          </div>

          <div>
            <label htmlFor="geschatteAfname" className="block text-sm font-medium text-gray-700 mb-1">
              Geschatte maandelijkse afname
            </label>
            <select
              id="geschatteAfname"
              name="geschatteAfname"
              value={formData.geschatteAfname}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F3059]"
            >
              <option value="">Selecteer</option>
              <option value="0-500">€0 - €500</option>
              <option value="500-1000">€500 - €1.000</option>
              <option value="1000-2500">€1.000 - €2.500</option>
              <option value="2500-5000">€2.500 - €5.000</option>
              <option value="5000+">Meer dan €5.000</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="opmerkingen" className="block text-sm font-medium text-gray-700 mb-1">
              Opmerkingen of vragen
            </label>
            <textarea
              id="opmerkingen"
              name="opmerkingen"
              value={formData.opmerkingen}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F3059]"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Voorwaarden */}
      <div>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="voorwaarden"
              name="voorwaarden"
              type="checkbox"
              checked={formData.voorwaarden}
              onChange={handleCheckboxChange}
              className={`h-4 w-4 text-[#0F3059] border ${
                errors.voorwaarden ? "border-red-500" : "border-gray-300"
              } rounded focus:ring-[#0F3059]`}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="voorwaarden" className="font-medium text-gray-700">
              Ik ga akkoord met de{" "}
              <a
                href="/algemene-voorwaarden"
                className="text-[#0F3059] hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                algemene voorwaarden
              </a>{" "}
              en{" "}
              <a href="/privacy-beleid" className="text-[#0F3059] hover:underline" target="_blank" rel="noreferrer">
                privacybeleid
              </a>{" "}
              *
            </label>
            {errors.voorwaarden && <p className="mt-1 text-sm text-red-600">{errors.voorwaarden}</p>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-6 py-3 bg-[#0F3059] text-white font-medium rounded-md hover:bg-[#0F3059]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F3059] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Aanvraag verwerken..." : "Zakelijk account aanvragen"}
        </button>
      </div>
    </form>
  )
}
