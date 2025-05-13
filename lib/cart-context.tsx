"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  volume: string
  productCode: string
  arcleunik?: string // Added arcleunik property
  quantity: number
  tauxTvaArticleEcommerce?: string // Field for product-specific VAT rate
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
  getCartTotal: () => { totalItems: number; totalPrice: number; totalPriceExclVAT: number }
  notification: string | null
  setNotification: React.Dispatch<React.SetStateAction<string | null>>
  calculatePriceExclVAT: (price: number, vatRate: string | undefined) => number // New utility function
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Utility function to calculate price excluding VAT
  const calculatePriceExclVAT = (price: number, vatRate: string | undefined): number => {
    // Convert VAT rate from string to number, default to 21 if not provided
    const vatRateNumber = vatRate ? Number.parseFloat(vatRate) : 21
    // Convert percentage to decimal (e.g., 21 -> 0.21)
    const vatRateDecimal = vatRateNumber / 100
    // Calculate price excluding VAT
    return price / (1 + vatRateDecimal)
  }

  const addToCart = (item: CartItem) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        // If item already exists in cart, only increase quantity
        return currentCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem,
        )
      }
      // Otherwise add new item
      return [...currentCart, item]
    })

    // Send notification that product has been added
    setNotification(`Artikel "${item.name}" succesvol toegevoegd!`)
  }

  const removeFromCart = (id: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const clearCart = () => {
    setCart([])
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
        calculatePriceExclVAT, // Expose the utility function
      }}
    >
      {children}
      {/* Place notification component outside {children} so it's visible everywhere */}
      <CartNotification />
    </CartContext.Provider>
  )
}
