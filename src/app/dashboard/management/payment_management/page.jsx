"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Wallet, Search, Download, MoreHorizontal,
  Check, AlertCircle, Loader2, X, Eye,
  CreditCard, TrendingUp, Clock, XCircle,
} from "lucide-react";
import apiFetch from "@/utils/apiFetch";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  paid:    { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", label: "Paid" },
  pending: { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20",   label: "Pending" },
  failed:  { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/20",     label: "Failed" },
  refunded:{ bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20",     label: "Refunded" },
};

const METHOD_STYLES = {
  credit_card:   { label: "Credit Card",   color: "text-violet-400" },
  bank_transfer: { label: "Bank Transfer", color: "text-blue-400" },
  e_wallet:      { label: "E-Wallet",      color: "text-emerald-400" },
  other:         { label: "Other",         color: "text-text-3" },
};

const STATUS_FILTERS = ["All", "Paid", "Pending", "Failed", "Refunded"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(str) {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function formatCurrency(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function getStatusStyle(status) {
  return STATUS_STYLES[status?.toLowerCase()] ?? STATUS_STYLES.pending;
}

function getMethodLabel(method) {
  return METHOD_STYLES[method?.toLowerCase()] ?? METHOD_STYLES.other;
}

// ─── Mock data (replace with real API call) ───────────────────────────────────
const MOCK_PAYMENTS = [
  { id: 1, invoice_id: "INV-2026-0021", user_name: "Alice Johnson", user_email: "alice@example.com", amount: 29, method: "credit_card", status: "paid", created_at: "2026-04-15T10:22:00Z", description: "Pro Plan - Monthly" },
  { id: 2, invoice_id: "INV-2026-0020", user_name: "Bob Smith",    user_email: "bob@example.com",   amount: 99, method: "bank_transfer", status: "paid", created_at: "2026-04-10T08:00:00Z", description: "Enterprise Plan - Monthly" },
  { id: 3, invoice_id: "INV-2026-0019", user_name: "Carol White",  user_email: "carol@example.com", amount: 29, method: "e_wallet",      status: "pending", created_at: "2026-04-09T14:30:00Z", description: "Pro Plan - Monthly" },
  { id: 4, invoice_id: "INV-2026-0018", user_name: "Dan Brown",    user_email: "dan@example.com",   amount: 29, method: "credit_card",   status: "failed",  created_at: "2026-04-08T09:15:00Z", description: "Pro Plan - Monthly" },
  { id: 5, invoice_id: "INV-2026-0017", user_name: "Eva Green",    user_email: "eva@example.com",   amount: 49, method: "bank_transfer", status: "refunded",created_at: "2026-04-05T11:00:00Z", description: "Business Plan - Monthly" },
  { id: 6, invoice_id: "INV-2026-0016", user_name: "Frank Lee",    user_email: "frank@example.com", amount: 99, method: "credit_card",   status: "paid",    created_at: "2026-04-01T07:45:00Z", description: "Enterprise Plan - Monthly" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PaymentManagementPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeMenu, setActiveMenu] = useState(null);
  const [detailPayment, setDetailPayment] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch (swap with real API when ready)
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      // const res = await apiFetch.get(`/admin/payments?search=${search}&status=${filterStatus}`);
      // setPayments(res.data || []);
      await new Promise((r) => setTimeout(r, 500)); // simulate network
      let data = MOCK_PAYMENTS;
      if (search) data = data.filter((p) =>
        p.invoice_id.toLowerCase().includes(search.toLowerCase()) ||
        p.user_name.toLowerCase().includes(search.toLowerCase()) ||
        p.user_email.toLowerCase().includes(search.toLowerCase())
      );
      if (filterStatus !== "All") data = data.filter((p) => p.status.toLowerCase() === filterStatus.toLowerCase());
      setPayments(data);
    } catch {
      showNotification("Gagal memuat data pembayaran.", "error");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    const t = setTimeout(fetchPayments, 300);
    return () => clearTimeout(t);
  }, [fetchPayments]);

  // Stats
  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPaid    = payments.filter((p) => p.status === "paid").length;
  const totalPending = payments.filter((p) => p.status === "pending").length;
  const totalFailed  = payments.filter((p) => p.status === "failed").length;

  function showNotification(msg, type = "success") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }

  function handleExport() {
    const rows = [
      ["Invoice ID", "User", "Email", "Amount", "Method", "Status", "Date", "Description"],
      ...payments.map((p) => [
        p.invoice_id, p.user_name, p.user_email,
        formatCurrency(p.amount), p.method, p.status,
        formatDate(p.created_at), p.description,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "payments.csv"; a.click();
    URL.revokeObjectURL(url);
    showNotification("Export berhasil.");
  }

  return (
    <>
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold mb-1.5">Payment Management</h1>
          <p className="text-text-3 text-[13px]">Monitor and manage all payment transactions on your platform.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-semibold text-[13px] transition-all duration-200 shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.4)]"
        >
          <Download size={15} />
          Export CSV
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
      <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden">
        {/* Table head */}
        <div className="hidden md:grid grid-cols-[1.4fr_1.8fr_1fr_1fr_1fr_44px] gap-4 px-6 py-3.5 bg-bg-3/30 text-[11px] font-bold text-text-3 uppercase tracking-widest border-b border-bg-3">
          <span>Invoice</span>
          <span>User</span>
          <span>Amount</span>
          <span>Method</span>
          <span>Status</span>
          <span />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 size={24} className="animate-spin text-primary-3" />
            <span className="text-text-3 text-[13px]">Loading payments...</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-3">
            <AlertCircle size={36} className="opacity-40" />
            <p className="text-[14px]">No payments found.</p>
          </div>
        ) : (
          payments.map((p, i) => {
            const st = getStatusStyle(p.status);
            const mt = getMethodLabel(p.method);
            return (
              <div
                key={p.id}
                className={`grid grid-cols-[1fr_44px] md:grid-cols-[1.4fr_1.8fr_1fr_1fr_1fr_44px] gap-4 px-6 py-4 items-center hover:bg-bg-3/20 transition-colors relative ${
                  i < payments.length - 1 ? "border-b border-bg-3/50" : ""
                }`}
              >
                {/* Invoice + date */}
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-text-1 truncate">{p.invoice_id}</div>
                  <div className="text-[11px] text-text-3 mt-0.5">{formatDate(p.created_at)}</div>
                </div>

                {/* User — hidden on mobile */}
                <div className="hidden md:flex flex-col min-w-0">
                  <span className="text-[13px] font-medium text-text-1 truncate">{p.user_name}</span>
                  <span className="text-[11px] text-text-3 truncate">{p.user_email}</span>
                </div>

                {/* Amount */}
                <div className="hidden md:block text-[13px] font-bold text-text-1">
                  {formatCurrency(p.amount)}
                </div>

                {/* Method */}
                <div className={`hidden md:block text-[12px] font-semibold ${mt.color}`}>
                  {mt.label}
                </div>

                {/* Status badge */}
                <div className="hidden md:block">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${st.bg} ${st.text} ${st.border}`}>
                    {st.label}
                  </span>
                </div>

                {/* Action */}
                <div className="relative flex justify-center">
                  <button
                    onClick={() => setActiveMenu(activeMenu === p.id ? null : p.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:bg-bg-3 hover:text-text-1 transition-all"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {activeMenu === p.id && (
                    <div className="absolute right-0 top-10 z-50 w-44 bg-bg-2 border border-bg-3 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                      <button
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                        onClick={() => { setDetailPayment(p); setActiveMenu(null); }}
                      >
                        <Eye size={14} className="text-primary-3" /> View Detail
                      </button>
                      <button
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                        onClick={() => { handleExport(); setActiveMenu(null); }}
                      >
                        <Download size={14} className="text-emerald-400" /> Export Row
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {!loading && (
          <p className="text-[12px] text-text-3 px-6 py-4 border-t border-bg-3/50">
            Showing {payments.length} payment{payments.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Close dropdown on outside click */}
      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}

      {/* Detail Modal */}
      {detailPayment && (
        <PaymentDetailModal payment={detailPayment} onClose={() => setDetailPayment(null)} />
      )}

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
function PaymentDetailModal({ payment, onClose }) {
  const st = getStatusStyle(payment.status);
  const mt = getMethodLabel(payment.method);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-1/10 flex items-center justify-center">
              <Wallet size={18} className="text-primary-3" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold">{payment.invoice_id}</h2>
              <p className="text-[12px] text-text-3">{formatDate(payment.created_at)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Detail rows */}
        <div className="space-y-3">
          <DetailRow label="User" value={payment.user_name} />
          <DetailRow label="Email" value={payment.user_email} />
          <DetailRow label="Description" value={payment.description} />
          <DetailRow label="Amount" value={
            <span className="text-emerald-400 font-bold">{formatCurrency(payment.amount)}</span>
          } />
          <DetailRow label="Method" value={
            <span className={`font-semibold ${mt.color}`}>{mt.label}</span>
          } />
          <DetailRow label="Status" value={
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${st.bg} ${st.text} ${st.border}`}>
              {st.label}
            </span>
          } />
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-bg-3/50 last:border-0">
      <span className="text-[12px] text-text-3 uppercase tracking-wide font-semibold">{label}</span>
      <span className="text-[13px] text-text-1">{value}</span>
    </div>
  );
}
