"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Box, Zap, Grid, Clock, CreditCard, Key, Settings, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import apiFetch from "@/utils/apiFetch";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatRupiah(val) {
  if (!val) return "Rp 0";
  const n = Number(val);
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace(".", ",")} Jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}k`;
  return `Rp ${n}`;
}

function formatDate(str) {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [apiUsageToday, setApiUsageToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const txRes = await apiFetch.get("/transactions?per_page=50");
        const txList = txRes?.data || [];
        setTransactions(txList);

        // Hitung API usage hari ini dari log jika ada, atau fallback ke 0
        const today = new Date().toDateString();
        const todayTx = txList.filter(
          (t) => new Date(t.created_at).toDateString() === today
        ).length;
        setApiUsageToday(todayTx);
      } catch {
        // Gagal fetch → tampilkan 0
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Derived stats
  const membership = user?.membership;
  const subscription = membership?.subscription;
  const planName = subscription?.name ?? "Free";
  const expiredAt = membership?.expired_at;
  const planPrice = subscription?.price ?? 0;

  // Hitung total content yang paid/completed (pakai transactions)
  const completedTx = transactions.filter(
    (t) => t.transaction_status === "paid" || t.transaction_status === "completed"
  ).length;

  // 7-day usage bar chart dari transactions (per hari, 7 hari terakhir)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      label: d.toLocaleDateString("id-ID", { weekday: "short" }),
      date: d.toDateString(),
      count: 0,
    };
  });

  transactions.forEach((t) => {
    const dateStr = new Date(t.created_at).toDateString();
    const day = weekDays.find((d) => d.date === dateStr);
    if (day) day.count++;
  });

  const maxCount = Math.max(...weekDays.map((d) => d.count), 1);

  return (
    <>
      <header className="mb-10">
        <h1 className="text-[28px] font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-text-2 text-sm">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10 text-left">
        <StatCard
          icon={<Box size={22} className="text-primary-1" />}
          iconBgClass="bg-primary-1/10"
          label="Current Plan"
          value={loading ? "—" : planName}
          subLabel={membership ? "Active" : "No Plan"}
          subLabelColor={membership ? "text-emerald-500" : "text-text-3"}
        />
        <StatCard
          icon={<Zap size={22} className="text-emerald-500" />}
          iconBgClass="bg-emerald-500/10"
          label="Transactions Today"
          value={loading ? "—" : apiUsageToday.toString()}
          subLabel={loading ? "Loading..." : `${transactions.length} total`}
          subLabelColor="text-emerald-500"
        />
        <StatCard
          icon={<Grid size={22} className="text-[#3b82f6]" />}
          iconBgClass="bg-blue-500/10"
          label="Completed Transactions"
          value={loading ? "—" : completedTx.toString()}
          subLabel="Paid & completed"
          subLabelColor="text-emerald-500"
        />
        <StatCard
          icon={<Clock size={22} className="text-[#f59e0b]" />}
          iconBgClass="bg-orange-500/10"
          label="Next Billing"
          value={loading ? "—" : (expiredAt ? formatDate(expiredAt) : "No Plan")}
          subLabel={loading ? "Loading..." : (planPrice ? formatRupiah(planPrice) + "/mo" : "—")}
          subLabelColor="text-text-3"
        />
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full items-start">
        {/* Chart Section — real 7-day transaction activity */}
        <div className="bg-bg-2 border border-bg-3 rounded-3xl p-7 flex flex-col w-full h-[320px]">
          <h2 className="text-[16px] font-bold mb-2 text-text-1">Transaction Activity (7 days)</h2>
          <p className="text-[12px] text-text-3 mb-6">Your transactions in the last 7 days</p>
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-primary-3 border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-between px-1 gap-1 pb-0 mt-2 relative h-full">
              {weekDays.map((day, i) => {
                const pct = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                return (
                  <div key={i} className="flex flex-col items-center flex-1 group h-full justify-end px-1.5 basis-0">
                    <div
                      className="relative w-full flex items-end justify-center rounded-t-[4px] overflow-visible"
                      style={{ height: `${Math.max(pct, 3)}%` }}
                    >
                      {/* Tooltip */}
                      <span className="absolute -top-7 text-[11px] text-text-3 font-semibold capitalize pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.count} tx
                      </span>
                      <div className="w-full h-full bg-gradient-to-t from-primary-2 to-primary-3 rounded-t-[4px] transition-all duration-700 ease-in-out group-hover:from-primary-1 group-hover:to-primary-4 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
                    </div>
                    <span className="text-[11px] text-text-3 mt-2">{day.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-bg-2 border border-bg-3 rounded-3xl p-7 flex flex-col w-full h-[320px]">
          <h2 className="text-[16px] font-bold mb-6 text-text-1">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionButton icon={Key} label="View API Keys" href="/dashboard/api_keys" />
            <ActionButton icon={CreditCard} label="Manage Plan" href="/dashboard/subscription" />
            <ActionButton icon={Grid} label="Browse Content" href="/dashboard/course" />
            <ActionButton icon={TrendingUp} label="Reports" href="/dashboard/management/reports" />
          </div>

          {/* Current plan quick info */}
          {!loading && subscription && (
            <div className="mt-auto pt-5 border-t border-bg-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-text-3">Active Plan</p>
                <p className="text-[13px] font-bold capitalize">{planName}</p>
              </div>
              <Link
                href="/dashboard/subscription"
                className="text-[12px] text-primary-3 font-semibold hover:text-primary-4 transition-colors"
              >
                Manage →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, subLabel, subLabelColor, iconBgClass }) {
  return (
    <div className="bg-bg-2 border border-bg-3 rounded-[20px] p-6 flex flex-col justify-between relative group hover:border-primary-1/20 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 min-h-[140px]">
      <div className="flex items-center gap-4 mb-3">
        <div className={`w-[46px] h-[46px] flex items-center justify-center rounded-xl ${iconBgClass}`}>{icon}</div>
        <div className="text-[14px] text-text-2 font-medium">{label}</div>
      </div>
      <div>
        <div className="text-[28px] font-bold text-text-1 leading-none tracking-tight">{value}</div>
        <div className={`text-[13px] font-semibold mt-2.5 ${subLabelColor}`}>{subLabel}</div>
      </div>
    </div>
  );
}

// ─── ActionButton ─────────────────────────────────────────────────────────────
function ActionButton({ icon: Icon, label, href }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center gap-3 h-[56px] bg-transparent border border-primary-1/20 rounded-2xl hover:bg-primary-1/5 hover:border-primary-1/40 hover:shadow-[0_4px_20px_rgba(139,92,246,0.08)] transition-all duration-300 text-primary-1 group shadow-[0_2px_15px_rgb(0,0,0,0.02)]"
    >
      <Icon size={18} className="text-primary-1 group-hover:text-primary-2 transition-colors" />
      <span className="font-semibold text-[14px]">{label}</span>
    </Link>
  );
}
