import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getTools = async (req: Request, res: Response) => {
  try {
    const { category, pricing, search, featured, page = '1', limit = '12' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (category) {
      where.category = category as string;
    }

    if (pricing) {
      where.pricingType = (pricing as string).toUpperCase();
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      const q = search as string;
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { category: { contains: q } },
      ];
    }

    const [total, tools] = await Promise.all([
      prisma.aiTool.count({ where }),
      prisma.aiTool.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }],
      }),
    ]);

    const formattedTools = tools.map((t: any) => ({
      ...t,
      features: t.features ? JSON.parse(t.features) : [],
      pros: t.pros ? JSON.parse(t.pros) : [],
      cons: t.cons ? JSON.parse(t.cons) : [],
    }));

    return res.json({
      success: true,
      data: formattedTools,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getToolBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const tool = await prisma.aiTool.findUnique({ where: { slug } });
    if (!tool) {
      return res.status(404).json({ success: false, error: 'AI Tool not found.' });
    }
    return res.json({
      success: true,
      data: {
        ...tool,
        features: tool.features ? JSON.parse(tool.features) : [],
        pros: tool.pros ? JSON.parse(tool.pros) : [],
        cons: tool.cons ? JSON.parse(tool.cons) : [],
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createTool = async (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      logo,
      description,
      pricingType = 'FREEMIUM',
      startingPrice,
      rating = 4.5,
      category,
      websiteUrl,
      affiliateUrl,
      features = [],
      pros = [],
      cons = [],
      isFeatured = false,
    } = req.body;

    if (!name || !description || !category || !websiteUrl) {
      return res.status(400).json({ success: false, error: 'Missing required AI tool fields.' });
    }

    const computedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const tool = await prisma.aiTool.create({
      data: {
        name,
        slug: computedSlug,
        logo,
        description,
        pricingType: pricingType.toUpperCase(),
        startingPrice,
        rating: parseFloat(rating),
        category,
        websiteUrl,
        affiliateUrl,
        features: JSON.stringify(features),
        pros: JSON.stringify(pros),
        cons: JSON.stringify(cons),
        isFeatured,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        ...tool,
        features,
        pros,
        cons,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateTool = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      logo,
      description,
      pricingType,
      startingPrice,
      rating,
      category,
      websiteUrl,
      affiliateUrl,
      features,
      pros,
      cons,
      isFeatured,
    } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug;
    if (logo !== undefined) data.logo = logo;
    if (description !== undefined) data.description = description;
    if (pricingType !== undefined) data.pricingType = pricingType.toUpperCase();
    if (startingPrice !== undefined) data.startingPrice = startingPrice;
    if (rating !== undefined) data.rating = parseFloat(rating);
    if (category !== undefined) data.category = category;
    if (websiteUrl !== undefined) data.websiteUrl = websiteUrl;
    if (affiliateUrl !== undefined) data.affiliateUrl = affiliateUrl;
    if (features !== undefined) data.features = JSON.stringify(features);
    if (pros !== undefined) data.pros = JSON.stringify(pros);
    if (cons !== undefined) data.cons = JSON.stringify(cons);
    if (isFeatured !== undefined) data.isFeatured = isFeatured;

    const updated = await prisma.aiTool.update({
      where: { id },
      data,
    });

    return res.json({
      success: true,
      data: {
        ...updated,
        features: updated.features ? JSON.parse(updated.features) : [],
        pros: updated.pros ? JSON.parse(updated.pros) : [],
        cons: updated.cons ? JSON.parse(updated.cons) : [],
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteTool = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.aiTool.delete({ where: { id } });
    return res.json({ success: true, message: 'AI Tool deleted.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
