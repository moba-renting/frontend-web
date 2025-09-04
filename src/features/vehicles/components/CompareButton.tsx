import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { CompareButtonProps } from '../types';

// Mantenemos los IDs de los vehículos seleccionados para comparar en el localStorage
const COMPARE_STORAGE_KEY = 'moba_compare_vehicle';

const CompareButton: React.FC<CompareButtonProps> = ({ vehicleId }) => {
  const navigate = useNavigate();
  const [isSelected, setIsSelected] = useState(false);

  // Verificar el estado inicial y escuchar cambios en localStorage
  useEffect(() => {
    const checkSelection = () => {
      const storedVehicleId = localStorage.getItem(COMPARE_STORAGE_KEY);
      setIsSelected(storedVehicleId === vehicleId.toString());
    };

    checkSelection();

    // Listener para cambios en localStorage (útil si hay múltiples pestañas)
    window.addEventListener('storage', checkSelection);
    
    // Listener para evento personalizado (para cambios en la misma pestaña)
    window.addEventListener('compareVehicleChanged', checkSelection);
    
    return () => {
      window.removeEventListener('storage', checkSelection);
      window.removeEventListener('compareVehicleChanged', checkSelection);
    };
  }, [vehicleId]);

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Evitar que se active el onClick de la card

    const storedVehicleId = localStorage.getItem(COMPARE_STORAGE_KEY);

    if (!storedVehicleId) {
      // Primer vehículo seleccionado
      localStorage.setItem(COMPARE_STORAGE_KEY, vehicleId.toString());
      setIsSelected(true);
      
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent('compareVehicleChanged', {
        detail: { vehicleId: vehicleId.toString() }
      }));
      
      toast.success('Vehículo seleccionado para comparar (1/2)', {
        duration: 3000,
        position: 'top-center',
        icon: '✅'
      });
    } else if (storedVehicleId === vehicleId.toString()) {
      // Si se hace clic en el mismo vehículo, cancelamos la comparación
      localStorage.removeItem(COMPARE_STORAGE_KEY);
      setIsSelected(false);
      
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent('compareVehicleChanged', {
        detail: { vehicleId: null }
      }));
      
      toast.error('Vehículo deseleccionado', {
        duration: 2000,
        position: 'top-center',
        icon: '🔄'
      });
    } else {
      // Segundo vehículo seleccionado
      // Primero mostramos que se seleccionó
      localStorage.setItem(COMPARE_STORAGE_KEY, vehicleId.toString());
      setIsSelected(true);
      
      // Disparar evento para mostrar que se seleccionó este vehículo también
      window.dispatchEvent(new CustomEvent('compareVehicleChanged', {
        detail: { vehicleId: vehicleId.toString() }
      }));
      
      toast.success('¡Segundo vehículo seleccionado! (2/2)', {
        duration: 2000,
        position: 'top-center',
        icon: '✅'
      });
      
      // Esperar 1.5 segundos para que el usuario vea la selección
      setTimeout(() => {
        toast.success('Redirigiendo a comparación...', {
          duration: 1500,
          position: 'top-center',
          icon: '🔄'
        });
        
        // Esperar otro poco antes de navegar
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          navigate(`/vehicles/compare?id=${storedVehicleId}&id=${vehicleId}`);
          localStorage.removeItem(COMPARE_STORAGE_KEY);
          
          // Limpiar estado
          window.dispatchEvent(new CustomEvent('compareVehicleChanged', {
            detail: { vehicleId: null }
          }));
        }, 800);
      }, 1500);
    }
  };

  return (
    <button
      onClick={handleCompare}
      className={`
        absolute top-2 right-2 z-10 group
        flex items-center gap-1.5 px-3 py-2 rounded-lg
        text-xs font-medium transition-all duration-300
        transform hover:scale-105 active:scale-95
        shadow-lg backdrop-blur-sm border-2
        ${isSelected 
          ? 'bg-green-600 text-white border-green-400 shadow-green-200 hover:bg-red-500 hover:border-red-400 hover:shadow-red-200 animate-pulse hover:animate-none' 
          : 'bg-white/95 text-gray-700 border-transparent hover:bg-white hover:shadow-xl hover:border-gray-200'}
      `}
      title={isSelected ? "Clic para deseleccionar" : "Clic para seleccionar y comparar"}
    >
      {isSelected ? (
        <>
          <Check className="w-4 h-4 text-white" />
          <span className="whitespace-nowrap font-semibold">
            <span className="block group-hover:hidden">Seleccionado</span>
            <span className="hidden group-hover:block">Deseleccionar</span>
          </span>
        </>
      ) : (
        <>
          <ArrowLeftRight className="w-4 h-4 text-gray-600 transition-colors" />
          <span className="whitespace-nowrap">Comparar</span>
        </>
      )}
    </button>
  );
};

export default CompareButton;
