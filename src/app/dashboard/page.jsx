"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SyntheraIcon from "../icon.png";
import { 
  LayoutDashboard, 
  CreditCard, 
  Key, 
  BarChart2, 
  Box, 
  History, 
  User, 
  Moon,
  Sun,
  Zap,
  Grid,
  Clock,
  Settings
} from "lucide-react";

export default function DashboardPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains("light"));
  }, []);

  const toggleTheme = () => {
    const isLightMode = document.documentElement.classList.toggle("light");
    setIsDark(!isLightMode);
  };

  return (
    <div className="flex min-h-screen bg-bg-1 text-text-1 font-sans selection:bg-primary-1/30">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-bg-3 bg-bg-1 flex flex-col pt-6 relative z-10 sticky top-0 h-screen hidden md:flex">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-6 mb-8 group w-fit">
          <Image 
            src={SyntheraIcon} 
            alt="Synthera Icon" 
            width={32} 
            height={32} 
            className="rounded-full group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all"
          />
          <span className="text-xl font-bold tracking-wide text-text-1">
            Synthera
          </span>
        </Link>

        {/* Theme Toggle */}
        <div className="px-6 mb-8">
          <button 
            onClick={toggleTheme}
            className="w-full h-10 rounded-xl bg-bg-2 border border-bg-3 flex items-center justify-center text-text-3 hover:text-text-1 hover:border-primary-1/30 transition-all shadow-sm"
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col">
          <div className="px-6 text-[10px] font-bold text-text-3 tracking-widest mb-4">
            USER PANEL
          </div>
          <nav className="flex flex-col gap-1 px-3">
            <NavItem icon={LayoutDashboard} label="Dashboard" isActive />
            <NavItem icon={CreditCard} label="Subscription" />
            <NavItem icon={Key} label="API Keys" />
            <NavItem icon={BarChart2} label="API Usage" />
            <NavItem icon={Grid} label="Digital Content" />
            <NavItem icon={History} label="Payment History" />
            <NavItem icon={User} label="Profile" />
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-12 max-h-screen overflow-y-auto w-full scroll-smooth">
        <header className="mb-10">
          <h1 className="text-[28px] font-bold mb-2">Welcome back, John! 👋</h1>
          <p className="text-text-2 text-sm">Here's what's happening with your account today.</p>
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
                <ActionButton icon={Key} label="View API Keys" />
                <ActionButton icon={CreditCard} label="Manage Plan" />
                <ActionButton icon={Grid} label="Browse Content" />
                <ActionButton icon={Settings} label="Settings" />
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, isActive }) {
  return (
    <Link
      href="#"
      className={`flex items-center gap-3 px-4 py-[14px] rounded-xl transition-all duration-300 ${
        isActive 
          ? "text-primary-1 bg-primary-1/10 relative"
          : "text-text-2 hover:text-text-1 hover:bg-bg-3 border border-transparent"
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary-1 rounded-r-md"></div>
      )}
      <Icon size={18} className={isActive ? "text-primary-1" : "text-text-3"} />
      <span className="font-medium text-[13px]">{label}</span>
    </Link>
  );
}

function StatCard({ icon, label, value, subLabel, subLabelColor, iconBgClass }) {
  return (
    <div className="bg-bg-2 border border-bg-3 rounded-[20px] p-6 flex flex-col justify-between relative group hover:border-bg-3 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 min-h-[140px]">
      <div className="flex items-center gap-4 mb-3">
        <div className={`w-[46px] h-[46px] flex items-center justify-center rounded-xl ${iconBgClass}`}>
           {icon}
        </div>
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
      <div className="relative w-full flex items-end justify-center rounded-t-[4px] overflow-visible" style={{ height }}>
         <span className="absolute -top-7 text-[11px] text-text-3 font-semibold capitalize pointer-events-none">{day}</span>
         <div 
           className="w-full h-full bg-gradient-to-t from-primary-2 to-primary-3 rounded-t-[4px] transition-all duration-700 ease-in-out group-hover:from-primary-1 group-hover:to-primary-4 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
           style={{ animationDelay: delay }}
         />
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label }) {
  return (
    <button className="flex items-center justify-center gap-3 h-[56px] bg-transparent border border-primary-1/20 rounded-2xl hover:bg-primary-1/5 hover:border-primary-1/40 hover:shadow-[0_4px_20px_rgba(139,92,246,0.08)] transition-all duration-300 text-primary-1 group shadow-[0_2px_15px_rgb(0,0,0,0.02)]">
      <Icon size={18} className="text-primary-1 group-hover:text-primary-2 transition-colors" />
      <span className="font-semibold text-[14px]">{label}</span>
    </button>
  );
}
