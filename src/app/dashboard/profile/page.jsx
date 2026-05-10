"use client";

import { useAuth } from "@/hooks/useAuth";
import apiFetch from "@/utils/apiFetch";
import { getCookie } from "@/utils/cookie";
import { useState } from "react";
import { FiLock, FiShield } from "react-icons/fi";

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
function Field({ label, value, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-[12px] font-medium text-text-3">{label}</label>}
      <input
        className="w-full rounded-xl px-4 py-2.5 text-[13px] outline-none transition-all duration-300 bg-bg-1 border border-bg-3 text-text-1 focus:border-primary-1/60 focus:ring-2 focus:ring-primary-1/10"
        value={value ?? ""}
        {...props}
      />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
// ─── Inline Notification ──────────────────────────────────────────────────────
function Notification({ message, type, onClose }) {
  if (!message) return null;

  const styles = {
    success: {
      bg: "rgba(34, 197, 94, 0.08)",
      border: "rgba(34, 197, 94, 0.3)",
      text: "#4ade80",
      icon: "✓",
    },
    error: {
      bg: "rgba(239, 68, 68, 0.08)",
      border: "rgba(239, 68, 68, 0.3)",
      text: "#f87171",
      icon: "✕",
    },
  };

  const s = styles[type] || styles.error;

  return (
    <div
      className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-[13px] animate-in fade-in slide-in-from-top-2 duration-300"
      style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, color: s.text }}
    >
      <span className="font-bold text-sm mt-px flex-shrink-0">{s.icon}</span>
      <span className="flex-1 leading-relaxed">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity text-sm font-bold"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    fullName: user.name,
    email: user.email,
    phone: user.phone,
    company: user.company_code,
    twoFA: user.two_factor_enabled,
    avatar_url: user.avatar_url,
  });
  const [twoFA, setTwoFA] = useState(profile.twoFA);

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  // Password form state
  const [pwLoading, setPwLoading] = useState(false);
  const [pwNotify, setPwNotify] = useState({ message: "", type: "" });

  // Profile/Phone form state
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileNotify, setProfileNotify] = useState({ message: "", type: "" });

  const handleProfileChange = (field) => (e) => {
    setProfile((p) => ({ ...p, [field]: e.target.value }));
    // Clear notification when user starts typing again
    if (profileNotify.message) setProfileNotify({ message: "", type: "" });
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswords((p) => ({ ...p, [field]: e.target.value }));
    // Clear notification when user starts typing again
    if (pwNotify.message) setPwNotify({ message: "", type: "" });
  };

  // ── Update Phone ──────────────────────────────────────────────────────
  const updatePhones = async () => {
    // Client-side validation — match BE regex: ^(08|\+628)[0-9]{8,13}$
    if (!profile.phone || profile.phone.trim() === "") {
      setProfileNotify({ message: "Nomor telepon harus diisi.", type: "error" });
      return;
    }

    const phoneRegex = /^(08|\+628)[0-9]{8,13}$/;
    if (!phoneRegex.test(profile.phone)) {
      setProfileNotify({
        message: "Format nomor telepon tidak valid. Gunakan format 08xx atau +628xx (10-15 digit).",
        type: "error",
      });
      return;
    }

    // Check if phone actually changed
    if (profile.phone === user.phone) {
      setProfileNotify({ message: "Tidak ada perubahan pada nomor telepon.", type: "error" });
      return;
    }

    setProfileLoading(true);
    setProfileNotify({ message: "", type: "" });

    try {
      const response = await apiFetch.patch("/user", {
        type: "change_profile",
        phone: profile.phone,
      });

      setProfileNotify({
        message: response?.message || "Profil berhasil diperbarui!",
        type: "success",
      });

      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setProfileNotify((prev) => (prev.type === "success" ? { message: "", type: "" } : prev));
      }, 5000);
    } catch (err) {
      let errorMessage = "Terjadi kesalahan saat memperbarui profil.";

      if (err?.data) {
        if (typeof err.data === "string") {
          errorMessage = err.data;
        } else if (err.data.message) {
          errorMessage = err.data.message;
        } else if (err.data.errors) {
          // Laravel-style validation errors
          const errors = err.data.errors;
          const firstKey = Object.keys(errors)[0];
          if (firstKey && Array.isArray(errors[firstKey])) {
            errorMessage = errors[firstKey][0];
          }
        }
      }

      if (err?.status === 422) {
        // Prioritize field-level errors from Laravel
        if (err?.data?.errors?.phone) {
          errorMessage = err.data.errors.phone[0];
        } else {
          errorMessage = err?.data?.message || "Data yang dikirim tidak valid.";
        }
      } else if (err?.status === 403) {
        errorMessage = "Anda tidak memiliki izin untuk mengubah profil.";
      }

      setProfileNotify({ message: errorMessage, type: "error" });
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Update Password ───────────────────────────────────────────────────
  const updatePasswords = async () => {
    // Client-side validation
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPwNotify({ message: "Semua field password harus diisi.", type: "error" });
      return;
    }

    if (passwords.newPass.length < 8) {
      setPwNotify({ message: "Password baru minimal 8 karakter.", type: "error" });
      return;
    }

    if (passwords.newPass !== passwords.confirm) {
      setPwNotify({ message: "Konfirmasi password tidak cocok dengan password baru.", type: "error" });
      return;
    }

    if (passwords.current === passwords.newPass) {
      setPwNotify({ message: "Password baru tidak boleh sama dengan password lama.", type: "error" });
      return;
    }

    // API call
    setPwLoading(true);
    setPwNotify({ message: "", type: "" });

    try {
      const response = await apiFetch.patch("/user", {
        type: "change_password",
        current_password: passwords.current,
        new_password: passwords.newPass,
        new_password_confirmation: passwords.confirm,
      });

      setPwNotify({
        message: response?.message || "Password berhasil diperbarui!",
        type: "success",
      });

      // Reset fields
      setPasswords({ current: "", newPass: "", confirm: "" });

      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setPwNotify((prev) => (prev.type === "success" ? { message: "", type: "" } : prev));
      }, 5000);
    } catch (err) {
      let errorMessage = "Terjadi kesalahan saat memperbarui password.";

      if (err?.data) {
        if (typeof err.data === "string") {
          errorMessage = err.data;
        } else if (err.data.message) {
          errorMessage = err.data.message;
        } else if (err.data.errors) {
          const errors = err.data.errors;
          const firstKey = Object.keys(errors)[0];
          if (firstKey && Array.isArray(errors[firstKey])) {
            errorMessage = errors[firstKey][0];
          }
        }
      }

      if (err?.status === 422) {
        errorMessage = err?.data?.message || "Data yang dikirim tidak valid.";
      } else if (err?.status === 403) {
        errorMessage = "Anda tidak memiliki izin untuk mengubah password.";
      }

      setPwNotify({ message: errorMessage, type: "error" });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-[26px] font-bold mb-1.5">Profile Settings</h1>
        <p className="text-text-3 text-[13px]">Manage your account information and preferences.</p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: Profile Info ─────────────────────────────────────────── */}
        <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6">
          {/* Avatar Row */}
          <div className="flex items-center gap-4 mb-6">
            {/* <Avatar name={profile.avatar_url} /> */}
            {profile && profile?.avatar_url ? (
              <img src={profile.avatar_url} className="w-16 h-16 rounded-full shrink-0" alt="Avatar Profile" />
            ) : (
              <div
                className="
          w-8 h-8 rounded-full shrink-0
          bg-gradient-to-br from-[#8B5CF6] to-[#4F46E5]
          flex items-center justify-center
          text-white text-[12px] font-bold
          shadow-[0_0_14px_rgba(139,92,246,0.35)]
          "
              >
                {UserData?.name[0]}
              </div>
            )}
            <div>
              <h2 className="text-base font-semibold">{profile.fullName}</h2>
              <p className="text-[13px] mt-0.5 text-text-3">{profile.email}</p>
              {/* <button className="flex items-center gap-1.5 text-[12px] font-medium mt-2 px-3 py-1.5 rounded-lg border border-primary-1/40 text-primary-3 hover:bg-primary-1/10 transition-colors">
                <img src="/icon/upload.svg" alt="Upload" className="w-4 h-4" />
                Change Avatar
              </button> */}
            </div>
          </div>

          {/* Profile Notification Banner */}
          {profileNotify.message && (
            <div className="mb-4">
              <Notification
                message={profileNotify.message}
                type={profileNotify.type}
                onClose={() => setProfileNotify({ message: "", type: "" })}
              />
            </div>
          )}

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            <Field
              label="Full Name"
              value={profile.fullName}
              disabled={true}
              onChange={handleProfileChange("fullName")}
              placeholder="Full Name"
            />
            <Field
              label="Email Address"
              type="email"
              disabled={true}
              value={profile.email}
              onChange={handleProfileChange("email")}
              placeholder="Email Address"
            />
            <Field
              label="Phone Number"
              type="tel"
              value={profile.phone}
              onChange={handleProfileChange("phone")}
              placeholder="08xxxxxxxxxx"
            />
            <Field
              label="Company"
              value={profile.company}
              disabled={true}
              onChange={handleProfileChange("company")}
              placeholder="Company"
            />
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <button
              onClick={updatePhones}
              disabled={profileLoading}
              className={`px-6 py-2.5 rounded-xl font-semibold text-[13px] text-white bg-primary-1 hover:bg-primary-2 transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_30px_rgba(139,92,246,0.55)] ${
                profileLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {profileLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                "Save Changes"
              )}
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

            {/* Notification Banner */}
            {pwNotify.message && (
              <div className="mb-4">
                <Notification
                  message={pwNotify.message}
                  type={pwNotify.type}
                  onClose={() => setPwNotify({ message: "", type: "" })}
                />
              </div>
            )}

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
              <button
                onClick={updatePasswords}
                disabled={pwLoading}
                className={`px-5 py-2.5 rounded-xl font-semibold text-[13px] border border-bg-3 text-primary-3 hover:bg-primary-1/10 hover:border-primary-1/40 transition-all duration-200 active:scale-95 ${
                  pwLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {pwLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Memperbarui...
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </div>

          {/* Two-Factor Authentication Card */}
          <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <FiShield size={16} className="text-primary-3" />
              <h3 className="text-base font-semibold">Two-Factor Authentication</h3>
            </div>
            <p className="text-[13px] mb-5 text-text-3">Add an extra layer of security to your account.</p>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-medium">Enable 2FA</span>
              <Toggle enabled={twoFA} onToggle={() => setTwoFA(!twoFA)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
