'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Mail, Github, Twitter, Rss } from 'lucide-react';
import { AdSlot } from './AdSlot';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slateDark-800 bg-slateDark-950 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Footer Ad Slot */}
        <AdSlot location="FOOTER" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center">
                <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
              </div>
              <span className="text-xl font-black text-white">
                TechPulse<span className="text-cyan-400">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              The definitive AI and software technology media publication. Breaking news, in-depth reviews, developer comparisons, and SaaS benchmarks.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://x.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slateDark-900 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slateDark-900 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="/rss.xml" target="_blank" className="p-2 rounded-lg bg-slateDark-900 hover:text-white transition-colors text-amber-400">
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Categories</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/ai-news" className="hover:text-cyan-300 transition-colors">AI News</Link></li>
              <li><Link href="/ai-tools" className="hover:text-cyan-300 transition-colors">AI Tools Directory</Link></li>
              <li><Link href="/software" className="hover:text-cyan-300 transition-colors">Software & SaaS</Link></li>
              <li><Link href="/reviews" className="hover:text-cyan-300 transition-colors">Product Reviews</Link></li>
              <li><Link href="/comparisons" className="hover:text-cyan-300 transition-colors">Side-by-Side Comparisons</Link></li>
              <li><Link href="/tutorials" className="hover:text-cyan-300 transition-colors">Developer Tutorials</Link></li>
              <li><Link href="/deals" className="hover:text-cyan-300 transition-colors">Tech Deals</Link></li>
            </ul>
          </div>

          {/* Legal & Meta Pages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Legal & Meta</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/about" className="hover:text-cyan-300 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-300 transition-colors">Contact Editorial</Link></li>
              <li><Link href="/affiliate-disclosure" className="hover:text-cyan-300 transition-colors">Affiliate Disclosure</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-cyan-300 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/sitemap.xml" className="hover:text-cyan-300 transition-colors font-mono">Dynamic Sitemap.xml</Link></li>
              <li><Link href="/admin/login" className="hover:text-cyan-300 transition-colors font-mono text-cyan-400">Admin CMS Login</Link></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">TechPulse Dispatch</h4>
            <p className="text-xs text-slate-400">
              Get our weekly breakdown of frontier AI releases, code IDE benchmarks, and SaaS deals directly to your inbox.
            </p>
            <form onSubmit={e => { e.preventDefault(); alert('Subscribed to TechPulse Dispatch!'); }} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slateDark-900 border border-slateDark-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md"
              >
                <Mail className="w-3 h-3" />
                <span>Subscribe Free</span>
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slateDark-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TechPulse AI Media. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">Designed for High-Performance AI Engineering</p>
        </div>
      </div>
    </footer>
  );
};
