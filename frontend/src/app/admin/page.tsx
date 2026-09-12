'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Eye, MousePointerClick, Key, TrendingUp, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { AnalyticsSummary } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAnalytics()
      .then(res => {
        if (res.success && res.data) {
          setStats(res.data.summary);
          setTopPosts(res.data.topPosts || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Platform Overview & Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Real-time engagement, monetization performance, and agent key usage.</p>
      </div>

      {loading ? (
        <div className="text-slate-400 font-mono py-12 text-center">Loading analytics dashboard...</div>
      ) : (
        <>
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl border border-slateDark-800 bg-slateDark-900/90 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Total Posts</span>
                <FileText className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-3xl font-black text-white">{stats?.totalPosts || 0}</p>
              <p className="text-[11px] text-slate-500 font-mono">{stats?.publishedPosts || 0} Published</p>
            </div>

            <div className="p-5 rounded-2xl border border-slateDark-800 bg-slateDark-900/90 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Total Page Views</span>
                <Eye className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-white">{(stats?.totalViews || 0).toLocaleString()}</p>
              <p className="text-[11px] text-emerald-400 font-mono">+{stats?.viewsLast24h || 0} in last 24h</p>
            </div>

            <div className="p-5 rounded-2xl border border-slateDark-800 bg-slateDark-900/90 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Affiliate Clicks</span>
                <MousePointerClick className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-black text-white">{stats?.totalAffiliateClicks || 0}</p>
              <p className="text-[11px] text-amber-400 font-mono">+{stats?.affiliateClicksLast24h || 0} in last 24h</p>
            </div>

            <div className="p-5 rounded-2xl border border-slateDark-800 bg-slateDark-900/90 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Active Agent Keys</span>
                <Key className="w-4 h-4 text-brand-400" />
              </div>
              <p className="text-3xl font-black text-white">{stats?.activeAgentKeys || 0}</p>
              <p className="text-[11px] text-slate-500 font-mono">Autonomous backend API control</p>
            </div>
          </div>

          {/* Top Posts & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 p-6 rounded-2xl border border-slateDark-800 bg-slateDark-900/90 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2 pb-3 border-b border-slateDark-800">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>Top Performing Articles</span>
              </h3>

              <div className="space-y-3">
                {topPosts.map(post => (
                  <div key={post.id} className="flex items-center justify-between p-3 rounded-xl bg-slateDark-950/60 border border-slateDark-800">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                        <Link href={`/post/${post.slug}`} target="_blank">{post.title}</Link>
                      </h4>
                      <span className="text-[10px] font-mono text-cyan-400">{post.type}</span>
                    </div>
                    <div className="text-right font-mono text-xs text-slate-300 shrink-0 pl-4">
                      <span>{post.viewCount} views</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl border border-slateDark-800 bg-slateDark-900/90 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2 pb-3 border-b border-slateDark-800">
                <Sparkles className="w-5 h-5 text-brand-400" />
                <span>Quick Actions</span>
              </h3>

              <div className="space-y-2.5">
                <Link
                  href="/admin/posts"
                  className="block p-3 rounded-xl bg-brand-600/20 border border-brand-500/30 hover:bg-brand-600/30 text-slate-100 font-semibold text-xs transition-colors"
                >
                  + Create New Article & SEO
                </Link>

                <Link
                  href="/admin/agent-keys"
                  className="block p-3 rounded-xl bg-slateDark-800 border border-slateDark-700 hover:bg-slateDark-700 text-cyan-400 font-mono text-xs transition-colors"
                >
                  Generate AI Agent API Key
                </Link>

                <Link
                  href="/admin/monetization"
                  className="block p-3 rounded-xl bg-slateDark-800 border border-slateDark-700 hover:bg-slateDark-700 text-amber-400 font-mono text-xs transition-colors"
                >
                  Manage AdSlots & Affiliate Links
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
