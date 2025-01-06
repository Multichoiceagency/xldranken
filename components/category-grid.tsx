import Image from "next/image"
import Link from "next/link"

const categories = [
  { name: "Red Wine", image: "/placeholder.svg?height=200&width=200" },
  { name: "White Wine", image: "/placeholder.svg?height=200&width=200" },
  { name: "Whisky", image: "/placeholder.svg?height=200&width=200" },
  { name: "Rum & Gin", image: "/placeholder.svg?height=200&width=200" },
  { name: "Liqueurs", image: "/placeholder.svg?height=200&width=200" },
  { name: "Champagne", image: "/placeholder.svg?height=200&width=200" },
  { name: "Beer", image: "/placeholder.svg?height=200&width=200" },
  { name: "Non-Alcoholic", image: "/placeholder.svg?height=200&width=200" },
]

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={`/category/${category.name.toLowerCase()}`}
          className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
        >
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg text-center">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  )
}

