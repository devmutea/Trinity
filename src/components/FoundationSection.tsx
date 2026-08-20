import { IMAGES } from '../constants/images';

export default function FoundationSection() {
  const cards = [
    {
      title: 'Vision',
      description: 'To be the leading provider of reliable and efficient cross-border transportation in the region.',
      image: IMAGES.vision,
    },
    {
      title: 'Mission',
      description: 'To connect communities and foster economic growth through enhanced trade, tourism, and people-to-people connections.',
      image: IMAGES.mission,
    },
    {
      title: 'Values',
      description: 'Reliability, Safety, Comfort, Customer Focus, Innovation.',
      image: IMAGES.values,
    },
  ];

  return (
    <section id="foundation" className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Our Foundation</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">
            Mission, Vision & Values
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            return (
              <div
                key={index}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100/80 transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-primary-900 mb-3">{card.title}</h3>
                  <p className="text-dark-700 leading-relaxed text-sm sm:text-base">
                    {card.description}
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

