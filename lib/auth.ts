import { useState, useEffect } from 'react'

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [companyName, setCompanyName] = useState('')

  useEffect(() => {
    // Simulate checking auth state
    const checkAuth = async () => {
      // This would typically be an API call or check a token in localStorage
      const loggedIn = Math.random() > 0.5 // 50% chance of being logged in
      setIsLoggedIn(loggedIn)
      if (loggedIn) {
        setUsername('JohnDoe') // Example username
        setCompanyName('XL Dranken B.V.') // Example company name
      }
    }

    checkAuth()
  }, [])

  return { isLoggedIn, username, companyName }
}

