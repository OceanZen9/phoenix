import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { getFavorites, removeFromFavorites } from '@/services/cart';
import { addToCart } from '@/services/cart';
import { getProductMainImage } from '@/services/product';
import type { FavoriteItem } from '@/types/cart';
import { Link } from 'react-router-dom';

function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [productImages, setProductImages] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const loadFavorites = async () => {
      const favoritesData = getFavorites();
      setFavorites(favoritesData);

      const imageMap = new Map<string, string>();
      for (const item of favoritesData) {
        const mainImage = await getProductMainImage(item.product.productId);
        if (mainImage) {
          imageMap.set(item.product.productId, mainImage);
        }
      }
      setProductImages(imageMap);
    };
    loadFavorites();
  }, []);

  const handleRemove = (productId: string) => {
    const updatedFavorites = removeFromFavorites(productId);
    setFavorites(updatedFavorites);
  };

  const handleAddToCart = (productId: string) => {
    const product = favorites.find(item => item.product.productId === productId)?.product;
    if (product) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8" />
            我的收藏
          </h1>
          {favorites.length > 0 && (
            <span className="text-muted-foreground">{favorites.length} 件商品</span>
          )}
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-4">还没有收藏的商品</p>
              <Button asChild>
                <Link to="/">去逛逛</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((item) => (
              <Card key={item.product.productId} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg overflow-hidden relative">
                    {productImages.get(item.product.productId) ? (
                      <img
                        src={productImages.get(item.product.productId)}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <span className="text-4xl text-slate-400">📦</span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600"
                      onClick={() => handleRemove(item.product.productId)}
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-base line-clamp-2 mb-2">
                    {item.product.name}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2 mb-3">
                    {item.product.description}
                  </CardDescription>
                  <div className="text-2xl font-bold text-red-600">
                    ¥{(item.product.price || 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    收藏于 {new Date(item.addedAt).toLocaleDateString()}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    className="flex-1"
                    size="sm"
                    onClick={() => handleAddToCart(item.product.productId)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    加入购物车
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemove(item.product.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
