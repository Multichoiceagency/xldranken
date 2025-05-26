"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/context/AuthContext"
import { CartProvider } from "@/lib/cart-context"
import { ProductProvider } from "@/context/ProductContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>{children}</CartProvider>
        </ProductProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
