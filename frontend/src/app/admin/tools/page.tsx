'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, Wrench, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';
import { AiTool } from '@/types';

export default function AdminToolsPage() {
  const [tools, setTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AiTool | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: '',
    description: '',
    pricingType: 'FREEMIUM',
    startingPrice: '$20/mo',
    rating: 4.8,
    category: 'Developer Tools',
    websiteUrl: '',
    affiliateUrl: '',
    isFeatured: true,
  });

  const loadTools = () => {
    setLoading(true);
    api.getTools({ limit: '100' })
      .then(res => {
        if (res.success && Array.isArray(res.data)) setTools(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTools();
  }, []);

  const openCreateModal = () => {
    setEditingTool(null);
    setFormData({
      name: '',
      slug: '',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      description: '',
      pricingType: 'FREEMIUM',
      startingPrice: '$20/mo',
      rating: 4.8,
      category: 'Developer Tools',
      websiteUrl: 'https://example.com',
      affiliateUrl: 'https://example.com/?ref=techpulse',
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tool: AiTool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      slug: tool.slug,
      logo: tool.logo || '',
      description: tool.description,
      pricingType: tool.pricingType,
      startingPrice: tool.startingPrice || '',
      rating: tool.rating,
      category: tool.category,
      websiteUrl: tool.websiteUrl,
      affiliateUrl: tool.affiliateUrl || '',
      isFeatured: tool.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTool) {
      await api.updateTool(editingTool.id, formData);
    } else {
      await api.createTool(formData);
    }
    setIsModalOpen(false);
    loadTools();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this AI tool entry?')) {
      await api.deleteTool(id);
      loadTools();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slateDark-800">
        <div>
          <h1 className="text-3xl font-black text-white">AI Tools Directory Manager</h1>
          <p className="text-xs text-slate-400">Curate software entries, affiliate URLs, pricing badges, and ratings.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Tool</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 font-mono text-slate-400">Loading AI tools...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <div key={tool.id} className="p-5 rounded-2xl border border-slateDark-800 bg-slateDark-900 space-y-3 relative group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slateDark-800 overflow-hidden border border-slateDark-700">
                  <img src={tool.logo || ''} alt={tool.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-slateDark-800 text-cyan-400 text-[10px] font-mono font-bold rounded">
                    {tool.pricingType}
                  </span>
                  <button onClick={() => openEditModal(tool)} className="p-1 text-slate-400 hover:text-cyan-300">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(tool.id)} className="p-1 text-slate-400 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{tool.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{tool.description}</p>
              </div>

              <div className="pt-2 border-t border-slateDark-800 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Rating: {tool.rating}/5</span>
                <span>{tool.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slateDark-900 border border-slateDark-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white pb-2 border-b border-slateDark-800">
              {editingTool ? 'Edit AI Tool' : 'Add New AI Tool'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Tool Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Pricing Type</label>
                  <select
                    value={formData.pricingType}
                    onChange={e => setFormData({ ...formData, pricingType: e.target.value })}
                    className="w-full px-3 py-2 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white"
                  >
                    <option value="FREE">FREE</option>
                    <option value="FREEMIUM">FREEMIUM</option>
                    <option value="PAID">PAID</option>
                    <option value="FREE_TRIAL">FREE_TRIAL</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={2}
                  className="w-full px-3 py-2 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Website URL</label>
                  <input
                    type="text"
                    value={formData.websiteUrl}
                    onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Affiliate Tracking URL</label>
                  <input
                    type="text"
                    value={formData.affiliateUrl}
                    onChange={e => setFormData({ ...formData, affiliateUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow">
                  Save Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
