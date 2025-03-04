import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BottomNav } from "@/components/bottom-nav";
import { CartProvider } from "@/lib/cart-context";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ProductProvider } from "@/context/ProductContext";

// Voeg alle beschikbare gewichten toe
const poppins = Poppins({
  subsets: ["latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "XL Dranken",
  description: "Your one-stop shop for all beverages",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Manifest voor PWA */}
        <link rel="manifest" href="/manifest.json" />

        {/* Icons voor verschillende platforms */}
        <link rel="icon" href="icons/favicon.ico" />
        <link rel="apple-touch-icon" href="icons/web-app-manifest-192x192.png" />

        {/* Theme kleur voor browsers */}
        <meta name="theme-color" content="#ffffff" />

        {/* Meta-gegevens voor PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="XL Dranken" />
      </head>
      <body className={`${poppins.className} overflow-x-hidden`}>
        <ProductProvider>
          <CartProvider>
            <SiteHeader />
            <main className="min-h-screen w-screen pb-16 md:pb-0">
              {children}
            </main>
            <SiteFooter />
            <BottomNav />
            <WhatsAppButton />
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
