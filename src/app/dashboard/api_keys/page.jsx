"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import DashboardNavbar from "@/components/organisms/DashboardNavbar";
import {
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Trash2,
} from "lucide-react";

const HISTORY_DATA = [
  { id: "sk-synth-a1b2...x9z0", created: "Feb 20, 2026", lastUsed: "2 hours ago", status: "active" },
  { id: "sk-synth-c3d4...w7y8", created: "Jan 10, 2026", lastUsed: "Feb 19, 2026", status: "revoked" },
  { id: "sk-synth-e5f6...u5v6", created: "Dec 01, 2025", lastUsed: "Jan 09, 2026", status: "revoked" },
];

export default function ApiKeysPage() {
  const [showKey, setShowKey] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const fullKey = "sk-synth-1a2b-3c4d-5e6f-7g8h9i0j1k2l";
  const maskedKey = "sk-synth-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

  const handleCopy = () => {
    navigator.clipboard.writeText(fullKey);
  };

  return (
    <div className="flex min-h-screen bg-bg-1 text-text-1 font-sans selection:bg-primary-1/30">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <DashboardNavbar onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />

        <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full scroll-smooth">
          {/* Header */}
          <header className="mb-8">
          <h1 className="text-[26px] font-bold mb-1.5">API Keys</h1>
          <p className="text-text-3 text-[13px]">Manage your API keys for authentication.</p>
        </header>

        {/* Active API Key Panel */}
        <div className="bg-bg-2 border border-bg-3 rounded-2xl p-7 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[17px] font-bold">Active API Key</h3>
            <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 leading-none capitalize tracking-wide">
              Active
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
            <div className="flex-1 w-full px-5 py-[14px] bg-bg-1 border border-bg-3 rounded-xl flex items-center">
              <span className="text-text-1 font-mono text-[14px] font-medium tracking-wider">
                {showKey ? fullKey : maskedKey}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowKey(!showKey)}
                className="w-[50px] h-[50px] rounded-xl bg-bg-1 border border-bg-3 text-primary-3 hover:bg-bg-3 transition-all flex items-center justify-center shrink-0"
                title={showKey ? "Hide Key" : "Show Key"}
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button
                onClick={handleCopy}
                className="flex-[1] md:flex-none h-[50px] px-6 rounded-xl bg-bg-1 border border-bg-3 text-text-1 text-[13px] font-medium hover:bg-bg-3 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Copy size={16} className="text-primary-3" /> Copy
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-primary-1 hover:bg-primary-2 text-white text-[13px] font-medium rounded-lg flex items-center gap-2 transition-colors">
              <RefreshCw size={15} /> Regenerate Key
            </button>
            <button className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium rounded-lg flex items-center gap-2 transition-colors">
              <Trash2 size={15} /> Revoke
            </button>
          </div>
        </div>

        {/* Key History Table */}
        <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden">
          <div className="px-7 py-6 border-b border-bg-3">
            <h3 className="text-[17px] font-bold">Key History</h3>
          </div>

          <div className="grid grid-cols-[1.5fr_1fr_1fr_0.5fr] gap-4 px-7 py-3.5 bg-bg-3/30 text-[11px] font-bold text-text-3 uppercase tracking-widest">
            <span>Key ID</span>
            <span>Created</span>
            <span>Last Used</span>
            <span>Status</span>
          </div>

          <div className="flex flex-col">
            {HISTORY_DATA.map((item, index) => (
              <div
                key={item.id}
                className={`grid grid-cols-[1.5fr_1fr_1fr_0.5fr] gap-4 px-7 py-5 items-center hover:bg-bg-3/30 transition-colors ${index !== HISTORY_DATA.length - 1 ? "border-b border-bg-3/60" : ""
                  }`}
              >
                <span className="text-[13px] font-mono text-text-1">{item.id}</span>
                <span className="text-[13px] text-text-2">{item.created}</span>
                <span className="text-[13px] text-text-2">{item.lastUsed}</span>
                <div>
                  {item.status === "active" ? (
                    <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 leading-none capitalize">
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-red-500/15 text-red-400 border border-red-500/25 leading-none capitalize">
                      Revoked
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
