import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <Spinner size="large" className="text-[#E2B505] mb-4" />
        <h2 className="text-xl font-semibold mt-4">Producten worden geladen...</h2>
        <p className="text-gray-500 mt-2">Even geduld alstublieft</p>
      </div>
    </div>
  )
}

