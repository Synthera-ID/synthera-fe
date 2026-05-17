"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import DashboardNavbar from "@/components/organisms/DashboardNavbar";
import {
  Info,
  Globe,
  Server,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Database,
  Wifi,
  Lock,
  FileText,
  ExternalLink,
} from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────────
const PLATFORM_INFO = [
  { label: "Platform Name", value: "Synthera API Platform" },
  { label: "Version", value: "v3.6.0" },
  { label: "Environment", value: "Production" },
  { label: "Region", value: "Asia Pacific (ap-1)" },
  { label: "Base URL", value: "https://api.synthera.id/api", isCode: true },
  { label: "Last Updated", value: "May 17, 2026" },
];

const SERVICE_STATUS = [
  { name: "API Gateway", status: "Operational", uptime: "99.98%", latency: "42ms" },
  { name: "Authentication", status: "Operational", uptime: "99.99%", latency: "18ms" },
  { name: "Content Delivery", status: "Operational", uptime: "99.95%", latency: "87ms" },
  { name: "Payment Gateway", status: "Degraded", uptime: "98.12%", latency: "210ms" },
  { name: "Webhooks", status: "Operational", uptime: "99.90%", latency: "56ms" },
  { name: "Database Cluster", status: "Operational", uptime: "100%", latency: "8ms" },
];

const RATE_LIMITS = [
  { plan: "Free", requests: "1,000 / day", burst: "10 / min", concurrent: "2" },
  { plan: "Basic", requests: "10,000 / day", burst: "60 / min", concurrent: "5" },
  { plan: "Pro", requests: "100,000 / day", burst: "300 / min", concurrent: "20" },
  { plan: "Enterprise", requests: "Unlimited", burst: "Custom", concurrent: "∞" },
];

const CHANGELOG = [
  {
    version: "v3.6.0",
    date: "May 17, 2026",
    type: "major",
    tasks: [
      "Feature Management CRUD — Full admin CRUD for Plan Features (PlanFeatureController), sidebar registration, and form modal with plan selector.",
      "Digital Content Image Upload — Backend multipart/form-data support for thumbnail uploads with file storage in storage/app/public/thumbnails/.",
      "Pricing Section Dynamic API — Pricing section on home page now fetches plans from GET /subscriptions public endpoint instead of static data.",
      "Auth-Aware Navbar — Public navbar detects login state via cookie; shows Dashboard + Course links when logged in, hides Login/Register.",
      "Pricing CTA Redirect — Pricing buttons redirect to /dashboard/subscription (logged in) or /login (not logged in).",
    ],
  },
  {
    version: "v3.5.2",
    date: "May 17, 2026",
    type: "patch",
    tasks: [
      "Fixed Sign Out modal clipped by sticky navbar — moved ConfirmationModal outside <header> stacking context.",
      "Fixed Payment Management crash (Cannot read 'dot' of undefined) — getStatusStyle fallback referenced deleted STATUS_STYLES.pending key.",
      "Fixed table action dropdown clipped — changed overflow-hidden to overflow-visible on payment_management and membership_management table containers.",
      "Fixed navbar # anchor links not scrolling — replaced Next.js <Link> with scrollToSection using smooth scroll + 80px offset.",
      "Fixed anchor links not working from /course — added cross-page navigation to /#section when not on home page.",
    ],
  },
  {
    version: "v3.5.1",
    date: "May 17, 2026",
    type: "minor",
    tasks: [
      "Action Column Layout Standardization — Moved action menu (⋯) from rightmost to leftmost column across all 5 management tables (Transaction, Payment, User, Membership, Feature).",
      "Payment Status Standardization — Changed payment status values to 'active' / 'inactive' globally across UI, filters, and stat cards.",
      "Sidebar Reorganization — Moved General Information below Management group, restricted to ADMIN role only.",
      "Course Dashboard Redirect — Dashboard course entry now redirects to /course via server-side redirect.",
    ],
  },
  {
    version: "v3.5.0",
    date: "May 15, 2026",
    type: "major",
    tasks: [
      "Full Management Dashboard — CRUD for Payment, Transaction, Subscription, Membership, and Digital Content (Course) Management.",
      "Admin route protection with auth:sanctum + AdminMiddleware.",
      "Audit fields (CreatedBy, CreatedDate, LastUpdateBy, LastUpdateDate) added across all modules.",
      "Currency standardized to IDR (Rp).",
    ],
  },
  {
    version: "v3.4.2",
    date: "May 15, 2026",
    type: "patch",
    tasks: [
      "Fixed broken PaymentController update and TransactionController validation syntax error.",
      "Fixed MembershipController wrong update fields.",
      "Removed duplicate routes and exception stack trace leaks.",
    ],
  },
  {
    version: "v3.4.1",
    date: "Apr 25, 2026",
    type: "patch",
    tasks: [
      "Fixed edge case in 2FA token expiry validation.",
    ],
  },
  {
    version: "v3.4.0",
    date: "Apr 10, 2026",
    type: "minor",
    tasks: [
      "Added webhook retry mechanism.",
      "Improved latency on Content Delivery.",
    ],
  },
  {
    version: "v3.3.0",
    date: "Mar 18, 2026",
    type: "minor",
    tasks: [
      "Introduced User Management API endpoints.",
      "Added bulk operations support.",
    ],
  },
  {
    version: "v3.2.5",
    date: "Feb 28, 2026",
    type: "patch",
    tasks: [
      "Security patch for JWT refresh token rotation.",
    ],
  },
];

const STATUS_STYLES = {
  Operational: {
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  Degraded: { dot: "bg-amber-400", text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  Down: { dot: "bg-rose-400", text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

const CHANGELOG_TYPE_STYLES = {
  patch: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/25", label: "Patch" },
  minor: { bg: "bg-violet-500/15", text: "text-violet-400", border: "border-violet-500/25", label: "Minor" },
  major: { bg: "bg-rose-500/15", text: "text-rose-400", border: "border-rose-500/25", label: "Major" },
};

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function GeneralInformationPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const operationalCount = SERVICE_STATUS.filter((s) => s.status === "Operational").length;
  const allOperational = operationalCount === SERVICE_STATUS.length;

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="mb-8">
        <h1 className="text-[26px] font-bold mb-1.5">General Information</h1>
        <p className="text-text-3 text-[13px]">Overview of the platform, service status, limits, and changelog.</p>
      </header>

      {/* ── Stat Summary ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={<Globe size={20} className="text-violet-400" />}
          iconBg="bg-violet-500/20"
          label="API Version"
          value="v3.6.0"
        />
        <StatCard
          icon={<Server size={20} className="text-blue-400" />}
          iconBg="bg-blue-500/20"
          label="Services Online"
          value={`${operationalCount}/${SERVICE_STATUS.length}`}
        />
        <StatCard
          icon={<Shield size={20} className="text-emerald-400" />}
          iconBg="bg-emerald-500/20"
          label="Security Status"
          value="Secure"
        />
        <StatCard
          icon={<Clock size={20} className="text-amber-400" />}
          iconBg="bg-amber-500/20"
          label="Avg Latency"
          value="52ms"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* ── Platform Info ────────────────────────────────────────── */}
        <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-bg-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <Info size={16} className="text-violet-400" />
            </div>
            <h2 className="text-[15px] font-bold">Platform Information</h2>
          </div>
          <div className="divide-y divide-bg-3/50">
            {PLATFORM_INFO.map(({ label, value, isCode }) => (
              <div key={label} className="flex items-center justify-between px-6 py-3.5 gap-4">
                <span className="text-[13px] text-text-3 shrink-0">{label}</span>
                {isCode ? (
                  <span className="font-mono text-[12px] text-primary-3 bg-primary-1/10 border border-primary-1/20 rounded-lg px-2.5 py-1 truncate max-w-[220px]">
                    {value}
                  </span>
                ) : (
                  <span className="text-[13px] font-semibold text-text-1 text-right">{value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── System Status ───────────────────────────────────────── */}
        <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-bg-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Wifi size={16} className="text-emerald-400" />
              </div>
              <h2 className="text-[15px] font-bold">System Status</h2>
            </div>
            {allOperational ? (
              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <CheckCircle2 size={12} />
                All Systems Go
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                <AlertCircle size={12} />
                Partial Degradation
              </span>
            )}
          </div>
          <div className="divide-y divide-bg-3/50">
            {SERVICE_STATUS.map(({ name, status, uptime, latency }) => {
              const s = STATUS_STYLES[status] ?? STATUS_STYLES.Down;
              return (
                <div key={name} className="flex items-center justify-between px-6 py-3.5 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                    <span className="text-[13px] font-medium truncate">{name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[12px] text-text-3 hidden sm:block">{uptime} uptime</span>
                    <span className="text-[12px] text-text-3 hidden sm:block">{latency}</span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${s.bg} ${s.text} ${s.border}`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Rate Limits ─────────────────────────────────────────────── */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden mb-6">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-bg-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
            <Database size={16} className="text-blue-400" />
          </div>
          <h2 className="text-[15px] font-bold">Rate Limits by Plan</h2>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-4 gap-4 px-6 py-3.5 bg-bg-3/30 text-[11px] font-bold text-text-3 uppercase tracking-widest border-b border-bg-3">
          <span>Plan</span>
          <span>Daily Requests</span>
          <span>Burst Limit</span>
          <span>Concurrent</span>
        </div>

        {RATE_LIMITS.map(({ plan, requests, burst, concurrent }, i) => {
          const isEnterprise = plan === "Enterprise";
          return (
            <div
              key={plan}
              className={`grid grid-cols-4 gap-4 px-6 py-4 items-center hover:bg-bg-3/20 transition-colors ${
                i < RATE_LIMITS.length - 1 ? "border-b border-bg-3/50" : ""
              }`}
            >
              <span className={`text-[13px] font-bold ${isEnterprise ? "text-violet-400" : "text-text-1"}`}>
                {plan}
                {isEnterprise && (
                  <span className="ml-2 text-[10px] font-bold text-violet-400 bg-violet-500/15 border border-violet-500/25 px-2 py-0.5 rounded-full">
                    Custom
                  </span>
                )}
              </span>
              <span className="text-[13px] text-text-2">{requests}</span>
              <span className="text-[13px] text-text-2">{burst}</span>
              <span className="text-[13px] text-text-2">{concurrent}</span>
            </div>
          );
        })}
      </div>

      {/* ── Security & Compliance ───────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <InfoTile
          icon={<Lock size={18} className="text-emerald-400" />}
          iconBg="bg-emerald-500/15"
          title="TLS 1.3 Encryption"
          desc="All data in transit is encrypted with TLS 1.3. Certificates auto-renewed via Let's Encrypt."
        />
        <InfoTile
          icon={<Shield size={18} className="text-violet-400" />}
          iconBg="bg-violet-500/15"
          title="SOC 2 Type II"
          desc="The platform is SOC 2 Type II certified. Annual security audits are conducted by a third-party."
        />
        <InfoTile
          icon={<Cpu size={18} className="text-blue-400" />}
          iconBg="bg-blue-500/15"
          title="Auto Scaling"
          desc="Infrastructure scales automatically based on demand. Zero downtime deployments are guaranteed."
        />
      </div>

      {/* ── Changelog ──────────────────────────────────────────────── */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-bg-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <FileText size={16} className="text-amber-400" />
            </div>
            <h2 className="text-[15px] font-bold">Recent Changelog</h2>
          </div>
          <a
            href="#"
            className="flex items-center gap-1.5 text-[12px] font-semibold text-primary-3 hover:text-primary-1 transition-colors"
          >
            View All
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="divide-y divide-bg-3/50">
          {CHANGELOG.map(({ version, date, type, tasks }) => {
            const t = CHANGELOG_TYPE_STYLES[type] ?? CHANGELOG_TYPE_STYLES.patch;
            return (
              <div key={version} className="flex items-start gap-4 px-6 py-5 hover:bg-bg-3/20 transition-colors">
                <span
                  className={`mt-0.5 inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border shrink-0 ${t.bg} ${t.text} ${t.border}`}
                >
                  {t.label}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[13px] font-bold text-text-1">{version}</span>
                    <span className="text-[12px] text-text-3">{date}</span>
                    <span className="text-[11px] text-text-3 bg-bg-3/50 px-2 py-0.5 rounded-full">
                      {tasks?.length || 0} task{(tasks?.length || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {(tasks || []).map((task, ti) => (
                      <li key={ti} className="flex items-start gap-2 text-[13px] text-text-2 leading-relaxed">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
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

// ─── Info Tile ─────────────────────────────────────────────────────────────────
function InfoTile({ icon, iconBg, title, desc }) {
  return (
    <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6 flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>{icon}</div>
      <div>
        <div className="text-[14px] font-bold mb-1">{title}</div>
        <p className="text-[13px] text-text-3 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
