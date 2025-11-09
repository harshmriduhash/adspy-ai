# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/8084ffde-68c8-42d8-8e4d-22fac0924258

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/8084ffde-68c8-42d8-8e4d-22fac0924258) and start prompting. Changes made via Lovable will be committed automatically to this repo.

# AdSpy AI — Ad analysis & variation generator for SaaS

AdSpy AI (AdSpy for SaaS) helps marketers and product teams analyze SaaS ad creatives and generate new ad variations with AI.

This repository contains a Vite + React front-end built with TypeScript and shadcn-ui, a small Supabase-backed persistence layer, and a Supabase Edge Function (serverless) that calls an AI provider (via Lovable AI gateway) to analyze ads and generate short ad copy variations.

## Quick summary

- Search a brand (mock dataset included) to find example ad creatives.
- Use an AI-powered analyze endpoint to get a short, focused analysis of the ad (tone, hook, techniques).
- Generate 3 short ad copy variations based on the selected creative.
- Save analyses to a Supabase table for later reference.

## Features

- Browse a curated/mock dataset of SaaS ad creatives (images + copy).
- AI-driven analysis of ad tone, hook, and techniques.
- AI-generated ad variations (3 short variations).
- Auth-backed saving of analyzed ads to Supabase (`saved_ads` table expected).
- Clean UI built with shadcn-ui components and Tailwind CSS.

## Tech stack

- Frontend: Vite + React + TypeScript
- UI: shadcn-ui (Radix + Tailwind based components)
- Styling: Tailwind CSS
- State / Server cache: @tanstack/react-query
- Auth & DB: Supabase (client in `src/integrations/supabase/client.ts`)
- Serverless AI function: Supabase Edge Function `supabase/functions/analyze-ad` (Deno runtime calling Lovable AI gateway)

## Repo layout (important files)

- `src/` — React app source
  - `App.tsx` — router and providers
  - `main.tsx` — app entry
  - `pages/` — page components (Index, Dashboard, Auth, Saved, NotFound)
  - `components/` — shared UI components and shadcn wrappers
  - `integrations/supabase/client.ts` — Supabase client (browser)
  - `lib/mockAds.ts` — mock dataset and search helper used by the Dashboard

- `supabase/functions/analyze-ad/index.ts` — serverless function that calls Lovable AI to analyze ads and produce variations
- `supabase/migrations/` — SQL migrations (table definitions, indexes)

## Environment / secrets

There are two places you need environment variables:

1. Frontend (browser):
	- VITE_SUPABASE_URL — your Supabase project URL
	- VITE_SUPABASE_PUBLISHABLE_KEY — your Supabase anon/public key

	These are loaded by `src/integrations/supabase/client.ts`.

2. Supabase Edge Function (serverless):
	- LOVABLE_API_KEY — an API key used in `supabase/functions/analyze-ad` to call the Lovable AI gateway.

Note: Keep server-side keys (LOVABLE_API_KEY) secret. Do NOT expose them to the browser.

## Quick start (development)

Requirements: Node 18+ (use your package manager of choice). This project uses Vite.

Open PowerShell and run:

```powershell
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Visit http://localhost:5173 (Vite default) to open the app.

Scripts (from `package.json`):

- `dev` — start Vite dev server
- `build` — create production build
- `preview` — preview built app
- `lint` — run ESLint

## AI analyze function (details)

The analyze logic lives in `supabase/functions/analyze-ad/index.ts`. The function:

- Accepts a POST body with an `ad` object (brand, platform, ad_text, cta, img_url).
- Calls Lovable's AI gateway to request a concise analysis (150–200 words) and then a separate call to generate 3 short ad variations.
- Returns JSON `{ analysis, variations }` to the caller.

Important implementation notes:

- The function expects `LOVABLE_API_KEY` present in the function's environment; it will return an error if not set.
- It sets CORS headers so the browser client can call it via Supabase Functions invoke.
- Variation responses are parsed by splitting numbered lines and trimming; the function limits to 3 variations.

## Supabase setup

Basic steps to get local/dev Supabase wiring:

1. Create a Supabase project.
2. In the Supabase dashboard create a table `saved_ads` with at least these columns:

```sql
create table saved_ads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  brand text,
  platform text,
  ad_text text,
  cta text,
  img_url text,
  analysis text,
  variations jsonb,
  inserted_at timestamptz default now()
);
```

3. Configure your project's environment variables:
	- Frontend: set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key) in a `.env` or your hosting platform settings.
	- Function: set `LOVABLE_API_KEY` in the Supabase Functions environment variables.

4. Deploy the function (using Supabase CLI):

```powershell
# login and deploy (example)
supabase login
supabase functions deploy analyze-ad --project-ref <your-project-ref>
```

## How the app flows (user-facing)

1. A user visits the Dashboard and searches for a brand name (the app uses `lib/mockAds.ts` for search in this repo).
2. The dashboard displays matching mock ad cards.
3. Clicking a card invokes the Supabase Function `analyze-ad`, which returns an `analysis` string and `variations` array.
4. Users can save the analysis to the `saved_ads` table (requires authenticated user).

## Authentication

The repo includes a simple supabase client with auth persistence configured (see `src/integrations/supabase/client.ts`). The UI uses a `useAuth` hook to guard the Dashboard route. To enable auth, wire your Supabase project's auth providers and ensure the client environment variables are set.

## Development notes & conventions

- Mock dataset: `src/lib/mockAds.ts` provides `mockAds` and `searchAds` helper used by the Dashboard for demo/search.
- UI: Most UI components are shadcn-style wrappers under `src/components/ui/`.
- Serverless: The analyze function uses Deno runtime (Supabase Functions). Its code is in `supabase/functions/analyze-ad/index.ts` and calls Lovable AI.

## Testing & linting

- Linting: `npm run lint` runs ESLint. Add tests as needed—this repo currently doesn't include a test harness.

## Deployment

Frontend:

- Build the app: `npm run build` and deploy the static output (`dist`) to your chosen host (Vercel, Netlify, Supabase Hosting, or static file host).

Serverless function:

- Deploy Supabase Functions as shown above. Make sure `LOVABLE_API_KEY` and any other server-only config are set in the Supabase dashboard.

## Troubleshooting

- If the analyze function returns an error about AI provider credentials, confirm `LOVABLE_API_KEY` is set in the function environment.
- If Supabase client calls fail in the browser, verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are present and correct.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo.
2. Create a branch for your feature/fix.
3. Open a PR with a clear description and screenshots if UI changes are involved.

Small & safe ways to help:

- Add unit tests and a test harness
- Replace mock dataset with a real data source or scripted ingestion
- Add E2E tests for the analyze/save flow

## License

This project does not include a license file in the repository. If you'd like to add one, consider MIT or Apache-2.0 depending on your needs.