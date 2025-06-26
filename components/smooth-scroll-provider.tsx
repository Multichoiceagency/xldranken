"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import Lenis from "lenis"

interface SmoothScrollProviderProps {
  children: React.ReactNode
  /**
   * Options for Lenis.
   * @see https://github.com/studio-freight/lenis#options
   */
  options?: Partial<ConstructorParameters<typeof Lenis>[0]>
}

const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children, options }) => {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis with corrected and common options
    const lenis = new Lenis({
      // Default options - can be overridden by the `options` prop
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
      wheelMultiplier: 1,
      lerp: 0.1,
      ...options,
    })

    lenisRef.current = lenis

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [options])

  return <>{children}</>
}

export default SmoothScrollProvider
