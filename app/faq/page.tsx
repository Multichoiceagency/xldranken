import Image from "next/image"
import type { Metadata } from "next"
import { FaqSearch } from "@/components/faq-search"
import { FaqAccordion } from "@/components/faq-accordion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeadset, faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
import { faqData } from "@/lib/faq-data"

export const metadata: Metadata = {
  title: "Veelgestelde Vragen | XL Groothandel",
  description:
    "Vind antwoorden op veelgestelde vragen over bestellingen, leveringen, retourneren, betaalmethoden en meer bij XL Groothandel.",
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <div className="relative">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-background"></div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/winkel/winkel1.png"
            alt="XL Groothandel klantenservice"
            fill
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#d4af37] to-[#f5e7a3] bg-clip-text text-transparent">
              Veelgestelde Vragen
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white">
              Vind snel antwoord op uw vragen over bestellingen, leveringen, retourneren en meer. Staat uw vraag er niet
              bij? Neem dan contact op met onze klantenservice.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="mb-12">
            <FaqSearch />
          </div>

          {/* FAQ Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {faqData.map((category, index) => (
              <a
                key={index}
                href={`#${category.category.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#0F3059]/10 rounded-full mb-3">
                  <FontAwesomeIcon icon={category.icon} className="text-[#0F3059] w-6 h-6" />
                </div>
                <h3 className="font-medium text-[#0F3059]">{category.category}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.questions.length} vragen</p>
              </a>
            ))}
          </div>

          {/* FAQ Accordions by Category */}
          {faqData.map((category, index) => (
            <div key={index} id={category.category.toLowerCase().replace(/\s+/g, "-")} className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 text-[#BEA46A] flex items-center">
                <FontAwesomeIcon icon={category.icon} className="mr-3 w-6 h-6" />
                {category.category}
              </h2>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <FaqAccordion items={category.questions} />
              </div>
            </div>
          ))}

          {/* Not Found Your Question */}
          <div className="bg-[#0F3059] text-white rounded-lg shadow-lg p-6 md:p-8 mb-16">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/4 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faQuestionCircle} className="text-[#BEA46A] w-12 h-12" />
                </div>
              </div>
              <div className="md:w-3/4 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-3 text-[#BEA46A]">Staat uw vraag er niet bij?</h3>
                <p className="text-white/90 mb-4">
                  Heeft u een vraag die niet in onze FAQ staat? Neem dan contact op met onze klantenservice. Wij helpen
                  u graag verder.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <a
                    href="tel:+31618495949"
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-[#0F3059] rounded-md hover:bg-white/90 transition-colors"
                  >
                    <FontAwesomeIcon icon={faHeadset} className="mr-2 w-4 h-4" />
                    Bel Klantenservice
                  </a>
                  <a
                    href="mailto:info@xlgroothandelbv.nl"
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-white text-white rounded-md hover:bg-white/10 transition-colors"
                  >
                    E-mail Ons
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
