'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { Post, AiTool } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tools, setTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      performSearch(queryParam);
    }
  }, [queryParam]);

  const performSearch = (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    Promise.all([
      api.getPosts({ search: q, limit: '10' }),
      api.getTools({ search: q, limit: '10' }),
    ])
      .then(([postsRes, toolsRes]) => {
        if (postsRes?.success && Array.isArray(postsRes.data)) setPosts(postsRes.data);
        if (toolsRes?.success && Array.isArray(toolsRes.data)) setTools(toolsRes.data);
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-black text-white flex items-center space-x-2">
          <Search className="w-6 h-6 text-cyan-400" />
          <span>Global Search Results</span>
        </h1>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search articles, tools, comparisons..."
            className="flex-grow px-4 py-3 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-md"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-mono">Searching database...</div>
      ) : (
        <div className="space-y-10">
          {/* Matching AI Tools */}
          {tools.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2 border-b border-slateDark-800 pb-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Matching AI Tools ({tools.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tools.map(tool => (
                  <div key={tool.id} className="p-4 rounded-xl border border-slateDark-800 bg-slateDark-950/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white">{tool.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slateDark-800 text-cyan-400 rounded">
                        {tool.pricingType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{tool.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matching Posts */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white border-b border-slateDark-800 pb-2">
              Matching Articles & Guides ({posts.length})
            </h2>
            {posts.length === 0 ? (
              <p className="text-sm text-slate-500">No articles found matching "{query}".</p>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="p-5 rounded-2xl border border-slateDark-800 bg-slateDark-950/40 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
                      <span>{post.type}</span>
                      <span>•</span>
                      <span>{post.category?.name}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white hover:text-cyan-300 transition-colors">
                      <Link href={`/post/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{post.excerpt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-mono text-slate-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
