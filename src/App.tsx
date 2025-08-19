import { Navigate, Route, Routes } from "react-router-dom";
import { useSupabaseAuth } from "./core/services/useSupabaseAuth";
import Header from "./shared/components/Header";
import Footer from "./shared/components/Footer";
import Register from "./features/security/Register";
import Login from "./features/security/Login";
import ForgotPassword from "./features/security/ForgotPassword";
import ResetPassword from "./features/security/ResetPassword";
import HomePage from "./features/home/pages/HomePage";

export default function App() {
  const { loading } = useSupabaseAuth();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Cargando...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
