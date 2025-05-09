"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Updated promos array with XL Dranken in titles
const promos = [
  {
    title: "XL Dranken presenteert: Lovka",
    description:
      "Maak kennis met Lovka, onze nieuwste innovatie die pure vodka combineert met een verfrissende energy smaak en een vleugje cafeïne.",
    discount: "NIEUW PRODUCT",
    media: {
      type: "video",
      src: "/videos/lovka.mp4",
    },
    buttonText: "Ontdek Lovka",
    href: "/products/lovka",
  },
  {
    title: "XL Dranken - Uw Dranken Specialist",
    description:
    "Verken ons uitgebreide aanbod van premium alcoholische dranken, verfrissende frisdranken en exclusieve merken voor elke gelegenheid.",
    discount: "900+ PRODUCTEN",
    media: {
      type: "image",
      src: "/winkel/winkel2.jpeg",
    },
    buttonText: "Bekijk Deals",
    href: "/assortiment",
  },
  {
    title: "XL Dranken Premium Collectie",
    description:
      "Laat u meevoeren op een smaakvolle reis met onze zorgvuldig geselecteerde ambachtelijke rumcollectie van over de hele wereld.",
    discount: "25% KORTING",
    media: {
      type: "image",
      src: "/winkel/winkel3.jpeg",
    },
    buttonText: "Verken Collectie",
    href: "/assortiment",
  },
]

// Featured products data
const featuredProducts = [
  {
    id: 1,
    name: "Lovka Energy Vodka",
    description: "De perfecte mix van premium vodka en verfrissende energy. Ideaal voor een energieke avond.",
    price: 24.95,
    image: "/products/lovka-bottle.jpg",
    badge: "NIEUW",
    href: "/products/lovka-energy-vodka",
  },
  {
    id: 2,
    name: "Johnnie Walker Blue Label",
    description: "Een exceptionele Scotch whisky met rijke, complexe smaken en een zijdezachte afdronk.",
    price: 189.95,
    image: "/products/johnnie-walker.jpg",
    badge: "PREMIUM",
    href: "/products/johnnie-walker-blue",
  },
  {
    id: 3,
    name: "Dom Pérignon Vintage 2012",
    description: "Elegante champagne met tonen van witte bloemen, citrusvruchten en mineralen.",
    price: 219.5,
    image: "/products/dom-perignon.jpg",
    badge: "EXCLUSIEF",
    href: "/products/dom-perignon-2012",
  },
  {
    id: 4,
    name: "Hendrick's Gin",
    description: "Handgemaakte gin met een unieke infusie van komkommer en rozenblaadjes.",
    price: 34.95,
    image: "/products/hendricks-gin.jpg",
    badge: "BESTSELLER",
    href: "/products/hendricks-gin",
  },
  {
    id: 5,
    name: "Patrón Silver Tequila",
    description: "Ultrapremium tequila, handgemaakt van 100% Weber Blue Agave.",
    price: 49.95,
    image: "/products/patron-tequila.jpg",
    badge: "POPULAIR",
    href: "/products/patron-silver",
  },
  {
    id: 6,
    name: "Grey Goose Vodka",
    description: "Franse premium vodka, gedistilleerd van de fijnste tarwe uit Picardy.",
    price: 39.95,
    image: "/products/grey-goose.jpg",
    badge: "AANBIEDING",
    href: "/products/grey-goose",
  },
  {
    id: 7,
    name: "Bacardi 8 Años Rum",
    description: "Complexe gouden rum, 8 jaar gerijpt in eikenhouten vaten voor een rijke smaak.",
    price: 29.95,
    image: "/products/bacardi-8.jpg",
    badge: "AANRADER",
    href: "/products/bacardi-8-anos",
  },
  {
    id: 8,
    name: "Moët & Chandon Ice Impérial",
    description: "De eerste champagne speciaal gemaakt om te serveren met ijs.",
    price: 59.95,
    image: "/products/moet-ice.jpg",
    badge: "ZOMER FAVORIET",
    href: "/products/moet-ice-imperial",
  },
]

export function PromoGrid() {
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
    <div className="space-y-16">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Slider */}
        <div
          className="relative h-[600px] md:h-[650px] lg:h-[700px] overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl"
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
                {/* Media container */}
                <div className="absolute inset-0">
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
                  {/* Gradient overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                </div>

                {/* Content container - positioned on the left side */}
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16">
                    <div className="inline-block bg-[#E2B505] text-white px-3 py-1 text-sm font-medium rounded-md mb-4 shadow-md">
                      {promo.discount || "WEBSHOP*"}
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-md">
                      {promo.title}
                    </h2>
                    <p className="text-white text-base md:text-lg mb-6 max-w-xl drop-shadow-md">{promo.description}</p>
                    <Link href={promo.href}>
                      <Button className="bg-[#E2B505] hover:bg-[#E2B505]/90 transform hover:scale-105 transition-all duration-300 hover:shadow-lg active:scale-95 text-white font-medium px-6 py-2.5 rounded-md">
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2.5 backdrop-blur-sm transition-all duration-300 shadow-md"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2.5 backdrop-blur-sm transition-all duration-300 shadow-md"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
            {promos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 shadow-md ${
                  index === currentSlide ? "bg-[#E2B505] w-8" : "bg-white/60 hover:bg-white/90"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        </div>
      </div>
  )
}
