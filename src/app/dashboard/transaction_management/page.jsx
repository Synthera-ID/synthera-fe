"use client";

import { useState } from "react";
import { Search, Download, ChevronDown, Filter, ArrowUpDown, MoreHorizontal, Eye, FileText, CheckCircle2, XCircle } from "lucide-react";

const TRANSACTIONS = [
  { id: "INV-2026-0015", date: "Feb 15, 2026", description: "Pro Plan - Monthly", amount: "$29.00", status: "paid", user: "John Doe", email: "john@example.com" },
  { id: "INV-2026-0014", date: "Jan 15, 2026", description: "Pro Plan - Monthly", amount: "$29.00", status: "paid", user: "Jane Smith", email: "jane@smith.com" },
  { id: "INV-2025-0013", date: "Dec 15, 2025", description: "Pro Plan - Monthly", amount: "$29.00", status: "paid", user: "Mike Ross", email: "mike@ross.com" },
  { id: "INV-2025-0012", date: "Nov 15, 2025", description: "Plan Upgrade (Starter→Pro)", amount: "$29.00", status: "paid", user: "Rachel Zane", email: "rachel@zane.com" },
  { id: "INV-2025-0011", date: "Oct 15, 2025", description: "Starter Plan", amount: "$0.00", status: "paid", user: "Harvey Specter", email: "harvey@specter.com" },
  { id: "INV-2025-0010", date: "Sep 15, 2025", description: "Starter Plan", amount: "$0.00", status: "failed", user: "Donna Paulsen", email: "donna@paulsen.com" },
];

const STATUS_MAP = {
  paid: { label: "Paid", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2 },
  failed: { label: "Failed", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: XCircle },
};

export default function TransactionManagementPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const filtered = TRANSACTIONS.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) || 
      t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Data exported successfully!");
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Transaction Management</h1>
          <p className="text-[#9CA3AF] text-sm">Manage invoices, track payments, and monitor billing activities.</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-semibold text-[13px] transition-all shadow-[0_4px_20px_rgba(139,92,246,0.25)]"
        >
          {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          Export Data
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Transactions" value="1,248" trend="+12%" />
        <StatCard label="Total Revenue" value="$42,890" trend="+8%" />
        <StatCard label="Success Rate" value="98.4%" trend="+0.5%" />
        <StatCard label="Pending Payments" value="12" trend="-4%" color="text-amber-400" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-[#0D0D12]/50 border border-[#1A1A24] p-4 rounded-2xl">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
          <input
            type="text"
            placeholder="Search by ID, user, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#13131A] border border-[#1A1A24] rounded-xl text-sm text-white focus:outline-none focus:border-primary-1/50 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 lg:flex-none px-4 py-2.5 bg-[#13131A] border border-[#1A1A24] rounded-xl text-sm text-white focus:outline-none focus:border-primary-1/50 appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
          <button className="p-2.5 bg-[#13131A] border border-[#1A1A24] rounded-xl text-[#6B7280] hover:text-white transition-all">
            <Filter size={18} />
          </button>
          <button className="p-2.5 bg-[#13131A] border border-[#1A1A24] rounded-xl text-[#6B7280] hover:text-white transition-all">
            <ArrowUpDown size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D0D12] border border-[#1A1A24] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#13131A] border-b border-[#1A1A24]">
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A24]">
              {filtered.map((t) => {
                const status = STATUS_MAP[t.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={t.id} className="hover:bg-[#13131A]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-[13px] font-mono font-bold text-white">{t.id}</div>
                      <div className="text-[11px] text-[#6B7280] mt-0.5">{t.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] font-bold text-white">{t.user}</div>
                      <div className="text-[11px] text-[#6B7280] mt-0.5">{t.email}</div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#9CA3AF]">{t.description}</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-white">{t.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${status.bg} ${status.color} ${status.border}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button title="View Details" className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:text-white hover:bg-[#1A1A24] transition-all">
                          <Eye size={16} />
                        </button>
                        <button title="Download Invoice" className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:text-primary-3 hover:bg-primary-1/10 transition-all">
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, color = "text-white" }) {
  return (
    <div className="bg-[#0D0D12] border border-[#1A1A24] p-5 rounded-2xl">
      <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">{label}</div>
      <div className="flex items-end justify-between">
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend}
        </div>
      </div>
    </div>
  );
}

function Loader2({ size, className }) {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
