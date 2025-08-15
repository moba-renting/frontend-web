import { Navigate, Route, Routes } from "react-router-dom";
import { useSupabaseAuth } from "./core/services/useSupabaseAuth";
import Header from "./shared/components/Header";
import Register from "./features/security/Register";
import Login from "./features/security/Login";
import ForgotPassword from "./features/security/ForgotPassword";
import ResetPassword from "./features/security/ResetPassword";

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
    <div className="min-h-screen flex flex-col px-2 md:px-8">
      <Header />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route
            path="/home"
            element={
              <h1 className="text-3xl font-bold underline">Hello world!</h1>
            }
          />
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
