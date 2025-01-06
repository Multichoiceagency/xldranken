import Link from "next/link"

export function SiteFooter() {
  return (
    <footer>
      {/* Service and Contact Section */}
      <div className="border-t border-b py-12">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold mb-4">SERVICE EN CONTACT</h2>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-bold mb-2">HEB JE ONZE HULP NODIG?</h3>
                <p className="text-muted-foreground">
                  We helpen je graag.{" "}
                  <Link href="/chat" className="text-[#FF6B35] hover:underline">
                    Chat met ons
                  </Link>
                  {" "}of{" "}
                  <Link href="/feedback" className="text-[#FF6B35] hover:underline">
                    geef feedback
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gray-100">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Shop Column */}
            <div>
              <h3 className="font-bold mb-4">SHOP</h3>
              <ul className="space-y-2">
                <li><Link href="/wijn" className="hover:text-[#FF6B35]">Wijn</Link></li>
                <li><Link href="/mousserend" className="hover:text-[#FF6B35]">Mousserend</Link></li>
                <li><Link href="/whisky" className="hover:text-[#FF6B35]">Whisky</Link></li>
                <li><Link href="/mixen" className="hover:text-[#FF6B35]">Mixen</Link></li>
                <li><Link href="/likeuren" className="hover:text-[#FF6B35]">Likeuren</Link></li>
                <li><Link href="/jenever-bitter-vieux" className="hover:text-[#FF6B35]">Jenever, Bitter & Vieux</Link></li>
                <li><Link href="/cognac" className="hover:text-[#FF6B35]">Cognac</Link></li>
              </ul>
            </div>

            {/* Discover Column */}
            <div>
              <h3 className="font-bold mb-4">ONTDEK</h3>
              <ul className="space-y-2">
                <li><Link href="/port-en-sherry" className="hover:text-[#FF6B35]">Port en sherry</Link></li>
                <li><Link href="/bier" className="hover:text-[#FF6B35]">Bier</Link></li>
                <li><Link href="/alcoholvrij" className="hover:text-[#FF6B35]">Alcoholvrij</Link></li>
                <li><Link href="/cadeau" className="hover:text-[#FF6B35]">Cadeau</Link></li>
                <li><Link href="/acties" className="hover:text-[#FF6B35]">Acties</Link></li>
                <li><Link href="/kelderopruiming" className="hover:text-[#FF6B35]">Kelderopruiming</Link></li>
              </ul>
            </div>

            {/* Service Column */}
            <div>
              <h3 className="font-bold mb-4">SERVICE</h3>
              <ul className="space-y-2">
                <li><Link href="/meest-gestelde-vragen" className="hover:text-[#FF6B35]">Meest gestelde vragen</Link></li>
                <li><Link href="/online-drank-bestellen" className="hover:text-[#FF6B35]">Online drank bestellen</Link></li>
                <li><Link href="/zakelijk" className="hover:text-[#FF6B35]">Zakelijk</Link></li>
                <li><Link href="/winkels" className="hover:text-[#FF6B35]">Winkels</Link></li>
                <li><Link href="/contact" className="hover:text-[#FF6B35]">Contact</Link></li>
                <li><Link href="/smaakgarantie" className="hover:text-[#FF6B35]">Smaakgarantie</Link></li>
                <li><Link href="/mijn-account" className="hover:text-[#FF6B35]">Mijn account</Link></li>
                <li><Link href="/folder" className="hover:text-[#FF6B35]">Folder</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-bold mb-4">XL DRANKEN</h3>
              <ul className="space-y-2">
                <li><Link href="/over-ons" className="hover:text-[#FF6B35]">Over XL Dranken</Link></li>
                <li><Link href="/vacatures" className="hover:text-[#FF6B35]">Vacatures</Link></li>
                <li><Link href="/premium" className="hover:text-[#FF6B35]">Mijn XL Dranken Premium</Link></li>
                <li><Link href="/kwetsbaarheid" className="hover:text-[#FF6B35]">Kwetsbaarheid melden</Link></li>
                <li><Link href="/verantwoord-alcoholgebruik" className="hover:text-[#FF6B35]">Verantwoord alcoholgebruik</Link></li>
                <li><Link href="/duurzaamheid" className="hover:text-[#FF6B35]">Duurzaamheid en XL Dranken</Link></li>
                <li><Link href="/pers" className="hover:text-[#FF6B35]">Pers</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200">
          <div className="container px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Awards and Certifications */}
              <div className="flex items-center gap-6">
                <img
                  src="/placeholder.svg?height=40&width=120"
                  alt="Thuiswinkel Waarborg"
                  className="object-contain h-40 w-120"
                />
                <img
                  src="/placeholder.svg?height=40&width=120"
                  alt="Shopping Awards Winner"
                  className="object-contain h-40 w-120"
                />
                <img
                  src="/placeholder.svg?height=40&width=120"
                  alt="Publieksprijs Winner"
                  className="object-contain h-40 w-120"
                />
              </div>

              {/* NIX18 Logo */}
              <div>
                <img
                  src="/placeholder.svg?height=40&width=80"
                  alt="NIX18"
                  className="object-contain h-40 w-80"
                />
              </div>
            </div>

            {/* Copyright and Legal */}
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
              <div className="flex flex-wrap items-center gap-2">
                <span>© 2025 XL Dranken</span>
                <span>|</span>
                <Link href="/algemene-voorwaarden" className="hover:text-[#FF6B35]">
                  Algemene voorwaarden
                </Link>
                <span>-</span>
                <Link href="/privacybeleid" className="hover:text-[#FF6B35]">
                  Privacybeleid
                </Link>
                <span>-</span>
                <Link href="/cookiebeleid" className="hover:text-[#FF6B35]">
                  Cookiebeleid
                </Link>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p>{'< 18 jaar, deze website is niet voor jou bestemd'}</p>
                <p>{'< 18 jaar verkopen wij geen alcohol'}</p>
                <p>{'< 25 jaar, laat je legitimatie zien'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

