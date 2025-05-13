"use client"

import Image from "next/image"

interface HeroProps {
  title: string
  description: string
  imageSrc?: string
}

export default function Hero({ title, description, imageSrc = "https://images.pexels.com/photos/2796105/pexels-photo-2796105.jpeg" }: HeroProps) {
  return (
    <div className="relative">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-background"></div>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="h-full w-full object-cover" priority />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#d4af37] to-[#f5e7a3] bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white">{description}</p>
        </div>
      </div>
    </div>
  )
}
