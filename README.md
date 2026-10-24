# StreamZone

## Run on Windows
1. Install Node.js LTS (nodejs.org). Reopen PowerShell.
2. `npm install`, then copy `.env.example` to `.env.local`, fill in what you have, then `npm run dev`. Open http://localhost:3000

## Free services you need (all optional)
- TMDB key: themoviedb.org. Free, requires attribution (already in footer).
- Sports key: api-sports.io. One key covers football and basketball. Free plan = 100 requests/day each, limited seasons, so scores are not truly real-time. Paid plans lower SPORTS_REVALIDATE_SECONDS.
- Postgres: free at neon.tech or supabase.com. Paste the connection string as DATABASE_URL. Tables are created on first use.
- AUTH_SECRET: any long random text.

## Publish
Push to GitHub, import at vercel.com, add the same variables under Settings > Environment Variables, deploy.

## Video
Sports APIs and TMDB give no broadcast or streaming rights. Add only streams you may serve to AUTHORIZED_SOURCES (key format `movie:<tmdb id>` or `tv:<tmdb id>`).

## Troubleshooting
- "Server is not set up": DATABASE_URL or AUTH_SECRET missing.
- Sports error mentioning plan/season: your API plan does not cover today's data.
- Port busy: run `npm run dev -- -p 3001`.
