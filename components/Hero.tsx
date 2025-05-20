"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

interface HeroProps {
  title: string
  description: string
  imageSrc?: string
}

export default function Hero({
  title,
  description,
  imageSrc = "https://images.pexels.com/photos/2796105/pexels-photo-2796105.jpeg"
}: HeroProps) {
  const fadeRef = useRef<HTMLDivElement>(null)
  const lastScroll = useRef(0)
  const animating = useRef(false)
  const maxScroll = 150

  useEffect(() => {
    const onScroll = () => {
      if (animating.current) return
      animating.current = true
      window.requestAnimationFrame(() => {
        const scroll = window.scrollY
        if (fadeRef.current) {
          if (scroll > 0) {
            const limited = Math.min(scroll, maxScroll)
            const opacity = 1 - limited / maxScroll
            fadeRef.current.style.opacity = String(opacity)
          } else {
            // Volledig zichtbaar als je bovenaan bent
            fadeRef.current.style.opacity = "1"
          }
        }
        lastScroll.current = scroll
        animating.current = false
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="relative h-[200px] md:h-[300px] overflow-hidden">
      <div
        ref={fadeRef}
        className="absolute inset-0 w-full h-full z-0 transition-opacity duration-300 will-change-opacity"
        style={{ opacity: 1 }}
      >
        {/* Achtergrond afbeelding */}
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 md:mb-6 bg-gradient-to-r from-[#d4af37] to-[#f5e7a3] bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-base md:text-xl text-white">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
