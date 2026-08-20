import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { FAQ_CATEGORIES, FAQ_ITEMS } from '../data/faqData';

interface FAQPageProps {
  onBack: () => void;
}

export default function FAQPage({ onBack }: FAQPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});

  const toggleQuestion = (question: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [question]: !prev[question],
    }));
  };

  // Filter FAQs based on search and category
  const filteredFaqs = FAQ_ITEMS.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by category
  const groupedFaqs: Record<string, typeof FAQ_ITEMS> = {};
  filteredFaqs.forEach((faq) => {
    if (!groupedFaqs[faq.category]) {
      groupedFaqs[faq.category] = [];
    }
    groupedFaqs[faq.category].push(faq);
  });

  // Define display categories (categories that have matching FAQs)
  const displayCategories = activeCategory === 'All'
    ? Object.keys(groupedFaqs)
    : [activeCategory];

  return (
    <div className="min-h-screen bg-[#f3f7fa] pb-20 pt-28">
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
              Frequently Asked Questions
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
              Find answers to common questions about our services, tracking, and policies.
            </p>
          </div>
        </div>
      </div>

      {/* Control panel (Search & Categories) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col items-center gap-6">
          {/* Search Bar */}
          <div className="w-full max-w-xl">
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm bg-white placeholder:text-gray-400 text-dark-900"
            />
          </div>

          {/* Categories Pill List */}
          <div className="flex flex-wrap justify-center gap-3">
            {FAQ_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
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

        {/* FAQs List */}
        <div className="mt-12 space-y-12">
          {displayCategories.map((categoryName) => {
            const list = groupedFaqs[categoryName] || [];
            if (list.length === 0) return null;

            return (
              <div key={categoryName} className="space-y-4">
                {/* Category Title with Underline */}
                <div className="border-b border-[#132f4c]/10 pb-3 mb-6 mt-8">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#132f4c] text-center uppercase tracking-wide">
                    {categoryName}
                  </h2>
                </div>

                {/* Accordions */}
                <div className="space-y-4 max-w-3xl mx-auto">
                  {list.map((faq) => {
                    const isOpen = !!openQuestions[faq.question];
                    return (
                      <div
                        key={faq.question}
                        className="bg-white border border-gray-150/80 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleQuestion(faq.question)}
                          className="w-full flex justify-between items-center px-6 py-5 cursor-pointer hover:bg-gray-50/40 text-left focus:outline-none"
                        >
                          <span className="text-sm sm:text-base font-bold text-[#132f4c] pr-4">
                            {faq.question}
                          </span>
                          <span className="text-xl font-bold text-[#132f4c] select-none flex-shrink-0">
                            {isOpen ? '−' : '+'}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-6 py-5 border-t border-gray-50 bg-[#fafcfd]">
                            <p className="text-sm sm:text-base text-dark-700 leading-relaxed font-normal whitespace-pre-line">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {Object.keys(groupedFaqs).length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-150 shadow-sm">
              <p className="text-dark-700 text-lg font-medium">No questions found matching your search term.</p>
              <button
                onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
