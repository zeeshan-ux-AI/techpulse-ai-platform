'use client';

import React from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { Sponsor } from '@/types';

interface SponsoredBadgeProps {
  sponsor?: Sponsor;
}

export const SponsoredBadge: React.FC<SponsoredBadgeProps> = ({ sponsor }) => {
  if (!sponsor) return null;

  return (
    <div className="my-6 p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
      <div className="flex items-center space-x-3">
        <div className="px-2.5 py-1 bg-amber-500 text-slate-950 font-extrabold text-[11px] tracking-wider rounded-md uppercase flex items-center space-x-1">
          <Award className="w-3.5 h-3.5" />
          <span>SPONSORED</span>
        </div>
        <span className="text-sm font-medium text-amber-100">
          This article is sponsored by <strong className="text-white">{sponsor.name}</strong>.
        </span>
      </div>

      {sponsor.websiteUrl && (
        <a
          href={sponsor.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1 underline underline-offset-4"
        >
          <span>Visit {sponsor.name}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
};
