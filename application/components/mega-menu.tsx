'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const categories = [
  {
    name: 'Wijn',
    subcategories: ['Rode wijn', 'Witte wijn', 'Rosé', 'Mousserende wijn', 'Dessert wijn']
  },
  {
    name: 'Bier',
    subcategories: ['Pils', 'Speciaalbier', 'IPA', 'Stout', 'Alcohol-vrij bier']
  },
  {
    name: 'Sterke drank',
    subcategories: ['Whisky', 'Vodka', 'Gin', 'Rum', 'Likeur']
  },
  {
    name: 'Frisdrank',
    subcategories: ['Cola', 'Limonade', 'Energy drinks', 'Sap', 'Water']
  }
]

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 font-medium focus:outline-none focus:bg-gray-200 px-3 py-2 rounded-md"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        ASSORTIMENT
        <ChevronDown className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-screen bg-white shadow-lg z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-4 gap-8">
              {categories.map((category) => (
                <div key={category.name}>
                  <h3 className="font-bold mb-2">{category.name}</h3>
                  <ul className="space-y-1">
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory}>
                        <Link href={`/category/${subcategory.toLowerCase().replace(' ', '-')}`} className="text-gray-600 hover:text-[#FF6B35]">
                          {subcategory}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

