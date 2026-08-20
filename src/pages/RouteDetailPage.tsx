import { useMemo } from 'react';
import { useNavigate, useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { getRoutePageFromSlug, formatRouteBreadcrumbs, formatRouteDescription, formatRouteTitle, ROUTE_PAGES } from '../lib/siteData';
import { getBusTripSchema, getBreadcrumbSchema } from '../lib/schema';
import { ArrowLeft, Bus, Clock, MapPin } from 'lucide-react';

interface RouteDetailPageProps {
  onSearch: (from: string, to: string, date: string) => void;
}

export default function RouteDetailPage({ onSearch }: RouteDetailPageProps) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const route = slug ? getRoutePageFromSlug(slug) : undefined;

  const structuredData = useMemo(() => {
    if (!route) return [];

    return [
      getBreadcrumbSchema(formatRouteBreadcrumbs(route.origin, route.destination)),
      getBusTripSchema(route),
    ];
  }, [route]);

  if (!route) {
    return <Navigate to="/routes" replace />;
  }

  const handleSearchNow = () => {
    const today = new Date().toISOString().split('T')[0];
    onSearch(route.origin, route.destination, today);
    navigate('/results');
  };

  return (
    <main className="pt-24 bg-slate-50 min-h-screen">
      <SEO
        title={formatRouteTitle(route.origin, route.destination)}
        description={formatRouteDescription(route.origin, route.destination)}
        pathname={`/routes/${route.slug}`}
        image={route.imageUrl}
        jsonLd={structuredData}
      />

      <section className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <Link
                to="/routes"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all routes
              </Link>
              <p className="mt-2 text-sm uppercase tracking-[0.3em] text-sky-500">Route overview</p>
              <h1 className="mt-4 text-4xl font-extrabold text-slate-900">{route.origin} to {route.destination}</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Popular route</p>
              <p className="text-2xl font-semibold text-primary-600">From {route.price.toLocaleString()} RWF</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <img
                src={route.imageUrl}
                alt={`${route.origin} to ${route.destination} bus`}
                loading="lazy"
                decoding="async"
                width={1200}
                height={720}
                className="rounded-3xl w-full object-cover h-96"
              />

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-slate-600">
                  <Bus className="w-5 h-5 text-primary-600" />
                  <span className="font-semibold">Reliable cross-border travel</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{route.description}</p>
                <p className="mt-4 text-slate-700 leading-relaxed">
                  This route page is for travelers searching for {route.origin} to {route.destination} bus tickets,
                  Trinity Express schedules, fare information and cross-border travel details between {route.origin} and {route.destination}.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  {route.origin} to {route.destination} bus booking information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-sky-500 mb-2">Popular searches</p>
                    <ul className="space-y-2 text-slate-700">
                      {route.keywords.map((keyword) => (
                        <li key={keyword}>{keyword}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-sky-500 mb-2">Why travelers use this route</p>
                    <p className="text-slate-700 leading-relaxed">
                      Trinity Express connects passengers across East Africa with scheduled bus departures,
                      luggage support, customer care and comfortable buses for regional travel.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-slate-600">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold">Typical departures</span>
                  </div>
                  <ul className="space-y-3 text-slate-700">
                    {route.departures.map((departure) => (
                      <li key={departure} className="rounded-2xl bg-slate-50 px-4 py-3">{departure}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-slate-600">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold">Route details</span>
                  </div>
                  <p className="text-slate-700">Origin: <strong>{route.origin}</strong></p>
                  <p className="text-slate-700">Destination: <strong>{route.destination}</strong></p>
                  <p className="text-slate-700">Search code: <strong>{route.slug}</strong></p>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-sky-500 mb-4">Ready to book</p>
                <p className="text-slate-700 leading-relaxed mb-6">Search the latest buses on this route and find the best seat, price and boarding information.</p>
                <button
                  onClick={handleSearchNow}
                  className="w-full rounded-2xl bg-primary-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  Search buses today
                </button>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Popular nearby routes</h2>
                <div className="space-y-3">
                  {ROUTE_PAGES.slice(0, 4).map((item) => (
                    <Link
                      key={item.slug}
                      to={`/routes/${item.slug}`}
                      className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 hover:border-primary-300 hover:bg-white transition"
                    >
                      {item.origin} → {item.destination}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
