import React, { useState, useEffect } from "react";
import { Search, Car, CarTaxiFront, Truck, ArrowLeftRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../core/services/supabase";

interface Purpose {
  id: number;
  name: string;
  icon: React.ReactNode;
}

const SubHeader: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState<number | null>(null);
  const [purposes, setPurposes] = useState<Purpose[]>([]);

  useEffect(() => {
    fetchPurposes();
  }, []);

  const fetchPurposes = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_purposes')
        .select('*');

      if (error) throw error;

      const purposesWithIcons: Purpose[] = data.map(purpose => ({
        id: purpose.id,
        name: purpose.name,
        icon: getIconForPurpose(purpose.name)
      }));

      setPurposes(purposesWithIcons);
    } catch (error) {
      console.error('Error fetching purposes:', error);
    }
  };

  const getIconForPurpose = (purposeName: string) => {
    switch (purposeName.toLowerCase()) {
      case 'taxi':
        return <CarTaxiFront className="w-5 h-5" />;
      case 'comercial':
        return <Truck className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedPurpose) params.set('purpose', selectedPurpose.toString());
    navigate(`/vehicles?${params.toString()}`);
  };

  const handleRent = () => {
    navigate('/vehicles');
  };

  const handleCompare = () => {
    navigate('/vehicles/compare');
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Buscador */}
          <div className="relative flex-1 min-w-0">
            <div className="flex items-center bg-white rounded-lg border hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input
                type="text"
                className="block w-full rounded-lg border-0 py-2 pl-4 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                placeholder="Buscar por marca, modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="p-2 hover:text-blue-600"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filtros de propósito */}
          <div className="flex gap-2">
            {purposes.map((purpose) => (
              <button
                key={purpose.id}
                onClick={() => setSelectedPurpose(purpose.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedPurpose === purpose.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {purpose.icon}
                {purpose.name}
              </button>
            ))}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <button
              onClick={handleRent}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Car className="w-5 h-5" />
              Rentar
            </button>
            <button
              onClick={handleCompare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftRight className="w-5 h-5" />
              Comparar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;