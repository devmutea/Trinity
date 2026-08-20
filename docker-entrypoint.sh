#!/bin/sh
set -eu

sanitize() {
  local val="$1"

  if [ "${val#\"}" != "$val" ] && [ "${val%\"}" != "$val" ]; then
    val="${val#\"}"
    val="${val%\"}"
  fi

  if [ "${val#\'}" != "$val" ] && [ "${val%\'}" != "$val" ]; then
    val="${val#\'}"
    val="${val%\'}"
  fi

  printf '%s' "$val"
}

cat > /usr/share/nginx/html/runtime-config.js <<EOF
window.__APP_CONFIG__ = {
  VITE_SUPABASE_URL: "$(sanitize "${VITE_SUPABASE_URL:-}")",
  VITE_SUPABASE_ANON_KEY: "$(sanitize "${VITE_SUPABASE_ANON_KEY:-}")",
  VITE_CLIENT_URL: "$(sanitize "${VITE_CLIENT_URL:-}")",
  VITE_GA_MEASUREMENT_ID: "$(sanitize "${VITE_GA_MEASUREMENT_ID:-}")",
  VITE_ADSENSE_PUBLISHER_ID: "$(sanitize "${VITE_ADSENSE_PUBLISHER_ID:-}")",
  PAYMENT_PROVIDER: "$(sanitize "${PAYMENT_PROVIDER:-}")",
  PAYMENT_KENYA_PROVIDER: "$(sanitize "${PAYMENT_KENYA_PROVIDER:-}")",
  PAYMENT_INTERNATIONAL_PROVIDER: "$(sanitize "${PAYMENT_INTERNATIONAL_PROVIDER:-}")",
  PAYMENT_FALLBACK_PROVIDER: "$(sanitize "${PAYMENT_FALLBACK_PROVIDER:-}")",
  WHATSAPP_NUMBER: "$(sanitize "${WHATSAPP_NUMBER:-}")",
  WHATSAPP_DEFAULT_MESSAGE: "$(sanitize "${WHATSAPP_DEFAULT_MESSAGE:-}")"
};
EOF

if [ -f /usr/share/nginx/html/index.html ]; then
  ADSENSE_ID="${VITE_ADSENSE_PUBLISHER_ID:-}"
  if [ -z "$ADSENSE_ID" ] && [ -f "/run/secrets/ADSENSE_PUBLISHER_ID" ]; then
    ADSENSE_ID=$(cat /run/secrets/ADSENSE_PUBLISHER_ID 2>/dev/null || true)
  fi

  if [ -n "$ADSENSE_ID" ]; then
    sed -i "s/%VITE_ADSENSE_PUBLISHER_ID%/${ADSENSE_ID}/g" /usr/share/nginx/html/index.html || true
    sed -i "s|adsbygoogle\.js?client=[^\"' >]*|adsbygoogle.js?client=${ADSENSE_ID}|g" /usr/share/nginx/html/index.html || true
    sed -i "s/\(VITE_ADSENSE_PUBLISHER_ID: \)\".*\"/\1\"${ADSENSE_ID}\"/" /usr/share/nginx/html/runtime-config.js || true
  else
    sed -i "s/%VITE_ADSENSE_PUBLISHER_ID%//g" /usr/share/nginx/html/index.html || true
    sed -i "s/adsbygoogle\.js?client=[^\"' >]*client=/adsbygoogle.js?client=/g" /usr/share/nginx/html/index.html || true
  fi
fi

exec nginx -g 'daemon off;'
