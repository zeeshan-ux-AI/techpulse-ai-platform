'use client';

import React, { useState, useEffect } from 'react';
import { Search, Star, ExternalLink, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { AiTool } from '@/types';
import { AdSlot } from '@/components/AdSlot';

export default function AiToolsDirectoryPage() {
  const [tools, setTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPricing, setSelectedPricing] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedPricing !== 'ALL') params.pricing = selectedPricing;
    if (selectedCategory !== 'ALL') params.category = selectedCategory;

    api
      .getTools(params)
      .then(res => {
        if (isMounted && res.success && Array.isArray(res.data)) {
          setTools(res.data);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedPricing, selectedCategory]);

  const categories = ['ALL', 'Developer Tools', 'Language Models', 'Research & Search', 'Audio & Speech', 'Design & Video'];
  const pricingTiers = ['ALL', 'FREE', 'FREEMIUM', 'PAID', 'FREE_TRIAL'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Directory Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated AI Software Directory</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Discover & Compare Frontier AI Tools
        </h1>
        <p className="text-slate-300 text-base">
          Evaluated ratings, feature breakdowns, pricing plans, and verified partner deals for developers and teams.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-6 rounded-2xl border border-slateDark-800 bg-slateDark-950/80 backdrop-blur-md space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search AI tools by name, features, or category (e.g. Cursor, Claude, Voice...)"
            className="w-full pl-12 pr-4 py-3 bg-slateDark-900 border border-slateDark-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slateDark-800 text-slate-300 hover:bg-slateDark-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pricing Selector */}
          <div className="flex items-center space-x-2 text-xs font-mono shrink-0">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Pricing:</span>
            <select
              value={selectedPricing}
              onChange={e => setSelectedPricing(e.target.value)}
              className="bg-slateDark-900 border border-slateDark-700 text-white rounded-lg px-2.5 py-1 focus:outline-none"
            >
              {pricingTiers.map(tier => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <AdSlot location="HEADER" />

      {/* Tools Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-mono">Loading AI Tools directory...</div>
      ) : tools.length === 0 ? (
        <div className="text-center py-20 bg-slateDark-950 rounded-2xl border border-slateDark-800 space-y-2">
          <p className="text-lg font-bold text-white">No AI Tools found matching your filters.</p>
          <p className="text-xs text-slate-400">Try adjusting your search terms or pricing filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <div
              key={tool.id}
              className="p-6 rounded-2xl border border-slateDark-800 bg-slateDark-950/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slateDark-800 border border-slateDark-700 overflow-hidden p-1">
                    <img src={tool.logo || ''} alt={tool.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{tool.rating}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 mt-1.5 leading-relaxed">{tool.description}</p>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="px-2.5 py-0.5 bg-slateDark-800 text-cyan-400 rounded-md font-semibold">
                    {tool.pricingType}
                  </span>
                  {tool.startingPrice && <span className="text-slate-400">From {tool.startingPrice}</span>}
                </div>

                {/* Features Highlights */}
                {tool.features && tool.features.length > 0 && (
                  <ul className="space-y-1.5 pt-2 border-t border-slateDark-850 text-xs text-slate-300">
                    {tool.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-4 border-t border-slateDark-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">{tool.category}</span>
                <a
                  href={tool.affiliateUrl || tool.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 transition-all"
                >
                  <span>Visit Tool</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
