import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import type { Vehicle, Filters } from "../types";

interface VehicleListProps {
  vehicles: Vehicle[];
  loadingVehicles: boolean;
  currentPage: number;
  totalPages: number;
  filters: Filters;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  loadingVehicles,
  currentPage,
  totalPages,
  filters,
  onPageChange,
  onClearFilters,
}) => {
  // Formatear precio
  const formatPrice = (price: number) => {
    return `S/ ${price.toLocaleString()}`;
  };

  if (loadingVehicles) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium text-gray-600">Cargando vehículos...</div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No se encontraron vehículos</div>
        <p className="text-gray-400 mb-4">Intenta ajustar los filtros de búsqueda</p>
        {Object.keys(filters).length > 0 && (
          <button
            onClick={onClearFilters}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Grid de vehículos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Imagen */}
            <div className="aspect-w-16 aspect-h-12 bg-gray-200">
              {vehicle.image_urls && vehicle.image_urls.length > 0 ? (
                <img
                  src={vehicle.image_urls[0]}
                  alt={vehicle.nombre}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Sin imagen</span>
                </div>
              )}
            </div>
            
            {/* Información */}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {vehicle.nombre}
              </h3>
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <p>{vehicle.combustible} • {vehicle.transmision}</p>
                <p>{vehicle.kilometraje.toLocaleString()} km</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(vehicle.precio)}
                </span>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="px-4 py-2 text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
};

export default VehicleList;
