"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import type { ProductProps } from "@/types/product";

function ProductCard({ product }: { product: ProductProps }) {
  const { addToCart } = useCart();

  if (!product) return <p className="text-gray-500">Product not found</p>;

  const handleAddToCart = () => {
    addToCart({
      id: product.id_product_mysql,
      name: product.title,
      price:
        product.prix_en_promo !== null
          ? Number(product.prix_en_promo)
          : Number(product.prix_vente_groupe),
      image: `data:image/jpeg;base64,${product.photo1_base64}`,
      volume: product.arcleunik,
      productCode: product.productCode,
      quantity: 1,
    });
  };

  // ✅ Prijzen correct formatteren
  const regularPrice = Number(product.prix_vente_groupe);
  const promoPrice = product.prix_en_promo !== null ? Number(product.prix_en_promo) : null;

  return (
    <div className="group relative flex flex-col bg-white rounded-lg border hover:shadow-lg transition-all duration-300">
      {/* 🖼 Product Afbeelding */}
      <Link href={`/product/${encodeURIComponent(product.id_product_mysql)}`} className="relative h-[200px] w-full overflow-hidden p-4">
        <Image
          src={`data:image/jpeg;base64,${product.photo1_base64}`}
          alt={product.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
      </Link>

      {/* ℹ️ Product Details */}
      <div className="flex flex-col p-4 pt-0">
        <Link href={`/product/${encodeURIComponent(product.id_product_mysql)}`}>
          <h3 className="font-medium text-[#002B7F] hover:underline min-h-[2.5rem] line-clamp-2">{product.title}</h3>
        </Link>

        {/* 💰 Prijs Weergave */}
        <div className="space-y-1">
          {regularPrice > 0 || promoPrice ? (
            promoPrice ? (
              <>
                {/* Oorspronkelijke prijs doorgestreept */}
                <div className="text-gray-500 line-through text-sm">
                  € {regularPrice.toFixed(2).replace(".", ",")}
                </div>
                {/* Promotieprijs in het rood */}
                <div className="text-[#E31931] text-2xl font-bold">
                  € {promoPrice.toFixed(2).replace(".", ",")}
                </div>
              </>
            ) : (
              // Alleen reguliere prijs tonen
              <div className="text-[#E31931] text-2xl font-bold">
                € {regularPrice.toFixed(2).replace(".", ",")}
              </div>
            )
          ) : (
            // Fallback voor ontbrekende prijzen
            <div className="text-gray-500 text-sm">Prijs niet beschikbaar</div>
          )}
        </div>

        {/* 🛒 Winkelwagenknop */}
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

export default ProductCard;
