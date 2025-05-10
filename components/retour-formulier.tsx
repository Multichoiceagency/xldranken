"use client"

import type React from "react"
import { useState, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheckCircle,
  faExclamationTriangle,
  faPaperPlane,
  faUpload,
  faFile,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"

interface RetourFormulierProps {
  returnReasons: string[]
}

export function RetourFormulier({ returnReasons }: RetourFormulierProps) {
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    telefoon: "",
    bestelnummer: "",
    aankoopdatum: "",
    productnaam: "",
    aantal: "",
    redenVanRetour: "",
    andereReden: "",
    opmerkingen: "",
    voorwaarden: false,
  })

  // File upload state
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const [statusMessage, setStatusMessage] = useState("")

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

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to array and add to existing files
      const newFiles = Array.from(e.target.files)

      // Validate file size (limit to 5MB per file)
      const invalidFiles = newFiles.filter((file) => file.size > 5 * 1024 * 1024)
      if (invalidFiles.length > 0) {
        setErrors((prev) => ({
          ...prev,
          files: `Bestand(en) te groot. Maximum bestandsgrootte is 5MB per bestand.`,
        }))
        return
      }

      // Limit to 3 files total
      if (files.length + newFiles.length > 3) {
        setErrors((prev) => ({
          ...prev,
          files: `U kunt maximaal 3 bestanden uploaden.`,
        }))
        return
      }

      setFiles((prev) => [...prev, ...newFiles])

      // Clear any file errors
      if (errors.files) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.files
          return newErrors
        })
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Remove a file from the list
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.naam.trim()) newErrors.naam = "Naam is verplicht"
    if (!formData.email.trim()) newErrors.email = "E-mailadres is verplicht"
    if (!formData.bestelnummer.trim()) newErrors.bestelnummer = "Bestelnummer is verplicht"
    if (!formData.aankoopdatum.trim()) newErrors.aankoopdatum = "Aankoopdatum is verplicht"
    if (!formData.productnaam.trim()) newErrors.productnaam = "Productnaam is verplicht"
    if (!formData.aantal.trim()) newErrors.aantal = "Aantal is verplicht"
    if (!formData.redenVanRetour) newErrors.redenVanRetour = "Selecteer een reden voor retour"
    if (formData.redenVanRetour === "Anders" && !formData.andereReden.trim())
      newErrors.andereReden = "Geef een reden op"
    if (!formData.voorwaarden) newErrors.voorwaarden = "U moet akkoord gaan met de voorwaarden"

    // Format validations
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Voer een geldig e-mailadres in"
    }

    if (formData.aantal.trim() && !/^\d+$/.test(formData.aantal.trim())) {
      newErrors.aantal = "Voer een geldig aantal in"
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
      // Create form data for multipart/form-data submission (for files)
      const formDataObj = new FormData()

      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value.toString())
      })

      // Add files
      files.forEach((file) => {
        formDataObj.append("files", file)
      })

      // Send the form data
      const response = await fetch("/api/email", {
        method: "POST",
        body: formDataObj,
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus("success")
        setStatusMessage(result.message)
        // Reset form after successful submission
        setFormData({
          naam: "",
          email: "",
          telefoon: "",
          bestelnummer: "",
          aankoopdatum: "",
          productnaam: "",
          aantal: "",
          redenVanRetour: "",
          andereReden: "",
          opmerkingen: "",
          voorwaarden: false,
        })
        setFiles([])
      } else {
        setSubmitStatus("error")
        setStatusMessage(result.message || "Er is een fout opgetreden bij het verzenden van het formulier.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
      setStatusMessage(
        "Er is een fout opgetreden bij het verzenden van uw retourverzoek. Probeer het later opnieuw of neem contact op met onze klantenservice.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
      {/* Success/Error Messages */}
      {submitStatus === "success" && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-green-800 font-medium">Retourverzoek succesvol ingediend!</h3>
              <p className="text-green-700 text-sm mt-1">{statusMessage}</p>
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
              <p className="text-red-700 text-sm mt-1">{statusMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Klantgegevens */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Uw gegevens</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="naam" className="block text-sm font-medium text-gray-700 mb-1">
              Naam *
            </label>
            <input
              type="text"
              id="naam"
              name="naam"
              value={formData.naam}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.naam ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.naam && <p className="mt-1 text-sm text-red-600">{errors.naam}</p>}
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
              Telefoonnummer
            </label>
            <input
              type="tel"
              id="telefoon"
              name="telefoon"
              value={formData.telefoon}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F3059]"
            />
          </div>
        </div>
      </div>

      {/* Bestelgegevens */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Bestelgegevens</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bestelnummer" className="block text-sm font-medium text-gray-700 mb-1">
              Bestelnummer *
            </label>
            <input
              type="text"
              id="bestelnummer"
              name="bestelnummer"
              value={formData.bestelnummer}
              onChange={handleChange}
              placeholder="Bijv. XL12345"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.bestelnummer ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.bestelnummer && <p className="mt-1 text-sm text-red-600">{errors.bestelnummer}</p>}
          </div>

          <div>
            <label htmlFor="aankoopdatum" className="block text-sm font-medium text-gray-700 mb-1">
              Aankoopdatum *
            </label>
            <input
              type="date"
              id="aankoopdatum"
              name="aankoopdatum"
              value={formData.aankoopdatum}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.aankoopdatum ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.aankoopdatum && <p className="mt-1 text-sm text-red-600">{errors.aankoopdatum}</p>}
          </div>
        </div>
      </div>

      {/* Productgegevens */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Productgegevens</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="productnaam" className="block text-sm font-medium text-gray-700 mb-1">
              Productnaam *
            </label>
            <input
              type="text"
              id="productnaam"
              name="productnaam"
              value={formData.productnaam}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.productnaam ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.productnaam && <p className="mt-1 text-sm text-red-600">{errors.productnaam}</p>}
          </div>

          <div>
            <label htmlFor="aantal" className="block text-sm font-medium text-gray-700 mb-1">
              Aantal *
            </label>
            <input
              type="number"
              id="aantal"
              name="aantal"
              value={formData.aantal}
              onChange={handleChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.aantal ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            />
            {errors.aantal && <p className="mt-1 text-sm text-red-600">{errors.aantal}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="redenVanRetour" className="block text-sm font-medium text-gray-700 mb-1">
              Reden van retour *
            </label>
            <select
              id="redenVanRetour"
              name="redenVanRetour"
              value={formData.redenVanRetour}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.redenVanRetour ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
            >
              <option value="">Selecteer een reden</option>
              {returnReasons.map((reason, index) => (
                <option key={index} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            {errors.redenVanRetour && <p className="mt-1 text-sm text-red-600">{errors.redenVanRetour}</p>}
          </div>

          {formData.redenVanRetour === "Anders" && (
            <div className="md:col-span-3">
              <label htmlFor="andereReden" className="block text-sm font-medium text-gray-700 mb-1">
                Andere reden *
              </label>
              <input
                type="text"
                id="andereReden"
                name="andereReden"
                value={formData.andereReden}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.andereReden ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-[#0F3059]`}
              />
              {errors.andereReden && <p className="mt-1 text-sm text-red-600">{errors.andereReden}</p>}
            </div>
          )}

          <div className="md:col-span-3">
            <label htmlFor="opmerkingen" className="block text-sm font-medium text-gray-700 mb-1">
              Aanvullende opmerkingen
            </label>
            <textarea
              id="opmerkingen"
              name="opmerkingen"
              value={formData.opmerkingen}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0F3059]"
              placeholder="Bijv. details over de staat van het product, reden voor retour, of verzoek tot omruiling"
            ></textarea>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Foto's of documenten toevoegen</h4>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-[#0F3059] transition-colors">
          <input
            type="file"
            id="fileUpload"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/jpeg,image/png,image/gif,application/pdf"
            className="hidden"
          />

          <label htmlFor="fileUpload" className="cursor-pointer block">
            <FontAwesomeIcon icon={faUpload} className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">Klik om bestanden te uploaden</p>
            <p className="text-xs text-gray-500">
              Ondersteunde formaten: JPG, PNG, GIF, PDF (max. 5MB per bestand, max. 3 bestanden)
            </p>
          </label>

          {errors.files && <p className="mt-2 text-sm text-red-600">{errors.files}</p>}

          {/* Display uploaded files */}
          {files.length > 0 && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Geüploade bestanden:</p>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faFile} className="h-4 w-4 text-[#0F3059] mr-2" />
                      <span className="truncate max-w-xs">{file.name}</span>
                      <span className="ml-2 text-gray-500 text-xs">({(file.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-500 hover:text-red-500"
                      aria-label="Verwijder bestand"
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
              <a href="/retourvoorwaarden" className="text-[#0F3059] hover:underline" target="_blank" rel="noreferrer">
                retourvoorwaarden
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
          className="w-full md:w-auto px-6 py-3 bg-[#0F3059] text-white font-medium rounded-md hover:bg-[#0F3059]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F3059] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isSubmitting ? (
            "Verzoek verzenden..."
          ) : (
            <>
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2 h-4 w-4" />
              Retourverzoek indienen
            </>
          )}
        </button>
      </div>
    </form>
  )
}
