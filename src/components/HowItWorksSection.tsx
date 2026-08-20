import { Search, Armchair, CreditCard, Ticket } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Search Your Route',
    description: 'Enter your origin, destination, and travel date to find available buses.',
  },
  {
    icon: Armchair,
    number: '02',
    title: 'Select Your Seat',
    description: 'Choose your preferred seat from the interactive seat map for the best comfort.',
  },
  {
    icon: CreditCard,
    number: '03',
    title: 'Make Payment',
    description: 'Complete your booking with our secure payment gateway for instant confirmation.',
  },
  {
    icon: Ticket,
    number: '04',
    title: 'Get Your Ticket',
    description: 'Receive your e-ticket via email and SMS. Show it at the boarding point.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900">
            Booking Your Bus Ticket in 4 Easy Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 border border-gray-100">
                <step.icon className="w-9 h-9 text-primary-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-dark-900 mb-3">{step.title}</h3>
              <p className="text-sm text-dark-700 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
