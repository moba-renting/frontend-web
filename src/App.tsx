import { Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "./shared/components/ScrollToTop";
import ToasterProvider from "./shared/components/ToasterProvider";
import Header from "./shared/pages/Header";
import Footer from "./shared/pages/Footer"; 
import Register from "./features/security/pages/Register";
import Login from "./features/security/pages/Login";
import ForgotPassword from "./features/security/pages/ForgotPassword";
import ResetPassword from "./features/security/pages/ResetPassword";
import HomePage from "./features/home/pages/HomePage";
import VehiclesListPage from "./features/vehicles/pages/VehiclesListPage";
import VehicleDetailPage from "./features/vehicles/pages/VehicleDetailPage";
import VehicleComparePage from "./features/vehicles/pages/VehicleComparePage";
import AdminLayout from "./features/admin/layout/AdminLayout";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import AdminHomePage from "./features/admin/pages/AdminHomePage";
import AdminSettings from "./features/admin/pages/AdminSettings";
import ProtectedRoute from "./features/admin/components/ProtectedRoute";
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
    <>
      <div className="min-h-screen w-full flex flex-col">
        <ScrollToTop />
        <Routes>
          {/* Rutas de administración */}
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="home-config" element={<AdminHomePage />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Rutas públicas */}
          <Route path="/*" element={
            <>
              <Header />
              <div className="flex-1 flex flex-col">
                <Routes>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/vehicles" element={<VehiclesListPage />} />
                  <Route path="/vehicles/compare" element={<VehicleComparePage />} />
                  <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </div>
              <Footer />
            </>
          } />
        </Routes>
      </div>
      <ToasterProvider />
    </>
  );
}
