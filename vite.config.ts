import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import {
  DEFAULT_META_DESCRIPTION,
  DEFAULT_SITE_URL,
  SOCIAL_IMAGE_PATH,
  createRobotsTxt,
  createSitemapXml,
  createStructuredData,
  resolveAssetUrl,
  resolveSiteUrl,
  withTrailingSlash
} from "./src/seoConfig";

function createSeoPlugin(siteUrl: string, googleSiteVerification?: string, googleAnalyticsId?: string): Plugin {
  const canonicalUrl = withTrailingSlash(siteUrl);
  const ogImageUrl = resolveAssetUrl(siteUrl, SOCIAL_IMAGE_PATH);
  const structuredData = JSON.stringify(
    createStructuredData({
      description: DEFAULT_META_DESCRIPTION,
      language: "fr",
      siteUrl
    })
  );

  return {
    name: "la-maison-seo",
    transformIndexHtml(html) {
      const tags: {
        attrs?: Record<string, string | boolean>;
        children?: string;
        injectTo?: "head" | "body" | "head-prepend" | "body-prepend";
        tag: string;
      }[] = [];

      if (googleSiteVerification) {
        tags.push({
          tag: "meta",
          attrs: {
            name: "google-site-verification",
            content: googleSiteVerification
          },
          injectTo: "head"
        });
      }

      if (googleAnalyticsId) {
        tags.push({
          tag: "script",
          attrs: {
            async: true,
            src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`
          },
          injectTo: "head"
        });
        tags.push({
          tag: "script",
          children: [
            "window.dataLayer = window.dataLayer || [];",
            "function gtag(){dataLayer.push(arguments);}",
            "gtag('js', new Date());",
            `gtag('config', '${googleAnalyticsId}');`
          ].join(""),
          injectTo: "head"
        });
      }

      return {
        html: html
          .replaceAll("__SITE_URL__", canonicalUrl)
          .replaceAll("__OG_IMAGE_URL__", ogImageUrl)
          .replace("__STRUCTURED_DATA__", structuredData),
        tags
      };
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: createRobotsTxt(siteUrl)
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: createSitemapXml(siteUrl)
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = resolveSiteUrl(env.VITE_SITE_URL || DEFAULT_SITE_URL);

  return {
    base: "./",
    plugins: [
      react(),
      createSeoPlugin(
        siteUrl,
        env.VITE_GOOGLE_SITE_VERIFICATION?.trim(),
        env.VITE_GA_MEASUREMENT_ID?.trim()
      )
    ]
  };
});
