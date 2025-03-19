"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import type { ProductProps } from "@/types/product";
import { useCart } from "@/lib/cart-context";

interface CategoryShopProps {
  // Gebruik het type van de product-ID (dat is een string)
  categoryId: ProductProps["id_product_mysql"];
}

export default function CategoryShop({ categoryId }: CategoryShopProps) {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Producten in Categorie {categoryId}</h1>
      {products.length === 0 ? (
        <div>Geen producten gevonden.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => {
            // Controleer of de base64-string al de juiste prefix bevat
            const imageSrc = product.photo1_base64?.startsWith("data:image")
              ? product.photo1_base64
              : `data:image/jpeg;base64,${product.photo1_base64}`;
            const regularPrice = Number(product.prix_vente_groupe);
            const promoPrice = product.prix_en_promo ? Number(product.prix_en_promo) : null;
            return (
              <div
                key={product.id_product_mysql}
                className="border p-4 rounded hover:shadow-lg transition-shadow duration-300"
              >
                <Link href={`/product/${product.id_product_mysql}`}>
                  <div className="relative h-48 w-full mb-4">
                    <Image
                      src={imageSrc}
                      alt={product.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-xl font-bold">{product.title}</h2>
                  <p className="mt-2">
                    {promoPrice ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">
                          €{regularPrice.toFixed(2)}
                        </span>
                        <span className="text-red-500 font-bold">
                          €{promoPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <>€{regularPrice.toFixed(2)}</>
                    )}
                  </p>
                </Link>
                <Button
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() =>
                    addToCart({
                      id: product.id_product_mysql,
                      name: product.title,
                      price: promoPrice ?? regularPrice,
                      image: imageSrc,
                      volume: product.arcleunik,
                      productCode: product.productCode,
                      quantity: 1,
                    })
                  }
                >
                  Add to Cart
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
