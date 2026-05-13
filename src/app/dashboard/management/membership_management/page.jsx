"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LayoutList, Search, Plus, MoreHorizontal,
  Check, AlertCircle, Loader2, X, Edit3,
  Trash2, Users, Crown, Zap, Star, Shield,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  active:   { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400", label: "Active" },
  inactive: { bg: "bg-bg-3",           text: "text-text-3",      border: "border-bg-3",           dot: "bg-text-3",     label: "Inactive" },
  draft:    { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20",   dot: "bg-amber-400",  label: "Draft" },
};

const TIER_META = {
  free:       { icon: Shield, color: "text-text-3",     bg: "bg-bg-3",          border: "border-bg-3",          label: "Free" },
  pro:        { icon: Zap,    color: "text-violet-400",  bg: "bg-violet-500/10", border: "border-violet-500/20", label: "Pro" },
  business:   { icon: Star,   color: "text-amber-400",   bg: "bg-amber-500/10",  border: "border-amber-500/20",  label: "Business" },
  enterprise: { icon: Crown,  color: "text-blue-400",    bg: "bg-blue-500/10",   border: "border-blue-500/20",   label: "Enterprise" },
};

const STATUS_FILTERS = ["All", "Active", "Inactive", "Draft"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(n) {
  if (!n && n !== 0) return "-";
  return n === 0
    ? "Free"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function formatDate(str) {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function getTier(t)   { return TIER_META[t?.toLowerCase()]  ?? TIER_META.free; }
function getStatus(s) { return STATUS_STYLES[s?.toLowerCase()] ?? STATUS_STYLES.inactive; }

const EMPTY_FORM = {
  name: "", tier: "free", price_monthly: 0, price_yearly: 0,
  max_members: 1, description: "", status: "active",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_MEMBERSHIPS = [
  { id: 1, name: "Free",       tier: "free",       price_monthly: 0,   price_yearly: 0,   max_members: 1,   member_count: 412, status: "active",   description: "Basic access for individual users.", created_at: "2025-01-01T00:00:00Z" },
  { id: 2, name: "Pro",        tier: "pro",        price_monthly: 29,  price_yearly: 290, max_members: 5,   member_count: 180, status: "active",   description: "Advanced features for small teams.", created_at: "2025-01-01T00:00:00Z" },
  { id: 3, name: "Business",   tier: "business",   price_monthly: 49,  price_yearly: 490, max_members: 20,  member_count: 74,  status: "active",   description: "Collaboration tools for growing teams.", created_at: "2025-06-01T00:00:00Z" },
  { id: 4, name: "Enterprise", tier: "enterprise", price_monthly: 99,  price_yearly: 990, max_members: 999, member_count: 22,  status: "active",   description: "Full platform access with priority support.", created_at: "2025-06-01T00:00:00Z" },
  { id: 5, name: "Starter",    tier: "pro",        price_monthly: 9,   price_yearly: 90,  max_members: 1,   member_count: 0,   status: "draft",    description: "Lightweight plan for solo creators.", created_at: "2026-04-10T00:00:00Z" },
  { id: 6, name: "Legacy",     tier: "free",       price_monthly: 0,   price_yearly: 0,   max_members: 1,   member_count: 0,   status: "inactive", description: "Deprecated plan, no longer offered.", created_at: "2024-01-01T00:00:00Z" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MembershipManagementPage() {
  const [memberships, setMemberships]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilter]       = useState("All");
  const [activeMenu, setActiveMenu]     = useState(null);
  const [modalData, setModalData]       = useState(null); // null | { isNew, ...fields }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting]     = useState(false);
  const [notification, setNotif]        = useState(null);

  const fetchMemberships = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      let data = MOCK_MEMBERSHIPS;
      if (search) {
        const q = search.toLowerCase();
        data = data.filter((m) =>
          m.name.toLowerCase().includes(q) ||
          m.tier.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
        );
      }
      if (filterStatus !== "All")
        data = data.filter((m) => m.status.toLowerCase() === filterStatus.toLowerCase());
      setMemberships(data);
    } catch {
      showNotif("Gagal memuat data membership.", "error");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    const t = setTimeout(fetchMemberships, 300);
    return () => clearTimeout(t);
  }, [fetchMemberships]);

  // Stats
  const totalActive   = memberships.filter((m) => m.status === "active").length;
  const totalMembers  = memberships.reduce((acc, m) => acc + (m.member_count ?? 0), 0);
  const totalDraft    = memberships.filter((m) => m.status === "draft").length;
  const totalPlans    = memberships.length;

  function showNotif(msg, type = "success") {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  }

  // Save (create / update)
  function handleSave(form) {
    if (form.isNew) {
      const newItem = { ...form, id: Date.now(), member_count: 0, created_at: new Date().toISOString() };
      delete newItem.isNew;
      setMemberships((prev) => [newItem, ...prev]);
      showNotif("Membership plan created.");
    } else {
      setMemberships((prev) => prev.map((m) => (m.id === form.id ? { ...m, ...form } : m)));
      showNotif("Membership plan updated.");
    }
    setModalData(null);
  }

  // Delete
  function handleDelete(id) {
    setIsDeleting(true);
    setTimeout(() => {
      setMemberships((prev) => prev.filter((m) => m.id !== id));
      showNotif("Membership plan deleted.");
      setDeleteTarget(null);
      setIsDeleting(false);
    }, 600);
  }

  return (
    <>
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold mb-1.5">Membership Management</h1>
          <p className="text-text-3 text-[13px]">Create and manage membership plans offered on your platform.</p>
        </div>
        <button
          onClick={() => setModalData({ ...EMPTY_FORM, isNew: true })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-semibold text-[13px] transition-all duration-200 shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.4)]"
        >
          <Plus size={15} /> Add Plan
        </button>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<LayoutList size={20} className="text-violet-400" />}  iconBg="bg-violet-500/20"  label="Total Plans"    value={totalPlans} />
        <StatCard icon={<Check      size={20} className="text-emerald-400" />} iconBg="bg-emerald-500/20" label="Active Plans"   value={totalActive} />
        <StatCard icon={<Users      size={20} className="text-blue-400" />}    iconBg="bg-blue-500/20"    label="Total Members"  value={totalMembers.toLocaleString()} />
        <StatCard icon={<Edit3      size={20} className="text-amber-400" />}   iconBg="bg-amber-500/20"   label="Draft Plans"    value={totalDraft} />
      </div>

      {/* Filters */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl px-6 py-5 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search by name, tier or description…"
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

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3">
          <Loader2 size={24} className="animate-spin text-primary-3" />
          <span className="text-text-3 text-[13px]">Loading membership plans...</span>
        </div>
      ) : memberships.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-3">
          <AlertCircle size={36} className="opacity-40" />
          <p className="text-[14px]">No membership plans found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {memberships.map((m) => {
            const tier = getTier(m.tier);
            const st   = getStatus(m.status);
            const Icon = tier.icon;
            return (
              <div
                key={m.id}
                className="bg-bg-2 border border-bg-3 rounded-2xl p-6 flex flex-col gap-5 hover:border-primary-1/30 transition-all duration-200 group"
              >
                {/* Card header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl ${tier.bg} border ${tier.border} flex items-center justify-center shrink-0`}>
                      <Icon size={20} className={tier.color} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-text-1">{m.name}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${tier.bg} ${tier.color} ${tier.border}`}>
                        {tier.label}
                      </span>
                    </div>
                  </div>

                  {/* Action menu */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === m.id ? null : m.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:bg-bg-3 hover:text-text-1 transition-all"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {activeMenu === m.id && (
                      <div className="absolute right-0 top-10 z-50 w-44 bg-bg-2 border border-bg-3 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                        <button
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                          onClick={() => { setModalData({ ...m, isNew: false }); setActiveMenu(null); }}
                        >
                          <Edit3 size={14} className="text-primary-3" /> Edit Plan
                        </button>
                        <div className="border-t border-bg-3/60 my-0.5" />
                        <button
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-rose-400 hover:bg-rose-500/10 transition-colors"
                          onClick={() => { setDeleteTarget(m); setActiveMenu(null); }}
                        >
                          <Trash2 size={14} /> Delete Plan
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[12.5px] text-text-3 leading-relaxed line-clamp-2">{m.description}</p>

                {/* Pricing */}
                <div className="flex items-end gap-3">
                  <div>
                    <p className="text-[11px] text-text-3 mb-0.5">Monthly</p>
                    <p className="text-[18px] font-bold text-text-1">{formatCurrency(m.price_monthly)}</p>
                  </div>
                  <div className="text-text-3 mb-1">/</div>
                  <div>
                    <p className="text-[11px] text-text-3 mb-0.5">Yearly</p>
                    <p className="text-[18px] font-bold text-text-1">{formatCurrency(m.price_yearly)}</p>
                  </div>
                </div>

                {/* Footer meta */}
                <div className="flex items-center justify-between pt-4 border-t border-bg-3/50">
                  <div className="flex items-center gap-1.5 text-[12px] text-text-3">
                    <Users size={13} />
                    <span><strong className="text-text-1">{m.member_count?.toLocaleString()}</strong> members</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    <span className={`text-[11px] font-semibold ${st.text}`}>{st.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dropdown close overlay */}
      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}

      {/* Create / Edit Modal */}
      {modalData && (
        <MembershipModal
          data={modalData}
          onClose={() => setModalData(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Trash2 size={18} className="text-rose-400" />
              </div>
              <h2 className="text-[16px] font-bold">Delete Plan?</h2>
            </div>
            <p className="text-text-3 text-[13px] mb-6">
              Are you sure you want to delete <strong className="text-text-1">{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget.id)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-[13px] font-semibold transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
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

// ─── Create / Edit Modal ──────────────────────────────────────────────────────
function MembershipModal({ data, onClose, onSave }) {
  const isNew   = !!data.isNew;
  const [form, setForm]     = useState({ ...data });
  const [saving, setSaving] = useState(false);

  function set(field, value) { setForm((p) => ({ ...p, [field]: value })); }

  async function handleSubmit() {
    if (!form.name.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave(form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold">{isNew ? "Add Membership Plan" : "Edit Membership Plan"}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <FormField label="Plan Name">
            <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Pro Plan" className={INPUT_CLS} />
          </FormField>

          <FormField label="Tier">
            <select value={form.tier} onChange={(e) => set("tier", e.target.value)} className={INPUT_CLS}>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="business">Business</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Monthly Price ($)">
              <input type="number" min={0} value={form.price_monthly} onChange={(e) => set("price_monthly", Number(e.target.value))}
                className={INPUT_CLS} />
            </FormField>
            <FormField label="Yearly Price ($)">
              <input type="number" min={0} value={form.price_yearly} onChange={(e) => set("price_yearly", Number(e.target.value))}
                className={INPUT_CLS} />
            </FormField>
          </div>

          <FormField label="Max Members">
            <input type="number" min={1} value={form.max_members} onChange={(e) => set("max_members", Number(e.target.value))}
              className={INPUT_CLS} />
          </FormField>

          <FormField label="Description">
            <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
              placeholder="Short description of this plan…"
              className={`${INPUT_CLS} resize-none`} />
          </FormField>

          <FormField label="Status">
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className={INPUT_CLS}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </FormField>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!form.name.trim() || saving}
            className="flex-1 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all shadow-[0_4px_20px_rgba(139,92,246,0.25)] flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : isNew ? "Create Plan" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FormField ────────────────────────────────────────────────────────────────
const INPUT_CLS = "w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors appearance-none";

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-text-3 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
