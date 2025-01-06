'use client'

import { useState } from "react"
import Link from "next/link"
import { Heart, ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useWishlist } from '@/contexts/wishlist-context'
import { AddToCartAnimation } from "./add-to-cart-animation"
import { AddToWishlistAnimation } from "./add-to-wishlist-animation"
import { products } from "@/data/products"
import { useCart } from "./cart-context"

interface ProductCardProps {
  id: string;
}

export function ProductCard({ id }: ProductCardProps) {
  const product = products.find(p => p.id_product_mysql === id);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showWishlistAnimation, setShowWishlistAnimation] = useState(false);

  if (!product) return null;

  const price = parseFloat(product.prix_vente_groupe) || 0;
  const originalPrice = product.prix_en_promo === "1" ? (parseFloat(product.promoPrice) || 0) : undefined;
  const volume = `${product.qtyByBox} ${product.unite_full_name}`;

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',')
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.arcleunik,
      name: product.title,
      price,
      quantity: 1,
      image: product.photo1_base64,
    });
    setShowAnimation(true);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isInWishlist(product.arcleunik)) {
      addToWishlist({
        id: product.arcleunik,
        name: product.title,
        price,
        originalPrice,
        rating: parseFloat(product.rating || "0"),
        image: product.photo1_base64,
        country: product.country,
        countryFlag: product.countryFlag,
        volume,
      });
      setShowWishlistAnimation(true);
    } else {
      removeFromWishlist(product.arcleunik);
    }
  };

  return (
    <div className="group relative flex flex-col h-full">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white">
        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-2 top-2 z-10 rounded-full bg-white/80 hover:bg-white ${
            isInWishlist(product.arcleunik) ? 'text-red-500 hover:text-red-600' : ''
          }`}
          onClick={handleWishlistToggle}
        >
          <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isInWishlist(product.arcleunik) ? 'fill-current' : ''}`} />
        </Button>
        {product.prix_en_promo === "1" && (
          <div className="absolute left-2 top-2 z-10 bg-[#1a1a1a] text-white text-[10px] sm:text-xs px-2 py-1">
            AANBIEDING
          </div>
        )}
        <img 
          src={product.photo1_base64}
          alt={product.title}
          className="object-contain p-4 h-full w-full"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg?height=300&width=300';
          }}
        />
      </div>
      <div className="mt-2 space-y-1 sm:space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl font-bold text-orange-500">
            €{formatPrice(price)}
          </span>
          {originalPrice && originalPrice !== price && (
            <span className="text-xs sm:text-sm text-muted-foreground line-through">
              €{formatPrice(originalPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-lg">{product.countryFlag}</span>
          <span className="text-xs text-muted-foreground">{product.country}</span>
        </div>
        <Link href={`/product/${product.arcleunik}`}>
          <h3 className="text-sm sm:text-base font-medium line-clamp-2 hover:underline">
            {product.title}
          </h3>
        </Link>
        <p className="text-xs sm:text-sm text-muted-foreground">{volume}</p>
        <Button
          className="mt-2 w-full bg-orange-500 hover:bg-orange-600 font-medium text-xs sm:text-sm h-8 sm:h-10"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          In winkelwagen
        </Button>
      </div>
      <AddToCartAnimation
        isVisible={showAnimation}
        onAnimationComplete={() => setShowAnimation(false)}
        productName={product.title}
        productPrice={price}
        productImage={product.photo1_base64}
      />
      <AddToWishlistAnimation
        isVisible={showWishlistAnimation}
        onAnimationComplete={() => setShowWishlistAnimation(false)}
        productName={product.title}
      />
    </div>
  )
}

