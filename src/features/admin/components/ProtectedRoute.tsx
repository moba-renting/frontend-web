import React from "react";
import { Navigate } from "react-router-dom";
import { UseSupabaseAuth } from "../../../core/services/UseSupabaseAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = "admin" 
}) => {
  const { session, profile, initializing } = UseSupabaseAuth();

  // Mostrar loading mientras se inicializa
  if (initializing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Verificando permisos...</div>
      </div>
    );
  }

  // Redirigir al login si no hay sesión
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir al home si no tiene el rol requerido
  if (!profile?.roles.includes(requiredRole)) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
