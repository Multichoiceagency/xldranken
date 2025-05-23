import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHeadset,
  faTruck,
  faCreditCard,
  faBoxOpen,
  faShieldAlt,
  faQuestionCircle,
  faEnvelope,
  faPhone,
  faComments,
} from "@fortawesome/free-solid-svg-icons"

export const metadata: Metadata = {
  title: "Klantenservice | XL Groothandel",
  description:
    "Vind antwoorden op uw vragen, bekijk onze leveringsvoorwaarden en neem contact op met onze klantenservice.",
}

export default function KlantenservicePage() {
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
              Onze Klantenservice
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white">
              Onze specialisten staan klaar om u te helpen met persoonlijk en vrijblijvend advies. Hieronder vindt u
              antwoorden op veelgestelde vragen en verschillende manieren om contact met ons op te nemen.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Contact Options */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#BEA46A]">Contact Opnemen</h2>
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-[#0F3059]/10 rounded-full">
                    <FontAwesomeIcon icon={faPhone} className="text-[#0F3059] w-8 h-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Telefonisch</h3>
                  <p className="text-gray-600 mb-3">Bereikbaar op werkdagen van 9:00 tot 17:00</p>
                  <a href="tel:+31618495949" className="text-[#0F3059] font-medium hover:underline">
                    +31 6 18495949
                  </a>
                </div>

                <div className="text-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-[#0F3059]/10 rounded-full">
                    <FontAwesomeIcon icon={faEnvelope} className="text-[#0F3059] w-8 h-8" />
                  </div>
                  <h3 className="font-semibold mb-2">E-mail</h3>
                  <p className="text-gray-600 mb-3">We reageren binnen 24 uur op uw bericht</p>
                  <a href="mailto:info@xlgroothandelbv.nl" className="text-[#0F3059] font-medium hover:underline">
                    info@xlgroothandelbv.nl
                  </a>
                </div>

                <div className="text-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-[#0F3059]/10 rounded-full">
                    <FontAwesomeIcon icon={faComments} className="text-[#0F3059] w-8 h-8" />
                  </div>
                  <h3 className="font-semibold mb-2">WhatsApp</h3>
                  <p className="text-gray-600 mb-3">Direct contact via WhatsApp</p>
                  <a href="https://wa.me/31618495949" className="text-[#0F3059] font-medium hover:underline">
                    +31 6 18495949
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Service Categories */}
          <div className="bg-[#0F3059] text-white rounded-lg shadow-lg p-6 md:p-8 mb-16">
            <h3 className="text-2xl font-semibold mb-6 text-[#BEA46A]">Onze Services</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <FontAwesomeIcon icon={faHeadset} className="text-[#BEA46A] w-10 h-10" />
                </div>
                <h4 className="font-medium">Klantenservice</h4>
                <p className="text-sm text-gray-300 mt-1">Persoonlijk advies</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <FontAwesomeIcon icon={faTruck} className="text-[#BEA46A] w-10 h-10" />
                </div>
                <h4 className="font-medium">Bezorging</h4>
                <p className="text-sm text-gray-300 mt-1">Snel & betrouwbaar</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCreditCard} className="text-[#BEA46A] w-10 h-10" />
                </div>
                <h4 className="font-medium">Betaalmethoden</h4>
                <p className="text-sm text-gray-300 mt-1">Veilig & flexibel</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <FontAwesomeIcon icon={faBoxOpen} className="text-[#BEA46A] w-10 h-10" />
                </div>
                <h4 className="font-medium">Retourneren</h4>
                <p className="text-sm text-gray-300 mt-1">Eenvoudig proces</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#BEA46A]">Veelgestelde Vragen</h2>
            <div className="bg-white rounded-lg shadow-lg divide-y">
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <FontAwesomeIcon icon={faQuestionCircle} className="text-[#BEA46A] w-5 h-5 mr-2" />
                  Wat zijn de bezorgkosten?
                </h3>
                <p className="text-gray-700">
                  Voor bestellingen onder €750 rekenen wij €64.95 bezorgkosten. Bestellingen boven €750 worden gratis
                  bezorgd in heel Nederland. Voor zakelijke klanten gelden speciale voorwaarden.
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <FontAwesomeIcon icon={faQuestionCircle} className="text-[#BEA46A] w-5 h-5 mr-2" />
                  Hoe lang duurt de levering?
                </h3>
                <p className="text-gray-700">
                  Bestellingen die op werkdagen vóór 15:00 uur worden geplaatst, worden de volgende werkdag geleverd.
                  Voor sommige afgelegen gebieden kan de levertijd 1-2 dagen langer zijn.
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <FontAwesomeIcon icon={faQuestionCircle} className="text-[#BEA46A] w-5 h-5 mr-2" />
                  Kan ik mijn bestelling wijzigen of annuleren?
                </h3>
                <p className="text-gray-700">
                  Ja, u kunt uw bestelling wijzigen of annuleren tot 24 uur na het plaatsen van de bestelling, mits deze
                  nog niet is verzonden. Neem hiervoor contact op met onze klantenservice.
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <FontAwesomeIcon icon={faQuestionCircle} className="text-[#BEA46A] w-5 h-5 mr-2" />
                  Hoe kan ik een product retourneren?
                </h3>
                <p className="text-gray-700">
                  Producten kunnen binnen 14 dagen na ontvangst worden geretourneerd. De producten dienen onbeschadigd
                  en in de originele verpakking te zijn. Neem contact op met onze klantenservice om een retourzending te
                  regelen.
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <FontAwesomeIcon icon={faQuestionCircle} className="text-[#BEA46A] w-5 h-5 mr-2" />
                  Welke betaalmethoden accepteren jullie?
                </h3>
                <p className="text-gray-700">
                  Wij accepteren verschillende betaalmethoden, waaronder iDEAL, creditcard (Visa, Mastercard), PayPal,
                  Bancontact en bankoverschrijving. Voor zakelijke klanten is betaling op factuur mogelijk.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/faq"
                className="inline-block bg-[#0F3059] text-white px-6 py-3 rounded-md hover:bg-[#0F3059]/90 transition-colors"
              >
                Bekijk alle veelgestelde vragen
              </Link>
            </div>
          </div>

          {/* Shipping & Returns */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4 text-[#BEA46A] flex items-center">
                <FontAwesomeIcon icon={faTruck} className="w-5 h-5 mr-2" />
                Bezorging
              </h3>
              <p className="text-gray-700 mb-4">
                Wij bezorgen door heel Nederland. Bestellingen worden geleverd door onze eigen bezorgdienst of via een
                betrouwbare pakketdienst.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#BEA46A] mr-2">✓</span>
                  Gratis bezorging vanaf €750
                </li>
                <li className="flex items-start">
                  <span className="text-[#BEA46A] mr-2">✓</span>
                  Levering volgende werkdag bij bestelling vóór 15:00
                </li>
                <li className="flex items-start">
                  <span className="text-[#BEA46A] mr-2">✓</span>
                  Bestellings bevestiging van uw levering
                </li>
                <li className="flex items-start">
                  <span className="text-[#BEA46A] mr-2">✓</span>
                  Speciale bezorgopties voor zakelijke klanten
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/bezorging" className="text-[#0F3059] font-medium hover:underline">
                  Meer informatie over bezorging →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4 text-[#BEA46A] flex items-center">
                <FontAwesomeIcon icon={faBoxOpen} className="w-5 h-5 mr-2" />
                Retourneren
              </h3>
              <p className="text-gray-700 mb-4">
                Niet tevreden met uw aankoop? U kunt producten binnen 14 dagen na ontvangst retourneren.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#BEA46A] mr-2">✓</span>
                  14 dagen bedenktijd
                </li>
                <li className="flex items-start">
                  <span className="text-[#BEA46A] mr-2">✓</span>
                  Eenvoudig retourproces
                </li>
                <li className="flex items-start">
                  <span className="text-[#BEA46A] mr-2">✓</span>
                  Snelle terugbetaling na ontvangst retour
                </li>
                <li className="flex items-start">
                  <span className="text-[#BEA46A] mr-2">✓</span>
                  Gratis omruilen voor een ander product
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/retourneren" className="text-[#0F3059] font-medium hover:underline">
                  Meer informatie over retourneren →
                </Link>
              </div>
            </div>
          </div>

          {/* Business Customers */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-16">
            <h3 className="text-xl font-semibold mb-6 text-[#BEA46A]">Zakelijke Klanten</h3>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <p className="text-gray-700 mb-4">
                  XL Groothandel is de ideale partner voor uw horecabedrijf, avondwinkel of supermarkt. Wij bieden speciale
                  voorwaarden voor zakelijke klanten, waaronder:
                </p>
                <ul className="space-y-2 text-gray-700 mb-6">
                  <li className="flex items-start">
                    <span className="text-[#BEA46A] mr-2">✓</span>
                    Aantrekkelijke groothandelsprijzen
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#BEA46A] mr-2">✓</span>
                    Flexibele leveringsopties
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#BEA46A] mr-2">✓</span>
                    Betaling op factuur (na goedkeuring)
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#BEA46A] mr-2">✓</span>
                    Persoonlijke accountmanager
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#BEA46A] mr-2">✓</span>
                    Maatwerk assortiment mogelijk
                  </li>
                </ul>
                <Link
                  href="/zakelijk"
                  className="inline-block bg-[#0F3059] text-white px-6 py-3 rounded-md hover:bg-[#0F3059]/90 transition-colors"
                >
                  Zakelijk account aanvragen
                </Link>
              </div>
              <div className="md:w-1/2 relative h-64 md:h-auto w-full rounded-lg overflow-hidden">
                <Image src="/winkel/winkel2.jpeg" alt="XL Groothandel zakelijke service" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Important Links */}
          <div className="bg-gray-50 rounded-lg shadow-sm p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6 text-[#BEA46A]">Belangrijke Informatie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/algemene-voorwaarden"
                className="flex items-center p-3 bg-white rounded-md hover:shadow-md transition-shadow"
              >
                <FontAwesomeIcon icon={faShieldAlt} className="text-[#0F3059] w-5 h-5 mr-3" />
                <span>Algemene Voorwaarden</span>
              </Link>
              <Link
                href="/privacy-beleid"
                className="flex items-center p-3 bg-white rounded-md hover:shadow-md transition-shadow"
              >
                <FontAwesomeIcon icon={faShieldAlt} className="text-[#0F3059] w-5 h-5 mr-3" />
                <span>Privacy Beleid</span>
              </Link>
              <Link
                href="/cookie-beleid"
                className="flex items-center p-3 bg-white rounded-md hover:shadow-md transition-shadow"
              >
                <FontAwesomeIcon icon={faShieldAlt} className="text-[#0F3059] w-5 h-5 mr-3" />
                <span>Cookie Beleid</span>
              </Link>
              <Link
                href="/betaalmethoden"
                className="flex items-center p-3 bg-white rounded-md hover:shadow-md transition-shadow"
              >
                <FontAwesomeIcon icon={faCreditCard} className="text-[#0F3059] w-5 h-5 mr-3" />
                <span>Betaalmethoden</span>
              </Link>
              <Link
                href="/verzendbeleid"
                className="flex items-center p-3 bg-white rounded-md hover:shadow-md transition-shadow"
              >
                <FontAwesomeIcon icon={faTruck} className="text-[#0F3059] w-5 h-5 mr-3" />
                <span>Verzendbeleid</span>
              </Link>
              <Link
                href="/klachtenregeling"
                className="flex items-center p-3 bg-white rounded-md hover:shadow-md transition-shadow"
              >
                <FontAwesomeIcon icon={faHeadset} className="text-[#0F3059] w-5 h-5 mr-3" />
                <span>Klachtenregeling</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
