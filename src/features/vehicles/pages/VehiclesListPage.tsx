import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { MdFilterList } from "react-icons/md";
import { supabase } from "../../../core/services/supabase";
import { VehicleFilters, VehicleList } from "../components";
import type { Vehicle, AvailableFilters, VehiclesResponse, Filters } from "../types";

const ITEMS_PER_PAGE = 12;

const VehiclesListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters>({});
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados locales para filtros personalizados
  const [customYearMin, setCustomYearMin] = useState<string>('');
  const [customYearMax, setCustomYearMax] = useState<string>('');
  const [customMileageMin, setCustomMileageMin] = useState<string>('');
  const [customMileageMax, setCustomMileageMax] = useState<string>('');

  // Obtener filtros de los query parameters
  const getFiltersFromURL = useCallback((): Filters => {
    const filters: Filters = {};
    
    const brand_id = searchParams.get('brand_id');
    const model_id = searchParams.get('model_id');
    const category_id = searchParams.get('category_id');
    const condition = searchParams.get('condition');
    const dealership_id = searchParams.get('dealership_id');
    const year_min = searchParams.get('year_min');
    const year_max = searchParams.get('year_max');
    const mileage_min = searchParams.get('mileage_min');
    const mileage_max = searchParams.get('mileage_max');
    const transmission = searchParams.get('transmission');
    const traction = searchParams.get('traction');
    const page = searchParams.get('page');

    if (brand_id) filters.brand_id = parseInt(brand_id);
    if (model_id) filters.model_id = parseInt(model_id);
    if (category_id) filters.category_id = parseInt(category_id);
    if (condition) filters.condition = condition;
    if (dealership_id) filters.dealership_id = parseInt(dealership_id);
    if (year_min) filters.year_min = parseInt(year_min);
    if (year_max) filters.year_max = parseInt(year_max);
    if (mileage_min) filters.mileage_min = parseInt(mileage_min);
    if (mileage_max) filters.mileage_max = parseInt(mileage_max);
    if (transmission) filters.transmission = transmission;
    if (traction) filters.traction = traction;

    if (page) {
      const pageNum = parseInt(page);
      if (pageNum > 0) setCurrentPage(pageNum);
    }

    return filters;
  }, [searchParams]);

  // Actualizar query parameters
  const updateURLParams = (newFilters: Filters, page: number = 1) => {
    const params = new URLSearchParams();
    
    if (newFilters.brand_id) params.set('brand_id', newFilters.brand_id.toString());
    if (newFilters.model_id) params.set('model_id', newFilters.model_id.toString());
    if (newFilters.category_id) params.set('category_id', newFilters.category_id.toString());
    if (newFilters.condition) params.set('condition', newFilters.condition);
    if (newFilters.dealership_id) params.set('dealership_id', newFilters.dealership_id.toString());
    if (newFilters.year_min) params.set('year_min', newFilters.year_min.toString());
    if (newFilters.year_max) params.set('year_max', newFilters.year_max.toString());
    if (newFilters.mileage_min) params.set('mileage_min', newFilters.mileage_min.toString());
    if (newFilters.mileage_max) params.set('mileage_max', newFilters.mileage_max.toString());
    if (newFilters.transmission) params.set('transmission', newFilters.transmission);
    if (newFilters.traction) params.set('traction', newFilters.traction);
    if (page > 1) params.set('page', page.toString());

    setSearchParams(params);
  };

  // Aplicar filtros personalizados de año
  const applyCustomYearFilter = () => {
    const yearMin = customYearMin ? parseInt(customYearMin) : undefined;
    const yearMax = customYearMax ? parseInt(customYearMax) : undefined;
    
    handleFilterChange({
      year_min: yearMin,
      year_max: yearMax
    });
  };

  // Aplicar filtros personalizados de kilometraje
  const applyCustomMileageFilter = () => {
    const mileageMin = customMileageMin ? parseInt(customMileageMin) : undefined;
    const mileageMax = customMileageMax ? parseInt(customMileageMax) : undefined;
    
    handleFilterChange({
      mileage_min: mileageMin,
      mileage_max: mileageMax
    });
  };

  // Limpiar inputs personalizados cuando se selecciona un rango predefinido
  const clearCustomInputs = (type: 'year' | 'mileage') => {
    if (type === 'year') {
      setCustomYearMin('');
      setCustomYearMax('');
    } else {
      setCustomMileageMin('');
      setCustomMileageMax('');
    }
  };

  // Cargar filtros disponibles
  const loadAvailableFilters = async (currentFilters: Filters = {}) => {
    try {
      const { data, error } = await supabase.rpc('get_available_filters', {
        p_brand_id: currentFilters.brand_id || null,
        p_model_id: currentFilters.model_id || null,
        p_category_id: currentFilters.category_id || null,
        p_condition: currentFilters.condition || null,
        p_dealership_id: currentFilters.dealership_id || null,
        p_year_min: currentFilters.year_min || null,
        p_year_max: currentFilters.year_max || null,
        p_mileage_min: currentFilters.mileage_min || null,
        p_mileage_max: currentFilters.mileage_max || null,
        p_transmission: currentFilters.transmission || null,
        p_traction: currentFilters.traction || null,
      });

      if (error) throw error;
      setAvailableFilters(data || {});
    } catch (error) {
      console.error('Error loading available filters:', error);
    }
  };

  // Cargar vehículos
  const loadVehicles = async (currentFilters: Filters = {}, page: number = 1) => {
    setLoadingVehicles(true);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const { data, error } = await supabase.rpc('get_vehicles_by_filters', {
        p_brand_id: currentFilters.brand_id || null,
        p_model_id: currentFilters.model_id || null,
        p_category_id: currentFilters.category_id || null,
        p_condition: currentFilters.condition || null,
        p_dealership_id: currentFilters.dealership_id || null,
        p_year_min: currentFilters.year_min || null,
        p_year_max: currentFilters.year_max || null,
        p_mileage_min: currentFilters.mileage_min || null,
        p_mileage_max: currentFilters.mileage_max || null,
        p_transmission: currentFilters.transmission || null,
        p_traction: currentFilters.traction || null,
        p_page_size: ITEMS_PER_PAGE,
        p_offset: offset,
      });

      if (error) throw error;
      
      const response = data as VehiclesResponse;
      setVehicles(response.vehicles || []);
      setTotalCount(response.total_count || 0);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setVehicles([]);
      setTotalCount(0);
    } finally {
      setLoadingVehicles(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      // Obtener filtros de la URL
      const urlFilters = getFiltersFromURL();
      setFilters(urlFilters);
      
      await Promise.all([
        loadAvailableFilters(urlFilters),
        loadVehicles(urlFilters, currentPage)
      ]);
      setLoading(false);
    };
    loadInitialData();
  }, [getFiltersFromURL, currentPage]);

  // Manejar cambio de filtros
  const handleFilterChange = async (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    
    // Lógica especial para marca/modelo - solo uno puede estar activo
    if (newFilters.brand_id !== undefined) {
      delete updatedFilters.model_id; // Limpiar modelo cuando se cambia marca
    }
    if (newFilters.model_id !== undefined) {
      delete updatedFilters.brand_id; // Limpiar marca cuando se cambia modelo
    }
    
    setFilters(updatedFilters);
    setCurrentPage(1);
    
    // Actualizar URL
    updateURLParams(updatedFilters, 1);
    
    // Cargar filtros disponibles y vehículos en paralelo
    await Promise.all([
      loadAvailableFilters(updatedFilters),
      loadVehicles(updatedFilters, 1)
    ]);
  };

  // Limpiar filtros
  const clearFilters = async () => {
    const emptyFilters: Filters = {};
    setFilters(emptyFilters);
    setCurrentPage(1);
    
    // Limpiar URL
    setSearchParams(new URLSearchParams());
    
    await Promise.all([
      loadAvailableFilters(),
      loadVehicles()
    ]);
  };

  // Manejar cambio de página
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    updateURLParams(filters, page);
    await loadVehicles(filters, page);
  };

  // Calcular número total de páginas
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">Cargando vehículos...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehículos Disponibles</h1>
            <p className="text-gray-600 mt-1">
              {totalCount} vehículo{totalCount !== 1 ? 's' : ''} encontrado{totalCount !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Botón de filtros móvil */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50"
          >
            <MdFilterList className="w-5 h-5" />
            Filtros
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar de filtros */}
          <VehicleFilters
            availableFilters={availableFilters}
            filters={filters}
            showFilters={showFilters}
            customYearMin={customYearMin}
            customYearMax={customYearMax}
            customMileageMin={customMileageMin}
            customMileageMax={customMileageMax}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            onCustomYearMinChange={setCustomYearMin}
            onCustomYearMaxChange={setCustomYearMax}
            onCustomMileageMinChange={setCustomMileageMin}
            onCustomMileageMaxChange={setCustomMileageMax}
            onApplyCustomYearFilter={applyCustomYearFilter}
            onApplyCustomMileageFilter={applyCustomMileageFilter}
            onClearCustomInputs={clearCustomInputs}
          />

          {/* Contenido principal */}
          <main className="flex-1">
            <VehicleList
              vehicles={vehicles}
              loadingVehicles={loadingVehicles}
              currentPage={currentPage}
              totalPages={totalPages}
              filters={filters}
              onPageChange={handlePageChange}
              onClearFilters={clearFilters}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default VehiclesListPage;
