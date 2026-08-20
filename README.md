# Trinity Express

A Vite + React + TypeScript application for Trinity Express.

## Development

```bash
npm install
npm run dev
```

## Production container

```bash
cp .env.example .env
# edit .env with your Supabase values
docker compose up --build
```

The app will be available at http://localhost:8080, and the health endpoint will respond at http://localhost:8080/health.

## Build verification

```bash
npm run build
```

## Supabase deployment

```bash
npm run deploy
```

The deploy script pushes database migrations and deploys every Edge Function in `supabase/functions`.
It uses the locally installed Supabase CLI from `node_modules` so a global Supabase CLI is not required.
Run it from a Supabase-linked project with the Supabase CLI authenticated.



