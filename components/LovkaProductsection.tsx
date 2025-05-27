"use client"
import Image from "next/image"
import { Button } from "./ui/button"

function LovkaProductsection() {
  return (
    <div className="bg-[#344874] py-6 sm:py-8 md:py-12 overflow-hidden">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left px-2 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 md:mb-6 animate-fade-in-up">
              Lovka - Premium Vodka Energy Drink
            </h2>

            <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-lg mb-3 sm:mb-4 md:mb-6 animate-fade-in-up animation-delay-200">
              <p className="text-white text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4">
                Lovka bevat hoogwaardige Energy drank en koffie gecombineerd met licht Arabische gom om de perfecte
                smaak te creëren.
              </p>
              <p className="text-white text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
                Lovka Inhoud 250ml blik met 10% pure Vodka.
              </p>

              <ul className="text-white space-y-1 sm:space-y-2 mb-3 sm:mb-4 md:mb-6">
                <li className="flex items-center justify-center lg:justify-start animate-slide-in-left animation-delay-300">
                  <span className="bg-[#E2B505] rounded-full w-2 h-2 mr-2 flex-shrink-0"></span>
                  <span className="text-sm sm:text-base">Premium kwaliteit vodka</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start animate-slide-in-left animation-delay-400">
                  <span className="bg-[#E2B505] rounded-full w-2 h-2 mr-2 flex-shrink-0"></span>
                  <span className="text-sm sm:text-base">Hoogwaardige energy drank</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start animate-slide-in-left animation-delay-500">
                  <span className="bg-[#E2B505] rounded-full w-2 h-2 mr-2 flex-shrink-0"></span>
                  <span className="text-sm sm:text-base">Verkrijgbaar in verschillende smaken</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start animate-slide-in-left animation-delay-600">
                  <span className="bg-[#E2B505] rounded-full w-2 h-2 mr-2 flex-shrink-0"></span>
                  <span className="text-sm sm:text-base">Perfect voor cocktails en mixdrankjes</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center lg:justify-start">
              <a className="hidden" href="https://lovkadrinks.com/">
                <Button className="bg-[#E2B505] hover:bg-[#E2B505]/90 transform hover:scale-105 transition-all duration-300 hover:shadow-lg active:scale-95 animate-fade-in-up animation-delay-700 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                  Bezoek Lovka
                </Button>
              </a>
            </div>
          </div>

          {/* Image Section - Much Larger */}
          <div className="order-1 lg:order-2 flex justify-center relative">
            <div className="relative w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
              {/* Main Can Image with Enhanced Floating Animation */}
              <div className="relative w-full h-full animate-float-enhanced hover:animate-float-hover group">
                <Image
                  src="/winkel/lovka-achtergrond-1.png"
                  alt="Lovka Energy Drink met Vodka"
                  fill
                  className="object-contain animate-fade-in-scale transition-transform duration-700 group-hover:scale-110"
                  priority
                />

                {/* Glow effect behind the can */}
                <div className="absolute inset-0 bg-gradient-radial from-[#E2B505]/20 via-transparent to-transparent opacity-50 animate-pulse-glow"></div>
              </div>

              {/* Enhanced Vodka Percentage Badge */}
              <div className="absolute -right-4 sm:-right-6 md:-right-8 top-12 sm:top-16 md:top-20 bg-gradient-to-br from-[#E2B505] to-[#B8940A] text-white text-base sm:text-xl md:text-2xl font-bold p-3 sm:p-4 md:p-5 rounded-full transform rotate-12 shadow-2xl animate-spin-float hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer">
                <span className="block text-center leading-tight">
                  10%
                  <br />
                  <span className="text-xs sm:text-sm md:text-lg font-semibold">Vodka</span>
                </span>
              </div>

              {/* Enhanced Decorative Elements */}
              <div className="absolute -left-6 top-1/4 w-12 h-12 bg-gradient-to-r from-[#E2B505]/30 to-transparent rounded-full animate-orbit-1"></div>
              <div className="absolute -right-4 bottom-1/3 w-8 h-8 bg-gradient-to-l from-white/20 to-transparent rounded-full animate-orbit-2"></div>
              <div className="absolute left-1/4 -bottom-4 w-10 h-10 bg-gradient-to-t from-[#E2B505]/20 to-transparent rounded-full animate-orbit-3"></div>
              <div className="absolute right-1/3 top-8 w-6 h-6 bg-white/10 rounded-full animate-twinkle animation-delay-1000"></div>
              <div className="absolute left-8 bottom-1/4 w-4 h-4 bg-[#E2B505]/40 rounded-full animate-twinkle animation-delay-1500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes floatEnhanced {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) rotate(1deg);
          }
          50% {
            transform: translateY(-15px) rotate(0deg);
          }
          75% {
            transform: translateY(-8px) rotate(-1deg);
          }
        }

        @keyframes floatHover {
          0%, 100% {
            transform: translateY(-5px) rotate(0deg) scale(1.02);
          }
          50% {
            transform: translateY(-20px) rotate(2deg) scale(1.05);
          }
        }

        @keyframes spinFloat {
          0% {
            transform: translateY(0px) rotate(12deg) scale(1);
          }
          25% {
            transform: translateY(-5px) rotate(15deg) scale(1.05);
          }
          50% {
            transform: translateY(-10px) rotate(12deg) scale(1.1);
          }
          75% {
            transform: translateY(-5px) rotate(9deg) scale(1.05);
          }
          100% {
            transform: translateY(0px) rotate(12deg) scale(1);
          }
        }

        @keyframes orbit1 {
          0% {
            transform: rotate(0deg) translateX(20px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(20px) rotate(-360deg);
          }
        }

        @keyframes orbit2 {
          0% {
            transform: rotate(180deg) translateX(15px) rotate(-180deg);
          }
          100% {
            transform: rotate(540deg) translateX(15px) rotate(-540deg);
          }
        }

        @keyframes orbit3 {
          0% {
            transform: rotate(90deg) translateX(25px) rotate(-90deg);
          }
          100% {
            transform: rotate(450deg) translateX(25px) rotate(-450deg);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 1.2s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .animate-float-enhanced {
          animation: floatEnhanced 4s ease-in-out infinite;
        }

        .animate-float-hover {
          animation: floatHover 2s ease-in-out infinite;
        }

        .animate-spin-float {
          animation: spinFloat 3s ease-in-out infinite;
        }

        .animate-orbit-1 {
          animation: orbit1 8s linear infinite;
        }

        .animate-orbit-2 {
          animation: orbit2 6s linear infinite;
        }

        .animate-orbit-3 {
          animation: orbit3 10s linear infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulseGlow 3s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1500 {
          animation-delay: 1.5s;
        }

        /* Responsive adjustments for mobile */
        @media (max-width: 640px) {
          .animate-float-enhanced {
            animation: floatEnhanced 5s ease-in-out infinite;
          }
          
          .animate-orbit-1, .animate-orbit-2, .animate-orbit-3 {
            animation-duration: 12s;
          }
        }
      `}</style>
    </div>
  )
}

export default LovkaProductsection
