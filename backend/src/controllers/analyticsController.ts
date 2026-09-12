import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAnalyticsOverview = async (req: Request, res: Response) => {
  try {
    const [
      totalPosts,
      publishedPosts,
      totalViewsAgg,
      totalAffiliateClicksAgg,
      totalTools,
      totalAgentKeys,
      recentViews,
      recentAffiliateClicks,
      topPosts,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.aggregate({ _sum: { viewCount: true } }),
      prisma.affiliateLink.aggregate({ _sum: { totalClicks: true } }),
      prisma.aiTool.count(),
      prisma.agentApiKey.count({ where: { isActive: true } }),
      prisma.postViewLog.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.affiliateClickLog.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.post.findMany({
        take: 5,
        orderBy: { viewCount: 'desc' },
        select: { id: true, title: true, slug: true, viewCount: true, type: true, publishedAt: true },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        summary: {
          totalPosts,
          publishedPosts,
          totalViews: totalViewsAgg._sum.viewCount || 0,
          totalAffiliateClicks: totalAffiliateClicksAgg._sum.totalClicks || 0,
          totalTools,
          activeAgentKeys: totalAgentKeys,
          viewsLast24h: recentViews,
          affiliateClicksLast24h: recentAffiliateClicks,
        },
        topPosts,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
