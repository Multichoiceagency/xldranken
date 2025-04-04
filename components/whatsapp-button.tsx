'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { useState, useEffect } from 'react'

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const checkProductPage = () => {
      const isProductPage = window.location.pathname.startsWith('/product/')
      setIsVisible(!isProductPage)
    }

    checkProductPage()
    window.addEventListener('popstate', checkProductPage)

    return () => {
      window.removeEventListener('popstate', checkProductPage)
    }
  }, [])

  if (!isVisible) return null

  return (
    <a
      href="https://wa.me/31618495949" // Replace with your actual WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-10 right-4 bottom-4 z-50 hidden md:flex items-center justify-center w-12 h-12 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] transition-colors duration-300"
      aria-label="Contact us on WhatsApp"
    >
      <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6" />
    </a>
  )
}

