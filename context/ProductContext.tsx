"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface Product {
  id_product_mysql: string
  title: string
  prix_vente_groupe: string
  photo1_base64: string
  arcleunik: string
  productCode: string
  prix_en_promo: number
}

interface ProductContextType {
  products: Product[]
  loading: boolean
  error: string | null
}

const ProductContext = createContext<ProductContextType | null>(null)

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  )
}

// ✅ Custom Hook for Product Context
export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) throw new Error("useProducts must be used within a ProductProvider")
  return context
}
