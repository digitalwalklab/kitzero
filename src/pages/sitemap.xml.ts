import type { APIRoute } from 'astro';

const SITE = 'https://kitzero.jokerx04.com';

const ROUTE_PATHS = [
  '/',
  '/image-optimizer/',
  '/thumbnail-resizer/',
  '/image-crop/',
  '/image-blur/',
  '/heic-converter/',
  '/watermark/',
  '/image-merge/',
  '/id-photo/',
  '/pdf-tools/',
  '/pdf-merge/',
  '/pdf-split/',
  '/pdf-to-image/',
  '/image-to-pdf/',
  '/pdf-organize/',
  '/pdf-compress/',
  '/pdf-watermark/',
  '/pdf-sign/',
  '/qr-generator/',
  '/favicon-generator/',
  '/svg-converter/',
  '/word-counter/',
  '/color-picker/',
  '/about/',
  '/terms/',
  '/privacy/',
];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().split('T')[0];

  const entries = ROUTE_PATHS.flatMap((path) => {
    const koUrl = `${SITE}${path}`;
    const enUrl = `${SITE}${path === '/' ? '/en/' : `/en${path}`}`;
    const priority =
      path === '/'
        ? '1.0'
        : path === '/privacy/' || path === '/terms/' || path === '/about/'
          ? '0.4'
          : '0.8';

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
