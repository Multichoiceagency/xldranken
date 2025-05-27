"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Updated promos array with XL Groothandel in titles
const promos = [
    {
    title: "XL Groothandel - Uw Dranken Specialist",
    description:
      "Verken ons uitgebreide aanbod van premium alcoholische dranken, verfrissende frisdranken en exclusieve merken voor elke gelegenheid.",
    discount: "900+ PRODUCTEN",
    media: {
      type: "image",
      src: "/winkel/winkel2.jpeg",
    },
    buttonText: "Registereer nu",
    href: "/zakelijk",
  },
  {
    title: "XL Groothandel presenteert: Lovka",
    description:
      "Maak kennis met Lovka, onze nieuwste innovatie die pure vodka combineert met een verfrissende energy smaak en een vleugje cafeïne.",
    discount: "NIEUW PRODUCT",
    media: {
      type: "video",
      src: "/videos/lovka.mp4",
    },
    buttonText: "Bezoek Lovka",
    href: "https://lovkadrinks.com/",
  },
  {
    title: "XL Groothandel - al jaren uw vertrouwde leverancier",
    description:
      "Levering door heel Nederland. Wij zijn al jaren uw vertrouwde leverancier van dranken en food producten.",
    discount: "Levering door heel Nederland",
    media: {
      type: "image",
      src: "/winkel/winkel3.jpeg",
    },
    buttonText: " Bekijk Cocktails",
    href: "/categorie/cocktails",
  },
]

export default function PromoSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean[]>(Array(promos.length).fill(false))

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

  // Handle video playback with improved error handling
  useEffect(() => {
    // Pause all videos first
    videoRefs.current.forEach((video, index) => {
      if (video) {
        video.pause()
        const newPlayingState = [...isVideoPlaying]
        newPlayingState[index] = false
        setIsVideoPlaying(newPlayingState)
      }
    })

    // Play current video if it's a video slide
    const currentPromo = promos[currentSlide]
    if (currentPromo.media.type === "video") {
      const video = videoRefs.current[currentSlide]
      if (video) {
        video.currentTime = 0

        // Only attempt to play if the document is visible and not in power saving mode
        if (document.visibilityState === "visible") {
          const playPromise = video.play()

          // Handle the play promise properly
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Video started playing successfully
                const newPlayingState = [...isVideoPlaying]
                newPlayingState[currentSlide] = true
                setIsVideoPlaying(newPlayingState)
              })
              .catch((error) => {
                // Auto-play was prevented or interrupted
                console.log("Video playback was prevented:", error.message)
                // Don't throw an error, just log it and continue
                // The poster image will be shown instead
              })
          }
        }
      }
    }
  }, [currentSlide])

  // Handle visibility change to pause videos when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Pause all videos when tab is not visible
        videoRefs.current.forEach((video) => {
          if (video) {
            video.pause()
          }
        })
      } else if (document.visibilityState === "visible") {
        // Try to resume current video when tab becomes visible again
        const currentPromo = promos[currentSlide]
        if (currentPromo.media.type === "video") {
          const video = videoRefs.current[currentSlide]
          if (video) {
            video.play().catch((e) => {
              console.log("Could not resume video playback:", e.message)
            })
          }
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content (completely separate from images) */}
          <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
            <div className="inline-block bg-[#BEA46A] text-white px-3 py-1 text-sm font-medium rounded-md shadow-md">
              {promos[currentSlide].discount || "WEBSHOP*"}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">{promos[currentSlide].title}</h2>

            <p className="text-gray-700 text-lg leading-relaxed">{promos[currentSlide].description}</p>

            <div className="pt-4">
              <Link href={promos[currentSlide].href}>
                <Button className="bg-[#BEA46A] hover:bg-[#BEA46A]/90 transform hover:scale-105 transition-all duration-300 hover:shadow-lg active:scale-95 text-white font-medium px-6 py-2.5 rounded-md">
                  {promos[currentSlide].buttonText}
                </Button>
              </Link>
            </div>

            {/* Dots indicator */}
            <div className="flex space-x-3 pt-6">
              {promos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-[#BEA46A] w-8" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Media Content (completely separate from text) */}
          <div
            className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-100"
            onMouseEnter={pauseAutoPlay}
            onMouseLeave={resumeAutoPlay}
          >
            {/* Media slides */}
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
                    preload="auto"
                  />
                )}
              </div>
            ))}

            {/* Navigation arrows */}
            <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
              <button
                className="bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition-all duration-300 shadow-md"
                onClick={prevSlide}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                className="bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition-all duration-300 shadow-md"
                onClick={nextSlide}
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}