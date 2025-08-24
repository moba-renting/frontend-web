import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer: React.FC = () => (
    <footer className="bg-brand-blueNavy backdrop-blur-md text-brand-white font-secondary w-full shadow-lg z-50">
        {/* Footer principal */}    
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo */}
            <div className="flex flex-col items-center md:items-start">
                <img src="/logo.svg" alt="Moba Renting Logo" className="h-12 mb-4" />
                <span className="font-primary font-bold text-lg">Moba Renting</span>
            </div>
            {/* Columna 1: Beneficios de Moba */}
            <div>
                <h3 className="font-secondary font-bold mb-2">Beneficios del Renting</h3>
                <ul className="space-y-1 text-sm">
                    <li className="font-primary">¿Quienes somos?</li>
                    <li className="font-primary">¿Como funciona Moba?</li>
                    <li className="font-primary">¿Qué es Renting?</li>
                </ul>
            </div>
            {/* Columna 2: Cómo funciona Moba */}
            <div>
                <h3 className="font-secondary font-bold mb-2">¿Cómo funciona Moba?</h3>
                <ul className="space-y-1 text-sm">
                    <li><a href="/como-funciona" className="font-secondary hover:underline">Proceso de renting</a></li>
                    <li><a href="/faq" className="font-secondary hover:underline">Preguntas frecuentes</a></li>
                    <li><a href="/contacto" className="font-secondary hover:underline">Contacto</a></li>
                </ul>
            </div>
            {/* Columna 3: Legales y libro */}
            <div>
                <h3 className="font-secondary font-bold mb-2">Legales y Libro</h3>
                <ul className="space-y-1 text-sm">
                    <li><a href="/aviso-legal" className="font-secondary hover:underline">Aviso legal</a></li>
                    <li><a href="/privacidad" className="font-secondary hover:underline">Política de privacidad</a></li>
                    <li><a href="/libro-reclamaciones" className="font-secondary hover:underline">Libro de reclamaciones</a></li>
                </ul>
            </div>
        </div>
        {/* Sub-footer */}
        <div className="border-t border-brand-white/20 py-4">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
                <span className="font-secondary">
                    © {new Date().getFullYear()} Moba Renting. Todos los derechos reservados.
                </span>
                <div className="flex space-x-4 mt-2 md:mt-0">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <FaFacebookF className="h-6 w-6" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <FaInstagram className="h-6 w-6" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <FaLinkedinIn className="h-6 w-6" />
                    </a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;