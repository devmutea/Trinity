import { type City, type PopularRoute, type Review } from '../types';
import HeroSection from '../components/HeroSection';
import PartnersSection from '../components/PartnersSection';
import AboutSection from '../components/AboutSection';
import FoundationSection from '../components/FoundationSection';
import ServicesSection from '../components/ServicesSection';
import StrengthsSection from '../components/StrengthsSection';
import PopularRoutesSection from '../components/PopularRoutesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import SEO from '../components/SEO';
import { SITE_DESCRIPTION } from '../lib/siteData';
import { getLocalBusinessSchema, getOrganizationSchema, getRouteItemListSchema, getWebsiteSchema } from '../lib/schema';

interface HomePageProps {
  cities: City[];
  popularRoutes: PopularRoute[];
  reviews: Review[];
  validDestinationsByOrigin: Record<string, string[]>;
  isLoading: boolean;
  onSearch: (from: string, to: string, date: string) => void;
  onSelectRoute: (from: string, to: string) => void;
}

export default function HomePage({ cities, popularRoutes, reviews, validDestinationsByOrigin, isLoading, onSearch, onSelectRoute }: HomePageProps) {
  return (
    <main className="pt-24">
      <SEO
        title="East Africa Bus Tickets"
        description={SITE_DESCRIPTION}
        pathname="/"
        jsonLd={[getWebsiteSchema(), getOrganizationSchema(), getLocalBusinessSchema(), getRouteItemListSchema()]}
      />

      <HeroSection cities={cities} validDestinationsByOrigin={validDestinationsByOrigin} onSearch={onSearch} isLoading={isLoading} />
      <PartnersSection />
      <ServicesSection />
      <PopularRoutesSection routes={popularRoutes} onSelectRoute={onSelectRoute} />
      <AboutSection />
      <FoundationSection />
      <StrengthsSection />
      <HowItWorksSection />
      <TestimonialsSection reviews={reviews} />
      <ContactSection />
    </main>
  );
}
