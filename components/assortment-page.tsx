import Link from "next/link"
import Image from "next/image"

const categories = [
  { name: "Wijn", image: "https://images.pexels.com/photos/66636/pexels-photo-66636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "wijn" },
  { name: "Bier", image: "https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "bier" },
  { name: "Sterke Drank", image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "sterke-drank" },
  { name: "Whisky", image: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "whisky" },
  { name: "Cognac & Armagnac", image: "https://images.pexels.com/photos/209590/pexels-photo-209590.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "cognac-armagnac" },
  { name: "Likeur", image: "https://images.pexels.com/photos/3019019/pexels-photo-3019019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "likeur" },
  { name: "Champagne", image: "https://images.pexels.com/photos/298694/pexels-photo-298694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "champagne" },
  { name: "Prosecco", image: "https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "prosecco" },
  { name: "Alcoholvrij", image: "https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "alcoholvrij" },
  { name: "Aperitieven", image: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "aperitieven" },
  { name: "Gedistilleerd", image: "https://images.pexels.com/photos/339696/pexels-photo-339696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "gedistilleerd" },
  { name: "Cadeaus & Accessoires", image: "https://images.pexels.com/photos/1741695/pexels-photo-1741695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "cadeaus-accessoires" },
]

export function AssortmentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ons Assortiment</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/shop?assortiment=${category.slug}`}
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gray-800 bg-opacity-75 p-4">
              <h3 className="text-white font-semibold text-lg text-center">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

