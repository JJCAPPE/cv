const productionSiteUrl = "https://www.giacomocappelletto.com";
const localSiteUrl = "http://localhost:3000";

function normalizeOrigin(value: string) {
  const url = new URL(value);

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error("NEXT_PUBLIC_SITE_URL must contain one HTTP(S) origin.");
  }

  return url.origin;
}

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL)
  : undefined;
const isVercelDeployment = process.env.VERCEL === "1";
const isProductionDeployment = isVercelDeployment
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

export const siteUrl =
  process.env.NODE_ENV === "development"
    ? (configuredSiteUrl ?? localSiteUrl)
    : productionSiteUrl;

export const isIndexableDeployment =
  isProductionDeployment && configuredSiteUrl === productionSiteUrl;

export function absoluteUrl(pathname = "/") {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(path, `${siteUrl}/`).toString();
}
