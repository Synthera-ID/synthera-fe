"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp, Users, CreditCard, Receipt,
  ArrowUpRight, ArrowDownRight, Download, Loader2,
  AlertCircle, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import apiFetch from "@/utils/apiFetch";

// ─── Constants ────────────────────────────────────────────────────────────────
const PERIODS = ["7D", "30D", "90D", "All"];

const TX_STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "#FBBF24", bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.25)" },
  paid:      { label: "Paid",      color: "#34D399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.25)" },
  completed: { label: "Completed", color: "#60A5FA", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.25)" },
  failed:    { label: "Failed",    color: "#F87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.25)" },
  refunded:  { label: "Refunded",  color: "#A78BFA", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.25)" },
};

const PLAN_TIER_CONFIG = {
  basic:     { color: "#6B7280", bar: "bg-bg-4" },
  pro:       { color: "#A78BFA", bar: "bg-primary-1" },
  exclusive: { color: "#FBBF24", bar: "bg-amber-400" },
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(val) {
  if (val == null || isNaN(val)) return "Rp 0";
  if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1).replace(".", ",")} Jt`;
  if (val >= 1_000) return `Rp ${(val / 1_000).toFixed(0)}k`;
  return `Rp ${val}`;
}

function formatCurrencyFull(val) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val ?? 0);
}

function formatDateShort(str) {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

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

function filterByPeriod(arr, period, dateKey = "created_at") {
  if (period === "All") return arr;
  const days = period === "7D" ? 7 : period === "30D" ? 30 : 90;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return arr.filter((item) => item[dateKey] && new Date(item[dateKey]) >= cutoff);
}

// ─── Revenue per bulan (6 bulan terakhir) ────────────────────────────────────
function getMonthlyRevenue(transactions) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_LABELS[d.getMonth()], total: 0 };
  });

  transactions
    .filter((t) => t.transaction_status === "paid" || t.transaction_status === "completed")
    .forEach((t) => {
      const d = new Date(t.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const found = months.find((m) => m.key === key);
      if (found) found.total += Number(t.final_amount || 0);
    });

  return months;
}

// ─── User registrasi per bulan (6 bulan) ─────────────────────────────────────
function getMonthlyUsers(users) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_LABELS[d.getMonth()], count: 0 };
  });

  users.forEach((u) => {
    const d = new Date(u.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const found = months.find((m) => m.key === key);
    if (found) found.count++;
  });

  return months;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [period, setPeriod] = useState("30D");
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [txRes, userRes, memRes] = await Promise.all([
        apiFetch.get("/admin/transactions?per_page=500"),
        apiFetch.get("/admin/users?per_page=500"),
        apiFetch.get("/admin/memberships?per_page=500"),
      ]);
      setTransactions(txRes?.data || []);
      setUsers(userRes?.data || []);
      setMemberships(memRes?.data || []);
    } catch {
      setError("Gagal memuat data reports. Pastikan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Filtered data ──
  const filteredTx    = filterByPeriod(transactions, period);
  const filteredUsers = filterByPeriod(users, period);

  // ── KPI ──
  const totalRevenue = filteredTx
    .filter((t) => t.transaction_status === "paid" || t.transaction_status === "completed")
    .reduce((s, t) => s + Number(t.final_amount || 0), 0);

  const totalUsers = users.length;
  const activeMemberships = memberships.filter((m) => m.status === "active").length;
  const totalTx = filteredTx.length;
  const pendingTx = filteredTx.filter((t) => t.transaction_status === "pending").length;

  // ── Status breakdown ──
  const statusBreakdown = Object.keys(TX_STATUS_CONFIG).map((key) => ({
    key,
    ...TX_STATUS_CONFIG[key],
    count: filteredTx.filter((t) => t.transaction_status === key).length,
  }));
  const totalTxForDonut = statusBreakdown.reduce((s, x) => s + x.count, 0) || 1;

  // Donut conic-gradient
  let accumulated = 0;
  const conicParts = statusBreakdown
    .filter((s) => s.count > 0)
    .map((s) => {
      const deg = (s.count / totalTxForDonut) * 360;
      const part = `${s.color} ${accumulated}deg ${accumulated + deg}deg`;
      accumulated += deg;
      return part;
    });
  const conicGradient = conicParts.length
    ? `conic-gradient(${conicParts.join(", ")})`
    : `conic-gradient(var(--color-bg-3) 0deg 360deg)`;

  // ── Plan distribution ──
  const planCounts = memberships.reduce((acc, m) => {
    const tier = m.subscription?.tier?.toLowerCase() || "basic";
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {});
  const totalMemForPlan = memberships.length || 1;

  // ── Payment method breakdown ──
  const pmBreakdown = filteredTx
    .filter((t) => t.transaction_status === "paid" || t.transaction_status === "completed")
    .reduce((acc, t) => {
      const method = t.payment?.payment_method?.toUpperCase() || "OTHER";
      const isQris = method.includes("SP") || method.includes("QRIS");
      const key = isQris ? "QRIS" : "Bank Transfer";
      if (!acc[key]) acc[key] = { count: 0, total: 0 };
      acc[key].count++;
      acc[key].total += Number(t.final_amount || 0);
      return acc;
    }, {});
  const totalPmCount = Object.values(pmBreakdown).reduce((s, v) => s + v.count, 0) || 1;

  // ── Charts data ──
  const monthlyRevenue = getMonthlyRevenue(transactions);
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.total), 1);

  const monthlyUsers = getMonthlyUsers(users);
  const maxUsersMonth = Math.max(...monthlyUsers.map((m) => m.count), 1);

  // ── Recent transactions (5 last) ──
  const recentTx = [...filteredTx]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // ── Export CSV ──
  function handleExportCSV() {
    const header = ["Invoice", "User", "Email", "Plan", "Amount", "Status", "Date", "PaymentMethod"];
    const rows = filteredTx.map((t) => [
      t.invoice_code ?? "-",
      t.user?.name ?? "-",
      t.user?.email ?? "-",
      t.plan?.name ?? "-",
      t.final_amount ?? 0,
      t.transaction_status ?? "-",
      t.created_at ? new Date(t.created_at).toISOString().slice(0, 10) : "-",
      t.payment?.payment_method ?? "-",
    ]);
    const escape = (v) => {
      const s = String(v);
      return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [header, ...rows].map((r) => r.map(escape).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `synthera_report_${period}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Loading / Error ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3">
        <Loader2 size={26} className="animate-spin text-primary-3" />
        <span className="text-text-3 text-[14px]">Memuat data reports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle size={36} className="text-rose-400 opacity-70" />
        <p className="text-[14px] text-rose-400">{error}</p>
        <button
          onClick={fetchAll}
          className="px-5 py-2.5 rounded-xl border border-bg-3 text-[13px] text-text-1 hover:bg-bg-3 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ── Header ── */}
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold mb-1.5">Reports &amp; Analytics</h1>
          <p className="text-text-3 text-[13px]">Comprehensive overview of platform performance and business metrics.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Period Pills */}
          <div className="flex items-center gap-1 bg-bg-2 border border-bg-3 rounded-xl p-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 ${
                  period === p
                    ? "bg-primary-1/20 text-primary-3"
                    : "text-text-3 hover:text-text-2 hover:bg-bg-3"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          {/* Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-semibold text-[13px] transition-all duration-200 shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.4)]"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </header>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <StatCard
          icon={<TrendingUp size={19} className="text-emerald-400" />}
          iconBg="bg-emerald-500/15"
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          sub={`${filteredTx.filter((t) => t.transaction_status === "paid" || t.transaction_status === "completed").length} paid transactions`}
          trend="up"
        />
        <StatCard
          icon={<Users size={19} className="text-blue-400" />}
          iconBg="bg-blue-500/15"
          label="Total Users"
          value={totalUsers.toLocaleString("id-ID")}
          sub={`${filteredUsers.length} registered this period`}
          trend="up"
        />
        <StatCard
          icon={<CreditCard size={19} className="text-primary-3" />}
          iconBg="bg-primary-1/15"
          label="Active Memberships"
          value={activeMemberships.toLocaleString("id-ID")}
          sub={`of ${memberships.length} total memberships`}
          trend="up"
        />
        <StatCard
          icon={<Receipt size={19} className="text-amber-400" />}
          iconBg="bg-amber-500/15"
          label="Total Transactions"
          value={totalTx.toLocaleString("id-ID")}
          sub={`${pendingTx} pending`}
          trend={pendingTx > 10 ? "down" : "up"}
        />
      </div>

      {/* ── Row 2: Revenue Chart + Status Donut ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-5 mb-5">

        {/* Revenue Bar Chart */}
        <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[14px] font-bold">Revenue Overview</h2>
              <p className="text-[12px] text-text-3 mt-0.5">Monthly revenue — paid &amp; completed</p>
            </div>
            <span className="text-[11px] text-text-3 font-semibold uppercase tracking-wider">6 Months</span>
          </div>
          <div className="flex items-end gap-2.5 h-[160px]">
            {monthlyRevenue.map((m, i) => {
              const pct = maxRevenue > 0 ? (m.total / maxRevenue) * 100 : 0;
              const isMax = m.total === Math.max(...monthlyRevenue.map((x) => x.total));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div
                    className="w-full relative rounded-t-[5px] overflow-visible transition-all duration-300"
                    style={{ height: `${Math.max(pct, 2)}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-bg-4 border border-bg-3 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      {formatCurrencyFull(m.total)}
                    </div>
                    <div
                      className={`w-full h-full rounded-t-[5px] transition-all duration-300 ${
                        isMax
                          ? "bg-gradient-to-t from-primary-2 to-primary-4 shadow-[0_0_16px_rgba(139,92,246,0.35)] group-hover:shadow-[0_0_24px_rgba(139,92,246,0.5)]"
                          : "bg-gradient-to-t from-primary-2 to-primary-3 group-hover:from-primary-1 group-hover:to-primary-4"
                      }`}
                    />
                  </div>
                  <span className="text-[11px] text-text-3 font-medium">{m.label}</span>
                </div>
              );
            })}
          </div>
          <div className="h-px bg-bg-3 mt-2 mb-3" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-tr from-primary-2 to-primary-3" />
            <span className="text-[11px] text-text-3">Monthly Revenue (IDR) · Hover for detail</span>
          </div>
        </div>

        {/* Transaction Status Donut */}
        <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-[14px] font-bold">Transaction Status</h2>
            <p className="text-[12px] text-text-3 mt-0.5">Breakdown by status this period</p>
          </div>
          <div className="flex items-center gap-6">
            {/* Donut */}
            <div className="relative flex-shrink-0 w-[120px] h-[120px]">
              <div
                className="w-full h-full rounded-full"
                style={{ background: conicGradient }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-[76px] h-[76px] rounded-full bg-bg-2 flex flex-col items-center justify-center"
                >
                  <span className="text-[18px] font-bold leading-none">{totalTxForDonut}</span>
                  <span className="text-[10px] text-text-3 mt-0.5">Total</span>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 flex flex-col gap-2.5">
              {statusBreakdown.map((s) => (
                <div key={s.key} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-[12px] text-text-2 flex-1">{s.label}</span>
                  <span className="text-[12px] font-bold" style={{ color: s.color }}>{s.count}</span>
                  <span className="text-[11px] text-text-3 w-8 text-right">
                    {totalTxForDonut > 1 ? `${((s.count / totalTxForDonut) * 100).toFixed(0)}%` : "0%"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Row 3: Recent Transactions + Plan Distribution + User Growth ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-5 mb-5">

        {/* Recent Transactions */}
        <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[14px] font-bold">Recent Transactions</h2>
              <p className="text-[12px] text-text-3 mt-0.5">Latest 5 transactions this period</p>
            </div>
            <Link
              href="/dashboard/management/transaction_management"
              className="flex items-center gap-1 text-[12px] text-primary-3 font-semibold hover:text-primary-4 transition-colors"
            >
              View all <ChevronRight size={13} />
            </Link>
          </div>

          {recentTx.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-text-3">
              <AlertCircle size={28} className="opacity-40" />
              <p className="text-[13px]">No transactions this period.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {/* Header */}
              <div className="grid grid-cols-[1fr_1fr_0.7fr_0.9fr_0.9fr] gap-3 px-3 pb-2.5 text-[10px] font-bold text-text-3 uppercase tracking-widest border-b border-bg-3">
                <span>Invoice</span>
                <span>User</span>
                <span>Plan</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              {recentTx.map((t, i) => {
                const st = TX_STATUS_CONFIG[t.transaction_status] ?? TX_STATUS_CONFIG.pending;
                return (
                  <div
                    key={t.id}
                    className={`grid grid-cols-[1fr_1fr_0.7fr_0.9fr_0.9fr] gap-3 px-3 py-3 items-center hover:bg-bg-3/20 transition-colors ${
                      i < recentTx.length - 1 ? "border-b border-bg-3/50" : ""
                    }`}
                  >
                    <div>
                      <div className="text-[12px] font-mono text-text-2 truncate">{t.invoice_code ?? "-"}</div>
                      <div className="text-[10px] text-text-3">{formatDateShort(t.created_at)}</div>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${getAvatarColor(t.user_id)}`}>
                        {getInitials(t.user?.name)}
                      </div>
                      <span className="text-[12px] truncate">{t.user?.name ?? "-"}</span>
                    </div>
                    <span className="text-[12px] text-text-2 capitalize truncate">{t.plan?.name ?? "-"}</span>
                    <span className="text-[12px] font-bold">{formatCurrencyFull(t.final_amount)}</span>
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                      style={{ color: st.color, background: st.bg, borderColor: st.border }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: st.color }} />
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">

          {/* Plan Distribution */}
          <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6">
            <div className="mb-5">
              <h2 className="text-[14px] font-bold">Plan Distribution</h2>
              <p className="text-[12px] text-text-3 mt-0.5">Active memberships by tier</p>
            </div>
            {memberships.length === 0 ? (
              <p className="text-[13px] text-text-3 text-center py-4">No membership data.</p>
            ) : (
              <div className="space-y-4">
                {["exclusive", "pro", "basic"].map((tier) => {
                  const count = planCounts[tier] || 0;
                  const pct = ((count / totalMemForPlan) * 100).toFixed(0);
                  const cfg = PLAN_TIER_CONFIG[tier];
                  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
                  return (
                    <div key={tier}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] font-semibold" style={{ color: cfg.color }}>{tierLabel}</span>
                        <span className="text-[12px] text-text-3">{count} users · {pct}%</span>
                      </div>
                      <div className="h-[7px] bg-bg-3 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Growth mini chart */}
          <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6 flex-1">
            <div className="mb-5">
              <h2 className="text-[14px] font-bold">User Growth</h2>
              <p className="text-[12px] text-text-3 mt-0.5">New registrations per month</p>
            </div>
            <div className="flex items-end gap-2 h-[90px]">
              {monthlyUsers.map((m, i) => {
                const pct = maxUsersMonth > 0 ? (m.count / maxUsersMonth) * 100 : 0;
                const isMax = m.count === Math.max(...monthlyUsers.map((x) => x.count));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full relative" style={{ height: `${Math.max(pct, 3)}%` }}>
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-bg-4 border border-bg-3 px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        {m.count} users
                      </div>
                      <div
                        className={`w-full h-full rounded-t-[4px] ${
                          isMax
                            ? "bg-gradient-to-t from-primary-2 to-primary-4"
                            : "bg-primary-1/40 group-hover:bg-primary-1/70"
                        } transition-all duration-200`}
                      />
                    </div>
                    <span className="text-[10px] text-text-3">{m.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-text-3">Total new users (6 mo)</span>
              <span className="text-[15px] font-bold text-primary-3">
                +{monthlyUsers.reduce((s, m) => s + m.count, 0)}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Row 4: Payment Method ── */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[14px] font-bold">Payment Method Breakdown</h2>
            <p className="text-[12px] text-text-3 mt-0.5">Distribution of paid/completed transactions</p>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-text-3">Total Volume</div>
            <div className="text-[15px] font-bold text-primary-3">{formatCurrencyFull(totalRevenue)}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(pmBreakdown).length === 0 ? (
            <p className="text-[13px] text-text-3">Tidak ada data pembayaran.</p>
          ) : (
            Object.entries(pmBreakdown).map(([method, data]) => {
              const pct = ((data.count / totalPmCount) * 100).toFixed(0);
              const isQris = method === "QRIS";
              return (
                <div key={method}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold">{method}</span>
                    <div className="text-right">
                      <span className="text-[13px] font-bold" style={{ color: isQris ? "#60A5FA" : "#34D399" }}>
                        {pct}%
                      </span>
                      <span className="text-[11px] text-text-3 ml-2">{data.count} tx</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-bg-3 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: isQris
                          ? "linear-gradient(90deg, #3B82F6, #60A5FA)"
                          : "linear-gradient(90deg, #059669, #34D399)",
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-text-3">{formatCurrencyFull(data.total)} total revenue</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, label, value, sub, trend }) {
  return (
    <div className="bg-bg-2 border border-bg-3 rounded-2xl p-5 flex items-start gap-4 hover:border-primary-1/20 transition-all duration-200">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] text-text-3 mb-0.5">{label}</div>
        <div className="text-[22px] font-bold tracking-tight leading-none truncate">{value}</div>
        {sub && (
          <div className="flex items-center gap-1 mt-1.5">
            {trend === "up"
              ? <ArrowUpRight size={12} className="text-emerald-400 shrink-0" />
              : <ArrowDownRight size={12} className="text-rose-400 shrink-0" />
            }
            <span className="text-[11px] text-text-3 truncate">{sub}</span>
          </div>
        )}
      </div>
    </div>
  );
}
