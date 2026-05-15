"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Wallet, Search, Plus, MoreHorizontal,
  Check, AlertCircle, Loader2, X, Edit3,
  Trash2, CreditCard, TrendingUp, Clock, XCircle,
} from "lucide-react";
import apiFetch from "@/utils/apiFetch";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  pending: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", dot: "bg-amber-400", label: "Pending" },
  success: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400", label: "Success" },
  failed:  { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", dot: "bg-rose-400", label: "Failed" },
};

const METHOD_STYLES = {
  credit_card:   { label: "Credit Card",   color: "text-violet-400" },
  bank_transfer: { label: "Bank Transfer", color: "text-blue-400" },
  e_wallet:      { label: "E-Wallet",      color: "text-emerald-400" },
  qris:          { label: "QRIS",          color: "text-amber-400" },
};

const STATUS_FILTERS = ["All", "Pending", "Success", "Failed"];

const INPUT_CLS = "w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors appearance-none";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(str) {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatCurrency(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

function getStatusStyle(status) {
  return STATUS_STYLES[status?.toLowerCase()] ?? STATUS_STYLES.pending;
}

function getMethodLabel(method) {
  return METHOD_STYLES[method?.toLowerCase()] ?? { label: method || "Other", color: "text-text-3" };
}

const EMPTY_FORM = {
  payment_method: "qris",
  payment_code: "",
  payment_gateway: "DuitKu",
  min_amount: 0,
  payment_status: "pending",
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PaymentManagementPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeMenu, setActiveMenu] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterStatus !== "All") params.append("status", filterStatus.toLowerCase());
      params.append("per_page", "100");

      const res = await apiFetch.get(`/admin/payments?${params.toString()}`);
      setPayments(res.data || []);
    } catch {
      showNotification("Gagal memuat data payment.", "error");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    const t = setTimeout(fetchPayments, 300);
    return () => clearTimeout(t);
  }, [fetchPayments]);

  // Stats
  const totalPayments = payments.length;
  const totalSuccess = payments.filter((p) => p.payment_status === "success").length;
  const totalPending = payments.filter((p) => p.payment_status === "pending").length;
  const totalFailed = payments.filter((p) => p.payment_status === "failed").length;

  function showNotification(msg, type = "success") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }

  // Save (create/update)
  async function handleSave(form) {
    try {
      if (form.isNew) {
        const res = await apiFetch.post("/admin/payments", form);
        setPayments((prev) => [res.data, ...prev]);
        showNotification("Payment method created.");
      } else {
        const res = await apiFetch.put(`/admin/payments/${form.id}`, form);
        setPayments((prev) => prev.map((p) => (p.id === form.id ? res.data : p)));
        showNotification("Payment method updated.");
      }
      setModalData(null);
    } catch (err) {
      const msg = err?.data?.message || "Gagal menyimpan payment method.";
      showNotification(msg, "error");
    }
  }

  // Delete
  async function handleDelete(id) {
    setIsDeleting(true);
    try {
      await apiFetch.delete(`/admin/payments/${id}`);
      setPayments((prev) => prev.filter((p) => p.id !== id));
      showNotification("Payment method deleted.");
      setDeleteTarget(null);
    } catch (err) {
      showNotification(err?.data?.message || "Gagal menghapus.", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold mb-1.5">Payment Management</h1>
          <p className="text-text-3 text-[13px]">Manage payment methods available on your platform.</p>
        </div>
        <button
          onClick={() => setModalData({ ...EMPTY_FORM, isNew: true })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-semibold text-[13px] transition-all duration-200 shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.4)]"
        >
          <Plus size={15} /> Add Payment Method
        </button>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<CreditCard size={20} className="text-violet-400" />} iconBg="bg-violet-500/20" label="Total Methods" value={totalPayments} />
        <StatCard icon={<TrendingUp size={20} className="text-emerald-400" />} iconBg="bg-emerald-500/20" label="Success" value={totalSuccess} />
        <StatCard icon={<Clock size={20} className="text-amber-400" />} iconBg="bg-amber-500/20" label="Pending" value={totalPending} />
        <StatCard icon={<XCircle size={20} className="text-rose-400" />} iconBg="bg-rose-500/20" label="Failed" value={totalFailed} />
      </div>

      {/* Filters */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl px-6 py-5 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search by method, code or gateway…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
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

      {/* Table */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_1.5fr_1fr_1fr_1.5fr_1.5fr_44px] gap-4 px-6 py-3.5 bg-bg-3/30 text-[11px] font-bold text-text-3 uppercase tracking-widest border-b border-bg-3">
          <span>Method</span>
          <span>Code</span>
          <span>Gateway</span>
          <span>Min Amount</span>
          <span>Status</span>
          <span>Created</span>
          <span>Updated</span>
          <span />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 size={24} className="animate-spin text-primary-3" />
            <span className="text-text-3 text-[13px]">Loading payment methods...</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-3">
            <AlertCircle size={36} className="opacity-40" />
            <p className="text-[14px]">No payment methods found.</p>
          </div>
        ) : (
          payments.map((p, i) => {
            const st = getStatusStyle(p.payment_status);
            const mt = getMethodLabel(p.payment_method);
            return (
              <div
                key={p.id}
                className={`grid grid-cols-[1fr_44px] md:grid-cols-[1.5fr_1.5fr_1.5fr_1fr_1fr_1.5fr_1.5fr_44px] gap-4 px-6 py-4 items-center hover:bg-bg-3/20 transition-colors relative ${
                  i < payments.length - 1 ? "border-b border-bg-3/50" : ""
                }`}
              >
                {/* Method */}
                <div className="min-w-0">
                  <div className={`text-[13px] font-semibold ${mt.color}`}>{mt.label}</div>
                </div>

                {/* Code */}
                <div className="hidden md:block text-[13px] text-text-1 font-mono">{p.payment_code}</div>

                {/* Gateway */}
                <div className="hidden md:block text-[13px] text-text-2">{p.payment_gateway}</div>

                {/* Min Amount */}
                <div className="hidden md:block text-[13px] font-bold text-text-1">
                  {formatCurrency(p.min_amount)}
                </div>

                {/* Status */}
                <div className="hidden md:flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                  <span className={`text-[12px] font-semibold ${st.text}`}>{st.label}</span>
                </div>

                {/* Created */}
                <div className="hidden md:block">
                  <div className="text-[11px] text-text-3">{formatDate(p.CreatedDate || p.created_at)}</div>
                  <div className="text-[10px] text-text-3/60">{p.CreatedBy || "-"}</div>
                </div>

                {/* Updated */}
                <div className="hidden md:block">
                  <div className="text-[11px] text-text-3">{formatDate(p.LastUpdateDate || p.updated_at)}</div>
                  <div className="text-[10px] text-text-3/60">{p.LastUpdateBy || "-"}</div>
                </div>

                {/* Action */}
                <div className="relative flex justify-center">
                  <button
                    onClick={() => setActiveMenu(activeMenu === p.id ? null : p.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:bg-bg-3 hover:text-text-1 transition-all"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {activeMenu === p.id && (
                    <div className="absolute right-0 top-10 z-50 w-44 bg-bg-2 border border-bg-3 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                      <button
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                        onClick={() => { setModalData({ ...p, isNew: false }); setActiveMenu(null); }}
                      >
                        <Edit3 size={14} className="text-primary-3" /> Edit Method
                      </button>
                      <div className="border-t border-bg-3/60 my-0.5" />
                      <button
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-rose-400 hover:bg-rose-500/10 transition-colors"
                        onClick={() => { setDeleteTarget(p); setActiveMenu(null); }}
                      >
                        <Trash2 size={14} /> Delete Method
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {!loading && (
          <p className="text-[12px] text-text-3 px-6 py-4 border-t border-bg-3/50">
            Showing {payments.length} payment method{payments.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Close dropdown on outside click */}
      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}

      {/* Create / Edit Modal */}
      {modalData && (
        <PaymentModal
          data={modalData}
          onClose={() => setModalData(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete Payment Method?"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.payment_code}"? This action cannot be undone.` : ""}
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

// ─── Create / Edit Modal ──────────────────────────────────────────────────────
function PaymentModal({ data, onClose, onSave }) {
  const isNew = !!data.isNew;
  const [form, setForm] = useState({ ...data });
  const [saving, setSaving] = useState(false);

  function set(field, value) { setForm((p) => ({ ...p, [field]: value })); }

  async function handleSubmit() {
    if (!form.payment_code.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold">{isNew ? "Add Payment Method" : "Edit Payment Method"}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <FormField label="Payment Method">
            <select value={form.payment_method} onChange={(e) => set("payment_method", e.target.value)} className={INPUT_CLS}>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="e_wallet">E-Wallet</option>
              <option value="qris">QRIS</option>
            </select>
          </FormField>

          <FormField label="Payment Code">
            <input type="text" value={form.payment_code} onChange={(e) => set("payment_code", e.target.value)}
              placeholder="e.g. SP, BC, M1" className={INPUT_CLS} />
          </FormField>

          <FormField label="Payment Gateway">
            <input type="text" value={form.payment_gateway} onChange={(e) => set("payment_gateway", e.target.value)}
              placeholder="e.g. DuitKu" className={INPUT_CLS} />
          </FormField>

          <FormField label="Min Amount (Rp)">
            <input type="number" min={0} value={form.min_amount} onChange={(e) => set("min_amount", Number(e.target.value))}
              className={INPUT_CLS} />
          </FormField>

          <FormField label="Status">
            <select value={form.payment_status} onChange={(e) => set("payment_status", e.target.value)} className={INPUT_CLS}>
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </FormField>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!form.payment_code.trim() || saving}
            className="flex-1 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all shadow-[0_4px_20px_rgba(139,92,246,0.25)] flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : isNew ? "Create Method" : "Save Changes"}
          </button>
        </div>
      </div>
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
