"use client"

import type React from "react"

import Link from "next/link"
import { ClipboardList, Tag, Package, MapPin, User, LogOut } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useSession, signOut } from "next-auth/react"
import { useSearchParams } from "next/navigation"

interface MenuItem {
  icon: React.ReactNode
  title: string
  href: string
  onClick?: () => void // Added onClick as an optional property
}

const menuItems: MenuItem[] = [
  { icon: <ClipboardList className="w-8 h-8 text-gray-400" />, title: "Bestellingen", href: "/account/bestellingen" },
  { icon: <Tag className="w-8 h-8 text-gray-400" />, title: "Aanbiedingen", href: "/account/aanbiedingen" },
  { icon: <Package className="w-8 h-8 text-gray-400" />, title: "Bulkbestelling", href: "/account/bulkbestelling" },
  { icon: <MapPin className="w-8 h-8 text-gray-400" />, title: "Adressen", href: "/account/adressen" },
  { icon: <User className="w-8 h-8 text-gray-400" />, title: "Accountgegevens", href: "/account/gegevens" },
  {
    icon: <LogOut className="w-8 h-8 text-gray-400" />,
    title: "Logout",
    href: "#",
    onClick: () => signOut({ callbackUrl: "/" }),
  },
]

export function AccountPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const loginStatus = searchParams.get("login")

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C1A770]"></div>
      </div>
    )
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Toegang geweigerd</h2>
          <p className="mb-6">Je bent niet ingelogd. Log in om toegang te krijgen tot je account.</p>
          <Link
            href="/login"
            className="block w-full bg-[#C1A770] text-white py-2 px-4 rounded text-center hover:bg-[#a89055] transition-colors"
          >
            Inloggen
          </Link>
        </div>
      </div>
    )
  }

  // Bepaal de weergavenaam van de gebruiker (naam, login of email)
  const companyName = session.user?.name || session.user?.email || "Gebruiker"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Toon melding bij succesvolle login */}
        {loginStatus === "success" && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">Succesvol ingelogd!</div>
        )}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Hallo {companyName}{" "}
            <span className="font-normal text-gray-600">
              (niet {companyName}?{" "}
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-[#C1A770] hover:underline">
                Log uit
              </button>
              )
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
            </Link>{" "}
            en{" "}
            <Link href="/account/gegevens" className="text-[#FF6B35] hover:underline">
              je wachtwoord en account details bewerken
            </Link>
            .
          </p>
          <div className="mt-4">
            <p className="text-gray-600">Account-ID: {session.user?.id || "Niet beschikbaar"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) =>
            item.title === "Logout" ? (
              <Card
                key={item.title}
                className="p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer h-[180px]"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                {item.icon}
                <span className="mt-4 text-gray-600 font-medium">{item.title}</span>
              </Card>
            ) : (
              <Link key={item.title} href={item.href}>
                <Card className="p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer h-[180px]">
                  {item.icon}
                  <span className="mt-4 text-gray-600 font-medium">{item.title}</span>
                </Card>
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
