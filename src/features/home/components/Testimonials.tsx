import React from "react";

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  comment: string;
}

interface Props {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<Props> = ({ testimonials }) => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Lo que dicen nuestros clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-200">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-gray-700 italic mb-4">"{testimonial.comment}"</p>
              <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;