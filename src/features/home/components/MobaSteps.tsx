import React from "react";
import { Car, Calendar, ClipboardCheck, KeyRound } from "lucide-react";
type Step = {
  id: number;
  title: string;
  description: string;
  side: "left" | "right";
  icon: React.ReactNode;
};

interface MobaStepsProps {
  watermarkText?: string;  // texto gigante de fondo opcional (p.ej. "MOBA")
}

const MobaSteps: React.FC<MobaStepsProps> = ({watermarkText = "MOBA" }) => {
  const steps: Step[] = [
    {
      id: 1,
      title: "Elige tu taxi",
      description:
        "Explora nuestra selección de vehículos disponibles. Filtra por marca, modelo y disponibilidad para encontrar el taxi perfecto para ti.",
      side: "right",
      icon: <Car className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "Selecciona el tiempo de renta",
      description:
        "Elige tus fechas de alquiler y revisa los detalles, incluyendo precios y requisitos especiales para el período seleccionado.",
      side: "left",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 3,
      title: "Verifica si estás pre-aprobado",
      description:
        "Completa un sencillo formulario con tu información personal, licencia de conducir y preferencias de seguro.",
      side: "right",
      icon: <ClipboardCheck className="w-5 h-5" />,
    },
    {
      id: 4,
      title: "Te entregamos el vehículo",
      description:
        "Recógelo en nuestra ubicación o recibe el vehículo en tu dirección. Entrega rápida y sin complicaciones.",
      side: "left",
      icon: <KeyRound className="w-5 h-5" />,
    },
  ];

  return (
    <section className="w-full py-16 px-4">
      <div className="relative max-w-7xl mx-auto bg-transparent backdrop-blur-sm bg-white/30">
        {/* Marca de agua de fondo */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <span className="text-blue-100/20 font-black tracking-[0.2em] text-[12rem] md:text-[16rem] xl:text-[20rem] whitespace-nowrap leading-none transform -rotate-12">
            {watermarkText}
          </span>
        </div>

        {/* Contenido */}
        <div className="relative px-4 sm:px-6 lg:px-8 py-12 backdrop-blur-[2px]">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
          Renta tu vehículo en 4 pasos
        </h2>

        {/* Desktop / tablet */}
        <div className="hidden md:block relative">
          <div className="space-y-16">
            {steps.map((step, idx) => (
              <div key={step.id} className="grid grid-cols-[1fr_56px_1fr] items-center">
                {/* Lado izquierdo */}
                <div className={`${step.side === "left" ? "pr-10 text-right" : ""}`}>
                  {step.side === "left" && (
                    <>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </>
                  )}
                </div>

                {/* Icono + conectores */}
                <div className="relative mx-auto">
                  {/* Conectores */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 bottom-0 translate-y-1/2 w-px bg-blue-200" 
                       style={{ 
                         top: idx === -4 ? '50%' : '-4rem',
                         bottom: idx === steps.length - 1 ? '50%' : '-4rem'
                       }} 
                  />
                  {/* Círculo */}
                  <div className="relative grid place-items-center w-14 h-14 rounded-full bg-blue-600 text-white z-10 group">
                    {/* Efecto de brillo */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl group-hover:blur-2xl" />
                    {/* Círculo principal con efecto */}
                    <div className="relative grid place-items-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg ring-8 ring-blue-50 transition-all duration-500 group-hover:shadow-blue-400/50 group-hover:shadow-xl group-hover:scale-105">
                      <div className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                        {step.icon}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lado derecho */}
                <div className={`${step.side === "right" ? "pl-10" : ""}`}>
                  {step.side === "right" && (
                    <>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Móvil */}
        <div className="md:hidden relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-blue-100" />
          <div className="space-y-10">
            {steps.map((step, idx) => (
              <div key={step.id} className="relative pl-14">
                {/* conector arriba */}
                {idx !== 0 && (
                  <span className="absolute -top-5 left-5 w-px h-5 bg-blue-200" />
                )}

                <div className="absolute left-0 top-1 grid place-items-center w-10 h-10 rounded-full bg-blue-600 text-white shadow-md ring-4 ring-blue-50">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>

                {/* conector abajo */}
                {idx !== steps.length - 1 && (
                  <span className="absolute -bottom-5 left-5 w-px h-5 bg-blue-200" />
                )}
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default MobaSteps;
