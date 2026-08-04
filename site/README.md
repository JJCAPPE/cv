# Giacomo Cappelletto

Personal portfolio built with Next.js App Router, TypeScript, Tailwind CSS, and MDX.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run lint
npm run build
npm run test:scroll
```

The scrolling check launches Chromium, Firefox, and WebKit. It covers deferred
rail setup, deep links and skip-link focus, responsive fallbacks, reduced motion,
Save-Data, pin teardown, and offscreen media pausing. Use
`npm run test:scroll:chromium` for the fast local loop. Install the browser
binaries once with `npx playwright install chromium firefox webkit` if
Playwright asks for them.

Run the production server:

```bash
npm start -- --hostname 127.0.0.1 --port 3000
```

Then, in another terminal:

```bash
npm run seo:check -- http://127.0.0.1:3000
PERF_BASE_URL=http://127.0.0.1:3000 npm run perf:scroll
```

The performance probe traverses `/` and `/projects` at 1200 × 818 and 390 ×
844 with 4× CPU throttling. It records initial transfers and Core Web Vitals,
then fails on a task of at least 50 ms, a p95 frame interval above 16.7 ms, or
an eager homepage GSAP request.

Set `NEXT_PUBLIC_SITE_URL=https://www.giacomocappelletto.com` in production. Deployments are indexable only when the exact canonical origin is configured and the host reports a production environment.

See [SEO operations](docs/seo-operations.md) for domain setup, search-engine launch steps, publishing checks, and the product-subdomain policy.
