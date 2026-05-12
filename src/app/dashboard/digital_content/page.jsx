"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import DashboardNavbar from "@/components/organisms/DashboardNavbar";
import { Search, ChevronDown, File, Download, Plus, Check, Loader2, Edit3, Trash2 } from "lucide-react";
import ContentModal from "@/components/organisms/ContentModal";

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
  const [items, setItems] = useState(CONTENT_ITEMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (data) => {
    if (editingContent) {
      setItems(items.map((item) => (item.id === editingContent.id ? { ...item, ...data } : item)));
      showToast("Content updated successfully!");
    } else {
      const newItem = {
        ...data,
        id: items.length + 1,
        gradient: "from-[#2A1B38] to-[#171321]", // Default gradient
      };
      setItems([newItem, ...items]);
      showToast("Content created successfully!");
    }
    setEditingContent(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      setItems(items.filter((item) => item.id !== id));
      showToast("Content deleted successfully!");
    }
  };

  return (
    <>
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold mb-1.5">Digital Content</h1>
          <p className="text-text-3 text-[13px]">Browse and manage your premium content library.</p>
        </div>
        <button
          onClick={() => {
            setEditingContent(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-semibold text-[13px] transition-all duration-200 shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.4)]"
        >
          <Plus size={16} />
          Add Content
        </button>
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
        {items.filter(i => i.title.toLowerCase().includes(search.toLowerCase())).map((item) => (
          <div
            key={item.id}
            className="bg-bg-2 border border-bg-3 rounded-[20px] overflow-hidden flex flex-col group hover:border-bg-4 hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-300"
          >
            {/* Top Gradient Area */}
            <div className={`h-[160px] bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
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

              <div className="flex gap-2 w-full mt-auto">
                <button className="flex-1 h-[40px] flex items-center justify-center gap-2.5 px-4 rounded-xl bg-transparent border border-[#1A1A24] text-text-2 text-[13px] font-bold hover:bg-bg-3 hover:text-white transition-all">
                  <Download size={15} /> Access
                </button>
                <button
                  onClick={() => {
                    setEditingContent(item);
                    setIsModalOpen(true);
                  }}
                  className="w-10 h-[40px] flex items-center justify-center rounded-xl bg-[#13131A] border border-[#1A1A24] text-[#6B7280] hover:text-primary-3 hover:border-primary-1/30 transition-all"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="w-10 h-[40px] flex items-center justify-center rounded-xl bg-[#13131A] border border-[#1A1A24] text-[#6B7280] hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
          </div>
        ))}
    </div >

      <ContentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContent(null);
        }}
        onSave={handleSave}
        content={editingContent}
      />

  {/* Toast Notification */ }
  {
    toast && (
      <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#0D0D12] border border-emerald-500/30 text-emerald-400 text-[13px] font-semibold shadow-2xl animate-in slide-in-from-right-10 duration-300">
        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Check size={12} />
        </div>
        {toast}
      </div>
    )
  }
    </>
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
