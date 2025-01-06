import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from 'lucide-react'

export function WeeklyOffersBanner() {
  return (
    <Link href="/folder" className="block">
      <div className="relative w-full h-[120px] bg-gradient-to-r from-[#B8860B] to-[#FFD700] rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-between px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Bekijk de aanbiedingen van deze week in de folder!
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-32 -rotate-12 transform">
              <Image
                src="/placeholder.svg?height=80&width=128"
                alt="Weekly offers folder"
                width={128}
                height={80}
                className="object-cover shadow-lg"
              />
            </div>
            <div className="relative h-20 w-32 rotate-12 transform">
              <Image
                src="/placeholder.svg?height=80&width=128"
                alt="Weekly offers folder"
                width={128}
                height={80}
                className="object-cover shadow-lg"
              />
            </div>
            <div className="bg-black/20 p-2 rounded-full">
              <ArrowRight className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

