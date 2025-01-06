'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram } from 'lucide-react'
import { PinterestIcon } from "./pinterest-icon"

export function NewsletterSocial() {
  return (
    <div className="bg-muted py-12">
      <div className="container px-4">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Newsletter Section */}
          <div>
            <h2 className="text-2xl font-bold mb-2">NIEUWSBRIEF</h2>
            <p className="mb-4">Meld je nu aan voor exclusieve aanbiedingen en tips</p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Vul je e-mailadres in"
                className="flex-grow"
              />
              <Button>
                Aanmelden
              </Button>
            </form>
            <p className="text-sm mt-4 text-muted-foreground">
              Dit formulier is beschermd met reCaptcha, het{" "}
              <Link href="/privacy" className="underline">
                privacybeleid
              </Link>{" "}
              en{" "}
              <Link href="/terms" className="underline">
                servicevoorwaarden
              </Link>{" "}
              zijn van toepassing.
            </p>
          </div>

          {/* Social Media Section */}
          <div>
            <h2 className="text-2xl font-bold mb-2">VOLG ONS</h2>
            <p className="mb-4">Blijf op de hoogte via onze social media kanalen</p>
            <div className="flex gap-4">
              <Link 
                href="https://instagram.com" 
                target="_blank"
                className="bg-primary p-3 rounded-full hover:bg-primary/80 transition-colors"
              >
                <Instagram className="h-6 w-6 text-primary-foreground" />
              </Link>
              <Link 
                href="https://pinterest.com" 
                target="_blank"
                className="bg-primary p-3 rounded-full hover:bg-primary/80 transition-colors"
              >
                <PinterestIcon className="h-6 w-6 text-primary-foreground" />
              </Link>
              <Link 
                href="https://facebook.com" 
                target="_blank"
                className="bg-primary p-3 rounded-full hover:bg-primary/80 transition-colors"
              >
                <Facebook className="h-6 w-6 text-primary-foreground" />
              </Link>
            </div>
          </div>
        </div>

        {/* Service and Contact Section */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold mb-4">SERVICE EN CONTACT</h2>
            <p className="text-muted-foreground">
              Wij staan voor u klaar. Neem gerust contact met ons op voor al uw vragen.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-bold mb-2">HEB JE ONZE HULP NODIG?</h3>
              <p className="text-muted-foreground">
                We helpen je graag.{" "}
                <Link href="/chat" className="text-primary hover:underline">
                  Chat met ons
                </Link>
                {" "}of{" "}
                <Link href="/feedback" className="text-primary hover:underline">
                  geef feedback
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

