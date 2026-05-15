"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BadgeCheck, Search, Plus, MoreHorizontal,
  Check, AlertCircle, Loader2, X, Edit3,
  Trash2, Users, TrendingUp, Crown, Zap, Star,
} from "lucide-react";
import apiFetch from "@/utils/apiFetch";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

// ─── Constants ────────────────────────────────────────────────────────────────
const TIER_META = {
  basic:     { icon: BadgeCheck, color: "text-text-3",    bg: "bg-bg-3",          border: "border-bg-3",          label: "Basic" },
  pro:       { icon: Zap,        color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", label: "Pro" },
  exclusive: { icon: Crown,      color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20",  label: "Exclusive" },
};

const INPUT_CLS = "w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors appearance-none";

function getTier(t) { return TIER_META[t?.toLowerCase()] ?? TIER_META.basic; }

function formatCurrency(n) {
  if (!n && n !== 0) return "-";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function formatDate(str) {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const EMPTY_FORM = {
  name: "", description: "", price: 0, duration_days: 30,
  tier: "basic", max_courses: null, api_daily_limit: null,
  api_rate_limit: null, is_active: true,
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SubscriptionManagementPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("All");
  const [activeMenu, setActiveMenu] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotif] = useState(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterTier !== "All") params.append("tier", filterTier.toLowerCase());
      params.append("per_page", "50");

      const res = await apiFetch.get(`/admin/subscriptions?${params.toString()}`);
      setPlans(res.data || []);
    } catch {
      showNotif("Gagal memuat data subscription.", "error");
    } finally {
      setLoading(false);
    }
  }, [search, filterTier]);

  useEffect(() => {
    const t = setTimeout(fetchPlans, 300);
    return () => clearTimeout(t);
  }, [fetchPlans]);

  // Stats
  const totalPlans = plans.length;
  const totalActive = plans.filter((p) => p.is_active).length;
  const totalBasic = plans.filter((p) => p.tier === "basic").length;
  const totalPro = plans.filter((p) => p.tier === "pro").length;

  function showNotif(msg, type = "success") {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  }

  async function handleSave(form) {
    try {
      const payload = { ...form };
      delete payload.isNew;
      delete payload.id;
      delete payload.features;

      if (form.isNew) {
        const res = await apiFetch.post("/admin/subscriptions", payload);
        setPlans((prev) => [res.data, ...prev]);
        showNotif("Subscription plan created.");
      } else {
        const res = await apiFetch.put(`/admin/subscriptions/${form.id}`, payload);
        setPlans((prev) => prev.map((p) => (p.id === form.id ? res.data : p)));
        showNotif("Subscription plan updated.");
      }
      setModalData(null);
    } catch (err) {
      const msg = err?.data?.message || Object.values(err?.data?.errors || {})?.[0]?.[0] || "Gagal menyimpan.";
      showNotif(msg, "error");
    }
  }

  async function handleDelete(id) {
    setIsDeleting(true);
    try {
      await apiFetch.delete(`/admin/subscriptions/${id}`);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      showNotif("Subscription plan deleted.");
      setDeleteTarget(null);
    } catch (err) {
      showNotif(err?.data?.message || "Gagal menghapus.", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold mb-1.5">Subscription Management</h1>
          <p className="text-text-3 text-[13px]">Create and manage subscription plans offered on your platform.</p>
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
        <StatCard icon={<BadgeCheck size={20} className="text-violet-400" />} iconBg="bg-violet-500/20" label="Total Plans" value={totalPlans} />
        <StatCard icon={<Check size={20} className="text-emerald-400" />} iconBg="bg-emerald-500/20" label="Active Plans" value={totalActive} />
        <StatCard icon={<Star size={20} className="text-blue-400" />} iconBg="bg-blue-500/20" label="Basic Plans" value={totalBasic} />
        <StatCard icon={<Crown size={20} className="text-amber-400" />} iconBg="bg-amber-500/20" label="Pro Plans" value={totalPro} />
      </div>

      {/* Filters */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl px-6 py-5 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input type="text" placeholder="Search by name, description…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {["All", "Basic", "Pro", "Exclusive"].map((s) => (
            <button key={s} onClick={() => setFilterTier(s)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold border transition-all duration-150 ${
                filterTier === s ? "bg-primary-1/20 text-primary-3 border-primary-1/30" : "bg-transparent text-text-3 border-bg-3 hover:border-primary-1/20 hover:text-text-2"
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3">
          <Loader2 size={24} className="animate-spin text-primary-3" />
          <span className="text-text-3 text-[13px]">Loading subscription plans...</span>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-3">
          <AlertCircle size={36} className="opacity-40" />
          <p className="text-[14px]">No subscription plans found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {plans.map((p) => {
            const tier = getTier(p.tier);
            const Icon = tier.icon;
            return (
              <div key={p.id} className="bg-bg-2 border border-bg-3 rounded-2xl p-6 flex flex-col gap-4 hover:border-primary-1/30 transition-all duration-200 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl ${tier.bg} border ${tier.border} flex items-center justify-center shrink-0`}>
                      <Icon size={20} className={tier.color} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-text-1">{p.name}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${tier.bg} ${tier.color} ${tier.border}`}>{tier.label}</span>
                    </div>
                  </div>

                  <div className="relative">
                    <button onClick={() => setActiveMenu(activeMenu === p.id ? null : p.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:bg-bg-3 hover:text-text-1 transition-all">
                      <MoreHorizontal size={16} />
                    </button>
                    {activeMenu === p.id && (
                      <div className="absolute right-0 top-10 z-50 w-44 bg-bg-2 border border-bg-3 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                        <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                          onClick={() => { setModalData({ ...p, isNew: false }); setActiveMenu(null); }}>
                          <Edit3 size={14} className="text-primary-3" /> Edit Plan
                        </button>
                        <div className="border-t border-bg-3/60 my-0.5" />
                        <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-rose-400 hover:bg-rose-500/10 transition-colors"
                          onClick={() => { setDeleteTarget(p); setActiveMenu(null); }}>
                          <Trash2 size={14} /> Delete Plan
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[12.5px] text-text-3 leading-relaxed line-clamp-2">{p.description}</p>

                <div className="flex items-end gap-3">
                  <div>
                    <p className="text-[11px] text-text-3 mb-0.5">Price</p>
                    <p className="text-[18px] font-bold text-text-1">{formatCurrency(p.price)}</p>
                  </div>
                  <div className="text-text-3 mb-1">/</div>
                  <div>
                    <p className="text-[11px] text-text-3 mb-0.5">Duration</p>
                    <p className="text-[14px] font-semibold text-text-1">{p.duration_days} days</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-bg-3/50 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-3">Status</span>
                    <span className={`font-semibold ${p.is_active ? "text-emerald-400" : "text-text-3"}`}>{p.is_active ? "Active" : "Inactive"}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-3">Created</span>
                    <span className="text-text-2">{formatDate(p.CreatedDate || p.created_at)} <span className="text-text-3/60">by {p.CreatedBy || "-"}</span></span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-3">Updated</span>
                    <span className="text-text-2">{formatDate(p.LastUpdateDate || p.updated_at)} <span className="text-text-3/60">by {p.LastUpdateBy || "-"}</span></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}

      {modalData && <SubscriptionModal data={modalData} onClose={() => setModalData(null)} onSave={handleSave} />}

      <ConfirmationModal isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete Plan?" message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"?` : ""} confirmText="Delete" variant="danger" icon={Trash2} isLoading={isDeleting} />

      {notification && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[13px] font-semibold shadow-2xl border transition-all duration-300 ${
          notification.type === "error" ? "bg-bg-2 border-rose-500/30 text-rose-400" : "bg-bg-2 border-emerald-500/30 text-emerald-400"}`}>
          <Check size={15} />{notification.msg}
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
function SubscriptionModal({ data, onClose, onSave }) {
  const isNew = !!data.isNew;
  const [form, setForm] = useState({ ...data });
  const [saving, setSaving] = useState(false);

  function set(field, value) { setForm((p) => ({ ...p, [field]: value })); }

  async function handleSubmit() {
    if (!form.name.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold">{isNew ? "Add Subscription Plan" : "Edit Subscription Plan"}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all"><X size={16} /></button>
        </div>

        <div className="space-y-4">
          <FormField label="Plan Name">
            <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Pro Plan" className={INPUT_CLS} />
          </FormField>

          <FormField label="Tier">
            <select value={form.tier} onChange={(e) => set("tier", e.target.value)} className={INPUT_CLS}>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="exclusive">Exclusive</option>
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Price (Rp)">
              <input type="number" min={0} value={form.price} onChange={(e) => set("price", Number(e.target.value))} className={INPUT_CLS} />
            </FormField>
            <FormField label="Duration (Days)">
              <input type="number" min={1} value={form.duration_days} onChange={(e) => set("duration_days", Number(e.target.value))} className={INPUT_CLS} />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="Max Courses">
              <input type="number" min={0} value={form.max_courses || ""} onChange={(e) => set("max_courses", e.target.value ? Number(e.target.value) : null)} placeholder="∞" className={INPUT_CLS} />
            </FormField>
            <FormField label="API Daily Limit">
              <input type="number" min={0} value={form.api_daily_limit || ""} onChange={(e) => set("api_daily_limit", e.target.value ? Number(e.target.value) : null)} placeholder="∞" className={INPUT_CLS} />
            </FormField>
            <FormField label="API Rate Limit">
              <input type="number" min={0} value={form.api_rate_limit || ""} onChange={(e) => set("api_rate_limit", e.target.value ? Number(e.target.value) : null)} placeholder="∞" className={INPUT_CLS} />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Short description…" className={`${INPUT_CLS} resize-none`} />
          </FormField>

          <FormField label="Status">
            <select value={form.is_active ? "1" : "0"} onChange={(e) => set("is_active", e.target.value === "1")} className={INPUT_CLS}>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </FormField>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all">Cancel</button>
          <button onClick={handleSubmit} disabled={!form.name.trim() || saving}
            className="flex-1 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all shadow-[0_4px_20px_rgba(139,92,246,0.25)] flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : isNew ? "Create Plan" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (<div><label className="block text-[12px] font-semibold text-text-3 mb-1.5 uppercase tracking-wide">{label}</label>{children}</div>);
}
