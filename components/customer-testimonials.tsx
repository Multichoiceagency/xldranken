import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Wine Enthusiast",
    content: "XL Groothandel has an incredible selection of wines. Their expert recommendations have never disappointed me!",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Cocktail Aficionado",
    content: "I love the variety of spirits available at XL Groothandel. It's my go-to place for finding unique ingredients for my cocktails.",
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Party Planner",
    content: "XL Groothandel's delivery service is a lifesaver for event planning. Fast, reliable, and always on time!",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
]

export function CustomerTestimonials() {
  return (
    <section className="py-12 bg-muted">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-background">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <p className="mb-4 italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

