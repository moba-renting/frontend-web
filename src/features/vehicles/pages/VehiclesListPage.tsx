import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { MdFilterList } from "react-icons/md";
import { supabase } from "../../../core/services/supabase";
import { VehicleListFilters, VehicleListGrid, VehicleListRentalSimulator } from "../components";
import type { Vehicle, AvailableFilters, Filters, SimulationParams, FuelType, TransmissionType, TractionType } from "../types";

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
  const [simulationLoading, setSimulationLoading] = useState(false);
  
  // Estados locales para filtros personalizados
  const [customYearMin, setCustomYearMin] = useState<string>('');
  const [customYearMax, setCustomYearMax] = useState<string>('');

  // Obtener filtros de los query parameters
  const getFiltersFromURL = useCallback((): Filters => {
    const filters: Filters = {};
    
    const brand_id = searchParams.get('brand_id');
    const model_id = searchParams.get('model_id');
    const category_id = searchParams.get('category_id');
    const fuel = searchParams.get('fuel');
    const dealership_id = searchParams.get('dealership_id');
    const year_min = searchParams.get('year_min');
    const year_max = searchParams.get('year_max');
    const transmission = searchParams.get('transmission');
    const traction = searchParams.get('traction');
    const page = searchParams.get('page');

    if (brand_id) filters.brand_id = parseInt(brand_id);
    if (model_id) filters.model_id = parseInt(model_id);
    if (category_id) filters.category_id = parseInt(category_id);
    if (fuel) filters.fuel = fuel as FuelType;
    if (dealership_id) filters.dealership_id = parseInt(dealership_id);
    if (year_min) filters.year_min = parseInt(year_min);
    if (year_max) filters.year_max = parseInt(year_max);
    if (transmission) filters.transmission = transmission as TransmissionType;
    if (traction) filters.traction = traction as TractionType;

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
    if (newFilters.fuel) params.set('fuel', newFilters.fuel);
    if (newFilters.dealership_id) params.set('dealership_id', newFilters.dealership_id.toString());
    if (newFilters.year_min) params.set('year_min', newFilters.year_min.toString());
    if (newFilters.year_max) params.set('year_max', newFilters.year_max.toString());
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

  // Limpiar inputs personalizados cuando se selecciona un rango predefinido
  const clearCustomInputs = (type: 'year') => {
    if (type === 'year') {
      setCustomYearMin('');
      setCustomYearMax('');
    }
  };

  // Cargar filtros disponibles
  const loadAvailableFilters = async (currentFilters: Filters = {}) => {
    try {
      const { data, error } = await supabase.rpc('get_available_filters', {
        p_brand_id: currentFilters.brand_id || null,
        p_model_id: currentFilters.model_id || null,
        p_category_id: currentFilters.category_id || null,
        p_fuel: currentFilters.fuel || null,
        p_dealership_id: currentFilters.dealership_id || null,
        p_year_min: currentFilters.year_min || null,
        p_year_max: currentFilters.year_max || null,
        p_transmission: currentFilters.transmission || null,
        p_traction: currentFilters.traction || null,
      });

      if (error) throw error;
      
      // Los datos vienen directamente como el objeto de filtros disponibles
      setAvailableFilters(data || {});
    } catch (error) {
      console.error('Error loading available filters:', error);
    }
  };

  // Cargar vehículos con simulación
  const loadVehicles = async (currentFilters: Filters = {}, page: number = 1, simulationParams?: SimulationParams) => {
    setLoadingVehicles(true);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const { data, error } = await supabase.rpc('get_vehicles_by_filters', {
        p_brand_id: currentFilters.brand_id || null,
        p_model_id: currentFilters.model_id || null,
        p_category_id: currentFilters.category_id || null,
        p_fuel: currentFilters.fuel || null,
        p_dealership_id: currentFilters.dealership_id || null,
        p_year_min: currentFilters.year_min || null,
        p_year_max: currentFilters.year_max || null,
        p_transmission: currentFilters.transmission || null,
        p_traction: currentFilters.traction || null,
        p_page_size: ITEMS_PER_PAGE,
        p_offset: offset,
        p_years: simulationParams?.years || 2,
        p_km_per_year: simulationParams?.km_per_year || 15000,
        p_client_type: simulationParams?.client_type || 'mype',
        p_driver_score: simulationParams?.driver_score || 'good'
      });

      if (error) throw error;
      
      // Los datos vienen como un objeto JSON con total_count y vehicles
      setVehicles(data.vehicles || []);
      setTotalCount(data.total_count || 0);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setVehicles([]);
      setTotalCount(0);
    } finally {
      setLoadingVehicles(false);
    }
  };

  // Función para manejar simulación
  const handleSimulation = async (simulationParams: SimulationParams) => {
    setSimulationLoading(true);
    await loadVehicles(filters, currentPage, simulationParams);
    setSimulationLoading(false);
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
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="h-8 w-64 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-5 w-48 bg-gray-300 rounded mt-2 animate-pulse"></div>
            </div>
            <div className="md:hidden h-10 w-24 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>

          <div className="flex gap-6">
            {/* Sidebar Skeleton */}
            <div className="w-64 flex-shrink-0 space-y-4">
              <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Skeleton */}
            <main className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-300"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-6 bg-green-200 rounded w-1/3"></div>
                      <div className="flex gap-2">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="flex justify-center mt-8">
                <div className="h-10 w-32 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </main>
          </div>
        </div>
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
          <VehicleListFilters
            availableFilters={availableFilters}
            filters={filters}
            showFilters={showFilters}
            customYearMin={customYearMin}
            customYearMax={customYearMax}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            onCustomYearMinChange={setCustomYearMin}
            onCustomYearMaxChange={setCustomYearMax}
            onApplyCustomYearFilter={applyCustomYearFilter}
            onClearCustomInputs={clearCustomInputs}
          />

          {/* Contenido principal */}
          <main className="flex-1">
            {/* Simulador de renta */}
            <VehicleListRentalSimulator 
              onSimulate={handleSimulation}
              loading={simulationLoading}
            />
            
            <VehicleListGrid
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
