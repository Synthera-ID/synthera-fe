"use client";

import { useState, useEffect } from "react";
import apiFetch from "@/utils/apiFetch";
import { Zap, BarChart2, CheckCircle2, Activity, AlertCircle } from "lucide-react";

// ─── HTTP Method badge styles ──────────────────────────────────────────────────
const METHOD_STYLES = {
  GET:    { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
  POST:   { bg: "bg-amber-500/20",   text: "text-amber-400",   border: "border-amber-500/30"   },
  PUT:    { bg: "bg-blue-500/20",    text: "text-blue-400",    border: "border-blue-500/30"    },
  PATCH:  { bg: "bg-indigo-500/20",  text: "text-indigo-400",  border: "border-indigo-500/30"  },
  DELETE: { bg: "bg-red-500/20",     text: "text-red-400",     border: "border-red-500/30"     },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }) {
  return <div className={`bg-bg-3 rounded animate-pulse ${className}`} />;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, label, value, loading }) {
  return (
    <div className="bg-bg-2 border border-bg-3 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-[12px] text-text-3 mb-1">{label}</div>
        {loading ? (
          <Skeleton className="h-6 w-20 mt-1" />
        ) : (
          <div className="text-[22px] font-bold tracking-tight leading-none">{value}</div>
        )}
      </div>
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function UsageChart({ data, loading }) {
  if (loading) {
    return (
      <div className="flex items-end justify-between gap-2" style={{ height: "200px" }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex flex-col items-center flex-1 h-full justify-end gap-2">
            <div
              className="w-full bg-bg-3 rounded-t-md animate-pulse"
              style={{ height: `${Math.random() * 60 + 20}%`, animationDelay: `${i * 50}ms` }}
            />
            <span className="text-[11px] text-text-3 font-medium">
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const maxCalls = Math.max(...data.map((d) => d.calls), 1);

  return (
    <div className="flex items-end justify-between gap-2" style={{ height: "200px" }}>
      {data.map(({ month, calls }) => {
        const pct = (calls / maxCalls) * 100;
        return (
          <div key={month} className="flex flex-col items-center flex-1 group h-full justify-end">
            <div className="relative w-full flex items-end justify-center" style={{ height: "calc(100% - 20px)" }}>
              {calls === 0 ? (
                <div className="w-full bg-bg-3/50 rounded-t-md" style={{ height: "4px" }} />
              ) : (
                <div
                  className="w-full bg-gradient-to-t from-primary-2 to-primary-3 rounded-t-md transition-all duration-700 group-hover:from-primary-1 group-hover:to-primary-4 group-hover:shadow-[0_0_12px_rgba(139,92,246,0.35)] cursor-default"
                  style={{ height: `${pct}%` }}
                  title={`${calls.toLocaleString()} calls`}
                />
              )}
            </div>
            <span className="text-[11px] text-text-3 mt-2 font-medium">{month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ApiUsagePage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await apiFetch.get("/api-usage/summary");
        setSummary(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const todayCalls   = summary?.today_calls   ?? 0;
  const monthCalls   = summary?.month_calls   ?? 0;
  const totalCalls   = summary?.total_calls   ?? 0;
  const successRate  = summary?.success_rate  ?? 100;
  const monthly      = summary?.monthly_breakdown  ?? [];
  const endpoints    = summary?.endpoint_breakdown ?? [];

  return (
    <>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-[26px] font-bold mb-1.5">API Usage</h1>
        <p className="text-text-3 text-[13px]">Monitor your API consumption in real time.</p>
      </header>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-5 py-4 mb-6 text-red-400 text-[13px]">
          <AlertCircle size={16} className="shrink-0" />
          Failed to load usage data. Please refresh the page.
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <StatCard
          icon={<Zap size={20} className="text-indigo-400" />}
          iconBg="bg-indigo-500/20"
          label="Today's Calls"
          value={todayCalls.toLocaleString()}
          loading={loading}
        />
        <StatCard
          icon={<BarChart2 size={20} className="text-emerald-400" />}
          iconBg="bg-emerald-500/20"
          label="This Month"
          value={monthCalls.toLocaleString()}
          loading={loading}
        />
        <StatCard
          icon={<CheckCircle2 size={20} className="text-amber-400" />}
          iconBg="bg-amber-500/20"
          label="Success Rate"
          value={loading ? "—" : `${successRate}%`}
          loading={loading}
        />
      </div>

      {/* Total Calls summary bar */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl px-7 py-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[15px] font-bold">Total API Calls</span>
          <span className="text-[13px] text-text-3">
            {loading ? "—" : totalCalls.toLocaleString()} total requests
          </span>
        </div>
        <div className="w-full h-[6px] bg-bg-3 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-2 to-primary-3 transition-all duration-700"
            style={{ width: loading ? "0%" : totalCalls > 0 ? `${Math.min((monthCalls / Math.max(totalCalls, 1)) * 100, 100)}%` : "0%" }}
          />
        </div>
        <p className="text-[11px] text-text-3 mt-2">
          {loading ? " " : `${monthCalls.toLocaleString()} calls this month out of ${totalCalls.toLocaleString()} total`}
        </p>
      </div>

      {/* Usage Over Time Chart */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl px-7 pt-7 pb-4 mb-6">
        <h2 className="text-[15px] font-bold mb-6">Usage Over Time</h2>
        <UsageChart data={monthly} loading={loading} />
      </div>

      {/* Endpoint Breakdown */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden">
        <div className="px-7 py-6 border-b border-bg-3 flex items-center justify-between">
          <h2 className="text-[15px] font-bold">Endpoint Breakdown</h2>
          {!loading && (
            <span className="text-text-3 text-[12px]">{endpoints.length} endpoint{endpoints.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-7 py-3.5 bg-bg-3/30 text-[11px] font-bold text-text-3 uppercase tracking-widest">
          <span>Endpoint</span>
          <span>Method</span>
          <span>Calls</span>
          <span>Error Rate</span>
        </div>

        {loading ? (
          <div className="flex flex-col">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-7 py-4 border-b border-bg-3/50 last:border-b-0 animate-pulse">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-14 rounded-md" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>
        ) : endpoints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-text-3">
            <Activity size={32} className="opacity-30" />
            <p className="text-[14px]">No API calls recorded yet.</p>
          </div>
        ) : (
          endpoints.map((ep, i) => {
            const ms = METHOD_STYLES[ep.method] ?? METHOD_STYLES.GET;
            const errorNum = parseFloat(ep.error_rate);
            const errorColor = errorNum === 0
              ? "text-emerald-400"
              : errorNum < 2
              ? "text-amber-400"
              : "text-red-400";
            return (
              <div
                key={`${ep.endpoint}-${ep.method}-${i}`}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-7 py-4 items-center hover:bg-bg-3/30 transition-colors ${
                  i < endpoints.length - 1 ? "border-b border-bg-3/50" : ""
                }`}
              >
                <span className="font-mono text-[13px] text-text-1 truncate">{ep.endpoint}</span>
                <span>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border ${ms.bg} ${ms.text} ${ms.border}`}
                  >
                    {ep.method}
                  </span>
                </span>
                <span className="text-[13px] text-text-2">{ep.calls.toLocaleString()}</span>
                <span className={`text-[13px] font-medium ${errorColor}`}>{ep.error_rate}</span>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
