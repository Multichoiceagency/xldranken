import Link from "next/link"
import { Card } from "@/components/ui/card"

const sidebarItems = [
  { href: "/account", label: "Dashboard" },
  { href: "/account/bestellingen", label: "Bestellingen" },
  { href: "/account/gesprekken", label: "Gesprekken" },
  { href: "/account/aanbiedingen", label: "Aanbiedingen" },
  { href: "/account/bestellijsten", label: "Bestellijsten" },
  { href: "/account/bulkbestelling", label: "Bulkbestelling" },
  { href: "/account/subaccounts", label: "Subaccounts" },
  { href: "/account/downloads", label: "Downloads" },
  { href: "/account/adressen", label: "Adressen" },
  { href: "/account/gegevens", label: "Accountgegevens" },
  { href: "/account/wishlist", label: "Wishlist" },
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <Card className="p-4">
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-sm rounded-md hover:bg-gray-100 hover:text-[#FF6B35]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </Card>
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

