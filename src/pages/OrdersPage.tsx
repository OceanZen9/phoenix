import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getOrders, payOrder } from "@/services/order"
import { getProductById, getProductMainImage } from "@/services/product"
import type { Order } from "@/types/order"
import type { Product } from "@/types/product"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toast } from "@/components/ui/toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Package, CreditCard, Truck, CheckCircle2 } from "lucide-react"

interface OrderWithProduct extends Order {
  product?: Product
  productImage?: string
}

function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithProduct | null>(null)
  const [showPayDialog, setShowPayDialog] = useState(false)
  const [paying, setPaying] = useState(false)
  const [filterTab, setFilterTab] = useState<"all" | "unpaid" | "paid">("all")

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const ordersData = await getOrders()

      const ordersWithProducts = await Promise.all(
        ordersData.map(async (order) => {
          try {
            const product = await getProductById(order.productId)
            const productImage = await getProductMainImage(order.productId)
            return { ...order, product, productImage: productImage || undefined }
          } catch (error) {
            console.error(`加载商品 ${order.productId} 失败:`, error)
            return order
          }
        })
      )

      setOrders(ordersWithProducts)
    } catch (error) {
      console.error('加载订单失败:', error)
      setToastMessage("加载订单失败")
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }

  const handlePayOrder = async () => {
    if (!selectedOrder) return

    try {
      setPaying(true)
      await payOrder({ productId: selectedOrder.productId })
      setToastMessage("支付成功")
      setShowToast(true)
      setShowPayDialog(false)
      await loadOrders()
    } catch (error) {
      console.error('支付失败:', error)
      setToastMessage("支付失败，请重试")
      setShowToast(true)
    } finally {
      setPaying(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filterTab === "unpaid") return !order.isPaid
    if (filterTab === "paid") return order.isPaid
    return true
  })

  const getOrderStatus = (order: Order) => {
    if (!order.isPaid) return { text: "待支付", color: "text-orange-600", icon: CreditCard }
    if (!order.isDelivered) return { text: "待发货", color: "text-blue-600", icon: Package }
    return { text: "已发货", color: "text-green-600", icon: Truck }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回首页
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">我的订单</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as typeof filterTab)} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">全部订单</TabsTrigger>
            <TabsTrigger value="unpaid">待支付</TabsTrigger>
            <TabsTrigger value="paid">已支付</TabsTrigger>
          </TabsList>

          <TabsContent value={filterTab} className="mt-6">
            {loading ? (
              <div className="grid gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-1/4" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-24 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Package className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">暂无订单</p>
                  <Button asChild className="mt-4">
                    <Link to="/">去购物</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((order) => {
                  const status = getOrderStatus(order)
                  const StatusIcon = status.icon

                  return (
                    <Card key={order.orderId} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                              订单号: {order.orderId}
                            </CardTitle>
                          </div>
                          <div className={`flex items-center gap-1 ${status.color}`}>
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">{status.text}</span>
                          </div>
                        </div>
                        <CardDescription className="text-xs">
                          创建时间: {new Date(order.createdAt).toLocaleString('zh-CN')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {order.product ? (
                          <div className="flex gap-4">
                            <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                              {order.productImage ? (
                                <img
                                  src={order.productImage}
                                  alt={order.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                                  <span className="text-2xl">📦</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{order.product.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {order.product.description}
                              </p>
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-lg font-bold text-red-600">
                                  ¥{(order.product.price || 0).toFixed(2)}
                                </span>
                                {!order.isPaid && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedOrder(order)
                                      setShowPayDialog(true)
                                    }}
                                  >
                                    <CreditCard className="h-4 w-4 mr-1" />
                                    立即支付
                                  </Button>
                                )}
                                {order.isPaid && order.isDelivered && (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-sm">订单完成</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            商品信息加载失败
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <AlertDialog open={showPayDialog} onOpenChange={setShowPayDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认支付</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                {selectedOrder?.product && (
                  <div className="mt-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                        {selectedOrder.productImage ? (
                          <img
                            src={selectedOrder.productImage}
                            alt={selectedOrder.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xl">📦</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{selectedOrder.product.name}</div>
                        <div className="text-2xl font-bold text-red-600 mt-1">
                          ¥{(selectedOrder.product.price || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={paying}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handlePayOrder} disabled={paying}>
              {paying ? "支付中..." : "确认支付"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}

export default OrdersPage
