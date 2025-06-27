"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { categorizeProduct } from "./product-categorizer"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  volume: string
  productCode: string
  arcleunik?: string
  fam2id?: string
  guid?: string // Add GUID field
  quantity: number
  tauxTvaArticleEcommerce?: string
  category?: string
  matchType?: "api_exact" | "existing" | "exact" | "partial" | "fallback" | "id_match" | "api_error"
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
  notification: string | null
  setNotification: React.Dispatch<React.SetStateAction<string | null>>
  calculatePriceExclVAT: (price: number, vatRate: string | undefined) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Component for the floating notification
function CartNotification() {
  const { notification, setNotification } = useCart()

  useEffect(() => {
    if (!notification) return
    // Hide notification after 3 seconds
    const timer = setTimeout(() => {
      setNotification(null)
    }, 3000)

    // Clean up on unmount or new notification
    return () => clearTimeout(timer)
  }, [notification, setNotification])

  // If there's no notification, render nothing
  if (!notification) return null

  return (
    <div className="fixed top-5 right-5 z-50 bg-green-500 text-white py-2 px-4 rounded shadow-md">{notification}</div>
  )
}

// Helper function to create a minimal version of the cart
const createMinimalCart = (cart: CartItem[]) => {
  return cart.map((item) => ({
    id: item.id,
    name: item.name.substring(0, 50),
    price: item.price,
    quantity: item.quantity,
    fam2id: item.fam2id,
    arcleunik: item.arcleunik,
    volume: item.volume,
    guid: item.guid,
  }))
}

// Helper function to safely store cart data
const safelyStoreCart = (cart: CartItem[]) => {
  try {
    const cartString = JSON.stringify(cart)
    if (cartString.length > 4000000) {
      throw new Error("Cart data too large for localStorage")
    }
    localStorage.setItem("cart", cartString)
    return true
  } catch (error) {
    console.warn("Could not save full cart to localStorage:", error)

    try {
      const minimalCart = createMinimalCart(cart)
      localStorage.setItem("cart", JSON.stringify(minimalCart))
      console.log("Saved minimal version of cart")
      return true
    } catch (minError) {
      console.error("Failed to save minimal cart to localStorage:", minError)

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
  const [notification, setNotification] = useState<string | null>(null)

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
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setCart(JSON.parse(savedCart))
        return
      }

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

    if (cart.length > 100) {
      console.warn("Cart exceeds maximum size limit (100 items), removing oldest items")
      setCart((prevCart) => prevCart.slice(-100))
      return
    }

    const stored = safelyStoreCart(cart)
    if (!stored) {
      console.error("Failed to store cart in any available storage")
    }
  }, [cart, storageAvailable])

  // Utility function to calculate price excluding VAT
  const calculatePriceExclVAT = (price: number, vatRate: string | undefined): number => {
    // Convert VAT rate from string to number, default to 21 if not provided
    const vatRateNumber = vatRate ? Number.parseFloat(vatRate) : 21
    // Convert percentage to decimal (e.g., 21 -> 0.21)
    const vatRateDecimal = vatRateNumber / 100
    // Calculate price excluding VAT
    return price / (1 + vatRateDecimal)
  }

  // Updated addToCart function to work with API structure
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    // Validate that arcleunik exists - try multiple sources
    const arcleunik = item.arcleunik || item.volume || item.id || item.productCode

    if (!arcleunik) {
      console.error("Cart item missing arcleunik from all sources:", {
        item: item,
        arcleunik: item.arcleunik,
        volume: item.volume,
        id: item.id,
        productCode: item.productCode,
      })
      setNotification("Fout: Product kan niet worden toegevoegd (ontbrekende product ID)")
      return
    }

    console.log(`🛒 Adding item to cart: "${item.name}" with arcleunik: ${arcleunik}`)

    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        // Send notification for existing item
        setNotification(`Artikel "${item.name}" aantal verhoogd!`)
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }

      // For new items, ensure arcleunik is properly set
      const newItem = {
        ...item,
        quantity: 1,
        arcleunik: arcleunik, // Ensure arcleunik is set from our validation above
      }

      // Send notification for new item
      setNotification(`Artikel "${item.name}" succesvol toegevoegd!`)

      // Perform live categorization asynchronously
      const performLiveCategorization = async () => {
        try {
          console.log(`🛒 Adding to cart with live categorization: "${item.name}"`)
          console.log(`   ID: ${item.id}`)
          console.log(`   GUID: ${item.guid || "N/A"}`)
          console.log(`   Volume (arcleunik): ${item.volume}`)
          console.log(`   Final arcleunik: ${arcleunik}`)
          console.log(`   Existing fam2id: ${item.fam2id}`)

          // Use live categorization
          const result = await categorizeProduct(
            item.name,
            item.volume,
            arcleunik, // Use our validated arcleunik
            item.fam2id,
            item.guid, // Pass GUID for live API lookup
          )

          console.log(
            `🔄 Live categorization result: "${item.name}" -> ${result.categoryName} (${result.matchType}, confidence: ${result.confidence.toFixed(3)})`,
          )

          // Update the cart item with categorization results
          setCart((currentCart) =>
            currentCart.map((cartItem) =>
              cartItem.id === item.id
                ? {
                    ...cartItem,
                    arcleunik: arcleunik, // Ensure arcleunik is maintained
                    fam2id: result.fam2id,
                    category: result.categoryName,
                    matchType: result.matchType as
                      | "api_exact"
                      | "id_match"
                      | "api_error"
                      | "fallback"
                      | "existing"
                      | "exact"
                      | "partial",
                  }
                : cartItem,
            ),
          )
        } catch (error) {
          console.error("Error in live categorization:", error)
          // Fallback: update with basic info but maintain arcleunik
          setCart((currentCart) =>
            currentCart.map((cartItem) =>
              cartItem.id === item.id
                ? {
                    ...cartItem,
                    arcleunik: arcleunik, // Ensure arcleunik is maintained even on error
                    category: "NON-FOOD",
                    matchType: "api_error" as const,
                  }
                : cartItem,
            ),
          )
        }
      }

      // Start live categorization
      performLiveCategorization()

      return [...prevCart, newItem]
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
    return cart.reduce(
      (total, item) => {
        total.totalItems += item.quantity
        total.totalPrice += item.price * item.quantity

        // Calculate price excluding VAT for this item
        const priceExclVAT = calculatePriceExclVAT(item.price, item.tauxTvaArticleEcommerce)
        total.totalPriceExclVAT += priceExclVAT * item.quantity

        return total
      },
      { totalItems: 0, totalPrice: 0, totalPriceExclVAT: 0 },
    )
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
        notification,
        setNotification,
        calculatePriceExclVAT,
      }}
    >
      {children}
      {/* Place notification component outside {children} so it's visible everywhere */}
      <CartNotification />
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
