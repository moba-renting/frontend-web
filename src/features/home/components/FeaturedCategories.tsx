import React from "react";
import type { Category } from "../types";

interface FeaturedCategoriesProps {
  parentCategories: Category[];
  childCategories: Category[];
  filters: {
    categoriaProposito: string;
  };
  onParentCategoryClick: (categoryId: number) => void;
  onCategoryClick: (categoryId: number) => void;
}

const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  parentCategories,
  childCategories,
  filters,
  onParentCategoryClick,
  onCategoryClick,
}) => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Categorías de Vehículos</h2>
        
        {/* Categorías - Dinámicas (Padre o Hijas según selección de filtros) */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Si hay categoría padre seleccionada EN LOS FILTROS, mostrar categorías hijas */}
          {filters.categoriaProposito && childCategories.length > 0 ? (
            /* Categorías Hijas */
            childCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => onCategoryClick(category.id)}
                className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all cursor-pointer max-w-xs mx-auto"
              >
                <div className="aspect-square">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-4">
                  <h3 className="text-white text-lg font-semibold drop-shadow">{category.name}</h3>
                  <p className="text-white text-sm opacity-90">Vehículos especializados</p>
                </div>
              </div>
            ))
          ) : (
            /* Si no hay categoría padre seleccionada EN LOS FILTROS, mostrar categorías padre */
            parentCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => onParentCategoryClick(category.id)}
                className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all cursor-pointer max-w-xs mx-auto"
              >
                <div className="aspect-square">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-4">
                  <h3 className="text-white text-lg font-semibold drop-shadow">{category.name}</h3>
                  <p className="text-white text-sm opacity-90">Encuentra tu vehículo ideal</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;