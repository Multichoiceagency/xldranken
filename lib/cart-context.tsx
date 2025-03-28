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
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
  getCartTotal: () => { totalItems: number; totalPrice: number }
  notification: string | null
  setNotification: React.Dispatch<React.SetStateAction<string | null>>
  orderComplete: boolean
  setOrderComplete: React.Dispatch<React.SetStateAction<boolean>>
  orderGuid: string | null
  setOrderGuid: React.Dispatch<React.SetStateAction<string | null>>
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

// Component voor de floating notificatie
function CartNotification() {
  const { notification, setNotification } = useCart()

  useEffect(() => {
    if (!notification) return
    // Verberg de notificatie na 3 seconden
    const timer = setTimeout(() => {
      setNotification(null)
    }, 3000)

    // Opruimen bij unmount of bij nieuwe notificatie
    return () => clearTimeout(timer)
  }, [notification, setNotification])

  // Als er geen notificatie is, renderen we niets
  if (!notification) return null

  return (
    <div className="fixed top-5 right-5 z-50 bg-green-500 text-white py-2 px-4 rounded shadow-md">{notification}</div>
  )
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [notification, setNotification] = useState<string | null>(null)
  const [orderComplete, setOrderComplete] = useState<boolean>(false)
  const [orderGuid, setOrderGuid] = useState<string | null>(null)

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        localStorage.removeItem("cart")
      }
    }

    // Check if there's a saved order status
    const savedOrderComplete = localStorage.getItem("orderComplete")
    const savedOrderGuid = localStorage.getItem("orderGuid")

    if (savedOrderComplete === "true") {
      setOrderComplete(true)
    }

    if (savedOrderGuid) {
      setOrderGuid(savedOrderGuid)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Save order status to localStorage
  useEffect(() => {
    if (orderComplete) {
      localStorage.setItem("orderComplete", "true")
    } else {
      localStorage.removeItem("orderComplete")
    }
  }, [orderComplete])

  // Save order GUID to localStorage
  useEffect(() => {
    if (orderGuid) {
      localStorage.setItem("orderGuid", orderGuid)
    } else {
      localStorage.removeItem("orderGuid")
    }
  }, [orderGuid])

  const addToCart = (item: CartItem) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        // Als het item al in de cart zit, verhoog alleen de quantity
        return currentCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem,
        )
      }
      // Anders nieuw item toevoegen
      return [...currentCart, item]
    })

    // Stuur een notificatie dat het product is toegevoegd
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
    // When clearing cart after order completion, we can show a notification
    setNotification("Bestelling succesvol geplaatst!")
  }

  const isInCart = (id: string) => {
    return cart.some((item) => item.id === id)
  }

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => {
        total.totalItems += item.quantity
        total.totalPrice += item.price * item.quantity
        return total
      },
      { totalItems: 0, totalPrice: 0 },
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
        orderComplete,
        setOrderComplete,
        orderGuid,
        setOrderGuid,
      }}
    >
      {children}
      <CartNotification />
    </CartContext.Provider>
  )
}

