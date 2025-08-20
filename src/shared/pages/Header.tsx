import React, { useState } from "react";
import { signOut } from "../../core/services/supabase";
import { MdMenu, MdLogout, MdClose, MdOutlinePerson, MdLogin, MdDirectionsCar } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { UseSupabaseAuth } from "../../core/services/UseSupabaseAuth";

const Header: React.FC = () => {
  const { session, profile } = UseSupabaseAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 h-16">
        <div className="w-full h-full flex items-stretch justify-between">
          {/* Botón menú móvil */}
          <div className="md:hidden h-full flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="h-full flex items-center rounded-full text-gray-700 hover:bg-gray-100 transition"
              aria-label="Abrir menú"
              type="button"
            >
              <MdMenu className="size-6" />
            </button>
          </div>
          {/* Logo */}
          <div className="flex-1 flex justify-center md:justify-start h-full items-center">
            <a
              href="/home"
              className="font-black text-3xl tracking-widest text-gray-900 hover:text-green-600 transition-all select-none h-full flex items-center gap-2"
              aria-label="Inicio MOBA"
            >
              <MdDirectionsCar className="text-4xl" /> MOBA
            </a>
          </div>
          {/* Iconos de usuario y acciones + login/register */}
          <nav className="flex items-center gap-2 sm:gap-4 h-full" aria-label="Usuario">
            {session ? (
              <>
                <div className="flex items-center gap-2">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-400" />
                  )}
                  <span className="font-semibold text-gray-700 text-sm truncate max-w-[120px]">
                    {profile?.full_name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full hover:bg-gray-100 transition h-full flex items-center"
                  aria-label="Cerrar sesión"
                  type="button"
                >
                  <MdLogout className="size-6 text-gray-700" />
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="flex items-center gap-1 rounded-full hover:bg-gray-100 transition h-full flex items-center"
                  aria-label="Iniciar sesión"
                >
                  <MdOutlinePerson className="size-6 text-gray-700" />
                  <span className="font-semibold text-gray-700">Iniciar sesión</span>
                </a>
                <a
                  href="/register"
                  className="flex items-center gap-1 rounded-full hover:bg-gray-100 transition h-full flex items-center"
                  aria-label="Registrarse"
                >
                  <MdLogin className="size-6 text-gray-700" />
                  <span className="font-semibold text-gray-700">Registrarse</span>
                </a>
              </>
            )}
          </nav>
        </div>
      </header>
      {/* Sidebar móvil */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isSidebarOpen
            ? "bg-black bg-opacity-50"
            : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center border-b h-16">
            <h2 className="font-bold text-lg">Menú</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100 flex items-center"
              type="button"
              aria-label="Cerrar menú"
            >
              <MdClose className="size-6" />
            </button>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200">
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;