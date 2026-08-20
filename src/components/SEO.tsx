import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_THEME_COLOR,
  DEFAULT_OG_IMAGE,
} from '../lib/siteData';

interface SEOProps {
  title?: string;
  description?: string;
  pathname?: string;
  image?: string;
  twitterCard?: 'summary_large_image' | 'summary';
  noIndex?: boolean;
  canonical?: string;
  jsonLd?: unknown | unknown[];
}

const normalizePath = (value: string) => {
  if (!value || value === '/') {
    return '/';
  }

  const trimmed = value.trim();
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}`;
};

const resolvePageUrl = (pathname: string) => {
  const base = typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : SITE_URL;

  return `${base}${normalizePath(pathname)}`;
};

export default function SEO({
  title,
  description,
  pathname,
  image,
  twitterCard = 'summary_large_image',
  noIndex = false,
  canonical,
  jsonLd,
}: SEOProps) {
  const location = useLocation();
  const resolvedPath = pathname || location.pathname;
  const normalizedPath = normalizePath(resolvedPath);
  const pageUrl = resolvePageUrl(normalizedPath);
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const pageDescription = description || SITE_DESCRIPTION;
  const canonicalUrl = canonical || pageUrl;
  const shouldNoIndex = noIndex || (typeof import.meta !== 'undefined' && import.meta.env.MODE !== 'production');
  const robotsContent = shouldNoIndex ? 'noindex, nofollow' : 'index, follow';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.lang = 'en';
  }, []);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const structuredData = useMemo(() => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url: pageUrl,
      name: pageTitle,
      description: pageDescription,
      inLanguage: 'en',
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    };

    if (jsonLd) {
      return Array.isArray(jsonLd) ? [baseSchema, ...jsonLd] : [baseSchema, jsonLd];
    }

    return [baseSchema];
  }, [pageUrl, pageTitle, pageDescription, jsonLd]);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content={SITE_THEME_COLOR} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={image || DEFAULT_OG_IMAGE} />
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image || DEFAULT_OG_IMAGE} />
      <meta name="twitter:creator" content="@TrinityExpress" />
      <meta name="twitter:site" content="@TrinityExpress" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta name="format-detection" content="telephone=no" />
      <meta httpEquiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="apple-touch-icon" sizes="180x180" href="/site/favicon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/site/favicon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/site/favicon.png" />
      <link rel="manifest" href="/site/manifest.webmanifest" />
      {structuredData.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>,
    document.head
  );
}
