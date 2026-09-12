import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, ArrowRight, Star, ExternalLink, Sparkles, CheckCircle, Wrench, Scale, BookOpen, Clock, User } from 'lucide-react';
import { api } from '@/lib/api';
import { Post, AiTool } from '@/types';
import { AdSlot } from '@/components/AdSlot';
import { SponsoredBadge } from '@/components/SponsoredBadge';

export const revalidate = 60;

export default async function HomePage() {
  let posts: Post[] = [];
  let tools: AiTool[] = [];

  try {
    const [postsRes, toolsRes] = await Promise.all([
      api.getPosts({ limit: '12' }),
      api.getTools({ limit: '6', featured: 'true' }),
    ]);
    if (postsRes?.success && Array.isArray(postsRes.data)) posts = postsRes.data;
    if (toolsRes?.success && Array.isArray(toolsRes.data)) tools = toolsRes.data;
  } catch (err) {
    console.error('Homepage fetch fallback:', err);
  }

  const featuredPost = posts.find(p => p.isFeatured) || posts[0];
  const latestPosts = posts.filter(p => p.id !== featuredPost?.id).slice(0, 5);
  const trendingPosts = posts.filter(p => p.isTrending).slice(0, 4);
  const reviews = posts.filter(p => p.type === 'REVIEW').slice(0, 3);
  const comparisons = posts.filter(p => p.type === 'COMPARISON').slice(0, 3);
  const tutorials = posts.filter(p => p.type === 'TUTORIAL').slice(0, 3);
  const sponsoredPost = posts.find(p => p.isSponsored);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Top Header Ad Slot */}
      <AdSlot location="HEADER" />

      {/* Hero Section */}
      {featuredPost && (
        <section className="relative rounded-3xl border border-slateDark-800 bg-gradient-to-b from-slateDark-850 via-slateDark-900 to-slateDark-950 overflow-hidden shadow-2xl p-6 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-bold uppercase tracking-wider rounded-full flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  <span>Featured Breaking Story</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString() : 'Just Now'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15] hover:text-cyan-300 transition-colors">
                <Link href={`/post/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center space-x-4 text-xs text-slate-400 pt-2 border-t border-slateDark-800/80">
                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold text-slate-200">{featuredPost.author?.name || 'Alex Rivera'}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{featuredPost.readingTime} min read</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/post/${featuredPost.slug}`}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Read Full Coverage</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-square rounded-2xl overflow-hidden border border-slateDark-700 shadow-xl group">
              {featuredPost.featuredImage && (
                <img
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slateDark-950/80 via-transparent to-transparent"></div>
            </div>
          </div>
        </section>
      )}

      {/* Main Grid: Latest News & Trending Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Latest News Feed */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-slateDark-800">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
              <span>Latest AI & Software Stories</span>
            </h2>
            <Link href="/ai-news" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-6">
            {latestPosts.map(post => (
              <article
                key={post.id}
                className="group p-5 rounded-2xl border border-slateDark-800 bg-slateDark-950/40 hover:border-slateDark-700 transition-all flex flex-col sm:flex-row gap-5"
              >
                {post.featuredImage && (
                  <div className="sm:w-48 h-32 rounded-xl overflow-hidden shrink-0 border border-slateDark-800 relative">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-slateDark-800 text-cyan-400 font-medium">
                      {post.category?.name || 'AI News'}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {post.readingTime} min read
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    <Link href={`/post/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Homepage Feed Ad Slot */}
          <AdSlot location="HOMEPAGE" />
        </div>

        {/* Sidebar: Trending Posts & Ad */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="p-6 rounded-2xl border border-slateDark-800 bg-slateDark-950/60 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2 pb-3 border-b border-slateDark-800">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Trending Insights</span>
            </h3>

            <div className="space-y-4">
              {trendingPosts.map((post, idx) => (
                <div key={post.id} className="flex items-start space-x-3 group">
                  <span className="text-2xl font-black text-slateDark-700 group-hover:text-cyan-400 font-mono transition-colors">
                    0{idx + 1}
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors leading-snug">
                      <Link href={`/post/${post.slug}`}>{post.title}</Link>
                    </h4>
                    <p className="text-[11px] text-slate-400">{post.viewCount} views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Ad Slot */}
          <AdSlot location="SIDEBAR" />
        </aside>
      </div>

      {/* AI Tools Grid Showcase */}
      <section className="space-y-8 pt-8">
        <div className="flex items-center justify-between pb-4 border-b border-slateDark-800">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Wrench className="w-6 h-6 text-cyan-400" />
              <span>Featured AI Tools & Software</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Curated ratings, pricing tiers, and direct affiliate access.</p>
          </div>
          <Link href="/ai-tools" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1">
            <span>Browse Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <div
              key={tool.id}
              className="p-6 rounded-2xl border border-slateDark-800 bg-slateDark-950/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slateDark-800 overflow-hidden p-1 border border-slateDark-700">
                    <img src={tool.logo || ''} alt={tool.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{tool.rating}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{tool.description}</p>
                </div>

                <div className="flex items-center space-x-2 text-[11px] font-mono">
                  <span className="px-2 py-0.5 bg-slateDark-800 text-cyan-400 rounded-md">
                    {tool.pricingType}
                  </span>
                  {tool.startingPrice && (
                    <span className="text-slate-400">Starts at {tool.startingPrice}</span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slateDark-850 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">{tool.category}</span>
                <a
                  href={tool.affiliateUrl || tool.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-slateDark-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-semibold rounded-lg flex items-center space-x-1 transition-all"
                >
                  <span>Visit Tool</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparisons & Reviews Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
        {/* Code Editor Comparisons */}
        <div className="p-6 rounded-2xl border border-slateDark-800 bg-slateDark-950/60 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slateDark-800">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Scale className="w-5 h-5 text-brand-400" />
              <span>SaaS & IDE Comparisons</span>
            </h3>
            <Link href="/comparisons" className="text-xs text-brand-400 font-semibold">View All</Link>
          </div>

          <div className="space-y-4">
            {comparisons.map(item => (
              <div key={item.id} className="p-4 rounded-xl border border-slateDark-800 hover:border-slateDark-700 bg-slateDark-900/50 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-400">Comparison</span>
                <h4 className="text-base font-bold text-white hover:text-cyan-300 transition-colors">
                  <Link href={`/post/${item.slug}`}>{item.title}</Link>
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">{item.excerpt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product Reviews */}
        <div className="p-6 rounded-2xl border border-slateDark-800 bg-slateDark-950/60 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slateDark-800">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Product Reviews</span>
            </h3>
            <Link href="/reviews" className="text-xs text-emerald-400 font-semibold">View All</Link>
          </div>

          <div className="space-y-4">
            {reviews.map(item => (
              <div key={item.id} className="p-4 rounded-xl border border-slateDark-800 hover:border-slateDark-700 bg-slateDark-900/50 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Review</span>
                <h4 className="text-base font-bold text-white hover:text-cyan-300 transition-colors">
                  <Link href={`/post/${item.slug}`}>{item.title}</Link>
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">{item.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsored Post Highlight */}
      {sponsoredPost && (
        <section className="rounded-2xl border border-amber-500/40 bg-amber-950/10 p-6 space-y-4">
          <SponsoredBadge sponsor={sponsoredPost.sponsor} />
          <h3 className="text-2xl font-bold text-white hover:text-amber-300 transition-colors">
            <Link href={`/post/${sponsoredPost.slug}`}>{sponsoredPost.title}</Link>
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">{sponsoredPost.excerpt}</p>
        </section>
      )}
    </div>
  );
}
