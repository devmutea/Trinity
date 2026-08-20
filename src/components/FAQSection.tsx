import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How do I book a bus ticket online?',
    answer: 'Simply enter your origin, destination, and travel date in the search bar. Select a bus from the results, choose your seat, fill in passenger details, and complete the payment. Your e-ticket will be sent to your email immediately.',
  },
  {
    question: 'Can I select my preferred seat?',
    answer: 'Yes! Our interactive seat map allows you to choose your preferred seat from available options. You can see the seat layout, type (window, aisle, etc.), and book accordingly.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept all major payment methods including credit/debit cards, mobile banking (bKash, Nagad), and bank transfers. All transactions are secured with industry-standard encryption.',
  },
  {
    question: 'How do I receive my ticket after booking?',
    answer: 'After successful payment, your e-ticket will be sent to your registered email address and phone number via SMS. You can also view and download it from your booking dashboard.',
  },
  {
    question: 'What is the cancellation and refund policy?',
    answer: 'You can cancel your ticket up to 24 hours before departure for a full refund. Cancellations within 24 hours are subject to a 10% cancellation fee. Refunds are processed within 5-7 business days.',
  },
  {
    question: 'Are there any discounts available?',
    answer: 'Yes! We offer special discounts for round-trip bookings, group bookings (5+ passengers), and early reservations. Senior citizens and students also enjoy exclusive discounts.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-dark-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary-600 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 text-sm text-dark-700 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
