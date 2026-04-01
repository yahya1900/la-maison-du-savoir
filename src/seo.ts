import {
  DEFAULT_SITE_URL,
  SITE_NAME,
  SOCIAL_IMAGE_PATH,
  createStructuredData,
  resolveAssetUrl,
  resolveSiteUrl,
  withTrailingSlash
} from "./seoConfig";

type SeoLanguage = "fr" | "en" | "ar" | "es";

const SITE_URL = resolveSiteUrl(import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL);
const CANONICAL_URL = withTrailingSlash(SITE_URL);
const OG_IMAGE_URL = resolveAssetUrl(SITE_URL, SOCIAL_IMAGE_PATH);
const OG_LOCALE: Record<SeoLanguage, string> = {
  fr: "fr_FR",
  en: "en_US",
  ar: "ar_MA",
  es: "es_ES"
};

function ensureMetaTag(attribute: "name" | "property", value: string) {
  let meta = document.head.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, value);
    document.head.appendChild(meta);
  }

  return meta;
}

function ensureLinkTag(rel: string) {
  let link = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.appendChild(link);
  }

  return link;
}

function ensureStructuredDataTag() {
  let script = document.getElementById("structured-data") as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement("script");
    script.id = "structured-data";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  return script;
}

export function syncSeo({
  title,
  description,
  language
}: {
  title: string;
  description: string;
  language: SeoLanguage;
}) {
  document.title = title;

  ensureMetaTag("name", "description").content = description;
  ensureMetaTag("name", "robots").content = "index, follow, max-image-preview:large";
  ensureMetaTag("name", "theme-color").content = "#f4ecdc";
  ensureMetaTag("property", "og:title").content = title;
  ensureMetaTag("property", "og:description").content = description;
  ensureMetaTag("property", "og:type").content = "website";
  ensureMetaTag("property", "og:site_name").content = SITE_NAME;
  ensureMetaTag("property", "og:locale").content = OG_LOCALE[language];
  ensureMetaTag("property", "og:url").content = CANONICAL_URL;
  ensureMetaTag("property", "og:image").content = OG_IMAGE_URL;
  ensureMetaTag("name", "twitter:card").content = "summary_large_image";
  ensureMetaTag("name", "twitter:title").content = title;
  ensureMetaTag("name", "twitter:description").content = description;
  ensureMetaTag("name", "twitter:image").content = OG_IMAGE_URL;

  ensureLinkTag("canonical").href = CANONICAL_URL;
}

export function syncStructuredData({
  description,
  language
}: {
  description: string;
  language: SeoLanguage;
}) {
  ensureStructuredDataTag().textContent = JSON.stringify(
    createStructuredData({
      description,
      language,
      siteUrl: SITE_URL
    })
  );
}
