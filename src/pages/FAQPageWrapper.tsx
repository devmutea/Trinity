import FAQPage from '../components/FAQPage';
import { FAQ_ITEMS } from '../data/faqData';
import SEO from '../components/SEO';
import { getFAQSchema } from '../lib/schema';

interface FAQPageWrapperProps {
  onBack: () => void;
}

export default function FAQPageWrapper({ onBack }: FAQPageWrapperProps) {
  return (
    <main className="pt-24 min-h-screen bg-slate-50">
      <SEO
        title="FAQ"
        description="Frequently asked questions about Trinity Express bus routes, booking policies, baggage rules, and passenger support."
        pathname="/faq"
        jsonLd={getFAQSchema(FAQ_ITEMS)}
      />
      <FAQPage onBack={onBack} />
    </main>
  );
}
