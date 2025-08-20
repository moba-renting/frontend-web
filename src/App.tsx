import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./shared/pages/Header";
import Register from "./features/security/pages/Register";
import Login from "./features/security/pages/Login";
import ForgotPassword from "./features/security/pages/ForgotPassword";
import ResetPassword from "./features/security/pages/ResetPassword";
import HomePage from "./features/home/pages/HomePage";
import VehiclesListPage from "./features/vehicles/pages/VehiclesListPage";
import { UseSupabaseAuth } from "./core/services/UseSupabaseAuth";

export default function App() {
  const { initializing } = UseSupabaseAuth();
  
  // Esperar a que termine la inicialización
  if (initializing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Inicializando...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col px-2 md:px-8">
      <Header />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/vehicles" element={<VehiclesListPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </div>
  );
}
