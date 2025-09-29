import Logo from "./L1Logo";
import SearchBar  from "./L1SearchBar";
import { NavigationMenuDemo } from "./L1NavMenu";

function Navbar() {
  return (
    /**
     * @discription 导航栏，包含以下内容：
     * - 左侧：商城logo
     * - 中间：导航菜单
     * - 右侧：搜索框
     */
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center gap-6">
        <Logo />
        <NavigationMenuDemo />
      </div>
      <SearchBar/>
    </nav>
  );
}

export default Navbar;
