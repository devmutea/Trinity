import React, { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-900 mb-4">
          Contact Us
        </h2>
        <p className="text-dark-700 text-sm sm:text-base leading-relaxed mb-1">
          Have a question or want to get in touch? Fill out the form below and we'll get back to you soon.
        </p>
        <p className="text-gray-500 text-sm mb-10">
          This form is for passenger support and travel inquiries.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
          <div>
            <input
              type="text"
              required
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400"
            />
          </div>
          <div>
            <input
              type="email"
              required
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400"
            />
          </div>
          <div>
            <textarea
              required
              rows={5}
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400 resize-none"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-4 bg-[#132f4c] text-white font-bold rounded-xl hover:bg-primary-900 transition-colors shadow-md min-w-[200px]"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
