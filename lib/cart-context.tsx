"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  volume: string;
  productCode: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  getCartTotal: () => { totalItems: number; totalPrice: number };
  notification: string | null;                          // ✅ Nieuw veld
  setNotification: React.Dispatch<React.SetStateAction<string | null>>; // ✅ Setter
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// ✅ Kleine component voor de floating notificatie
function CartNotification() {
  const { notification, setNotification } = useCart();

  useEffect(() => {
    if (!notification) return;
    // Verberg de notificatie na 3 seconden
    const timer = setTimeout(() => {
      setNotification(null);
    }, 3000);

    // Opruimen bij unmount of bij nieuwe notificatie
    return () => clearTimeout(timer);
  }, [notification, setNotification]);

  // Als er geen notificatie is, renderen we niets
  if (!notification) return null;

  return (
    <div className="fixed top-5 right-5 z-50 bg-green-500 text-white py-2 px-4 rounded shadow-md">
      {notification}
    </div>
  );
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // Als het item al in de cart zit, verhoog alleen de quantity
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      // Anders nieuw item toevoegen
      return [...currentCart, item];
    });

    // ✅ Stuur een notificatie dat het product is toegevoegd
    setNotification(`Artikel "${item.name}" succesvol toegevoegd!`);
  };

  const removeFromCart = (id: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (id: string) => {
    return cart.some((item) => item.id === id);
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => {
        total.totalItems += item.quantity;
        total.totalPrice += item.price * item.quantity;
        return total;
      },
      { totalItems: 0, totalPrice: 0 }
    );
  };

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
        notification,     // ✅
        setNotification,  // ✅
      }}
    >
      {children}
      {/* ✅ Plaats de notificatiecomponent buiten {children}, zodat deze overal zichtbaar is */}
      <CartNotification />
    </CartContext.Provider>
  );
};