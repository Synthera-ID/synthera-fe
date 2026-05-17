"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Puzzle, Search, Plus, MoreHorizontal,
  Check, AlertCircle, Loader2, X, Edit3,
  Trash2, Eye, Zap, ToggleLeft, ToggleRight,
} from "lucide-react";
import apiFetch from "@/utils/apiFetch";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

// ─── Constants ────────────────────────────────────────────────────────────────
const INPUT_CLS = "w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors appearance-none";

function formatDate(str) {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const EMPTY_FORM = {
  plan_id: "",
  feature_key: "",
  feature_label: "",
  limit_value: "",
  is_unlimited: false,
  description: "",
  is_active: true,
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FeatureManagementPage() {
  const [features, setFeatures] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("All");
  const [activeMenu, setActiveMenu] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [detailFeature, setDetailFeature] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotif] = useState(null);

  // Fetch subscription plans for dropdown
  useEffect(() => {
    apiFetch.get("/admin/subscriptions?per_page=100")
      .then((res) => setPlans(res.data || []))
      .catch(() => {});
  }, []);

  const fetchFeatures = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterPlan !== "All") params.append("plan_id", filterPlan);
      params.append("per_page", "50");

      const res = await apiFetch.get(`/admin/features?${params.toString()}`);
      setFeatures(res.data || []);
    } catch {
      showNotif("Gagal memuat data feature.", "error");
    } finally {
      setLoading(false);
    }
  }, [search, filterPlan]);

  useEffect(() => {
    const t = setTimeout(fetchFeatures, 300);
    return () => clearTimeout(t);
  }, [fetchFeatures]);

  // Stats
  const totalFeatures = features.length;
  const totalActive = features.filter((f) => f.is_active).length;
  const totalInactive = features.filter((f) => !f.is_active).length;
  const totalUnlimited = features.filter((f) => f.is_unlimited).length;

  function showNotif(msg, type = "success") {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  }

  async function handleSave(form) {
    try {
      const payload = { ...form };
      delete payload.isNew;
      delete payload.id;
      delete payload.subscription;
      if (payload.limit_value === "" || payload.limit_value === null) payload.limit_value = null;
      else payload.limit_value = Number(payload.limit_value);

      if (form.isNew) {
        const res = await apiFetch.post("/admin/features", payload);
        setFeatures((prev) => [res.data, ...prev]);
        showNotif("Feature created.");
      } else {
        const res = await apiFetch.put(`/admin/features/${form.id}`, payload);
        setFeatures((prev) => prev.map((f) => (f.id === form.id ? res.data : f)));
        showNotif("Feature updated.");
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
      await apiFetch.delete(`/admin/features/${id}`);
      setFeatures((prev) => prev.filter((f) => f.id !== id));
      showNotif("Feature deleted.");
      setDeleteTarget(null);
    } catch (err) {
      showNotif(err?.data?.message || "Gagal menghapus.", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  function getPlanName(planId) {
    const plan = plans.find((p) => p.id === planId);
    return plan?.name || "-";
  }

  return (
    <>
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold mb-1.5">Feature Management</h1>
          <p className="text-text-3 text-[13px]">Manage subscription plan features and limits.</p>
        </div>
        <button
          onClick={() => setModalData({ ...EMPTY_FORM, isNew: true })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-semibold text-[13px] transition-all duration-200 shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.4)]"
        >
          <Plus size={15} /> Add Feature
        </button>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<Puzzle size={20} className="text-violet-400" />} iconBg="bg-violet-500/20" label="Total Features" value={totalFeatures} />
        <StatCard icon={<Zap size={20} className="text-emerald-400" />} iconBg="bg-emerald-500/20" label="Active" value={totalActive} />
        <StatCard icon={<ToggleLeft size={20} className="text-rose-400" />} iconBg="bg-rose-500/20" label="Inactive" value={totalInactive} />
        <StatCard icon={<ToggleRight size={20} className="text-blue-400" />} iconBg="bg-blue-500/20" label="Unlimited" value={totalUnlimited} />
      </div>

      {/* Filters */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl px-6 py-5 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search by key, label or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterPlan("All")}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold border transition-all duration-150 ${
              filterPlan === "All"
                ? "bg-primary-1/20 text-primary-3 border-primary-1/30"
                : "bg-transparent text-text-3 border-bg-3 hover:border-primary-1/20 hover:text-text-2"
            }`}
          >All Plans</button>
          {plans.map((p) => (
            <button
              key={p.id}
              onClick={() => setFilterPlan(String(p.id))}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold border transition-all duration-150 ${
                filterPlan === String(p.id)
                  ? "bg-primary-1/20 text-primary-3 border-primary-1/30"
                  : "bg-transparent text-text-3 border-bg-3 hover:border-primary-1/20 hover:text-text-2"
              }`}
            >{p.name}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-visible">
        <div className="hidden lg:grid grid-cols-[44px_1.5fr_1.5fr_1.5fr_0.8fr_0.8fr_0.8fr_1.2fr_1.2fr] gap-4 px-6 py-3.5 bg-bg-3/30 text-[11px] font-bold text-text-3 uppercase tracking-widest border-b border-bg-3">
          <span />
          <span>Feature Key</span>
          <span>Label</span>
          <span>Plan</span>
          <span>Limit</span>
          <span>Unlimited</span>
          <span>Active</span>
          <span>Created</span>
          <span>Updated</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 size={24} className="animate-spin text-primary-3" />
            <span className="text-text-3 text-[13px]">Loading features...</span>
          </div>
        ) : features.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-3">
            <AlertCircle size={36} className="opacity-40" />
            <p className="text-[14px]">No features found.</p>
          </div>
        ) : (
          features.map((f, i) => (
            <div
              key={f.id}
              className={`grid grid-cols-[44px_1fr] lg:grid-cols-[44px_1.5fr_1.5fr_1.5fr_0.8fr_0.8fr_0.8fr_1.2fr_1.2fr] gap-4 px-6 py-4 items-center hover:bg-bg-3/20 transition-colors relative ${
                i < features.length - 1 ? "border-b border-bg-3/50" : ""
              }`}
            >
              {/* Action */}
              <div className="relative flex justify-center">
                <button
                  onClick={() => setActiveMenu(activeMenu === f.id ? null : f.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:bg-bg-3 hover:text-text-1 transition-all"
                >
                  <MoreHorizontal size={16} />
                </button>

                {activeMenu === f.id && (
                  <div className="absolute left-0 top-10 z-50 w-44 bg-bg-2 border border-bg-3 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                    <button
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                      onClick={() => { setDetailFeature(f); setActiveMenu(null); }}
                    >
                      <Eye size={14} className="text-primary-3" /> View Detail
                    </button>
                    <button
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                      onClick={() => { setModalData({ ...f, isNew: false }); setActiveMenu(null); }}
                    >
                      <Edit3 size={14} className="text-amber-400" /> Edit Feature
                    </button>
                    <div className="border-t border-bg-3/60 my-0.5" />
                    <button
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-rose-400 hover:bg-rose-500/10 transition-colors"
                      onClick={() => { setDeleteTarget(f); setActiveMenu(null); }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Feature Key */}
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-text-1 truncate font-mono">{f.feature_key}</div>
                <div className="text-[11px] text-text-3 mt-0.5 lg:hidden">{f.feature_label}</div>
              </div>

              {/* Label */}
              <div className="hidden lg:block text-[13px] text-text-1 truncate">{f.feature_label}</div>

              {/* Plan */}
              <div className="hidden lg:block text-[13px] text-text-2">{f.subscription?.name || getPlanName(f.plan_id)}</div>

              {/* Limit */}
              <div className="hidden lg:block text-[13px] font-bold text-text-1">
                {f.is_unlimited ? "∞" : (f.limit_value ?? "-")}
              </div>

              {/* Unlimited */}
              <div className="hidden lg:flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full shrink-0 ${f.is_unlimited ? "bg-blue-400" : "bg-bg-3"}`} />
                <span className={`text-[12px] font-semibold ${f.is_unlimited ? "text-blue-400" : "text-text-3"}`}>
                  {f.is_unlimited ? "Yes" : "No"}
                </span>
              </div>

              {/* Active */}
              <div className="hidden lg:flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full shrink-0 ${f.is_active ? "bg-emerald-400" : "bg-rose-400"}`} />
                <span className={`text-[12px] font-semibold ${f.is_active ? "text-emerald-400" : "text-rose-400"}`}>
                  {f.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Created */}
              <div className="hidden lg:block">
                <div className="text-[11px] text-text-3">{formatDate(f.CreatedDate || f.created_at)}</div>
                <div className="text-[10px] text-text-3/60">{f.CreatedBy || "-"}</div>
              </div>

              {/* Updated */}
              <div className="hidden lg:block">
                <div className="text-[11px] text-text-3">{formatDate(f.LastUpdateDate || f.updated_at)}</div>
                <div className="text-[10px] text-text-3/60">{f.LastUpdateBy || "-"}</div>
              </div>
            </div>
          ))
        )}

        {!loading && (
          <p className="text-[12px] text-text-3 px-6 py-4 border-t border-bg-3/50">
            Showing {features.length} feature{features.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Overlays */}
      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}

      {/* Modals */}
      {modalData && <FeatureModal data={modalData} plans={plans} onClose={() => setModalData(null)} onSave={handleSave} />}
      {detailFeature && <FeatureDetailModal feature={detailFeature} plans={plans} onClose={() => setDetailFeature(null)} />}

      <ConfirmationModal
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete Feature?"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.feature_label}"? This action cannot be undone.` : ""}
        confirmText="Delete"
        variant="danger"
        icon={Trash2}
        isLoading={isDeleting}
      />

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

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function FeatureDetailModal({ feature, plans, onClose }) {
  const planName = feature.subscription?.name || plans.find((p) => p.id === feature.plan_id)?.name || "-";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-1/10 flex items-center justify-center">
              <Puzzle size={18} className="text-primary-3" />
            </div>
            <h2 className="text-[16px] font-bold">Feature Detail</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <DetailRow label="Feature Key" value={<span className="font-mono">{feature.feature_key}</span>} />
          <DetailRow label="Label" value={feature.feature_label} />
          <DetailRow label="Plan" value={planName} />
          <DetailRow label="Limit Value" value={feature.is_unlimited ? "∞ (Unlimited)" : (feature.limit_value ?? "-")} />
          <DetailRow label="Unlimited" value={
            <span className={`text-[12px] font-semibold ${feature.is_unlimited ? "text-blue-400" : "text-text-3"}`}>
              {feature.is_unlimited ? "Yes" : "No"}
            </span>
          } />
          <DetailRow label="Active" value={
            <span className={`text-[12px] font-semibold ${feature.is_active ? "text-emerald-400" : "text-rose-400"}`}>
              {feature.is_active ? "Active" : "Inactive"}
            </span>
          } />
          <DetailRow label="Description" value={feature.description || "-"} />
          <div className="border-t border-bg-3/50 my-2" />
          <DetailRow label="Created By" value={feature.CreatedBy || "-"} />
          <DetailRow label="Created Date" value={formatDate(feature.CreatedDate || feature.created_at)} />
          <DetailRow label="Last Update By" value={feature.LastUpdateBy || "-"} />
          <DetailRow label="Last Update Date" value={formatDate(feature.LastUpdateDate || feature.updated_at)} />
        </div>

        <button onClick={onClose}
          className="mt-8 w-full py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all">
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Create / Edit Modal ──────────────────────────────────────────────────────
function FeatureModal({ data, plans, onClose, onSave }) {
  const isNew = !!data.isNew;
  const [form, setForm] = useState({ ...data });
  const [saving, setSaving] = useState(false);

  function set(field, value) { setForm((p) => ({ ...p, [field]: value })); }

  async function handleSubmit() {
    if (!form.feature_key.trim() || !form.feature_label.trim() || !form.plan_id) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold">{isNew ? "Add Feature" : "Edit Feature"}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <FormField label="Subscription Plan">
            <select value={form.plan_id} onChange={(e) => set("plan_id", e.target.value)} className={INPUT_CLS}>
              <option value="">Select a plan…</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.tier})</option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Feature Key">
              <input type="text" value={form.feature_key} onChange={(e) => set("feature_key", e.target.value)}
                placeholder="e.g. api_calls" className={INPUT_CLS} />
            </FormField>
            <FormField label="Feature Label">
              <input type="text" value={form.feature_label} onChange={(e) => set("feature_label", e.target.value)}
                placeholder="e.g. API Calls" className={INPUT_CLS} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Limit Value">
              <input type="number" min={0} value={form.limit_value ?? ""} onChange={(e) => set("limit_value", e.target.value)}
                placeholder="e.g. 1000" className={INPUT_CLS} disabled={form.is_unlimited} />
            </FormField>
            <FormField label="Unlimited">
              <button
                type="button"
                onClick={() => set("is_unlimited", !form.is_unlimited)}
                className={`w-full h-[42px] flex items-center justify-center gap-2 rounded-xl border text-[13px] font-semibold transition-all ${
                  form.is_unlimited
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    : "bg-bg-3/50 border-bg-3 text-text-3 hover:border-primary-1/30"
                }`}
              >
                {form.is_unlimited ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                {form.is_unlimited ? "Unlimited" : "Limited"}
              </button>
            </FormField>
          </div>

          <FormField label="Description">
            <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
              placeholder="Feature description…" className={`${INPUT_CLS} resize-none`} />
          </FormField>

          <FormField label="Status">
            <select value={form.is_active ? "1" : "0"} onChange={(e) => set("is_active", e.target.value === "1")} className={INPUT_CLS}>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </FormField>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!form.feature_key?.trim() || !form.feature_label?.trim() || !form.plan_id || saving}
            className="flex-1 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all shadow-[0_4px_20px_rgba(139,92,246,0.25)] flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : isNew ? "Create Feature" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Row ───────────────────────────────────────────────────────────────
function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-bg-3/50 last:border-0">
      <span className="text-[12px] text-text-3 uppercase tracking-wide font-semibold shrink-0">{label}</span>
      <span className="text-[13px] text-text-1 text-right max-w-[60%]">{value}</span>
    </div>
  );
}

// ─── FormField ────────────────────────────────────────────────────────────────
function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-text-3 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
