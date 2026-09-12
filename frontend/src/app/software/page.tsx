import React from 'react';
import Link from 'next/link';
import { Cpu } from 'lucide-react';
import { api } from '@/lib/api';
import { Post } from '@/types';
import { AdSlot } from '@/components/AdSlot';

export const revalidate = 60;

export default async function SoftwarePage() {
  let posts: Post[] = [];
  try {
    const res = await api.getPosts({ type: 'SOFTWARE', limit: '20' });
    if (res?.success && Array.isArray(res.data)) posts = res.data;
  } catch (err) {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-slateDark-800 pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Category Desk</span>
        </div>
        <h1 className="text-4xl font-black text-white">Software & SaaS Intelligence</h1>
        <p className="text-slate-300 text-sm">Deep dives into modern cloud infrastructure, developer tools, and SaaS platforms.</p>
      </div>

      <AdSlot location="HEADER" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <article key={post.id} className="p-5 rounded-2xl border border-slateDark-800 bg-slateDark-950/60 hover:border-slateDark-700 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              {post.featuredImage && (
                <div className="aspect-[16/9] rounded-xl overflow-hidden border border-slateDark-800 relative">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                <Link href={`/post/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{post.excerpt}</p>
            </div>

            <div className="pt-3 border-t border-slateDark-850 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">{post.author?.name || 'Marcus Vance'}</span>
              <span>{post.readingTime} min read</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
