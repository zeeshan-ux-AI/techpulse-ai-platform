'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Tag, Award, Code, Check, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { AffiliateLink, Sponsor, AdSlotData } from '@/types';

export default function AdminMonetizationPage() {
  const [activeTab, setActiveTab] = useState<'adslots' | 'affiliates' | 'sponsors'>('adslots');
  const [adSlots, setAdSlots] = useState<AdSlotData[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateLink[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  // New affiliate form
  const [newAff, setNewAff] = useState({ title: '', originalUrl: '', affiliateUrl: '', code: '', category: 'Developer Tools' });
  // New sponsor form
  const [newSponsor, setNewSponsor] = useState({ name: '', websiteUrl: '', logo: '', disclosureText: '' });

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getAdSlots(), api.getAffiliates(), api.getSponsors()])
      .then(([slotsRes, affRes, sponsorRes]) => {
        if (slotsRes?.success && Array.isArray(slotsRes.data)) setAdSlots(slotsRes.data);
        if (affRes?.success && Array.isArray(affRes.data)) setAffiliates(affRes.data);
        if (sponsorRes?.success && Array.isArray(sponsorRes.data)) setSponsors(sponsorRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAdSlot = async (slotKey: string, isEnabled: boolean) => {
    await api.updateAdSlot(slotKey, { isEnabled: !isEnabled });
    loadData();
  };

  const handleUpdateAdSnippet = async (slotKey: string, codeSnippet: string) => {
    await api.updateAdSlot(slotKey, { codeSnippet });
    alert(`AdSlot '${slotKey}' code updated!`);
    loadData();
  };

  const handleCreateAff = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createAffiliate(newAff);
    setNewAff({ title: '', originalUrl: '', affiliateUrl: '', code: '', category: 'Developer Tools' });
    loadData();
  };

  const handleCreateSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createSponsor(newSponsor);
    setNewSponsor({ name: '', websiteUrl: '', logo: '', disclosureText: '' });
    loadData();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Monetization Control Center</h1>
        <p className="text-xs text-slate-400 mt-1">Manage Google AdSense slots, affiliate link tracking, and sponsor declarations.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slateDark-800 space-x-4 font-semibold text-xs">
        <button
          onClick={() => setActiveTab('adslots')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'adslots' ? 'border-cyan-400 text-cyan-300 font-bold' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Google AdSlots Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('affiliates')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'affiliates' ? 'border-cyan-400 text-cyan-300 font-bold' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Affiliate Link Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('sponsors')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'sponsors' ? 'border-cyan-400 text-cyan-300 font-bold' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Sponsored Partners</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 font-mono text-slate-400">Loading monetization settings...</div>
      ) : (
        <>
          {/* TAB 1: AD SLOTS */}
          {activeTab === 'adslots' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl border border-slateDark-800 bg-slateDark-900/60 text-xs text-slate-300">
                <p className="font-bold text-white mb-1">Modular AdSlot Architecture</p>
                <p>Configure script code snippets or HTML banners for each predefined website slot. Disabling a slot removes it instantly from the frontend without layout shift.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {adSlots.map(slot => (
                  <div key={slot.id} className="p-5 rounded-2xl border border-slateDark-800 bg-slateDark-900 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{slot.slotKey}</span>
                        <h3 className="font-bold text-white text-base">{slot.name}</h3>
                      </div>

                      <button
                        onClick={() => handleToggleAdSlot(slot.slotKey, slot.isEnabled)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                          slot.isEnabled
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {slot.isEnabled ? 'ENABLED' : 'DISABLED'}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-mono">Google AdSense / Custom HTML Snippet</label>
                      <textarea
                        defaultValue={slot.codeSnippet || ''}
                        id={`ad-input-${slot.slotKey}`}
                        rows={3}
                        className="w-full p-3 bg-slateDark-950 border border-slateDark-700 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            const val = (document.getElementById(`ad-input-${slot.slotKey}`) as HTMLTextAreaElement)?.value;
                            handleUpdateAdSnippet(slot.slotKey, val);
                          }}
                          className="px-4 py-1.5 bg-slateDark-800 hover:bg-slateDark-700 text-cyan-400 border border-slateDark-700 rounded-lg text-xs font-mono flex items-center space-x-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Snippet</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AFFILIATES */}
          {activeTab === 'affiliates' && (
            <div className="space-y-6">
              {/* Create affiliate link form */}
              <form onSubmit={handleCreateAff} className="p-5 rounded-2xl border border-slateDark-800 bg-slateDark-900 space-y-4">
                <h3 className="font-bold text-white text-sm">Create Reusable Affiliate Link</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <input
                    type="text"
                    placeholder="Link Title (e.g. Cursor Pro Deal)"
                    value={newAff.title}
                    onChange={e => setNewAff({ ...newAff, title: e.target.value })}
                    required
                    className="p-2.5 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white"
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g. Developer Tools)"
                    value={newAff.category}
                    onChange={e => setNewAff({ ...newAff, category: e.target.value })}
                    className="p-2.5 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white"
                  />
                  <input
                    type="text"
                    placeholder="Original Target URL"
                    value={newAff.originalUrl}
                    onChange={e => setNewAff({ ...newAff, originalUrl: e.target.value })}
                    required
                    className="p-2.5 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Affiliate Destination URL (with tracking parameters)"
                    value={newAff.affiliateUrl}
                    onChange={e => setNewAff({ ...newAff, affiliateUrl: e.target.value })}
                    required
                    className="p-2.5 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow">
                    Create Affiliate Link
                  </button>
                </div>
              </form>

              {/* Table of affiliate links */}
              <div className="rounded-2xl border border-slateDark-800 bg-slateDark-900 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slateDark-950 font-mono text-slate-400 border-b border-slateDark-800">
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Affiliate URL</th>
                      <th className="p-4 text-right">Total Clicks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slateDark-800">
                    {affiliates.map(aff => (
                      <tr key={aff.id}>
                        <td className="p-4 font-semibold text-white">{aff.title}</td>
                        <td className="p-4 text-slate-400 font-mono">{aff.category}</td>
                        <td className="p-4 text-cyan-400 font-mono truncate max-w-xs">{aff.affiliateUrl}</td>
                        <td className="p-4 text-right font-mono font-bold text-amber-400">{aff.totalClicks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SPONSORS */}
          {activeTab === 'sponsors' && (
            <div className="space-y-6">
              <form onSubmit={handleCreateSponsor} className="p-5 rounded-2xl border border-slateDark-800 bg-slateDark-900 space-y-4">
                <h3 className="font-bold text-white text-sm">Add Verified Sponsor Partner</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <input
                    type="text"
                    placeholder="Sponsor Name (e.g. Neon Postgres)"
                    value={newSponsor.name}
                    onChange={e => setNewSponsor({ ...newSponsor, name: e.target.value })}
                    required
                    className="p-2.5 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white"
                  />
                  <input
                    type="text"
                    placeholder="Website URL"
                    value={newSponsor.websiteUrl}
                    onChange={e => setNewSponsor({ ...newSponsor, websiteUrl: e.target.value })}
                    required
                    className="p-2.5 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Custom Disclosure Statement"
                    value={newSponsor.disclosureText}
                    onChange={e => setNewSponsor({ ...newSponsor, disclosureText: e.target.value })}
                    className="p-2.5 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white md:col-span-2"
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow">
                    Save Sponsor Partner
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sponsors.map(sp => (
                  <div key={sp.id} className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/10 space-y-2">
                    <h4 className="font-bold text-white text-base">{sp.name}</h4>
                    <p className="text-xs text-amber-300 font-mono">{sp.websiteUrl}</p>
                    <p className="text-xs text-slate-400 italic">{sp.disclosureText}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
