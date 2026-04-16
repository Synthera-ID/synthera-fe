"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TwoFactorQRScan from "@/components/organisms/TwoFactorQRScan";
import { apiFetch } from "@/hooks/apiFetch";

export default function TwoFactorPrompt() {
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEnable2FA = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch(`/2fa/enable`, {
        method: "POST",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to enable 2FA.");
      }

      const data = await res.json();
      setQrData({
        qr_code_url: data.qr_code_url,
        secret: data.secret,
      });
      setShowQR(true);
    } catch (err) {
      setError(err.message || "Failed to enable 2FA. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  // ── show QR scan step ──
  if (showQR && qrData) {
    return <TwoFactorQRScan qrData={qrData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#101029] to-[#0a0a1a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* card */}
        <div className="bg-[#12122a]/80 backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-8 shadow-2xl shadow-violet-900/10">
          {/* icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>
            </div>
          </div>

          {/* heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Secure Your Account</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Add an extra layer of protection with Two-Factor Authentication (2FA) to keep your Synthera account safe.
            </p>
          </div>

          {/* benefits */}
          <div className="space-y-3 mb-8">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                ),
                text: "Prevents unauthorized access even if password is compromised",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-6 18.75h6"
                  />
                ),
                text: "Uses authenticator app for time-based verification codes",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                ),
                text: "Quick setup — takes less than 2 minutes",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-violet-600/10 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-violet-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    {item.icon}
                  </svg>
                </div>
                <span className="text-[13px] text-slate-300 leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>

          {/* error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* actions */}
          <div className="space-y-3">
            <button
              id="btn-enable-2fa"
              onClick={handleEnable2FA}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold tracking-wide
                         hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98]
                         transition-all duration-200 ease-out
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-violet-600/20
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Setting up…</span>
                </>
              ) : (
                "Yes, Enable 2FA"
              )}
            </button>

            <button
              id="btn-skip-2fa"
              onClick={handleSkip}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-400 text-sm font-medium
                         hover:bg-white/[0.07] hover:text-slate-300 active:scale-[0.98]
                         transition-all duration-200 ease-out
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Not Now, Skip
            </button>
          </div>

          {/* footer note */}
          <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
            You can always enable 2FA later from <span className="text-violet-400/80">Settings → Security</span>
          </p>
        </div>
      </div>
    </div>
  );
}
