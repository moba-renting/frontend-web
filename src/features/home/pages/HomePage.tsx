import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../core/services/supabase";
import heroBg from "../../../assets/images/portada.png";

// types
import type{ Brand, Model, HomePageConfig, FiltersState } from "../types/index";

// components
import HeroBanner from "../components/HeroBanner";
import VehicleFilters from "../components/VehicleSearchFilters";
import FeaturedCategories from "../components/FeaturedCategories";
import Testimonials from "../components/Testimonials";
import FaqSection from "../components/FaqSection";
import HomeSkeleton from "../components/HomeSkeleton";
import BenefitsSection from "../components/BenefitsSection";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // state
  const [config, setConfig] = useState<HomePageConfig | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FiltersState>({
    condicion: "",
    marca: "",
    modelo: "",
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

        // Fetch brands ordered by sort_order (only active brands)
        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("*")
          .eq("is_active", true)
          .order("sort_order");
        if (brandsError) throw brandsError;
        setBrands((brandsData || []) as Brand[]);

        // Nota: también traías categories, pero tu grid actual es estático.
        // Si luego deseas renderizar categorías de BD, aquí ya tendrías esa data.
        await supabase
          .from("categories")
          .select("*")
          .eq("is_active", true)
          .order("sort_order");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          .eq("is_active", true)
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
    setFilters((prev) => {
      const next = { ...prev, [filterType]: value } as FiltersState;
      if (filterType === "marca") next.modelo = ""; // reset modelo al cambiar marca
      return next;
    });
  };

  // navigate to vehicles page with filters
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.condicion) params.set("condition", filters.condicion);
    if (filters.marca) params.set("brand_id", filters.marca);
    if (filters.modelo) params.set("model_id", filters.modelo);
    navigate(`/vehicles?${params.toString()}`);
  };

  const handleCategoryClick = (categoryId: string | number) => {
    navigate(`/vehicles?category_id=${categoryId}`);
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
      <HeroBanner images={config?.hero_banner_urls || []} fallbackImage={heroBg} />

      {/* Filtros */}
      <VehicleFilters
        brands={brands}
        models={models}
        filters={filters}
        loadingModels={loadingModels}
        onChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Categorías destacadas (estáticas como en tu versión actual) */}
      <FeaturedCategories onCategoryClick={(id) => handleCategoryClick(id)} />

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