import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebookF, faInstagram, faPinterestP, faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import {
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
  faCreditCard,
  faUniversity,
  faShieldAlt,
  faLock,
} from "@fortawesome/free-solid-svg-icons"

// Menu structure with submenus
const menuItems = [
  {
    name: "ALCOHOL",
    href: "/alcohol",
    submenu: [
      { name: "STERKE DRANK", href: "/sterke-drank", id: "16" },
      { name: "MIX DRANK", href: "/mix-drank", id: "5" },
      { name: "COCKTAILS", href: "/cocktails", id: "10" },
      { name: "LOVKA", href: "/lovka", id: "" },
    ],
  },
  {
    name: "WIJN",
    href: "/wijn",
    submenu: [],
  },
  {
    name: "BIER",
    href: "/bier",
    submenu: [
      { name: "POOLSE BIER BLIK", href: "/poolse-bieren-blik", id: "4" },
      { name: "POOLSE BIER FLES", href: "/poolse-bieren-flex", id: "3" },
      { name: "NL BIER", href: "/poolse-bieren-blik", id: "5" },
    ],
  },
  {
    name: "FRISDRANKEN",
    href: "/frisdranken",
    submenu: [
      { name: "FRISDRANKEN", href: "/frisdranken", id: "6" },
      { name: "LIMONADEN", href: "/limonaden", id: "1" },
      { name: "WATER NL", href: "/water-nl", id: "7" },
      { name: "WATER PL", href: "/water-pl", id: "12" },
      { name: "KOFFIE THEE", href: "/koffie-thee", id: "18" },
    ],
  },
  {
    name: "FOOD",
    href: "/food",
    submenu: [],
  },
  {
    name: "NON-FOOD",
    href: "/non-food",
    submenu: [],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-indigo-950 text-white pt-12 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Information Column */}
          <div>
            <Image src="/logos/logo-wit.png" alt="XL Dranken Logo" width={300} height={60} className="object-contain" />
            <h3 className="font-bold mb-4 mt-4">Informatie</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="mailto:info@xlgroothandelbv.nl"
                  className="font-bold hover:text-[#d0c298] flex items-center"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 w-4 h-4" />
                  Turfschipper 116, 2292 JB Wateringen
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-bold hover:text-[#d0c298] flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 w-4 h-4" />
                  info@xlgroothandelbv.nl
                </Link>
              </li>
              <li>
                <Link href="tel:0615472574" className="font-bold hover:text-[#d0c298] flex items-center">
                  <FontAwesomeIcon icon={faPhone} className="mr-2 w-4 h-4" />
                  Klantenservice +31 6 154 725 74
                </Link>
              </li>
              <li>
                <Link href="/blank" className="text-green-600 font-bold hover:text-[#d0c298] flex items-center">
                  <FontAwesomeIcon icon={faWhatsapp} className="mr-2 w-4 h-4" />
                  Whatsapp bericht versturen
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop Column - Using menuItems */}
          <div>
            <h3 className="font-bold mb-4">SHOP</h3>
            <ul className="space-y-2 text-md font-medium">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`hover:text-[#d0c298] ${item.name === "ACTIES" ? "text-green-600 font-bold" : ""}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-bold mb-4">QUICK LINKS</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/bier" className="hover:text-[#d0c298]">
                  Winkelmand
                </Link>
              </li>
              <li>
                <Link href="/alcoholvrij" className="hover:text-[#d0c298]">
                  Mijn account
                </Link>
              </li>
              <li>
                <Link href="/cadeau" className="hover:text-[#d0c298]">
                  Mijn bestellingen
                </Link>
              </li>
            </ul>

            {/* Service Section */}
            <h3 className="font-bold mb-4 mt-6">SERVICE</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/zakelijk" className="hover:text-[#d0c298]">
                  Zakelijk
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#d0c298]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/mijn-account" className="hover:text-[#d0c298]">
                  Mijn account
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold mb-4">XL DRANKEN</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/over-ons" className="hover:text-[#d0c298]">
                  Over XL Dranken
                </Link>
              </li>
            </ul>

            {/* Payment Methods */}
            <h3 className="font-bold mb-4 mt-6">BETAALMETHODEN</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-white text-indigo-950 px-3 py-2 rounded">
                <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                <span className="font-medium text-sm">iDEAL</span>
              </div>
              <div className="flex items-center bg-white text-indigo-950 px-3 py-2 rounded">
                <FontAwesomeIcon icon={faUniversity} className="mr-2" />
                <span className="font-medium text-sm">Bankoverschrijving</span>
              </div>
            </div>

            {/* Secure Payment */}
            <div className="mt-4 flex items-center text-sm">
              <FontAwesomeIcon icon={faLock} className="mr-2 text-green-500" />
              <span>Veilig & vertrouwd betalen</span>
            </div>

            {/* Social Media */}
            <h3 className="font-bold mb-4 mt-6">VOLG ONS</h3>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="hover:text-[#d0c298]">
                <FontAwesomeIcon icon={faFacebookF} className="w-5 h-5" />
              </Link>
              <Link href="https://instagram.com" className="hover:text-[#d0c298]">
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
              </Link>
              <Link href="https://pinterest.com" className="hover:text-[#d0c298]">
                <FontAwesomeIcon icon={faPinterestP} className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* NIX18 Logo */}
            <div className="flex items-center gap-6">
              <Image src="/logos/nix18-scaled.jpg" alt="NIX18" width={120} height={40} className="object-contain" />
            </div>

            {/* Security Badge */}
            <div className="flex items-center">
              <FontAwesomeIcon icon={faShieldAlt} className="text-green-500 w-8 h-8 mr-2" />
              <div className="text-sm">
                <p className="font-bold">Veilig winkelen</p>
                <p>SSL Beveiligde betaling</p>
              </div>
            </div>
          </div>

          {/* Copyright and Legal */}
          <div className="mt-6 flex flex-col md:flex-row space-between justify-center items-center text-sm text-white">
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-center">
              <span>Gebouwd met NextJS door Multichoiceagency en YX Digital © 2025 XL Dranken - Megawin Kassasysteem</span>
              <span>|</span>
              <Link href="/algemene-voorwaarden" className="hover:text-[#d0c298]">
                Algemene voorwaarden
              </Link>
              <span>-</span>
              <Link href="/privacybeleid" className="hover:text-[#d0c298]">
                Privacybeleid
              </Link>
              <span>-</span>
              <Link href="/cookiebeleid" className="hover:text-[#d0c298]">
                Cookiebeleid
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

