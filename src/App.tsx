import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ShoppingCartPage from "@/pages/ShoppingCartPage";
import MerchantPage from "@/pages/MerchantPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cart" element={<ShoppingCartPage />} />
      <Route path="/merchant" element={<MerchantPage />} />
    </Routes>
  );
}

export default App;
