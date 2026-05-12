"use client";

import { useState } from "react";
import { Search, Download, ChevronDown, Filter, FileText, ArrowUpDown, MoreHorizontal } from "lucide-react";

const TRANSACTIONS = [
  { id: "INV-2026-0015", date: "2026-02-15T09:00:00Z", description: "Pro Plan - Monthly", amount: "$29.00", status: "Paid", method: "Credit Card" },
  { id: "INV-2026-0014", date: "2026-01-15T10:30:00Z", description: "Pro Plan - Monthly", amount: "$29.00", status: "Paid", method: "PayPal" },
  { id: "INV-2025-0013", date: "2025-12-15T14:00:00Z", description: "Pro Plan - Monthly", amount: "$29.00", status: "Paid", method: "Credit Card" },
  { id: "INV-2025-0012", date: "2025-11-15T08:15:00Z", description: "Pro Plan - Monthly", amount: "$29.00", status: "Failed", method: "Credit Card" },
  { id: "INV-2025-0011", date: "2025-10-15T16:45:00Z", description: "Starter Plan", amount: "$0.00", status: "Paid", method: "System" },
];

const STATUS_CONFIG = {
  Paid: { label: "Paid", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  Failed: { label: "Failed", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  Pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
};

export default function TransactionManagementPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredData = TRANSACTIONS.filter(
    (item) =>
      (item.id.toLowerCase().includes(search.toLowerCase()) ||
       item.description.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "All" || item.status === statusFilter)
  );

  const handleExport = () => {
    alert("Exporting data as CSV...");
    // In real app: generate CSV and download
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Transaction Management</h1>
          <p className="text-[#9CA3AF] text-sm">Manage and track all customer transactions and invoices.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#13131A] border border-[#1A1A24] text-white text-sm font-bold hover:bg-[#1A1A24] transition-all"
        >
          <Download size={18} />
          Export Data
        </button>
      </header>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#0D0D12]/50 border border-[#1A1A24] p-4 rounded-2xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
          <input
            type="text"
            placeholder="Search invoice or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#13131A] border border-[#1A1A24] rounded-xl text-sm text-white focus:outline-none focus:border-primary-1/50 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-40 px-4 py-2.5 bg-[#13131A] border border-[#1A1A24] rounded-xl text-sm text-white focus:outline-none focus:border-primary-1/50 transition-all appearance-none cursor-pointer"
            >
              <option>All Status</option>
              <option>Paid</option>
              <option>Failed</option>
              <option>Pending</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D0D12] border border-[#1A1A24] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#13131A] border-b border-[#1A1A24]">
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A24]">
              {filteredData.map((t) => {
                const status = STATUS_CONFIG[t.status];
                return (
                  <tr key={t.id} className="hover:bg-[#13131A]/50 transition-colors group">
                    <td className="px-6 py-5 text-sm font-bold text-white group-hover:text-primary-3 transition-colors">{t.id}</td>
                    <td className="px-6 py-5 text-sm text-[#9CA3AF]">{formatDate(t.date)}</td>
                    <td className="px-6 py-5 text-sm text-[#9CA3AF]">{t.description}</td>
                    <td className="px-6 py-5 text-sm font-bold text-white">{t.amount}</td>
                    <td className="px-6 py-5 text-sm text-[#6B7280]">{t.method}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ${status.bg} ${status.color} ${status.border}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 rounded-lg bg-[#13131A] border border-[#1A1A24] text-[#6B7280] hover:text-white hover:border-white transition-all">
                        <FileText size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-[#13131A] border-t border-[#1A1A24]">
          <p className="text-[12px] text-[#6B7280]">
            Showing <span className="text-white font-medium">{filteredData.length}</span> of <span className="text-white font-medium">{TRANSACTIONS.length}</span> transactions
          </p>
        </div>
      </div>
    </div>
  );
}
