// components/home/BenefitsSection.tsx
import React from "react";

interface BenefitsSectionProps {
  b2cImage: string;
  b2bImage: string;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ b2cImage, b2bImage }) => {
  return (
    <>
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full h-48 md:h-64 bg-gray-200 rounded-lg overflow-hidden mb-8">
            <img
              src={b2cImage}
              alt="Beneficios para clientes"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full h-48 md:h-64 bg-gray-200 rounded-lg overflow-hidden mb-8">
            <img
              src={b2bImage}
              alt="Beneficios para empresas"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default BenefitsSection;