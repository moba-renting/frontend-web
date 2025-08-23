import React from "react";
import type { Category, Brand, Model, FiltersState } from "../types/index";

interface FiltersProps {
  parentCategories: Category[];
  childCategories: Category[];
  marcas: Brand[];
  models: Model[];
  filters: FiltersState;
  loadingModels: boolean;
  onChange: (filterType: keyof FiltersState, value: string) => void;
  onSearch: () => void;
}

const VehicleSearchFilters: React.FC<FiltersProps> = ({ 
  parentCategories, 
  childCategories, 
  marcas, 
  models,
  filters, 
  loadingModels, 
  onChange, 
  onSearch 
}) => {
  return (
    <section className="-mt-16 relative z-10">
      <div className="max-w-6xl mx-auto bg-white/65 backdrop-blur-md rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Encuentra tu auto ideal</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Propósito */}
          <div>
            <select
              value={filters.categoriaProposito}
              onChange={(e) => onChange("categoriaProposito", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Propósito</option>
              {parentCategories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Vehículo */}
          <div>
            <select
              value={filters.categoriaVehiculo}
              onChange={(e) => onChange("categoriaVehiculo", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={!filters.categoriaProposito}
            >
              <option value="">{!filters.categoriaProposito ? "Selecciona propósito primero" : "Tipo de vehículo"}</option>
              {childCategories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Marca */}
          <div>
            <select
              value={filters.marca}
              onChange={(e) => onChange("marca", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Marca</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id.toString()}>
                  {marca.name}
                </option>
              ))}
            </select>
          </div>

          {/* Modelo */}
          <div>
            <select
              value={filters.modelo}
              onChange={(e) => onChange("modelo", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={!filters.marca || loadingModels}
            >
              <option value="">{loadingModels ? "Cargando modelos..." : "Modelo"}</option>
              {models.map((model) => (
                <option key={model.id} value={model.id.toString()}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={onSearch}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
          >
            Buscar Vehículos
          </button>
        </div>
      </div>
    </section>
  );
};

export default VehicleSearchFilters;