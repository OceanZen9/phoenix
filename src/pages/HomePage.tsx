/**
 * @description 商城主页，内容布局如下：
 * - 购物车 收藏夹 我的订单 登陆/注册 （靠右）
 * - 凤凰商标 搜索框 （居中）
 * - 首页 推荐榜单 商品分类栏（分类1，分类2，...）
 * - 商品展示
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Search, ShoppingCart, User, Feather } from "lucide-react";

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 第一行：购物车 收藏夹 我的订单 登陆/注册 */}
      <header className="container mx-auto flex items-center justify-end py-1 px-1 border-b">
        <div className="flex items-center gap-5">
          <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
            <ShoppingCart className="h-3 w-3" />
            <span className="sr-only">购物车</span>
          </Button>
          <Button variant="ghost" size="sm" className="px-2 h-7 text-xs">
            登录/注册
          </Button>
        </div>
      </header>
      {/* 第二行：凤凰商标 搜索框*/}
      <header className="container mx-auto flex items-center justify-center py-4 px-4 gap-20">
        <div className="flex items-center gap-2">
          <Feather className="h-6 w-6" />
          <span className="text-lg font-semibold">凤凰商城</span>
        </div>
        <div className="relative flex-1 max-w-md mx-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索商品..."
            className="pl-8 w-full"
          />
        </div>
      </header>
      {/* 第三行：首页 推荐榜单 商品分类栏*/}
      {/* 第四行：商品展示*/}
    </div>
  );
}

export default HomePage;
