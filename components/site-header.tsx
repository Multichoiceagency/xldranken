"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Info, ShoppingCart, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type React from "react" // Added import for React

export function SiteHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAlert, setShowAlert] = useState(true)


  return (
    <header className="w-full bg-[#ffff] sticky top-0 justify-center z-50">
      {/* Main Navigation */}
      <div className="w-full text-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logos/logo-xlgroothandelbv.jpg"
                alt="Makro Logo"
                width={250}
                height={40}
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 ml-8">
              <NavLink href="/webshop" icon={<ShoppingCart className="h-4 w-4" />}>
                Webshop
              </NavLink>
              <NavLink href="/assortiment" icon={<Menu className="h-4 w-4" />}>
                Assortiment & acties
              </NavLink>
              <NavLink href="/horeca" icon={<ShoppingCart className="h-4 w-4" />}>
                Horeca Bezorgservice
              </NavLink>
              <NavLink href="/info" icon={<Info className="h-4 w-4" />}>
                Informatie & services
              </NavLink>
            </nav>

            {/* Login Button */}
            <div className="ml-auto">
              <Button variant="default" className="bg-[#E2B505] hover:bg-[#48392A]/90 text-white">
                Registreren/Inloggen
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full bg-[#E8F0FE]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Zoeken"
                className="w-full pl-10 pr-4 py-2 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Alert Bar */}
      {showAlert && (
        <div className="w-full bg-[#E2B505] text-white py-2">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <Link href="/">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                <span>Aanbieding vanaf 23/01/2025 Sydney Dranken</span>
              </div>
              </Link>
              <button
                onClick={() => setShowAlert(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Sluiten"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
<Link
  href={href}
  className="flex items-center gap-2 px-3 py-2 rounded-[10px] border-[2px] border-[#E2B505] hover:bg-[#E2B505] hover:text-white transition-colors"
>      {icon}
      <span>{children}</span>
    </Link>
  )
}

