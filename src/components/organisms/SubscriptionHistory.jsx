"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  History,
  Loader2,
  AlertCircle,
  FileText,
  User,
  Calendar
} from "lucide-react";
import apiFetch from "@/utils/apiFetch";
import { formatRupiah, formatDate } from "@/utils/format";

const STATUS_STYLES = {
  success: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", label: "Success" },
  paid: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", label: "Paid" },
  completed: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", label: "Completed" },
  pending: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", label: "Pending" },
  failed: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", label: "Failed" },
  expired: { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/20", label: "Expired" },
  cancelled: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", label: "Cancelled" },
};

export default function SubscriptionHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Table states
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Assuming /transactions returns current user's history
      const res = await apiFetch.get("/transactions");
      setData(res.data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setError("Gagal memuat riwayat transaksi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sorting logic
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!a[sortConfig.key]) return 1;
    if (!b[sortConfig.key]) return -1;
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Search logic
  const filteredData = sortedData.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.invoice_code?.toLowerCase().includes(searchLower) ||
      item.plan_name?.toLowerCase().includes(searchLower) ||
      item.status?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mt-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-[18px] font-bold flex items-center gap-2">
            <History size={20} className="text-primary-3" />
            Riwayat Pembelian
          </h3>
          <p className="text-text-3 text-[12px] mt-1">Daftar transaksi subscription yang pernah Anda lakukan.</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Cari invoice atau paket..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-bg-2 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 focus:border-primary-1/50 transition-all outline-none"
          />
        </div>
      </div>

      <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="bg-bg-3/30 border-b border-bg-3">
                <th className="px-6 py-4 font-bold text-text-3 uppercase tracking-wider text-[10px]">
                  <button onClick={() => handleSort("invoice_code")} className="flex items-center gap-2 hover:text-text-1 transition-colors">
                    Invoice
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-6 py-4 font-bold text-text-3 uppercase tracking-wider text-[10px]">
                  <button onClick={() => handleSort("plan_name")} className="flex items-center gap-2 hover:text-text-1 transition-colors">
                    Paket
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-6 py-4 font-bold text-text-3 uppercase tracking-wider text-[10px]">
                  <button onClick={() => handleSort("amount")} className="flex items-center gap-2 hover:text-text-1 transition-colors">
                    Jumlah
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-6 py-4 font-bold text-text-3 uppercase tracking-wider text-[10px]">
                  <button onClick={() => handleSort("status")} className="flex items-center gap-2 hover:text-text-1 transition-colors">
                    Status
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-6 py-4 font-bold text-text-3 uppercase tracking-wider text-[10px]">
                  <button onClick={() => handleSort("created_at")} className="flex items-center gap-2 hover:text-text-1 transition-colors">
                    Tanggal
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-6 py-4 font-bold text-text-3 uppercase tracking-wider text-[10px]">
                  Pembuat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-3">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={24} className="animate-spin text-primary-3" />
                      <span className="text-text-3">Memuat riwayat...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-red-400">
                      <AlertCircle size={24} />
                      <span>{error}</span>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-text-3">
                      <FileText size={24} className="opacity-20" />
                      <span>Tidak ada data transaksi.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item, idx) => {
                  const status = item.status?.toLowerCase() || "pending";
                  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.pending;
                  
                  return (
                    <tr key={item.id || idx} className="hover:bg-bg-3/20 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-text-1 font-medium">{item.invoice_code || "-"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-text-2 font-semibold capitalize">{item.plan_name || "Unknown"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-primary-3 font-bold">{formatRupiah(item.amount)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                          {statusStyle.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-text-2">{formatDate(item.created_at)}</span>
                          <span className="text-[10px] text-text-3">{new Date(item.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-bg-3 flex items-center justify-center shrink-0">
                            <User size={12} className="text-text-3" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-text-2 truncate text-[11px]">{item.created_by_name || item.created_by || "System"}</span>
                            {item.updated_at && item.updated_at !== item.created_at && (
                              <span className="text-[9px] text-text-3 italic">Updated: {formatDate(item.updated_at)}</span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && !error && filteredData.length > itemsPerPage && (
          <div className="px-6 py-4 bg-bg-3/10 border-t border-bg-3 flex items-center justify-between">
            <p className="text-[11px] text-text-3">
              Menampilkan <span className="text-text-1 font-semibold">{indexOfFirstItem + 1}</span> sampai <span className="text-text-1 font-semibold">{Math.min(indexOfLastItem, filteredData.length)}</span> dari <span className="text-text-1 font-semibold">{filteredData.length}</span> transaksi
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all ${
                      currentPage === number
                        ? "bg-primary-1 text-white shadow-lg shadow-primary-1/20"
                        : "text-text-3 hover:text-text-1 hover:bg-bg-3"
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
