import apiClient from "./apiClient"
import type { Order, OrdersResponse, OrderResponse, PayOrderPayload, UpdateOrderAddressPayload } from "@/types/order"

export async function getOrders(): Promise<Order[]> {
  const response = await apiClient.get<OrdersResponse>("/api/v1/orders")
  console.log('[DEBUG - getOrders] API原始响应:', response)
  console.log('[DEBUG - getOrders] response.data:', response.data)
  console.log('[DEBUG - getOrders] response.data.orders:', response.data.orders)
  if (response.data.orders && response.data.orders.length > 0) {
    console.log('[DEBUG - getOrders] 第一个订单完整数据:', JSON.stringify(response.data.orders[0], null, 2))
  }
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

export async function updateOrderAddress(orderId: string, payload: UpdateOrderAddressPayload): Promise<void> {
  console.log('[DEBUG - updateOrderAddress] 请求参数 - orderId:', orderId, 'payload:', payload)
  const response = await apiClient.put(`/api/v1/orders/${orderId}/address`, payload)
  console.log('[DEBUG - updateOrderAddress] API响应:', response)
  console.log('[DEBUG - updateOrderAddress] response.data:', response.data)
}
