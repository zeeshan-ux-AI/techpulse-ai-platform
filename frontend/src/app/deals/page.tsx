import React from 'react';
import { Tag } from 'lucide-react';
import { api } from '@/lib/api';
import { AffiliateLink } from '@/types';
import { AffiliateCard } from '@/components/AffiliateCard';
import { AdSlot } from '@/components/AdSlot';

export const revalidate = 60;

export default async function DealsPage() {
  let affiliates: AffiliateLink[] = [];
  try {
    const res = await api.getAffiliates();
    if (res?.success && Array.isArray(res.data)) affiliates = res.data;
  } catch (err) {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-slateDark-800 pb-6 space-y-2 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-full">
          <Tag className="w-3.5 h-3.5" />
          <span>Exclusive Offers</span>
        </div>
        <h1 className="text-4xl font-black text-white">Verified Tech & AI Deals</h1>
        <p className="text-slate-300 text-sm">
          Save on developer tools, cloud infrastructure, AI models, and software subscriptions.
        </p>
      </div>

      <AdSlot location="HEADER" />

      <div className="max-w-4xl mx-auto space-y-6">
        <AffiliateCard
          id="cursor-deal"
          title="Cursor AI Code Editor - Pro Discount"
          description="Instant codebase vector indexing, agentic multi-file composer edits, and high-frequency model access."
          affiliateUrl="https://cursor.com/?ref=techpulse_aff"
          couponCode="TECHPULSE20"
          badgeText="20% Off Pro"
        />

        <AffiliateCard
          id="neon-deal"
          title="Neon Serverless Postgres - $50 Free Credits"
          description="Branch your PostgreSQL database in seconds. Scale to zero compute with instant serverless pooling for Node.js AI apps."
          affiliateUrl="https://neon.tech/?ref=techpulse_aff"
          couponCode="NEONPULSE"
          badgeText="$50 Credit"
        />
      </div>
    </div>
  );
}
