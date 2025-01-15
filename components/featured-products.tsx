'use client'
import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import productsData from "@/data/product.json";

// Wrap the single product JSON into an array for carousel rendering
const featuredProducts = [productsData];

export function FeaturedProducts() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 2 },
      "(min-width: 768px)": { slidesToScroll: 3 },
      "(min-width: 1024px)": { slidesToScroll: 4 },
    },
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="container px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">AANBEVOLEN PRODUCTEN</h2>
      <div className="relative">
        {/* Carousel wrapper */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {/* Render featured products */}
            {featuredProducts.map((product, index) => (
              <div
                key={product.id_product_mysql || index}
                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] pl-4 first:pl-0"
              >
                <ProductCard
                  id={product.id_product_mysql}
                  name={product.title}
                  slug={product.productCode}
                  image={`data:image/jpeg;base64,${product.photo1_base64}`}
                  price={parseFloat(product.prix_vente_groupe)}
                  originalPrice={product.prix_en_promo > 0 ? product.prix_en_promo : undefined}
                  volume={product.arcleunik}
                  category={product.fam1ID}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous product</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next product</span>
        </Button>
      </div>
    </div>
  );
}
