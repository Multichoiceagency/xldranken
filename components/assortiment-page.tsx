import Link from "next/link";
import Image from "next/image";
import Hero from "./Hero";

const categories = [
  { name: "Alcohol", image: "https://images.pexels.com/photos/66636/pexels-photo-66636.jpeg", url: "/alcohol" },
  { name: "Bier", image: "https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg", url: "/bier" },
  { name: "Cocktails", image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg", url: "/cocktails" },
  { name: "Frisdranken", image: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg", url: "/frisdranken" },
  { name: "Horeca", image: "https://images.pexels.com/photos/209590/pexels-photo-209590.jpeg", url: "/horeca" },
  { name: "Koffie & Theewaren", image: "https://images.pexels.com/photos/3019019/pexels-photo-3019019.jpeg", url: "/koffie-theewaren" },
  { name: "Lovka", image: "https://images.pexels.com/photos/298694/pexels-photo-298694.jpeg", url: "/lovka" },
  { name: "Mix Dranken", image: "https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg", url: "/mix-dranken" },
  { name: "NON Food", image: "https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg", url: "/non-food" },
  { name: "Wijn", image: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg", url: "/wijn" },
];

export function AssortimentPage() {
  return (
    <div><Hero title={"Ons Assortiment"} description={""} />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Ons Assortiment</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link key={category.url} href={category.url} className="group relative block rounded-lg overflow-hidden">
            <div className="relative w-full h-48 sm:h-56">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gray-900 bg-opacity-70 p-4">
              <h3 className="text-white font-semibold text-center text-lg">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
}
