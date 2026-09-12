'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Globe, Search, FileText, Check, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { Post, Category, Author } from '@/types';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    type: 'NEWS',
    status: 'PUBLISHED',
    isFeatured: false,
    isTrending: false,
    categoryId: '',
    authorId: '',
    seoTitle: '',
    metaDescription: '',
    keywords: '',
    canonicalUrl: '',
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getPosts({ status: 'ALL', limit: '50' }), api.getCategories(), api.getAuthors()])
      .then(([postsRes, catsRes, authorsRes]) => {
        if (postsRes?.success && Array.isArray(postsRes.data)) setPosts(postsRes.data);
        if (catsRes?.success && Array.isArray(catsRes.data)) {
          setCategories(catsRes.data);
          if (catsRes.data.length > 0 && !formData.categoryId) {
            setFormData(prev => ({ ...prev, categoryId: catsRes.data[0].id }));
          }
        }
        if (authorsRes?.success && Array.isArray(authorsRes.data)) {
          setAuthors(authorsRes.data);
          if (authorsRes.data.length > 0 && !formData.authorId) {
            setFormData(prev => ({ ...prev, authorId: authorsRes.data[0].id }));
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '<p>Write technical post content here...</p>',
      featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      type: 'NEWS',
      status: 'PUBLISHED',
      isFeatured: false,
      isTrending: false,
      categoryId: categories[0]?.id || '',
      authorId: authors[0]?.id || '',
      seoTitle: '',
      metaDescription: '',
      keywords: '',
      canonicalUrl: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage || '',
      type: post.type,
      status: post.status,
      isFeatured: post.isFeatured,
      isTrending: post.isTrending,
      categoryId: post.categoryId,
      authorId: post.authorId,
      seoTitle: post.seo?.title || post.title,
      metaDescription: post.seo?.metaDescription || post.excerpt,
      keywords: post.seo?.keywords || '',
      canonicalUrl: post.seo?.canonicalUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      seo: {
        title: formData.seoTitle || formData.title,
        metaDescription: formData.metaDescription || formData.excerpt,
        keywords: formData.keywords,
        canonicalUrl: formData.canonicalUrl,
      },
    };

    if (editingPost) {
      await api.updatePost(editingPost.id, payload);
    } else {
      await api.createPost(payload);
    }
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      await api.deletePost(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slateDark-800">
        <div>
          <h1 className="text-3xl font-black text-white">Posts & SEO Manager</h1>
          <p className="text-xs text-slate-400">Publish breaking AI stories, reviews, and manage SEO meta tags.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="text-center py-12 font-mono text-slate-400">Loading articles...</div>
      ) : (
        <div className="rounded-2xl border border-slateDark-800 bg-slateDark-900 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slateDark-950 text-slate-400 font-mono border-b border-slateDark-800">
                  <th className="p-4">Title & Slug</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Views</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slateDark-800">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-slateDark-850/50 transition-colors">
                    <td className="p-4 font-semibold text-white space-y-0.5">
                      <p className="line-clamp-1">{post.title}</p>
                      <p className="text-[10px] font-mono text-cyan-400">/post/{post.slug}</p>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{post.type}</td>
                    <td className="p-4 text-slate-300">{post.category?.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        post.status === 'PUBLISHED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slateDark-800 text-slate-400'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-400">{post.viewCount}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(post)}
                        className="p-1.5 rounded bg-slateDark-800 hover:text-cyan-300 text-slate-400"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 rounded bg-slateDark-800 hover:text-rose-400 text-slate-400"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Article Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-slateDark-900 border border-slateDark-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slateDark-800">
              <h2 className="text-xl font-bold text-white">
                {editingPost ? 'Edit Article & SEO' : 'Create New Article'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Article Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated-if-empty"
                    className="w-full px-3 py-2 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Excerpt / Summary</label>
                <textarea
                  value={formData.excerpt}
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                  rows={2}
                  className="w-full px-3 py-2 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white"
                  >
                    <option value="NEWS">NEWS</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="COMPARISON">COMPARISON</option>
                    <option value="TUTORIAL">TUTORIAL</option>
                    <option value="SOFTWARE">SOFTWARE</option>
                    <option value="DEAL">DEAL</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Author</label>
                  <select
                    value={formData.authorId}
                    onChange={e => setFormData({ ...formData, authorId: e.target.value })}
                    className="w-full px-3 py-2 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white"
                  >
                    {authors.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Featured Image URL</label>
                <input
                  type="text"
                  value={formData.featuredImage}
                  onChange={e => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full px-3 py-2 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Article Rich HTML Content</label>
                <textarea
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={8}
                  className="w-full px-3 py-2 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* SEO Panel Box */}
              <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/10 space-y-3">
                <h4 className="font-bold text-cyan-400 flex items-center space-x-1.5">
                  <Globe className="w-4 h-4" />
                  <span>SEO & Meta Configuration</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">SEO Title</label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder={formData.title}
                      className="w-full px-3 py-1.5 bg-slateDark-950 border border-slateDark-700 rounded-lg text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Focus Keywords</label>
                    <input
                      type="text"
                      value={formData.keywords}
                      onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                      placeholder="e.g. Claude 3.7, Hybrid Reasoning"
                      className="w-full px-3 py-1.5 bg-slateDark-950 border border-slateDark-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-md"
                >
                  Save & Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
