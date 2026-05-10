"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users, Search, Plus, MoreHorizontal, Mail, Shield,
  ShieldOff, Trash2, Edit3, X, Check, AlertCircle,
  UserCheck, UserX, Crown, Loader2,
} from "lucide-react";
import apiFetch from "@/utils/apiFetch";

// ─── Styles ───────────────────────────────────────────────────────────────────
const ROLE_STYLES = {
  admin: { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/30", icon: Crown },
  member: { bg: "bg-bg-3", text: "text-text-3", border: "border-bg-3", icon: null },
};

const STATUS_STYLES = {
  active: { dot: "bg-emerald-400", text: "text-emerald-400", label: "Active" },
  inactive: { dot: "bg-text-3", text: "text-text-3", label: "Inactive" },
};

const AVATAR_COLORS = [
  "bg-violet-500/20 text-violet-400",
  "bg-emerald-500/20 text-emerald-400",
  "bg-amber-500/20 text-amber-400",
  "bg-blue-500/20 text-blue-400",
  "bg-rose-500/20 text-rose-400",
  "bg-cyan-500/20 text-cyan-400",
];

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function getAvatarColor(id) {
  return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeMenu, setActiveMenu] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filterRole !== "All") params.append("role", filterRole.toLowerCase());
      if (filterStatus !== "All") params.append("status", filterStatus.toLowerCase());
      params.append("per_page", "100");

      const res = await apiFetch.get(`/admin/users?${params.toString()}`);
      setUsers(res.data || []);
    } catch {
      showNotification("Gagal memuat data user.", "error");
    } finally {
      setLoading(false);
    }
  }, [search, filterRole, filterStatus]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(debounce);
  }, [fetchUsers]);

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active).length;
  const admins = users.filter((u) => u.role === "admin").length;
  const inactiveUsers = users.filter((u) => !u.is_active).length;

  function showNotification(msg, type = "success") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }

  // ── Delete ──
  async function handleDelete(id) {
    try {
      await apiFetch.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showNotification("User deleted successfully.");
    } catch (err) {
      showNotification(err?.data?.message || "Gagal menghapus user.", "error");
    }
    setDeleteConfirm(null);
  }

  // ── Save (create/update) ──
  async function handleSave(formData, isNew) {
    try {
      if (isNew) {
        const res = await apiFetch.post("/admin/users", formData);
        setUsers((prev) => [res.data, ...prev]);
        showNotification("User created successfully.");
      } else {
        const res = await apiFetch.put(`/admin/users/${formData.id}`, formData);
        setUsers((prev) => prev.map((u) => (u.id === formData.id ? res.data : u)));
        showNotification("User updated successfully.");
      }
      setModalUser(null);
    } catch (err) {
      const msg = err?.data?.message || Object.values(err?.data?.errors || {})?.[0]?.[0] || "Gagal menyimpan user.";
      showNotification(msg, "error");
    }
  }

  // ── Toggle Status ──
  async function handleToggleStatus(user) {
    try {
      const res = await apiFetch.put(`/admin/users/${user.id}`, {
        is_active: !user.is_active,
      });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? res.data : u)));
      showNotification("User status updated.");
    } catch {
      showNotification("Gagal mengubah status.", "error");
    }
    setActiveMenu(null);
  }

  return (
    <>
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold mb-1.5">User Management</h1>
          <p className="text-text-3 text-[13px]">View, manage, and control user access across your platform.</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-semibold text-[13px] transition-all duration-200 shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.4)]"
          onClick={() => setModalUser({ isNew: true, name: "", email: "", password: "", role: "member", phone: "", company_code: "Synthera", is_active: true })}
        >
          <Plus size={16} />
          Add User
        </button>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<Users size={20} className="text-violet-400" />} iconBg="bg-violet-500/20" label="Total Users" value={totalUsers} />
        <StatCard icon={<UserCheck size={20} className="text-emerald-400" />} iconBg="bg-emerald-500/20" label="Active Users" value={activeUsers} />
        <StatCard icon={<Crown size={20} className="text-amber-400" />} iconBg="bg-amber-500/20" label="Admins" value={admins} />
        <StatCard icon={<UserX size={20} className="text-rose-400" />} iconBg="bg-rose-500/20" label="Inactive" value={inactiveUsers} />
      </div>

      {/* Filters */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl px-6 py-5 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          {["All", "Admin", "Member"].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold border transition-all duration-150 ${
                filterRole === r
                  ? "bg-primary-1/20 text-primary-3 border-primary-1/30"
                  : "bg-transparent text-text-3 border-bg-3 hover:border-primary-1/20 hover:text-text-2"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {["All", "Active", "Inactive"].map((s) => (
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
      <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-visible">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_44px] gap-4 px-6 py-3.5 bg-bg-3/30 text-[11px] font-bold text-text-3 uppercase tracking-widest border-b border-bg-3">
          <span>User</span><span>Email</span><span>Role</span><span>Status</span><span>Company</span><span />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 size={24} className="animate-spin text-primary-3" />
            <span className="text-text-3 text-[13px]">Memuat data user...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-3">
            <AlertCircle size={36} className="opacity-40" />
            <p className="text-[14px]">No users match your filters.</p>
          </div>
        ) : (
          users.map((user, i) => {
            const role = user.role || "member";
            const roleStyle = ROLE_STYLES[role] ?? ROLE_STYLES.member;
            const isActive = !!user.is_active;
            const statusStyle = isActive ? STATUS_STYLES.active : STATUS_STYLES.inactive;
            const RoleIcon = roleStyle.icon;

            return (
              <div
                key={user.id}
                className={`grid grid-cols-[2fr_2fr_1fr_1fr_1fr_44px] gap-4 px-6 py-4 items-center hover:bg-bg-3/20 transition-colors relative ${
                  i < users.length - 1 ? "border-b border-bg-3/50" : ""
                }`}
              >
                {/* User */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[12px] shrink-0 ${getAvatarColor(user.id)}`}>
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold truncate">{user.name}</div>
                    <div className="text-[11px] text-text-3 truncate">{formatDate(user.created_at)}</div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 min-w-0">
                  <Mail size={13} className="text-text-3 shrink-0" />
                  <span className="text-[13px] text-text-2 truncate">{user.email}</span>
                </div>

                {/* Role */}
                <span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
                    {RoleIcon && <RoleIcon size={11} />}
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </span>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusStyle.dot} shrink-0`} />
                  <span className={`text-[12px] font-semibold ${statusStyle.text}`}>{statusStyle.label}</span>
                </div>

                {/* Company */}
                <span className="text-[13px] text-text-2 font-medium truncate">{user.company_code || "-"}</span>

                {/* Action menu */}
                <div className="relative flex justify-center">
                  <button
                    onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:bg-bg-3 hover:text-text-1 transition-all"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {activeMenu === user.id && (
                    <div className="absolute right-0 top-10 z-50 w-44 bg-bg-2 border border-bg-3 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                      <button
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                        onClick={() => { setModalUser({ ...user, isNew: false }); setActiveMenu(null); }}
                      >
                        <Edit3 size={14} className="text-primary-3" /> Edit User
                      </button>
                      <button
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                        onClick={() => handleToggleStatus(user)}
                      >
                        {isActive ? (<><ShieldOff size={14} className="text-amber-400" /> Deactivate</>) : (<><Shield size={14} className="text-emerald-400" /> Activate</>)}
                      </button>
                      <div className="border-t border-bg-3/60 my-0.5" />
                      <button
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-rose-400 hover:bg-rose-500/10 transition-colors"
                        onClick={() => { setDeleteConfirm(user); setActiveMenu(null); }}
                      >
                        <Trash2 size={14} /> Delete User
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {!loading && <p className="text-[12px] text-text-3 mt-4 px-6 pb-4">Showing {users.length} users</p>}
      </div>

      {/* Overlays */}
      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}
      {modalUser && <EditUserModal user={modalUser} onClose={() => setModalUser(null)} onSave={handleSave} />}
      {deleteConfirm && <DeleteConfirmModal user={deleteConfirm} onCancel={() => setDeleteConfirm(null)} onConfirm={() => handleDelete(deleteConfirm.id)} />}

      {/* Toast */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[13px] font-semibold shadow-2xl border transition-all duration-300 ${
          notification.type === "error" ? "bg-bg-2 border-rose-500/30 text-rose-400" : "bg-bg-2 border-emerald-500/30 text-emerald-400"
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
        <div className="text-[24px] font-bold tracking-tight leading-none">{value}</div>
      </div>
    </div>
  );
}

// ─── Edit / Add User Modal ────────────────────────────────────────────────────
function EditUserModal({ user, onClose, onSave }) {
  const isNew = !!user.isNew;
  const [form, setForm] = useState({
    id: user.id,
    name: user.name || "",
    email: user.email || "",
    password: "",
    role: user.role || "member",
    phone: user.phone || "",
    company_code: user.company_code || "Synthera",
    is_active: user.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setSaving(true);
    const payload = { ...form };
    if (!isNew) delete payload.password;
    if (isNew && !payload.password) { setSaving(false); return; }
    await onSave(payload, isNew);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold">{isNew ? "Add New User" : "Edit User"}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <FormField label="Full Name">
            <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="e.g. Jane Doe"
              className="w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors" />
          </FormField>

          <FormField label="Email">
            <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="e.g. jane@example.com"
              className="w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors" />
          </FormField>

          {isNew && (
            <FormField label="Password">
              <input type="password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} placeholder="Min 8 characters"
                className="w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors" />
            </FormField>
          )}

          <FormField label="Phone">
            <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="08xxxxxxxxxx"
              className="w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors" />
          </FormField>

          <FormField label="Role">
            <select value={form.role} onChange={(e) => handleChange("role", e.target.value)}
              className="w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 outline-none focus:border-primary-1/50 transition-colors appearance-none cursor-pointer">
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </FormField>

          <FormField label="Company Code">
            <input type="text" value={form.company_code} onChange={(e) => handleChange("company_code", e.target.value)} placeholder="Synthera"
              className="w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors" />
          </FormField>

          <FormField label="Status">
            <select value={form.is_active ? "1" : "0"} onChange={(e) => handleChange("is_active", e.target.value === "1")}
              className="w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 outline-none focus:border-primary-1/50 transition-colors appearance-none cursor-pointer">
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
          <button onClick={handleSubmit} disabled={!form.name.trim() || !form.email.trim() || saving}
            className="flex-1 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all shadow-[0_4px_20px_rgba(139,92,246,0.25)] flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : isNew ? "Add User" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({ user, onCancel, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-2 border border-bg-3 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 flex items-center justify-center mx-auto mb-5">
          <Trash2 size={26} className="text-rose-400" />
        </div>
        <h2 className="text-[18px] font-bold mb-2">Delete User?</h2>
        <p className="text-text-3 text-[13px] mb-6">
          Are you sure you want to delete <span className="text-text-1 font-semibold">{user.name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all">
            Cancel
          </button>
          <button onClick={async () => { setDeleting(true); await onConfirm(); setDeleting(false); }} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white text-[13px] font-semibold transition-all shadow-[0_4px_20px_rgba(239,68,68,0.25)] flex items-center justify-center gap-2">
            {deleting ? <><Loader2 size={14} className="animate-spin" /> Deleting...</> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FormField wrapper ────────────────────────────────────────────────────────
function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-text-3 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
