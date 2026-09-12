'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Wrench, DollarSign, Key, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (pathname.includes('/admin/login')) return;
    const storedUser = localStorage.getItem('techpulse_admin_user');
    const token = localStorage.getItem('techpulse_admin_token');
    if (!token || !storedUser) {
      router.push('/admin/login');
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }
  }, [pathname, router]);

  if (pathname.includes('/admin/login')) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem('techpulse_admin_token');
    localStorage.removeItem('techpulse_admin_user');
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Posts & SEO', href: '/admin/posts', icon: FileText },
    { name: 'AI Tools', href: '/admin/tools', icon: Wrench },
    { name: 'Monetization Hub', href: '/admin/monetization', icon: DollarSign },
    { name: 'AI Agent API Keys', href: '/admin/agent-keys', icon: Key },
  ];

  return (
    <div className="min-h-screen bg-slateDark-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-slateDark-800 bg-slateDark-900/90 p-5 shrink-0 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slateDark-800 pb-4">
            <Link href="/admin" className="flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <span className="font-black text-lg text-white">Admin CMS</span>
            </Link>
            <Link href="/" target="_blank" className="p-1.5 rounded-lg text-slate-400 hover:text-white" title="View Portal">
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'text-slate-300 hover:bg-slateDark-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="pt-4 border-t border-slateDark-800 flex items-center justify-between">
          <div className="text-xs">
            <p className="font-bold text-white truncate max-w-[120px]">{user?.name || 'Admin User'}</p>
            <p className="text-slate-500 font-mono text-[10px]">Super Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-slateDark-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main CMS View Content */}
      <div className="flex-grow p-6 md:p-10 max-w-7xl">
        {children}
      </div>
    </div>
  );
}
