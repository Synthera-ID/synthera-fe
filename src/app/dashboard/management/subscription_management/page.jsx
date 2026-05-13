"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BadgeCheck, Search, Download, MoreHorizontal,
  Check, AlertCircle, Loader2, X, Eye,
  Users, TrendingUp, RefreshCw, ShieldOff,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  active:   { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400",  label: "Active" },
  expired:  { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/20",    dot: "bg-rose-400",    label: "Expired" },
  pending:  { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20",   dot: "bg-amber-400",   label: "Pending" },
  cancelled:{ bg: "bg-bg-3",           text: "text-text-3",      border: "border-bg-3",           dot: "bg-text-3",      label: "Cancelled" },
};

const PLAN_STYLES = {
  pro:        { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20", label: "Pro" },
  enterprise: { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/20",   label: "Enterprise" },
  business:   { bg: "bg-amber-500/10",  text: "text-amber-400",  border: "border-amber-500/20",  label: "Business" },
  free:       { bg: "bg-bg-3",          text: "text-text-3",     border: "border-bg-3",          label: "Free" },
};

const STATUS_FILTERS = ["All", "Active", "Pending", "Expired", "Cancelled"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(str) {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function formatCurrency(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function getStatus(s)  { return STATUS_STYLES[s?.toLowerCase()] ?? STATUS_STYLES.pending; }
function getPlan(p)    { return PLAN_STYLES[p?.toLowerCase()]   ?? PLAN_STYLES.free; }

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-violet-500/20 text-violet-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-amber-500/20 text-amber-400",
  "bg-blue-500/20 text-blue-400",
  "bg-rose-500/20 text-rose-400",
  "bg-cyan-500/20 text-cyan-400",
];
function getAvatarColor(id) { return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length]; }

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_SUBS = [
  { id: 1, user_name: "Alice Johnson",  user_email: "alice@example.com",  plan: "pro",        status: "active",    amount: 29,  start_date: "2026-03-01", end_date: "2026-06-01", billing_cycle: "Monthly", created_at: "2026-03-01T10:00:00Z" },
  { id: 2, user_name: "Bob Smith",      user_email: "bob@example.com",    plan: "enterprise", status: "active",    amount: 99,  start_date: "2026-01-15", end_date: "2027-01-15", billing_cycle: "Yearly",  created_at: "2026-01-15T08:00:00Z" },
  { id: 3, user_name: "Carol White",    user_email: "carol@example.com",  plan: "business",   status: "pending",   amount: 49,  start_date: "2026-05-10", end_date: "2026-06-10", billing_cycle: "Monthly", created_at: "2026-05-10T14:00:00Z" },
  { id: 4, user_name: "Dan Brown",      user_email: "dan@example.com",    plan: "pro",        status: "expired",   amount: 29,  start_date: "2026-01-01", end_date: "2026-04-01", billing_cycle: "Monthly", created_at: "2026-01-01T09:00:00Z" },
  { id: 5, user_name: "Eva Green",      user_email: "eva@example.com",    plan: "free",       status: "cancelled", amount: 0,   start_date: "2025-12-01", end_date: "2026-01-01", billing_cycle: "-",       created_at: "2025-12-01T11:00:00Z" },
  { id: 6, user_name: "Frank Lee",      user_email: "frank@example.com",  plan: "enterprise", status: "active",    amount: 99,  start_date: "2026-02-01", end_date: "2027-02-01", billing_cycle: "Yearly",  created_at: "2026-02-01T07:00:00Z" },
  { id: 7, user_name: "Grace Kim",      user_email: "grace@example.com",  plan: "pro",        status: "active",    amount: 29,  start_date: "2026-04-01", end_date: "2026-07-01", billing_cycle: "Monthly", created_at: "2026-04-01T12:00:00Z" },
  { id: 8, user_name: "Henry Ford",     user_email: "henry@example.com",  plan: "business",   status: "expired",   amount: 49,  start_date: "2025-11-01", end_date: "2026-02-01", billing_cycle: "Monthly", created_at: "2025-11-01T09:30:00Z" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SubscriptionManagementPage() {
  const [subs, setSubs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilter]   = useState("All");
  const [activeMenu, setActiveMenu] = useState(null);
  const [detail, setDetail]         = useState(null);
  const [notification, setNotif]    = useState(null);

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      let data = MOCK_SUBS;
      if (search) {
        const q = search.toLowerCase();
        data = data.filter((s) =>
          s.user_name.toLowerCase().includes(q) ||
          s.user_email.toLowerCase().includes(q) ||
          s.plan.toLowerCase().includes(q)
        );
      }
      if (filterStatus !== "All")
        data = data.filter((s) => s.status.toLowerCase() === filterStatus.toLowerCase());
      setSubs(data);
    } catch {
      showNotif("Gagal memuat data subscription.", "error");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    const t = setTimeout(fetchSubs, 300);
    return () => clearTimeout(t);
  }, [fetchSubs]);

  // Stats
  const totalActive    = subs.filter((s) => s.status === "active").length;
  const totalPending   = subs.filter((s) => s.status === "pending").length;
  const totalExpired   = subs.filter((s) => s.status === "expired").length;
  const totalRevenue   = subs.filter((s) => s.status === "active").reduce((acc, s) => acc + s.amount, 0);

  function showNotif(msg, type = "success") {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  }

  function handleExport() {
    const rows = [
      ["User", "Email", "Plan", "Status", "Amount", "Billing", "Start Date", "End Date"],
      ...subs.map((s) => [
        s.user_name, s.user_email, s.plan, s.status,
        formatCurrency(s.amount), s.billing_cycle,
        formatDate(s.start_date), formatDate(s.end_date),
      ]),
    ];
    const csv  = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "subscriptions.csv"; a.click();
    URL.revokeObjectURL(url);
    showNotif("Export berhasil.");
  }

  return (
    <>
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold mb-1.5">Subscription Management</h1>
          <p className="text-text-3 text-[13px]">Monitor and manage all user subscriptions on your platform.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-semibold text-[13px] transition-all duration-200 shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.4)]"
        >
          <Download size={15} /> Export CSV
        </button>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<TrendingUp size={20} className="text-violet-400" />}  iconBg="bg-violet-500/20"  label="Monthly Revenue"  value={formatCurrency(totalRevenue)} />
        <StatCard icon={<BadgeCheck size={20} className="text-emerald-400" />} iconBg="bg-emerald-500/20" label="Active"           value={totalActive} />
        <StatCard icon={<RefreshCw  size={20} className="text-amber-400" />}   iconBg="bg-amber-500/20"   label="Pending"          value={totalPending} />
        <StatCard icon={<ShieldOff  size={20} className="text-rose-400" />}    iconBg="bg-rose-500/20"    label="Expired"          value={totalExpired} />
      </div>

      {/* Filters */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl px-6 py-5 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search by name, email or plan…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
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
        <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_44px] gap-4 px-6 py-3.5 bg-bg-3/30 text-[11px] font-bold text-text-3 uppercase tracking-widest border-b border-bg-3">
          <span>User</span>
          <span>Plan</span>
          <span>Status</span>
          <span>Amount</span>
          <span>Start</span>
          <span>Expires</span>
          <span />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 size={24} className="animate-spin text-primary-3" />
            <span className="text-text-3 text-[13px]">Loading subscriptions...</span>
          </div>
        ) : subs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-3">
            <AlertCircle size={36} className="opacity-40" />
            <p className="text-[14px]">No subscriptions found.</p>
          </div>
        ) : (
          subs.map((s, i) => {
            const st   = getStatus(s.status);
            const plan = getPlan(s.plan);
            return (
              <div
                key={s.id}
                className={`grid grid-cols-[1fr_44px] lg:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_44px] gap-4 px-6 py-4 items-center hover:bg-bg-3/20 transition-colors relative ${
                  i < subs.length - 1 ? "border-b border-bg-3/50" : ""
                }`}
              >
                {/* User */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[12px] shrink-0 ${getAvatarColor(s.id)}`}>
                    {getInitials(s.user_name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-text-1 truncate">{s.user_name}</div>
                    <div className="text-[11px] text-text-3 truncate">{s.user_email}</div>
                  </div>
                </div>

                {/* Plan */}
                <div className="hidden lg:block">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${plan.bg} ${plan.text} ${plan.border}`}>
                    {plan.label}
                  </span>
                </div>

                {/* Status */}
                <div className="hidden lg:flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                  <span className={`text-[12px] font-semibold ${st.text}`}>{st.label}</span>
                </div>

                {/* Amount */}
                <div className="hidden lg:block text-[13px] font-bold text-text-1">
                  {formatCurrency(s.amount)}
                </div>

                {/* Start */}
                <div className="hidden lg:block text-[13px] text-text-2">
                  {formatDate(s.start_date)}
                </div>

                {/* Expires */}
                <div className="hidden lg:block text-[13px] text-text-2">
                  {formatDate(s.end_date)}
                </div>

                {/* Action */}
                <div className="relative flex justify-center">
                  <button
                    onClick={() => setActiveMenu(activeMenu === s.id ? null : s.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:bg-bg-3 hover:text-text-1 transition-all"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {activeMenu === s.id && (
                    <div className="absolute right-0 top-10 z-50 w-44 bg-bg-2 border border-bg-3 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                      <button
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                        onClick={() => { setDetail(s); setActiveMenu(null); }}
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
            Showing {subs.length} subscription{subs.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Close dropdown on outside click */}
      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}

      {/* Detail Modal */}
      {detail && <SubscriptionDetailModal sub={detail} onClose={() => setDetail(null)} />}

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
function SubscriptionDetailModal({ sub, onClose }) {
  const st   = getStatus(sub.status);
  const plan = getPlan(sub.plan);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[13px] ${getAvatarColor(sub.id)}`}>
              {getInitials(sub.user_name)}
            </div>
            <div>
              <h2 className="text-[16px] font-bold">{sub.user_name}</h2>
              <p className="text-[12px] text-text-3">{sub.user_email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <DetailRow label="Plan" value={
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${plan.bg} ${plan.text} ${plan.border}`}>
              {plan.label}
            </span>
          } />
          <DetailRow label="Status" value={
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${st.dot}`} />
              <span className={`text-[12px] font-semibold ${st.text}`}>{st.label}</span>
            </div>
          } />
          <DetailRow label="Amount"        value={<span className="text-emerald-400 font-bold">{formatCurrency(sub.amount)}</span>} />
          <DetailRow label="Billing Cycle" value={sub.billing_cycle} />
          <DetailRow label="Start Date"    value={formatDate(sub.start_date)} />
          <DetailRow label="Expiry Date"   value={formatDate(sub.end_date)} />
          <DetailRow label="Registered"    value={formatDate(sub.created_at)} />
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
