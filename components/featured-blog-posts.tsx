import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const blogPosts = [
  {
    id: 1,
    title: "The Art of Whiskey Tasting",
    excerpt: "Discover the nuances of flavor in various whiskey types...",
    image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    date: "May 15, 2023",
    author: "John Doe",
  },
  {
    id: 2,
    title: "Summer Cocktail Recipes",
    excerpt: "Beat the heat with these refreshing summer cocktails...",
    image: "https://images.pexels.com/photos/2531186/pexels-photo-2531186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    date: "June 2, 2023",
    author: "Jane Smith",
  },
  {
    id: 3,
    title: "Wine Pairing 101",
    excerpt: "Learn the basics of pairing wine with your favorite dishes...",
    image: "https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    date: "July 10, 2023",
    author: "Emily Brown",
  },
]

export function FeaturedBlogPosts() {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">From Our Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-4 bg-muted">
                <div className="text-sm text-muted-foreground">
                  {post.date} | {post.author}
                </div>
                <Link
                  href={`/blog/${post.id}`}
                  className="text-[#FF6B35] hover:underline"
                >
                  Read More
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

