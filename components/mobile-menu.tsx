'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const categories = [
  { name: "Wijn", slug: "wijn" },
  { name: "Bier", slug: "bier" },
  { name: "Sterke Drank", slug: "sterke-drank" },
  { name: "Whisky", slug: "whisky" },
  { name: "Cognac & Armagnac", slug: "cognac-armagnac" },
  { name: "Likeur", slug: "likeur" },
  { name: "Champagne", slug: "champagne" },
  { name: "Prosecco", slug: "prosecco" },
  { name: "Alcoholvrij", slug: "alcoholvrij" },
  { name: "Aperitieven", slug: "aperitieven" },
  { name: "Gedistilleerd", slug: "gedistilleerd" },
  { name: "Cadeaus & Accessoires", slug: "cadeaus-accessoires" },
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="p-4 space-y-4">
            <Link href="/assortiment" className="block font-medium" onClick={onClose}>
              ASSORTIMENT
            </Link>
            <Link href="/acties" className="block font-medium text-primary" onClick={onClose}>
              ACTIES
            </Link>
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Categorieën</h3>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/shop?assortiment=${category.slug}`}
                  className="block py-2 hover:text-primary"
                  onClick={onClose}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

