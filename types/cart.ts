export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  volume?: string
  fam2id?: string
  category?: string
  matchType?: "exact" | "partial" | "fallback" | "existing"
}

export interface OrderData {
  orderNumber: string
  customerName: string
  customerEmail: string
  deliveryAddress?: string
  deliveryDate: string
  deliveryOption: "delivery" | "pickup"
  deliveryInstructions?: string
  items: CartItem[]
  totalAmount: number
  createdAt: Date
}
