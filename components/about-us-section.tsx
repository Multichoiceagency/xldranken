"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function AboutUsSection() {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 px-2 sm:px-4 lg:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6 animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] bg-clip-text text-transparent leading-tight">
                XL Groothandel
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#C6B07F] to-[#d4c291] text-[#0F3059] shadow-lg animate-pulse-badge">
                900+ DRANKEN & PRODUCTEN
              </span>
            </div>

            <div className="space-y-4 sm:space-y-6 text-gray-700">
              <p className="text-sm sm:text-base md:text-lg leading-relaxed animate-fade-in-up animation-delay-200">
                Welkom bij{" "}
                <span className="font-semibold bg-gradient-to-r from-[#0F3059] to-[#C6B07F] bg-clip-text text-transparent">
                  XL Groothandel
                </span>
                , dé specialist in alcoholische en non-alcoholische dranken. Met trots bieden wij een assortiment van
                meer dan <span className="font-semibold text-[#C6B07F]">900 verschillende dranken</span> aan, zorgvuldig
                geselecteerd om aan al uw wensen te voldoen.
              </p>

              <p className="text-sm sm:text-base md:text-lg leading-relaxed animate-fade-in-up animation-delay-400">
                Van poolse bieren tot exclusieve alcoholische dranken en premium sterke drank en verfrissende
                frisdranken - ons uitgebreide aanbod biedt voor ieder moment de perfecte drank. Ontdek nieuwe smaken of
                vind uw vertrouwde favorieten in ons constant vernieuwende assortiment.
              </p>

              <div className="bg-gradient-to-r from-[#0F3059]/5 to-[#C6B07F]/10 p-4 sm:p-6 rounded-xl border border-[#C6B07F]/30 shadow-lg animate-fade-in-up animation-delay-600">
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-800">
                  <span className="font-semibold text-[#0F3059]">Kwaliteit staat bij ons voorop.</span> We werken nauw
                  samen met toonaangevende leveranciers en producenten om u alleen het beste te kunnen bieden. Ons
                  deskundige team staat altijd klaar om u te adviseren, of u nu op zoek bent naar het perfecte cadeau of
                  de ideale drank voor een speciale gelegenheid.
                </p>
              </div>

              <p className="text-sm sm:text-base md:text-lg leading-relaxed animate-fade-in-up animation-delay-800">
                Naast ons uitgebreide drankenassortiment bieden we ook een selectie van{" "}
                <span className="font-semibold text-[#0F3059]">food en non-food producten</span> aan. XL Groothandel is
                niet alleen uw partner voor zakelijke aankopen, maar levert ook aan{" "}
                <span className="font-semibold text-[#C6B07F]">avondwinkels, supermarkten, cafés en bars</span>. Onze
                flexibele service en brede productaanbod maken ons de ideale leverancier als
                bedrijven in de horeca- en retailsector.
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] rounded-2xl overflow-hidden shadow-2xl group">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F3059]/30 via-transparent to-[#C6B07F]/10 z-10"></div>

              {/* Main Image */}
              <Image
                src="/winkel/IMG_8847.jpg"
                alt="XL Groothandel Winkel"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 animate-fade-in-scale"
                priority
              />

              {/* Floating Badge */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-[#C6B07F]/30 z-20 animate-float">
                <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#0F3059] to-[#C6B07F] bg-clip-text text-transparent">
                  Sinds 2025
                </span>
              </div>

              {/* Bottom Info Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-lg border border-[#C6B07F]/30 z-20 animate-slide-up animation-delay-1200">
                <h3 className="font-bold text-[#0F3059] text-sm sm:text-base mb-1">Bezoek Onze Winkel</h3>
                <p className="text-xs sm:text-sm text-gray-600">Ervaar ons uitgebreide assortiment ter plaatse</p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#C6B07F]/20 to-[#0F3059]/20 rounded-full blur-xl animate-pulse-slow"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-[#0F3059]/20 to-[#C6B07F]/20 rounded-full blur-xl animate-pulse-slow animation-delay-1000"></div>

              {/* Accent Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-gradient-to-r from-[#C6B07F]/30 to-[#0F3059]/30 pointer-events-none"></div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute -z-10 top-8 right-8 w-32 h-32 bg-gradient-to-br from-[#C6B07F]/10 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute -z-10 bottom-8 left-8 w-24 h-24 bg-gradient-to-tr from-[#0F3059]/10 to-transparent rounded-full blur-2xl"></div>
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
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
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

        @keyframes pulseSlow {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 1s ease-out forwards;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-badge {
          animation: pulseBadge 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
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

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        }
      `}</style>
    </section>
  )
}
