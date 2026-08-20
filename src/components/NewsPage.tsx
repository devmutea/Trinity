import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { IMAGES } from '../constants/images';

interface NewsPageProps {
  onBack: () => void;
}

const categories = ['All', 'Announcements', 'General', 'Safety'];

const newsArticles = [
  {
    category: 'Announcements',
    image: IMAGES.newsScammer,
    title: 'Beware of Scammers and Fake Websites',
    excerpt:
      'Please be aware that scammers are creating fake websites to target our customers. This is our only official website and any other website or page you see online is completely fake and are being used to steal your money. Never send money or Mobile Money (MoMo) payments to any links, phone numbers, or agents found on those unauthorized pages. Always verify who you are going to pay before sending any money.',
  },
  {
    category: 'General',
    image: IMAGES.newsQuality,
    title: 'Quality Over Speed: Why Trinity Express Stands Out',
    excerpt:
      "In logistics, cutting corners costs more than taking time. Trinity Express invests in well-maintained vehicles, proper handling procedures, and verified routes. We could be faster but not safer. We could be cheaper but not more reliable. Our commitment is to deliver your shipment exactly as promised, in perfect condition, on schedule. That's the Trinity Express standard",
  },
  {
    category: 'Safety',
    image: IMAGES.newsSafari,
    title: 'Beyond the Destination: What Happens When Strangers Become Friends',
    excerpt:
      "Every journey with Trinity Express brings people together. A businessman on his way to seal a deal, a student visiting family after months away, a mother rushing to see her newborn grandchild. Our drivers don't just transport passengers, they listen, they encourage, they become part of your story.",
  },
  {
    category: 'Safety',
    image: IMAGES.newsGratitude,
    title: "After every safe journey, there's a moment of gratitude",
    excerpt:
      "for the smiles, stories, and passengers who make it all worth it. At Trinity Express, every trip is more than transportation — it's connection, care, and comfort that carry on even after the ride.",
  },
];

export default function NewsPage({ onBack }: NewsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter articles based on search query and category
  const filteredArticles = newsArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f3f7fa] pb-20">
      {/* Header section */}
      <div className="bg-[#132f4c] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              Latest News & Updates
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
              Stay informed about our latest services, routes, and company announcements.
            </p>
          </div>
        </div>
      </div>

      {/* Controls: Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col items-center gap-6">
          {/* Search bar */}
          <div className="w-full max-w-xl">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm bg-white placeholder:text-gray-400 text-dark-900"
            />
          </div>

          {/* Categories Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#132f4c] text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-[#132f4c] hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-150/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
              >
                {/* Article Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category Badge */}
                  <span className="absolute top-4 right-4 bg-sky-400/90 text-[#132f4c] backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    {article.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[#132f4c] mb-3 group-hover:text-primary-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-dark-700 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line">
                    {article.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-150 shadow-sm max-w-xl mx-auto">
              <p className="text-dark-700 text-lg font-medium">No articles found matching your criteria.</p>
              <button
                onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
