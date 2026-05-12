"use client";

import { useState } from "react";
import { Search, Clock, ChevronLeft, ChevronRight, Filter, ArrowUpDown } from "lucide-react";

const SUBSCRIPTION_HISTORY = [
  {
    id: 1,
    plan: "Pro Plan - Annual",
    status: "active",
    amount: "$290.00",
    created_by: "Admin John",
    created_at: "2026-05-10T14:30:00Z",
    updated_by: "System",
    updated_at: "2026-05-10T14:30:00Z",
  },
  {
    id: 2,
    plan: "Pro Plan - Monthly",
    status: "expired",
    amount: "$29.00",
    created_by: "Jane Doe",
    created_at: "2026-04-10T10:00:00Z",
    updated_by: "System",
    updated_at: "2026-05-10T00:00:00Z",
  },
  {
    id: 3,
    plan: "Starter Plan",
    status: "cancelled",
    amount: "$0.00",
    created_by: "Jane Doe",
    created_at: "2026-03-15T08:45:00Z",
    updated_by: "Jane Doe",
    updated_at: "2026-03-20T12:00:00Z",
  },
  {
    id: 4,
    plan: "Enterprise Plan",
    status: "active",
    amount: "$999.00",
    created_by: "Admin Smith",
    created_at: "2026-02-01T16:20:00Z",
    updated_by: "Admin John",
    updated_at: "2026-05-11T09:00:00Z",
  },
];

const STATUS_CONFIG = {
  active: { label: "Active", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  expired: { label: "Expired", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
};

export default function SubscriptionHistoryPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = SUBSCRIPTION_HISTORY.filter(
    (item) =>
      item.plan.toLowerCase().includes(search.toLowerCase()) ||
      item.created_by.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Clock className="text-primary-3" size={28} />
            Subscription History
          </h1>
          <p className="text-[#9CA3AF] text-sm">
            Monitor and manage all your previous and current subscription records.
          </p>
        </div>
      </header>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#0D0D12]/50 border border-[#1A1A24] p-4 rounded-2xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
          <input
            type="text"
            placeholder="Search by plan or created by..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#13131A] border border-[#1A1A24] rounded-xl text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-primary-1/50 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#13131A] border border-[#1A1A24] rounded-xl text-sm text-[#9CA3AF] hover:text-white hover:bg-[#1A1A24] transition-all">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#0D0D12] border border-[#1A1A24] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#13131A] border-b border-[#1A1A24]">
                <th 
                  className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('plan')}
                >
                  <div className="flex items-center gap-2">
                    Plan Details <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Created By</th>
                <th 
                  className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center gap-2">
                    Created At <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Updated By</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A24]">
              {filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const status = STATUS_CONFIG[item.status];
                  return (
                    <tr key={item.id} className="hover:bg-[#13131A]/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="font-semibold text-white group-hover:text-primary-3 transition-colors">
                          {item.plan}
                        </div>
                        <div className="text-[12px] text-[#6B7280] mt-0.5">{item.amount}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${status.bg} ${status.color} ${status.border}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-[#9CA3AF]">{item.created_by}</td>
                      <td className="px-6 py-5 text-sm text-[#9CA3AF]">{formatDate(item.created_at)}</td>
                      <td className="px-6 py-5 text-sm text-[#9CA3AF]">{item.updated_by}</td>
                      <td className="px-6 py-5 text-sm text-[#9CA3AF]">{formatDate(item.updated_at)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-[#6B7280]">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="opacity-20" />
                      <p>No subscription history found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-[#13131A] border-t border-[#1A1A24] flex items-center justify-between">
          <p className="text-[12px] text-[#6B7280]">
            Showing <span className="text-white font-medium">1</span> to{" "}
            <span className="text-white font-medium">{filteredData.length}</span> of{" "}
            <span className="text-white font-medium">{filteredData.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-[#1A1A24] text-[#6B7280] hover:text-white hover:bg-[#1A1A24] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 rounded-lg border border-[#1A1A24] text-[#6B7280] hover:text-white hover:bg-[#1A1A24] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
