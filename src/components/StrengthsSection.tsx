import { IMAGES } from '../constants/images';

export default function StrengthsSection() {
  const strengths = [
    {
      title: 'Fast & Reliable',
      description: 'We ensure your trips and deliveries are on time, every time, with our dedicated fleet and professional staff. Reliability is at the heart of everything we do, so you can travel or send items with confidence.',
      image: IMAGES.fastReliable,
    },
    {
      title: 'Customer-Centric Service',
      description: 'Our focus is always on your comfort and convenience. We listen, adapt, and deliver a service that exceeds expectations, making sure every journey or delivery feels seamless and stress-free.',
      image: IMAGES.customerCentric,
    },
    {
      title: 'Cross-Border Expertise',
      description: 'With extensive experience across East Africa, we handle customs, regulations, and logistics seamlessly. From Kenya to Uganda, Rwanda, and beyond, we make cross-border travel and deliveries smooth and worry-free.',
      image: IMAGES.crossBorderExpertise,
    },
  ];

  return (
    <section id="strengths" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Our Strengths</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">
            What Sets Us Apart
          </h2>
        </div>

        <div className="space-y-20 lg:space-y-28">
          {strengths.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              >
                <div
                  className={`relative h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-sm border border-gray-100/50 ${
                    isEven ? 'lg:order-first' : 'lg:order-last'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`flex flex-col justify-center ${isEven ? 'lg:pl-8' : 'lg:pr-8'}`}>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-primary-900 tracking-wide mb-4 uppercase">
                    {item.title}
                  </h3>
                  <p className="text-dark-700 text-base sm:text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
