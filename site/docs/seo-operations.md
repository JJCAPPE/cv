# SEO operations

## Production setup

- Set `NEXT_PUBLIC_SITE_URL=https://www.giacomocappelletto.com` for the production environment. The value must be an origin without a path; a trailing slash is normalized.
- Attach `giacomocappelletto.com` and `www.giacomocappelletto.com` to this deployment only. Make `www` primary and configure one permanent redirect from the apex to the matching `www` URL.
- Protect preview deployments. The application also emits `noindex, nofollow` and a closed robots policy unless it is a production deployment configured with the exact canonical origin.
- On non-Vercel hosting, `NODE_ENV=production` plus the exact `NEXT_PUBLIC_SITE_URL` is the production/indexability signal.
- Do not attach product, API, documentation, wildcard, preview, or staging subdomains to this repository.

After changing domains or redirects, verify HTTP, HTTPS, the apex, and any former host. Each should take at most one permanent redirect to the matching `www` HTTPS URL without a loop.

## Launch checklist

1. In Google Search Console, create a Domain property for `giacomocappelletto.com` and verify it with the supplied DNS TXT record.
2. Submit `https://www.giacomocappelletto.com/sitemap.xml` once in the Sitemaps report. Use URL Inspection for the home page and a few high-value pages after launch.
3. In Bing Webmaster Tools, import the verified Search Console property or verify it separately, then submit the same sitemap URL once.
4. Put the canonical site URL on the GitHub profile, relevant repository READMEs, LinkedIn, and legitimate university, lab, or ORCID profiles.
5. Do not create a Google Business Profile for this online-only portfolio. DuckDuckGo needs no separate baseline submission. Defer IndexNow unless publishing frequency grows materially.

Submission helps discovery but does not guarantee indexing. Do not resubmit the sitemap after every deploy.

## Publishing routine

For every material content change:

1. Update the nearby `Project.updatedAt`, `ResearchShowcaseItem.updatedAt`, or note `updated` frontmatter in the same commit. Leave `updated` absent when a note has never been revised.
2. Add a new static route to `src/app/sitemap.ts`. Project, research-detail, and note routes are data-driven.
3. Run:

   ```bash
   npm run lint
   npm run build
   ```

   Start the production server in one terminal:

   ```bash
   npm start -- --hostname 127.0.0.1 --port 3000
   ```

   Run the SEO check from another terminal:

   ```bash
   npm run seo:check -- http://127.0.0.1:3000
   ```

4. Deploy. Request indexing only for a few important new or substantially changed URLs.

While publishing actively, review Search Console and Bing monthly; otherwise review them quarterly. Check page indexing, sitemap errors, Core Web Vitals, security/manual actions, crawl errors, top queries, and stale snippets. Use Vercel Speed Insights to justify any later performance work.

Redirect removed durable URLs and remove them from sitemap data. For a domain migration, use one-to-one permanent redirects, keep the old redirects for at least a year, and update the canonical origin, sitemap, search-console properties, and external profiles together.

## Product host policy

The apex remains the durable identity, portfolio, notes, research, resume, and product-discovery hub. Keep searchable case studies at `/projects/{slug}`.

Create `{product}.giacomocappelletto.com` only when a product has an independent deployment, runtime, authentication boundary, or substantial public application. That deployment owns its canonical configuration, robots policy, sitemap, checks, and lifecycle. Index only substantial public landing pages or documentation; protect or noindex sign-in, account, dashboard, admin, API, test, tenant, and staging routes.

Cross-link a product and its apex case study, and keep their copy distinct. Do not pre-create unused product, app, docs, API, wildcard, or staging hosts. If a product later moves to a dedicated domain, permanently redirect every moved public URL and retain the apex case study as the personal project record.
