import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../core/services/supabase";
import { Fuel, Users, Gauge, DollarSign, Car, Calendar, Activity, Settings, ArrowLeft } from "lucide-react";

interface VehicleDataFromDB {
  id: number;
  vehicle_price: number;
  maintenance_price: number;
  soat_price: number;
  auto_parts_price: number;
  insurance_price: number;
  image_urls: string[];
  mileage: number;
  year: number;
  fuel: string;
  edition: string;
  traction: string;
  condition: string;
  transmission: string;
  dealership_authorization: boolean;
  insurance_authorization: boolean;
  created_at: string;
  models: {
    id: number;
    name: string;
    brands: {
      id: number;
      name: string;
    };
  };
  categories: {
    id: number;
    name: string;
  };
  gps: {
    id: number;
    name: string;
    price: number;
  };
  dealerships: {
    id: number;
    name: string;
    handle: string;
  };
}

interface ComparisonItem {
  icon: React.ReactNode;
  label: string;
  getValue: (vehicle: VehicleDataFromDB) => string | number;
  format?: (value: any) => string;
}

const VehicleComparePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<VehicleDataFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función helper para navegación con scroll
  const navigateWithScroll = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  const comparisonItems: ComparisonItem[] = [
    {
      icon: <Car className="w-4 h-4 md:w-5 md:h-5" />,
      label: "Marca y Modelo",
      getValue: (v) => {
        const brand = v.models?.brands?.name || 'Marca';
        const model = v.models?.name || 'Modelo';
        return `${brand} ${model}`;
      }
    },
    {
      icon: <Calendar className="w-4 h-4 md:w-5 md:h-5" />,
      label: "Año",
      getValue: (v) => v.year || 'N/A'
    },
    {
      icon: <Gauge className="w-4 h-4 md:w-5 md:h-5" />,
      label: "Transmisión",
      getValue: (v) => v.transmission || 'N/A'
    },
    {
      icon: <Users className="w-4 h-4 md:w-5 md:h-5" />,
      label: "Categoría",
      getValue: (v) => v.categories?.name || 'N/A'
    },
    {
      icon: <Fuel className="w-4 h-4 md:w-5 md:h-5" />,
      label: "Combustible",
      getValue: (v) => v.fuel || 'N/A'
    },
    {
      icon: <Activity className="w-4 h-4 md:w-5 md:h-5" />,
      label: "Kilometraje",
      getValue: (v) => v.mileage || 0,
      format: (value) => value === 0 ? 'N/A' : `${value.toLocaleString()} km`
    },
    {
      icon: <Settings className="w-4 h-4 md:w-5 md:h-5" />,
      label: "Tracción",
      getValue: (v) => v.traction || 'N/A'
    },
    {
      icon: <DollarSign className="w-4 h-4 md:w-5 md:h-5" />,
      label: "Precio",
      getValue: (v) => v.vehicle_price || 0,
      format: (value) => value === 0 ? 'Consultar' : `S/ ${value.toLocaleString()}`
    }
  ];

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const ids = searchParams.getAll('id');
        if (ids.length === 0) {
          setError("No se han seleccionado vehículos para comparar");
          setLoading(false);
          return;
        }

        if (ids.length !== 2) {
          setError("Se requieren exactamente 2 vehículos para comparar");
          setLoading(false);
          return;
        }

        console.log('Fetching vehicles with IDs:', ids);
        const { data, error } = await supabase
          .from('vehicles')
          .select(`
            id,
            vehicle_price,
            maintenance_price,
            soat_price,
            auto_parts_price,
            insurance_price,
            image_urls,
            mileage,
            year,
            fuel,
            edition,
            traction,
            condition,
            transmission,
            dealership_authorization,
            insurance_authorization,
            created_at,
            models (
              id,
              name,
              brands (
                id,
                name
              )
            ),
            categories (
              id,
              name
            ),
            gps (
              id,
              name,
              price
            ),
            dealerships (
              id,
              name,
              handle
            )
          `)
          .in('id', ids.map(id => parseInt(id)))
          .eq('dealership_authorization', true)
          .eq('insurance_authorization', true) as { data: VehicleDataFromDB[] | null, error: any };

        if (error) throw error;
        
        console.log('Raw data from Supabase:', data);
        console.log('First vehicle data:', data?.[0]);
        
        if (!data || data.length === 0) {
          setError("No se encontraron vehículos con los IDs proporcionados");
          return;
        }
        
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setError("Error al cargar los vehículos para comparar");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchParams]);

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          Error
        </h2>
        <p className="text-gray-600">
          {error}
        </p>
        <button
          onClick={() => navigate('/vehicles')}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a vehículos</span>
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          No hay vehículos para comparar
        </h2>
        <p className="text-gray-600 mb-4">
          Selecciona vehículos en la lista para compararlos.
        </p>
        <button
          onClick={() => navigate('/vehicles')}
          className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a vehículos</span>
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Comparación de vehículos
        </h1>
        <button
          onClick={() => navigate('/vehicles')}
          className="flex items-center gap-2 px-3 py-2 md:px-4 text-sm md:text-base text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Volver a vehículos</span>
          <span className="sm:hidden">Volver</span>
        </button>
      </div>

      {/* Layout responsivo: stack en móvil, grid en desktop */}
      <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
        {vehicles.map((vehicle, index) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {/* Badge para identificar vehículo en móvil */}
            <div className="bg-blue-600 text-white text-center py-2 lg:hidden">
              <span className="text-sm font-medium">Vehículo {index + 1}</span>
            </div>

            {/* Imagen del vehículo */}
            <div className="h-48 md:h-64 bg-gray-200 relative">
              <img
                src={vehicle.image_urls?.[0] || '/placeholder-car.jpg'}
                alt={`${vehicle.models?.brands?.name || 'Marca'} ${vehicle.models?.name || 'Modelo'}`}
                className="object-contain w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-car.jpg';
                }}
              />
            </div>

            {/* Nombre del vehículo */}
            <div className="p-4 md:p-6 border-b">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {vehicle.models?.brands?.name || 'Marca'} {vehicle.models?.name || 'Modelo'}
              </h2>
              <p className="text-base md:text-lg text-gray-600 mt-2">
                {`${vehicle.year || 'Año'} - ${vehicle.condition || 'Condición'}`}
              </p>
              {vehicle.edition && (
                <p className="text-sm md:text-base text-gray-500 mt-1">
                  {vehicle.edition}
                </p>
              )}
            </div>

            {/* Lista de características */}
            <div className="divide-y divide-gray-200">
              {comparisonItems.map((item) => (
                <div
                  key={`${vehicle.id}-${item.label}`}
                  className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 md:gap-3 text-gray-600 flex-1 min-w-0">
                    <div className="p-1.5 md:p-2 rounded-full bg-gray-100 flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-medium text-sm md:text-base truncate">{item.label}</span>
                  </div>
                  <div className="font-semibold text-gray-900 text-sm md:text-base ml-2 text-right">
                    {(() => {
                      try {
                        const value = item.getValue(vehicle);
                        if (value === null || value === undefined || value === '') return 'N/A';
                        return item.format ? item.format(value) : String(value);
                      } catch (error) {
                        console.error('Error getting value for item:', item.label, error);
                        return 'N/A';
                      }
                    })()}
                  </div>
                </div>
              ))}
            </div>

            {/* Botón de acción */}
            <div className="p-4 md:p-6 bg-gray-50 border-t">
              <button
                onClick={() => navigateWithScroll(`/vehicles/${vehicle.id}`)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Car className="w-5 h-5" />
                Rentar este vehículo
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Ver detalles completos y opciones de renta
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de decisión final */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-6">
          ¿Ya decidiste cuál prefieres?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((vehicle, index) => (
            <div key={vehicle.id} className="text-center">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-lg text-gray-900 mb-2">
                  {vehicle.models?.brands?.name || 'Marca'} {vehicle.models?.name || 'Modelo'}
                </h4>
                <p className="text-2xl font-bold text-green-600 mb-1">
                  {vehicle.vehicle_price ? `S/ ${vehicle.vehicle_price.toLocaleString()}` : 'Consultar precio'}
                </p>
                <p className="text-sm text-gray-600">
                  {vehicle.year} • {vehicle.fuel} • {vehicle.transmission}
                </p>
              </div>
              
              <button
                onClick={() => navigateWithScroll(`/vehicles/${vehicle.id}`)}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🚗 ¡Rentar este vehículo!
              </button>
              
              <p className="text-xs text-gray-500 mt-2">
                Opción {index + 1} - Ver detalles y simular renta
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            ¿Necesitas más tiempo para decidir?
          </p>
          <button
            onClick={() => navigateWithScroll('/vehicles')}
            className="inline-flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver más vehículos
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleComparePage;
