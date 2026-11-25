import type { APIRoute } from 'astro';
import { translations } from '../../i18n/translations';

const SITE = 'https://kitzero.jokerx04.com';

function escapeXml(str: string): string {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = () => {
  const t = translations.en;
  const pubDate = new Date().toUTCString();

  const items = t.tools
    .map((tool) => {
      const link = `${SITE}${tool.slug}`;
      return `    <item>
      <title>${escapeXml(tool.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(tool.description)}</description>
      <category>${escapeXml(tool.badge)}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(t.home.metaTitle)}</title>
    <link>${SITE}/en/</link>
    <description>${escapeXml(t.home.metaDesc)}</description>
    <language>en-US</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="${SITE}/en/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
