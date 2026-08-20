import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { ROUTE_PAGES, SITE_DESCRIPTION } from '../lib/siteData';
import { getRouteItemListSchema } from '../lib/schema';

export default function RoutesPage() {
  return (
    <main className="pt-24 min-h-screen bg-slate-50">
      <SEO
        title="All Bus Routes"
        description="Explore Trinity Express bus routes across East Africa, including Kigali to Kampala, Kampala to Kigali, Kigali to Nairobi, Nairobi to Kigali, Kampala to Juba and Juba to Bor."
        pathname="/routes"
        jsonLd={getRouteItemListSchema()}
      />

      <section className="bg-white border-b border-slate-200 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-primary-600 mb-3">Route Network</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">Explore Trinity Express Bus Routes</h1>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">{SITE_DESCRIPTION}</p>
            <p className="mt-3 text-base text-slate-600 max-w-3xl mx-auto">
              Find route pages for Kigali, Kampala, Nairobi, Juba and Bor with fares, departure times and cross-border travel details.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ROUTE_PAGES.map((route) => (
              <article key={route.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                <img
                  src={route.imageUrl}
                  alt={`${route.origin} to ${route.destination} bus route`}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={520}
                  className="h-52 w-full rounded-3xl object-cover mb-5"
                />
                <div className="space-y-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-sky-500">Route</p>
                    <h2 className="text-2xl font-bold text-slate-900">{route.origin} to {route.destination}</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{route.description}</p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-lg font-semibold text-primary-600">From {route.price.toLocaleString()} RWF</span>
                    <Link
                      to={`/routes/${route.slug}`}
                      className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                    >
                      View Route
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
