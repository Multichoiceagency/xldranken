'use client'

import Link from "next/link"
import { ClipboardList, MessageCircle, Tag, List, Package, Users, Download, MapPin, User, Heart, LogOut, Settings } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"

interface MenuItem {
  icon: React.ReactNode
  title: string
  href: string
}

const menuItems: MenuItem[] = [
  {
    icon: <ClipboardList className="w-8 h-8 text-gray-400" />,
    title: "Bestellingen",
    href: "/account/bestellingen"
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-gray-400" />,
    title: "Gesprekken",
    href: "/account/gesprekken"
  },
  {
    icon: <Tag className="w-8 h-8 text-gray-400" />,
    title: "Aanbiedingen",
    href: "/account/aanbiedingen"
  },
  {
    icon: <List className="w-8 h-8 text-gray-400" />,
    title: "Bestellijsten",
    href: "/account/bestellijsten"
  },
  {
    icon: <Package className="w-8 h-8 text-gray-400" />,
    title: "Bulkbestelling",
    href: "/account/bulkbestelling"
  },
  {
    icon: <Users className="w-8 h-8 text-gray-400" />,
    title: "Subaccounts",
    href: "/account/subaccounts"
  },
  {
    icon: <Download className="w-8 h-8 text-gray-400" />,
    title: "Downloads",
    href: "/account/downloads"
  },
  {
    icon: <MapPin className="w-8 h-8 text-gray-400" />,
    title: "Adressen",
    href: "/account/adressen"
  },
  {
    icon: <User className="w-8 h-8 text-gray-400" />,
    title: "Accountgegevens",
    href: "/account/gegevens"
  },
  {
    icon: <Heart className="w-8 h-8 text-gray-400" />,
    title: "Wishlist",
    href: "/account/wishlist"
  },
  {
    icon: <LogOut className="w-8 h-8 text-gray-400" />,
    title: "Logout",
    href: "/logout"
  }
]

export function AccountPage() {
  const { companyName } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Hallo {companyName} {" "}
            <span className="font-normal text-gray-600">
              (niet {companyName}? <Link href="/logout" className="text-[#C1A770] hover:underline">Log uit</Link>)
            </span>
          </h1>
          <p className="text-gray-600">
            Vanaf je account dashboard kun je{" "}
            <Link href="/account/bestellingen" className="text-[#FF6B35] hover:underline">
              je recente bestellingen bekijken
            </Link>
            ,{" "}
            <Link href="/account/adressen" className="text-[#FF6B35] hover:underline">
              je verzend- en factuuradressen beheren
            </Link>
            {" "}en{" "}
            <Link href="/account/gegevens" className="text-[#FF6B35] hover:underline">
              je wachtwoord en account details bewerken
            </Link>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className="p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer h-[180px]">
                {item.icon}
                <span className="mt-4 text-gray-600 font-medium">{item.title}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

