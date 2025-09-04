import React, { useState } from "react";
import { MdChevronLeft, MdChevronRight, MdLocalGasStation, MdSpeed, MdEvent } from "react-icons/md";
import type { VehicleDetailGalleryProps } from "../types";

const VehicleDetailGallery: React.FC<VehicleDetailGalleryProps> = ({ vehicle }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Verificar si hay imágenes disponibles
  const hasImages = vehicle.image_urls && vehicle.image_urls.length > 0;
  const images = hasImages ? vehicle.image_urls : ['https://via.placeholder.com/800x500/f3f4f6/9ca3af?text=Imagen+no+disponible'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (images?.length ?? 1) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (images?.length ?? 1) - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-6">
      {/* Galería principal */}
      <div className="relative">
        {/* Imagen principal */}
        <div className="relative aspect-[16/10] bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={images?.[currentImageIndex] ?? 'https://via.placeholder.com/800x500/f3f4f6/9ca3af?text=Imagen+no+disponible'}
            alt={`${vehicle.nombre} - Imagen ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500/f3f4f6/9ca3af?text=Imagen+no+disponible';
            }}
          />
          
          {/* Controles de navegación */}
          {hasImages && images && images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <MdChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <MdChevronRight className="w-6 h-6" />
              </button>
              
              {/* Indicador de imagen actual */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images?.length ?? 1}
              </div>
            </>
          )}
        </div>

        {/* Miniaturas */}
        {hasImages && images && images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {images?.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentImageIndex 
                    ? 'border-green-500' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x64/f3f4f6/9ca3af?text=N/A';
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Información básica del vehículo */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.nombre}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
              Nuevo 0km
            </span>
            <span>{vehicle.categoria}</span>
          </div>
        </div>

        {/* Características principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MdEvent className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Año</p>
              <p className="font-semibold">{vehicle.year}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MdLocalGasStation className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-xs text-gray-500">Estado</p>
              <p className="font-semibold">Nuevo 0km</p>
            </div>
          </div>
          
          {vehicle.rental_simulation && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <MdSpeed className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Cuota mensual</p>
                <p className="font-semibold text-green-600">
                  S/ {vehicle.rental_simulation.cuota_final_mensual.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Detalles adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Especificaciones</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Marca:</span>
                <span className="font-medium">{vehicle.marca}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Modelo:</span>
                <span className="font-medium">{vehicle.modelo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Color:</span>
                <span className="font-medium">{vehicle.color}</span>
              </div>
              {vehicle.cilindrada && vehicle.cilindrada !== '' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Versión:</span>
                  <span className="font-medium">{vehicle.cilindrada}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tracción:</span>
                <span className="font-medium">{vehicle.traccion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valor del vehículo:</span>
                <span className="font-medium text-green-600">
                  {vehicle.rental_simulation 
                    ? `S/ ${vehicle.rental_simulation.valor_residual.toLocaleString()}` 
                    : 'Consultar precio'
                  }
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Equipamiento</h3>
            <div className="space-y-2">
              {vehicle.equipamiento && vehicle.equipamiento.length > 0 ? (
                vehicle.equipamiento.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Información de equipamiento no disponible</p>
              )}
            </div>
          </div>
        </div>

        {/* Descripción */}
        {vehicle.descripcion && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">{vehicle.descripcion}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetailGallery;
