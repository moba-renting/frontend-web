import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { supabase } from "../../../core/services/supabase";
import { VehicleGallery, VehicleSimulator } from "../components";
import type { VehicleDetail } from "../types";

// Interfaz para los datos que vienen de Supabase
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
  colors: {
    id: number;
    name: string;
    hex_code: string;
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

const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) {
        setError("ID del vehículo no válido");
        setLoading(false);
        return;
      }

      try {
        // Consulta completa para obtener todos los datos del vehículo
        const { data: vehicleData, error: vehicleError } = await supabase
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
            colors (
              id,
              name,
              hex_code
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
          .eq('id', parseInt(id))
          .eq('dealership_authorization', true)
          .eq('insurance_authorization', true)
          .single() as { data: VehicleDataFromDB | null, error: Error | null };

        if (vehicleError) {
          console.error('Error fetching vehicle:', vehicleError);
          setError("Vehículo no encontrado");
          return;
        }

        if (!vehicleData) {
          setError("Vehículo no encontrado");
          return;
        }

        // Transformar los datos al formato VehicleDetail
        const vehicleDetail: VehicleDetail = {
          id: vehicleData.id,
          nombre: `${vehicleData.models.brands.name} ${vehicleData.models.name} ${vehicleData.year}`,
          marca: vehicleData.models.brands.name,
          modelo: vehicleData.models.name,
          year: vehicleData.year,
          color: vehicleData.colors.name,
          plazas: 5, // Campo no disponible en BD, se podría agregar
          cilindrada: vehicleData.edition, // Usamos el campo edition como cilindrada/versión
          potencia: `${vehicleData.fuel} Engine`, // Basado en el tipo de combustible
          traccion: vehicleData.traction,
          condicion: vehicleData.condition,
          categoria: vehicleData.categories.name,
          image_urls: vehicleData.image_urls || [],
          combustible: vehicleData.fuel,
          transmision: vehicleData.transmission,
          kilometraje: vehicleData.mileage,
          precio: vehicleData.vehicle_price,
          descripcion: `${vehicleData.models.brands.name} ${vehicleData.models.name} ${vehicleData.year} en excelente estado. Vehículo ${vehicleData.condition.toLowerCase()} con ${vehicleData.mileage.toLocaleString()} kilómetros. ${vehicleData.edition && vehicleData.edition !== '' ? `Versión ${vehicleData.edition}.` : ''} Ideal para quienes buscan calidad y confiabilidad.`,
          equipamiento: [
            `Sistema GPS ${vehicleData.gps.name}`,
            `Transmisión ${vehicleData.transmission}`,
            `Tracción ${vehicleData.traction}`,
            `Motor ${vehicleData.fuel}`,
            "Sistema de seguridad estándar"
          ],
          concesionario: {
            nombre: vehicleData.dealerships.name,
            telefono: "Contactar concesionario", // Campo no disponible en BD
            direccion: `Concesionario ${vehicleData.dealerships.handle}` // Usamos el handle como referencia
          }
        };

        setVehicle(vehicleDetail);
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        setError("Error al cargar los detalles del vehículo");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">Cargando detalles del vehículo...</div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-red-600 mb-4">
          {error || "Vehículo no encontrado"}
        </div>
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <MdArrowBack className="w-5 h-5" />
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Botón volver */}
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
        >
          <MdArrowBack className="w-5 h-5" />
          Volver a vehículos
        </button>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Galería e información del vehículo (2/3 del ancho) */}
          <div className="lg:col-span-2">
            <VehicleGallery vehicle={vehicle} />
          </div>

          {/* Simulador (1/3 del ancho) */}
          <div className="lg:col-span-1">
            <VehicleSimulator vehicle={vehicle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
