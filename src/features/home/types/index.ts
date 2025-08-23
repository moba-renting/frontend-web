export interface HomePageConfig {
  hero_banner_urls: string[];
  b2b_benefits_url: string | null;
  b2c_benefits_url: string | null;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface Category {
  id: number;
  name: string;
  image_url: string;
  sort_order: number;
  parent_id: number | null;
}

export interface Brand {
  id: number;
  name: string;
  sort_order: number;
}

export interface Model {
  id: number;
  name: string;
  brand_id: number;
  sort_order: number;
}

export interface FiltersState {
  categoriaProposito: string;
  categoriaVehiculo: string;
  marca: string;
  modelo: string;
}
