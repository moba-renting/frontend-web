import React from "react";
import type{ HomePageConfig } from "../types/index";

interface Props {
  faqs: HomePageConfig["faqs"];
}

const FaqSection: React.FC<Props> = ({ faqs }) => {
  if (!faqs?.length) return null;
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;