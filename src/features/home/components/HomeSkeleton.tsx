import React from "react";

const HomeSkeleton: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Banner Skeleton */}
      <section className="relative w-full h-96 bg-gray-900">
        <div className="w-full h-full bg-gray-700 animate-pulse"></div>
      </section>

      {/* Filtros Skeleton */}
      <section className="-mt-16 relative z-10">
        <div className="max-w-6xl mx-auto bg-white/65 backdrop-blur-md rounded-2xl shadow-xl p-6">
          <div className="h-8 bg-gray-300 rounded-lg mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 rounded-md animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías Skeleton */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-gray-300 rounded-lg mb-8 w-48 mx-auto md:mx-0 animate-pulse"></div>
          <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-300 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonios Skeleton */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-gray-300 rounded-lg mb-8 w-64 mx-auto animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-300"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Skeleton */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-300 rounded-lg mb-8 w-48 mx-auto animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-5 bg-gray-300 rounded mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSkeleton;