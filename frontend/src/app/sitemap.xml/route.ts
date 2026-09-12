import { NextResponse } from 'next/server';
import { api } from '@/lib/api';

export async function GET() {
  const baseUrl = 'https://techpulse.ai';

  let urls = [
    { loc: baseUrl, lastmod: new Date().toISOString(), priority: '1.0' },
    { loc: `${baseUrl}/ai-news`, lastmod: new Date().toISOString(), priority: '0.9' },
    { loc: `${baseUrl}/ai-tools`, lastmod: new Date().toISOString(), priority: '0.9' },
    { loc: `${baseUrl}/software`, lastmod: new Date().toISOString(), priority: '0.8' },
    { loc: `${baseUrl}/reviews`, lastmod: new Date().toISOString(), priority: '0.8' },
    { loc: `${baseUrl}/comparisons`, lastmod: new Date().toISOString(), priority: '0.8' },
    { loc: `${baseUrl}/tutorials`, lastmod: new Date().toISOString(), priority: '0.8' },
    { loc: `${baseUrl}/deals`, lastmod: new Date().toISOString(), priority: '0.7' },
  ];

  try {
    const res = await api.getSitemapData();
    if (res?.success && Array.isArray(res.data)) {
      urls = res.data;
    }
  } catch (err) {
    console.error('Sitemap dynamic fetch fallback:', err);
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      u => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || new Date().toISOString()}</lastmod>
    <priority>${u.priority || '0.8'}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
