// Interfaces compartidas para el feature de vehículos

// Enums que coinciden con la BD
export type FuelType = 'Gasoline' | 'Diesel' | 'Hybrid' | 'Electric';
export type TractionType = 'FWD' | 'RWD' | 'AWD' | '4WD';
export type TransmissionType = 'Manual' | 'Automatic' | 'CVT' | 'Semi-Automatic';
export type DriverScore = 'good' | 'bad';
export type CustomerType = 'app_driver' | 'mype' | 'corporate';

// Interfaz de simulación de renta
export interface RentalSimulation {
  devaluacion_pct: number;
  valor_residual: number;
  seguro_mensual: number;
  impuesto_mensual: number;
  rtv_mensual: number;
  soat_mensual: number;
  mantenimiento_mensual: number;
  subtotal_mensual: number;
  ganancia_mensual: number;
  cuota_final_mensual: number;
}

// Parámetros de simulación
export interface SimulationParams {
  years: number;
  km_per_year: number;
  client_type: CustomerType;
  driver_score: DriverScore;
}

// Interfaces principales de vehículos
export interface Vehicle {
  id: number;
  nombre: string;
  image_urls?: string[];
  rental_simulation?: RentalSimulation;
}

export interface VehicleDetail extends Vehicle {
  marca: string;
  modelo: string;
  year: number;
  color: string;
  plazas: number;
  cilindrada: string;
  potencia: string;
  traccion: string;
  categoria: string;
  descripcion?: string;
  caracteristicas?: string[];
  equipamiento?: string[];
  concesionario?: {
    nombre: string;
    telefono: string;
    direccion: string;
  };
}

// Interfaces para datos de Supabase
export interface VehicleDataFromDB {
  id: number;
  vehicle_price: number;
  annual_insurance_price: number;
  low_mileage_rate_per_km: number;
  medium_mileage_rate_per_km: number;
  high_mileage_rate_per_km: number;
  image_urls: string[];
  year: number;
  fuel: string;
  edition: string;
  traction: string;
  transmission: string;
  is_active: boolean;
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
    is_active?: boolean;
  };
}

// Interface para colores de vehículos
export interface VehicleColor {
  color_id: number;
  name: string;
  hex_code: string;
  stock_quantity: number;
}

// Interfaces para filtros
export interface FilterOption {
  id?: number;
  name: string;
  count: number;
}

export interface RangeFilterOption {
  range: string;
  min: number;
  max: number;
  count: number;
}

export interface AvailableFilters {
  brands?: FilterOption[];
  models?: FilterOption[];
  categories?: FilterOption[];
  dealerships?: FilterOption[];
  fuels?: FilterOption[];
  transmissions?: FilterOption[];
  tractions?: FilterOption[];
  year_ranges?: RangeFilterOption[];
}

export interface Filters {
  brand_id?: number;
  model_id?: number;
  category_id?: number;
  fuel?: FuelType;
  dealership_id?: number;
  year_min?: number;
  year_max?: number;
  transmission?: TransmissionType;
  traction?: TractionType;
}

// Interfaces de respuestas de API
export interface VehiclesResponse {
  total_count: number;
  vehicles: Vehicle[];
}

// Interfaces para comparación de vehículos
export interface ComparisonItem {
  icon: React.ReactNode;
  label: string;
  getValue: (vehicle: VehicleDataFromDB) => string | number;
  format?: (value: string | number) => string;
}

// Props de componentes
export interface VehicleListFiltersProps {
  availableFilters: AvailableFilters;
  filters: Filters;
  showFilters: boolean;
  customYearMin: string;
  customYearMax: string;
  onFilterChange: (newFilters: Partial<Filters>) => void;
  onClearFilters: () => void;
  onCustomYearMinChange: (value: string) => void;
  onCustomYearMaxChange: (value: string) => void;
  onApplyCustomYearFilter: () => void;
  onClearCustomInputs: (type: 'year') => void;
}

export interface VehicleListGridProps {
  vehicles: Vehicle[];
  loadingVehicles: boolean;
  currentPage: number;
  totalPages: number;
  filters: Filters;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export interface VehicleListRentalSimulatorProps {
  onSimulate: (params: SimulationParams) => void;
  loading?: boolean;
}

export interface VehicleDetailGalleryProps {
  vehicle: VehicleDetail;
}

export interface VehicleDetailRentalSimulatorProps {
  vehicle: VehicleDetail;
  vehiclePrice: number;
  annualInsurancePrice: number;
  lowMileageRate: number;
  mediumMileageRate: number;
  highMileageRate: number;
}

export interface CompareButtonProps {
  vehicleId: number;
}
