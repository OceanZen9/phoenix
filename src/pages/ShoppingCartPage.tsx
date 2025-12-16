import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { getCart, updateCartItemQuantity, removeFromCart, clearCart } from '@/services/cart';
import type { CartItem } from '@/types/cart';
import { Link } from 'react-router-dom';

function ShoppingCartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const updatedCart = updateCartItemQuantity(productId, newQuantity);
    setCart(updatedCart);
  };

  const handleRemove = (productId: string) => {
    const updatedCart = removeFromCart(productId);
    setCart(updatedCart);
  };

  const handleClearCart = () => {
    clearCart();
    setCart([]);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.product.product_price * item.quantity, 0);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-8 w-8" />
            购物车
          </h1>
          {cart.length > 0 && (
            <Button variant="outline" onClick={handleClearCart}>
              清空购物车
            </Button>
          )}
        </div>

        {cart.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-4">购物车是空的</p>
              <Button asChild>
                <Link to="/">去逛逛</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {cart.map((item) => (
                <Card key={item.product.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                            <span className="text-2xl text-slate-400">📦</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{item.product.product_name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.product.product_desc}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xl font-bold text-red-600">
                            ¥{item.product.product_price.toFixed(2)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value) || 1)}
                              className="w-16 h-8 text-center"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 ml-2 text-red-600 hover:text-red-700"
                              onClick={() => handleRemove(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>订单摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">商品数量</span>
                  <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} 件</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>总计</span>
                  <span className="text-red-600">¥{totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg">
                  去结算
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingCartPage;
