import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      type,
      category,
      tag,
      search,
      featured,
      trending,
      status = 'PUBLISHED',
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status as string;
    }

    if (type) {
      where.type = (type as string).toUpperCase();
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (trending === 'true') {
      where.isTrending = true;
    }

    if (category) {
      where.category = {
        slug: category as string,
      };
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag as string,
          },
        },
      };
    }

    if (search) {
      const q = search as string;
      where.OR = [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
      ];
    }

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { publishedAt: 'desc' },
        include: {
          category: true,
          author: true,
          sponsor: true,
          seo: true,
          tags: {
            include: { tag: true },
          },
        },
      }),
    ]);

    const formattedPosts = posts.map((p: any) => ({
      ...p,
      tags: p.tags.map((t: any) => t.tag),
    }));

    return res.json({
      success: true,
      data: formattedPosts,
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

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        author: true,
        sponsor: true,
        seo: true,
        tags: {
          include: { tag: true },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found.' });
    }

    // Async increment view count & view log
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const ipHash = crypto.createHash('md5').update(ipAddress).digest('hex');

    prisma.post
      .update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {});

    prisma.postViewLog
      .create({
        data: { postId: post.id, ipHash },
      })
      .catch(() => {});

    const formattedPost = {
      ...post,
      tags: post.tags.map((t: any) => t.tag),
    };

    return res.json({ success: true, data: formattedPost });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getRelatedPosts = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const currentPost = await prisma.post.findUnique({
      where: { slug },
      select: { id: true, categoryId: true },
    });

    if (!currentPost) {
      return res.status(404).json({ success: false, error: 'Post not found.' });
    }

    const posts = await prisma.post.findMany({
      where: {
        categoryId: currentPost.categoryId,
        id: { not: currentPost.id },
        status: 'PUBLISHED',
      },
      take: 4,
      orderBy: { publishedAt: 'desc' },
      include: {
        category: true,
        author: true,
        tags: { include: { tag: true } },
      },
    });

    return res.json({
      success: true,
      data: posts.map((p: any) => ({ ...p, tags: p.tags.map((t: any) => t.tag) })),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      readingTime,
      type = 'NEWS',
      status = 'DRAFT',
      isFeatured = false,
      isTrending = false,
      isSponsored = false,
      sponsorId,
      categoryId,
      authorId,
      tagIds = [],
      seo = {},
    } = req.body;

    if (!title || !excerpt || !content || !categoryId || !authorId) {
      return res.status(400).json({ success: false, error: 'Missing required post fields.' });
    }

    const computedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Calculate reading time if not provided (~200 words per min)
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const computedReadingTime = readingTime || Math.max(1, Math.ceil(words / 200));

    const post = await prisma.post.create({
      data: {
        title,
        slug: computedSlug,
        excerpt,
        content,
        featuredImage,
        readingTime: computedReadingTime,
        type: type.toUpperCase(),
        status: status.toUpperCase(),
        publishedAt: status.toUpperCase() === 'PUBLISHED' ? new Date() : null,
        isFeatured,
        isTrending,
        isSponsored,
        sponsorId: isSponsored ? sponsorId : null,
        categoryId,
        authorId,
        tags: {
          create: tagIds.map((tId: string) => ({
            tag: { connect: { id: tId } },
          })),
        },
        seo: {
          create: {
            title: seo.title || title,
            metaDescription: seo.metaDescription || excerpt,
            keywords: seo.keywords || '',
            canonicalUrl: seo.canonicalUrl || `https://techpulse.ai/post/${computedSlug}`,
            ogImage: seo.ogImage || featuredImage,
            twitterCard: seo.twitterCard || 'summary_large_image',
            schemaType: seo.schemaType || 'Article',
            altText: seo.altText || title,
          },
        },
      },
      include: {
        category: true,
        author: true,
        sponsor: true,
        seo: true,
        tags: { include: { tag: true } },
      },
    });

    return res.status(201).json({
      success: true,
      data: { ...post, tags: post.tags.map((t: any) => t.tag) },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      readingTime,
      type,
      status,
      isFeatured,
      isTrending,
      isSponsored,
      sponsorId,
      categoryId,
      authorId,
      tagIds,
      seo,
    } = req.body;

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Post not found.' });
    }

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (slug !== undefined) dataToUpdate.slug = slug;
    if (excerpt !== undefined) dataToUpdate.excerpt = excerpt;
    if (content !== undefined) {
      dataToUpdate.content = content;
      const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      dataToUpdate.readingTime = readingTime || Math.max(1, Math.ceil(words / 200));
    }
    if (featuredImage !== undefined) dataToUpdate.featuredImage = featuredImage;
    if (type !== undefined) dataToUpdate.type = type.toUpperCase();
    if (status !== undefined) {
      dataToUpdate.status = status.toUpperCase();
      if (status.toUpperCase() === 'PUBLISHED' && !existing.publishedAt) {
        dataToUpdate.publishedAt = new Date();
      }
    }
    if (isFeatured !== undefined) dataToUpdate.isFeatured = isFeatured;
    if (isTrending !== undefined) dataToUpdate.isTrending = isTrending;
    if (isSponsored !== undefined) {
      dataToUpdate.isSponsored = isSponsored;
      dataToUpdate.sponsorId = isSponsored ? sponsorId : null;
    }
    if (categoryId !== undefined) dataToUpdate.categoryId = categoryId;
    if (authorId !== undefined) dataToUpdate.authorId = authorId;

    if (tagIds !== undefined) {
      await prisma.postTag.deleteMany({ where: { postId: id } });
      dataToUpdate.tags = {
        create: tagIds.map((tId: string) => ({
          tag: { connect: { id: tId } },
        })),
      };
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: dataToUpdate,
      include: {
        category: true,
        author: true,
        sponsor: true,
        seo: true,
        tags: { include: { tag: true } },
      },
    });

    if (seo !== undefined) {
      await prisma.seoMetadata.upsert({
        where: { postId: id },
        create: {
          postId: id,
          title: seo.title || updatedPost.title,
          metaDescription: seo.metaDescription || updatedPost.excerpt,
          keywords: seo.keywords || '',
          canonicalUrl: seo.canonicalUrl || `https://techpulse.ai/post/${updatedPost.slug}`,
          ogImage: seo.ogImage || updatedPost.featuredImage,
          twitterCard: seo.twitterCard || 'summary_large_image',
          schemaType: seo.schemaType || 'Article',
          altText: seo.altText || updatedPost.title,
        },
        update: {
          title: seo.title,
          metaDescription: seo.metaDescription,
          keywords: seo.keywords,
          canonicalUrl: seo.canonicalUrl,
          ogImage: seo.ogImage,
          twitterCard: seo.twitterCard,
          schemaType: seo.schemaType,
          altText: seo.altText,
        },
      });
    }

    const finalPost = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        author: true,
        sponsor: true,
        seo: true,
        tags: { include: { tag: true } },
      },
    });

    return res.json({
      success: true,
      data: finalPost ? { ...finalPost, tags: finalPost.tags.map((t: any) => t.tag) } : null,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({ where: { id } });
    return res.json({ success: true, message: 'Post deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { posts: true } },
      },
    });
    return res.json({ success: true, data: categories });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });
    return res.json({ success: true, data: tags });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await prisma.author.findMany({ orderBy: { name: 'asc' } });
    return res.json({ success: true, data: authors });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
