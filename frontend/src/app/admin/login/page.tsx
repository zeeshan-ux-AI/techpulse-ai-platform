'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Lock, Mail, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@techpulse.ai');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.loginAdmin({ email, password });
      if (res.success && res.data?.token) {
        localStorage.setItem('techpulse_admin_token', res.data.token);
        localStorage.setItem('techpulse_admin_user', JSON.stringify(res.data.user));
        router.push('/admin');
      } else {
        setError(res.error || 'Login failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-3xl border border-slateDark-800 bg-slateDark-950/90 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 mx-auto flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Zap className="w-6 h-6 text-slate-950 fill-slate-950" />
          </div>
          <h1 className="text-2xl font-black text-white">TechPulse Admin CMS</h1>
          <p className="text-xs text-slate-400">Sign in to manage posts, tools, monetization, and AI Agent keys.</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-slateDark-900 border border-slateDark-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-slateDark-900 border border-slateDark-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to CMS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-slateDark-900 rounded-xl text-[11px] text-slate-400 text-center font-mono space-y-1 border border-slateDark-800">
          <p className="text-slate-300 font-semibold">Seed Admin Credentials:</p>
          <p>Email: <span className="text-cyan-400">admin@techpulse.ai</span></p>
          <p>Password: <span className="text-cyan-400">admin123</span></p>
        </div>
      </div>
    </div>
  );
}
