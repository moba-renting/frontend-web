import React, { useState, useEffect } from "react";
import { MdLocationOn, MdPhone } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import type { VehicleDetail } from "../types";

interface VehicleSimulatorProps {
  vehicle: VehicleDetail;
}

interface QuotaOption {
  months: number;
  monthlyPayment: number;
  highlighted?: boolean;
}

const VehicleSimulator: React.FC<VehicleSimulatorProps> = ({ vehicle }) => {
  const [selectedMonths, setSelectedMonths] = useState<number>(21);
  const [selectedKilometers, setSelectedKilometers] = useState<number>(1500);

  // Opciones de cuotas (Datos de prueba)
  const quotaOptions: QuotaOption[] = [
    { months: 1, monthlyPayment: 669, highlighted: false },
    { months: 3, monthlyPayment: 529, highlighted: false },
    { months: 6, monthlyPayment: 509, highlighted: false },
    { months: 12, monthlyPayment: 479, highlighted: false },
    { months: 21, monthlyPayment: 419, highlighted: true }
  ];

  // Opciones de kilometraje
  const kilometrageOptions = [
    { km: 1500, label: "1500 Km", extra: "Sin coste" },
    { km: 2000, label: "2000 Km", extra: "+25€/mes" }
  ];


  const getCurrentQuota = () => {
    const option = quotaOptions.find(opt => opt.months === selectedMonths);
    return option ? option.monthlyPayment : 0;
  };

  const getKilometrageExtra = () => {
    const option = kilometrageOptions.find(opt => opt.km === selectedKilometers);
    if (option?.km === 2000) return 25;
    return 0;
  };

  const getTotalMonthlyPayment = () => {
    return getCurrentQuota() + getKilometrageExtra();
  };

  return (
    <div className="space-y-6">
      {/* Simulador de cuotas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-6">CUOTA Y PERMANENCIA</h2>
        
        {/* Opciones de cuotas */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {quotaOptions.map((option) => (
            <button
              key={option.months}
              onClick={() => setSelectedMonths(option.months)}
              className={`p-4 border rounded-lg text-center transition-colors ${
                selectedMonths === option.months
                  ? option.highlighted
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-sm text-gray-600 mb-1">
                {option.months} Mes{option.months !== 1 ? 'es' : ''}
              </div>
              <div className="text-lg font-bold">
                {option.monthlyPayment} €
              </div>
              {option.highlighted && selectedMonths === option.months && (
                <div className="text-xs bg-green-600 text-white px-2 py-1 rounded-full mt-2 inline-block">
                  Recomendado
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Kilometraje */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">KILOMETRAJE</h3>
          <div className="grid grid-cols-2 gap-3">
            {kilometrageOptions.map((option) => (
              <button
                key={option.km}
                onClick={() => setSelectedKilometers(option.km)}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  selectedKilometers === option.km
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold mb-1">{option.label}</div>
                <div className="text-sm text-gray-600">{option.extra}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Resumen de la cuota */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span>Cuota base ({selectedMonths} meses):</span>
            <span className="font-semibold">{getCurrentQuota()} €</span>
          </div>
          {getKilometrageExtra() > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span>Extra kilometraje:</span>
              <span className="font-semibold">+{getKilometrageExtra()} €</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between items-center">
            <span className="text-lg font-bold">Total mensual:</span>
            <span className="text-2xl font-bold text-green-600">
              {getTotalMonthlyPayment()} €
            </span>
          </div>
        </div>

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

export default VehicleSimulator;
