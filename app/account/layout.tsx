import Link from "next/link"
import { Card } from "@/components/ui/card"

const sidebarItems = [
  { href: "/account", label: "Mijn Account" },
  { href: "/account/bestellingen", label: "Bestellingen" },
  { href: "/account/adressen", label: "Adressen" },
  { href: "/account/gegevens", label: "Accountgegevens" },
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8 font-medium">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <Card className="p-4">
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-sm rounded-md hover:bg-gray-100 hover:text-[gold]"
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

