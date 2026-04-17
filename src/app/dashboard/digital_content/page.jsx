"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import { Search, ChevronDown, File, Download } from "lucide-react";

const CONTENT_ITEMS = [
  {
    id: 1,
    title: "API Integration Guide",
    category: "Tutorial",
    tier: "Pro",
    gradient: "from-[#2A1B38] to-[#171321]",
  },
  {
    id: 2,
    title: "Dashboard Templates Pack",
    category: "Template",
    tier: "Free",
    gradient: "from-[#162F27] to-[#121C18]",
  },
  {
    id: 3,
    title: "Advanced Analytics Ebook",
    category: "E-Book",
    tier: "Pro",
    gradient: "from-[#1B263B] to-[#151821]",
  },
  {
    id: 4,
    title: "Security Best Practices",
    category: "Tutorial",
    tier: "Enterprise",
    gradient: "from-[#311717] to-[#1C1313]",
  },
  {
    id: 5,
    title: "Membership Growth Video",
    category: "Video",
    tier: "Free",
    gradient: "from-[#3B2A11] to-[#1E1710]",
  },
  {
    id: 6,
    title: "Custom Webhook Setup",
    category: "Tutorial",
    tier: "Pro",
    gradient: "from-[#2A243B] to-[#18161D]",
  },
];

export default function DigitalContentPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen bg-bg-1 text-text-1 font-sans selection:bg-primary-1/30">
      <DashboardSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-12 max-h-screen overflow-y-auto w-full scroll-smooth">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-[26px] font-bold mb-1.5">Digital Content</h1>
          <p className="text-text-3 text-[13px]">Browse and access your premium content library.</p>
        </header>

        {/* Filters Area */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 h-[44px] bg-bg-2 border border-bg-3 rounded-xl text-[14px] text-text-1 placeholder:text-text-3 focus:outline-none focus:border-primary-1/40 transition-colors"
            />
          </div>
          <button className="flex items-center justify-between gap-3 h-[44px] px-4 min-w-[140px] bg-bg-2 border border-bg-3 rounded-xl text-[13px] text-text-1 hover:bg-bg-3/50 transition-colors">
            All Categories <ChevronDown size={14} className="text-text-3" />
          </button>
          <button className="flex items-center justify-between gap-3 h-[44px] px-4 min-w-[130px] bg-bg-2 border border-bg-3 rounded-xl text-[13px] text-text-1 hover:bg-bg-3/50 transition-colors">
            All Access <ChevronDown size={14} className="text-text-3" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {CONTENT_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-bg-2 border border-bg-3 rounded-[20px] overflow-hidden flex flex-col group hover:border-bg-4 hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-300"
            >
              {/* Top Gradient Area */}
              <div
                className={`h-[160px] bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
              >
                <File size={22} className="text-white/80 group-hover:text-white transition-colors" />
              </div>

              {/* Bottom Content Area */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-[14px] font-bold text-text-1">{item.title}</h3>
                    <p className="text-[11px] text-text-3 mt-1.5">{item.category}</p>
                  </div>
                  <Badge tier={item.tier} />
                </div>

                <div className="mt-auto">
                  <button className="w-full h-[40px] flex items-center gap-2.5 px-4 rounded-xl bg-transparent border border-primary-1/20 text-primary-3 text-[13px] font-bold hover:bg-primary-1/10 hover:border-primary-1/30 transition-all">
                    <Download size={15} /> Access
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function Badge({ tier }) {
  if (tier === "Pro") {
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-1/15 text-primary-3 leading-none whitespace-nowrap">
        Pro
      </span>
    );
  }
  if (tier === "Free") {
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 leading-none whitespace-nowrap">
        Free
      </span>
    );
  }
  if (tier === "Enterprise") {
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-400 leading-none whitespace-nowrap">
        Enterprise
      </span>
    );
  }
  return null;
}
