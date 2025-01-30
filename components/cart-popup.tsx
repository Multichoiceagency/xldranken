'use client'

import { createPortal } from 'react-dom'
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import Link from 'next/link'

interface CartPopupProps {
  open: boolean
  onClose: () => void
  product: {
    id: string
    name: string
    image: string
    price: number
    volume: string
  }
  quantity: number
}

export function CartPopup({ open, onClose, product, quantity }: CartPopupProps) {
  const { cart, updateQuantity, getCartTotal } = useCart()
  
  if (!open) return null

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const cartItem = cart.find(item => item.id === product.id)
  const itemQuantity = cartItem ? cartItem.quantity : quantity
  const { totalItems, totalPrice } = getCartTotal()

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity)
  }

  const popupContent = (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999]" onClick={handleOutsideClick}>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card rounded-lg shadow-lg border">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-primary">
            TOEGEVOEGD AAN WINKELWAGEN
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        <div className="p-4">
          <div className="flex gap-4 mb-4">
            <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
            <div className="flex-1">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.volume}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => handleQuantityChange(itemQuantity - 1)}>−</Button>
                <span className="w-12 text-center">{itemQuantity}</span>
                <Button variant="outline" size="sm" onClick={() => handleQuantityChange(itemQuantity + 1)}>+</Button>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">€ {(product.price * itemQuantity).toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">€ {product.price.toFixed(2)} Per fles</div>
            </div>
          </div>

          <div className="text-sm border-t pt-4 mb-4">
            Totaal in je winkelwagen: {totalItems} producten € {totalPrice.toFixed(2)}
          </div>

          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <Link href="/cart" passHref>
              <Button className="w-full bg-[#FF6B35] hover:bg-[#E85A24] text-white">
                BESTELLEN
              </Button>
            </Link>
            <Button onClick={onClose} variant="outline">
              VERDER WINKELEN
            </Button>
          </div>

          <div className="pt-4">
            <h3 className="font-bold mb-4">ANDEREN KOCHTEN OOK</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg" 
                    alt="BREWDOG PUNK IPA ALCOHOLVRIJ" 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="font-medium">BREWDOG PUNK IPA ALCOHOLVRIJ</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground line-through">€ 1.99</span>
                      <span className="text-primary font-bold">€ 1.49</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="bg-[#FF6B35] hover:bg-[#E85A24] text-white">
                  VOEG TOE
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg" 
                    alt="CHOUFFE 0.4" 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="font-medium">CHOUFFE 0.4</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground line-through">€ 1.89</span>
                      <span className="text-primary font-bold">€ 1.42</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="bg-[#FF6B35] hover:bg-[#E85A24] text-white">
                  VOEG OOK TOE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(popupContent, document.body)
}

