'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterSection() {
  return (
    <div className="bg-primary text-primary-foreground py-12">
      <div className="container px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Subscribe to our Newsletter
          </h2>
          <p className="mb-6">
            Sign up and get 10% off your first order!
          </p>
          <form className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-background text-foreground"
            />
            <Button className="bg-background text-foreground hover:bg-secondary" variant="secondary">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

