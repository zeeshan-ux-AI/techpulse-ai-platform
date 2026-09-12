import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getSitemapData = async (req: Request, res: Response) => {
  try {
    const [posts, categories, tools, pages] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true, publishedAt: true },
      }),
      prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.aiTool.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.page.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    ]);

    const baseUrl = 'https://techpulse.ai';

    const urls = [
      { loc: baseUrl, lastmod: new Date().toISOString(), priority: 1.0 },
      { loc: `${baseUrl}/ai-news`, lastmod: new Date().toISOString(), priority: 0.9 },
      { loc: `${baseUrl}/ai-tools`, lastmod: new Date().toISOString(), priority: 0.9 },
      { loc: `${baseUrl}/software`, lastmod: new Date().toISOString(), priority: 0.8 },
      { loc: `${baseUrl}/reviews`, lastmod: new Date().toISOString(), priority: 0.8 },
      { loc: `${baseUrl}/comparisons`, lastmod: new Date().toISOString(), priority: 0.8 },
      { loc: `${baseUrl}/tutorials`, lastmod: new Date().toISOString(), priority: 0.8 },
      { loc: `${baseUrl}/deals`, lastmod: new Date().toISOString(), priority: 0.7 },
      ...posts.map((p: any) => ({
        loc: `${baseUrl}/post/${p.slug}`,
        lastmod: (p.updatedAt || p.publishedAt || new Date()).toISOString(),
        priority: 0.8,
      })),
      ...tools.map((t: any) => ({
        loc: `${baseUrl}/ai-tools/${t.slug}`,
        lastmod: t.updatedAt.toISOString(),
        priority: 0.7,
      })),
      ...categories.map((c: any) => ({
        loc: `${baseUrl}/category/${c.slug}`,
        lastmod: c.updatedAt.toISOString(),
        priority: 0.6,
      })),
      ...pages.map((p: any) => ({
        loc: `${baseUrl}/${p.slug}`,
        lastmod: p.updatedAt.toISOString(),
        priority: 0.5,
      })),
    ];

    return res.json({ success: true, data: urls });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getRssFeed = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      take: 30,
      orderBy: { publishedAt: 'desc' },
      include: { author: true, category: true },
    });

    const items = posts.map((p: any) => ({
      title: p.title,
      link: `https://techpulse.ai/post/${p.slug}`,
      pubDate: (p.publishedAt || p.createdAt).toUTCString(),
      description: p.excerpt,
      category: p.category.name,
      author: p.author.name,
    }));

    return res.json({
      title: 'TechPulse AI - Latest Breaking AI & Software Technology News',
      link: 'https://techpulse.ai',
      description: 'Frontier AI breakthroughs, tool reviews, software comparisons, and developer guides.',
      language: 'en-us',
      items,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
