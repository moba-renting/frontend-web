import React from "react";
import { MdClear } from "react-icons/md";
import type { AvailableFilters, Filters } from "../types";

interface VehicleFiltersProps {
  availableFilters: AvailableFilters;
  filters: Filters;
  showFilters: boolean;
  customYearMin: string;
  customYearMax: string;
  customMileageMin: string;
  customMileageMax: string;
  onFilterChange: (newFilters: Partial<Filters>) => void;
  onClearFilters: () => void;
  onCustomYearMinChange: (value: string) => void;
  onCustomYearMaxChange: (value: string) => void;
  onCustomMileageMinChange: (value: string) => void;
  onCustomMileageMaxChange: (value: string) => void;
  onApplyCustomYearFilter: () => void;
  onApplyCustomMileageFilter: () => void;
  onClearCustomInputs: (type: 'year' | 'mileage') => void;
}

const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  availableFilters,
  filters,
  showFilters,
  customYearMin,
  customYearMax,
  customMileageMin,
  customMileageMax,
  onFilterChange,
  onClearFilters,
  onCustomYearMinChange,
  onCustomYearMaxChange,
  onCustomMileageMinChange,
  onCustomMileageMaxChange,
  onApplyCustomYearFilter,
  onApplyCustomMileageFilter,
  onClearCustomInputs,
}) => {
  return (
    <aside className={`w-80 bg-white rounded-lg border border-gray-200 p-6 h-fit ${
      showFilters ? 'block' : 'hidden md:block'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Filtros</h2>
        {Object.keys(filters).length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <MdClear className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Marcas */}
        {availableFilters.brands && availableFilters.brands.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Marca</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableFilters.brands.map((brand) => (
                <label key={brand.id} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="brand"
                    checked={filters.brand_id === brand.id}
                    onChange={() => onFilterChange({ brand_id: brand.id })}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {brand.name} ({brand.count})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Modelos */}
        {availableFilters.models && availableFilters.models.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Modelo</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableFilters.models.map((model) => (
                <label key={model.id} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="model"
                    checked={filters.model_id === model.id}
                    onChange={() => onFilterChange({ model_id: model.id })}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {model.name} ({model.count})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Categorías */}
        {availableFilters.categories && availableFilters.categories.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Categoría</h3>
            <div className="space-y-2">
              {availableFilters.categories.map((category) => (
                <label key={category.id} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category_id === category.id}
                    onChange={() => onFilterChange({ category_id: category.id })}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {category.name} ({category.count})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Condición */}
        {availableFilters.conditions && availableFilters.conditions.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Condición</h3>
            <div className="space-y-2">
              {availableFilters.conditions.map((condition) => (
                <label key={condition.name} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    checked={filters.condition === condition.name}
                    onChange={() => onFilterChange({ condition: condition.name })}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {condition.name} ({condition.count})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Rango de Años */}
        {availableFilters.year_ranges && availableFilters.year_ranges.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Año</h3>
            <div className="space-y-2 mb-4">
              {availableFilters.year_ranges.map((yearRange) => (
                <label key={yearRange.range} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="year_range"
                    checked={filters.year_min === yearRange.min && filters.year_max === yearRange.max}
                    onChange={() => {
                      onClearCustomInputs('year');
                      onFilterChange({ 
                        year_min: yearRange.min, 
                        year_max: yearRange.max 
                      });
                    }}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {yearRange.range} ({yearRange.count})
                  </span>
                </label>
              ))}
            </div>
            
            {/* Filtro personalizado de años */}
            <div className="border-t pt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Rango personalizado:</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <input
                    type="number"
                    placeholder="Año mín"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={customYearMin}
                    onChange={(e) => onCustomYearMinChange(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Año máx"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={customYearMax}
                    onChange={(e) => onCustomYearMaxChange(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>
              <button
                onClick={onApplyCustomYearFilter}
                disabled={!customYearMin && !customYearMax}
                className="w-full px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Aplicar rango
              </button>
            </div>
          </div>
        )}

        {/* Rango de Kilometraje */}
        {availableFilters.mileage_ranges && availableFilters.mileage_ranges.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Kilometraje</h3>
            <div className="space-y-2 mb-4">
              {availableFilters.mileage_ranges.map((mileageRange) => (
                <label key={mileageRange.range} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="mileage_range"
                    checked={filters.mileage_min === mileageRange.min && filters.mileage_max === mileageRange.max}
                    onChange={() => {
                      onClearCustomInputs('mileage');
                      onFilterChange({ 
                        mileage_min: mileageRange.min, 
                        mileage_max: mileageRange.max 
                      });
                    }}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {mileageRange.range} ({mileageRange.count})
                  </span>
                </label>
              ))}
            </div>
            
            {/* Filtro personalizado de kilometraje */}
            <div className="border-t pt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Rango personalizado:</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <input
                    type="number"
                    placeholder="Km mín"
                    min="0"
                    value={customMileageMin}
                    onChange={(e) => onCustomMileageMinChange(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Km máx"
                    min="0"
                    value={customMileageMax}
                    onChange={(e) => onCustomMileageMaxChange(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>
              <button
                onClick={onApplyCustomMileageFilter}
                disabled={!customMileageMin && !customMileageMax}
                className="w-full px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Aplicar rango
              </button>
            </div>
          </div>
        )}

        {/* Transmisión */}
        {availableFilters.transmissions && availableFilters.transmissions.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Transmisión</h3>
            <div className="space-y-2">
              {availableFilters.transmissions.map((transmission) => (
                <label key={transmission.name} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="transmission"
                    checked={filters.transmission === transmission.name}
                    onChange={() => onFilterChange({ transmission: transmission.name })}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {transmission.name} ({transmission.count})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Tracción */}
        {availableFilters.tractions && availableFilters.tractions.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Tracción</h3>
            <div className="space-y-2">
              {availableFilters.tractions.map((traction) => (
                <label key={traction.name} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="traction"
                    checked={filters.traction === traction.name}
                    onChange={() => onFilterChange({ traction: traction.name })}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {traction.name} ({traction.count})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Concesionarios */}
        {availableFilters.dealerships && availableFilters.dealerships.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Concesionario</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableFilters.dealerships.map((dealership) => (
                <label key={dealership.id} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="dealership"
                    checked={filters.dealership_id === dealership.id}
                    onChange={() => onFilterChange({ dealership_id: dealership.id })}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {dealership.name} ({dealership.count})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default VehicleFilters;
