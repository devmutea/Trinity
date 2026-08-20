import NewsPage from '../components/NewsPage';
import SEO from '../components/SEO';

interface NewsPageWrapperProps {
  onBack: () => void;
}

export default function NewsPageWrapper({ onBack }: NewsPageWrapperProps) {
  return (
    <main className="pt-24 min-h-screen bg-slate-50">
      <SEO
        title="News & Updates"
        description="Read Trinity Express news, announcements, safety updates, and travel alerts for cross-border bus routes and regional services."
        pathname="/news"
      />
      <NewsPage onBack={onBack} />
    </main>
  );
}
