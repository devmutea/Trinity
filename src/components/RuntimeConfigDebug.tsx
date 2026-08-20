import { useMemo } from 'react';
import { getRuntimeConfig } from '../lib/appConfig';

const compileTimeConfig = {
  PAYMENT_KENYA_PROVIDER: import.meta.env.PAYMENT_KENYA_PROVIDER ?? '',
  PAYMENT_INTERNATIONAL_PROVIDER: import.meta.env.PAYMENT_INTERNATIONAL_PROVIDER ?? '',
  PAYMENT_FALLBACK_PROVIDER: import.meta.env.PAYMENT_FALLBACK_PROVIDER ?? '',
  WHATSAPP_NUMBER: import.meta.env.WHATSAPP_NUMBER ?? '',
  WHATSAPP_DEFAULT_MESSAGE: import.meta.env.WHATSAPP_DEFAULT_MESSAGE ?? '',
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ?? '',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  VITE_CLIENT_URL: import.meta.env.VITE_CLIENT_URL ?? '',
};

export default function RuntimeConfigDebug() {
  const showDebug = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('debugRuntimeConfig') === '1';
  }, []);

  const runtimeConfig = useMemo(() => getRuntimeConfig(), []);

  if (!showDebug) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xl w-full rounded-2xl border border-slate-300 bg-white/95 p-4 shadow-2xl backdrop-blur-sm text-xs text-slate-900">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold">Runtime Configuration</h2>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase tracking-widest text-slate-600">
          debug mode
        </span>
      </div>
      <div className="grid gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500 mb-1">Loaded runtime config</div>
          <pre className="max-h-52 overflow-auto rounded-xl bg-slate-950/5 p-3 text-[11px] leading-5 text-slate-800">{JSON.stringify(runtimeConfig, null, 2)}</pre>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500 mb-1">Compile-time env fallback</div>
          <pre className="max-h-52 overflow-auto rounded-xl bg-slate-950/5 p-3 text-[11px] leading-5 text-slate-800">{JSON.stringify(compileTimeConfig, null, 2)}</pre>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-700">
          <p className="font-semibold">How to use</p>
          <p>Open any page with <code>?debugRuntimeConfig=1</code> to inspect configuration values.</p>
        </div>
      </div>
    </div>
  );
}
