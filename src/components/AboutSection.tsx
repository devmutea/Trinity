import { Check } from 'lucide-react';
import { IMAGES } from '../constants/images';

const features = [
  'Real-time seat availability and booking',
  'Multiple bus operators and route options',
  'Secure online payment processing',
  'Instant ticket confirmation via email',
  '24/7 customer support assistance',
  'Easy rescheduling and cancellation',
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <div className="bg-secondary-100 rounded-2xl overflow-hidden h-48">
                  <img
                    src={IMAGES.crossBorderExpertise}
                    alt="Cross-border expertise"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-accent-100 rounded-2xl overflow-hidden h-64">
                  <img
                    src={IMAGES.crossBorderTrips}
                    alt="Cross-border trips"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-primary-100 rounded-2xl overflow-hidden h-64">
                  <img
                    src={IMAGES.customerCentric}
                    alt="Customer centric service"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-gray-200 rounded-2xl overflow-hidden h-48">
                  <img
                    src={IMAGES.fastReliable}
                    alt="Fast & reliable journey"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-xs font-medium">Routes</div>
              </div>
            </div>
          </div>

          <div>
            <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">About Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-6">
              Simplifying Bus Ticket Booking & Seat Reservation
            </h2>
            <p className="text-dark-700 leading-relaxed mb-8">
              We provide a powerful solution designed to streamline bus ticket bookings and seat reservations. Our platform connects you with the best bus operators across Bangladesh, ensuring a comfortable and reliable journey every time.
            </p>
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-dark-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <button className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-md">
              More About Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
