import { useState } from 'react';
import { type Review } from '../types';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  reviews: Review[];
}

export default function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((i) => (i + 1) % reviews.length);
  const prev = () => setActiveIndex((i) => (i - 1 + reviews.length) % reviews.length);

  if (reviews.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900">
            What Our Customers Say
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gray-50 rounded-3xl p-8 sm:p-12">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-primary-200" />
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                {reviews[activeIndex].avatar || reviews[activeIndex].name.charAt(0)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < reviews[activeIndex].rating ? 'text-accent-400 fill-accent-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-lg text-dark-700 leading-relaxed mb-6 italic">
                "{reviews[activeIndex].comment}"
              </p>
              <div>
                <div className="font-bold text-dark-900">{reviews[activeIndex].name}</div>
                <div className="text-sm text-dark-700">{reviews[activeIndex].route}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={prev}
              className="p-2 rounded-full bg-gray-100 hover:bg-primary-100 hover:text-primary-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-primary-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
            <button
              onClick={next}
              className="p-2 rounded-full bg-gray-100 hover:bg-primary-100 hover:text-primary-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
