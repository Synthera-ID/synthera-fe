"use client";

import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import { Zap, BarChart2, Activity } from "lucide-react";

const MONTHLY_DATA = [
  { month: "Jan", calls: 3200 },
  { month: "Feb", calls: 4800 },
  { month: "Mar", calls: 2900 },
  { month: "Apr", calls: 6100 },
  { month: "May", calls: 5700 },
  { month: "Jun", calls: 6800 },
  { month: "Jul", calls: 4100 },
  { month: "Aug", calls: 7500 },
  { month: "Sep", calls: 5200 },
  { month: "Oct", calls: 6300 },
  { month: "Nov", calls: 6900 },
  { month: "Dec", calls: 4400 },
];

const ENDPOINTS = [
  { name: "/api/v1/members",  method: "GET",  calls: 8240, avgLatency: "95ms",  errorRate: "0.2%" },
  { name: "/api/v1/content",  method: "GET",  calls: 5120, avgLatency: "120ms", errorRate: "0.5%" },
  { name: "/api/v1/auth",     method: "POST", calls: 3890, avgLatency: "180ms", errorRate: "1.2%" },
  { name: "/api/v1/payments", method: "PUT",  calls: 1430, avgLatency: "210ms", errorRate: "0.8%" },
];

const MAX_CALLS = Math.max(...MONTHLY_DATA.map((d) => d.calls));

const METHOD_STYLES = {
  GET:  { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
  POST: { bg: "bg-amber-500/20",   text: "text-amber-400",   border: "border-amber-500/30"   },
  PUT:  { bg: "bg-blue-500/20",    text: "text-blue-400",    border: "border-blue-500/30"    },
  DELETE:{ bg: "bg-red-500/20",    text: "text-red-400",     border: "border-red-500/30"     },
};

export default function ApiUsagePage() {
  const rateLimitUsed = 7500;
  const rateLimitTotal = 10000;
  const ratePct = (rateLimitUsed / rateLimitTotal) * 100;

  return (
    <div className="flex min-h-screen bg-bg-1 text-text-1 font-sans selection:bg-primary-1/30">
      <DashboardSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-12 max-h-screen overflow-y-auto w-full scroll-smooth">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-[26px] font-bold mb-1.5">API Usage</h1>
          <p className="text-text-3 text-[13px]">Monitor your API consumption and rate limits.</p>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <StatCard
            icon={<Zap size={20} className="text-indigo-400" />}
            iconBg="bg-indigo-500/20"
            label="Today's Calls"
            value="1,247"
          />
          <StatCard
            icon={<BarChart2 size={20} className="text-emerald-400" />}
            iconBg="bg-emerald-500/20"
            label="This Month"
            value="28,453"
          />
          <StatCard
            icon={<Activity size={20} className="text-amber-400" />}
            iconBg="bg-amber-500/20"
            label="Avg Response"
            value="142ms"
          />
        </div>

        {/* Rate Limit */}
        <div className="bg-bg-2 border border-bg-3 rounded-2xl px-7 py-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[15px] font-bold">Rate Limit</span>
            <span className="text-[13px] text-text-3">
              {rateLimitUsed.toLocaleString()} / {rateLimitTotal.toLocaleString()} requests
            </span>
          </div>
          <div className="w-full h-[6px] bg-bg-3 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-2 to-primary-3 transition-all duration-700"
              style={{ width: `${ratePct}%` }}
            />
          </div>
        </div>

        {/* Usage Over Time Chart */}
        <div className="bg-bg-2 border border-bg-3 rounded-2xl px-7 pt-7 pb-4 mb-6">
          <h2 className="text-[15px] font-bold mb-6">Usage Over Time</h2>

          <div className="flex items-end justify-between gap-2" style={{ height: "200px" }}>
            {MONTHLY_DATA.map(({ month, calls }) => {
              const pct = (calls / MAX_CALLS) * 100;
              return (
                <div key={month} className="flex flex-col items-center flex-1 group h-full justify-end">
                  <div className="relative w-full flex items-end justify-center" style={{ height: "calc(100% - 20px)" }}>
                    <div
                      className="w-full bg-gradient-to-t from-primary-2 to-primary-3 rounded-t-md transition-all duration-700 group-hover:from-primary-1 group-hover:to-primary-4 group-hover:shadow-[0_0_12px_rgba(139,92,246,0.35)] cursor-default"
                      style={{ height: `${pct}%` }}
                      title={`${calls.toLocaleString()} calls`}
                    />
                  </div>
                  <span className="text-[11px] text-text-3 mt-2 font-medium">{month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Endpoint Breakdown */}
        <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden">
          <div className="px-7 py-6 border-b border-bg-3">
            <h2 className="text-[15px] font-bold">Endpoint Breakdown</h2>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-7 py-3.5 bg-bg-3/30 text-[11px] font-bold text-text-3 uppercase tracking-widest">
            <span>Endpoint</span>
            <span>Method</span>
            <span>Calls</span>
            <span>Avg Latency</span>
            <span>Error Rate</span>
          </div>

          {ENDPOINTS.map((ep, i) => {
            const ms = METHOD_STYLES[ep.method] ?? METHOD_STYLES.GET;
            return (
              <div
                key={ep.name}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-7 py-4 items-center hover:bg-bg-3/30 transition-colors ${
                  i < ENDPOINTS.length - 1 ? "border-b border-bg-3/50" : ""
                }`}
              >
                <span className="font-mono text-[13px] text-text-1">{ep.name}</span>
                <span>
                  <span
                    className={`inline-block px-3 py-1 rounded-md text-[11px] font-bold tracking-wide border ${ms.bg} ${ms.text} ${ms.border}`}
                  >
                    {ep.method}
                  </span>
                </span>
                <span className="text-[13px] text-text-2">{ep.calls.toLocaleString()}</span>
                <span className="text-[13px] text-text-2">{ep.avgLatency}</span>
                <span className="text-[13px] text-text-2">{ep.errorRate}</span>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}

function StatCard({ icon, iconBg, label, value }) {
  return (
    <div className="bg-bg-2 border border-bg-3 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-[12px] text-text-3 mb-1">{label}</div>
        <div className="text-[22px] font-bold tracking-tight leading-none">{value}</div>
      </div>
    </div>
  );
}
