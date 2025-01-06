'use client'

import Link from "next/link"
import { ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const menuItems = [
  { id: 'profile', label: 'MIJN GALL & GALL', href: '/account' },
  { id: 'taste', label: 'SMAAKPROFIEL', href: '/account/taste' },
  { id: 'orders', label: 'BESTELGESCHIEDENIS', href: '/account/orders' },
  { id: 'details', label: 'MIJN GEGEVENS', href: '/account/details' },
  { id: 'store', label: 'MIJN GALL & GALL STORE', href: '/account/store' },
  { id: 'coupons', label: 'MIJN COUPONS', href: '/account/coupons' },
]

interface AccountPageProps {
  activePage?: string
}

export function AccountPage({ activePage = 'orders' }: AccountPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <Link href="/account" className="text-muted-foreground hover:text-foreground">
          Mijn Account
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-[#FF6B35]">Bestelgeschiedenis</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">BESTELGESCHIEDENIS</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    activePage === item.id
                      ? 'bg-orange-50 text-[#FF6B35]'
                      : 'hover:bg-orange-50 hover:text-[#FF6B35]'
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <Separator className="my-6" />

          {/* Points */}
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[#FF6B35] text-xl font-bold">0</span>
              <span className="text-sm">Punten</span>
            </div>
          </div>

          {/* Connection Status */}
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-sm">Niet gekoppeld</span>
            </div>
          </div>

          {/* Status */}
          <div className="text-sm text-muted-foreground">
            <p>Ingelogd als</p>
            <p className="font-medium">info@multichoiceagency.nl</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-xl font-semibold">BESTELGESCHIEDENIS</h2>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Je hebt nog geen bestellingen gedaan
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

