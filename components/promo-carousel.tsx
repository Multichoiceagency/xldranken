"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Book, Smartphone, Store, HandshakeIcon, ChevronLeft, ChevronRight } from 'lucide-react'

// Updated promos array with local video
const promos = [
  {
    title: "",
    description: "Ontdek een breed assortiment aan alcoholische dranken, frisdranken en exclusieve merken.",
    discount: "",
    media: {
      type: "image",
      src: "https://images.pexels.com/photos/66636/pexels-photo-66636.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    },
    buttonText: "Nu bestellen",
    href: "/assortiment",
  },
  {
    title: "",
    description: "Ontdek Lovka, een nieuw product met pure vodka, caffeïne en energy smaak.",
    discount: "NIEUW PRODUCT",
    media: {
      type: "video",
      src: "/videos/lovka.mp4",
    },
    buttonText: "Bekijk product",
    href: "/products/lovka",
  },
  {
    title: "",
    description: "Aanbiedingen",
    discount: "KORTINGEN TOT WEL 20%",
    media: {
      type: "image",
      src: "/winkel/winkel2.jpeg",
    },
    buttonText: "Meer informatie",
    href: "/assortiment",
  },
  {
    title: "",
    description: "Geniet van een exotische reis met onze ambachtelijke rumcollectie.",
    discount: "25% KORTING",
    media: {
      type: "image",
      src: "/winkel/winkel3.jpeg",
    },
    buttonText: "Bekijken",
    href: "/assortiment",
  },
]

const navCards = [
  {
    title: "Folders",
    icon: Book,
    href: "#",
  },
  {
    title: "XL Groothandel B.V. Bestellapp",
    icon: Smartphone,
    href: "#",
  },
  {
    title: "Vestiging",
    icon: Store,
    href: "#",
  },
  {
    title: "Registreren",
    icon: HandshakeIcon,
    href: "#",
  },
]

export function PromoGrid() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Set up autoplay
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        nextSlide()
      }, 8000) // Change slide every 8 seconds (longer for videos)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [currentSlide, isAutoPlaying])

  // Handle video playback
  useEffect(() => {
    // Pause all videos
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause()
      }
    })

    // Play current video if it's a video slide
    const currentPromo = promos[currentSlide]
    if (currentPromo.media.type === "video") {
      const video = videoRefs.current[currentSlide]
      if (video) {
        video.currentTime = 0
        video.play().catch((e) => console.error("Error playing video:", e))
      }
    }
  }, [currentSlide])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === promos.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? promos.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false)
  }

  const resumeAutoPlay = () => {
    setIsAutoPlaying(true)
  }

  // Fixed ref callback function
  const setVideoRef = (index: number) => (el: HTMLVideoElement | null) => {
    videoRefs.current[index] = el
  }

  return (
    <div className="space-y-8">
      <div className="container mx-auto px-4 py-8">
        {/* Slider */}
        <div 
          className="relative h-[600px] overflow-hidden rounded-lg transition-all duration-300 hover:shadow-2xl"
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={resumeAutoPlay}
        >
          {/* Slides */}
          <div className="h-full w-full">
            {promos.map((promo, index) => (
              <div 
                key={index} 
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                {promo.media.type === "image" ? (
                  <Image
                    src={promo.media.src || "/placeholder.svg"}
                    alt={promo.description}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                ) : (
                  <video
                    ref={setVideoRef(index)}
                    src={promo.media.src}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-6 md:p-12">
                  <div className="inline-block bg-[#E2B505] text-white px-3 py-1 text-sm self-start">
                    {promo.discount || "WEBSHOP*"}
                  </div>
                  <div className="max-w-2xl">
                    <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                      {promo.title}
                    </h2>
                    <p className="text-white text-lg mb-6">
                      {promo.description}
                    </p>
                    <Link href={promo.href}>
                      <Button className="bg-[#E2B505] hover:bg-[#E2B505]/90 transform hover:scale-105 transition-all duration-300 hover:shadow-lg active:scale-95">
                        {promo.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition-all duration-300"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition-all duration-300"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {promos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-[#E2B505] w-6" : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigatiekaarten */}
      <div className="bg-[#E8F0FE]">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {navCards.map((card, index) => (
              <Link
                key={index}
                href={card.href}
                className="group bg-white rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 hover:rotate-1"
              >
                <card.icon className="w-12 h-12 text-[#E2B505] mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                <span className="text-[#E2B505] font-medium transition-transform duration-300 group-hover:translate-y-1">
                  {card.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}