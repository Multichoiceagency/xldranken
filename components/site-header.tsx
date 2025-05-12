"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import {
  Menu,
  X,
  Search,
  User,
  ShoppingCart,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { menuItemsList } from "@/lib/api"
import { SideCart } from "@/components/side-cart"
import { useAuthContext } from "@/context/AuthContext"
import { signOut } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { useScrollLock } from "@/lib/useScrollLock"

export function SiteHeader() {
  const { totalItems } = useCart().getCartTotal()
  const { isLoggedIn } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const userMenuRef = useRef<HTMLDivElement>(null)

  useScrollLock(isCartOpen || searchOpen || isMobileMenuOpen)

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", listener)
    return () => document.removeEventListener("mousedown", listener)
  }, [])

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.length > 2) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CUSTOMER_API_URL}/product/list?apikey=${process.env.NEXT_PUBLIC_API_KEY}&id_membre=1&rechercher_mot_cle=${encodeURIComponent(searchQuery)}&limit=10&page=1&tri_listing_article=alpha`
        )
        const data = await res.json()
        setSearchResults(data.result?.product || [])
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { scroll: false })
      setSearchOpen(false)
      setIsMobileMenuOpen(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  return (
    <>
      <div className="bg-[#BEA46A] text-white py-2 text-sm px-4">
        <div className="container mx-auto flex justify-between">
          <span>✓ Meer dan 4.000 dranken</span>
          <div className="hidden md:flex gap-4">
            <Link href="/zakelijk" className="hover:underline">Registreren</Link>
            <Link href="/klantenservice" className="hover:underline">Klantenservice</Link>
            <Link href="/over-ons" className="hover:underline">Over ons</Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden">
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/">
            <Image
              src="/logos/logo-xlgroothandelbv.png"
              alt="XL Logo"
              width={200}
              height={48}
              className="object-contain"
              priority
            />
          </Link>

          <nav className="hidden lg:flex flex-1 justify-center gap-10 font-semibold">
            {menuItemsList.map((item) => (
              <div key={item.name} className="relative group">
                <Link href={item.href} className="hover:text-[#BEA46A] flex items-center gap-1">
                  {item.name}
                  {item.submenu?.length ? <ChevronDown className="w-4 h-4" /> : null}
                </Link>
                {item.submenu?.length > 0 && (
                  <div className="absolute left-0 top-full bg-white shadow-lg rounded-md w-64 mt-2 hidden group-hover:block z-50">
                    {item.submenu.map((sub) => (
                      <Link key={sub.name} href={sub.href} className="block px-4 py-2 hover:bg-[#BEA46A] hover:text-white">
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen((v) => !v)} className="text-[#BEA46A]">
              <Search className="w-5 h-5" />
            </button>

            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <User className="w-6 h-6" />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                  <div className="py-2">
                    {isLoggedIn ? (
                      <>
                        <Link href="/account" className="block px-4 py-2 hover:bg-gray-100">Mijn account</Link>
                        <Link href="/bestellingen" className="block px-4 py-2 hover:bg-gray-100">Bestellingen</Link>
                        <Link href="/gegevens" className="block px-4 py-2 hover:bg-gray-100">Gegevens</Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                        >
                          <LogOut className="inline-block w-4 h-4 mr-1" /> Uitloggen
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="block px-4 py-2 hover:bg-gray-100">Inloggen</Link>
                        <Link href="/register" className="block px-4 py-2 hover:bg-gray-100">Registreren</Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setIsCartOpen(true)} className="relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 bg-white z-[100] p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Zoeken</h2>
            <button onClick={() => setSearchOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSearchSubmit}>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek producten..."
              className="w-full mb-4"
            />
          </form>
          <div className="space-y-2">
            {searchResults.length === 0 && searchQuery.length > 2 && (
              <p className="text-gray-500">Geen resultaten gevonden.</p>
            )}
            {searchResults.map((product) => (
              <Link
                key={product.arcleunik}
                href={`/product/${product.arcleunik}`}
                onClick={() => setSearchOpen(false)}
                className="block border-b py-2 text-sm hover:bg-gray-50"
              >
                {product.title || product.megatech_Titre_lib_web_nl}
              </Link>
            ))}
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[99] bg-white overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <Image
              src="/logos/logo-xlgroothandelbv.png"
              alt="XL Logo"
              width={160}
              height={48}
            />
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4">
            <form onSubmit={handleSearchSubmit}>
              <Input
                placeholder="Zoek producten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
              />
            </form>
            <div className="space-y-4">
              {menuItemsList.map((item) => (
                <div key={item.name}>
                  <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="font-medium block">
                    {item.name}
                  </Link>
                  {item.submenu?.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="ml-4 block text-sm text-gray-600"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
