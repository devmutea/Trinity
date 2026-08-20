import { IMAGES } from '../constants/images';

export default function PartnersSection() {
  const logos = [
    { src: IMAGES.partnerSonarwa, alt: 'SONARWA General' },
    { src: IMAGES.partnerZion, alt: 'Zion Insurance Brokers' },
    { src: IMAGES.partnerRura, alt: 'RURA Rwanda Utilities Regulatory Authority' },
  ];

  // Duplicate the logos array to ensure seamless infinite looping
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

  return (
    <section className="bg-[#132f4c] py-8 border-b border-gray-100">
      {/* Header Bar */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-6">
        <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-widest uppercase text-balance">
          EMPOWERING SUCCESS THROUGH TRUSTED PARTNERSHIPS
        </h2>
      </div>

      {/* White Scrolling Strip */}
      <div className="relative w-full bg-white py-1.5 overflow-hidden flex items-center shadow-inner">
        {/* Left & Right fading gradient edges for seamless disappear/reappear effect */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-[28%] lg:w-[30%] z-10 pointer-events-none" 
          style={{ background: 'linear-gradient(to right, white 0%, white 50%, rgba(255,255,255,0.9) 75%, transparent 100%)' }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-[28%] lg:w-[30%] z-10 pointer-events-none" 
          style={{ background: 'linear-gradient(to left, white 0%, white 50%, rgba(255,255,255,0.9) 75%, transparent 100%)' }}
        />

        {/* Marquee Track */}
        <div className="flex w-max items-center gap-0 animate-marquee whitespace-nowrap">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-24 sm:h-36 w-36 sm:w-52 flex-shrink-0"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Add custom CSS styles for the continuous scrolling animation */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee {
            animation: marquee 60s linear infinite;
          }
        `}} />
      </div>
    </section>
  );
}
