'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AdSlotData } from '@/types';

interface AdSlotProps {
  location: 'HEADER' | 'HOMEPAGE' | 'ARTICLE_TOP' | 'ARTICLE_MIDDLE' | 'ARTICLE_BOTTOM' | 'SIDEBAR' | 'FOOTER';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ location, className = '' }) => {
  const [adSlot, setAdSlot] = useState<AdSlotData | null>(null);

  useEffect(() => {
    let isMounted = true;
    api
      .getAdSlots()
      .then(res => {
        if (isMounted && res.success && Array.isArray(res.data)) {
          const found = res.data.find((slot: AdSlotData) => slot.slotKey === location);
          if (found) setAdSlot(found);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [location]);

  if (adSlot && !adSlot.isEnabled) {
    return null;
  }

  return (
    <div className={`my-4 overflow-hidden rounded-xl border border-slateDark-800 bg-slateDark-950/60 p-3 ${className}`}>
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
        <span>Advertisement</span>
        <span className="text-slate-600">{location.replace('_', ' ')}</span>
      </div>
      {adSlot?.codeSnippet ? (
        <div
          dangerouslySetInnerHTML={{ __html: adSlot.codeSnippet }}
          className="text-center text-xs text-slate-400 font-mono py-2"
        />
      ) : (
        <div className="py-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
          <p className="font-semibold text-slate-400">TechPulse AI Ad Space</p>
          <p className="text-[11px] text-slate-500">Target 50,000+ AI engineers & decision makers.</p>
        </div>
      )}
    </div>
  );
};
