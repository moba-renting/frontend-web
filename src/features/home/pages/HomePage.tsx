import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../core/services/supabase";
import heroBg from "../../../assets/images/portada.png";

// types
import type { Category, Brand, Model, HomePageConfig, FiltersState } from "../types";

// components
import HeroBanner from "../components/HeroBanner";
import VehicleSearchFilters from "../components/VehicleSearchFilters";
import FeaturedCategories from "../components/FeaturedCategories";
import Testimonials from "../components/Testimonials";
import FaqSection from "../components/FaqSection";
import HomeSkeleton from "../components/HomeSkeleton";
import BenefitsSection from "../components/BenefitsSection";
import MobaSteps from "../components/MobaSteps";
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // state
  const [config, setConfig] = useState<HomePageConfig | null>(null);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FiltersState>({
    categoriaProposito: "",
    categoriaVehiculo: "",
    marca: "",
    modelo: ""
  });

  // fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch home page configuration
        const { data: configData, error: configError } = await supabase
          .from("home_page_config")
          .select("*")
          .eq("id", 1)
          .single();

        if (configError) throw configError;
        setConfig(configData as HomePageConfig);

        // Cargar categorías padre al montar el componente
        const { data: parentCategoriesData, error: parentCategoriesError } = await supabase
          .from('categories')
          .select('*')
          .is('parent_id', null)
          .order('sort_order', { ascending: true });

        if (parentCategoriesError) throw parentCategoriesError;
        setParentCategories(parentCategoriesData || []);

        // Fetch brands ordered by sort_order (only active brands)
        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("*")
          .order("sort_order");
        if (brandsError) throw brandsError;
        setBrands((brandsData || []) as Brand[]);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cargar categorías hijas cuando se selecciona una categoría padre
  useEffect(() => {
    const loadChildCategories = async () => {
      if (!filters.categoriaProposito) {
        setChildCategories([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('parent_id', parseInt(filters.categoriaProposito))
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Error cargando categorías hijas:', error);
          return;
        }

        setChildCategories(data || []);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadChildCategories();
  }, [filters.categoriaProposito]);

  // fetch models when brand changes
  useEffect(() => {
    const fetchModels = async () => {
      if (!filters.marca) {
        setModels([]);
        return;
      }

      setLoadingModels(true);
      try {
        const { data: modelsData, error: modelsError } = await supabase
          .from("models")
          .select("*")
          .eq("brand_id", filters.marca)
          .order("sort_order");
        if (modelsError) throw modelsError;
        setModels((modelsData || []) as Model[]);
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [filters.marca]);

  // handlers
  const handleFilterChange = (filterType: keyof FiltersState, value: string) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [filterType]: value };
      
      // Si cambia la categoría de propósito, resetear categoría de vehículo
      if (filterType === 'categoriaProposito') {
        newFilters.categoriaVehiculo = '';
      }
      
      // Si cambia la marca, resetear modelo
      if (filterType === 'marca') {
        newFilters.modelo = '';
      }
      
      return newFilters;
    });
  };

  // navigate to vehicles page with filters
  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    
    // Determinar qué categoría usar basado en el estado actual
    let categoryToUse = null;
    if (filters.categoriaVehiculo) {
      // Si hay categoría hija seleccionada, usar esa
      categoryToUse = filters.categoriaVehiculo;
    } else if (filters.categoriaProposito) {
      // Si solo hay categoría padre, usar esa
      categoryToUse = filters.categoriaProposito;
    }
    
    if (categoryToUse) {
      queryParams.set('category_id', categoryToUse);
    }
    if (filters.marca) {
      queryParams.set('brand_id', filters.marca);
    }
    if (filters.modelo) {
      queryParams.set('model_id', filters.modelo);
    }
    
    navigate(`/vehicles?${queryParams.toString()}`);
  };

  // Manejar click en categoría padre
  const handleParentCategoryClick = (categoryId: number) => {
    const newFilters = {
      ...filters,
      categoriaProposito: categoryId.toString(),
      categoriaVehiculo: ""
    };
    setFilters(newFilters);
    
    // Navegar inmediatamente a la página de vehículos con category_id (no categoriaProposito)
    const queryParams = new URLSearchParams();
    queryParams.set('category_id', categoryId.toString());
    if (newFilters.marca) {
      queryParams.set('brand_id', newFilters.marca);
    }
    if (newFilters.modelo) {
      queryParams.set('model_id', newFilters.modelo);
    }
    
    navigate(`/vehicles?${queryParams.toString()}`);
  };

  // Manejar click en categoría hija
  const handleCategoryClick = (categoryId: number) => {
    const newFilters = {
      ...filters,
      categoriaVehiculo: categoryId.toString()
    };
    setFilters(newFilters);
    
    // Navegar a la página de vehículos con category_id (no categoriaVehiculo)
    const queryParams = new URLSearchParams();
    queryParams.set('category_id', categoryId.toString());
    if (filters.categoriaProposito) {
      // No incluir categoriaProposito en URL ya que category_id es suficiente
    }
    if (newFilters.marca) {
      queryParams.set('brand_id', newFilters.marca);
    }
    if (newFilters.modelo) {
      queryParams.set('model_id', newFilters.modelo);
    }
    
    navigate(`/vehicles?${queryParams.toString()}`);
  };

  if (loading) return <HomeSkeleton />;

  // Static testimonials (could be moved to CMS later)
  const testimonials = [
    {
      id: 1,
      name: "María González",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face&auto=format",
      comment:
        "Excelente servicio, encontré el auto perfecto para mi familia. El proceso fue muy fácil y transparente.",
    },
    {
      id: 2,
      name: "Carlos Mendoza",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
      comment:
        "La atención al cliente es excepcional. Me ayudaron en cada paso del proceso de financiamiento.",
    },
    {
      id: 3,
      name: "Ana Rodríguez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format",
      comment:
        "Recomiendo totalmente MOBA RENTING. Precios justos y vehículos de calidad garantizada.",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero */}
      <HeroBanner 
        images={config?.hero_banner_urls || []} 
        fallbackImage={heroBg}
      />

      {/* Filtros */}
      <VehicleSearchFilters
        parentCategories={parentCategories}
        childCategories={childCategories}
        marcas={brands}
        models={models}
        filters={filters}
        loadingModels={loadingModels}
        onChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Categorías destacadas (dinámicas con lógica de dos niveles) */}
      <FeaturedCategories
        parentCategories={parentCategories}
        childCategories={childCategories}
        filters={filters}
        onParentCategoryClick={handleParentCategoryClick}
        onCategoryClick={handleCategoryClick}
      />

      {/* Pasos de Renting */}
      <MobaSteps
        watermarkText="MOBA"
      />


      {/* Beneficios */}
      {config?.b2c_benefits_url && config?.b2b_benefits_url && (
        <BenefitsSection
          b2cImage={config.b2c_benefits_url}
          b2bImage={config.b2b_benefits_url}
        />
      )}

      {/* Testimonios */}
      <Testimonials testimonials={testimonials} />

      {/* FAQs (traídas de BD) */}
      <FaqSection faqs={config?.faqs || []} />
    </div>
  );
};

export default HomePage;