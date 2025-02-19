import Link from "next/link"
import Image from "next/image"

const categories = [
  { name: "Alcohol", image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "/alcohol" },
  { name: "Bier", image: "https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "bier" },
  { name: "Cocktails", image: "https://images.pexels.com/photos/66636/pexels-photo-66636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "cocktails" },
  { name: "Frisdranken", image: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "frisdranken" },
  { name: "Mix Dranken", image: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "mix-dranken" },
  { name: "Food", image: "https://images.pexels.com/photos/298694/pexels-photo-298694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "food" },
  { name: "NON-Food", image: "https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "non-food" },
  { name: "Horeca", image: "https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "alcoholvrij-bier" },
    { name: "Cadeaus & Accessoires", image: "https://images.pexels.com/photos/1741695/pexels-photo-1741695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", slug: "cadeaus-accessoires" },
]

export function ShopByCategory() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`${category.slug}`}
              className="group relative aspect-square overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-white font-semibold text-lg text-center">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

