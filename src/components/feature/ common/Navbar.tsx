import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { NavigationMenuDemo } from "./Navigation-Manu";

function Navbar() {
  return (
    /**
     * @discription 导航栏，包含以下内容：
     * - 左侧：商城logo
     * - 中间：导航菜单
     * - 右侧：登录按钮
     */
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center gap-6">
        <Logo />
        <NavigationMenuDemo />
      </div>
      <Button>登录</Button>
    </nav>
  );
}

export default Navbar;
