"use client"

import React, { createContext, useContext } from "react"
import { useSession } from "next-auth/react"

export interface AuthContextType {
  isLoggedIn: boolean
  user: any | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()

  const isLoggedIn = status === "authenticated"
  const user = session?.user || null
  const loading = status === "loading"

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
