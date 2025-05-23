import Image from "next/image"
import type { Metadata } from "next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBuilding,
  faFileInvoiceDollar,
  faHandshake,
  faTruck,
  faPercent,
  faUserTie,
  faCheckCircle,
  faInfoCircle,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons"
import { ZakelijkRegistratieForm } from "@/components/zakelijk-registratie-form"

export const metadata: Metadata = {
  title: "Zakelijk Account Aanvragen | XL Groothandel",
  description:
    "Registreer uw bedrijf voor een zakelijk account bij XL Groothandel en profiteer van groothandelsprijzen, flexibele levering en meer voordelen.",
}

export default function ZakelijkAccountPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <div className="relative">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-background"></div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/winkel/winkel3.jpeg"
            alt="XL Groothandel zakelijk account"
            fill
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#d4af37] to-[#f5e7a3] bg-clip-text text-transparent">
              Zakelijk Account Aanvragen
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white">
              Registreer uw bedrijf bij XL Groothandel en profiteer van exclusieve zakelijke voordelen, groothandelsprijzen
              en persoonlijke service.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Registration Form and Info */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Left Column - Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-6 text-[#BEA46A]">Registratieformulier Zakelijk Account</h3>
                <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Dit formulier is uitsluitend bedoeld voor zakelijke klanten. Alle velden met een * zijn
                        verplicht. Na het indienen van uw aanvraag nemen wij binnen 1-2 werkdagen contact met u op.
                      </p>
                    </div>
                  </div>
                </div>

                <ZakelijkRegistratieForm />
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
                <h3 className="text-lg font-semibold mb-4 text-[#BEA46A]">Voor Wie?</h3>
                <p className="text-gray-700 mb-4">Ons zakelijk account is speciaal ontwikkeld voor:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                    <span>Horecabedrijven (cafés, restaurants, hotels)</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                    <span>Avondwinkels en supermarkten</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                    <span>Cateringbedrijven</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                    <span>Evenementenbureaus</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                    <span>Kantoren en bedrijven</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <h3 className="text-lg font-semibold mb-4 text-[#BEA46A]">Veelgestelde Vragen</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-[#0F3059]">Hoe lang duurt de goedkeuring?</h4>
                    <p className="text-gray-700 text-sm mt-1">
                      Na het indienen van uw aanvraag streven wij ernaar deze binnen 1-2 werkdagen te verwerken.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0F3059]">Is er een minimale bestelwaarde?</h4>
                    <p className="text-gray-700 text-sm mt-1">
                      Voor zakelijke accounts hanteren wij een minimale bestelwaarde van €150 exclusief BTW.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0F3059]">Kan ik meerdere gebruikers toevoegen?</h4>
                    <p className="text-gray-700 text-sm mt-1">
                      Ja, u kunt meerdere gebruikers toevoegen aan uw zakelijk account met verschillende rechten.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0F3059]">Zijn er kosten verbonden aan een zakelijk account?</h4>
                    <p className="text-gray-700 text-sm mt-1">
                      Nee, het aanmaken en gebruiken van een zakelijk account is volledig kosteloos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Benefits */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#BEA46A]">Voordelen van een Zakelijk Account</h2>
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center bg-[#0F3059]/10 rounded-full">
                    <FontAwesomeIcon icon={faPercent} className="text-[#0F3059] w-8 h-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Groothandelsprijzen</h3>
                  <p className="text-gray-600">
                    Profiteer van aantrekkelijke kortingen en speciale prijzen voor zakelijke afnemers.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center bg-[#0F3059]/10 rounded-full">
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-[#0F3059] w-8 h-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Betaling op Factuur</h3>
                  <p className="text-gray-600">
                    Na goedkeuring kunt u bestellen en betalen op factuur met een betalingstermijn van 14 dagen.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center bg-[#0F3059]/10 rounded-full">
                    <FontAwesomeIcon icon={faTruck} className="text-[#0F3059] w-8 h-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Flexibele Levering</h3>
                  <p className="text-gray-600">
                    Kies voor reguliere levering of plan een specifiek tijdslot dat past bij uw bedrijfsuren.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center bg-[#0F3059]/10 rounded-full">
                    <FontAwesomeIcon icon={faUserTie} className="text-[#0F3059] w-8 h-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Persoonlijke Accountmanager</h3>
                  <p className="text-gray-600">
                    Een vast aanspreekpunt voor al uw vragen, bestellingen en speciale wensen.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center bg-[#0F3059]/10 rounded-full">
                    <FontAwesomeIcon icon={faHandshake} className="text-[#0F3059] w-8 h-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Maatwerk Assortiment</h3>
                  <p className="text-gray-600">
                    Mogelijkheid tot het samenstellen van een op maat gemaakt assortiment voor uw bedrijf.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center bg-[#0F3059]/10 rounded-full">
                    <FontAwesomeIcon icon={faBuilding} className="text-[#0F3059] w-8 h-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Zakelijk Dashboard</h3>
                  <p className="text-gray-600">
                    Toegang tot een uitgebreid dashboard met bestelhistorie, facturen en aangepaste prijslijsten.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-[#0F3059] text-white rounded-lg shadow-lg p-6 md:p-8 mb-16">
            <h3 className="text-2xl font-semibold mb-6 text-[#BEA46A]">Wat Onze Zakelijke Klanten Zeggen</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 p-5 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#BEA46A] flex items-center justify-center text-white font-bold text-xl">
                    R
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">Restaurant De Smaakmaker</h4>
                    <p className="text-sm text-gray-300">Amsterdam</p>
                  </div>
                </div>
                <p className="text-gray-100 italic">
                  "De persoonlijke service en flexibele leveringen maken XL Groothandel de ideale partner voor onze
                  horecazaak. De kwaliteit van de producten is uitstekend en de prijzen zijn zeer concurrerend."
                </p>
              </div>

              <div className="bg-white/10 p-5 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#BEA46A] flex items-center justify-center text-white font-bold text-xl">
                    C
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">Café Centraal</h4>
                    <p className="text-sm text-gray-300">Rotterdam</p>
                  </div>
                </div>
                <p className="text-gray-100 italic">
                  "Als druk café hebben we een betrouwbare leverancier nodig. XL Groothandel levert altijd op tijd en het
                  online bestelsysteem werkt zeer efficiënt. De accountmanager denkt echt met ons mee."
                </p>
              </div>

              <div className="bg-white/10 p-5 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#BEA46A] flex items-center justify-center text-white font-bold text-xl">
                    E
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">Eventbureau Celebration</h4>
                    <p className="text-sm text-gray-300">Utrecht</p>
                  </div>
                </div>
                <p className="text-gray-100 italic">
                  "Voor onze evenementen hebben we vaak grote hoeveelheden drank nodig. XL Groothandel biedt niet alleen
                  scherpe prijzen, maar denkt ook mee over de juiste hoeveelheden en assortiment voor elk type event."
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6 text-[#BEA46A]">Vragen over Zakelijke Accounts?</h3>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-4">
                  Heeft u vragen over onze zakelijke accounts of wilt u meer informatie? Neem gerust contact op met ons
                  zakelijke team. Wij helpen u graag verder en kunnen ook een persoonlijk gesprek inplannen om uw
                  specifieke wensen te bespreken.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faPhone} className="text-[#0F3059] w-5 h-5 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Telefonisch</h4>
                      <p className="text-gray-600 text-sm">Werkdagen 9:00 - 17:00</p>
                      <a href="tel:+31618495949" className="text-[#0F3059] hover:underline">
                        +31 6 18495949
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faEnvelope} className="text-[#0F3059] w-5 h-5 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">E-mail</h4>
                      <p className="text-gray-600 text-sm">Reactie binnen 24 uur</p>
                      <a href="mailto:zakelijk@xldranken.nl" className="text-[#0F3059] hover:underline">
                        info@xlgroothandelbv.nl
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 relative h-48 md:h-auto w-full rounded-lg overflow-hidden">
                <Image src="/winkel/winkel2.jpeg" alt="XL Groothandel zakelijk team" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
