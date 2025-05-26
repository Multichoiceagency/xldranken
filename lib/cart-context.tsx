"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { categorizeProduc } from "./product-categorizer"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  volume: string
  productCode: string
  arcleunik?: string // Added arcleunik property
  fam2id?: string // Add fam2id for categorization in emails
  quantity: number
  tauxTvaArticleEcommerce?: string // Field for product-specific VAT rate
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
  getCartTotal: () => {
    totalItems: number
    totalPrice: number
    totalPriceExclVAT: number
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Helper function to create a minimal version of the cart
const createMinimalCart = (cart: CartItem[]) => {
  return cart.map((item) => ({
    id: item.id,
    name: item.name.substring(0, 50), // Limit name length
    price: item.price,
    quantity: item.quantity,
    fam2id: item.fam2id,
    arcleunik: item.arcleunik,
    volume: item.volume,
    // Exclude image and other large fields
  }))
}

// Helper function to safely store cart data
const safelyStoreCart = (cart: CartItem[]) => {
  // First try with full data
  try {
    const cartString = JSON.stringify(cart)
    // Check if the string is too large (5MB is the typical limit)
    if (cartString.length > 4000000) {
      throw new Error("Cart data too large for localStorage")
    }
    localStorage.setItem("cart", cartString)
    return true
  } catch (error) {
    console.warn("Could not save full cart to localStorage:", error)

    // Try with minimal data
    try {
      const minimalCart = createMinimalCart(cart)
      localStorage.setItem("cart", JSON.stringify(minimalCart))
      console.log("Saved minimal version of cart")
      return true
    } catch (minError) {
      console.error("Failed to save minimal cart to localStorage:", minError)

      // Last resort: try sessionStorage (clears when browser is closed)
      try {
        const ultraMinimalCart = cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        }))
        sessionStorage.setItem("cart", JSON.stringify(ultraMinimalCart))
        console.log("Saved ultra-minimal cart to sessionStorage")
        return true
      } catch (sessionError) {
        console.error("All storage attempts failed:", sessionError)
        return false
      }
    }
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [storageAvailable, setStorageAvailable] = useState(true)

  // Check if storage is available
  useEffect(() => {
    try {
      localStorage.setItem("storage-test", "test")
      localStorage.removeItem("storage-test")
      setStorageAvailable(true)
    } catch (e) {
      setStorageAvailable(false)
      console.warn("localStorage not available, cart will not persist between sessions")
    }
  }, [])

  // Load cart from storage on mount
  useEffect(() => {
    if (!storageAvailable) return

    try {
      // Try localStorage first
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setCart(JSON.parse(savedCart))
        return
      }

      // Fall back to sessionStorage
      const sessionCart = sessionStorage.getItem("cart")
      if (sessionCart) {
        setCart(JSON.parse(sessionCart))
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error)
    }
  }, [storageAvailable])

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (!storageAvailable || cart.length === 0) return

    // Limit cart size to prevent storage issues
    if (cart.length > 100) {
      console.warn("Cart exceeds maximum size limit (100 items), removing oldest items")
      setCart((prevCart) => prevCart.slice(-100)) // Keep only the 100 most recent items
      return
    }

    // Attempt to store the cart
    const stored = safelyStoreCart(cart)

    if (!stored) {
      console.error("Failed to store cart in any available storage")
    }
  }, [cart, storageAvailable])

  // Update the addToCart function to preserve the exact fam2id from the product
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)

      // IMPORTANT: Preserve the exact fam2id from the product
      // Do not attempt to categorize it unless it's undefined
      const itemWithCategory = {
        ...item,
        // Only use categorization if fam2id is completely missing
        fam2id: item.fam2id !== undefined ? item.fam2id : categorizeProduc(item.name, item.volume),
        // Handle image URLs properly - don't truncate base64 images
        image: item.image?.startsWith("data:image")
          ? item.image // Keep base64 images intact
          : item.image?.length > 500
            ? item.image.substring(0, 500)
            : item.image,
      }

      console.log(`Adding to cart: ${item.name} -> fam2id: ${itemWithCategory.fam2id} (original: ${item.fam2id})`)

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prevCart, { ...itemWithCategory, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
    if (storageAvailable) {
      try {
        localStorage.removeItem("cart")
        sessionStorage.removeItem("cart")
      } catch (error) {
        console.error("Error clearing cart from storage:", error)
      }
    }
  }

  const isInCart = (id: string) => {
    return cart.some((item) => item.id === id)
  }

  const getCartTotal = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalPriceExclVAT = totalPrice / 1.21 // Assuming 21% VAT

    return {
      totalItems,
      totalPrice,
      totalPriceExclVAT,
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
