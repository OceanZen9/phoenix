import Navbar from "@/components/feature/ common/Navbar";
/**
 * @description 商家详细信息展示，内容布局如下：
 * - 商标/店名
 * - 商品展示
 */
function MerchantPage() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Navbar />
      </div>
    </header>
  );
}
export default MerchantPage;
