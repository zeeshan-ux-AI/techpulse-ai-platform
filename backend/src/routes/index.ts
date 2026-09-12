import { Router } from 'express';
import { loginAdmin, getMe } from '../controllers/authController';
import {
  getPosts,
  getPostBySlug,
  getRelatedPosts,
  createPost,
  updatePost,
  deletePost,
  getCategories,
  getTags,
  getAuthors,
} from '../controllers/postController';
import {
  getTools,
  getToolBySlug,
  createTool,
  updateTool,
  deleteTool,
} from '../controllers/toolController';
import {
  getAffiliateLinks,
  createAffiliateLink,
  trackAffiliateClick,
  getSponsors,
  createSponsor,
  getAdSlots,
  updateAdSlot,
} from '../controllers/monetizationController';
import {
  listAgentKeys,
  createAgentKey,
  revokeAgentKey,
  rotateAgentKey,
  getAgentAuditLogs,
  agentGetPosts,
  agentCreatePost,
  agentUpdateSeo,
} from '../controllers/agentController';
import { getAnalyticsOverview } from '../controllers/analyticsController';
import { getSitemapData, getRssFeed } from '../controllers/seoController';

import { authenticateAdmin } from '../middleware/auth';
import { requireAgentPermission } from '../middleware/agentAuth';
import { agentApiLimiter, publicApiLimiter } from '../middleware/rateLimiter';

const router = Router();

// ==========================================
// 1. PUBLIC ENDPOINTS
// ==========================================
router.use(publicApiLimiter);

// Auth
router.post('/v1/auth/login', loginAdmin);
router.get('/v1/auth/me', authenticateAdmin, getMe);

// Posts & Taxonomy
router.get('/v1/posts', getPosts);
router.get('/v1/posts/:slug', getPostBySlug);
router.get('/v1/posts/:slug/related', getRelatedPosts);
router.get('/v1/categories', getCategories);
router.get('/v1/tags', getTags);
router.get('/v1/authors', getAuthors);

// AI Tools
router.get('/v1/ai-tools', getTools);
router.get('/v1/ai-tools/:slug', getToolBySlug);

// Monetization
router.post('/v1/affiliate/click/:id', trackAffiliateClick);
router.get('/v1/ad-slots', getAdSlots);

// SEO & Feeds
router.get('/v1/sitemap', getSitemapData);
router.get('/v1/rss', getRssFeed);

// ==========================================
// 2. ADMIN CMS ENDPOINTS (Protected)
// ==========================================
router.post('/v1/admin/posts', authenticateAdmin, createPost);
router.put('/v1/admin/posts/:id', authenticateAdmin, updatePost);
router.delete('/v1/admin/posts/:id', authenticateAdmin, deletePost);

router.post('/v1/admin/tools', authenticateAdmin, createTool);
router.put('/v1/admin/tools/:id', authenticateAdmin, updateTool);
router.delete('/v1/admin/tools/:id', authenticateAdmin, deleteTool);

router.get('/v1/admin/affiliates', authenticateAdmin, getAffiliateLinks);
router.post('/v1/admin/affiliates', authenticateAdmin, createAffiliateLink);

router.get('/v1/admin/sponsors', authenticateAdmin, getSponsors);
router.post('/v1/admin/sponsors', authenticateAdmin, createSponsor);

router.put('/v1/admin/ad-slots/:slotKey', authenticateAdmin, updateAdSlot);

router.get('/v1/admin/agent-keys', authenticateAdmin, listAgentKeys);
router.post('/v1/admin/agent-keys', authenticateAdmin, createAgentKey);
router.put('/v1/admin/agent-keys/:id/revoke', authenticateAdmin, revokeAgentKey);
router.post('/v1/admin/agent-keys/:id/rotate', authenticateAdmin, rotateAgentKey);
router.get('/v1/admin/agent-audit-logs', authenticateAdmin, getAgentAuditLogs);

router.get('/v1/admin/analytics', authenticateAdmin, getAnalyticsOverview);

// ==========================================
// 3. AI AGENT API ENDPOINTS (`/api/agent/v1/...`)
// ==========================================
router.use('/agent/v1', agentApiLimiter);

router.get('/agent/v1/posts', requireAgentPermission('content:read'), agentGetPosts);
router.post('/agent/v1/posts', requireAgentPermission('content:write'), agentCreatePost);
router.put('/agent/v1/posts/:postId/seo', requireAgentPermission('seo:write'), agentUpdateSeo);

export default router;
