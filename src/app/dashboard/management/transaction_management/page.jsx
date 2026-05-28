"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Receipt, Search, Download, MoreHorizontal,
  Check, AlertCircle, Loader2, X, Eye, Edit3,
  Trash2, TrendingUp, Clock, XCircle, CreditCard,
  FileText, CheckSquare, Square,
} from "lucide-react";
import apiFetch from "@/utils/apiFetch";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  pending:   { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20",   dot: "bg-amber-400",   label: "Pending" },
  paid:      { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400", label: "Paid" },
  completed: { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20",    dot: "bg-blue-400",    label: "Completed" },
  failed:    { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/20",    dot: "bg-rose-400",    label: "Failed" },
  refunded:  { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20",  dot: "bg-violet-400",  label: "Refunded" },
};

const STATUS_FILTERS = ["All", "Pending", "Paid", "Completed", "Failed", "Refunded"];
const STATUS_OPTIONS = ["pending", "paid", "completed", "failed", "refunded"];

const AVATAR_COLORS = [
  "bg-violet-500/20 text-violet-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-amber-500/20 text-amber-400",
  "bg-blue-500/20 text-blue-400",
  "bg-rose-500/20 text-rose-400",
  "bg-cyan-500/20 text-cyan-400",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(str) {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDateCSV(str) {
  if (!str) return "-";
  return new Date(str).toISOString().slice(0, 10);
}

function formatCurrency(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

function getStatusStyle(status) {
  return STATUS_STYLES[status?.toLowerCase()] ?? STATUS_STYLES.pending;
}

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function getAvatarColor(id) { return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length]; }

// ─── Export CSV Modal ─────────────────────────────────────────────────────────
function ExportCSVModal({ transactions, onClose, onExported }) {
  const [selectedStatuses, setSelectedStatuses] = useState(new Set(STATUS_OPTIONS));
  const [isExporting, setIsExporting] = useState(false);

  const allSelected = selectedStatuses.size === STATUS_OPTIONS.length;

  function toggleStatus(s) {
    setSelectedStatuses((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedStatuses(new Set());
    } else {
      setSelectedStatuses(new Set(STATUS_OPTIONS));
    }
  }

  function doExport() {
    if (selectedStatuses.size === 0) return;
    setIsExporting(true);

    const filtered = transactions.filter((t) =>
      selectedStatuses.has(t.transaction_status?.toLowerCase())
    );

    const header = ["Invoice", "Email", "Plan", "Amount", "Status", "Date", "PaymentMethod"];
    const rows = filtered.map((t) => [
      t.invoice_code ?? "-",
      t.user?.email ?? "-",
      t.plan?.name ?? "-",
      t.final_amount ?? t.amount ?? 0,
      t.transaction_status ?? "-",
      formatDateCSV(t.created_at),
      t.payment?.payment_method ?? "-",
    ]);

    // Escape fields that may contain commas
    const escape = (v) => {
      const str = String(v);
      return str.includes(",") || str.includes('"') || str.includes("\n")
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    };

    const csvContent =
      [header, ...rows].map((r) => r.map(escape).join(",")).join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${[...selectedStatuses].join("-")}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setIsExporting(false);
      onExported(`Exported ${filtered.length} transaction(s) as CSV.`);
      onClose();
    }, 400);
  }

  const previewCount = transactions.filter((t) =>
    selectedStatuses.has(t.transaction_status?.toLowerCase())
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-md shadow-2xl"
        style={{ animation: "modalIn 0.22s cubic-bezier(.4,0,.2,1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-1/10 flex items-center justify-center">
              <FileText size={18} className="text-primary-3" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold">Export CSV</h2>
              <p className="text-[12px] text-text-3">Select status to include in export</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* CSV Format info */}
        <div className="mb-5 px-4 py-3 rounded-xl bg-bg-3/40 border border-bg-3">
          <p className="text-[11px] text-text-3 font-semibold uppercase tracking-widest mb-1">CSV Format</p>
          <p className="text-[12px] text-text-2 font-mono break-all">
            Invoice, Email, Plan, Amount, Status, Date, PaymentMethod
          </p>
        </div>

        {/* Select All */}
        <div className="mb-3">
          <button
            onClick={toggleAll}
            className="flex items-center gap-2.5 text-[13px] font-semibold text-text-2 hover:text-text-1 transition-colors"
          >
            {allSelected
              ? <CheckSquare size={16} className="text-primary-3" />
              : <Square size={16} className="text-text-3" />}
            Select All Statuses
          </button>
        </div>

        {/* Status checkboxes */}
        <div className="space-y-2 mb-6">
          {STATUS_OPTIONS.map((s) => {
            const st = STATUS_STYLES[s];
            const checked = selectedStatuses.has(s);
            const count = transactions.filter(
              (t) => t.transaction_status?.toLowerCase() === s
            ).length;
            return (
              <button
                key={s}
                onClick={() => toggleStatus(s)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 ${
                  checked
                    ? `${st.bg} ${st.border} border`
                    : "bg-bg-3/20 border-bg-3 hover:border-bg-3/80"
                }`}
              >
                <div className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-all ${
                  checked ? `bg-primary-1 border-primary-1` : "border-text-3 bg-transparent"
                }`}>
                  {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
                <span className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                <span className={`text-[13px] font-semibold flex-1 text-left ${checked ? st.text : "text-text-2"}`}>
                  {st.label}
                </span>
                <span className="text-[11px] text-text-3 tabular-nums">
                  {count} row{count !== 1 ? "s" : ""}
                </span>
              </button>
            );
          })}
        </div>

        {/* Preview count */}
        <div className="mb-5 flex items-center justify-between px-4 py-2.5 rounded-xl bg-primary-1/10 border border-primary-1/20">
          <span className="text-[12px] text-text-3">Rows to export</span>
          <span className="text-[14px] font-bold text-primary-3">{previewCount} transaction{previewCount !== 1 ? "s" : ""}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={doExport}
            disabled={selectedStatuses.size === 0 || isExporting || previewCount === 0}
            className="flex-1 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all shadow-[0_4px_20px_rgba(139,92,246,0.25)] flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <><Loader2 size={14} className="animate-spin" /> Exporting…</>
            ) : (
              <><Download size={14} /> Export CSV</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TransactionManagementPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeMenu, setActiveMenu] = useState(null);
  const [detailTx, setDetailTx] = useState(null);
  const [editTx, setEditTx] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotif] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterStatus !== "All") params.append("status", filterStatus.toLowerCase());
      params.append("per_page", "50");

      const res = await apiFetch.get(`/admin/transactions?${params.toString()}`);
      setTransactions(res.data || []);
    } catch {
      showNotif("Gagal memuat data transaksi.", "error");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    const t = setTimeout(fetchTransactions, 300);
    return () => clearTimeout(t);
  }, [fetchTransactions]);

  // Stats
  const totalRevenue = transactions.filter((t) => t.transaction_status === "paid" || t.transaction_status === "completed").reduce((s, t) => s + Number(t.final_amount || 0), 0);
  const totalPaid = transactions.filter((t) => t.transaction_status === "paid" || t.transaction_status === "completed").length;
  const totalPending = transactions.filter((t) => t.transaction_status === "pending").length;
  const totalFailed = transactions.filter((t) => t.transaction_status === "failed").length;

  function showNotif(msg, type = "success") {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  }

  // Update status
  async function handleUpdateStatus(id, newStatus) {
    try {
      const res = await apiFetch.put(`/admin/transactions/${id}`, { transaction_status: newStatus });
      setTransactions((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      showNotif("Transaction status updated.");
      setEditTx(null);
    } catch (err) {
      showNotif(err?.data?.message || "Gagal update status.", "error");
    }
  }

  // Delete
  async function handleDelete(id) {
    setIsDeleting(true);
    try {
      await apiFetch.delete(`/admin/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showNotif("Transaction deleted.");
      setDeleteTarget(null);
    } catch (err) {
      showNotif(err?.data?.message || "Gagal menghapus.", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold mb-1.5">Transaction Management</h1>
          <p className="text-text-3 text-[13px]">Monitor and manage all user transactions on your platform.</p>
        </div>
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-semibold text-[13px] transition-all duration-200 shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.4)]"
        >
          <Download size={15} /> Export CSV
        </button>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<TrendingUp size={20} className="text-violet-400" />} iconBg="bg-violet-500/20" label="Total Revenue" value={formatCurrency(totalRevenue)} />
        <StatCard icon={<CreditCard size={20} className="text-emerald-400" />} iconBg="bg-emerald-500/20" label="Paid" value={totalPaid} />
        <StatCard icon={<Clock size={20} className="text-amber-400" />} iconBg="bg-amber-500/20" label="Pending" value={totalPending} />
        <StatCard icon={<XCircle size={20} className="text-rose-400" />} iconBg="bg-rose-500/20" label="Failed" value={totalFailed} />
      </div>

      {/* Filters */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl px-6 py-5 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search by invoice, name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold border transition-all duration-150 ${
                filterStatus === s
                  ? "bg-primary-1/20 text-primary-3 border-primary-1/30"
                  : "bg-transparent text-text-3 border-bg-3 hover:border-primary-1/20 hover:text-text-2"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-visible">
        <div className="hidden lg:grid grid-cols-[44px_1.8fr_1.8fr_1.2fr_1fr_1fr_1.5fr_1.5fr] gap-4 px-6 py-3.5 bg-bg-3/30 text-[11px] font-bold text-text-3 uppercase tracking-widest border-b border-bg-3">
          <span />
          <span>Invoice</span>
          <span>User</span>
          <span>Plan</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Created</span>
          <span>Updated</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 size={24} className="animate-spin text-primary-3" />
            <span className="text-text-3 text-[13px]">Loading transactions...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-3">
            <AlertCircle size={36} className="opacity-40" />
            <p className="text-[14px]">No transactions found.</p>
          </div>
        ) : (
          transactions.map((t, i) => {
            const st = getStatusStyle(t.transaction_status);
            return (
              <div
                key={t.id}
                className={`grid grid-cols-[44px_1fr] lg:grid-cols-[44px_1.8fr_1.8fr_1.2fr_1fr_1fr_1.5fr_1.5fr] gap-4 px-6 py-4 items-center hover:bg-bg-3/20 transition-colors relative ${
                  i < transactions.length - 1 ? "border-b border-bg-3/50" : ""
                }`}
              >
                {/* Action */}
                <div className="relative flex justify-center">
                  <button
                    onClick={() => setActiveMenu(activeMenu === t.id ? null : t.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:bg-bg-3 hover:text-text-1 transition-all"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {activeMenu === t.id && (
                    <div className="absolute left-0 top-10 z-50 w-44 bg-bg-2 border border-bg-3 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                      <button
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                        onClick={() => { setDetailTx(t); setActiveMenu(null); }}
                      >
                        <Eye size={14} className="text-primary-3" /> View Detail
                      </button>
                      <button
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                        onClick={() => { setEditTx(t); setActiveMenu(null); }}
                      >
                        <Edit3 size={14} className="text-amber-400" /> Update Status
                      </button>
                      <div className="border-t border-bg-3/60 my-0.5" />
                      <button
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-rose-400 hover:bg-rose-500/10 transition-colors"
                        onClick={() => { setDeleteTarget(t); setActiveMenu(null); }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Invoice */}
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-text-1 truncate">{t.invoice_code}</div>
                  <div className="text-[11px] text-text-3 mt-0.5">{formatDate(t.created_at)}</div>
                </div>

                {/* User */}
                <div className="hidden lg:flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-[11px] shrink-0 ${getAvatarColor(t.user_id)}`}>
                    {getInitials(t.user?.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-text-1 truncate">{t.user?.name || "-"}</div>
                    <div className="text-[11px] text-text-3 truncate">{t.user?.email || "-"}</div>
                  </div>
                </div>

                {/* Plan */}
                <div className="hidden lg:block text-[13px] text-text-2">{t.plan?.name || "-"}</div>

                {/* Amount */}
                <div className="hidden lg:block text-[13px] font-bold text-text-1">
                  {formatCurrency(t.final_amount)}
                </div>

                {/* Status */}
                <div className="hidden lg:flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                  <span className={`text-[12px] font-semibold ${st.text}`}>{st.label}</span>
                </div>

                {/* Created */}
                <div className="hidden lg:block">
                  <div className="text-[11px] text-text-3">{formatDate(t.CreatedDate || t.created_at)}</div>
                  <div className="text-[10px] text-text-3/60">{t.CreatedBy || "-"}</div>
                </div>

                {/* Updated */}
                <div className="hidden lg:block">
                  <div className="text-[11px] text-text-3">{formatDate(t.LastUpdateDate || t.updated_at)}</div>
                  <div className="text-[10px] text-text-3/60">{t.LastUpdateBy || "-"}</div>
                </div>
              </div>
            );
          })
        )}

        {!loading && (
          <p className="text-[12px] text-text-3 px-6 py-4 border-t border-bg-3/50">
            Showing {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Overlays */}
      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}

      {/* Detail Modal */}
      {detailTx && <TransactionDetailModal tx={detailTx} onClose={() => setDetailTx(null)} />}

      {/* Edit Status Modal */}
      {editTx && <UpdateStatusModal tx={editTx} onClose={() => setEditTx(null)} onSave={handleUpdateStatus} />}

      {/* Export CSV Modal */}
      {showExportModal && (
        <ExportCSVModal
          transactions={transactions}
          onClose={() => setShowExportModal(false)}
          onExported={(msg) => showNotif(msg)}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete Transaction?"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.invoice_code}"? This action cannot be undone.` : ""}
        confirmText="Delete"
        variant="danger"
        icon={Trash2}
        isLoading={isDeleting}
      />

      {/* Toast */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[13px] font-semibold shadow-2xl border transition-all duration-300 ${
          notification.type === "error"
            ? "bg-bg-2 border-rose-500/30 text-rose-400"
            : "bg-bg-2 border-emerald-500/30 text-emerald-400"
        }`}>
          <Check size={15} />
          {notification.msg}
        </div>
      )}
    </>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, label, value }) {
  return (
    <div className="bg-bg-2 border border-bg-3 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>{icon}</div>
      <div>
        <div className="text-[12px] text-text-3 mb-0.5">{label}</div>
        <div className="text-[22px] font-bold tracking-tight leading-none">{value}</div>
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function TransactionDetailModal({ tx, onClose }) {
  const st = getStatusStyle(tx.transaction_status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-1/10 flex items-center justify-center">
              <Receipt size={18} className="text-primary-3" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold">{tx.invoice_code}</h2>
              <p className="text-[12px] text-text-3">{formatDate(tx.created_at)}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <DetailRow label="User" value={tx.user?.name || "-"} />
          <DetailRow label="Email" value={tx.user?.email || "-"} />
          <DetailRow label="Plan" value={tx.plan?.name || "-"} />
          <DetailRow label="Payment Method" value={tx.payment?.payment_method || "-"} />
          <DetailRow label="Amount" value={<span className="font-bold">{formatCurrency(tx.amount)}</span>} />
          <DetailRow label="Discount" value={formatCurrency(tx.discount_amount)} />
          <DetailRow label="Final Amount" value={<span className="text-emerald-400 font-bold">{formatCurrency(tx.final_amount)}</span>} />
          <DetailRow label="Status" value={
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${st.dot}`} />
              <span className={`text-[12px] font-semibold ${st.text}`}>{st.label}</span>
            </div>
          } />
          <DetailRow label="Notes" value={tx.notes || "-"} />
          <div className="border-t border-bg-3/50 my-2" />
          <DetailRow label="Created By" value={tx.CreatedBy || "-"} />
          <DetailRow label="Created Date" value={formatDate(tx.CreatedDate || tx.created_at)} />
          <DetailRow label="Last Update By" value={tx.LastUpdateBy || "-"} />
          <DetailRow label="Last Update Date" value={formatDate(tx.LastUpdateDate || tx.updated_at)} />
        </div>

        <button onClick={onClose}
          className="mt-8 w-full py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all">
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Update Status Modal ──────────────────────────────────────────────────────
function UpdateStatusModal({ tx, onClose, onSave }) {
  const [status, setStatus] = useState(tx.transaction_status);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    await onSave(tx.id, status);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[16px] font-bold">Update Status</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all">
            <X size={16} />
          </button>
        </div>

        <p className="text-[13px] text-text-3 mb-4">Invoice: <strong className="text-text-1">{tx.invoice_code}</strong></p>

        <label className="block text-[12px] font-semibold text-text-3 mb-1.5 uppercase tracking-wide">Transaction Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 outline-none focus:border-primary-1/50 transition-colors appearance-none">
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 disabled:opacity-40 text-white text-[13px] font-semibold transition-all shadow-[0_4px_20px_rgba(139,92,246,0.25)] flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Row ───────────────────────────────────────────────────────────────
function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-bg-3/50 last:border-0">
      <span className="text-[12px] text-text-3 uppercase tracking-wide font-semibold">{label}</span>
      <span className="text-[13px] text-text-1 text-right max-w-[60%]">{value}</span>
    </div>
  );
}
