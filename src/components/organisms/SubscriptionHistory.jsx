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
  Calendar,
  MoreHorizontal,
  CreditCard,
  Eye,
  Download,
  FileDown,
} from "lucide-react";
import apiFetch from "@/utils/apiFetch";
import { formatRupiah, formatDate } from "@/utils/format";
import PaymentModal from "@/components/organisms/PaymentModal";
import { downloadInvoice, downloadAllInvoicesAsZip } from "@/utils/invoiceGenerator";
import { useAuth } from "@/hooks/useAuth";

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
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Table states
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });

  // Action / Payment states
  const [activeMenu, setActiveMenu] = useState(null);
  const [paymentTx, setPaymentTx] = useState(null);
  const [loadingTxId, setLoadingTxId] = useState(null);
  const [notification, setNotif] = useState(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const showNotif = (msg, type = "success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  };

  // Download single invoice handler
  const handleDownloadInvoice = async (transaction) => {
    setDownloadingId(transaction.id);
    try {
      // Validate transaction data
      if (!transaction || !transaction.id) {
        throw new Error("Data transaksi tidak valid");
      }

      // Fetch full transaction details if needed
      let fullTransaction = transaction;
      if (!transaction.customer_name || !transaction.customer_email) {
        try {
          const res = await apiFetch.get(`/transactions/${transaction.id}`);
          fullTransaction = res?.data || transaction;
        } catch (err) {
          console.log("Could not fetch full details, using existing data", err);
        }
      }
      
      // Enrich with user data
      const enrichedTransaction = {
        ...fullTransaction,
        invoice_code: fullTransaction.invoice_code || `INV-${fullTransaction.id}`,
        plan_name: fullTransaction.plan_name || "Subscription Plan",
        amount: fullTransaction.amount || 0,
        status: fullTransaction.status || fullTransaction.transaction_status || "pending",
        created_at: fullTransaction.created_at || new Date().toISOString(),
        customer_name: fullTransaction.customer_name || user?.name || user?.full_name || "Customer",
        customer_email: fullTransaction.customer_email || user?.email || "-",
        user: user,
      };
      
      // Validate required fields
      if (!enrichedTransaction.invoice_code || !enrichedTransaction.amount) {
        throw new Error("Data invoice tidak lengkap");
      }

      await downloadInvoice(enrichedTransaction);
      showNotif("Invoice berhasil didownload!", "success");
    } catch (error) {
      console.error("Download invoice error:", error);
      const errorMsg = error?.message || "Gagal mendownload invoice. Silakan coba lagi.";
      showNotif(errorMsg, "error");
    } finally {
      setDownloadingId(null);
    }
  };

  // Download all invoices handler
  const handleDownloadAllInvoices = async () => {
    if (filteredData.length === 0) {
      showNotif("Tidak ada invoice untuk didownload.", "error");
      return;
    }

    setDownloadingAll(true);
    try {
      // Filter only successful transactions
      const successfulTransactions = filteredData.filter((tx) => {
        const status = (tx.status || tx.transaction_status || "").toLowerCase();
        return status === "success" || status === "paid" || status === "completed";
      });

      if (successfulTransactions.length === 0) {
        showNotif("Tidak ada transaksi yang berhasil untuk didownload.", "error");
        setDownloadingAll(false);
        return;
      }

      // Enrich all transactions with user data
      const enrichedTransactions = successfulTransactions.map((tx) => ({
        ...tx,
        customer_name: tx.customer_name || user?.name || user?.full_name || "Customer",
        customer_email: tx.customer_email || user?.email || "-",
        user: user,
      }));

      await downloadAllInvoicesAsZip(enrichedTransactions);
      showNotif(`${successfulTransactions.length} invoice berhasil didownload!`, "success");
    } catch (error) {
      console.error("Download all invoices error:", error);
      showNotif("Gagal mendownload semua invoice.", "error");
    } finally {
      setDownloadingAll(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = () => setActiveMenu(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming /transactions returns current user's history
      const res = await apiFetch.get("/transactions");
      const transactions = res?.data || res || [];
      setData(Array.isArray(transactions) ? transactions : []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      // Handle different error cases
      if (err?.status === 404) {
        // No transactions found - not an error
        setData([]);
      } else if (err?.status === 401) {
        // Unauthorized - will be handled by apiFetch (redirect to login)
        setData([]);
      } else {
        // Other errors - show error message but don't crash
        setData([]);
        setError("Gagal memuat riwayat transaksi. Silakan refresh halaman.");
      }
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
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-lg animate-in slide-in-from-top-2 fade-in duration-200 ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          <p className="text-[13px] font-medium">{notification.msg}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-[18px] font-bold flex items-center gap-2">
            <History size={20} className="text-primary-3" />
            Riwayat Pembelian
          </h3>
          <p className="text-text-3 text-[12px] mt-1">Daftar transaksi subscription yang pernah Anda lakukan.</p>
        </div>

        <div className="flex items-center gap-3">
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

          {/* Download All Button */}
          <button
            onClick={handleDownloadAllInvoices}
            disabled={downloadingAll || loading || filteredData.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-1 text-white text-[13px] font-semibold hover:bg-primary-2 transition-all shadow-lg shadow-primary-1/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {downloadingAll ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <FileDown size={14} />
                <span>Download Semua</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="bg-bg-3/30 border-b border-bg-3">
                <th className="px-6 py-4 font-bold text-text-3 uppercase tracking-wider text-[10px]">
                  <button
                    onClick={() => handleSort("invoice_code")}
                    className="flex items-center gap-2 hover:text-text-1 transition-colors"
                  >
                    Invoice
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-6 py-4 font-bold text-text-3 uppercase tracking-wider text-[10px]">
                  <button
                    onClick={() => handleSort("plan_name")}
                    className="flex items-center gap-2 hover:text-text-1 transition-colors"
                  >
                    Paket
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-6 py-4 font-bold text-text-3 uppercase tracking-wider text-[10px]">
                  <button
                    onClick={() => handleSort("amount")}
                    className="flex items-center gap-2 hover:text-text-1 transition-colors"
                  >
                    Jumlah
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-6 py-4 font-bold text-text-3 uppercase tracking-wider text-[10px]">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-2 hover:text-text-1 transition-colors"
                  >
                    Status
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-6 py-4 font-bold text-text-3 uppercase tracking-wider text-[10px]">
                  <button
                    onClick={() => handleSort("created_at")}
                    className="flex items-center gap-2 hover:text-text-1 transition-colors"
                  >
                    Tanggal
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-6 py-4 font-bold text-text-3 uppercase tracking-wider text-[10px]">Pembuat</th>
                <th className="px-6 py-4 font-bold text-text-3 uppercase tracking-wider text-[10px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-3">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={24} className="animate-spin text-primary-3" />
                      <span className="text-text-3">Memuat riwayat...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-red-400">
                      <AlertCircle size={24} />
                      <span>{error}</span>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-text-3">
                      <FileText size={24} className="opacity-20" />
                      <span>Tidak ada data transaksi.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item, idx) => {
                  const status = (item.status || item.transaction_status || "pending").toLowerCase();
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
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          {statusStyle.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-text-2">{formatDate(item.created_at)}</span>
                          <span className="text-[10px] text-text-3">
                            {new Date(item.created_at).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-bg-3 flex items-center justify-center shrink-0">
                            <User size={12} className="text-text-3" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-text-2 truncate text-[11px]">
                              {item.created_by_name || item.created_by || "System"}
                            </span>
                            {item.updated_at && item.updated_at !== item.created_at && (
                              <span className="text-[9px] text-text-3 italic">
                                Updated: {formatDate(item.updated_at)}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(activeMenu === item.id ? null : item.id);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:bg-bg-3 hover:text-text-1 transition-all"
                          >
                            <MoreHorizontal size={16} />
                          </button>

                          {activeMenu === item.id && (
                            <div className="absolute right-0 mt-1.5 z-50 w-48 bg-bg-2 border border-bg-3 rounded-xl shadow-2xl shadow-black/40 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-150">
                              {status === "pending" ? (
                                <>
                                  <button
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      setActiveMenu(null);
                                      setLoadingTxId(item.id);
                                      try {
                                        let res;
                                        try {
                                          res = await apiFetch.get(`/transactions/${item.id}`);
                                        } catch (err) {
                                          console.log("Plural fetch failed, trying singular...", err);
                                          res = await apiFetch.get(`/transaction/${item.id}`);
                                        }
                                        const txData = res?.data || res;
                                        if (txData) {
                                          setPaymentTx(txData);
                                        } else {
                                          showNotif("Gagal mendapatkan detail pembayaran.", "error");
                                        }
                                      } catch (err) {
                                        console.error("Fetch detail failed:", err);
                                        showNotif(err?.data?.message || "Gagal mendapatkan detail pembayaran.", "error");
                                      } finally {
                                        setLoadingTxId(null);
                                      }
                                    }}
                                    disabled={loadingTxId === item.id}
                                  >
                                    {loadingTxId === item.id ? (
                                      <Loader2 size={14} className="animate-spin text-primary-3 animate-pulse" />
                                    ) : (
                                      <CreditCard size={14} className="text-primary-3" />
                                    )}
                                    <span>Bayar Sekarang</span>
                                  </button>
                                  <div className="border-t border-bg-3" />
                                </>
                              ) : (
                                <>
                                  <button
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      setActiveMenu(null);
                                      setLoadingTxId(item.id);
                                      try {
                                        let res;
                                        try {
                                          res = await apiFetch.get(`/transactions/${item.id}`);
                                        } catch (err) {
                                          console.log("Plural fetch failed, trying singular...", err);
                                          res = await apiFetch.get(`/transaction/${item.id}`);
                                        }
                                        const txData = res?.data || res;
                                        if (txData) {
                                          setPaymentTx(txData);
                                        } else {
                                          showNotif("Gagal mendapatkan detail transaksi.", "error");
                                        }
                                      } catch (err) {
                                        console.error("Fetch detail failed:", err);
                                        showNotif(err?.data?.message || "Gagal mendapatkan detail transaksi.", "error");
                                      } finally {
                                        setLoadingTxId(null);
                                      }
                                    }}
                                    disabled={loadingTxId === item.id}
                                  >
                                    {loadingTxId === item.id ? (
                                      <Loader2 size={14} className="animate-spin text-text-3" />
                                    ) : (
                                      <Eye size={14} className="text-text-3" />
                                    )}
                                    <span>Lihat Detail</span>
                                  </button>
                                  <div className="border-t border-bg-3" />
                                </>
                              )}
                              
                              {/* Download Invoice Button - Available for all statuses */}
                              <button
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenu(null);
                                  handleDownloadInvoice(item);
                                }}
                                disabled={downloadingId === item.id}
                              >
                                {downloadingId === item.id ? (
                                  <Loader2 size={14} className="animate-spin text-primary-3" />
                                ) : (
                                  <Download size={14} className="text-primary-3" />
                                )}
                                <span>Download Invoice</span>
                              </button>
                            </div>
                          )}
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
              Menampilkan <span className="text-text-1 font-semibold">{indexOfFirstItem + 1}</span> sampai{" "}
              <span className="text-text-1 font-semibold">{Math.min(indexOfLastItem, filteredData.length)}</span> dari{" "}
              <span className="text-text-1 font-semibold">{filteredData.length}</span> transaksi
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

      {/* Payment Modal */}
      {paymentTx && <PaymentModal transaction={paymentTx} onClose={() => setPaymentTx(null)} />}
    </div>
  );
}
