"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import DashboardNavbar from "@/components/organisms/DashboardNavbar";
import {
  Search,
  Download,
  ChevronDown,
} from "lucide-react";

const TRANSACTIONS = [
  { id: "INV-2026-0015", date: "Feb 15, 2026", description: "Pro Plan - Monthly", amount: "$29.00", status: "paid" },
  { id: "INV-2026-0014", date: "Jan 15, 2026", description: "Pro Plan - Monthly", amount: "$29.00", status: "paid" },
  { id: "INV-2025-0013", date: "Dec 15, 2025", description: "Pro Plan - Monthly", amount: "$29.00", status: "paid" },
  { id: "INV-2025-0012", date: "Nov 15, 2025", description: "Plan Upgrade (Starter→Pro)", amount: "$29.00", status: "paid" },
  { id: "INV-2025-0011", date: "Oct 15, 2025", description: "Starter Plan", amount: "$0.00", status: "paid" },
  { id: "INV-2025-0010", date: "Sep 15, 2025", description: "Starter Plan", amount: "$0.00", status: "failed" },
];

const STATUS_MAP = {
  paid: { label: "Paid", color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/25" },
  failed: { label: "Failed", color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/25" },
};

export default function PaymentHistoryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filtered = TRANSACTIONS.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

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
          <h1 className="text-[26px] font-bold mb-1.5">Payment History</h1>
          <p className="text-text-3 text-[13px]">View your transaction history and invoices.</p>
        </header>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 h-[42px] rounded-xl bg-bg-2 border border-bg-3 text-text-1 text-[13px] placeholder:text-text-3 focus:outline-none focus:border-primary-1/40 focus:ring-1 focus:ring-primary-1/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 h-[42px] px-4 rounded-xl bg-bg-2 border border-bg-3 text-text-2 text-[13px] font-medium hover:border-bg-4 transition-all min-w-[130px] justify-between"
              >
                <span className="capitalize">{statusFilter === "all" ? "All Status" : statusFilter}</span>
                <ChevronDown size={14} className={`text-text-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full mt-1 right-0 w-full bg-bg-2 border border-bg-3 rounded-xl shadow-xl shadow-black/20 z-50 overflow-hidden">
                  {["all", "paid", "failed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatusFilter(s); setDropdownOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-[13px] capitalize transition-colors ${statusFilter === s
                          ? "text-primary-1 bg-primary-1/10"
                          : "text-text-2 hover:bg-bg-3 hover:text-text-1"
                        }`}
                    >
                      {s === "all" ? "All Status" : s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Picker */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-[42px] px-4 rounded-xl bg-bg-2 border border-bg-3 text-text-2 text-[13px] font-medium hover:border-bg-4 transition-all focus:outline-none focus:border-primary-1/40 [color-scheme:dark]"
            />

            {/* Export CSV */}
            <button className="flex items-center gap-2 h-[42px] px-5 rounded-xl bg-primary-1/10 border border-primary-1/25 text-primary-3 text-[13px] font-semibold hover:bg-primary-1/20 hover:border-primary-1/40 transition-all">
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1.1fr_1fr_1.6fr_0.9fr_0.7fr_0.5fr] gap-4 px-6 py-3.5 bg-bg-3/40 text-[11px] font-bold text-text-3 uppercase tracking-widest">
            <span>Invoice</span>
            <span>Date</span>
            <span>Description</span>
            <span>Amount</span>
            <span>Status</span>
            <span className="text-center">Action</span>
          </div>

          {/* Table Rows */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-text-3">
              <Search size={28} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">No transactions found</p>
              <p className="text-xs mt-1 opacity-50">Try adjusting your search or filter</p>
            </div>
          ) : (
            filtered.map((t, i) => {
              const cfg = STATUS_MAP[t.status];
              return (
                <div
                  key={t.id}
                  className={`grid grid-cols-[1.1fr_1fr_1.6fr_0.9fr_0.7fr_0.5fr] gap-4 px-6 py-4 items-center hover:bg-bg-3/30 transition-colors duration-150 ${i < filtered.length - 1 ? "border-b border-bg-3/50" : ""
                    }`}
                >
                  <span className="text-[13px] font-mono text-text-2 font-medium">{t.id}</span>
                  <span className="text-[13px] text-text-2">{t.date}</span>
                  <span className="text-[13px] text-text-1">{t.description}</span>
                  <span className="text-[13px] font-semibold text-text-1">{t.amount}</span>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-primary-3 hover:bg-primary-1/10 transition-all">
                      <Download size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        </main>
      </div>
    </div>
  );
}
