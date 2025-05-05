"use client"

import { createContext, useContext } from "react"

interface AuthContextType {
  isLoggedIn: boolean
  login: (token: string) => void
  logout: () => void
  user: any | null
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  user: null,
})

export const useAuthContext = () => useContext(AuthContext)
