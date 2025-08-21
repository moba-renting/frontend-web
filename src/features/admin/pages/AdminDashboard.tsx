import React from "react";
import { Link } from "react-router-dom";
import { MdHome, MdSettings, MdTrendingUp, MdPeople } from "react-icons/md";
import { UseSupabaseAuth } from "../../../core/services/UseSupabaseAuth";

const AdminDashboard: React.FC = () => {
  const { profile } = UseSupabaseAuth();

  const quickActions = [
    {
      name: "Configurar Home Page",
      description: "Editar banners, FAQs y contenido de la página principal",
      href: "/admin/home-config",
      icon: MdHome,
      color: "bg-blue-500"
    },
    {
      name: "Configuraciones",
      description: "Gestionar configuraciones generales del sistema",
      href: "/admin/settings",
      icon: MdSettings,
      color: "bg-green-500"
    }
  ];

  const stats = [
    {
      name: "Usuarios Totales",
      stat: "0",
      icon: MdPeople,
      color: "bg-indigo-500"
    },
    {
      name: "Vehículos Activos",
      stat: "0",
      icon: MdTrendingUp,
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard de Administración</h1>
        <p className="mt-1 text-sm text-gray-600">
          Bienvenido de vuelta, {profile?.full_name || "Administrador"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
            <dt>
              <div className={`absolute ${item.color} rounded-md p-3`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
            </dd>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span className={`${action.color} rounded-lg inline-flex p-3 text-white`}>
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {action.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{action.description}</p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400 transition-colors"
                aria-hidden="true"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586l-4.293 4.293z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Actividad Reciente</h3>
          <div className="mt-5">
            <div className="text-center py-8">
              <p className="text-gray-500">No hay actividad reciente para mostrar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
