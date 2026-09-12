import { NextResponse } from 'next/server';
import { api } from '@/lib/api';

export async function GET() {
  let feedData = {
    title: 'TechPulse AI Media',
    link: 'https://techpulse.ai',
    description: 'Frontier AI breakthroughs, tool reviews, software comparisons, and developer tutorials.',
    items: [
      {
        title: 'Claude 3.7 Sonnet & Hybrid Reasoning: The Architecture Breakthrough',
        link: 'https://techpulse.ai/post/claude-3-7-sonnet-hybrid-reasoning-breakthrough',
        pubDate: new Date().toUTCString(),
        description: 'Anthropic has unveiled Claude 3.7 Sonnet featuring dynamic thinking token budgets.',
        author: 'Alex Rivera',
      },
    ],
  };

  try {
    const res = await fetch('http://localhost:5000/api/v1/rss', { next: { revalidate: 60 } });
    const data = await res.json();
    if (data?.items) feedData = data;
  } catch (err) {}

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${feedData.title}</title>
    <link>${feedData.link}</link>
    <description>${feedData.description}</description>
    <language>en-us</language>
    ${feedData.items
      .map(
        item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${item.description}]]></description>
      <author>${item.author}</author>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
