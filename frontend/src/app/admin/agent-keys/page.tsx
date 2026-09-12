'use client';

import React, { useState, useEffect } from 'react';
import { Key, Shield, Copy, Check, RefreshCw, AlertTriangle, Activity, Lock, Eye } from 'lucide-react';
import { api } from '@/lib/api';
import { AgentApiKeyData, AgentAuditLogData } from '@/types';

export default function AdminAgentKeysPage() {
  const [keys, setKeys] = useState<AgentApiKeyData[]>([]);
  const [auditLogs, setAuditLogs] = useState<AgentAuditLogData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'content:read',
    'content:write',
    'seo:write',
  ]);
  const [createdSecretKey, setCreatedSecretKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const availablePermissions = [
    { id: 'content:read', label: 'Read Posts & Taxonomy', desc: 'Allows agent to fetch published/draft articles.' },
    { id: 'content:write', label: 'Write/Publish Posts', desc: 'Allows agent to create, update, draft, or publish articles.' },
    { id: 'seo:write', label: 'Update SEO Metadata', desc: 'Allows agent to edit SEO titles, meta descriptions, and schemas.' },
    { id: 'media:write', label: 'Manage Media Assets', desc: 'Allows agent to upload or modify media file URLs.' },
    { id: 'affiliate:write', label: 'Manage Affiliate Links', desc: 'Allows agent to create/insert affiliate tracking links.' },
    { id: 'sponsored:write', label: 'Manage Sponsored Content', desc: 'Allows agent to set sponsor disclosures.' },
    { id: 'analytics:read', label: 'Read Analytics Data', desc: 'Allows agent to inspect page views & top posts.' },
    { id: 'settings:write', label: 'Update Site Settings', desc: 'Allows agent to modify site configuration.' },
  ];

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getAgentKeys(), api.getAgentAuditLogs()])
      .then(([keysRes, logsRes]) => {
        if (keysRes?.success && Array.isArray(keysRes.data)) setKeys(keysRes.data);
        if (logsRes?.success && Array.isArray(logsRes.data)) setAuditLogs(logsRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      const res = await api.createAgentKey({
        name: newKeyName.trim(),
        permissions: selectedPermissions,
      });

      if (res.success && res.data?.secretKey) {
        setCreatedSecretKey(res.data.secretKey);
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Key creation failed.');
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (confirm('Instantly revoke this Agent API Key? Future requests using this key will be forbidden.')) {
      await api.revokeAgentKey(id);
      loadData();
    }
  };

  const handleRotateKey = async (id: string) => {
    if (confirm('Rotate this API Key? The old key will be revoked immediately and a new secret key generated.')) {
      const res = await api.rotateAgentKey(id);
      if (res.success && res.data?.secretKey) {
        setCreatedSecretKey(res.data.secretKey);
        loadData();
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slateDark-800">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center space-x-2">
            <Key className="w-7 h-7 text-cyan-400" />
            <span>AI Agent API Key Console</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Provision secure Bearer API Keys (`/api/agent/v1/...`) with granular permission scopes and real-time audit logging.
          </p>
        </div>

        <button
          onClick={() => {
            setCreatedSecretKey(null);
            setNewKeyName('');
            setIsCreateModalOpen(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
        >
          <Key className="w-4 h-4" />
          <span>+ Generate New Agent API Key</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 font-mono text-slate-400">Loading Agent API Keys & Audit Logs...</div>
      ) : (
        <div className="space-y-8">
          {/* Active Keys List */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span>Active Agent API Keys ({keys.filter(k => k.isActive).length})</span>
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {keys.map(key => (
                <div
                  key={key.id}
                  className={`p-5 rounded-2xl border ${
                    key.isActive ? 'border-slateDark-800 bg-slateDark-900' : 'border-rose-900/40 bg-slateDark-950/60 opacity-60'
                  } space-y-4`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-white text-base">{key.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          key.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950 text-rose-400'
                        }`}>
                          {key.isActive ? 'ACTIVE' : 'REVOKED'}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-cyan-400">
                        Prefix: <span className="text-slate-200">{key.keyPrefix}••••••••••••••••</span>
                      </p>
                    </div>

                    {key.isActive && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRotateKey(key.id)}
                          className="px-3 py-1.5 bg-slateDark-800 hover:bg-slateDark-700 text-cyan-300 border border-slateDark-700 rounded-xl text-xs font-mono flex items-center space-x-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Rotate Key</span>
                        </button>
                        <button
                          onClick={() => handleRevokeKey(key.id)}
                          className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl text-xs font-mono"
                        >
                          Revoke
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Scopes */}
                  <div className="space-y-1.5 pt-2 border-t border-slateDark-850">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Authorized Permission Scopes:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {key.permissions.map(perm => (
                        <span key={perm} className="px-2.5 py-0.5 bg-slateDark-950 text-slate-300 font-mono text-[11px] rounded-md border border-slateDark-800">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-1">
                    <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                    <span>Last Used: {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : 'Never'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="space-y-4 pt-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <span>AI Agent Audit Logs (Latest 50 Operations)</span>
            </h2>

            <div className="rounded-2xl border border-slateDark-800 bg-slateDark-900 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slateDark-950 text-slate-400 border-b border-slateDark-800">
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Agent Key</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slateDark-800">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slateDark-850/50">
                        <td className="p-4 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="p-4 font-bold text-cyan-300">{log.apiKey?.name || 'Agent'}</td>
                        <td className="p-4 text-slate-200">{log.action}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950 text-rose-400'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">{log.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Creation / Secret Display Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slateDark-900 border border-slateDark-800 rounded-3xl p-6 shadow-2xl space-y-6">
            {!createdSecretKey ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slateDark-800">
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Key className="w-5 h-5 text-cyan-400" />
                    <span>Create Agent API Key</span>
                  </h2>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateKey} className="space-y-5 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Agent Name / Identifer</label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={e => setNewKeyName(e.target.value)}
                      placeholder="e.g. Primary Content Generation Bot"
                      required
                      className="w-full px-3 py-2.5 bg-slateDark-950 border border-slateDark-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-slate-300">Select Permitted Scopes</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {availablePermissions.map(perm => (
                        <label
                          key={perm.id}
                          onClick={() => togglePermission(perm.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                            selectedPermissions.includes(perm.id)
                              ? 'bg-cyan-950/30 border-cyan-500/50 text-white'
                              : 'bg-slateDark-950 border-slateDark-800 text-slate-400 hover:border-slateDark-700'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-xs">
                            <span>{perm.label}</span>
                            {selectedPermissions.includes(perm.id) && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">{perm.desc}</p>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-3 border-t border-slateDark-800">
                    <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-slate-400">
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20">
                      Generate Secret Key
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* ONE-TIME SECRET DISPLAY BOX */
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs space-y-1">
                  <div className="flex items-center space-x-2 font-bold text-amber-400 text-sm">
                    <AlertTriangle className="w-5 h-5" />
                    <span>SAVE YOUR SECRET API KEY NOW!</span>
                  </div>
                  <p>This secret key will NEVER be shown again. If you lose it, you will need to rotate the key.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 font-mono">Secret Bearer API Key:</label>
                  <div className="p-3 bg-slateDark-950 border border-cyan-500/50 rounded-xl flex items-center justify-between font-mono text-sm text-cyan-300 select-all break-all">
                    <span>{createdSecretKey}</span>
                    <button
                      onClick={() => copyToClipboard(createdSecretKey)}
                      className="ml-3 px-3 py-1.5 bg-cyan-500 text-slate-950 rounded-lg font-bold text-xs flex items-center space-x-1 shrink-0"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied' : 'Copy Key'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-400 font-mono bg-slateDark-950 p-4 rounded-xl border border-slateDark-800">
                  <p className="font-bold text-white">How to use in your AI Agent:</p>
                  <pre className="text-[11px] text-cyan-300 bg-slateDark-900 p-2 rounded-lg overflow-x-auto">
                    Authorization: Bearer {createdSecretKey}
                  </pre>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setCreatedSecretKey(null);
                      setIsCreateModalOpen(false);
                    }}
                    className="px-6 py-2.5 bg-slateDark-800 hover:bg-slateDark-700 text-white font-bold text-xs rounded-xl"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
