import { IMAGES } from '../constants/images';

const services = [
  {
    title: 'Cross-Border Trips',
    description: 'Experience the ease and convenience of cross-border travel with Trinity Express. We connect key cities across East Africa with reliable transportation services.',
    image: IMAGES.crossBorderTrips,
  },
  {
    title: 'Cross-Border Delivery',
    description: 'Trinity Cross-Border Delivery provides a convenient and reliable service for sending items across Kenya, Rwanda, Uganda, and Sudan.',
    image: IMAGES.crossBorderDelivery,
  },
  {
    title: 'Luggages',
    description: 'At Trinity, we strive to make your journey as comfortable and hassle-free as possible with our reliable luggage handling services.',
    image: IMAGES.luggages,
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Our Services</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">
            What We Provide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-100/50 transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary-900 mb-3">{service.title}</h3>
                  <p className="text-sm text-dark-700 leading-relaxed">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
