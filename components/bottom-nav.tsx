'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid, ShoppingCart } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-999">
      <div className="flex justify-around items-center h-16">
        <Link href="/" className={`flex flex-col items-center ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/assortiment" className={`flex flex-col items-center ${pathname === '/assortiment'}`}>
          <Grid className="h-6 w-6" />
          <span className="text-xs mt-1">Assortiment</span>
        </Link>
        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-green-600">
          <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6" />
          <span className="text-xs mt-1">WhatsApp</span>
        </a>
        <Link href="/cart" className={`flex flex-col items-center ${pathname === '/cart' }`}>
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xs mt-1">Winkelmand</span>
        </Link>
      </div>
    </nav>
  )
}

