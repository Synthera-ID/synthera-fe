"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import DashboardNavbar from "@/components/organisms/DashboardNavbar";
import {
  Users,
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Shield,
  ShieldOff,
  Trash2,
  Edit3,
  X,
  Check,
  AlertCircle,
  UserCheck,
  UserX,
  Crown,
} from "lucide-react";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
    joined: "Jan 12, 2025",
    apiCalls: 8240,
    avatar: "AJ",
    avatarColor: "bg-violet-500/20 text-violet-400",
  },
  {
    id: 2,
    name: "Bob Martinez",
    email: "bob@example.com",
    role: "Member",
    status: "Active",
    joined: "Feb 3, 2025",
    apiCalls: 3120,
    avatar: "BM",
    avatarColor: "bg-emerald-500/20 text-emerald-400",
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol@example.com",
    role: "Member",
    status: "Inactive",
    joined: "Mar 18, 2025",
    apiCalls: 540,
    avatar: "CW",
    avatarColor: "bg-amber-500/20 text-amber-400",
  },
  {
    id: 4,
    name: "David Lee",
    email: "david@example.com",
    role: "Moderator",
    status: "Active",
    joined: "Apr 5, 2025",
    apiCalls: 5910,
    avatar: "DL",
    avatarColor: "bg-blue-500/20 text-blue-400",
  },
  {
    id: 5,
    name: "Eva Chen",
    email: "eva@example.com",
    role: "Member",
    status: "Suspended",
    joined: "Apr 20, 2025",
    apiCalls: 120,
    avatar: "EC",
    avatarColor: "bg-rose-500/20 text-rose-400",
  },
  {
    id: 6,
    name: "Frank Nguyen",
    email: "frank@example.com",
    role: "Member",
    status: "Active",
    joined: "May 1, 2025",
    apiCalls: 2880,
    avatar: "FN",
    avatarColor: "bg-cyan-500/20 text-cyan-400",
  },
];

const ROLE_STYLES = {
  Admin:     { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/30", icon: Crown  },
  Moderator: { bg: "bg-blue-500/20",   text: "text-blue-400",   border: "border-blue-500/30",   icon: Shield },
  Member:    { bg: "bg-bg-3",          text: "text-text-3",     border: "border-bg-3",           icon: null   },
};

const STATUS_STYLES = {
  Active:    { dot: "bg-emerald-400", text: "text-emerald-400", label: "Active"    },
  Inactive:  { dot: "bg-text-3",      text: "text-text-3",      label: "Inactive"  },
  Suspended: { dot: "bg-rose-400",    text: "text-rose-400",    label: "Suspended" },
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function UserManagementPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeMenu, setActiveMenu] = useState(null);
  const [modalUser, setModalUser] = useState(null);  // for edit modal
  const [deleteConfirm, setDeleteConfirm] = useState(null); // for delete confirm
  const [notification, setNotification] = useState(null);

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const admins = users.filter((u) => u.role === "Admin").length;
  const suspended = users.filter((u) => u.status === "Suspended").length;

  // Filtered list
  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = filterRole   === "All" || u.role   === filterRole;
    const matchStatus = filterStatus === "All" || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  function showNotification(msg, type = "success") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }

  function handleDelete(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteConfirm(null);
    showNotification("User deleted successfully.");
  }

  function handleSave(updated) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setModalUser(null);
    showNotification("User updated successfully.");
  }

  function handleToggleStatus(id) {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const next = u.status === "Active" ? "Inactive" : "Active";
        return { ...u, status: next };
      })
    );
    setActiveMenu(null);
    showNotification("User status updated.");
  }

  return (
    <div className="flex min-h-screen bg-bg-1 text-text-1 font-sans selection:bg-primary-1/30">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <DashboardNavbar onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />

        <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full scroll-smooth">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[26px] font-bold mb-1.5">User Management</h1>
              <p className="text-text-3 text-[13px]">View, manage, and control user access across your platform.</p>
            </div>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-semibold text-[13px] transition-all duration-200 shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.4)]"
              onClick={() =>
                setModalUser({
                  id: Date.now(),
                  name: "",
                  email: "",
                  role: "Member",
                  status: "Active",
                  joined: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
                  apiCalls: 0,
                  avatar: "??",
                  avatarColor: "bg-primary-1/20 text-primary-3",
                  isNew: true,
                })
              }
            >
              <Plus size={16} />
              Add User
            </button>
          </header>

          {/* ── Stat Cards ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            <StatCard icon={<Users size={20} className="text-violet-400" />}   iconBg="bg-violet-500/20"  label="Total Users"    value={totalUsers} />
            <StatCard icon={<UserCheck size={20} className="text-emerald-400" />} iconBg="bg-emerald-500/20" label="Active Users"    value={activeUsers} />
            <StatCard icon={<Crown size={20} className="text-amber-400" />}    iconBg="bg-amber-500/20"  label="Admins"         value={admins} />
            <StatCard icon={<UserX size={20} className="text-rose-400" />}     iconBg="bg-rose-500/20"   label="Suspended"      value={suspended} />
          </div>

          {/* ── Filters ────────────────────────────────────────────────── */}
          <div className="bg-bg-2 border border-bg-3 rounded-2xl px-6 py-5 mb-6 flex flex-wrap items-center gap-4">
            {/* Search */}
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

            {/* Role filter */}
            <div className="flex items-center gap-2">
              {["All", "Admin", "Moderator", "Member"].map((r) => (
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

            {/* Status filter */}
            <div className="flex items-center gap-2">
              {["All", "Active", "Inactive", "Suspended"].map((s) => (
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

          {/* ── Table ──────────────────────────────────────────────────── */}
          <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_44px] gap-4 px-6 py-3.5 bg-bg-3/30 text-[11px] font-bold text-text-3 uppercase tracking-widest border-b border-bg-3">
              <span>User</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
              <span>API Calls</span>
              <span />
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-3">
                <AlertCircle size={36} className="opacity-40" />
                <p className="text-[14px]">No users match your filters.</p>
              </div>
            ) : (
              filtered.map((user, i) => {
                const roleStyle   = ROLE_STYLES[user.role]   ?? ROLE_STYLES.Member;
                const statusStyle = STATUS_STYLES[user.status] ?? STATUS_STYLES.Inactive;
                const RoleIcon    = roleStyle.icon;

                return (
                  <div
                    key={user.id}
                    className={`grid grid-cols-[2fr_2fr_1fr_1fr_1fr_44px] gap-4 px-6 py-4 items-center hover:bg-bg-3/20 transition-colors relative ${
                      i < filtered.length - 1 ? "border-b border-bg-3/50" : ""
                    }`}
                  >
                    {/* User */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[12px] shrink-0 ${user.avatarColor}`}>
                        {user.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold truncate">{user.name}</div>
                        <div className="text-[11px] text-text-3 truncate">{user.joined}</div>
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
                        {user.role}
                      </span>
                    </span>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusStyle.dot} shrink-0`} />
                      <span className={`text-[12px] font-semibold ${statusStyle.text}`}>{statusStyle.label}</span>
                    </div>

                    {/* API Calls */}
                    <span className="text-[13px] text-text-2 font-medium">{user.apiCalls.toLocaleString()}</span>

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
                            onClick={() => { setModalUser({ ...user }); setActiveMenu(null); }}
                          >
                            <Edit3 size={14} className="text-primary-3" />
                            Edit User
                          </button>
                          <button
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-2 hover:bg-bg-3/60 hover:text-text-1 transition-colors"
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.status === "Active"
                              ? <><ShieldOff size={14} className="text-amber-400" /> Deactivate</>
                              : <><Shield size={14} className="text-emerald-400" /> Activate</>
                            }
                          </button>
                          <div className="border-t border-bg-3/60 my-0.5" />
                          <button
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-rose-400 hover:bg-rose-500/10 transition-colors"
                            onClick={() => { setDeleteConfirm(user); setActiveMenu(null); }}
                          >
                            <Trash2 size={14} />
                            Delete User
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Row count */}
          <p className="text-[12px] text-text-3 mt-4 px-1">
            Showing {filtered.length} of {users.length} users
          </p>
        </main>
      </div>

      {/* ── Modals & overlays ──────────────────────────────────────────────── */}
      {/* Click-away to close menus */}
      {activeMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
      )}

      {/* Edit / Add User Modal */}
      {modalUser && (
        <EditUserModal
          user={modalUser}
          onClose={() => setModalUser(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <DeleteConfirmModal
          user={deleteConfirm}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm.id)}
        />
      )}

      {/* Toast notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[13px] font-semibold shadow-2xl border transition-all duration-300 ${
            notification.type === "success"
              ? "bg-bg-2 border-emerald-500/30 text-emerald-400"
              : "bg-bg-2 border-rose-500/30 text-rose-400"
          }`}
        >
          <Check size={15} />
          {notification.msg}
        </div>
      )}
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, label, value }) {
  return (
    <div className="bg-bg-2 border border-bg-3 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-[12px] text-text-3 mb-0.5">{label}</div>
        <div className="text-[24px] font-bold tracking-tight leading-none">{value}</div>
      </div>
    </div>
  );
}

// ─── Edit User Modal ───────────────────────────────────────────────────────────
function EditUserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ ...user });

  const isNew = !!user.isNew;

  function handleChange(field, value) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // auto-generate avatar initials from name
      if (field === "name") {
        const parts = value.trim().split(" ");
        updated.avatar = parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : value.slice(0, 2).toUpperCase() || "??";
      }
      return updated;
    });
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
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors"
            />
          </FormField>

          <FormField label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="e.g. jane@example.com"
              className="w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors"
            />
          </FormField>

          <FormField label="Role">
            <select
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 outline-none focus:border-primary-1/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
              <option value="Member">Member</option>
            </select>
          </FormField>

          <FormField label="Status">
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-[13px] text-text-1 outline-none focus:border-primary-1/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </FormField>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...form, isNew: undefined })}
            disabled={!form.name.trim() || !form.email.trim()}
            className="flex-1 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all shadow-[0_4px_20px_rgba(139,92,246,0.25)]"
          >
            {isNew ? "Add User" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteConfirmModal({ user, onCancel, onConfirm }) {
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
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-bg-3 text-text-3 hover:text-text-1 hover:border-primary-1/30 text-[13px] font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-[13px] font-semibold transition-all shadow-[0_4px_20px_rgba(239,68,68,0.25)]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FormField wrapper ─────────────────────────────────────────────────────────
function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-text-3 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}
