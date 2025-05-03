"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, username, companyName } = useAuth();
  const [authState, setAuthState] = useState({ isLoggedIn, username, companyName });

  useEffect(() => {
    setAuthState({ isLoggedIn, username, companyName });
  }, [isLoggedIn, username, companyName]);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
