/**
 * @description 商城主页，内容布局如下：
 * - 购物车 收藏夹 我的订单 登陆/注册 （靠右）
 * - 凤凰商标 搜索框 （居中）
 * - 首页 推荐榜单 商品分类栏（分类1，分类2，...）
 * - 商品展示
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Toast } from "@/components/ui/toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, useIsAuthenticated } from "@/stores/authStore";
import { Search, ShoppingCart, Star, Home, TrendingUp, Heart, Package } from "lucide-react";
import { LoginMascot } from "@/components/LoginMascot";
import { useState, useEffect } from "react";
import { getProductList, getCategories, getProductMainImage } from "@/services/product";
import { addToCart, addToFavorites, removeFromFavorites, isFavorite } from "@/services/cart";
import type { Product, Category } from "@/types/product";

function HomePage() {
  const isAuthenticated = useIsAuthenticated();
  const { user, logout } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [productImages, setProductImages] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProductList(),
          getCategories()
        ]);

        setProducts(productsData);
        setCategories(categoriesData);

        console.log('商品数据示例:', productsData.slice(0, 2));
        console.log('分类数据:', categoriesData);
        console.log('商品分类字段示例:', productsData.slice(0, 5).map(p => ({ id: p.productId, category: p.category, categoryType: typeof p.category })));

        const favIds = new Set(productsData.filter(p => isFavorite(p.productId)).map(p => p.productId));
        setFavoriteIds(favIds);

        const imageMap = new Map<string, string>();
        for (const product of productsData) {
          const mainImage = await getProductMainImage(product.productId);
          if (mainImage) {
            imageMap.set(product.productId, mainImage);
          }
        }
        setProductImages(imageMap);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setToastMessage("已加入购物车");
    setShowToast(true);
  };

  const handleToggleFavorite = (product: Product) => {
    if (favoriteIds.has(product.productId)) {
      removeFromFavorites(product.productId);
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.productId);
        return newSet;
      });
    } else {
      addToFavorites(product);
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.add(product.productId);
        return newSet;
      });
      setToastMessage("已加入收藏夹");
      setShowToast(true);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory ||
      parseInt(product.category) === selectedCategory ||
      product.category === String(selectedCategory);
    const matchesSearch = !searchKeyword ||
      product.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchKeyword.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Header and Nav sections remain the same... */}
        <header className="container mx-auto flex items-center justify-end py-1 px-1 border-b">
        <div className="flex items-center gap-5">
          <Button variant="ghost" size="sm" className="p-1 h-7 w-7" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-3 w-3" />
              <span className="sr-only">购物车</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="px-2 h-7 text-xs" asChild>
            <Link to="/favorites">
              <Star className="h-3 w-3" />
              <span className="sr-only">收藏夹</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="px-2 h-7 text-xs" asChild>
            <Link to="/orders">
              <Package className="h-3 w-3 mr-1" />
              我的订单
            </Link>
          </Button>
          {isAuthenticated && user ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link to="/user">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || ''} alt={user.username || 'User'} />
                    <AvatarFallback>{(user.username || user.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-56" align="end">
                 <div className="flex flex-col space-y-1 mb-2">
                    <p className="text-sm font-medium leading-none">{user.username || '用户'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                <div className="border-b -mx-2 my-2" />
                <Link to="/user" className="block w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent">
                  个人空间
                </Link>
                <Link to="/setting" className="block w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent">
                  设置
                </Link>
                <div className="border-b -mx-2 my-2" />
                <button
                  onClick={() => logout()}
                  className="block w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent"
                >
                  退出登录
                </button>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <Button asChild variant="ghost" size="sm" className="px-2 h-7 text-xs">
              <Link to="/auth">登录/注册</Link>
            </Button>
          )}
        </div>
      </header>
      {/* 第二行：凤凰商标 搜索框*/}
      <header className="container mx-auto flex items-center justify-center py-4 px-4 gap-18">
        <div className="flex items-center gap-4">
          <LoginMascot focusedField={null} size={48} className="mb-0" />
          <span className="text-lg">凤凰商城</span>
        </div>
        <div className="relative flex-1 max-w-md mx-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索商品..."
            className="pl-8 w-full"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </header>

      <nav className="container mx-auto border-b">
        <div className="flex items-center gap-1 px-4 overflow-x-auto">
          <Button
            variant={selectedCategory === null ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Home className="h-4 w-4" />
            首页
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <TrendingUp className="h-4 w-4" />
            推荐榜单
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </nav>
        <main className="container mx-auto py-8 px-4 flex-1">
          {/* Main content grid remains the same... */}
          {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-muted" />
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">暂无商品</p>
            {searchKeyword && <p className="text-sm mt-2">尝试搜索其他关键词</p>}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.productId} className="group hover:shadow-lg transition-shadow flex flex-col h-full">
                <CardHeader className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                    {productImages.get(product.productId) ? (
                      <img
                        src={productImages.get(product.productId)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <span className="text-4xl text-slate-400">📦</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-3 flex-1 flex flex-col">
                  <CardTitle className="text-sm line-clamp-2 mb-1 min-h-[2.5rem]">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2 mb-2 min-h-[2rem]">
                    {product.description}
                  </CardDescription>
                  <div className="text-lg font-bold text-red-600 mt-auto">
                    ¥{(product.price || 0).toFixed(2)}
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex gap-2 mt-auto">
                  <Button
                    className="flex-1"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                    加入购物车
                  </Button>
                  <Button
                    variant={favoriteIds.has(product.productId) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleFavorite(product)}
                  >
                    <Heart className={`h-3.5 w-3.5 ${favoriteIds.has(product.productId) ? 'fill-current' : ''}`} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        </main>
      </div>

      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}

export default HomePage;
