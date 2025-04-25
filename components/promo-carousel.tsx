"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { FaAppStore, FaGooglePlay } from "react-icons/fa"

// Updated promos array with XL Dranken in titles
const promos = [
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
  {
    title: "XL Dranken - Uw Dranken Specialist",
    description:
      "Verken ons uitgebreide aanbod van premium alcoholische dranken, verfrissende frisdranken en exclusieve merken voor elke gelegenheid.",
    discount: "900+ PRODUCTEN",
    media: {
      type: "image",
      src: "/winkel/intro-1740433163.jpg",
    },
    buttonText: "Ontdek Assortiment",
    href: "/assortiment",
  },
  {
    title: "XL Dranken presenteert: Lovka",
    description:
      "Maak kennis met Lovka, onze nieuwste innovatie die pure vodka combineert met een verfrissende energy smaak en een vleugje cafeïne.",
    discount: "NIEUW PRODUCT",
    media: {
      type: "video",
      src: "/videos/lovka.mp4",
      poster: "/videos/lovka-poster.jpg", // Add a poster image for the video
    },
    buttonText: "Ontdek Lovka",
    href: "/products/lovka",
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
                  <>
                    {/* Fallback image that shows when video isn't playing */}
                    {!isVideoPlaying[index] && promo.media.poster && (
                      <Image
                        src={promo.media.poster || "/placeholder.svg"}
                        alt={promo.description}
                        fill
                        className="object-cover"
                      />
                    )}
                    <video
                      ref={setVideoRef(index)}
                      src={promo.media.src}
                      poster={promo.media.poster}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="auto"
                    />
                  </>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-6 md:p-12">
                  <div className="inline-block bg-[#E2B505] text-white px-3 py-1 text-sm self-start">
                    {promo.discount || "WEBSHOP*"}
                  </div>
                  <div className="max-w-2xl">
                    <h2 className="text-4xl font-bold text-white leading-tight mb-4">{promo.title}</h2>
                    <p className="text-white text-lg mb-6">{promo.description}</p>
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

      {/* App Download Section with XL Dranken in title */}
      <section className="bg-[#FFF5F5] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D1B69] mb-4">XL Dranken App - Bestel Eenvoudig</h2>
            <p className="text-lg mb-8 text-muted-foreground">
              Ontdek het gemak van mobiel bestellen en krijg direct toegang tot ons volledige assortiment via onze
              gebruiksvriendelijke app.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Google Play Store Button */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[200px] h-[60px] bg-[#d3a417] hover:bg-gray-700 text-white rounded-lg flex items-center justify-center px-4 transition-transform hover:scale-105 hover:shadow-lg"
              >
                <FaGooglePlay className="h-8 w-8 mr-2 fill-white" />
                <div className="flex flex-col items-start">
                  <span className="text-xs">DOWNLOAD VIA DE</span>
                  <span className="text-sm font-semibold">Google Play</span>
                </div>
              </a>

              {/* Apple App Store Button */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[200px] h-[60px] bg-[#d3a417] hover:bg-gray-700 text-white rounded-lg flex items-center justify-center px-4 transition-transform hover:scale-105 hover:shadow-lg"
              >
                <FaAppStore className="h-8 w-8 mr-2" />
                <div className="flex flex-col items-start">
                  <span className="text-xs">DOWNLOAD VIA DE</span>
                  <span className="text-sm font-semibold">App Store</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

