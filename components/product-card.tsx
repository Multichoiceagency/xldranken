'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CartPopup } from "@/components/cart-popup";
import { useCart } from "@/lib/cart-context";
import productsData from "@/data/product.json";

function ProductCard() {
  const product = productsData;
  const [showCartPopup, setShowCartPopup] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id_product_mysql,
      name: product.title,
      price: parseFloat(product.prix_vente_groupe),
      image: `data:image/jpeg;base64,${product.photo1_base64}`,
      volume: product.arcleunik,
      quantity: 1,
    });
    setShowCartPopup(true);
  };

  return (
    <>
      <div className="group relative flex flex-col bg-card p-4 rounded-lg border">
        <button
          className="absolute right-2 top-2 z-10 rounded-full p-2 hover:bg-accent"
          aria-label="Add to wishlist"
        >
          <Heart className="h-5 w-5" />
        </button>
        <Link href={`/product/${product.productCode}`} className="relative h-[300px] w-full overflow-hidden rounded-lg">
          <Image
            src={`data:image/jpeg;base64,${product.photo1_base64}`}
            alt={product.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            priority
          />
        </Link>
        <div className="mt-4 flex flex-col flex-grow">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              €{parseFloat(product.prix_vente_groupe).toFixed(2).replace('.', ',')}
            </span>
            {product.prix_en_promo > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                €{product.prix_en_promo.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          <Link href={`/product/${product.productCode}`} className="block mt-2">
            <h3 className="font-medium hover:text-primary transition-colors">{product.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{product.arcleunik}</p>
          <div className="mt-auto pt-4">
            <Button
              className="w-full bg-[#FF6B35] hover:bg-[#E85A24] text-white"
              onClick={handleAddToCart}
            >
              <span className="mr-2">Add to Cart</span>
              <ShoppingCart 
                className={cn(
                  "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                  "group-hover:animate-bounce"
                )} 
              />
            </Button>
          </div>
        </div>
      </div>

      <CartPopup
        open={showCartPopup}
        onClose={() => setShowCartPopup(false)}
        product={{
          id: product.id_product_mysql,
          name: product.title,
          image: `data:image/jpeg;base64,${product.photo1_base64}`,
          price: parseFloat(product.prix_vente_groupe),
          volume: product.arcleunik,
        }}
        quantity={1}
      />
    </>
  );
}

export default ProductCard;
