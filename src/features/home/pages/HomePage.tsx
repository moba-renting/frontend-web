import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../core/services/supabase";
import heroBg from "../../../assets/images/portada.png";

interface HomePageConfig {
  hero_banner_url: string;
  b2b_benefits_url: string;
  b2c_benefits_url: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

interface Category {
  id: number;
  name: string;
  image_url: string;
  sort_order: number;
}

interface Brand {
  id: number;
  name: string;
  sort_order: number;
}

interface Model {
  id: number;
  name: string;
  brand_id: number;
  sort_order: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<HomePageConfig | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    condicion: "",
    marca: "",
    modelo: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch home page configuration
        const { data: configData, error: configError } = await supabase
          .from('home_page_config')
          .select('*')
          .eq('id', 1)
          .single();

        if (configError) throw configError;
        setConfig(configData);

        // Fetch brands ordered by sort_order (only active brands)
        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (brandsError) throw brandsError;
        setBrands(brandsData || []);

        // Fetch categories ordered by sort_order (only active categories)
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch models when brand is selected
  useEffect(() => {
    const fetchModels = async () => {
      if (!filters.marca) {
        setModels([]);
        return;
      }

      setLoadingModels(true);
      try {
        const { data: modelsData, error: modelsError } = await supabase
          .from('models')
          .select('*')
          .eq('brand_id', filters.marca)
          .eq('is_active', true)
          .order('sort_order');

        if (modelsError) throw modelsError;
        setModels(modelsData || []);
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [filters.marca]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: value
      };
      
      // Reset modelo when marca changes
      if (filterType === 'marca') {
        newFilters.modelo = "";
      }
      
      return newFilters;
    });
  };

  // Navegar a la página de vehículos con filtros
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (filters.condicion) {
      params.set('condition', filters.condicion);
    }
    if (filters.marca) {
      params.set('brand_id', filters.marca);
    }
    if (filters.modelo) {
      params.set('model_id', filters.modelo);
    }
    
    navigate(`/vehicles?${params.toString()}`);
  };

  // Navegar a la página de vehículos por categoría
  const handleCategoryClick = (categoryId: number) => {
    navigate(`/vehicles?category_id=${categoryId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Banner */}
      <section className="relative w-full h-96 bg-gray-900">
        {config?.hero_banner_url && (
          <img
            src={heroBg}
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
        )}
      </section>

      {/* Filtros para vehículos */}
      <section className="-mt-16 relative z-10">
        <div className="max-w-6xl mx-auto bg-white/65 backdrop-blur-md rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Encuentra tu auto ideal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <select
                value={filters.condicion}
                onChange={(e) => handleFilterChange('condicion', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Condición</option>
                <option value="New">Nuevo</option>
                <option value="Semi-New">Semi-nuevo</option>
                <option value="Used">Usado</option>
              </select>
            </div>
            <div>
              <select
                value={filters.marca}
                onChange={(e) => handleFilterChange('marca', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Marca</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filters.modelo}
                onChange={(e) => handleFilterChange('modelo', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={!filters.marca || loadingModels}
              >
                <option value="">{loadingModels ? "Cargando modelos..." : "Modelo"}</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Botón Buscar */}
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors">
              Buscar Vehículos
            </button>
            <div className="flex justify-center mt-6">
              <button 
                onClick={handleSearch}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-semibold text-lg transition-colors"
              >
                Buscar Vehículos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Destacadas */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Categorías de Vehículos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Imagen de la categoría */}
                <div className="aspect-square bg-gray-200">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Nombre de la categoría */}
                <div className="p-3 text-center">
                  <h3 className="font-semibold text-sm text-gray-900">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios B2C */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full h-48 md:h-64 bg-gray-200 rounded-lg overflow-hidden mb-8">
            {config?.b2c_benefits_url && (
              <img
                src={config.b2c_benefits_url}
                alt="Beneficios B2C"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {/* Beneficios B2B */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full h-48 md:h-64 bg-gray-200 rounded-lg overflow-hidden mb-8">
            {config?.b2b_benefits_url && (
              <img
                src={config.b2b_benefits_url}
                alt="Beneficios B2B"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {/* Testimonios de Clientes */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Lo que dicen nuestros clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                name: "María González",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face&auto=format",
                comment: "Excelente servicio, encontré el auto perfecto para mi familia. El proceso fue muy fácil y transparente."
              },
              {
                id: 2,
                name: "Carlos Mendoza",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
                comment: "La atención al cliente es excepcional. Me ayudaron en cada paso del proceso de financiamiento."
              },
              {
                id: 3,
                name: "Ana Rodríguez",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format",
                comment: "Recomiendo totalmente MOBA RENTING. Precios justos y vehículos de calidad garantizada."
              }
            ].map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-200">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.comment}"</p>
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            {config?.faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
