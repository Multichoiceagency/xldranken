'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AddToCartAnimationProps {
  isVisible: boolean
  onAnimationComplete: () => void
  productName: string
  productPrice: number
  productImage: string
}

export function AddToCartAnimation({ 
  isVisible, 
  onAnimationComplete, 
  productName, 
  productPrice, 
  productImage 
}: AddToCartAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0, y: 100, x: 0 }}
          animate={{ opacity: 1, y: -10, x: 10 }}
          exit={{ opacity: 0, y: -50, x: 10 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          onAnimationComplete={() => {
            setTimeout(() => {
              setIsAnimating(false)
              onAnimationComplete()
            }, 2000) // Stay visible for 2 seconds before fading out
          }}
          className="fixed bottom-4 left-4 z-50 bg-white text-black p-3 rounded-lg shadow-lg flex items-center space-x-3"
        >
          <div className="relative w-12 h-12">
            <img
              src={productImage}
              alt={productName}
              className="absolute inset-0 w-full h-full object-cover rounded-md"
            />
          </div>
          <div>
            <p className="font-semibold text-sm">{productName}</p>
            <p className="text-green-600 font-bold">€{productPrice.toFixed(2).replace('.', ',')}</p>
          </div>
          <p className="text-green-600 font-bold ml-2">Added to cart</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

