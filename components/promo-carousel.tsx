"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Book, Smartphone, Store, HandshakeIcon } from "lucide-react"

const promos = [
  {
    title: "Welkom bij XL Dranken – Uw Specialist in Dranken",
    description: "Ontdek een breed assortiment aan alcoholische dranken, frisdranken en exclusieve merken.",
    discount: "20% KORTING",
    image:
      "https://images.pexels.com/photos/66636/pexels-photo-66636.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    buttonText: "Nu bestellen",
    href: "#",
  },
  {
    title: "Bekijk nu de aanbieding van deze maand",
    description: "Aanbieding vanaf 23/01/2025 Sydney Dranken",
    discount: "KORTINGEN TOT WEL 20%",
    image:
      "https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    buttonText: "Meer informatie",
    href: "#",
  },
  {
    title: "Ontdek Onze Eigen Merken – Exclusieve Rumselectie",
    description: "Geniet van een exotische reis met onze ambachtelijke rumcollectie.",
    discount: "25% KORTING",
    image:
      "https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    buttonText: "Bekijken",
    href: "#",
  },
]

const navCards = [
  {
    title: "Folders",
    icon: Book,
    href: "#",
  },
  {
    title: "XL Groothandel B.V. Bestellapp",
    icon: Smartphone,
    href: "#",
  },
  {
    title: "Vestiging",
    icon: Store,
    href: "#",
  },
  {
    title: "Registreren",
    icon: HandshakeIcon,
    href: "#",
  },
]

export function PromoGrid() {
  return (
    <div className="space-y-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Grote afbeelding links */}
          <div className="relative h-[600px] md:h-full overflow-hidden rounded-lg transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 hover:rotate-1 group">
            <Image
              src="/winkel/winkel1.jpeg"
              alt={promos[0].description}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-6">
              <div className="inline-block bg-[#E2B505] text-white px-3 py-1 text-sm self-start transform transition-transform duration-300 group-hover:translate-y-1 group-hover:-rotate-2">
                WEBSHOP*
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white leading-tight mb-2 transform transition-transform duration-300 group-hover:translate-x-2">
                  {promos[0].title}
                </h2>
                <p className="text-white mb-4 transform transition-transform duration-300 group-hover:translate-x-1">
                  {promos[0].description}
                </p>
                <p className="text-2xl font-bold text-white mb-4 transform transition-transform duration-300 group-hover:translate-x-1">
                  {promos[0].discount}
                </p>
                <Link href={promos[0].href}>
                  <Button className="bg-[#E2B505] hover:bg-[#E2B505]/90 transform hover:scale-105 transition-all duration-300 hover:shadow-lg active:scale-95 hover:-translate-y-1 hover:rotate-1">
                    {promos[0].buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Twee kleinere afbeeldingen rechts, verticaal gestapeld */}
          <div className="space-y-6">
            {promos.slice(1).map((promo, index) => (
              <div
                key={index}
                className="relative h-[290px] overflow-hidden rounded-lg transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 hover:rotate-1 group"
              >
                <Image
                  src={promo.image || "/winkel/winkel2.jpeg"}
                  alt={promo.description}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-6">
                  <h2 className="text-3xl font-bold text-white leading-tight mb-2 transform transition-transform duration-300 group-hover:translate-x-2">
                    {promo.title}
                  </h2>
                  <div>
                    <p className="text-white mb-4 transform transition-transform duration-300 group-hover:translate-x-1">
                      {promo.description}
                    </p>
                    <Link href={promo.href}>
                      <Button className="bg-[#E2B505] hover:bg-[#E2B505]/90 transform hover:scale-105 transition-all duration-300 hover:shadow-lg active:scale-95 hover:-translate-y-1 hover:rotate-1">
                        {promo.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigatiekaarten */}
      <div className="bg-[#E8F0FE]">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {navCards.map((card, index) => (
              <Link
                key={index}
                href={card.href}
                className="group bg-white rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 hover:rotate-1"
              >
                <card.icon className="w-12 h-12 text-[#E2B505] mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                <span className="text-[#E2B505] font-medium transition-transform duration-300 group-hover:translate-y-1">
                  {card.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
