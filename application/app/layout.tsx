import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CartProvider } from '@/contexts/contexts_cart-context'
import { WishlistProvider } from '@/contexts/wishlist-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'XL Dranken',
  description: 'Your one-stop shop for all beverages',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <WishlistProvider>
            <div className="flex flex-col min-h-screen">
              <SiteHeader />
              <main className="flex-grow">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {children}
                </div>
              </main>
              <SiteFooter />
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}

