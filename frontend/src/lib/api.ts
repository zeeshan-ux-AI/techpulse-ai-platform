const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://techpulse-ai-platform-1.onrender.com/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('techpulse_admin_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    next: { revalidate: 60 }, // Revalidate cache every 60s
  };

  try {
    const res = await fetch(url, mergedOptions);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error! status: ${res.status}`);
    }
    return data;
  } catch (err: any) {
    console.error(`API Fetch Error [${endpoint}]:`, err.message);
    throw err;
  }
}

// Client helper API wrappers
export const api = {
  // Posts
  getPosts: (params: Record<string, string> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchApi<any>(`/v1/posts?${queryString}`);
  },
  getPostBySlug: (slug: string) => fetchApi<any>(`/v1/posts/${slug}`),
  getRelatedPosts: (slug: string) => fetchApi<any>(`/v1/posts/${slug}/related`),
  getCategories: () => fetchApi<any>('/v1/categories'),
  getTags: () => fetchApi<any>('/v1/tags'),
  getAuthors: () => fetchApi<any>('/v1/authors'),

  // Tools
  getTools: (params: Record<string, string> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchApi<any>(`/v1/ai-tools?${queryString}`);
  },
  getToolBySlug: (slug: string) => fetchApi<any>(`/v1/ai-tools/${slug}`),

  // Monetization
  trackAffiliateClick: (id: string, postSlug?: string) =>
    fetchApi<any>(`/v1/affiliate/click/${id}`, {
      method: 'POST',
      body: JSON.stringify({ postSlug }),
    }),
  getAdSlots: () => fetchApi<any>('/v1/ad-slots'),

  // SEO & Feeds
  getSitemapData: () => fetchApi<any>('/v1/sitemap'),

  // Auth & Admin
  loginAdmin: (credentials: any) =>
    fetchApi<any>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => fetchApi<any>('/v1/auth/me'),

  // Admin CMS Operations
  createPost: (postData: any) =>
    fetchApi<any>('/v1/admin/posts', { method: 'POST', body: JSON.stringify(postData) }),
  updatePost: (id: string, postData: any) =>
    fetchApi<any>(`/v1/admin/posts/${id}`, { method: 'PUT', body: JSON.stringify(postData) }),
  deletePost: (id: string) =>
    fetchApi<any>(`/v1/admin/posts/${id}`, { method: 'DELETE' }),

  createTool: (toolData: any) =>
    fetchApi<any>('/v1/admin/tools', { method: 'POST', body: JSON.stringify(toolData) }),
  updateTool: (id: string, toolData: any) =>
    fetchApi<any>(`/v1/admin/tools/${id}`, { method: 'PUT', body: JSON.stringify(toolData) }),
  deleteTool: (id: string) =>
    fetchApi<any>(`/v1/admin/tools/${id}`, { method: 'DELETE' }),

  getAffiliates: () => fetchApi<any>('/v1/admin/affiliates'),
  createAffiliate: (affData: any) =>
    fetchApi<any>('/v1/admin/affiliates', { method: 'POST', body: JSON.stringify(affData) }),

  getSponsors: () => fetchApi<any>('/v1/admin/sponsors'),
  createSponsor: (sponsorData: any) =>
    fetchApi<any>('/v1/admin/sponsors', { method: 'POST', body: JSON.stringify(sponsorData) }),

  updateAdSlot: (slotKey: string, slotData: any) =>
    fetchApi<any>(`/v1/admin/ad-slots/${slotKey}`, { method: 'PUT', body: JSON.stringify(slotData) }),

  getAgentKeys: () => fetchApi<any>('/v1/admin/agent-keys'),
  createAgentKey: (keyData: any) =>
    fetchApi<any>('/v1/admin/agent-keys', { method: 'POST', body: JSON.stringify(keyData) }),
  revokeAgentKey: (id: string) =>
    fetchApi<any>(`/v1/admin/agent-keys/${id}/revoke`, { method: 'PUT' }),
  rotateAgentKey: (id: string) =>
    fetchApi<any>(`/v1/admin/agent-keys/${id}/rotate`, { method: 'POST' }),
  getAgentAuditLogs: () => fetchApi<any>('/v1/admin/agent-audit-logs'),

  getAnalytics: () => fetchApi<any>('/v1/admin/analytics'),
};
