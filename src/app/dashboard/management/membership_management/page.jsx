"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LayoutList, Search, Plus, MoreHorizontal,
  Check, AlertCircle, Loader2, X, Edit3,
  Trash2, Users, Crown, Zap, Star, BadgeCheck,
  ArrowUpDown,
} from "lucide-react";
import apiFetch from "@/utils/apiFetch";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  active:    { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Active" },
  expired:   { bg: "bg-rose-500/10",    text: "text-rose-400",    dot: "bg-rose-400",    label: "Expired" },
  cancelled: { bg: "bg-bg-3",           text: "text-text-3",      dot: "bg-text-3",      label: "Cancelled" },
};

const AVATAR_COLORS = [
  "bg-violet-500/20 text-violet-400", "bg-emerald-500/20 text-emerald-400",
  "bg-amber-500/20 text-amber-400", "bg-blue-500/20 text-blue-400",
  "bg-rose-500/20 text-rose-400", "bg-cyan-500/20 text-cyan-400",
];

const INPUT_CLS = "w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors appearance-none";
const STATUS_FILTERS = ["All", "Active", "Expired", "Cancelled"];

function formatDate(str) {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDateShort(str) {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function getStatus(s) { return STATUS_STYLES[s?.toLowerCase()] ?? STATUS_STYLES.active; }
function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}
function getAvatarColor(id) { return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length]; }

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MembershipManagementPage() {
  const [memberships, setMemberships] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilter] = useState("All");
  const [activeMenu, setActiveMenu] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotif] = useState(null);

  // Fetch plans for dropdown
  useEffect(() => {
    apiFetch.get("/subscriptions").then((res) => {
      setPlans(res?.data || res || []);
    }).catch(() => {});
  }, []);

  const fetchMemberships = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterStatus !== "All") params.append("status", filterStatus.toLowerCase());
      params.append("per_page", "50");

      const res = await apiFetch.get(`/admin/memberships?${params.toString()}`);
      setMemberships(res.data || []);
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
  const totalActive = memberships.filter((m) => m.membership_status === "active").length;
  const totalExpired = memberships.filter((m) => m.membership_status === "expired").length;
  const totalCancelled = memberships.filter((m) => m.membership_status === "cancelled").length;
  const totalMembers = memberships.length;

  function showNotif(msg, type = "success") {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  }

  async function handleSave(form) {
    try {
      const payload = {
        user_id: form.user_id,
        plan_id: Number(form.plan_id),
        membership_status: form.membership_status,
        start_date: form.start_date,
        end_date: form.end_date,
        auto_renew: form.auto_renew,
      };

      if (form.isNew) {
        const res = await apiFetch.post("/admin/memberships", payload);
        setMemberships((prev) => [res.data, ...prev]);
        showNotif("Membership created.");
      } else {
        const res = await apiFetch.put(`/admin/memberships/${form.id}`, payload);
        setMemberships((prev) => prev.map((m) => (m.id === form.id ? res.data : m)));
        showNotif("Membership updated.");
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
      await apiFetch.delete(`/admin/memberships/${id}`);
      setMemberships((prev) => prev.filter((m) => m.id !== id));
      showNotif("Membership deleted.");
      setDeleteTarget(null);
    } catch (err) {
      showNotif(err?.data?.message || "Gagal menghapus.", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold mb-1.5">Membership Management</h1>
          <p className="text-text-3 text-[13px]">Manage user memberships, upgrade or downgrade plans.</p>
        </div>
        <button onClick={() => setModalData({ isNew: true, user_id: "", plan_id: "", membership_status: "active", start_date: "", end_date: "", auto_renew: false })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-semibold text-[13px] transition-all duration-200 shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.4)]">
          <Plus size={15} /> Add Membership
        </button>
      </header>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<Users size={20} className="text-violet-400" />} iconBg="bg-violet-500/20" label="Total Members" value={totalMembers} />
        <StatCard icon={<Check size={20} className="text-emerald-400" />} iconBg="bg-emerald-500/20" label="Active" value={totalActive} />
        <StatCard icon={<AlertCircle size={20} className="text-rose-400" />} iconBg="bg-rose-500/20" label="Expired" value={totalExpired} />
        <StatCard icon={<X size={20} className="text-text-3" />} iconBg="bg-bg-3" label="Cancelled" value={totalCancelled} />
      </div>

      <div className="bg-bg-2 border border-bg-3 rounded-2xl px-6 py-5 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input type="text" placeholder="Search by user name or email…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold border transition-all duration-150 ${
                filterStatus === s ? "bg-primary-1/20 text-primary-3 border-primary-1/30" : "bg-transparent text-text-3 border-bg-3 hover:border-primary-1/20 hover:text-text-2"
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden">
        <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1.5fr_1.5fr_44px] gap-4 px-6 py-3.5 bg-bg-3/30 text-[11px] font-bold text-text-3 uppercase tracking-widest border-b border-bg-3">
          <span>User</span><span>Plan</span><span>Status</span><span>Start</span><span>End</span><span>Created</span><span>Updated</span><span />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 size={24} className="animate-spin text-primary-3" />
            <span className="text-text-3 text-[13px]">Loading memberships...</span>
          </div>
        ) : memberships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-3">
            <AlertCircle size={36} className="opacity-40" />
            <p className="text-[14px]">No memberships found.</p>
          </div>
        ) : (
          memberships.map((m, i) => {
            const st = getStatus(m.membership_status);
            return (
              <div key={m.id} className={`grid grid-cols-[1fr_44px] lg:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1.5fr_1.5fr_44px] gap-4 px-6 py-4 items-center hover:bg-bg-3/20 transition-colors relative ${
                i < memberships.length - 1 ? "border-b border-bg-3/50" : ""
              }`}>
                {/* User */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-[11px] shrink-0 ${getAvatarColor(m.user_id)}`}>
                    {getInitials(m.user?.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-text-1 truncate">{m.user?.name || "-"}</div>
                    <div className="text-[11px] text-text-3 truncate">{m.user?.email || "-"}</div>
                  </div>
                </div>

                {/* Plan */}
                <div className="hidden lg:block">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border bg-violet-500/10 text-violet-400 border-violet-500/20">
                    {m.subscription?.name || "-"}
                  </span>
                </div>

                {/* Status */}
                <div className="hidden lg:flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                  <span className={`text-[12px] font-semibold ${st.text}`}>{st.label}</span>
                </div>

                {/* Start */}
                <div className="hidden lg:block text-[13px] text-text-2">{formatDateShort(m.start_date)}</div>

                {/* End */}
                <div className="hidden lg:block text-[13px] text-text-2">{formatDateShort(m.end_date)}</div>

                {/* Created */}
                <div className="hidden lg:block">
                  <div className="text-[11px] text-text-3">{formatDate(m.CreatedDate || m.created_at)}</div>
                  <div className="text-[10px] text-text-3/60">{m.CreatedBy || "-"}</div>
                </div>

                {/* Updated */}
                <div className="hidden lg:block">
                  <div className="text-[11px] text-text-3">{formatDate(m.LastUpdateDate || m.updated_at)}</div>
                  <div className="text-[10px] text-text-3/60">{m.LastUpdateBy || "-"}</div>
                </div>

                {/* Action */}
                <div className="relative flex justify-center">
                  <button onClick={() => setActiveMenu(activeMenu === m.id ? null : m.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:bg-bg-3 hover:text-text-1 transition-all">
                    <MoreHorizontal size={16} />
                  </button>
                  {activeMenu === m.id && (
                    <div className="absolute right-0 top-10 z-50 w-52 bg-bg-2 border border-bg-3 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                        onClick={() => { setModalData({ ...m, isNew: false, plan_id: m.plan_id }); setActiveMenu(null); }}>
                        <Edit3 size={14} className="text-primary-3" /> Edit Membership
                      </button>
                      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                        onClick={() => { setModalData({ ...m, isNew: false, plan_id: m.plan_id, _upgradeMode: true }); setActiveMenu(null); }}>
                        <ArrowUpDown size={14} className="text-amber-400" /> Upgrade / Downgrade
                      </button>
                      <div className="border-t border-bg-3/60 my-0.5" />
                      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-rose-400 hover:bg-rose-500/10 transition-colors"
                        onClick={() => { setDeleteTarget(m); setActiveMenu(null); }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {!loading && <p className="text-[12px] text-text-3 px-6 py-4 border-t border-bg-3/50">Showing {memberships.length} membership{memberships.length !== 1 ? "s" : ""}</p>}
      </div>

      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}

      {modalData && <MembershipModal data={modalData} plans={plans} onClose={() => setModalData(null)} onSave={handleSave} />}

      <ConfirmationModal isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete Membership?" message={deleteTarget ? `Are you sure you want to delete membership for "${deleteTarget.user?.name}"?` : ""} confirmText="Delete" variant="danger" icon={Trash2} isLoading={isDeleting} />

      {notification && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[13px] font-semibold shadow-2xl border transition-all duration-300 ${
          notification.type === "error" ? "bg-bg-2 border-rose-500/30 text-rose-400" : "bg-bg-2 border-emerald-500/30 text-emerald-400"}`}>
          <Check size={15} />{notification.msg}
        </div>
      )}
    </>
  );
}

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
function MembershipModal({ data, plans, onClose, onSave }) {
  const isNew = !!data.isNew;
  const isUpgrade = !!data._upgradeMode;
  const [form, setForm] = useState({
    id: data.id,
    user_id: data.user_id || "",
    plan_id: data.plan_id || "",
    membership_status: data.membership_status || "active",
    start_date: data.start_date || "",
    end_date: data.end_date || "",
    auto_renew: data.auto_renew || false,
    isNew: data.isNew,
  });
  const [saving, setSaving] = useState(false);

  function set(field, value) { setForm((p) => ({ ...p, [field]: value })); }

  async function handleSubmit() {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold">
            {isNew ? "Add Membership" : isUpgrade ? "Upgrade / Downgrade Plan" : "Edit Membership"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all"><X size={16} /></button>
        </div>

        {isUpgrade && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[12px] text-amber-400 font-medium flex items-center gap-2">
            <ArrowUpDown size={14} />
            Changing the plan will automatically adjust the end date based on the new plan duration.
          </div>
        )}

        <div className="space-y-4">
          {isNew && (
            <FormField label="User ID">
              <input type="number" value={form.user_id} onChange={(e) => set("user_id", e.target.value)} placeholder="Enter user ID" className={INPUT_CLS} />
            </FormField>
          )}

          {!isNew && !isUpgrade && (
            <div className="p-3 rounded-xl bg-bg-3/50 border border-bg-3">
              <p className="text-[12px] text-text-3">User: <strong className="text-text-1">{data.user?.name}</strong> ({data.user?.email})</p>
            </div>
          )}

          <FormField label="Subscription Plan">
            <select value={form.plan_id} onChange={(e) => set("plan_id", e.target.value)} className={INPUT_CLS}>
              <option value="">Select Plan</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.tier} ({p.duration_days} days)</option>
              ))}
            </select>
          </FormField>

          {!isUpgrade && (
            <>
              <FormField label="Status">
                <select value={form.membership_status} onChange={(e) => set("membership_status", e.target.value)} className={INPUT_CLS}>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Start Date">
                  <input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} className={INPUT_CLS} />
                </FormField>
                <FormField label="End Date">
                  <input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} className={INPUT_CLS} />
                </FormField>
              </div>

              <FormField label="Auto Renew">
                <select value={form.auto_renew ? "1" : "0"} onChange={(e) => set("auto_renew", e.target.value === "1")} className={INPUT_CLS}>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </FormField>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all">Cancel</button>
          <button onClick={handleSubmit} disabled={!form.plan_id || saving}
            className="flex-1 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all shadow-[0_4px_20px_rgba(139,92,246,0.25)] flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : isNew ? "Create" : isUpgrade ? "Change Plan" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (<div><label className="block text-[12px] font-semibold text-text-3 mb-1.5 uppercase tracking-wide">{label}</label>{children}</div>);
}
