"use client"

import Image from "next/image"
import { FaAppStore, FaGooglePlay } from "react-icons/fa"

export function InstallApp() {
  return (
    <section className="bg-gradient-to-br from-[#0F3059] via-[#1a4a7a] to-[#C6B07F] py-12 sm:py-16 md:py-20 text-white overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C6B07F]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#C6B07F]/10 to-transparent rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left side: Text content */}
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="inline-block bg-gradient-to-r from-[#C6B07F] to-[#d4c291] text-[#0F3059] px-4 py-2 text-sm font-bold rounded-full mb-4 animate-pulse-badge">
              DOWNLOAD NU
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight animate-fade-in-up">
              <span className="bg-gradient-to-r from-white to-[#C6B07F] bg-clip-text text-transparent">
                XL Groothandel App
              </span>
              <br />
              <span className="text-white">Bestel Eenvoudig</span>
            </h2>

            <p className="text-lg sm:text-xl mb-8 text-white/90 max-w-2xl leading-relaxed animate-fade-in-up animation-delay-200">
              Ontdek het gemak van mobiel bestellen en krijg direct toegang tot ons volledige assortiment van{" "}
              <span className="font-semibold text-[#C6B07F]">900+ producten</span> via onze gebruiksvriendelijke app.
            </p>

            <ul className="space-y-4 mb-8 text-left max-w-xl mx-auto lg:mx-0">
              {[
                "Exclusieve app-only aanbiedingen en kortingen",
                "Snellere checkout met opgeslagen betalingsgegevens",
                "Bestelgeschiedenis en eenvoudig opnieuw bestellen",
                "Pushmeldingen voor leveringsupdates en speciale acties",
              ].map((feature, index) => (
                <li
                  key={index}
                  className={`flex items-start animate-slide-in-left animation-delay-${300 + index * 100}`}
                >
                  <div className="bg-[#C6B07F] rounded-full p-1 mr-3 mt-1 flex-shrink-0">
                    <svg className="h-4 w-4 text-[#0F3059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/90">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up animation-delay-800">
              {/* Google Play Store Button */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-[220px] h-[70px] bg-white hover:bg-gray-50 text-[#0F3059] rounded-xl flex items-center justify-center px-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <FaGooglePlay className="h-10 w-10 mr-3 text-[#0F3059] group-hover:text-[#C6B07F] transition-colors" />
                <div className="flex flex-col items-start">
                  <span className="text-xs font-medium text-gray-600">DOWNLOAD VIA DE</span>
                  <span className="text-lg font-bold">Google Play</span>
                </div>
              </a>

              {/* Apple App Store Button */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-[220px] h-[70px] bg-white hover:bg-gray-50 text-[#0F3059] rounded-xl flex items-center justify-center px-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <FaAppStore className="h-10 w-10 mr-3 text-[#0F3059] group-hover:text-[#C6B07F] transition-colors" />
                <div className="flex flex-col items-start">
                  <span className="text-xs font-medium text-gray-600">DOWNLOAD VIA DE</span>
                  <span className="text-lg font-bold">App Store</span>
                </div>
              </a>
            </div>
          </div>

          {/* Right side: Phone mockup */}
          <div className="lg:w-1/2 flex justify-center relative">
            <div className="relative animate-float">
              {/* Glow effect behind phone */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#C6B07F]/30 to-[#0F3059]/30 rounded-[50px] blur-2xl scale-110"></div>

              {/* Phone mockup using the provided image */}
              <div className="relative w-[700px] sm:w-[700px] md:w-[700px] h-auto">
                <Image
                  src="/images/xl-app-mockup.png"
                  alt="XL Groothandel App Screenshot"
                  width={700}
                  height={800}
                  className="object-contain drop-shadow-2xl animate-fade-in-scale animation-delay-400"
                  priority
                />
              </div>

              {/* Floating elements around phone */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#C6B07F]/60 rounded-full animate-bounce animation-delay-1000"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-white/60 rounded-full animate-bounce animation-delay-1200"></div>
              <div className="absolute top-1/4 -left-8 w-4 h-4 bg-[#C6B07F]/40 rounded-full animate-pulse animation-delay-800"></div>
              <div className="absolute bottom-1/3 -right-6 w-5 h-5 bg-white/40 rounded-full animate-pulse animation-delay-1400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom CSS */}
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
            transform: scale(0.9);
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(-5px) rotate(-1deg);
          }
        }

        @keyframes pulseBadge {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(198, 176, 127, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(198, 176, 127, 0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 1s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-badge {
          animation: pulseBadge 2s ease-in-out infinite;
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

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1200 {
          animation-delay: 1.2s;
        }

        .animation-delay-1400 {
          animation-delay: 1.4s;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
        }
      `}</style>
    </section>
  )
}
