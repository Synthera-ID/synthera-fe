"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import DashboardNavbar from "@/components/organisms/DashboardNavbar";
import { FiCamera, FiLock, FiShield } from "react-icons/fi";

// ─── Avatar Initials ──────────────────────────────────────────────────────────
function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }}
    >
      {initials}
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex items-center w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none"
      style={{ backgroundColor: enabled ? "#8B5CF6" : "rgba(255,255,255,0.12)" }}
      aria-checked={enabled}
      role="switch"
    >
      <span
        className="inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-300"
        style={{ transform: enabled ? "translateX(22px)" : "translateX(2px)" }}
      />
    </button>
  );
}

// ─── Field Input ──────────────────────────────────────────────────────────────
function Field({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[12px] font-medium text-text-3">{label}</label>
      )}
      <input
        className="w-full rounded-xl px-4 py-2.5 text-[13px] outline-none transition-all duration-300 bg-bg-1 border border-bg-3 text-text-1 focus:border-primary-1/60 focus:ring-2 focus:ring-primary-1/10"
        {...props}
      />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [twoFA, setTwoFA] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corp",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleProfileChange = (field) => (e) =>
    setProfile((p) => ({ ...p, [field]: e.target.value }));

  const handlePasswordChange = (field) => (e) =>
    setPasswords((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="flex min-h-screen bg-bg-1 text-text-1 font-sans selection:bg-primary-1/30">
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <DashboardNavbar onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />

        <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full scroll-smooth">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-[26px] font-bold mb-1.5">Profile Settings</h1>
          <p className="text-text-3 text-[13px]">
            Manage your account information and preferences.
          </p>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: Profile Info ─────────────────────────────────────────── */}
          <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6">
            {/* Avatar Row */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar name={profile.fullName} />
              <div>
                <h2 className="text-base font-semibold">{profile.fullName}</h2>
                <p className="text-[13px] mt-0.5 text-text-3">{profile.email}</p>
                <button className="flex items-center gap-1.5 text-[12px] font-medium mt-2 px-3 py-1.5 rounded-lg border border-primary-1/40 text-primary-3 hover:bg-primary-1/10 transition-colors">
                  <img src="/icon/upload.svg" alt="Upload" className="w-4 h-4" />
                  Change Avatar
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">
              <Field
                label="Full Name"
                value={profile.fullName}
                onChange={handleProfileChange("fullName")}
                placeholder="Full Name"
              />
              <Field
                label="Email Address"
                type="email"
                value={profile.email}
                onChange={handleProfileChange("email")}
                placeholder="Email Address"
              />
              <Field
                label="Phone Number"
                type="tel"
                value={profile.phone}
                onChange={handleProfileChange("phone")}
                placeholder="Phone Number"
              />
              <Field
                label="Company"
                value={profile.company}
                onChange={handleProfileChange("company")}
                placeholder="Company"
              />
            </div>

            {/* Save Button */}
            <div className="mt-6">
              <button className="px-6 py-2.5 rounded-xl font-semibold text-[13px] text-white bg-primary-1 hover:bg-primary-2 transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_30px_rgba(139,92,246,0.55)]">
                Save Changes
              </button>
            </div>
          </div>

          {/* ── Right Column ───────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Change Password Card */}
            <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <FiLock size={16} className="text-primary-3" />
                <h3 className="text-base font-semibold">Change Password</h3>
              </div>
              <div className="flex flex-col gap-4">
                <Field
                  label="Current Password"
                  type="password"
                  value={passwords.current}
                  onChange={handlePasswordChange("current")}
                  placeholder="••••••••"
                />
                <Field
                  label="New Password"
                  type="password"
                  value={passwords.newPass}
                  onChange={handlePasswordChange("newPass")}
                  placeholder="••••••••"
                />
                <Field
                  label="Confirm New Password"
                  type="password"
                  value={passwords.confirm}
                  onChange={handlePasswordChange("confirm")}
                  placeholder="••••••••"
                />
              </div>
              <div className="mt-5">
                <button className="px-5 py-2.5 rounded-xl font-semibold text-[13px] border border-bg-3 text-primary-3 hover:bg-primary-1/10 hover:border-primary-1/40 transition-all duration-200 active:scale-95">
                  Update Password
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication Card */}
            <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <FiShield size={16} className="text-primary-3" />
                <h3 className="text-base font-semibold">Two-Factor Authentication</h3>
              </div>
              <p className="text-[13px] mb-5 text-text-3">
                Add an extra layer of security to your account.
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-medium">Enable 2FA</span>
                <Toggle enabled={twoFA} onToggle={() => setTwoFA(!twoFA)} />
              </div>
            </div>

          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
