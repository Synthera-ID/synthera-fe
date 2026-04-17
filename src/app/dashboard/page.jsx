"use client";

import Link from "next/link";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import { Box, Zap, Grid, Clock, CreditCard, Key, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, twoFactorRequired } = useAuth();
  const [User, setUser] = useState(null);
  useEffect(() => {
    setUser(user);
    if (!loading && twoFactorRequired) {
      router.replace("/2fa/verify");
    }
  }, [loading, twoFactorRequired, router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  if (twoFactorRequired) return null;

  return (
    <div className="flex min-h-screen bg-bg-1 text-text-1 font-sans selection:bg-primary-1/30">
      <DashboardSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-12 max-h-screen overflow-y-auto w-full scroll-smooth">
        <header className="mb-10">
          <h1 className="text-[28px] font-bold mb-2">Welcome back, {User?.name}! 👋</h1>
          <p className="text-text-2 text-sm">Here&apos;s what&apos;s happening with your account today.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10 text-left">
          <StatCard
            icon={<Box size={22} className="text-primary-1" />}
            iconBgClass="bg-primary-1/10"
            label="Current Plan"
            value="Pro"
            subLabel="Active"
            subLabelColor="text-emerald-500"
          />
          <StatCard
            icon={<Zap size={22} className="text-emerald-500" />}
            iconBgClass="bg-emerald-500/10"
            label="API Calls Today"
            value="1,247"
            subLabel="↑ +12%"
            subLabelColor="text-emerald-500"
          />
          <StatCard
            icon={<Grid size={22} className="text-[#3b82f6]" />}
            iconBgClass="bg-blue-500/10"
            label="Content Accessed"
            value="38"
            subLabel="↑ +5"
            subLabelColor="text-emerald-500"
          />
          <StatCard
            icon={<Clock size={22} className="text-[#f59e0b]" />}
            iconBgClass="bg-orange-500/10"
            label="Next Billing"
            value="Mar 15, 2026"
            subLabel="$29.00"
            subLabelColor="text-text-3"
          />
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full items-start">
          {/* Chart Section */}
          <div className="bg-bg-2 border border-bg-3 rounded-3xl p-7 flex flex-col w-full h-[320px]">
            <h2 className="text-[16px] font-bold mb-6 text-text-1">API Usage (7 days)</h2>
            <div className="flex-1 flex items-end justify-between px-1 gap-1 pb-0 mt-6 relative h-full">
              <Bar day="Mon" height="45%" delay="0ms" />
              <Bar day="Tue" height="30%" delay="50ms" />
              <Bar day="Wed" height="65%" delay="100ms" />
              <Bar day="Thu" height="40%" delay="150ms" />
              <Bar day="Fri" height="85%" delay="200ms" />
              <Bar day="Sat" height="60%" delay="250ms" />
              <Bar day="Sun" height="75%" delay="300ms" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-bg-2 border border-bg-3 rounded-3xl p-7 flex flex-col w-full h-[320px]">
            <h2 className="text-[16px] font-bold mb-6 text-text-1">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ActionButton icon={Key} label="View API Keys" href="/dashboard/api_keys" />
              <ActionButton icon={CreditCard} label="Manage Plan" href="/dashboard/subscription" />
              <ActionButton icon={Grid} label="Browse Content" href="/dashboard/digital_content" />
              <ActionButton icon={Settings} label="Settings" href="/dashboard/profile" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, subLabel, subLabelColor, iconBgClass }) {
  return (
    <div className="bg-bg-2 border border-bg-3 rounded-[20px] p-6 flex flex-col justify-between relative group hover:border-bg-3 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 min-h-[140px]">
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

function Bar({ day, height, delay }) {
  return (
    <div className="flex flex-col items-center flex-1 group h-full justify-end px-1.5 basis-0">
      <div
        className="relative w-full flex items-end justify-center rounded-t-[4px] overflow-visible"
        style={{ height }}
      >
        <span className="absolute -top-7 text-[11px] text-text-3 font-semibold capitalize pointer-events-none">
          {day}
        </span>
        <div
          className="w-full h-full bg-gradient-to-t from-primary-2 to-primary-3 rounded-t-[4px] transition-all duration-700 ease-in-out group-hover:from-primary-1 group-hover:to-primary-4 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          style={{ animationDelay: delay }}
        />
      </div>
    </div>
  );
}

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
