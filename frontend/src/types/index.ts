export interface Author {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatar?: string;
  email?: string;
  socialLinks?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Sponsor {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  websiteUrl: string;
  disclosureText?: string;
}

export interface SeoMetadata {
  id: string;
  postId?: string;
  title: string;
  metaDescription: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  twitterCard?: string;
  schemaType?: string;
  altText?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  readingTime: number;
  type: 'NEWS' | 'REVIEW' | 'COMPARISON' | 'TUTORIAL' | 'SOFTWARE' | 'DEAL';
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  publishedAt?: string;
  isFeatured: boolean;
  isTrending: boolean;
  isSponsored: boolean;
  sponsorId?: string;
  sponsor?: Sponsor;
  categoryId: string;
  category: Category;
  authorId: string;
  author: Author;
  viewCount: number;
  sharesCount: number;
  tags: Tag[];
  seo?: SeoMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface AiTool {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description: string;
  pricingType: 'FREE' | 'FREEMIUM' | 'PAID' | 'FREE_TRIAL';
  startingPrice?: string;
  rating: number;
  category: string;
  websiteUrl: string;
  affiliateUrl?: string;
  features: string[];
  pros: string[];
  cons: string[];
  isFeatured: boolean;
  createdAt: string;
}

export interface AffiliateLink {
  id: string;
  title: string;
  slug: string;
  originalUrl: string;
  affiliateUrl: string;
  code?: string;
  category?: string;
  totalClicks: number;
  createdAt: string;
}

export interface AdSlotData {
  id: string;
  slotKey: 'HEADER' | 'HOMEPAGE' | 'ARTICLE_TOP' | 'ARTICLE_MIDDLE' | 'ARTICLE_BOTTOM' | 'SIDEBAR' | 'FOOTER';
  name: string;
  isEnabled: boolean;
  codeSnippet?: string;
  fallbackHtml?: string;
}

export interface AgentApiKeyData {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  isActive: boolean;
  lastUsedAt?: string;
  revokedAt?: string;
  createdAt: string;
  _count?: { auditLogs: number };
}

export interface AgentAuditLogData {
  id: string;
  apiKeyId: string;
  apiKey?: { name: string; keyPrefix: string };
  action: string;
  entityType: string;
  entityId?: string;
  payload?: any;
  status: 'SUCCESS' | 'DENIED' | 'FAILED';
  ipAddress?: string;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  totalAffiliateClicks: number;
  totalTools: number;
  activeAgentKeys: number;
  viewsLast24h: number;
  affiliateClicksLast24h: number;
}
