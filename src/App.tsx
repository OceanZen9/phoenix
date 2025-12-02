import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ShoppingCartPage from "@/pages/ShoppingCartPage";
import MerchantPage from "@/pages/MerchantPage";
import AuthPage from "@/pages/AuthPage";
import UserPage from "@/pages/UserPage";
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
        path="/cart"
        element={
          <ProtectedRoute>
            <ShoppingCartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant"
        element={
          <ProtectedRoute>
            <MerchantPage />
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
