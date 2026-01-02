import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ShoppingCartPage from "@/pages/ShoppingCartPage";
import FavoritesPage from "@/pages/FavoritesPage";
import AuthPage from "@/pages/AuthPage";
import UserPage from "@/pages/UserPage";
import SettingsPage from "@/pages/SettingsPage";
import OrdersPage from "@/pages/OrdersPage";
import { ProtectedRoute } from "@/components/feature/common/ProtectedRoute";
import { PublicRoute } from "@/components/feature/common/PublicRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />
      <Route
        path="/product/:productId"
        element={<ProductDetailPage />}
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <ShoppingCartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />
       <Route
        path="/setting"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />
    </Routes>
  );
}

export default App;
