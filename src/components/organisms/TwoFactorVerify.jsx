"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:8000/api";
const CODE_LENGTH = 6;

export default function TwoFactorVerify({ progress = true }) {
  const router = useRouter();
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);

  // auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    // only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // auto-focus next input
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // auto-submit when all digits filled
    if (value && index === CODE_LENGTH - 1 && newCode.every((d) => d !== "")) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
    }
    if (e.key === "Enter") {
      const fullCode = code.join("");
      if (fullCode.length === CODE_LENGTH) {
        handleVerify(fullCode);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);

    if (pasteData.length === 0) return;

    const newCode = [...code];
    for (let i = 0; i < pasteData.length; i++) {
      newCode[i] = pasteData[i];
    }
    setCode(newCode);

    // focus last filled or next empty
    const focusIndex = Math.min(pasteData.length, CODE_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();

    // auto-submit if complete
    if (pasteData.length === CODE_LENGTH) {
      handleVerify(pasteData);
    }
  };

  const handleVerify = async (verifyCode) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/2fa/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("userAccessToken")}`,
        },
        body: JSON.stringify({ code: verifyCode }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Invalid code. Please try again.");
      }

      setSuccess(true);

      // redirect to dashboard after brief success animation
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Invalid code. Please try again.");
      setCode(Array(CODE_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  // ── success state ──
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#101029] to-[#0a0a1a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-[#12122a]/80 backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-8 shadow-2xl text-center">
            {/* success animation */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">2FA Enabled!</h2>
            <p className="text-sm text-slate-400 mb-4">Your account is now secured with two-factor authentication.</p>

            {/* redirect indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Redirecting to dashboard…
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#101029] to-[#0a0a1a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* progress */}
        {progress && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
              ✓
            </div>
            <div className="w-12 h-0.5 bg-violet-600" />
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
              ✓
            </div>
            <div className="w-12 h-0.5 bg-violet-600" />
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold ring-4 ring-violet-600/20">
              3
            </div>
          </div>
        )}

        {/* card */}
        <div className="bg-[#12122a]/80 backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-8 shadow-2xl shadow-violet-900/10">
          {/* icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                />
              </svg>
            </div>
          </div>

          {/* heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Verify Code</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enter the 6-digit code from your authenticator app to complete the setup.
            </p>
          </div>

          {/* OTP inputs */}
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                className={`w-12 h-14 rounded-xl text-center text-lg font-bold
                           bg-[#0a0a1a]/60 border transition-all duration-200
                           outline-none
                           ${digit ? "border-violet-500/40 text-white" : "border-white/[0.08] text-white"}
                           focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                           ${error ? "border-red-500/40 shake" : ""}
                           disabled:opacity-50 disabled:cursor-not-allowed
                           placeholder:text-slate-600`}
                placeholder="·"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {/* error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-red-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* verify button */}
          <button
            id="btn-verify-2fa"
            onClick={() => handleVerify(code.join(""))}
            disabled={loading || code.some((d) => d === "")}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold tracking-wide
                       hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98]
                       transition-all duration-200 ease-out
                       disabled:opacity-40 disabled:cursor-not-allowed
                       shadow-lg shadow-violet-600/20
                       flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Verifying…</span>
              </>
            ) : (
              "Verify & Activate"
            )}
          </button>

          {/* help text */}
          <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
            Didn't receive a code?{" "}
            <button
              onClick={() => {
                setCode(Array(CODE_LENGTH).fill(""));
                setError("");
                inputRefs.current[0]?.focus();
              }}
              className="text-violet-400/80 hover:text-violet-400 transition-colors"
            >
              Clear & retry
            </button>
          </p>
        </div>
      </div>

      {/* shake animation for error */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        .shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
