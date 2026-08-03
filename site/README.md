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
```

Run the production server:

```bash
npm start -- --hostname 127.0.0.1 --port 3000
```

Then, in another terminal:

```bash
npm run seo:check -- http://127.0.0.1:3000
```

Set `NEXT_PUBLIC_SITE_URL=https://giacomocappelletto.com` in production. Deployments are indexable only when the exact canonical origin is configured and the host reports a production environment.

See [SEO operations](docs/seo-operations.md) for domain setup, search-engine launch steps, publishing checks, and the product-subdomain policy.
