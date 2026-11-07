# BaZi Calculator on Cloudflare

Staging: https://bazi-calculator.gabriel-naulleau.workers.dev

`npm run build:vinext` builds the Worker. `npm run start:vinext` previews it locally. The standard Next.js scripts remain available.

Provide the existing server environment variables through Cloudflare secret bindings. `.dev.vars` supplies local values; `.env.production.local` supplies build-time public configuration. Keep both files and any secrets JSON outside Git.

The Cloudflare build replaces the Vercel-hosted Analytics component with an empty component because its ingestion endpoint is unavailable on Cloudflare. Request metrics are available in Cloudflare; historical Vercel Analytics is not transferred. The original Vercel build keeps its Analytics component.

The staging homepage, geo search, and an example natal calculation returned 200. Server secrets were scanned against built client assets and were absent. Application and Workers type checks and added-file lint pass. The custom domain bazi.freeastroapi.com is attached to this Worker. It previously returnedNXDOMAIN; Cloudflare public DNS now resolves it and direct HTTPS returns200 with a valid certificate. Some recursive resolvers still cache the earlier negative result; normal browser validation is pending DNS propagation. Git build integration remains pending. Keep Vercel. A synthetic browser calculation rendered the report without consoleerrors.
