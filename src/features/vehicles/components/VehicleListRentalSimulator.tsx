import React, { useState } from "react";
import { MdCalculate, MdExpandMore, MdExpandLess } from "react-icons/md";
import type { VehicleListRentalSimulatorProps, SimulationParams, CustomerType, DriverScore } from "../types";

const VehicleListRentalSimulator: React.FC<VehicleListRentalSimulatorProps> = ({ onSimulate, loading = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [params, setParams] = useState<SimulationParams>({
    years: 2,
    km_per_year: 15000,
    client_type: 'mype',
    driver_score: 'good'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulate(params);
  };

  const clientTypeLabels: Record<CustomerType, string> = {
    app_driver: 'Conductor de App',
    mype: 'MYPE',
    corporate: 'Corporativo'
  };

  const driverScoreLabels: Record<DriverScore, string> = {
    good: 'Buen Conductor',
    bad: 'Conductor con Historial'
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <MdCalculate className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Simulador de Renta</h3>
            <p className="text-sm text-gray-600">Calcula tu cuota mensual personalizada</p>
          </div>
        </div>
        {isExpanded ? (
          <MdExpandLess className="w-5 h-5 text-gray-400" />
        ) : (
          <MdExpandMore className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Años de renta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Años de Renta
                </label>
                <select
                  value={params.years}
                  onChange={(e) => setParams({ ...params, years: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={2}>2 años</option>
                  <option value={3}>3 años</option>
                  <option value={4}>4 años</option>
                  <option value={5}>5 años</option>
                </select>
              </div>

              {/* Kilómetros por año */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kilómetros por Año
                </label>
                <select
                  value={params.km_per_year}
                  onChange={(e) => setParams({ ...params, km_per_year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={10000}>10,000 km/año</option>
                  <option value={15000}>15,000 km/año</option>
                  <option value={20000}>20,000 km/año</option>
                  <option value={25000}>25,000 km/año</option>
                  <option value={30000}>30,000 km/año</option>
                  <option value={35000}>35,000 km/año</option>
                </select>
              </div>

              {/* Tipo de cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Cliente
                </label>
                <select
                  value={params.client_type}
                  onChange={(e) => setParams({ ...params, client_type: e.target.value as CustomerType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(clientTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Perfil del conductor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Perfil del Conductor
                </label>
                <select
                  value={params.driver_score}
                  onChange={(e) => setParams({ ...params, driver_score: e.target.value as DriverScore })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(driverScoreLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
              >
                <MdCalculate className="w-4 h-4" />
                {loading ? 'Calculando...' : 'Simular Renta'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VehicleListRentalSimulator;
