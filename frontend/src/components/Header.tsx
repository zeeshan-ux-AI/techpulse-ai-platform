'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Zap, Menu, X, ShieldCheck, Flame, Cpu, Wrench } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const navLinks = [
    { name: 'AI News', href: '/ai-news', icon: Flame },
    { name: 'AI Tools', href: '/ai-tools', icon: Wrench },
    { name: 'Software', href: '/software', icon: Cpu },
    { name: 'Reviews', href: '/reviews', icon: ShieldCheck },
    { name: 'Comparisons', href: '/comparisons', icon: Zap },
    { name: 'Tutorials', href: '/tutorials', icon: Zap },
    { name: 'Deals', href: '/deals', icon: Zap },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slateDark-800 bg-slateDark-900/90 backdrop-blur-md">
        {/* Top Mini Strip */}
        <div className="bg-slateDark-950 border-b border-slateDark-800/60 py-1.5 px-4 text-[11px] font-medium text-slate-400">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1 text-cyan-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>LIVE UPDATES:</span>
              </span>
              <span className="hidden sm:inline text-slate-300 truncate max-w-md">
                Claude 3.7 Hybrid Reasoning & Cursor Editor Breakthroughs
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/rss.xml" className="hover:text-cyan-400 transition-colors font-mono">
                RSS Feed
              </Link>
              <Link href="/admin" className="hover:text-cyan-400 transition-colors font-mono text-cyan-400">
                Admin CMS
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center">
                TechPulse<span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[9px] font-mono text-slate-400 tracking-wider uppercase">
                AI & Software Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-500/15 text-cyan-300 font-semibold border border-brand-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slateDark-800'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Trigger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 rounded-xl bg-slateDark-800 hover:bg-slateDark-700 text-slate-300 hover:text-white transition-colors border border-slateDark-700"
              aria-label="Search articles and AI tools"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slateDark-800 text-slate-300 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slateDark-800 bg-slateDark-900 px-4 py-4 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-200 hover:bg-slateDark-800"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-2xl bg-slateDark-900 border border-slateDark-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slateDark-800">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Search className="w-5 h-5 text-cyan-400" />
                <span>Search TechPulse AI</span>
              </h3>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search breaking news, Cursor, Claude 3.7, tools, reviews..."
                className="w-full px-4 py-3 rounded-xl bg-slateDark-950 border border-slateDark-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans text-base"
                autoFocus
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20"
                >
                  Search Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
