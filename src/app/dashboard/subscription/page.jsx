"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import DashboardNavbar from "@/components/organisms/DashboardNavbar";
import { Check } from "lucide-react";

export default function SubscriptionPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-bg-1 text-text-1 font-sans selection:bg-primary-1/30">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <DashboardNavbar onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />

        <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full scroll-smooth">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-[26px] font-bold mb-1.5">Subscription</h1>
          <p className="text-text-3 text-[13px]">Manage your subscription plan and billing.</p>
        </header>

        {/* Current Plan Overview */}
        <div className="bg-bg-2 border border-bg-3 rounded-2xl p-7 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-[22px] font-bold leading-none">Pro Plan</h2>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 leading-none uppercase tracking-wide">
                  Active
                </span>
              </div>
              <p className="text-text-3 text-[12px]">
                Billing cycle: Monthly · Next billing: March 15, 2026 · $29.00/month
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button className="px-5 py-2.5 rounded-lg border border-bg-3 text-text-1 text-[13px] font-medium hover:bg-bg-3 transition-colors">
                Change Plan
              </button>
              <button className="px-5 py-2.5 rounded-lg bg-red-500 text-white text-[13px] font-medium hover:bg-red-600 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Compare Plans */}
        <div className="mb-6">
          <h3 className="text-[17px] font-bold mb-8">Compare Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Starter Plan */}
            <div className="bg-bg-2 border border-bg-3 rounded-2xl p-8 flex flex-col">
              <h4 className="text-[17px] font-bold text-center mb-8">Starter</h4>
              <div className="mb-10 text-center">
                <div className="flex items-end justify-center gap-1">
                  <span className="text-[44px] leading-none font-bold">$0</span>
                  <span className="text-text-3 text-[14px] mb-1">/mo</span>
                </div>
              </div>
              <div className="space-y-4 mb-20 flex-1">
                <FeatureItem text="Basic access" />
                <FeatureItem text="2 seats" />
                <FeatureItem text="1GB storage" />
              </div>
              <button className="w-full py-[10px] px-5 rounded-lg border border-bg-3 text-[13px] text-primary-3 font-medium text-left hover:bg-bg-3 transition-colors">
                Downgrade
              </button>
            </div>

            {/* Pro Plan — current */}
            <div className="bg-primary-1/5 border border-primary-1 relative overflow-hidden rounded-2xl p-8 flex flex-col shadow-[0_0_20px_rgba(139,92,246,0.1)]">
              {/* Popular ribbon */}
              <div className="absolute right-[-40px] top-[24px] w-[150px] rotate-45 bg-primary-1 text-center py-1.5 text-[9px] font-bold text-white tracking-widest shadow-md">
                POPULAR
              </div>
              <h4 className="text-[17px] font-bold text-center mb-8">Pro</h4>
              <div className="mb-10 text-center">
                <div className="flex items-end justify-center gap-1">
                  <span className="text-[44px] leading-none font-bold text-primary-3">$29</span>
                  <span className="text-text-3 text-[14px] mb-1">/mo</span>
                </div>
              </div>
              <div className="space-y-4 mb-20 flex-1">
                <FeatureItem text="Unlimited seats" />
                <FeatureItem text="50GB storage" />
                <FeatureItem text="API access" />
                <FeatureItem text="Analytics" />
              </div>
              <button className="w-full py-[10px] px-5 rounded-lg bg-primary-1 text-white text-[13px] font-medium text-left shadow-lg shadow-primary-1/20 hover:bg-primary-2 transition-colors">
                Current Plan
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-bg-2 border border-bg-3 rounded-2xl p-8 flex flex-col">
              <h4 className="text-[17px] font-bold text-center mb-8">Enterprise</h4>
              <div className="mb-10 text-center">
                <div className="flex items-end justify-center gap-1">
                  <span className="text-[44px] leading-none font-bold">$99</span>
                  <span className="text-text-3 text-[14px] mb-1">/mo</span>
                </div>
              </div>
              <div className="space-y-4 mb-20 flex-1">
                <FeatureItem text="Custom storage" />
                <FeatureItem text="SLA support" />
                <FeatureItem text="Dedicated manager" />
              </div>
              <button className="w-full py-[10px] px-5 rounded-lg border border-bg-3 text-[13px] text-text-1 font-medium text-left hover:bg-bg-3 transition-colors">
                Upgrade
              </button>
            </div>

          </div>
        </div>
        </main>
      </div>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-3">
      <Check size={16} className="text-emerald-400" strokeWidth={3} />
      <span className="text-text-2 text-[13px]">{text}</span>
    </div>
  );
}
