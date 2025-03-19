"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import type { ProductProps } from "@/types/product";

export default function ProductCard ({ product }: { product: ProductProps }) {
  const { addToCart } = useCart();

  if (!product) return <p className="text-gray-500">Product not found</p>;

  // Bouw de juiste image URL op: als de base64-string al een prefix heeft, gebruik die,
  // anders voeg de 'data:image/jpeg;base64,' prefix toe. Gebruik een fallback als geen afbeelding beschikbaar is.
  const imageSrc = product.photo1_base64
    ? product.photo1_base64.startsWith("data:image")
      ? product.photo1_base64
      : `data:image/jpeg;base64,${product.photo1_base64}`
    : "/placeholder.svg";

  const handleAddToCart = () => {
    addToCart({
      id: product.id_product_mysql,
      name: product.title,
      price:
        product.prix_en_promo !== null
          ? Number(product.prix_en_promo)
          : Number(product.prix_vente_groupe),
      image: imageSrc,
      volume: product.arcleunik,
      productCode: product.productCode,
      quantity: 1,
    });
  };

  // Formatteren van prijzen
  const regularPrice = Number(product.prix_vente_groupe);
  const promoPrice =
    product.prix_en_promo !== null ? Number(product.prix_en_promo) : null;

  return (
    <div className="group relative flex flex-col bg-white rounded-lg border hover:shadow-lg transition-all duration-300">
      {/* Productafbeelding */}
      <div
        className="relative h-[200px] w-full overflow-hidden p-4"
      >
        <Image
          src={imageSrc}
          alt={product.title}
          style={{padding: "10px"}}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
      </div>

      {/* Productdetails */}
      <div className="flex flex-col p-4 pt-0" style={{paddingTop: "15px"}}>
          <h3 className="font-medium text-[#002B7F] hover:underline min-h-[2.5rem] line-clamp-2">
            {product.title}
          </h3>

        {/* Prijsweergave */}
        <div className="space-y-1">
          {regularPrice > 0 || promoPrice ? (
            promoPrice ? (
              <>
                <div className="text-gray-500 line-through text-sm">
                  € {regularPrice.toFixed(2).replace(".", ",")}
                </div>
                <div className="text-[#E31931] text-2xl font-bold">
                  € {promoPrice.toFixed(2).replace(".", ",")}
                </div>
              </>
            ) : (
              <div className="text-[#E31931] text-2xl font-bold">
                € {regularPrice.toFixed(2).replace(".", ",")}
              </div>
            )
          ) : (
            <div className="text-gray-500 text-sm">Prijs niet beschikbaar</div>
          )}
        </div>

        {/* Winkelwagenknop */}
        <div className="mt-4">
          <Button
            className="w-full bg-[#E2B505] hover:bg-[#E2B505]/90 text-white transition-all duration-300 hover:shadow-md"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            In winkelmand
          </Button>
        </div>
      </div>
    </div>
  );
}
