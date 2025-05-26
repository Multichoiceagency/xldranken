export interface OrderProduct {
  id: string
  name: string
  quantity: number
  price: string
  image: string
}

export interface Order {
  id: string
  date: string
  status: string
  total: string
  products: OrderProduct[]
}
