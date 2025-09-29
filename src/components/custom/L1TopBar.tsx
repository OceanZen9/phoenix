import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";

function Topbar() {
  return (
    <header className="container mx-auto flex items-center justify-end py-1 px-1 border-b">
      <div className="flex items-center gap-5">
        <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
          <ShoppingCart className="h-3 w-3" />
          <span className="sr-only">购物车</span>
        </Button>
        <Button variant="ghost" size="sm" className="px-2 h-7 text-xs">
          <Star className="h-3 w-3" />
          <span className="sr-only">收藏夹</span>
        </Button>
        <Button variant="ghost" size="sm" className="px-2 h-7 text-xs">
          登录/注册
        </Button>
      </div>
    </header>
  );
}

export default Topbar;