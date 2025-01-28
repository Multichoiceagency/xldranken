import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram, faPinterestP } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteFooter() {
  return (
    <footer className="bg-white pt-12 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Image
                src="/logos/logo-xlgroothandelbv.jpg"
                alt="Shopping Awards Winner"
                width={300}
                height={60}
                className="object-contain"
              />
            <h3 className="font-bold mb-4 mt-4">Informatie</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mailto:info@xlgroothandelbv.nl" className="font-bold hover:text-[#FFD700]">info@xlgroothandelbv.nl</Link></li>
              <li><Link href="/contact" className="font-bold hover:text-[#FFD700]">Turfschipper 116, 2292 JB Wateringen</Link></li>
              <li><Link href="/tel:0615472574" className="font-bold hover:text-[#FFD700]">Klantenservice +31 6 154 725 74</Link></li>
              <li><Link href="/blank" className="text-green-600  font-bold hover:text-[#FFD700]">Whatsapp bericht versturen</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">SHOP</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/wijn" className="hover:text-[#FFD700]">Wijn</Link></li>
              <li><Link href="/mousserend" className="hover:text-[#FFD700]">Mousserend</Link></li>
              <li><Link href="/whisky" className="hover:text-[#FFD700]">Whisky</Link></li>
              <li><Link href="/mixen" className="hover:text-[#FFD700]">Mixen</Link></li>
              <li><Link href="/likeuren" className="hover:text-[#FFD700]">Likeuren</Link></li>
              <li><Link href="/jenever-bitter-vieux" className="hover:text-[#FFD700]">Jenever, Bitter & Vieux</Link></li>
              <li><Link href="/cognac" className="hover:text-[#FFD700]">Cognac</Link></li>
            </ul>
          </div>

          {/* Discover Column */}
          <div>
            <h3 className="font-bold mb-4">ONTDEK</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/port-en-sherry" className="hover:text-[#FFD700]">Port en sherry</Link></li>
              <li><Link href="/bier" className="hover:text-[#FFD700]">Bier</Link></li>
              <li><Link href="/alcoholvrij" className="hover:text-[#FFD700]">Alcoholvrij</Link></li>
              <li><Link href="/cadeau" className="hover:text-[#FFD700]">Cadeau</Link></li>
              <li><Link href="/acties" className="hover:text-[#FFD700]">Acties</Link></li>
              <li><Link href="/kelderopruiming" className="hover:text-[#FFD700]">Kelderopruiming</Link></li>
            </ul>
          </div>

          {/* Service Column */}
          <div>
            <h3 className="font-bold mb-4">SERVICE</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/meest-gestelde-vragen" className="hover:text-[#FFD700]">Meest gestelde vragen</Link></li>
              <li><Link href="/online-drank-bestellen" className="hover:text-[#FFD700]">Online drank bestellen</Link></li>
              <li><Link href="/zakelijk" className="hover:text-[#FFD700]">Zakelijk</Link></li>
              <li><Link href="/winkels" className="hover:text-[#FFD700]">Winkels</Link></li>
              <li><Link href="/contact" className="hover:text-[#FFD700]">Contact</Link></li>
              <li><Link href="/smaakgarantie" className="hover:text-[#FFD700]">Smaakgarantie</Link></li>
              <li><Link href="/mijn-account" className="hover:text-[#FFD700]">Mijn account</Link></li>
              <li><Link href="/folder" className="hover:text-[#FFD700]">Folder</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold mb-4">XL DRANKEN</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/over-ons" className="hover:text-[#FFD700]">Over XL Dranken</Link></li>
              <li><Link href="/vacatures" className="hover:text-[#FFD700]">Vacatures</Link></li>
              <li><Link href="/premium" className="hover:text-[#FFD700]">Mijn XL Dranken Premium</Link></li>
              <li><Link href="/kwetsbaarheid" className="hover:text-[#FFD700]">Kwetsbaarheid melden</Link></li>
              <li><Link href="/verantwoord-alcoholgebruik" className="hover:text-[#FFD700]">Verantwoord alcoholgebruik</Link></li>
              <li><Link href="/duurzaamheid" className="hover:text-[#FFD700]">Duurzaamheid en XL Dranken</Link></li>
              <li><Link href="/pers" className="hover:text-[#FFD700]">Pers</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Awards and Certifications */}
            <div className="flex items-center gap-6">
              <Image
                src="/logos/nix18-scaled.jpg"
                alt="Publieksprijs Winner"
                width={120}
                height={40}
                className="object-contain"
              />
            </div>

            {/* NIX18 Logo */}
            <div>
            <Image
                src="/logos/betalen-met-ideal.jpg"
                alt="Shopping Awards Winner"
                width={700}
                height={120}
                className="object-contain"
              />
            </div>
            
          </div>
          {/* Copyright and Legal */}
          <div className="mt-6 flex flex-col md:flex-row space-between items-center text-sm text-gray-600">
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-center">
              <span>Gebouwd met React Native door Multichoiceagency © 2025 XL Dranken</span>
              <span>|</span>
              <Link href="/algemene-voorwaarden" className="hover:text-[#FFD700]">
                Algemene voorwaarden
              </Link>
              <span>-</span>
              <Link href="/privacybeleid" className="hover:text-[#FFD700]">
                Privacybeleid
              </Link>
              <span>-</span>
              <Link href="/cookiebeleid" className="hover:text-[#FFD700]">
                Cookiebeleid
              </Link>
            </div>
          </div>
        </div>
        </div>
    </footer>
  )
}

