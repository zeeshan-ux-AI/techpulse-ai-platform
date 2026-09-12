import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { AgentRequest } from '../middleware/agentAuth';

// ==========================================
// ADMIN CMS: AGENT API KEY MANAGEMENT
// ==========================================

export const listAgentKeys = async (req: Request, res: Response) => {
  try {
    const keys = await prisma.agentApiKey.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        permissions: true,
        isActive: true,
        lastUsedAt: true,
        revokedAt: true,
        createdAt: true,
        _count: { select: { auditLogs: true } },
      },
    });

    const formattedKeys = keys.map((k: any) => ({
      ...k,
      permissions: JSON.parse(k.permissions),
    }));

    return res.json({ success: true, data: formattedKeys });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createAgentKey = async (req: Request, res: Response) => {
  try {
    const { name, permissions = ['content:read', 'content:write', 'seo:write'] } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Agent key name is required.' });
    }

    // Generate secret key: tp_ag_<32 hex chars>
    const randomBuffer = crypto.randomBytes(16).toString('hex');
    const secretKey = `tp_ag_${randomBuffer}`;
    const keyPrefix = secretKey.substring(0, 10);
    const keyHash = crypto.createHash('sha256').update(secretKey).digest('hex');

    const agentKey = await prisma.agentApiKey.create({
      data: {
        name,
        keyPrefix,
        keyHash,
        permissions: JSON.stringify(permissions),
        isActive: true,
      },
    });

    // Record creation in audit log
    await prisma.agentAuditLog.create({
      data: {
        apiKeyId: agentKey.id,
        action: 'key:created',
        entityType: 'AgentApiKey',
        entityId: agentKey.id,
        payload: JSON.stringify({ name, permissions }),
        status: 'SUCCESS',
        ipAddress: req.ip || '127.0.0.1',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Agent API Key generated successfully. Copy this secret key now. It will NEVER be shown again!',
      data: {
        id: agentKey.id,
        name: agentKey.name,
        keyPrefix: agentKey.keyPrefix,
        secretKey, // Displayed ONLY ONCE
        permissions,
        createdAt: agentKey.createdAt,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const revokeAgentKey = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const key = await prisma.agentApiKey.findUnique({ where: { id } });
    if (!key) {
      return res.status(404).json({ success: false, error: 'Agent API key not found.' });
    }

    const updated = await prisma.agentApiKey.update({
      where: { id },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });

    await prisma.agentAuditLog.create({
      data: {
        apiKeyId: id,
        action: 'key:revoked',
        entityType: 'AgentApiKey',
        entityId: id,
        status: 'SUCCESS',
        ipAddress: req.ip || '127.0.0.1',
      },
    });

    return res.json({ success: true, message: 'Agent API key revoked.', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const rotateAgentKey = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const existingKey = await prisma.agentApiKey.findUnique({ where: { id } });
    if (!existingKey) {
      return res.status(404).json({ success: false, error: 'Agent API key not found.' });
    }

    // Revoke old key
    await prisma.agentApiKey.update({
      where: { id },
      data: { isActive: false, revokedAt: new Date() },
    });

    // Create new key with same name & permissions
    const randomBuffer = crypto.randomBytes(16).toString('hex');
    const secretKey = `tp_ag_${randomBuffer}`;
    const keyPrefix = secretKey.substring(0, 10);
    const keyHash = crypto.createHash('sha256').update(secretKey).digest('hex');

    const newKey = await prisma.agentApiKey.create({
      data: {
        name: `${existingKey.name} (Rotated)`,
        keyPrefix,
        keyHash,
        permissions: existingKey.permissions,
        isActive: true,
      },
    });

    await prisma.agentAuditLog.create({
      data: {
        apiKeyId: newKey.id,
        action: 'key:rotated',
        entityType: 'AgentApiKey',
        entityId: newKey.id,
        payload: JSON.stringify({ previousKeyId: id }),
        status: 'SUCCESS',
        ipAddress: req.ip || '127.0.0.1',
      },
    });

    return res.json({
      success: true,
      message: 'Agent API key rotated successfully. Copy your new secret key below.',
      data: {
        id: newKey.id,
        name: newKey.name,
        keyPrefix: newKey.keyPrefix,
        secretKey,
        permissions: JSON.parse(newKey.permissions),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getAgentAuditLogs = async (req: Request, res: Response) => {
  try {
    const { limit = '50' } = req.query;
    const logs = await prisma.agentAuditLog.findMany({
      take: parseInt(limit as string, 10) || 50,
      orderBy: { createdAt: 'desc' },
      include: {
        apiKey: { select: { name: true, keyPrefix: true } },
      },
    });

    const formattedLogs = logs.map((l: any) => ({
      ...l,
      payload: l.payload ? JSON.parse(l.payload) : null,
    }));

    return res.json({ success: true, data: formattedLogs });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ==========================================
// AGENT API ENDPOINTS (`/api/agent/v1/...`)
// ==========================================

export const agentGetPosts = async (req: AgentRequest, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { category: true, author: true, seo: true },
    });
    return res.json({ success: true, agent: req.agentKey?.name, data: posts });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const agentCreatePost = async (req: AgentRequest, res: Response) => {
  try {
    const { title, excerpt, content, categoryId, authorId, type = 'NEWS', status = 'DRAFT', seo } = req.body;
    if (!title || !excerpt || !content || !categoryId || !authorId) {
      return res.status(400).json({ success: false, error: 'Missing required post fields for agent creation.' });
    }

    const computedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    const post = await prisma.post.create({
      data: {
        title,
        slug: computedSlug,
        excerpt,
        content,
        readingTime,
        type: type.toUpperCase(),
        status: status.toUpperCase(),
        publishedAt: status.toUpperCase() === 'PUBLISHED' ? new Date() : null,
        categoryId,
        authorId,
        seo: {
          create: {
            title: seo?.title || title,
            metaDescription: seo?.metaDescription || excerpt,
            keywords: seo?.keywords || '',
            canonicalUrl: seo?.canonicalUrl || `https://techpulse.ai/post/${computedSlug}`,
            schemaType: 'Article',
          },
        },
      },
      include: { category: true, author: true, seo: true },
    });

    return res.status(201).json({
      success: true,
      message: 'Post created via AI Agent API.',
      agent: req.agentKey?.name,
      data: post,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const agentUpdateSeo = async (req: AgentRequest, res: Response) => {
  try {
    const postId = req.params.postId as string;
    const { title, metaDescription, keywords, canonicalUrl, ogImage, schemaType } = req.body;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found for SEO update.' });
    }

    const updatedSeo = await prisma.seoMetadata.upsert({
      where: { postId },
      create: {
        postId,
        title: title || post.title,
        metaDescription: metaDescription || post.excerpt,
        keywords: keywords || '',
        canonicalUrl: canonicalUrl || `https://techpulse.ai/post/${post.slug}`,
        ogImage: ogImage || post.featuredImage,
        schemaType: schemaType || 'Article',
      },
      update: {
        title,
        metaDescription,
        keywords,
        canonicalUrl,
        ogImage,
        schemaType,
      },
    });

    return res.json({
      success: true,
      message: 'SEO metadata updated via AI Agent API.',
      agent: req.agentKey?.name,
      data: updatedSeo,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
