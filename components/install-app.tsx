"use client"

import Image from "next/image"
import { FaAppStore, FaGooglePlay } from "react-icons/fa"

export function InstallApp() {
  return (
    <section className="bg-gradient-to-r from-[#9A8555] to-[#BEA46A] py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left side: Text content */}
          <div className="md:w-1/2 space-y-6">
            <div className="inline-block bg-[#7A6B44] text-white px-3 py-1 text-sm font-medium rounded-md mb-2">
              DOWNLOAD NU
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">XL Dranken App - Bestel Eenvoudig</h2>
            <p className="text-lg mb-6 text-white/90 max-w-xl">
              Ontdek het gemak van mobiel bestellen en krijg direct toegang tot ons volledige assortiment via onze
              gebruiksvriendelijke app. Geniet van exclusieve app-only aanbiedingen en snellere checkout.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-white mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Exclusieve app-only aanbiedingen en kortingen</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-white mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Snellere checkout met opgeslagen betalingsgegevens</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-white mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Bestelgeschiedenis en eenvoudig opnieuw bestellen</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-white mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Pushmeldingen voor leveringsupdates en speciale acties</span>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Google Play Store Button */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[200px] h-[60px] bg-white text-[#7A6B44] rounded-lg flex items-center justify-center px-4 transition-transform hover:scale-105 hover:shadow-lg"
              >
                <FaGooglePlay className="h-8 w-8 mr-2 text-[#7A6B44]" />
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
                className="w-[200px] h-[60px] bg-white text-[#7A6B44] rounded-lg flex items-center justify-center px-4 transition-transform hover:scale-105 hover:shadow-lg"
              >
                <FaAppStore className="h-8 w-8 mr-2 text-[#7A6B44]" />
                <div className="flex flex-col items-start">
                  <span className="text-xs">DOWNLOAD VIA DE</span>
                  <span className="text-sm font-semibold">App Store</span>
                </div>
              </a>
            </div>
          </div>

          {/* Right side: Phone mockup */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-[280px] h-[560px]">
              {/* Phone frame */}
              <div className="absolute inset-0 bg-black rounded-[36px] shadow-2xl"></div>
              <div className="absolute inset-[8px] bg-white rounded-[28px] overflow-hidden">
                {/* App screenshot */}
                <Image
                  src="/xl-dranken-app.png"
                  alt="XL Dranken App Screenshot"
                  width={264}
                  height={544}
                  className="object-cover"
                />
              </div>
              {/* Phone notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
