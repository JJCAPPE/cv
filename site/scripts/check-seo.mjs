#!/usr/bin/env node

const productionOrigin = "https://giacomocappelletto.com";
const suppliedBaseUrl = process.argv[2];

if (!suppliedBaseUrl) {
  console.error("Usage: npm run seo:check -- <base-url>");
  process.exit(1);
}

let baseUrl;

try {
  baseUrl = new URL(suppliedBaseUrl);
} catch {
  console.error(`Invalid base URL: ${suppliedBaseUrl}`);
  process.exit(1);
}

if (!["http:", "https:"].includes(baseUrl.protocol)) {
  console.error("The base URL must use HTTP or HTTPS.");
  process.exit(1);
}

baseUrl = new URL(baseUrl.origin);

const localHostnames = new Set(["localhost", "127.0.0.1", "[::1]"]);
const isLocalCheck = localHostnames.has(baseUrl.hostname);
const errors = [];

function check(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

function isValidIsoDate(value) {
  if (typeof value !== "string") {
    return false;
  }

  const match = value.match(
    /^(\d{4}-\d{2}-\d{2})(?:T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(Z|[+-](?:0\d|1[0-4]):[0-5]\d))?$/,
  );

  if (!match || (/^[+-]14:/.test(match[2] ?? "") && !match[2].endsWith(":00"))) {
    return false;
  }

  const calendarDate = new Date(`${match[1]}T00:00:00.000Z`);
  return (
    !Number.isNaN(Date.parse(value)) &&
    calendarDate.toISOString().startsWith(match[1])
  );
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(
    ([tag]) => {
      const attributes = {};

      for (const match of tag.matchAll(
        /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,
      )) {
        attributes[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3]);
      }

      return attributes;
    },
  );
}

function metaContent(html, attribute, value) {
  return tags(html, "meta").find(
    (attributes) => attributes[attribute]?.toLowerCase() === value,
  )?.content;
}

function canonicalLinks(html) {
  return tags(html, "link").filter((attributes) =>
    attributes.rel?.toLowerCase().split(/\s+/).includes("canonical"),
  );
}

function isForbiddenPublicUrl(value) {
  try {
    const url = new URL(value);
    return (
      localHostnames.has(url.hostname) ||
      url.hostname === "www.giacomocappelletto.com" ||
      url.hostname.endsWith(".vercel.app")
    );
  } catch {
    return true;
  }
}

function isSameUrl(left, right) {
  try {
    return new URL(left).toString() === new URL(right).toString();
  } catch {
    return false;
  }
}

function hasProductionOrigin(value) {
  try {
    return new URL(value).origin === productionOrigin;
  } catch {
    return false;
  }
}

function requestUrl(publicUrl) {
  const url = new URL(publicUrl);

  if (!isLocalCheck) {
    return url;
  }

  return new URL(`${url.pathname}${url.search}`, baseUrl);
}

async function fetchResponse(url, options) {
  try {
    return await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
      ...options,
    });
  } catch (error) {
    errors.push(`${url} could not be fetched: ${error.message}`);
    return undefined;
  }
}

function xmlValue(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "i"));
  return match ? decodeHtml(match[1].trim()) : undefined;
}

function parseJsonLd(html, pageUrl) {
  const scripts = [
    ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi),
  ];
  const schemaTypes = [];

  for (const [, rawAttributes, source] of scripts) {
    const type = rawAttributes.match(
      /\btype\s*=\s*(?:"([^"]*)"|'([^']*)')/i,
    );

    if ((type?.[1] ?? type?.[2])?.toLowerCase() !== "application/ld+json") {
      continue;
    }

    try {
      const parsed = JSON.parse(source);
      const serialized = JSON.stringify(parsed);
      check(
        !serialized.includes("localhost") &&
          !serialized.includes(".vercel.app") &&
          !serialized.includes("www.giacomocappelletto.com"),
        `${pageUrl} JSON-LD contains a forbidden public host`,
      );

      for (const schema of Array.isArray(parsed) ? parsed : [parsed]) {
        schemaTypes.push(schema["@type"]);

        if (schema["@type"] === "ProfilePage") {
          check(
            isSameUrl(schema.url, pageUrl),
            `${pageUrl} ProfilePage must use the page canonical URL`,
          );
          check(
            schema.mainEntity?.["@type"] === "Person" &&
              Boolean(schema.mainEntity.name),
            `${pageUrl} ProfilePage must identify its Person mainEntity`,
          );
        }

        if (schema["@type"] === "BlogPosting") {
          const published = Date.parse(schema.datePublished);
          const modified = Date.parse(schema.dateModified);

          check(
            isSameUrl(schema.url, pageUrl),
            `${pageUrl} BlogPosting must use the page canonical URL`,
          );
          check(
            isValidIsoDate(schema.datePublished) &&
              isValidIsoDate(schema.dateModified),
            `${pageUrl} BlogPosting dates must use valid ISO 8601 values`,
          );
          check(
            !Number.isFinite(published) ||
              !Number.isFinite(modified) ||
              (modified >= published && modified <= Date.now()),
            `${pageUrl} BlogPosting modification date is inconsistent`,
          );
          check(
            Boolean(schema.headline) && Boolean(schema.description),
            `${pageUrl} BlogPosting must contain a headline and description`,
          );
          check(
            hasProductionOrigin(schema.image),
            `${pageUrl} BlogPosting image must use the production origin`,
          );
        }
      }
    } catch (error) {
      errors.push(`${pageUrl} contains invalid JSON-LD: ${error.message}`);
    }
  }

  return schemaTypes;
}

async function main() {
  check(
    isLocalCheck || baseUrl.origin === productionOrigin,
    `Remote checks must target ${productionOrigin}, not ${baseUrl.origin}`,
  );

  const robotsUrl = new URL("/robots.txt", baseUrl);
  const sitemapUrl = new URL("/sitemap.xml", baseUrl);
  const [robotsResponse, sitemapResponse] = await Promise.all([
    fetchResponse(robotsUrl),
    fetchResponse(sitemapUrl),
  ]);

  check(robotsResponse?.status === 200, `${robotsUrl} must return 200`);
  check(sitemapResponse?.status === 200, `${sitemapUrl} must return 200`);

  if (!robotsResponse || !sitemapResponse) {
    return;
  }

  const [robotsText, sitemapXml] = await Promise.all([
    robotsResponse.text(),
    sitemapResponse.text(),
  ]);
  const sitemapDirectives = robotsText
    .split(/\r?\n/)
    .filter((line) => /^sitemap:/i.test(line.trim()))
    .map((line) => line.slice(line.indexOf(":") + 1).trim());

  check(
    sitemapDirectives.length === 1,
    "robots.txt must contain exactly one Sitemap directive",
  );
  check(
    sitemapDirectives[0] === `${productionOrigin}/sitemap.xml`,
    `robots.txt must list ${productionOrigin}/sitemap.xml`,
  );
  check(
    !robotsText.includes("/resume.pdf"),
    "robots.txt must not block /resume.pdf",
  );

  const entries = [...sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map(
    ([, block]) => ({
      loc: xmlValue(block, "loc"),
      lastModified: xmlValue(block, "lastmod"),
    }),
  );

  check(entries.length > 0, "sitemap.xml must contain at least one URL");

  const locations = entries.map((entry) => entry.loc).filter(Boolean);
  check(
    new Set(locations).size === locations.length,
    "sitemap.xml locations must be unique",
  );
  check(
    locations.includes(`${productionOrigin}/resume`),
    "/resume must appear in sitemap.xml",
  );
  check(
    !locations.includes(`${productionOrigin}/resume.pdf`),
    "/resume.pdf must not appear in sitemap.xml",
  );

  for (const entry of entries) {
    if (!entry.loc) {
      errors.push("sitemap.xml contains an entry without <loc>");
      continue;
    }

    try {
      const location = new URL(entry.loc);
      check(
        location.origin === productionOrigin,
        `${entry.loc} must use the canonical production origin`,
      );
      check(
        !isForbiddenPublicUrl(entry.loc),
        `${entry.loc} contains a forbidden public host`,
      );
    } catch {
      errors.push(`${entry.loc} is not an absolute URL`);
    }

    if (entry.lastModified) {
      const timestamp = Date.parse(entry.lastModified);
      check(
        isValidIsoDate(entry.lastModified),
        `${entry.loc} has an invalid ISO 8601 lastmod: ${entry.lastModified}`,
      );
      check(
        !Number.isFinite(timestamp) || timestamp <= Date.now(),
        `${entry.loc} has a future lastmod: ${entry.lastModified}`,
      );
    }
  }

  await Promise.all(
    entries
      .filter((entry) => entry.loc)
      .map(async (entry) => {
        const pageRequestUrl = requestUrl(entry.loc);
        const response = await fetchResponse(pageRequestUrl);
        check(response?.status === 200, `${entry.loc} must return 200`);

        if (!response || response.status !== 200) {
          return;
        }

        const contentType = response.headers.get("content-type") ?? "";
        check(
          contentType.includes("text/html"),
          `${entry.loc} must return HTML`,
        );

        if (!contentType.includes("text/html")) {
          return;
        }

        const html = await response.text();
        const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim();
        const description = metaContent(html, "name", "description");
        const canonical = canonicalLinks(html);
        const openGraphUrl = metaContent(html, "property", "og:url");
        const openGraphImage = metaContent(html, "property", "og:image");
        const twitterCard = metaContent(html, "name", "twitter:card");
        const twitterTitle = metaContent(html, "name", "twitter:title");
        const twitterDescription = metaContent(
          html,
          "name",
          "twitter:description",
        );
        const twitterImage = metaContent(html, "name", "twitter:image");
        const robots = metaContent(html, "name", "robots")?.toLowerCase();

        check(Boolean(title), `${entry.loc} must have a title`);
        check(Boolean(description), `${entry.loc} must have a meta description`);
        check(
          canonical.length === 1,
          `${entry.loc} must have exactly one canonical link`,
        );
        check(
          isSameUrl(canonical[0]?.href, entry.loc),
          `${entry.loc} must self-canonicalize (found ${canonical[0]?.href ?? "none"})`,
        );
        check(
          isSameUrl(openGraphUrl, entry.loc),
          `${entry.loc} must use its canonical URL for og:url`,
        );
        check(Boolean(openGraphImage), `${entry.loc} must have an og:image`);
        check(
          Boolean(openGraphImage) &&
            hasProductionOrigin(openGraphImage) &&
            !isForbiddenPublicUrl(openGraphImage),
          `${entry.loc} must use the production origin for og:image`,
        );
        check(
          twitterCard === "summary_large_image",
          `${entry.loc} must use a summary_large_image Twitter card`,
        );
        check(Boolean(twitterTitle), `${entry.loc} must have a Twitter title`);
        check(
          Boolean(twitterDescription),
          `${entry.loc} must have a Twitter description`,
        );
        check(Boolean(twitterImage), `${entry.loc} must have a Twitter image`);
        check(
          Boolean(twitterImage) &&
            hasProductionOrigin(twitterImage) &&
            !isForbiddenPublicUrl(twitterImage),
          `${entry.loc} must use the production origin for its Twitter image`,
        );

        if (!isLocalCheck) {
          check(
            !robots?.split(/\s*,\s*/).includes("noindex"),
            `${entry.loc} must not be noindex in production`,
          );
        }

        const schemaTypes = parseJsonLd(html, entry.loc);
        const pathname = new URL(entry.loc).pathname;

        if (pathname === "/") {
          check(
            schemaTypes.includes("ProfilePage"),
            `${entry.loc} must contain ProfilePage JSON-LD`,
          );
        }

        if (/^\/notes\/[^/]+$/.test(pathname)) {
          check(
            schemaTypes.includes("BlogPosting"),
            `${entry.loc} must contain BlogPosting JSON-LD`,
          );
        }
      }),
  );

  const resumePdfUrl = new URL("/resume.pdf", baseUrl);
  const resumePdfResponse = await fetchResponse(resumePdfUrl, { method: "HEAD" });
  check(resumePdfResponse?.status === 200, `${resumePdfUrl} must return 200`);
  check(
    resumePdfResponse
      ?.headers.get("x-robots-tag")
      ?.toLowerCase()
      .split(/\s*,\s*/)
      .includes("noindex"),
    "/resume.pdf must return X-Robots-Tag: noindex",
  );
}

await main();

if (errors.length > 0) {
  console.error(`SEO check failed with ${errors.length} error(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`SEO check passed for ${baseUrl.origin}`);
