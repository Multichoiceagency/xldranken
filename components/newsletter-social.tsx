'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram } from 'lucide-react'
import { PinterestIcon } from "./pinterest-icon"

export function NewsletterSocial() {
  return (
    <div className="border-t border-b py-12">
      <div className="container px-4">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Newsletter Section */}
          <div>
            <h2 className="text-xl font-bold mb-2">NIEUWSBRIEF</h2>
            <p className="mb-4">Meld je nu aan</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Vul je e-mailadres in"
                className="max-w-md"
              />
              <Button className="bg-[#FF6B35] hover:bg-[#E85A24] text-white">
                →
              </Button>
            </div>
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
            <h2 className="text-xl font-bold mb-2">VOLG ONS</h2>
            <p className="mb-4">Op social media</p>
            <div className="flex gap-4">
              <Link 
                href="https://instagram.com" 
                target="_blank"
                className="bg-[#FF6B35] p-2 rounded-md hover:bg-[#E85A24] transition-colors"
              >
                <Instagram className="h-6 w-6 text-white" />
              </Link>
              <Link 
                href="https://pinterest.com" 
                target="_blank"
                className="bg-[#FF6B35] p-2 rounded-md hover:bg-[#E85A24] transition-colors"
              >
                <PinterestIcon className="h-6 w-6 text-white" />
              </Link>
              <Link 
                href="https://facebook.com" 
                target="_blank"
                className="bg-[#FF6B35] p-2 rounded-md hover:bg-[#E85A24] transition-colors"
              >
                <Facebook className="h-6 w-6 text-white" />
              </Link>
            </div>
          </div>
        </div>

        {/* Service and Contact Section */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
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
  )
}

