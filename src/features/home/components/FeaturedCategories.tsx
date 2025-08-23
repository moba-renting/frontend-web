import React from "react";
import yango from "../../../assets/images/yango.png";
import rappi from "../../../assets/images/rappi.png";
import mypes from "../../../assets/images/mypes.png";
import empresas from "../../../assets/images/empresas.png";

interface CategoryItem {
  id: string;
  name: string;
  desc: string;
  image_url: string;
}

interface CategoriesGridProps {
  onCategoryClick?: (id: string) => void;
}

const defaultItems: CategoryItem[] = [
  { id: "taxi", name: "Taxi App", desc: "Movilidad rápida y segura en la ciudad", image_url: yango },
  { id: "motos", name: "Motos Delivery", desc: "Entrega veloz para tu negocio", image_url: rappi },
  { id: "mypes", name: "Mypes", desc: "Entrega veloz para tu negocio", image_url: mypes },
  { id: "empresas", name: "Adquiere tu flota con Moba", desc: "Entrega veloz para tu negocio", image_url: empresas },
];

const FeaturedCategories: React.FC<CategoriesGridProps> = ({ onCategoryClick }) => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Categorías de Vehículos</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {defaultItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onCategoryClick?.(item.id)}
              className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all cursor-pointer max-w-xs mx-auto"
            >
              <div className="aspect-square">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-4">
                <h3 className="text-white text-lg font-semibold drop-shadow">{item.name}</h3>
                <p className="text-white text-sm opacity-90">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;