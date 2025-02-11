import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function SkeletonCard() {
  return (
    <Card className="flex flex-col">
      <CardContent className="p-4">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
      <CardFooter className="flex-grow flex flex-col justify-end p-4">
        <div className="space-y-2 w-full">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-8 w-full" />
        </div>
      </CardFooter>
    </Card>
  )
}

