import React, { useState, useEffect } from "react";
import { MdLocationOn, MdPhone } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { supabase } from "../../../core/services/supabase";
import type { VehicleDetailRentalSimulatorProps, RentalSimulation, SimulationParams, CustomerType, DriverScore } from "../types";

const VehicleDetailRentalSimulator: React.FC<VehicleDetailRentalSimulatorProps> = ({
  vehicle,
  vehiclePrice,
  annualInsurancePrice,
  lowMileageRate,
  mediumMileageRate,
  highMileageRate
}) => {
  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    years: 3,
    km_per_year: 15000,
    client_type: 'mype',
    driver_score: 'good'
  });

  const [simulation, setSimulation] = useState<RentalSimulation | null>(null);
  const [loading, setLoading] = useState(false);

  const yearOptions = [
    { value: 2, label: '2 años' },
    { value: 3, label: '3 años' },
    { value: 4, label: '4 años' },
    { value: 5, label: '5 años' }
  ];

  const kmOptions = [
    { value: 10000, label: '10,000 km/año' },
    { value: 15000, label: '15,000 km/año' },
    { value: 20000, label: '20,000 km/año' },
    { value: 25000, label: '25,000 km/año' },
    { value: 30000, label: '30,000 km/año' },
    { value: 35000, label: '35,000 km/año' }
  ];

  const clientTypeOptions = [
    { value: 'app_driver' as CustomerType, label: 'Conductor App' },
    { value: 'mype' as CustomerType, label: 'MYPE' },
    { value: 'corporate' as CustomerType, label: 'Corporativo' }
  ];

  const driverScoreOptions = [
    { value: 'good' as DriverScore, label: 'Buen conductor' },
    { value: 'bad' as DriverScore, label: 'Mal conductor' }
  ];

  // Simular renta cuando cambien los parámetros
  const simulateRental = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('simulate_vehicle_rental', {
        p_vehicle_price: vehiclePrice,
        p_annual_insurance_price: annualInsurancePrice,
        p_low_mileage_rate_per_km: lowMileageRate,
        p_medium_mileage_rate_per_km: mediumMileageRate,
        p_high_mileage_rate_per_km: highMileageRate,
        p_years: simulationParams.years,
        p_km_per_year: simulationParams.km_per_year,
        p_client_type: simulationParams.client_type,
        p_driver_score: simulationParams.driver_score
      });

      if (error) {
        console.error('Error simulating rental:', error);
      } else {
        setSimulation(data);
      }
    } catch (error) {
      console.error('Error in simulation:', error);
    } finally {
      setLoading(false);
    }
  }, [vehiclePrice, annualInsurancePrice, lowMileageRate, mediumMileageRate, highMileageRate, simulationParams]);

  useEffect(() => {
    simulateRental();
  }, [simulateRental]);

  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return 'S/ 0.00';
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleParamChange = (key: keyof SimulationParams, value: string | number) => {
    setSimulationParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Simulador de renta */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-6">Simulación de Renta</h2>
        
        {/* Parámetros de simulación */}
        <div className="space-y-4 mb-6">
          {/* Años */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración del contrato
            </label>
            <select
              value={simulationParams.years}
              onChange={(e) => handleParamChange('years', parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {yearOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Kilómetros por año */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kilometraje anual
            </label>
            <select
              value={simulationParams.km_per_year}
              onChange={(e) => handleParamChange('km_per_year', parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {kmOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de cliente
            </label>
            <select
              value={simulationParams.client_type}
              onChange={(e) => handleParamChange('client_type', e.target.value as CustomerType)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {clientTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Score del conductor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Perfil del conductor
            </label>
            <select
              value={simulationParams.driver_score}
              onChange={(e) => handleParamChange('driver_score', e.target.value as DriverScore)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {driverScoreOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resultados de la simulación */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Calculando...</p>
          </div>
        ) : simulation ? (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Resumen de Costos Mensuales</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Seguro mensual:</span>
                <span className="font-semibold">{formatCurrency(simulation.seguro_mensual)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuesto vehicular:</span>
                <span className="font-semibold">{formatCurrency(simulation.impuesto_mensual)}</span>
              </div>
              <div className="flex justify-between">
                <span>RTV mensual:</span>
                <span className="font-semibold">{formatCurrency(simulation.rtv_mensual)}</span>
              </div>
              <div className="flex justify-between">
                <span>SOAT mensual:</span>
                <span className="font-semibold">{formatCurrency(simulation.soat_mensual)}</span>
              </div>
              <div className="flex justify-between">
                <span>Mantenimiento:</span>
                <span className="font-semibold">{formatCurrency(simulation.mantenimiento_mensual)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(simulation.subtotal_mensual)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ganancia empresa:</span>
                <span className="font-semibold">{formatCurrency(simulation.ganancia_mensual)}</span>
              </div>
              <div className="border-t-2 pt-2 flex justify-between items-center">
                <span className="text-lg font-bold">Cuota mensual total:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(simulation.cuota_final_mensual)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Valor residual al final:</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(simulation.valor_residual)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Devaluación: {simulation.devaluacion_pct}% en {simulationParams.years} años
              </p>
            </div>
          </div>
        ) : null}

        {/* Botón de contacto principal */}
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors mb-4">
          Solicitar Este Vehículo
        </button>

        {/* Botones de contacto */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors">
            <MdPhone className="w-5 h-5" />
            Llamar
          </button>
          <button className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors">
            <FaWhatsapp className="w-5 h-5" />
            WhatsApp
          </button>
        </div>
      </div>

      {/* Información del concesionario */}
      {vehicle.concesionario && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-3">Concesionario</h3>
          <div className="space-y-2">
            <div className="font-medium">{vehicle.concesionario.nombre}</div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <MdPhone className="w-4 h-4" />
              {vehicle.concesionario.telefono}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <MdLocationOn className="w-4 h-4" />
              {vehicle.concesionario.direccion}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetailRentalSimulator;
