import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"

const blogPosts = [
  {
    id: 1,
    title: "De kunst van wijn proeven",
    excerpt: "Ontdek hoe je als een echte sommelier wijn kunt proeven en beoordelen. Leer over aroma's, smaken en texturen.",
    image: "/placeholder.svg?height=200&width=300",
    date: "2023-05-15",
  },
  {
    id: 2,
    title: "Cocktails maken: tips en tricks",
    excerpt: "Leer hoe je thuis de perfecte cocktails kunt maken met onze expert tips en eenvoudige recepten.",
    image: "/placeholder.svg?height=200&width=300",
    date: "2023-05-22",
  },
  {
    id: 3,
    title: "Bierbrouwen voor beginners",
    excerpt: "Ontdek de basics van bierbrouwen en begin je eigen brouwavontuur met onze stap-voor-stap gids.",
    image: "/placeholder.svg?height=200&width=300",
    date: "2023-05-29",
  },
]

export function LatestBlogPosts() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">Laatste Blogposts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <Link href={`/blog/${post.id}`} className="text-[#FF6B35] hover:underline">
                    Lees meer
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

