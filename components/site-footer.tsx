"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebookF, faInstagram, faTiktok, faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import {
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
  faCreditCard,
  faUniversity,
  faShieldAlt,
  faLock,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons"
import { useAuthContext } from "@/context/AuthContext"
import { useCart } from "@/lib/cart-context"

// Menu structure with submenus
const menuItems = [
  {
    name: "Alcohol",
    href: "categorie/sterke-drank",
    submenu: [],
  },
  {
    name: "Wijn",
    href: "/categorie/wijn",
    submenu: [],
  },
  {
    name: "Bier",
    href: "/categorie/bier",
    submenu: [],
  },
  {
    name: "Frisdranken",
    href: "/categorie/frisdranken",
    submenu: [],
  },
  {
    name: "Food",
    href: "/categorie/food",
    submenu: [],
  },
  {
    name: "Non-Food",
    href: "/categorie/non-food",
    submenu: [],
  },
]

export function SiteFooter() {
  const { isLoggedIn } = useAuthContext()
  const { totalItems } = useCart().getCartTotal()

  // Accordion state for mobile
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({})

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const AccordionSection = ({
    title,
    children,
    sectionKey,
  }: {
    title: string
    children: React.ReactNode
    sectionKey: string
  }) => (
    <div className="border-b border-[#C6B07F]/20 md:border-none">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between py-4 md:hidden text-left"
      >
        <h3 className="font-bold text-[#C6B07F] text-lg">{title}</h3>
        <FontAwesomeIcon
          icon={openSections[sectionKey] ? faChevronUp : faChevronDown}
          className="w-4 h-4 text-[#C6B07F]"
        />
      </button>

      {/* Desktop title */}
      <h3 className="hidden md:block font-bold text-[#C6B07F] text-lg mb-6">{title}</h3>

      {/* Content */}
      <div className={`${openSections[sectionKey] ? "block" : "hidden"} md:block pb-4 md:pb-0`}>{children}</div>
    </div>
  )

  return (
    <footer className="bg-gradient-to-br from-[#0F3059] via-[#1a4a7a] to-[#0F3059] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C6B07F]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#C6B07F]/5 to-transparent rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Information Column */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <Image
                src="/logos/logo-wit.png"
                alt="XL Groothandel Logo"
                width={280}
                height={60}
                className="object-contain mb-6"
              />
            </div>

            <AccordionSection title="CONTACT INFORMATIE" sectionKey="contact">
              <ul className="space-y-4 text-sm">
                <li>
                  <Link
                    href="https://www.google.com/maps/search/?api=1&query=Turfschipper+116,+2292+JB+Wateringen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#C6B07F] flex items-start transition-colors duration-300 group"
                  >
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="mr-3 w-4 h-4 mt-1 text-[#C6B07F] group-hover:scale-110 transition-transform"
                    />
                    <span>Turfschipper 116, 2292 JB Wateringen</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:info@xlgroothandelbv.nl"
                    className="hover:text-[#C6B07F] flex items-center transition-colors duration-300 group"
                  >
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="mr-3 w-4 h-4 text-[#C6B07F] group-hover:scale-110 transition-transform"
                    />
                    <span>info@xlgroothandelbv.nl</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="tel:06184959494"
                    className="hover:text-[#C6B07F] flex items-center transition-colors duration-300 group"
                  >
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="mr-3 w-4 h-4 text-[#C6B07F] group-hover:scale-110 transition-transform"
                    />
                    <span>Klantenservice +31 6 184 959 49</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://wa.me/31618495949"
                    className="text-green-400 hover:text-green-300 flex items-center transition-colors duration-300 group"
                  >
                    <FontAwesomeIcon
                      icon={faWhatsapp}
                      className="mr-3 w-4 h-4 group-hover:scale-110 transition-transform"
                    />
                    <span>WhatsApp bericht versturen</span>
                  </Link>
                </li>
              </ul>
            </AccordionSection>
          </div>

          {/* Shop Column */}
          <div>
            <AccordionSection title="SHOP CATEGORIEËN" sectionKey="shop">
              <ul className="space-y-3 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="hover:text-[#C6B07F] transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-[#C6B07F] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionSection>
          </div>

          {/* Account & Service Column */}
          <div>
            <AccordionSection title={isLoggedIn ? "MIJN ACCOUNT" : "INLOGGEN"} sectionKey="account">
              <ul className="space-y-3 text-sm mb-6">
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link
                        href="/account"
                        className="hover:text-[#C6B07F] transition-colors duration-300 flex items-center group"
                      >
                        <span className="w-2 h-2 bg-[#C6B07F] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                        Mijn account
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/account/gegevens"
                        className="hover:text-[#C6B07F] transition-colors duration-300 flex items-center group"
                      >
                        <span className="w-2 h-2 bg-[#C6B07F] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                        Accountgegevens
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/account/bestellingen"
                        className="hover:text-[#C6B07F] transition-colors duration-300 flex items-center group"
                      >
                        <span className="w-2 h-2 bg-[#C6B07F] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                        Mijn bestellingen
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        href="/login"
                        className="hover:text-[#C6B07F] transition-colors duration-300 flex items-center group"
                      >
                        <span className="w-2 h-2 bg-[#C6B07F] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                        Inloggen
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/zakelijk"
                        className="hover:text-[#C6B07F] transition-colors duration-300 flex items-center group"
                      >
                        <span className="w-2 h-2 bg-[#C6B07F] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                        Registreren
                      </Link>
                    </li>
                  </>
                )}
              </ul>

              <h4 className="font-semibold text-[#C6B07F] mb-4 hidden md:block">KLANTENSERVICE</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/klantenservice"
                    className="hover:text-[#C6B07F] transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-[#C6B07F] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    Klantenservice
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bezorging"
                    className="hover:text-[#C6B07F] transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-[#C6B07F] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    Bezorgen
                  </Link>
                </li>
                <li>
                  <Link
                    href="/retourneren"
                    className="hover:text-[#C6B07F] transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-[#C6B07F] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    Retourneren
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-[#C6B07F] transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-[#C6B07F] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    Veelgestelde Vragen
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-[#C6B07F] transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-[#C6B07F] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    Contact
                  </Link>
                </li>
              </ul>
            </AccordionSection>
          </div>

          {/* Company & Payment Column */}
          <div>
            <AccordionSection title="OVER ONS" sectionKey="company">
              <ul className="space-y-3 text-sm mb-6">
                <li>
                  <Link
                    href="/over-ons"
                    className="hover:text-[#C6B07F] transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-[#C6B07F] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    Over XL Groothandel B.V.
                  </Link>
                </li>
              </ul>

              {/* Payment Methods */}
              <h4 className="font-semibold text-[#C6B07F] mb-4">BETAALMETHODEN</h4>
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-lg border border-[#C6B07F]/30 hover:bg-white/20 transition-colors">
                  <FontAwesomeIcon icon={faCreditCard} className="mr-3 text-[#C6B07F]" />
                  <span className="font-medium text-sm">iDEAL</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-lg border border-[#C6B07F]/30 hover:bg-white/20 transition-colors">
                  <FontAwesomeIcon icon={faUniversity} className="mr-3 text-[#C6B07F]" />
                  <span className="font-medium text-sm">Bankoverschrijving</span>
                </div>
              </div>

              {/* Secure Payment */}
              <div className="flex items-center text-sm mb-6 bg-green-500/10 px-4 py-3 rounded-lg border border-green-500/30">
                <FontAwesomeIcon icon={faLock} className="mr-3 text-green-400" />
                <span>Veilig & vertrouwd betalen</span>
              </div>

              {/* Social Media */}
              <h4 className="font-semibold text-[#C6B07F] mb-4">VOLG ONS</h4>
              <div className="flex space-x-4">
                <Link
                  href="https://facebook.com"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#C6B07F] hover:text-[#0F3059] transition-all duration-300 group"
                >
                  <FontAwesomeIcon icon={faFacebookF} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
                <Link
                  href="https://instagram.com"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#C6B07F] hover:text-[#0F3059] transition-all duration-300 group"
                >
                  <FontAwesomeIcon icon={faInstagram} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
                <Link
                  href="https://tiktok.com"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#C6B07F] hover:text-[#0F3059] transition-all duration-300 group"
                >
                  <FontAwesomeIcon icon={faTiktok} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </AccordionSection>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#C6B07F]/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* NIX18 Logo */}
            <div className="flex items-center">
              <Image src="/logos/nix18-scaled.jpg" alt="NIX18" width={120} height={40} className="object-contain" />
            </div>

            {/* Security Badge */}
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg border border-[#C6B07F]/30">
              <FontAwesomeIcon icon={faShieldAlt} className="text-green-400 w-8 h-8 mr-3" />
              <div className="text-sm">
                <p className="font-bold text-[#C6B07F]">Veilig winkelen</p>
                <p className="text-white/80">SSL Beveiligde betaling</p>
              </div>
            </div>
          </div>

          {/* Copyright and Legal */}
          <div className="mt-8 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-sm text-white/80 mb-4">
              <span>Gebouwd met NextJS door Multichoiceagency en YX Digital © 2025 XL Groothandel</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link href="/algemene-voorwaarden" className="hover:text-[#C6B07F] transition-colors">
                Algemene voorwaarden
              </Link>
              <span className="text-[#C6B07F]">•</span>
              <Link href="/privacy-beleid" className="hover:text-[#C6B07F] transition-colors">
                Privacybeleid
              </Link>
              <span className="text-[#C6B07F]">•</span>
              <Link href="/cookie-beleid" className="hover:text-[#C6B07F] transition-colors">
                Cookiebeleid
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
