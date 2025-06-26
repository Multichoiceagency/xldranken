"use client"

import type React from "react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useSpring } from "framer-motion"

interface SmoothScrollProps {
  children: ReactNode
  speed?: number
  className?: string
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children, speed = 1.0, className = "" }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [transformValue, setTransformValue] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // More responsive spring configuration
  const springConfig = {
    damping: 30,
    stiffness: 200,
    mass: 0.2,
  }

  const y = useSpring(0, springConfig)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Set up content height monitoring and scrolling
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    // Function to update content height
    const updateHeight = () => {
      if (scrollContainer) {
        const height = scrollContainer.scrollHeight
        setContentHeight(height)
        // Set body height to match content + small buffer
        document.body.style.height = `${height}px`
      }
    }

    // Initial height update
    updateHeight()

    // Set up ResizeObserver to monitor content height changes
    resizeObserverRef.current = new ResizeObserver(() => {
      updateHeight()
    })

    resizeObserverRef.current.observe(scrollContainer)

    // Scroll handler
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY

        // If mobile, use direct transform
        if (isMobile) {
          setTransformValue(-scrollTop)
        } else {
          // For desktop, use spring physics
          y.set(scrollTop * speed)
        }
      })
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateHeight)
      window.removeEventListener("scroll", handleScroll)
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
      document.body.style.height = ""
    }
  }, [speed, y, isMobile])

  // Update transform value when spring value changes
  useEffect(() => {
    if (!isMobile) {
      return y.onChange((value) => {
        setTransformValue(-value)
      })
    }
  }, [y, isMobile])

  return (
    <div
      className="smooth-scroll-container fixed top-0 left-0 w-full min-h-screen overflow-hidden"
      style={{ zIndex: 1 }}
    >
      <motion.div
        ref={scrollRef}
        className={`smooth-scroll-content ${className}`}
        style={{
          y: transformValue,
          position: "absolute",
          width: "100%",
          willChange: "transform",
        }}
        transition={{
          type: "spring",
          bounce: 0,
          duration: 0.3,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default SmoothScroll
