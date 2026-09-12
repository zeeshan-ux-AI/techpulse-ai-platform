import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

// --- Affiliate Link Operations ---
export const getAffiliateLinks = async (req: Request, res: Response) => {
  try {
    const links = await prisma.affiliateLink.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { clicks: true } },
      },
    });
    return res.json({ success: true, data: links });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createAffiliateLink = async (req: Request, res: Response) => {
  try {
    const { title, slug, originalUrl, affiliateUrl, code, category } = req.body;
    if (!title || !originalUrl || !affiliateUrl) {
      return res.status(400).json({ success: false, error: 'Missing required affiliate link fields.' });
    }
    const computedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const link = await prisma.affiliateLink.create({
      data: {
        title,
        slug: computedSlug,
        originalUrl,
        affiliateUrl,
        code,
        category,
      },
    });
    return res.status(201).json({ success: true, data: link });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const trackAffiliateClick = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { postSlug } = req.body;
    const referrer = (req.headers.referer as string) || '';
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const ipHash = crypto.createHash('md5').update(ipAddress).digest('hex');

    const link = await prisma.affiliateLink.findUnique({ where: { id } });
    if (!link) {
      return res.status(404).json({ success: false, error: 'Affiliate link not found.' });
    }

    // Increment click count & log detailed click
    await Promise.all([
      prisma.affiliateLink.update({
        where: { id },
        data: { totalClicks: { increment: 1 } },
      }),
      prisma.affiliateClickLog.create({
        data: {
          affiliateLinkId: id,
          postSlug,
          referrer,
          ipHash,
        },
      }),
    ]);

    return res.json({ success: true, redirectUrl: link.affiliateUrl });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// --- Sponsored Posts Operations ---
export const getSponsors = async (req: Request, res: Response) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
    return res.json({ success: true, data: sponsors });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createSponsor = async (req: Request, res: Response) => {
  try {
    const { name, slug, logo, websiteUrl, disclosureText } = req.body;
    if (!name || !websiteUrl) {
      return res.status(400).json({ success: false, error: 'Name and website URL are required.' });
    }
    const computedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const sponsor = await prisma.sponsor.create({
      data: {
        name,
        slug: computedSlug,
        logo,
        websiteUrl,
        disclosureText,
      },
    });
    return res.status(201).json({ success: true, data: sponsor });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// --- AdSlots Operations ---
export const getAdSlots = async (req: Request, res: Response) => {
  try {
    const slots = await prisma.adSlot.findMany({ orderBy: { slotKey: 'asc' } });
    return res.json({ success: true, data: slots });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateAdSlot = async (req: Request, res: Response) => {
  try {
    const { slotKey } = req.params;
    const { isEnabled, codeSnippet, fallbackHtml, name } = req.body;

    const data: any = {};
    if (isEnabled !== undefined) data.isEnabled = isEnabled;
    if (codeSnippet !== undefined) data.codeSnippet = codeSnippet;
    if (fallbackHtml !== undefined) data.fallbackHtml = fallbackHtml;
    if (name !== undefined) data.name = name;

    const updated = await prisma.adSlot.update({
      where: { slotKey: (slotKey as string).toUpperCase() },
      data,
    });

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
