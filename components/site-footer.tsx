import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram, faPinterestP } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteFooter() {
  return (
    <footer className="bg-indigo-950 text-white pt-12 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Image
                src="/logos/logo-wit.png"
                alt="Shopping Awards Winner"
                width={300}
                height={60}
                className="object-contain"
              />
            <h3 className="font-bold mb-4 mt-4">Informatie</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mailto:info@xlgroothandelbv.nl" className="font-bold hover:text-[#d0c298]">info@xlgroothandelbv.nl</Link></li>
              <li><Link href="/contact" className="font-bold hover:text-[#d0c298]">Turfschipper 116, 2292 JB Wateringen</Link></li>
              <li><Link href="/tel:0615472574" className="font-bold hover:text-[#d0c298]">Klantenservice +31 6 154 725 74</Link></li>
              <li><Link href="/blank" className="text-green-600  font-bold hover:text-[#d0c298]">Whatsapp bericht versturen</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">SHOP</h3>
            <ul className="space-y-2 text-md font-medium">
              <li><Link href="/shop" className="hover:text-[#d0c298]">Gehele assortiment</Link></li>
              <li><Link href="/alcohol" className="hover:text-[#d0c298]">Alcohol</Link></li>
              <li><Link href="/bier" className="hover:text-[#d0c298]">Bier</Link></li>
              <li><Link href="/cocktails" className="hover:text-[#d0c298]">Cocktails</Link></li>
              <li><Link href="/frisdranken" className="hover:text-[#d0c298]">Frisdranken</Link></li>
              <li><Link href="/mix-dranken" className="hover:text-[#d0c298]">Mix dranken</Link></li>
              <li><Link href="/cognac" className="hover:text-[green] font-bold">ACTIES</Link></li>
            </ul>
          </div>

          {/* Discover Column */}
          <div>
            <h3 className="font-bold mb-4">QUICK LINKS</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/port-en-sherry" className="hover:text-[#d0c298]">Wenslijst</Link></li>
              <li><Link href="/bier" className="hover:text-[#d0c298]">Winkelmand</Link></li>
              <li><Link href="/alcoholvrij" className="hover:text-[#d0c298]">Mijn account</Link></li>
              <li><Link href="/cadeau" className="hover:text-[#d0c298]">Mijn bestellingen</Link></li>
              <li><Link href="/acties" className="hover:text-[#d0c298]">Bestellijst</Link></li>
              <li><Link href="/kelderopruiming" className="hover:text-[#d0c298]">Kelderopruiming</Link></li>
            </ul>
          </div>

          {/* Service Column */}
          <div>
            <h3 className="font-bold mb-4">SERVICE</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/zakelijk" className="hover:text-[#d0c298]">Zakelijk</Link></li>
              <li><Link href="/winkels" className="hover:text-[#d0c298]">Winkels</Link></li>
              <li><Link href="/contact" className="hover:text-[#d0c298]">Contact</Link></li>
              <li><Link href="/mijn-account" className="hover:text-[#d0c298]">Mijn account</Link></li>
              <li><Link href="/folder" className="hover:text-[#d0c298]">Folder</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold mb-4">XL DRANKEN</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/over-ons" className="hover:text-[#d0c298]">Over XL Dranken</Link></li>
              <li><Link href="/vacatures" className="hover:text-[#d0c298]">Vacatures</Link></li>
              <li><Link href="/duurzaamheid" className="hover:text-[#d0c298]">Duurzaamheid en XL Dranken</Link></li>
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
          <div className="mt-6 flex flex-col md:flex-row space-between justify-center items-center text-sm text-white">
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-center">
              <span>Gebouwd met NextJS door Multichoiceagency en YX Digital © 2025 XL Dranken</span>
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

