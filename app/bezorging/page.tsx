import Image from "next/image"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTruck,
  faClock,
  faMapMarkerAlt,
  faEuroSign,
  faCalendarAlt,
  faBoxOpen,
  faShieldAlt,
  faBuilding,
  faQuestionCircle,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle, // Added import for faInfoCircle
} from "@fortawesome/free-solid-svg-icons"


// Delivery time slots
const timeSlots = [
  { time: "08:00 - 12:00", label: "Ochtend" },
  { time: "12:00 - 17:00", label: "Middag" },
  { time: "17:00 - 21:00", label: "Avond (alleen op donderdag)" },
]

// Delivery areas with estimated delivery times
const deliveryAreas = [
  { area: "Randstad (Amsterdam, Rotterdam, Den Haag, Utrecht)", time: "Volgende werkdag" },
  { area: "Overige gebieden in Nederland", time: "1-2 werkdagen" },
  { area: "Waddeneilanden", time: "3-5 werkdagen" },
]

// Delivery FAQ
const deliveryFaq = [
  {
    question: "Moet ik op de zaak zijn om de bestelling in ontvangst te nemen?",
    answer:
      "Ja, er moet iemand aanwezig zijn om de bestelling in ontvangst te nemen en te tekenen voor ontvangst. Bij alcoholische dranken controleren wij ook de leeftijd van de ontvanger.",
  },
  {
    question: "Kan ik mijn bestelling laten bezorgen op een ander adres?",
    answer:
      "Ja, u kunt een ander bezorgadres opgeven dan uw factuuradres. Dit kunt u aangeven tijdens het bestelproces.",
  },
  {
    question: "Wat gebeurt er als ik niet op de zaak ben tijdens de bezorging?",
    answer:
      "Als u niet thuis bent, laat de bezorger een bericht achter. U kunt dan contact opnemen om een nieuwe bezorgafspraak te maken. Na twee mislukte bezorgpogingen worden er extra bezorgkosten in rekening gebracht.",
  },
  {
    question: "Kan ik de bezorging volgen?",
    answer:
      "Ja, u ontvangt een bestellingsbevestiging waarmee u de status van uw bestelling kunt volgen. Op de dag van bezorging ontvangt u een bericht met een indicatie van het tijdstip van bezorging.",
  },
  {
    question: "Bezorgen jullie ook op zaterdag of zondag?",
    answer:
      "Standaard bezorgen wij op werkdagen. Voor zakelijke klanten is bezorging op zaterdag mogelijk tegen een toeslag. Op zondag bezorgen wij niet.",
  },
]

export default function BezorgingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <div className="relative">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-background"></div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/winkel/winkel1.png"
            alt="XL Groothandel bezorgservice"
            fill
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#d4af37] to-[#f5e7a3] bg-clip-text text-transparent">
              Bezorging
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white">
              Bestel eenvoudig online en laat uw dranken thuisbezorgen. Wij bezorgen snel en betrouwbaar door heel
              Nederland en België. Gratis bezorging vanaf €750.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Delivery Process */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#BEA46A]">Ons Bezorgproces</h2>
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-[#0F3059]/10 rounded-full mb-4">
                    <FontAwesomeIcon icon={faBoxOpen} className="text-[#0F3059] w-8 h-8" />
                  </div>
                  <div className="relative mb-4">
                    <div className="text-2xl font-bold text-[#0F3059] bg-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-[#0F3059]">
                      1
                    </div>
                    <div className="absolute top-4 left-full w-full h-0.5 bg-[#0F3059] hidden md:block"></div>
                  </div>
                  <h3 className="font-semibold mb-2">Bestelling Verwerkt</h3>
                  <p className="text-gray-600 text-sm">
                    Uw bestelling wordt zorgvuldig verzameld en gecontroleerd in ons magazijn.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-[#0F3059]/10 rounded-full mb-4">
                    <FontAwesomeIcon icon={faTruck} className="text-[#0F3059] w-8 h-8" />
                  </div>
                  <div className="relative mb-4">
                    <div className="text-2xl font-bold text-[#0F3059] bg-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-[#0F3059]">
                      2
                    </div>
                    <div className="absolute top-4 left-full w-full h-0.5 bg-[#0F3059] hidden md:block"></div>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-[#0F3059]/10 rounded-full mb-4">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-8 h-8" />
                  </div>
                  <div className="relative mb-4">
                    <div className="text-2xl font-bold text-[#0F3059] bg-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-[#0F3059]">
                      3
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Bezorgd</h3>
                  <p className="text-gray-600 text-sm">
                    Uw bestelling wordt afgeleverd op het door u gekozen adres en tijdstip.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Costs */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#BEA46A] flex items-center">
              <FontAwesomeIcon icon={faEuroSign} className="mr-3 w-6 h-6" />
              Bezorgkosten
            </h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 md:p-8">
                <p className="text-gray-700 mb-6">
                  Onze bezorgkosten zijn afhankelijk van de bestelwaarde en het bezorgadres. Wij streven ernaar om onze
                  bezorgkosten zo transparant mogelijk te houden.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                          Bestelwaarde
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                          Bezorgkosten Nederland
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">Tot €750</td>
                        <td className="px-4 py-3 text-sm text-gray-700">€49.95</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Voor de Waddeneilanden geldt een toeslag van €15. Voor zakelijke klanten gelden speciale
                        tarieven. Neem contact op met onze zakelijke afdeling voor meer informatie.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Delivery Times */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-[#BEA46A] flex items-center">
              <FontAwesomeIcon icon={faClock} className="mr-3 w-6 h-6" />
              Levertijden
              </h2>
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 h-full">
              <p className="text-gray-700 mb-4">
                Wij streven ernaar om uw bestelling zo snel mogelijk te leveren. De levertijd is afhankelijk van het
                moment waarop u uw bestelling plaatst.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Bestelling vóór 15:00 op werkdagen</p>
                  <p className="text-sm text-gray-600">Levering volgende werkdag (afhankelijk van regio)</p>
                </div>
                </div>
                <div className="flex items-start">
                <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Bestelling na 15:00 op werkdagen</p>
                  <p className="text-sm text-gray-600">Levering binnen 2 werkdagen</p>
                </div>
                </div>
                <div className="flex items-start">
                <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Bestelling in het weekend</p>
                  <p className="text-sm text-gray-600">Verwerking op maandag, levering op dinsdag</p>
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
                  Let op: tijdens feestdagen en drukte kunnen de levertijden afwijken. Houd onze website en
                  e-mails in de gaten voor actuele informatie.
                  </p>
                </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-6">
                Voor zakelijke klanten bieden wij meer flexibiliteit in bezorgtijden. Neem contact op met onze
                zakelijke afdeling voor de mogelijkheden.
              </p>
              </div>
            </div>
            </div>

            {/* Delivery Areas */}
            <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#BEA46A] flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 w-6 h-6" />
              Bezorggebieden
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <p className="text-gray-700 mb-6">
              Wij bezorgen in heel Nederland en België. De geschatte levertijd is afhankelijk van uw locatie.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveryAreas.map((area, index) => (
                <div key={index} className="flex items-start p-4 border border-gray-100 rounded-lg">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#0F3059] w-5 h-5 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">{area.area}</p>
                  <p className="text-sm text-gray-600">Geschatte levertijd: {area.time}</p>
                </div>
                </div>
              ))}
              </div>

              <div className="mt-6 relative h-64 w-full rounded-lg overflow-hidden">
              <Image src="/winkel/nl-kaart.png" alt="XL Groothandel bezorggebieden" fill className="object-contain" />
              </div>
            </div>
            </div>

            {/* Business Delivery */}
            <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#BEA46A] flex items-center">
              <FontAwesomeIcon icon={faBuilding} className="mr-3 w-6 h-6" />
              Zakelijke Bezorging
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-4">
                Voor zakelijke klanten bieden wij speciale bezorgdiensten aan. Wij begrijpen dat betrouwbare en
                flexibele levering essentieel is voor uw bedrijf.
                </p>

                <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                  <p className="text-gray-700">Vaste leverdagen en -tijden mogelijk</p>
                </div>
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                  <p className="text-gray-700">Bezorging op zaterdag mogelijk (tegen toeslag)</p>
                </div>
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                  <p className="text-gray-700">Speciale tarieven voor regelmatige bestellingen</p>
                </div>
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                  <p className="text-gray-700">Levering met laadklep voor grote bestellingen</p>
                </div>
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#0F3059] w-5 h-5 mr-2 mt-0.5" />
                  <p className="text-gray-700">Persoonlijke accountmanager voor uw leveringen</p>
                </div>
                </div>

                <Link
                href="/zakelijk"
                className="inline-block bg-[#0F3059] text-white px-6 py-3 rounded-md hover:bg-[#0F3059]/90 transition-colors"
                >
                Meer over zakelijke accounts
                </Link>
              </div>
              </div>
            </div>
            </div>

            {/* Delivery FAQ */}
            <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#BEA46A] flex items-center">
              <FontAwesomeIcon icon={faQuestionCircle} className="mr-3 w-6 h-6" />
              Veelgestelde Vragen over Bezorging
            </h2>
            <div className="bg-white rounded-lg shadow-lg divide-y">
              {deliveryFaq.map((item, index) => (
              <div key={index} className="p-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                <FontAwesomeIcon icon={faQuestionCircle} className="text-[#BEA46A] w-5 h-5 mr-2" />
                {item.question}
                </h3>
                <p className="text-gray-700">{item.answer}</p>
              </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
              href="/faq#levering"
              className="inline-block bg-[#0F3059] text-white px-6 py-3 rounded-md hover:bg-[#0F3059]/90 transition-colors"
              >
              Meer vragen over bezorging
              </Link>
            </div>
            </div>

          {/* Delivery Guarantees */}
          <div className="bg-[#0F3059] text-white rounded-lg shadow-lg p-6 md:p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-[#BEA46A] flex items-center">
              <FontAwesomeIcon icon={faShieldAlt} className="mr-3 w-6 h-6" />
              Onze Bezorggaranties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 p-5 rounded-lg">
                <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full mb-4">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-[#BEA46A] w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Veilige Bezorging</h3>
                <p className="text-gray-100 text-sm">
                  Wij zorgen ervoor dat uw bestelling veilig en onbeschadigd wordt afgeleverd. Bij breuk of beschadiging
                  krijgt u een vervanging of terugbetaling.
                </p>
              </div>

              <div className="bg-white/10 p-5 rounded-lg">
                <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full mb-4">
                  <FontAwesomeIcon icon={faClock} className="text-[#BEA46A] w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Op Tijd Bezorgd</h3>
                <p className="text-gray-100 text-sm">
                  Wij streven ernaar om uw bestelling op het afgesproken tijdstip te bezorgen. Mocht er een vertraging
                  zijn, dan houden we u hiervan op de hoogte.
                </p>
              </div>

              <div className="bg-white/10 p-5 rounded-lg">
                <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full mb-4">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#BEA46A] w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Correcte Bestelling</h3>
                <p className="text-gray-100 text-sm">
                  Wij controleren elke bestelling zorgvuldig voor verzending. Mocht er toch iets niet kloppen, dan
                  lossen we dit direct op en compenseren we het ongemak.
                </p>
              </div>
            </div>
          </div>

          {/* Contact for Delivery Questions */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 text-[#BEA46A]">Vragen over uw bezorging?</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-4">
                  Heeft u vragen over uw bezorging of wilt u een specifieke bezorgafspraak maken? Neem dan contact op
                  met onze klantenservice. Wij helpen u graag verder.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={faTruck} className="text-[#0F3059] w-5 h-5 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Bezorgvragen</h4>
                      <p className="text-gray-600 text-sm">Werkdagen 9:00 - 17:00</p>
                      <a href="tel:+31618495949" className="text-[#0F3059] hover:underline">
                        +31 6 18495949
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 relative h-48 md:h-auto w-full rounded-lg overflow-hidden">
              </div>
            </div>
          </div>
        </div>

  )
}
