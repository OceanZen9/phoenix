import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getOrders, payOrder, updateOrderAddress } from "@/services/order"
import { getProductById, getProductMainImage } from "@/services/product"
import { getAddressList } from "@/services/address"
import type { Order } from "@/types/order"
import type { Product } from "@/types/product"
import type { Address } from "@/types/address"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toast } from "@/components/ui/toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Package, CreditCard, Truck, CheckCircle2, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [updatingAddress, setUpdatingAddress] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const ordersData = await getOrders()
      console.log('[DEBUG] 获取到的订单数据:', ordersData)
      console.log('[DEBUG] 第一个订单:', ordersData[0])
      console.log('[DEBUG] 第一个订单的address字段:', ordersData[0]?.address)

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

      console.log('[DEBUG] 包含商品信息的订单:', ordersWithProducts)
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

  const handleSelectAddress = async (order: OrderWithProduct) => {
    try {
      const addressList = await getAddressList()
      setAddresses(addressList)
      setSelectedOrder(order)
      setSelectedAddress(null)
      setShowAddressDialog(true)
    } catch (error) {
      console.error('加载地址失败:', error)
      setToastMessage("加载地址失败")
      setShowToast(true)
    }
  }

  const handleUpdateOrderAddress = async () => {
    if (!selectedOrder || !selectedAddress) return

    try {
      setUpdatingAddress(true)
      console.log('[DEBUG] 准备更新订单地址')
      console.log('[DEBUG] 订单ID:', selectedOrder.orderId)
      console.log('[DEBUG] 地址ID:', selectedAddress.id)
      console.log('[DEBUG] 发送的payload:', { addressId: String(selectedAddress.id) })

      await updateOrderAddress(selectedOrder.orderId, {
        addressId: String(selectedAddress.id)
      })

      console.log('[DEBUG] 地址更新API调用成功')
      setToastMessage("地址已设置")
      setShowToast(true)
      setShowAddressDialog(false)

      console.log('[DEBUG] 准备重新加载订单列表')
      await loadOrders()
      console.log('[DEBUG] 订单列表重新加载完成')
    } catch (error) {
      console.error('[DEBUG] 设置地址失败:', error)
      setToastMessage("设置地址失败，请重试")
      setShowToast(true)
    } finally {
      setUpdatingAddress(false)
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

                  console.log('[DEBUG] 渲染订单:', order.orderId, '地址信息:', order.address)

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

                              {order.address && (
                                <div className="mt-2 p-2 bg-slate-50 rounded text-xs border">
                                  <div className="flex items-start gap-1">
                                    <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                                    <div className="flex-1">
                                      <div className="font-medium">
                                        {order.address.receiverName} {order.address.receiverPhone}
                                      </div>
                                      <div className="text-muted-foreground mt-0.5">
                                        {order.address.province} {order.address.city} {order.address.district} {order.address.detailAddress}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-3">
                                <span className="text-lg font-bold text-red-600">
                                  ¥{(order.product.price || 0).toFixed(2)}
                                </span>
                                {(() => {
                                  console.log('[DEBUG] 订单按钮判断 - orderId:', order.orderId)
                                  console.log('[DEBUG] isPaid:', order.isPaid, 'address:', order.address)
                                  console.log('[DEBUG] 条件1 (!order.isPaid && !order.address):', !order.isPaid && !order.address)
                                  console.log('[DEBUG] 条件2 (!order.isPaid && order.address):', !order.isPaid && order.address)
                                  return null
                                })()}
                                {!order.isPaid && !order.address && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSelectAddress(order)}
                                  >
                                    <MapPin className="h-4 w-4 mr-1" />
                                    选择地址
                                  </Button>
                                )}
                                {!order.isPaid && order.address && (
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

      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>选择收货地址</DialogTitle>
            <DialogDescription>
              请选择本订单的收货地址
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {addresses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>暂无收货地址</p>
                <Button asChild className="mt-4" variant="outline">
                  <Link to="/address">去添加地址</Link>
                </Button>
              </div>
            ) : (
              addresses.map((address) => (
                <Card
                  key={address.id}
                  className={`cursor-pointer transition-all ${
                    selectedAddress?.id === address.id
                      ? 'border-primary border-2 bg-primary/5'
                      : 'hover:border-muted-foreground'
                  }`}
                  onClick={() => setSelectedAddress(address)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{address.tag}</Badge>
                          {address.isDefault && <Badge>默认</Badge>}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">
                            {address.receiverName} {address.receiverPhone}
                          </div>
                          <div className="text-muted-foreground">
                            {address.province} {address.city} {address.district}
                          </div>
                          <div className="text-muted-foreground">
                            {address.detailAddress}
                          </div>
                        </div>
                      </div>
                      {selectedAddress?.id === address.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddressDialog(false)}
              disabled={updatingAddress}
            >
              取消
            </Button>
            <Button
              onClick={handleUpdateOrderAddress}
              disabled={!selectedAddress || updatingAddress}
            >
              {updatingAddress ? '设置中...' : '确认选择'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}

export default OrdersPage
