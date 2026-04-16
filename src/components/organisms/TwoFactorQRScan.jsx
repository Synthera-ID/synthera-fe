"use client";

import { useState } from "react";
import TwoFactorVerify from "./TwoFactorVerify";

export default function TwoFactorQRScan({ qrData }) {
  const [showVerify, setShowVerify] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(qrData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = qrData.secret;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNext = () => {
    setShowVerify(true);
  };

  // ── show verify step ──
  if (showVerify) {
    return <TwoFactorVerify />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#101029] to-[#0a0a1a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
            ✓
          </div>
          <div className="w-12 h-0.5 bg-violet-600" />
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold ring-4 ring-violet-600/20">
            2
          </div>
          <div className="w-12 h-0.5 bg-white/10" />
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-500 text-xs font-bold">
            3
          </div>
        </div>

        {/* card */}
        <div className="bg-[#12122a]/80 backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-8 shadow-2xl shadow-violet-900/10">
          {/* heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Scan QR Code
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Open your authenticator app (Google Authenticator, Authy, etc.)
              and scan the QR code below.
            </p>
          </div>

          {/* QR code container */}
          <div className="flex justify-center mb-6">
            <div className="relative p-4 rounded-2xl bg-white border-2 border-white/20 shadow-xl shadow-violet-600/5">
              {/* QR image from backend */}
              <img
                src={qrData.qr_code_url}
                alt="2FA QR Code"
                className="w-48 h-48 object-contain"
                id="qr-code-image"
              />

              {/* center logo overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
              </div>
            </div>
          </div>

          {/* manual entry */}
          <div className="mb-6">
            <p className="text-xs text-slate-500 text-center mb-3">
              Or enter this secret key manually:
            </p>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0a0a1a]/60 border border-white/[0.06]">
              <code
                id="secret-key-display"
                className="flex-1 text-xs text-violet-300 font-mono tracking-widest break-all select-all"
              >
                {qrData.secret}
              </code>
              <button
                id="btn-copy-secret"
                onClick={handleCopySecret}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-violet-600/15 border border-violet-500/20 text-violet-400 text-xs font-medium
                           hover:bg-violet-600/25 transition-all duration-200"
              >
                {copied ? (
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                    Copied
                  </span>
                ) : (
                  "Copy"
                )}
              </button>
            </div>
          </div>

          {/* instructions */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-6">
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-amber-400 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              <div>
                <p className="text-xs font-semibold text-amber-300 mb-1">
                  Save this secret key
                </p>
                <p className="text-xs text-amber-200/60 leading-relaxed">
                  Store this secret key somewhere safe. You'll need it to
                  recover your account if you lose access to your authenticator
                  app.
                </p>
              </div>
            </div>
          </div>

          {/* action */}
          <button
            id="btn-proceed-verify"
            onClick={handleNext}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold tracking-wide
                       hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98]
                       transition-all duration-200 ease-out
                       shadow-lg shadow-violet-600/20
                       flex items-center justify-center gap-2"
          >
            I've Scanned the Code
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
