import apiClient from "./apiClient"
import type { Order, OrdersResponse, OrderResponse, PayOrderPayload } from "@/types/order"

export async function getOrders(): Promise<Order[]> {
  const response = await apiClient.get<OrdersResponse>("/api/v1/orders")
  return response.data.orders
}

export async function getOrderById(orderId: string): Promise<Order> {
  const response = await apiClient.get<OrderResponse>(`/api/v1/orders/${orderId}`)
  return response.data.order
}

export async function payOrder(payload: PayOrderPayload): Promise<OrdersResponse> {
  const response = await apiClient.post<OrdersResponse>("/api/v1/orders/pay", payload)
  return response.data
}
