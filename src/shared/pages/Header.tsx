import React, { useEffect, useRef, useState } from "react";
import { signOut } from "../../core/services/supabase";
import {
  MdMenu,
  MdLogout,
  MdClose,
  MdOutlinePerson,
  MdLogin,
  MdAdminPanelSettings,
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { UseSupabaseAuth } from "../../core/services/UseSupabaseAuth";
import logo from "../../assets/images/logo.png";

const Header: React.FC = () => {
  const { session, profile, isAdmin } = UseSupabaseAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userBtnRef = useRef<HTMLButtonElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  // Evitar scroll del body cuando hay overlays abiertos (sidebar o user menu)
  useEffect(() => {
    const anyOpen = isSidebarOpen || isUserMenuOpen;
    const prev = document.body.style.overflow;
    document.body.style.overflow = anyOpen ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isSidebarOpen, isUserMenuOpen]);

  // Cerrar user menu con Escape y click fuera
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsUserMenuOpen(false);
    }
    function onDocClick(e: MouseEvent) {
      if (!isUserMenuOpen) return;
      const t = e.target as Node;
      if (userMenuRef.current?.contains(t)) return;
      if (userBtnRef.current?.contains(t)) return;
      setIsUserMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDocClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDocClick);
    };
  }, [isUserMenuOpen]);

  // Focus trap simple dentro del menú
  const onUserMenuKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key !== "Tab" || !userMenuRef.current) return;
    const focusables = userMenuRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 h-16">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
          {/* Botón menú móvil (izquierda) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => {
                setIsSidebarOpen(true);
                setIsUserMenuOpen(false);
              }}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
              aria-label="Abrir menú de navegación"
              type="button"
            >
              <MdMenu className="size-6" />
            </button>
          </div>

          {/* Logo */}
          <a
            href="/home"
            className="font-black text-2xl tracking-widest text-gray-900 hover:text-green-600 transition-all select-none flex items-center gap-2"
            aria-label="Inicio MOBA"
          >
           <img src={logo} alt="Logo Moba"  className="h-10 w-auto object-contain"/>
          </a>

          {/* Usuario en móvil (derecha, solo icono) */}
          <div className="md:hidden flex items-center">
            <button
              id="user-menu-button"
              ref={userBtnRef}
              onClick={() => {
                setIsUserMenuOpen((v) => !v);
                setIsSidebarOpen(false);
              }}
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              type="button"
              aria-label={session ? "Abrir menú de usuario" : "Abrir opciones de inicio de sesión"}
            >
              {session ? (
                profile?.avatar_url || session.user.user_metadata?.avatar_url ? (
                  <img
                    src={profile?.avatar_url || session.user.user_metadata?.avatar_url}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <FaUserCircle className="w-7 h-7 text-gray-600" />
                )
              ) : (
                <MdOutlinePerson className="size-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Usuario en desktop (completo) */}
          <nav className="hidden md:flex items-center gap-4 h-full" aria-label="Usuario">
            {session ? (
              <>
                {isAdmin && (
                  <a
                    href="/admin"
                    className="rounded-full hover:bg-gray-100 transition h-full flex items-center px-2"
                    aria-label="Panel de administración"
                  >
                    <MdAdminPanelSettings className="size-6 text-gray-700" />
                  </a>
                )}
                <div className="flex items-center gap-2">
                  {profile?.avatar_url || session.user.user_metadata?.avatar_url ? (
                    <img
                      src={profile?.avatar_url || session.user.user_metadata?.avatar_url}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-400" />
                  )}
                  <span className="font-semibold text-gray-700 text-sm truncate max-w-[120px]">
                    {profile?.full_name || session.user.user_metadata?.full_name || session.user.email}
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
                  className="flex items-center gap-1 rounded-full hover:bg-gray-100 transition h-full px-2"
                  aria-label="Iniciar sesión"
                >
                  <MdOutlinePerson className="size-6 text-gray-700" />
                  <span className="font-semibold text-gray-700">Iniciar sesión</span>
                </a>
                <a
                  href="/register"
                  className="flex items-center gap-1 rounded-full hover:bg-gray-100 transition h-full px-2"
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

      {/* Overlay + submenu usuario móvil */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${
          isUserMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isUserMenuOpen}
      >
        {/* Fondo clickable para cerrar */}
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${
            isUserMenuOpen ? "bg-black/30 opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsUserMenuOpen(false)}
        />

        {/* Popover anclado al header (top-right) */}
        <div
          ref={userMenuRef}
          role="menu"
          aria-labelledby="user-menu-button"
          onKeyDown={onUserMenuKeyDown}
          className={`absolute right-3 top-16 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 transition-all duration-200 transform origin-top-right ${
            isUserMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {!session ? (
            <div className="flex flex-col py-1">
              <a
                href="/login"
                role="menuitem"
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <MdOutlinePerson className="size-5" />
                <span>Iniciar sesión</span>
              </a>
              <a
                href="/register"
                role="menuitem"
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <MdLogin className="size-5" />
                <span>Registrarse</span>
              </a>
            </div>
          ) : (
            <div className="flex flex-col py-1">
              {isAdmin && (
                <a
                  href="/admin"
                  role="menuitem"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <MdAdminPanelSettings className="size-5" />
                  <span>Admin</span>
                </a>
              )}
              <button
                role="menuitem"
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-600"
              >
                <MdLogout className="size-5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar móvil (menú principal) */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "bg-black/50" : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center border-b h-16 px-4">
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
          <div className="mt-6 flex flex-col gap-3 px-4">
            <a href="/vehiculos" className="p-2 rounded-lg hover:bg-gray-100 transition">
              Vehículos
            </a>
            <a href="/contacto" className="p-2 rounded-lg hover:bg-gray-100 transition">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
