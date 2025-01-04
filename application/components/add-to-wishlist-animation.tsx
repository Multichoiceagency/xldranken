'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

interface AddToWishlistAnimationProps {
  isVisible: boolean
  onAnimationComplete: () => void
  productName: string
}

export function AddToWishlistAnimation({ 
  isVisible, 
  onAnimationComplete, 
  productName 
}: AddToWishlistAnimationProps) {
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
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => {
            setTimeout(() => {
              setIsAnimating(false)
              onAnimationComplete()
            }, 2000)
          }}
          className="fixed bottom-4 right-4 z-50 bg-white text-black p-4 rounded-lg shadow-lg flex items-center space-x-3"
        >
          <Heart className="h-6 w-6 text-red-500" />
          <div>
            <p className="font-semibold">{productName}</p>
            <p className="text-sm">Toegevoegd aan favorieten</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

