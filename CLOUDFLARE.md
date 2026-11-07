# BaZi Calculator on Cloudflare

Staging: https://bazi-calculator.gabriel-naulleau.workers.dev

`npm run build:vinext` builds the Worker. `npm run start:vinext` previews it locally. The standard Next.js scripts remain available.

Provide the existing server environment variables through Cloudflare secret bindings. `.dev.vars` supplies local values; `.env.production.local` supplies build-time public configuration. Keep both files and any secrets JSON outside Git.

The Cloudflare build replaces the Vercel-hosted Analytics component with an empty component because its ingestion endpoint is unavailable on Cloudflare. Request metrics are available in Cloudflare; historical Vercel Analytics is not transferred. The original Vercel build keeps its Analytics component.

The homepage, geo search, and an example natal calculation return 200. Server secrets are absent from client assets. Application and Workers type checks and added-file lint pass. The custom domain bazi.freeastroapi.com is attached to this Worker, resolves in public DNS, and serves valid HTTPS in normal Chrome. Workers Builds deploys from `main`; preview builds are disabled. Keep Vercel as the rollback deployment.
