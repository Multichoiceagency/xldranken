import Link from 'next/link'
import { Beer, Wine, CoffeeIcon as Cocktail, Coffee, Utensils, Package } from 'lucide-react'

const categories = [
  { name: "Alcohol", icon: Wine, href: "/category/alcohol" },
  { name: "Bier", icon: Beer, href: "/category/bier" },
  { name: "Wijn", icon: Wine, href: "/category/wijn" },
  { name: "Cocktails", icon: Cocktail, href: "/category/cocktails" },
  { name: "Frisdranken", icon: Package, href: "/category/frisdranken" },
  { name: "Horeca", icon: Utensils, href: "/category/horeca" },
  { name: "NON Food", icon: Package, href: "/category/non-food" },
  { name: "Koffie & Thee", icon: Coffee, href: "/category/koffie-thee" },
]

export function PopularCategories() {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">Populaire Categorieën</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <category.icon className="w-12 h-12 mb-2 text-[#FF6B35]" />
              <span className="text-lg font-medium text-center">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

