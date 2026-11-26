const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const config = fs.readFileSync(
  path.join(root, "src/seo/seoConfig.ts"),
  "utf8"
);

const json = config.match(
  /export const seoConfig: Record<string, SEOData> = (\{[\s\S]*\});\s*$/
);

if (!json) {
  throw new Error("Cannot parse SEO config");
}

const routes = Object.keys(JSON.parse(json[1]));

const BASE_URL = "https://www.askoxy.ai";

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  routes
    .map(
      (route) =>
        `  <url><loc>${escapeXml(BASE_URL + route)}</loc></url>`
    )
    .join("\n") +
  "\n</urlset>\n";

fs.writeFileSync(
  path.join(root, "public/sitemap.xml"),
  xml
);

console.log(
  `Generated sitemap with ${routes.length} public URLs`
);
