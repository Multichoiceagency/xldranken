import Link from "next/link"
import { Beer, Wine, CoffeeIcon as Cocktail, Coffee, Utensils, Package } from 'lucide-react'

const categories = [
  { name: "Alcohol", icon: Wine, image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" },
  { name: "Bier", icon: Beer, image: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" },
  { name: "Wijn", icon: Wine, image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" },
  { name: "Cocktails", icon: Cocktail, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" },
  { name: "Frisdranken", icon: Package, image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" },
  { name: "Horeca", icon: Utensils, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" },
  { name: "NON Food", icon: Package, image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" },
  { name: "Koffie & Theewaren", icon: Coffee, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" },
]

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={`/category/${category.name.toLowerCase()}`}
          className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
        >
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
            <category.icon className="w-12 h-12 text-white mb-2" />
            <h3 className="text-white font-semibold text-lg text-center">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  )
}

