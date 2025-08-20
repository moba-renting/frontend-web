// Interfaces compartidas para el feature de vehículos

export interface Vehicle {
  id: number;
  nombre: string;
  image_urls: string[];
  combustible: string;
  transmision: string;
  kilometraje: number;
  precio: number;
}

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
  conditions?: FilterOption[];
  transmissions?: FilterOption[];
  tractions?: FilterOption[];
  year_ranges?: RangeFilterOption[];
  mileage_ranges?: RangeFilterOption[];
}

export interface VehiclesResponse {
  total_count: number;
  vehicles: Vehicle[];
}

export interface Filters {
  brand_id?: number;
  model_id?: number;
  category_id?: number;
  condition?: string;
  dealership_id?: number;
  year_min?: number;
  year_max?: number;
  mileage_min?: number;
  mileage_max?: number;
  transmission?: string;
  traction?: string;
}
