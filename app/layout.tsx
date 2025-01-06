import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BottomNav } from '@/components/bottom-nav'
import { CartProvider } from '@/lib/cart-context'
import { WhatsAppButton } from '@/components/whatsapp-button'

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
          <SiteHeader />
          <main className="min-h-screen pb-16 md:pb-0">
            {children}
          </main>
          <SiteFooter />
          <BottomNav />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  )
}

