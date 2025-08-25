import React, { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { MdHome, MdSettings, MdMenu, MdClose, MdDashboard } from "react-icons/md";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: MdDashboard,
      current: location.pathname === "/admin"
    },
    {
      name: "Configuración Home",
      href: "/admin/home-config",
      icon: MdHome,
      current: location.pathname === "/admin/home-config"
    },
    {
      name: "Configuración del Sitio",
      href: "/admin/site-content",
      icon: MdSettings,
      current: location.pathname === "/admin/site-content"
    },
    {
      name: "Configuraciones",
      href: "/admin/settings",
      icon: MdSettings,
      current: location.pathname === "/admin/settings"
    }
  ];

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar móvil */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          sidebarOpen
            ? "bg-black bg-opacity-50"
            : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header del sidebar móvil */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Panel Admin</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <MdClose className="size-5" />
            </button>
          </div>
          
          {/* Navegación móvil */}
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`${
                    item.current
                      ? "bg-blue-100 text-blue-900 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <item.icon
                    className={`${
                      item.current ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 size-5 transition-colors`}
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Sidebar desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            {/* Header del sidebar */}
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-6">
                <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
              </div>
              
              {/* Navegación */}
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      item.current
                        ? "bg-blue-100 text-blue-900 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                  >
                    <item.icon
                      className={`${
                        item.current ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                      } mr-3 size-5 transition-colors`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header móvil */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between bg-white px-4 py-2 border-b border-gray-200">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
            >
              <MdMenu className="size-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Panel Admin</h1>
            <div className="w-10"></div> {/* Spacer para centrar el título */}
          </div>
        </div>

        {/* Área de contenido */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
