import { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { buildSearchResults, getPopularRouteFromSearch } from '../lib/searchData';
import { formatRouteTitle, formatRouteDescription, SITE_URL } from '../lib/siteData';
import BusResults from '../components/BusResults';
import type { Bus } from '../types';

interface SearchResultsPageProps {
  onSelectBus: (bus: Bus) => void;
}

export default function SearchResultsPage({ onSelectBus }: SearchResultsPageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const routeDescription = formatRouteDescription(from || 'Your', to || 'Destination');
  const title = from && to ? formatRouteTitle(from, to) : 'Search Bus Routes';

  const searchResults = useMemo(() => {
    if (!from || !to) return [];
    return buildSearchResults(from, to, date);
  }, [from, to, date]);

  const onBack = () => {
    navigate('/');
  };

  const routeData = getPopularRouteFromSearch(from, to);

  return (
    <main className="pt-24 min-h-screen bg-slate-50">
      <SEO
        title={title}
        description={routeDescription}
        pathname={`/results?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`}
        image={routeData?.image_url || `${SITE_URL}/site/hero.jpg`}
      />

      <BusResults
        buses={searchResults}
        fromCity={from}
        toCity={to}
        date={date}
        onBack={onBack}
        onSelectBus={onSelectBus}
      />
    </main>
  );
}
