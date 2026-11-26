import type { APIRoute } from 'astro';
import { LEGAL_PATHS, SITEMAP_PATHS } from '../i18n/toolRegistry';

const SITE = 'https://kitzero.jokerx04.com';
const LOW_PRIORITY = new Set<string>(LEGAL_PATHS);

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().split('T')[0];

  const entries = SITEMAP_PATHS.flatMap((path) => {
    const koUrl = `${SITE}${path}`;
    const enUrl = `${SITE}${path === '/' ? '/en/' : `/en${path}`}`;
    const priority = path === '/' ? '1.0' : LOW_PRIORITY.has(path) ? '0.4' : '0.8';

    const links = `    <xhtml:link rel="alternate" hreflang="ko" href="${koUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />`;

    return [
      `  <url>
    <loc>${koUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
${links}
  </url>`,
      `  <url>
    <loc>${enUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
${links}
  </url>`,
    ];
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
