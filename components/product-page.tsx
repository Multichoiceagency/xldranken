"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { CartPopup } from "@/components/cart-popup";
import { useCart } from "@/lib/cart-context";
import type { ProductProps } from "@/types/product";
import { Spinner } from "@/components/Spinner";
import { FeaturedProducts } from "@/components/featured-products"; 
import { FeaturedProductsCarousel } from "./featured-products-carousel";

interface ProductPageProps {
  productId: string;
}

export function ProductPage({ productId }: ProductPageProps) {
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  // Product ophalen (met fallback naar nocategory)
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Geen product-ID opgegeven.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Probeer eerst met nocategory=true
        let res = await fetch(`/api/proxy?id=${productId}&nocategory=true`);
        if (!res.ok) {
          throw new Error(`API Error ${res.status}: ${res.statusText}`);
        }
        let data = await res.json();
        // Als er geen product is, probeer zonder nocategory
        if (!data?.product) {
          res = await fetch(`/api/proxy?id=${productId}`);
          if (!res.ok) {
            throw new Error(`API Error ${res.status}: ${res.statusText}`);
          }
          data = await res.json();
          if (!data?.product) {
            throw new Error("Geen productdata ontvangen");
          }
        }
        setProduct(data.product);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Loading & Error States
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <div className="text-center py-8 text-red-500">❌ {error}</div>;
  }
  if (!product) {
    return <div className="text-center py-8">Geen product gevonden.</div>;
  }

  // Afbeelding bepalen
  const imageSrc = product.photo1_base64?.startsWith("data:image")
    ? product.photo1_base64
    : product.photo1_base64
    ? `data:image/jpeg;base64,${product.photo1_base64}`
    : "/placeholder.jpg";

  // Prijs en eventuele korting
  const prixVente = Number(product.prix_vente_groupe || 0);
  const prixPromo = product.prix_en_promo ? Number(product.prix_en_promo) : null;
  const currentPrice = prixPromo ?? prixVente;
  const discountPercentage = prixPromo
    ? Math.round(((prixVente - prixPromo) / prixVente) * 100)
    : 0;

  // Toevoegen aan winkelmand
  const handleAddToCart = () => {
    addToCart({
      id: product.id_product_mysql,
      name: product.title,
      price: currentPrice,
      image: imageSrc,
      volume: product.arcleunik,
      productCode: product.productCode,
      quantity,
    });
    setShowCartPopup(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm mb-4">
        <button
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-[#FF6B35]"
        >
          ⬅ Terug
        </button>
      </div>

      {/* PRODUCT DETAIL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Linkerkolom: Hoofdafbeelding */}
        <div>
          <div className="w-full aspect-square mb-4">
            <Image
              src={imageSrc}
              alt={product.title}
              width={800}
              height={800}
              className="w-full h-full object-contain rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Rechterkolom: Productdetails (sticky) */}
        <div className="flex flex-col justify-between lg:sticky lg:top-20">
          {/* Titel & Prijs */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="mb-6">
              {discountPercentage > 0 && (
                <div className="mb-2">
                  <span className="bg-red-600 text-white text-sm font-medium px-2 py-1 rounded">
                    -{discountPercentage}%
                  </span>
                  <span className="ml-2 text-gray-500 line-through">
                    €{prixVente.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              )}
              <div className="text-4xl font-bold text-[#FF6B35]">
                €{currentPrice.toFixed(2).replace(".", ",")}
              </div>
            </div>

            {/* Beschrijving */}
            <p className="text-lg text-gray-700 mb-6">
              {product.title || "Geen beschrijving beschikbaar."}
            </p>

            {/* Accordion met details en verzending */}
            <Accordion type="single" collapsible className="w-full mb-6">
              <AccordionItem value="details">
                <AccordionTrigger>Productdetails</AccordionTrigger>
                <AccordionContent>
                  <p>
                    <strong>Productcode:</strong> {product.productCode}
                  </p>
                  <p>
                    <strong>Volume:</strong> {product.arcleunik}
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Verzending & Retouren</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Beste klant,Bedankt voor uw interesse in onze producten! ...
                  </p>
                  <p className="font-bold 3-xl">
                    Retourneren binnen 30 dagen mogelijk.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Aantal + Add to Cart */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))
                  }
                  className="h-10 w-16 text-center"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus />
                </Button>
              </div>
              <Button
                className="bg-[#FF6B35] hover:bg-[#E85A24] text-white text-lg py-3 px-6 rounded-lg"
                onClick={handleAddToCart}
              >
                In winkelmand
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Cart Popup (indien je deze gebruikt) */}
      {showCartPopup && (
        <CartPopup
          onClose={() => setShowCartPopup(false)}
          open={false}
          product={{
            id: "",
            name: "",
            image: "",
            price: 0,
            volume: "",
          }}
          quantity={0}
        />
      )}
    </div>
  );
}
