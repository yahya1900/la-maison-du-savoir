export const DEFAULT_SITE_URL = "https://yahya1900.github.io/la-maison-du-savoir";
export const DEFAULT_META_DESCRIPTION =
  "Accompagnement CNED pour les élèves du primaire, du collège et du lycée à Ghazoua. Encadrement pédagogique personnalisé, petits groupes et ateliers éducatifs.";
export const SITE_NAME = "La Maison du Savoir Ghazoua";
export const LOGO_PATH = "logo.png";
export const SOCIAL_IMAGE_PATH = "og-image.svg";
export const SUPPORTED_LANGUAGES = ["fr", "en", "ar", "es"] as const;

export function normalizeSiteUrl(siteUrl: string) {
  return siteUrl.trim().replace(/\/+$/, "");
}

export function resolveSiteUrl(siteUrl = DEFAULT_SITE_URL) {
  return normalizeSiteUrl(siteUrl || DEFAULT_SITE_URL);
}

export function withTrailingSlash(siteUrl: string) {
  return `${resolveSiteUrl(siteUrl)}/`;
}

export function resolveAssetUrl(siteUrl: string, assetPath: string) {
  return new URL(assetPath.replace(/^\/+/, ""), withTrailingSlash(siteUrl)).toString();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function createRobotsTxt(siteUrl: string) {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${withTrailingSlash(siteUrl)}sitemap.xml`].join("\n");
}

export function createSitemapXml(siteUrl: string) {
  const canonicalUrl = withTrailingSlash(siteUrl);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    "  <url>",
    `    <loc>${escapeXml(canonicalUrl)}</loc>`,
    "  </url>",
    "</urlset>"
  ].join("\n");
}

export function createStructuredData({
  description,
  language,
  siteUrl
}: {
  description: string;
  language: string;
  siteUrl: string;
}) {
  const canonicalUrl = withTrailingSlash(siteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: canonicalUrl,
    logo: resolveAssetUrl(siteUrl, LOGO_PATH),
    image: resolveAssetUrl(siteUrl, SOCIAL_IMAGE_PATH),
    description,
    email: "lamaisondusavoir2025@gmail.com",
    telephone: "+212681222459",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Km 8, route de Sidi Kaouki",
      addressLocality: "Ghazoua",
      addressCountry: "MA"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "lamaisondusavoir2025@gmail.com",
      telephone: "+212681222459",
      availableLanguage: [...SUPPORTED_LANGUAGES]
    },
    areaServed: {
      "@type": "Place",
      name: "Ghazoua"
    },
    availableLanguage: [...SUPPORTED_LANGUAGES],
    openingHours: "Mo-Fr",
    inLanguage: language
  };
}
