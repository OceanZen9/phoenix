export interface Order {
  orderId: string
  createdAt: string
  updatedAt: string
  productId: string
  userId: string
  isPaid: boolean
  isDelivered: boolean
}

export interface OrdersResponse {
  orders: Order[]
}

export interface OrderResponse {
  order: Order
}

export interface PayOrderPayload {
  productId: string
}
