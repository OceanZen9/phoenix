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
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <a href="/" className="hidden items-center space-x-2 md:flex">
            <Logo />
          </a>
          <NavigationMenuDemo />
        </div>

        <div className="flex items-center">
          <Button>登录</Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
