import React from 'react';
import Metadata from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Calendar, User, Tag, Share2, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { Post } from '@/types';
import { AdSlot } from '@/components/AdSlot';
import { AffiliateCard } from '@/components/AffiliateCard';
import { SponsoredBadge } from '@/components/SponsoredBadge';
import { TableOfContents } from '@/components/TableOfContents';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const res = await api.getPostBySlug(params.slug);
    if (res.success && res.data) {
      const post: Post = res.data;
      const title = post.seo?.title || `${post.title} | TechPulse AI`;
      const description = post.seo?.metaDescription || post.excerpt;

      return {
        title,
        description,
        alternates: {
          canonical: post.seo?.canonicalUrl || `https://techpulse.ai/post/${post.slug}`,
        },
        openGraph: {
          title,
          description,
          url: `https://techpulse.ai/post/${post.slug}`,
          siteName: 'TechPulse AI',
          images: [{ url: post.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe' }],
          type: 'article',
          publishedTime: post.publishedAt,
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [post.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'],
        },
      };
    }
  } catch {}

  return { title: 'Article | TechPulse AI' };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  let post: Post | null = null;
  let relatedPosts: Post[] = [];

  try {
    const [postRes, relatedRes] = await Promise.all([
      api.getPostBySlug(params.slug),
      api.getRelatedPosts(params.slug),
    ]);
    if (postRes?.success && postRes.data) post = postRes.data;
    if (relatedRes?.success && Array.isArray(relatedRes.data)) relatedPosts = relatedRes.data;
  } catch (err) {
    console.error('Article page fetch error:', err);
  }

  if (!post) {
    notFound();
  }

  // Schema.org Article JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'TechPulse Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TechPulse AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://techpulse.ai/logo.png',
      },
    },
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Link & Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-cyan-400 flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link href={`/${post.category?.slug || 'ai-news'}`} className="hover:text-cyan-400">
          {post.category?.name || 'Category'}
        </Link>
        <span>/</span>
        <span className="text-slate-500 truncate max-w-xs">{post.title}</span>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto space-y-6 text-center">
        {/* Sponsored Disclosure Header if applicable */}
        {post.isSponsored && <SponsoredBadge sponsor={post.sponsor} />}

        <div className="flex items-center justify-center space-x-3 text-xs">
          <span className="px-3 py-1 bg-brand-500/20 text-cyan-300 font-bold uppercase tracking-wider rounded-full border border-brand-500/30">
            {post.category?.name || 'Tech Tech'}
          </span>
          <span className="text-slate-500">•</span>
          <span className="px-2.5 py-0.5 bg-slateDark-800 text-slate-300 rounded-md font-mono">
            {post.type}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          {post.title}
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
          {post.excerpt}
        </p>

        {/* Metadata Strip */}
        <div className="pt-4 border-t border-slateDark-800 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">{post.author?.name || 'Alex Rivera'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'Recently'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>{post.readingTime} min read</span>
          </div>

          <div className="flex items-center space-x-1.5 text-cyan-400">
            <span>{post.viewCount || 1} views</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-slateDark-800 shadow-2xl aspect-[21/9] relative">
          <img
            src={post.featuredImage}
            alt={post.seo?.altText || post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Ad Slot Article Top */}
      <div className="max-w-4xl mx-auto">
        <AdSlot location="ARTICLE_TOP" />
      </div>

      {/* Main Content Layout with Sticky TOC Sidebar */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Article Body */}
        <div className="lg:col-span-8 space-y-8">
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Ad Slot Article Middle */}
          <AdSlot location="ARTICLE_MIDDLE" />

          {/* Reusable Affiliate Recommendation Card */}
          <AffiliateCard
            title="Cursor AI Code Editor - TechPulse Deal"
            description="Accelerate your engineering workflow with AI agentic edits, multi-model LLM switching, and codebase indexing."
            affiliateUrl="https://cursor.com/?ref=techpulse_aff"
            couponCode="TECHPULSE20"
            badgeText="Editor's Pick"
            postSlug={post.slug}
          />

          {/* Tags list */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-slateDark-800 flex items-center space-x-2">
              <Tag className="w-4 h-4 text-cyan-400" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map(t => (
                  <span key={t.id} className="px-3 py-1 bg-slateDark-800 text-slate-300 text-xs font-mono rounded-lg">
                    #{t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ad Slot Article Bottom */}
          <AdSlot location="ARTICLE_BOTTOM" />
        </div>

        {/* Sticky Table of Contents Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 space-y-8">
          <TableOfContents content={post.content} />
          <AdSlot location="SIDEBAR" />
        </aside>
      </div>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="max-w-5xl mx-auto pt-12 border-t border-slateDark-800 space-y-6">
          <h3 className="text-2xl font-bold text-white">Related Technical Coverage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map(rel => (
              <div key={rel.id} className="p-5 rounded-2xl border border-slateDark-800 bg-slateDark-950/60 hover:border-slateDark-700 transition-all space-y-2">
                <span className="text-xs font-mono text-cyan-400">{rel.category?.name}</span>
                <h4 className="text-base font-bold text-white hover:text-cyan-300 transition-colors line-clamp-2">
                  <Link href={`/post/${rel.slug}`}>{rel.title}</Link>
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">{rel.excerpt}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
