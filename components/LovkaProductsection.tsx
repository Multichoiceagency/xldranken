
import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
function LovkaProductsection() {
  return (
    <div className="bg-[#344874] py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-4xl font-bold text-white mb-6">Lovka - Premium Vodka Energy Drink</h2>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg mb-6">
            <p className="text-white text-lg mb-4">
              Lovka bevat hoogwaardige Energy drank en koffie gecombineerd met licht Arabische gom om de perfecte smaak te creëren.
            </p>
            <p className="text-white text-lg mb-4">
              Lovka Inhoud 250ml blik met 10% pure Vodka.
            </p>
            <ul className="text-white space-y-2 mb-6">
              <li className="flex items-center">
                <span className="bg-[#E2B505] rounded-full w-2 h-2 mr-2"></span>
                <span>Premium kwaliteit vodka</span>
              </li>
              <li className="flex items-center">
                <span className="bg-[#E2B505] rounded-full w-2 h-2 mr-2"></span>
                <span>Hoogwaardige energy drank</span>
              </li>
              <li className="flex items-center">
                <span className="bg-[#E2B505] rounded-full w-2 h-2 mr-2"></span>
                <span>Verkrijgbaar in verschillende smaken</span>
              </li>
              <li className="flex items-center">
                <span className="bg-[#E2B505] rounded-full w-2 h-2 mr-2"></span>
                <span>Perfect voor cocktails en mixdrankjes</span>
              </li>
            </ul>
          </div>
          <div className="flex space-x-4">
            <Link className='display:none' href='www.lovkadrinks.com'>
            <Button className="bg-[#E2B505] hover:bg-[#E2B505]/90 transform hover:scale-105 transition-all duration-300 hover:shadow-lg active:scale-95">
              Bestel Lovka
            </Button>
            </Link>
          </div>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative w-full max-w-md h-[500px] transform transition-all duration-500 hover:scale-105 hover:rotate-2">
            <Image
              src="/winkel/lovka-achtergrond-1.png"
              alt="Lovka Energy Drink met Vodka"
              fill
              className="object-contain"
            />
            <div className="absolute -bottom-6 -right-6 bg-[#E2B505] text-white text-xl font-bold p-4 rounded-full transform rotate-12 shadow-lg">
              10% Vodka
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default LovkaProductsection
