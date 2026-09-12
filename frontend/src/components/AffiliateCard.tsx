'use client';

import React, { useState } from 'react';
import { ExternalLink, Tag, Check, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

interface AffiliateCardProps {
  id?: string;
  title: string;
  description: string;
  affiliateUrl: string;
  couponCode?: string;
  badgeText?: string;
  postSlug?: string;
}

export const AffiliateCard: React.FC<AffiliateCardProps> = ({
  id,
  title,
  description,
  affiliateUrl,
  couponCode,
  badgeText = 'Recommended AI Tool',
  postSlug,
}) => {
  const [copied, setCopied] = useState(false);

  const handleVisit = () => {
    if (id) {
      api.trackAffiliateClick(id, postSlug).catch(() => {});
    }
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const copyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slateDark-950 via-slateDark-900 to-cyan-950/20 p-6 shadow-xl relative overflow-hidden group">
      {/* Visual Accent Pill */}
      <div className="absolute top-0 right-0 bg-cyan-500/10 border-b border-l border-cyan-500/30 px-3 py-1 rounded-bl-xl text-[11px] font-semibold text-cyan-400 flex items-center space-x-1">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>{badgeText}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
              {title}
            </h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {couponCode && (
            <button
              onClick={copyCode}
              className="px-3 py-2 bg-slateDark-800 hover:bg-slateDark-700 border border-slateDark-700 rounded-xl text-xs font-mono text-cyan-300 flex items-center justify-center space-x-2 transition-all"
            >
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>{copied ? 'Copied!' : `Code: ${couponCode}`}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
            </button>
          )}

          <button
            onClick={handleVisit}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <span>Get Offer / Visit</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Affiliate Disclosure Statement */}
      <div className="mt-4 pt-3 border-t border-slateDark-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Affiliate Partner Disclosure: We may earn a commission on purchases made via this link.</span>
        <span className="text-cyan-400 font-mono text-[10px] uppercase">Verified Partner</span>
      </div>
    </div>
  );
};
