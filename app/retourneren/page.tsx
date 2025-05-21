import Image from "next/image"
import type { Metadata } from "next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBoxOpen,
  faClipboardList,
  faTruck,
  faEuroSign,
  faInfoCircle,
  faExclamationTriangle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons"
import { RetourFormulier } from "@/components/retour-formulier"

export const metadata: Metadata = {
  title: "Retourneren | XL Dranken",
  description:
    "Informatie over het retourneren van producten bij XL Dranken. Vul ons retourformulier in om uw retourzending te starten.",
}

// Return steps
const returnSteps = [
  {
    title: "Retourformulier invullen",
    description: "Vul het retourformulier in met uw gegevens en de reden van retour.",
    icon: faClipboardList,
  },
  {
    title: "Bevestiging ontvangen",
    description: "U ontvangt een e-mail met instructies en een retourlabel.",
    icon: faInfoCircle,
  },
  {
    title: "Product retourneren",
    description: "Verpak het product zorgvuldig en stuur het terug met het retourlabel.",
    icon: faBoxOpen,
  },
  {
    title: "Terugbetaling",
    description: "Na ontvangst en controle wordt het bedrag binnen 14 dagen teruggestort.",
    icon: faEuroSign,
  },
]

// Return reasons
const returnReasons = [
  "Product beschadigd ontvangen",
  "Verkeerd product ontvangen",
  "Product voldoet niet aan verwachtingen",
  "Product is defect",
  "Bestelling dubbel geleverd",
  "Anders",
]

export default function RetournerenPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <div className="relative">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-background"></div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/winkel/winkel1.png"
            alt="XL Dranken retourneren"
            fill
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#d4af37] to-[#f5e7a3] bg-clip-text text-transparent">
              Retourneren
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white">
              Niet tevreden met uw aankoop? Geen probleem. Wij bieden een eenvoudig retourproces zodat u uw producten
              gemakkelijk kunt terugsturen.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Return Policy */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#BEA46A]">Ons Retourbeleid</h2>
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <p className="text-gray-700 mb-6">
                Bij XL Dranken streven we ernaar om u de beste producten en service te bieden. Mocht u toch niet
                tevreden zijn met uw aankoop, dan kunt u deze binnen 14 dagen na ontvangst retourneren.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2" />
                    Wat kunt u retourneren
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#BEA46A] mr-2">✓</span>
                      Ongeopende producten in originele verpakking
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#BEA46A] mr-2">✓</span>
                      Beschadigde producten (meld binnen 48 uur)
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#BEA46A] mr-2">✓</span>
                      Verkeerd geleverde producten
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#BEA46A] mr-2">✓</span>
                      Producten die niet aan de beschrijving voldoen
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-[#0F3059] w-5 h-5 mr-2" />
                    Wat kunt u niet retourneren
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      Geopende producten (tenzij defect)
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      Producten zonder originele verpakking
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      Producten die speciaal voor u besteld zijn
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      Producten na 14 dagen zonder melding
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Voor zakelijke klanten kunnen afwijkende retourvoorwaarden gelden. Neem contact op met uw
                      accountmanager voor meer informatie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#BEA46A]">Retourproces</h2>
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {returnSteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-[#0F3059]/10 rounded-full mb-4">
                      <FontAwesomeIcon icon={step.icon} className="text-[#0F3059] w-8 h-8" />
                    </div>
                    <div className="relative mb-4">
                      <div className="text-2xl font-bold text-[#0F3059] bg-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-[#0F3059]">
                        {index + 1}
                      </div>
                      {index < returnSteps.length - 1 && (
                        <div className="absolute top-4 left-full w-full h-0.5 bg-[#0F3059] hidden md:block"></div>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Return Form */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#BEA46A]">Retourformulier</h2>
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <p className="text-gray-700 mb-6">
                Vul onderstaand formulier in om uw retourzending te starten. Na het indienen van het formulier ontvangt
                u binnen 1 werkdag een bevestiging per e-mail met verdere instructies.
              </p>

              <RetourFormulier returnReasons={returnReasons} />
            </div>
          </div>

          {/* Return Costs */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-[#BEA46A] flex items-center">
                <FontAwesomeIcon icon={faEuroSign} className="mr-3 w-6 h-6" />
                Retourkosten
              </h2>
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 h-full">
                <p className="text-gray-700 mb-4">
                  De kosten voor het retourneren zijn afhankelijk van de reden van retour:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Fout van ons</p>
                      <p className="text-sm text-gray-600">
                        Bij beschadigde, defecte of verkeerd geleverde producten zijn de retourkosten voor onze
                        rekening.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Herroepingsrecht</p>
                      <p className="text-sm text-gray-600">
                        Bij retourneren binnen 14 dagen zonder opgaaf van reden zijn de retourkosten voor uw rekening.
                        Deze bedragen €5,95.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Grote of zware producten</p>
                      <p className="text-sm text-gray-600">
                        Voor grote of zware producten kunnen afwijkende retourkosten gelden. Dit wordt per geval
                        beoordeeld.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6 text-[#BEA46A] flex items-center">
                <FontAwesomeIcon icon={faTruck} className="mr-3 w-6 h-6" />
                Retourzending
              </h2>
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 h-full">
                <p className="text-gray-700 mb-4">
                  Na goedkeuring van uw retourverzoek ontvangt u instructies voor het terugsturen van uw producten:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Retourlabel</p>
                      <p className="text-sm text-gray-600">
                        U ontvangt een retourlabel per e-mail dat u op de verpakking kunt plakken.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Verpakking</p>
                      <p className="text-sm text-gray-600">
                        Gebruik bij voorkeur de originele verpakking. Zorg voor voldoende bescherming om beschadiging
                        tijdens transport te voorkomen.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Inleverpunt</p>
                      <p className="text-sm text-gray-600">
                        U kunt het pakket inleveren bij een PostNL-punt of laten ophalen op uw adres.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Let op: stuur producten niet terug zonder voorafgaande goedkeuring en retourlabel.
                        Ongeautoriseerde retourzendingen kunnen niet in behandeling worden genomen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-[#0F3059] text-white rounded-lg shadow-lg p-6 md:p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-[#BEA46A]">Veelgestelde Vragen over Retourneren</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Hoe lang duurt het voordat ik mijn geld terug krijg?</h3>
                <p className="text-gray-100">
                  Na ontvangst en controle van uw retourzending wordt het bedrag binnen 14 dagen teruggestort op de
                  rekening waarmee u heeft betaald. In de praktijk streven we ernaar dit binnen 5 werkdagen te doen.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Kan ik een product omruilen in plaats van retourneren?</h3>
                <p className="text-gray-100">
                  Ja, dat is mogelijk. Geef dit duidelijk aan in het retourformulier bij 'Opmerkingen'. Na ontvangst van
                  uw retourzending sturen wij het gewenste product naar u toe. Eventuele prijsverschillen worden
                  verrekend.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Wat als ik een beschadigd product heb ontvangen?</h3>
                <p className="text-gray-100">
                  Meld beschadigingen binnen 48 uur na ontvangst via het retourformulier of neem direct contact op met
                  onze klantenservice. Stuur foto's van de beschadiging mee. Wij zorgen voor een passende oplossing,
                  zoals vervanging of terugbetaling.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Kan ik een deel van mijn bestelling retourneren?</h3>
                <p className="text-gray-100">
                  Ja, u kunt een deel van uw bestelling retourneren. Geef in het retourformulier duidelijk aan welke
                  producten u wilt retourneren en welke u wilt behouden.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 text-[#BEA46A]">Vragen over retourneren?</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-4">
                  Heeft u vragen over het retourneren van producten of wilt u meer informatie? Neem dan contact op met
                  onze klantenservice. Wij helpen u graag verder.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-[#0F3059] w-5 h-5 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Klantenservice</h4>
                      <p className="text-gray-600 text-sm">Werkdagen 9:00 - 17:00</p>
                      <a href="tel:+31618495949" className="text-[#0F3059] hover:underline">
                        +31 6 18495949
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-[#0F3059] w-5 h-5 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">E-mail</h4>
                      <p className="text-gray-600 text-sm">Reactie binnen 24 uur</p>
                      <a href="mailto:info@xlgroothandelbv.nl" className="text-[#0F3059] hover:underline">
                        info@xlgroothandelbv.nl
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 relative h-48 md:h-auto w-full rounded-lg overflow-hidden">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
