'use client'

import { useState, useEffect } from "react"
import { useMediaQuery } from 'react-responsive'
import { ChevronDown, Search, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ProductCard } from "./product-card"
import { sampleProducts } from "@/data/sample-products"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FilterState {
  bottleSize: string[];
  priceRange: string;
  alcoholPercentage: string;
  brands: string[];
  onlyPromotions: boolean;
}

const bottleSizes = [
  { label: "33 CL en meer", count: 7 },
  { label: "75 CL", count: 15 },
  { label: "25 CL", count: 166 },
]

const brands = [
  { name: "Hertog Jan", count: 18 },
  { name: "Heineken", count: 14 },
  { name: "Bavaria", count: 7 },
  { name: "La Chouffe", count: 12 },
  { name: "Leffe", count: 8 },
]

const priceRanges = [
  { label: "Tot 5 euro", value: "0-5" },
  { label: "5 tot 10 euro", value: "5-10" },
  { label: "10 tot 20 euro", value: "10-20" },
  { label: "20 euro en meer", value: "20+" },
]

export function ShopPage({ initialCategory }: { initialCategory?: string }) {
  const [filters, setFilters] = useState<FilterState>({
    bottleSize: [],
    priceRange: "",
    alcoholPercentage: "",
    brands: [],
    onlyPromotions: false,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const [category, setCategory] = useState(initialCategory || "")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const isMobile = useMediaQuery({ maxWidth: 1024 })
  const itemsPerPage = 12

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory)
    }
  }, [initialCategory])

  const filteredProducts = sampleProducts.filter(product => {
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    if (category && product.category.toLowerCase() !== category.toLowerCase()) {
      return false
    }
    if (filters.bottleSize.length > 0 && !filters.bottleSize.includes(product.volume)) {
      return false
    }
    if (filters.brands.length > 0 && !filters.brands.includes(product.category)) {
      return false
    }
    return true
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const renderFilters = () => (
    <Accordion type="multiple" className="w-full" defaultValue={["soort", "merk", "flesformaat", "prijs", "alcohol"]}>
      <AccordionItem value="soort">
        <AccordionTrigger>SOORT</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Checkbox /> Pils (118)
            </Label>
            <Label className="flex items-center gap-2">
              <Checkbox /> Speciaal bier (251)
            </Label>
            <Label className="flex items-center gap-2">
              <Checkbox /> Alcoholvrij & alcoholarm bier (58)
            </Label>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="merk">
        <AccordionTrigger>MERK</AccordionTrigger>
        <AccordionContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zoek op merk"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            {brands.map(brand => (
              <Label key={brand.name} className="flex items-center gap-2">
                <Checkbox
                  checked={filters.brands.includes(brand.name)}
                  onCheckedChange={(checked) => {
                    setFilters(prev => ({
                      ...prev,
                      brands: checked
                        ? [...prev.brands, brand.name]
                        : prev.brands.filter(b => b !== brand.name)
                    }))
                  }}
                />
                {brand.name} ({brand.count})
              </Label>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="flesformaat">
        <AccordionTrigger>FLESFORMAAT</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {bottleSizes.map(size => (
              <Label key={size.label} className="flex items-center gap-2">
                <Checkbox
                  checked={filters.bottleSize.includes(size.label)}
                  onCheckedChange={(checked) => {
                    setFilters(prev => ({
                      ...prev,
                      bottleSize: checked
                        ? [...prev.bottleSize, size.label]
                        : prev.bottleSize.filter(s => s !== size.label)
                    }))
                  }}
                />
                {size.label} ({size.count})
              </Label>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="prijs">
        <AccordionTrigger>PRIJS</AccordionTrigger>
        <AccordionContent>
          <RadioGroup
            value={filters.priceRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
          >
            {priceRanges.map(range => (
              <div key={range.value} className="flex items-center space-x-2">
                <RadioGroupItem value={range.value} id={range.value} />
                <Label htmlFor={range.value}>{range.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="alcohol">
        <AccordionTrigger>ALCOHOL-PERCENTAGE</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Checkbox /> 0% - 0.5%
            </Label>
            <Label className="flex items-center gap-2">
              <Checkbox /> 0.5% - 3%
            </Label>
            <Label className="flex items-center gap-2">
              <Checkbox /> 3% - 7%
            </Label>
            <Label className="flex items-center gap-2">
              <Checkbox /> 7% en hoger
            </Label>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {category ? category.charAt(0).toUpperCase() + category.slice(1) : "ALLE PRODUCTEN"}
        </h1>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sorteer op" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Aanbevolen</SelectItem>
            <SelectItem value="price-asc">Prijs laag - hoog</SelectItem>
            <SelectItem value="price-desc">Prijs hoog - laag</SelectItem>
            <SelectItem value="name-asc">Naam A - Z</SelectItem>
            <SelectItem value="name-desc">Naam Z - A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {!isMobile && (
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-6">
              {renderFilters()}
            </div>
          </div>
        )}

        <div className="flex-1">
          {isMobile && (
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-between mb-6">
                  ALLE FILTERS
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[540px]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-100px)]">
                  {renderFilters()}
                </ScrollArea>
              </SheetContent>
            </Sheet>
          )}

          <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
            {bottleSizes.map(size => (
              <Button
                key={size.label}
                variant="outline"
                className={filters.bottleSize.includes(size.label) ? "bg-[#FF6B35] text-white" : ""}
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    bottleSize: prev.bottleSize.includes(size.label)
                      ? prev.bottleSize.filter(s => s !== size.label)
                      : [...prev.bottleSize, size.label]
                  }))
                }}
              >
                {size.label} ({size.count})
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <div className="mt-12 space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4">WAT IS BIER?</h2>
              <p className="text-muted-foreground">
                Bier is na water of melk de een alcoholische drank, verkrijgbaar door vergisting van moutsuiker en gebouwen uit graan, water, hop en gist. Elke hop-, gist- en graansoort heeft specifieke eigenschappen die het bier beïnvloeden. Moet bijkomende granen, meestal gerst of tarwe in de graanketel die de kleur van het bier bepaalt. Er zijn verschillende soorten bier, zoals pils, witbier, tripel en stout. Elk met hun eigen smaak en karakter.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">OORSPRONG BIER</h2>
              <p className="text-muted-foreground">
                Waarschijnlijk al 6000 jaar voor Christus werd in Mesopotamië een vorm van bier gebrouwen. Hiermee is bier een van de oudste dranken uit de menselijke geschiedenis. Het oudste geschreven recept dat archeologen vonden is het bierrecept! Voor het gewone volk werd bier in de middeleeuwen de drank van keuze. Het was zelfs veiliger dan water. Bier werd nog steeds gebrouwen met gekookt water, waardoor het veiliger was om te drinken. Tegenwoordig is bier de meest gedronken drank ter wereld.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

