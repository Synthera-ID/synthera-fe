"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen, Search, Plus, MoreHorizontal,
  Check, AlertCircle, Loader2, X, Edit3,
  Trash2, Eye, TrendingUp, FileText, Globe,
} from "lucide-react";
import apiFetch from "@/utils/apiFetch";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

// ─── Constants ────────────────────────────────────────────────────────────────
const TIER_STYLES = {
  basic:     { bg: "bg-bg-3",          text: "text-text-3",     border: "border-bg-3",          label: "Basic" },
  pro:       { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20", label: "Pro" },
  exclusive: { bg: "bg-amber-500/10",  text: "text-amber-400",  border: "border-amber-500/20",  label: "Exclusive" },
};

const INPUT_CLS = "w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors appearance-none";

function getTier(t) { return TIER_STYLES[t?.toLowerCase()] ?? TIER_STYLES.basic; }

function formatCurrency(n) {
  if (!n && n !== 0) return "-";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function formatDate(str) {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const EMPTY_FORM = {
  title: "", slug: "", description: "", price: 0,
  category_id: "", min_tier: "basic", thumbnail_url: "",
  video_url: "", is_published: false,
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DigitalContentManagementPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("All");
  const [activeMenu, setActiveMenu] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [detailCourse, setDetailCourse] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotif] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterTier !== "All") params.append("min_tier", filterTier.toLowerCase());
      params.append("per_page", "50");

      const res = await apiFetch.get(`/admin/courses?${params.toString()}`);
      setCourses(res.data || []);
    } catch {
      showNotif("Gagal memuat data course.", "error");
    } finally {
      setLoading(false);
    }
  }, [search, filterTier]);

  useEffect(() => {
    const t = setTimeout(fetchCourses, 300);
    return () => clearTimeout(t);
  }, [fetchCourses]);

  // Stats
  const totalCourses = courses.length;
  const totalPublished = courses.filter((c) => c.is_published).length;
  const totalDraft = courses.filter((c) => !c.is_published).length;
  const totalPro = courses.filter((c) => c.min_tier === "pro" || c.min_tier === "exclusive").length;

  function showNotif(msg, type = "success") {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  }

  async function handleSave(form) {
    try {
      const payload = { ...form };
      delete payload.isNew;
      delete payload.id;
      delete payload.category;

      if (form.isNew) {
        const res = await apiFetch.post("/admin/courses", payload);
        setCourses((prev) => [res.data?.data || res.data, ...prev]);
        showNotif("Course created.");
      } else {
        const res = await apiFetch.put(`/admin/courses/${form.id}`, payload);
        setCourses((prev) => prev.map((c) => (c.id === form.id ? (res.data?.data || res.data) : c)));
        showNotif("Course updated.");
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
      await apiFetch.delete(`/admin/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      showNotif("Course deleted.");
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
          <h1 className="text-[26px] font-bold mb-1.5">Digital Content Management</h1>
          <p className="text-text-3 text-[13px]">Create, edit and manage courses and digital content.</p>
        </div>
        <button onClick={() => setModalData({ ...EMPTY_FORM, isNew: true })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-semibold text-[13px] transition-all duration-200 shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.4)]">
          <Plus size={15} /> Add Course
        </button>
      </header>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<BookOpen size={20} className="text-violet-400" />} iconBg="bg-violet-500/20" label="Total Courses" value={totalCourses} />
        <StatCard icon={<Globe size={20} className="text-emerald-400" />} iconBg="bg-emerald-500/20" label="Published" value={totalPublished} />
        <StatCard icon={<FileText size={20} className="text-amber-400" />} iconBg="bg-amber-500/20" label="Draft" value={totalDraft} />
        <StatCard icon={<TrendingUp size={20} className="text-blue-400" />} iconBg="bg-blue-500/20" label="Premium" value={totalPro} />
      </div>

      <div className="bg-bg-2 border border-bg-3 rounded-2xl px-6 py-5 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input type="text" placeholder="Search by title or description…" value={search} onChange={(e) => setSearch(e.target.value)}
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
          <span className="text-text-3 text-[13px]">Loading courses...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-3">
          <AlertCircle size={36} className="opacity-40" />
          <p className="text-[14px]">No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((c) => {
            const tier = getTier(c.min_tier);
            return (
              <div key={c.id} className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden flex flex-col hover:border-primary-1/30 transition-all duration-200 group">
                {/* Thumbnail */}
                <div className="h-[140px] bg-gradient-to-br from-[#2A1B38] to-[#171321] flex items-center justify-center relative">
                  {c.thumbnail_url ? (
                    <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen size={28} className="text-white/40" />
                  )}
                  {/* Published badge */}
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    c.is_published ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {c.is_published ? "Published" : "Draft"}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14px] font-bold text-text-1 truncate">{c.title}</h3>
                      <p className="text-[11px] text-text-3 mt-0.5">{c.category?.name || "Uncategorized"}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${tier.bg} ${tier.text} ${tier.border} ml-2 shrink-0`}>
                      {tier.label}
                    </span>
                  </div>

                  <p className="text-[12px] text-text-3 leading-relaxed line-clamp-2 mb-3">{c.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[16px] font-bold text-text-1">{formatCurrency(c.price)}</span>
                    <span className="text-[11px] text-text-3">{c.slug}</span>
                  </div>

                  {/* Audit info */}
                  <div className="pt-3 border-t border-bg-3/50 space-y-1 mt-auto">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-text-3">Created</span>
                      <span className="text-text-2">{formatDate(c.CreatedDate || c.created_at)} <span className="text-text-3/60">by {c.CreatedBy || "-"}</span></span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-text-3">Updated</span>
                      <span className="text-text-2">{formatDate(c.LastUpdateDate || c.updated_at)} <span className="text-text-3/60">by {c.LastUpdateBy || "-"}</span></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setDetailCourse(c)}
                      className="flex-1 h-[36px] flex items-center justify-center gap-1.5 rounded-xl bg-transparent border border-bg-3 text-text-3 text-[12px] font-semibold hover:border-primary-1/30 hover:text-text-1 transition-all">
                      <Eye size={13} /> View
                    </button>
                    <button onClick={() => setModalData({ ...c, isNew: false })}
                      className="flex-1 h-[36px] flex items-center justify-center gap-1.5 rounded-xl bg-transparent border border-primary-1/20 text-primary-3 text-[12px] font-semibold hover:bg-primary-1/10 transition-all">
                      <Edit3 size={13} /> Edit
                    </button>
                    <button onClick={() => setDeleteTarget(c)}
                      className="h-[36px] w-[36px] flex items-center justify-center rounded-xl bg-transparent border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {modalData && <CourseModal data={modalData} onClose={() => setModalData(null)} onSave={handleSave} />}
      {detailCourse && <CourseDetailModal course={detailCourse} onClose={() => setDetailCourse(null)} />}

      <ConfirmationModal isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete Course?" message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.title}"?` : ""} confirmText="Delete" variant="danger" icon={Trash2} isLoading={isDeleting} />

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

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function CourseDetailModal({ course, onClose }) {
  const tier = getTier(course.min_tier);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[16px] font-bold">Course Detail</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <DetailRow label="Title" value={course.title} />
          <DetailRow label="Slug" value={course.slug} />
          <DetailRow label="Category" value={course.category?.name || "-"} />
          <DetailRow label="Price" value={<span className="text-emerald-400 font-bold">{formatCurrency(course.price)}</span>} />
          <DetailRow label="Min Tier" value={<span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${tier.bg} ${tier.text} ${tier.border}`}>{tier.label}</span>} />
          <DetailRow label="Published" value={course.is_published ? "Yes" : "No"} />
          <DetailRow label="Video URL" value={course.video_url || "-"} />
          <DetailRow label="Description" value={course.description} />
          <div className="border-t border-bg-3/50 my-2" />
          <DetailRow label="Created By" value={course.CreatedBy || "-"} />
          <DetailRow label="Created Date" value={formatDate(course.CreatedDate || course.created_at)} />
          <DetailRow label="Last Update By" value={course.LastUpdateBy || "-"} />
          <DetailRow label="Last Update Date" value={formatDate(course.LastUpdateDate || course.updated_at)} />
        </div>
        <button onClick={onClose} className="mt-8 w-full py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all">Close</button>
      </div>
    </div>
  );
}

// ─── Create / Edit Modal ──────────────────────────────────────────────────────
function CourseModal({ data, onClose, onSave }) {
  const isNew = !!data.isNew;
  const [form, setForm] = useState({ ...data });
  const [saving, setSaving] = useState(false);

  function set(field, value) { setForm((p) => ({ ...p, [field]: value })); }

  async function handleSubmit() {
    if (!form.title.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold">{isNew ? "Add Course" : "Edit Course"}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all"><X size={16} /></button>
        </div>

        <div className="space-y-4">
          <FormField label="Title">
            <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. API Integration Guide" className={INPUT_CLS} />
          </FormField>

          <FormField label="Slug">
            <input type="text" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="e.g. api-integration-guide" className={INPUT_CLS} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Price (Rp)">
              <input type="number" min={0} value={form.price} onChange={(e) => set("price", Number(e.target.value))} className={INPUT_CLS} />
            </FormField>
            <FormField label="Category ID">
              <input type="number" min={1} value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className={INPUT_CLS} />
            </FormField>
          </div>

          <FormField label="Min Tier">
            <select value={form.min_tier} onChange={(e) => set("min_tier", e.target.value)} className={INPUT_CLS}>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="exclusive">Exclusive</option>
            </select>
          </FormField>

          <FormField label="Description">
            <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Course description…" className={`${INPUT_CLS} resize-none`} />
          </FormField>

          <FormField label="Thumbnail URL">
            <input type="text" value={form.thumbnail_url || ""} onChange={(e) => set("thumbnail_url", e.target.value)} placeholder="https://..." className={INPUT_CLS} />
          </FormField>

          <FormField label="Video URL">
            <input type="text" value={form.video_url || ""} onChange={(e) => set("video_url", e.target.value)} placeholder="https://..." className={INPUT_CLS} />
          </FormField>

          <FormField label="Published">
            <select value={form.is_published ? "1" : "0"} onChange={(e) => set("is_published", e.target.value === "1")} className={INPUT_CLS}>
              <option value="0">Draft</option>
              <option value="1">Published</option>
            </select>
          </FormField>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all">Cancel</button>
          <button onClick={handleSubmit} disabled={!form.title.trim() || !form.slug.trim() || saving}
            className="flex-1 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all shadow-[0_4px_20px_rgba(139,92,246,0.25)] flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : isNew ? "Create Course" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-bg-3/50 last:border-0">
      <span className="text-[12px] text-text-3 uppercase tracking-wide font-semibold shrink-0">{label}</span>
      <span className="text-[13px] text-text-1 text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function FormField({ label, children }) {
  return (<div><label className="block text-[12px] font-semibold text-text-3 mb-1.5 uppercase tracking-wide">{label}</label>{children}</div>);
}
