import Image from "next/image"
import type { Metadata } from "next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWineBottle, faGlassWhiskey, faBottleWater } from "@fortawesome/free-solid-svg-icons"

export const metadata: Metadata = {
  title: "Over Ons | XL Dranken",
  description:
    "Ontdek XL Dranken, dé specialist in alcoholische en non-alcoholische dranken met meer dan 900 verschillende producten.",
}

export default function OverOnsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <div className="relative">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-background"></div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/winkel/winkel1.png"
            alt="XL Dranken winkel"
            fill
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#d4af37] to-[#f5e7a3] bg-clip-text text-transparent">
              Over XL Dranken
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white">
              Welkom bij XL Dranken, dé specialist in alcoholische en non-alcoholische dranken. Met trots bieden wij een
              assortiment van meer dan 900 verschillende dranken aan.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#BEA46A]">XL Dranken</h2>
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                <div className="md:w-1/2">
                  <h3 className="text-xl font-semibold mb-4">900+ DRANKEN & PRODUCTEN</h3>
                  <p className="text-gray-700 mb-4">
                    Welkom bij XL Dranken, dé specialist in alcoholische en non-alcoholische dranken. Met trots bieden
                    wij een assortiment van meer dan 900 verschillende dranken aan, zorgvuldig geselecteerd om aan al uw
                    wensen te voldoen.
                  </p>
                  <p className="text-gray-700">
                    Van poolse bieren tot exclusieve alcoholise dranken en premium sterke drank en verfrissende
                    frisdranken - ons uitgebreide aanbod biedt voor ieder moment de perfecte drank. Ontdek nieuwe smaken
                    of vind uw vertrouwde favorieten in ons constant vernieuwende assortiment.
                  </p>
                </div>
                <div className="md:w-1/2 relative h-64 md:h-80 w-full rounded-lg overflow-hidden">
                  <Image src="/winkel/winkel2.jpeg" alt="XL Dranken assortiment" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4 text-[#BEA46A]">Onze Kwaliteit</h3>
              <p className="text-gray-700 mb-4">
                Kwaliteit staat bij ons voorop. We werken nauw samen met toonaangevende leveranciers en producenten om u
                alleen het beste te kunnen bieden.
              </p>
              <p className="text-gray-700">
                Ons deskundige team staat altijd klaar om u te adviseren, of u nu op zoek bent naar het perfecte cadeau
                of de ideale drank voor een speciale gelegenheid.
              </p>
              <div className="mt-6 relative h-48 w-full rounded-lg overflow-hidden">
                <Image src="/winkel/winkel2.jpeg" alt="XL Dranken kwaliteit" fill className="object-cover" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4 text-[#BEA46A]">Voor Particulieren & Bedrijven</h3>
              <p className="text-gray-700 mb-4">
                Naast ons uitgebreide drankenassortiment bieden we ook een selectie van food en non-food producten aan.
              </p>
              <p className="text-gray-700">
                XL Dranken is niet alleen uw partner voor particuliere aankopen, maar levert ook aan avondwinkels,
                supermarkten, cafés en bars. Onze flexibele service en brede productaanbod maken ons de ideale
                leverancier voor zowel particulieren als bedrijven in de horeca- en retailsector.
              </p>
              <div className="mt-6 relative h-48 w-full rounded-lg overflow-hidden">
                <Image src="/winkel/winkel3.jpeg" alt="XL Dranken voor bedrijven" fill className="object-cover" />
              </div>
            </div>
          </div>

          <div className="bg-[#0F3059] text-white rounded-lg shadow-lg p-6 md:p-8 mb-16">
            <h3 className="text-2xl font-semibold mb-6 text-[#BEA46A]">Ons Assortiment</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                </div>
                <h4 className="font-medium">Bieren</h4>
                <p className="text-sm text-gray-300 mt-1">Lokale levering</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <FontAwesomeIcon icon={faWineBottle} className="text-[#BEA46A] w-10 h-10" />
                </div>
                <h4 className="font-medium">Wijnen</h4>
                <p className="text-sm text-gray-300 mt-1">Rood, Wit & Rosé</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <FontAwesomeIcon icon={faGlassWhiskey} className="text-[#BEA46A] w-10 h-10" />
                </div>
                <h4 className="font-medium">Sterke Drank</h4>
                <p className="text-sm text-gray-300 mt-1">Premium Selectie</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <FontAwesomeIcon icon={faBottleWater} className="text-[#BEA46A] w-10 h-10" />
                </div>
                <h4 className="font-medium">Frisdranken</h4>
                <p className="text-sm text-gray-300 mt-1">Verfrissend & Smaakvol</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6 text-[#BEA46A]">Bezoek Onze Winkel</h3>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="relative h-64 md:h-full w-full rounded-lg overflow-hidden">
                  <Image src="/winkel/winkel3.jpeg" alt="XL Dranken winkel" fill className="object-cover" />
                </div>
              </div>
              <div className="md:w-1/2">
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

                <h4 className="font-medium text-lg mb-2">Adres</h4>
                <p className="text-gray-700 mb-4">
                  Turfschipper 116
                  <br />
                  2292 JB Wateringen
                  <br />
                  Nederland
                </p>

                <h4 className="font-medium text-lg mb-2">Contact</h4>
                <p className="text-gray-700">
                  Telefoon:{" "}
                  <a href="tel:+31618495949" className="text-[#0F3059] hover:underline">
                    +31 6 18495949
                  </a>
                  <br />
                  Email:{" "}
                  <a href="mailto:info@xldranken.nl" className="text-[#0F3059] hover:underline">
                    info@xldranken.nl
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
