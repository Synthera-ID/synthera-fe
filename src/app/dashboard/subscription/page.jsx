"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Loader2, X, QrCode, ShieldCheck, RefreshCw, CreditCard, Copy, Building2, CheckCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import apiFetch from "@/utils/apiFetch";
import { formatPrice, formatRupiah, formatDate } from "@/utils/format";

// ─── Constants ────────────────────────────────────────────────────────────────
const TIER_ORDER = { basic: 0, pro: 1, exclusive: 2 };

const TIER_STYLES = {
  basic: {
    badge: null,
    wrapperClass: "group relative flex flex-col rounded-[20px] border border-bg-3 bg-bg-2 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:border-bg-4 h-full",
    glowClass: "",
    priceColor: "text-text-1",
    btnClass: "w-full py-3 rounded-xl border border-bg-3 text-[13px] font-semibold text-text-2 hover:bg-bg-3/40 transition-all duration-200 cursor-default",
    badgeColor: "",
  },
  pro: {
    badge: "MOST POPULAR",
    wrapperClass: "group relative flex flex-col rounded-[20px] border border-primary-1/50 bg-gradient-to-b from-primary-1/10 to-bg-2 p-8 shadow-[0_0_40px_rgba(139,92,246,0.12)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_70px_rgba(139,92,246,0.3)] hover:border-primary-1 scale-[1.03] z-10 h-full",
    glowClass: "absolute inset-0 rounded-[20px] bg-gradient-to-b from-primary-1/5 to-transparent pointer-events-none",
    priceColor: "text-primary-1 dark:text-primary-3",
    btnClass: "w-full py-3 rounded-xl bg-primary-1 text-white text-[13px] font-bold shadow-lg shadow-primary-1/30 hover:bg-primary-2 hover:shadow-primary-1/50 active:scale-[0.98] transition-all duration-200",
    badgeColor: "bg-primary-1/10 dark:bg-primary-1/20 text-primary-1 dark:text-primary-3 border border-primary-1/25 dark:border-primary-1/40",
  },
  exclusive: {
    badge: "BEST VALUE",
    wrapperClass: "group relative flex flex-col rounded-[20px] border border-amber-500/30 bg-gradient-to-b from-amber-500/8 to-bg-2 p-8 shadow-[0_0_30px_rgba(245,158,11,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_60px_rgba(245,158,11,0.2)] hover:border-amber-500/60 dark:hover:border-amber-400/70 h-full",
    glowClass: "absolute inset-0 rounded-[20px] bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none",
    priceColor: "text-amber-600 dark:text-amber-400",
    btnClass: "w-full py-3 rounded-xl border border-amber-500/50 text-amber-600 dark:text-amber-400 text-[13px] font-bold hover:bg-amber-500/10 hover:border-amber-500 active:scale-[0.98] transition-all duration-200",
    badgeColor: "bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 dark:border-amber-500/40",
  },
};

// ─── Static Feature Descriptions ────────────────────────────────────────────
// Keyed by normalized label (lowercase, trimmed). Used to enrich API feature items.
const FEATURE_DETAILS = {
  // Basic
  "access to free courses": "Browse 50+ curated free courses",
  "learning progress tracking": "Visual progress bar per course",
  "progress tracking": "Visual progress bar per course",
  "personal dashboard": "Track activity, goals & streaks",
  "learning dashboard": "Track activity, goals & streaks",
  "community access": "Join learner discussion forums",
  "basic support": "Email support within 3 business days",
  // Pro
  "unlimited course access": "Full access to 500+ premium courses",
  "ai learning assistant": "Personalized AI-powered study guide",
  "download certificates": "Share verified certs on LinkedIn",
  "advanced analytics": "Deep insights on your learning path",
  "advanced progress analytics": "Deep insights on your learning path",
  "priority support": "Response guaranteed within 24 hours",
  "premium learning materials": "Exclusive PDFs, templates & toolkits",
  "premium learning resources": "Exclusive PDFs, templates & toolkits",
  "course completion insights": "Detailed stats upon completing courses",
  // Exclusive
  "everything in pro": "Includes all Pro plan features",
  "1-on-1 mentoring sessions": "4 sessions/month with expert mentors",
  "exclusive masterclass access": "Live & recorded premium masterclasses",
  "early access to new courses": "Get new courses before anyone else",
  "dedicated support": "Personal support manager, 24/7",
  "premium community access": "VIP network with top instructors",
  "vip learning resources": "High-end developer resources & tools",
  "personalized learning roadmap": "Tailored curriculum matching your goals",
};

const PAYMENT_METHODS = [
  { id: "qris", code: "SP", label: "QRIS", icon: QrCode, desc: "Scan & bayar via e-wallet / m-banking" },
  { id: "bank_transfer", code: "BC", label: "Bank Transfer", icon: CreditCard, desc: "Transfer langsung ke rekening bank (VA)" },
];

// ─── Modal Backdrop ───────────────────────────────────────────────────────────
function ModalBackdrop({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
  );
}

// ─── Confirm Modal (Step 1) ───────────────────────────────────────────────────
function ConfirmModal({ plan, onConfirm, onClose }) {
  const [method, setMethod] = useState("qris");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");

    try {
      const selectedMethod = PAYMENT_METHODS.find((m) => m.id === method);
      const payload = {
        plan_id: plan.id,
        payment_method: selectedMethod?.code || "SP",
      };

      const res = await apiFetch.post("/transactions", payload);

      // Pass the real response data to the payment modal
      onConfirm(method, res.data);
    } catch (err) {
      const message = err?.data?.message || "Gagal membuat transaksi. Silakan coba lagi.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-bg-2 border border-bg-3 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-bg-3">
          <h3 className="text-[16px] font-bold">Konfirmasi Upgrade</h3>
          <button onClick={onClose} className="text-text-3 hover:text-text-1 transition-colors" disabled={submitting}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Plan Details */}
          <div className="bg-bg-1 border border-bg-3 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-3">Paket</span>
              <span className="text-[13px] font-semibold capitalize">{plan.name}</span>
            </div>
            <div className="border-t border-bg-3" />
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-3">Tier</span>
              <span className="text-[13px] font-medium capitalize text-primary-3">{plan.tier}</span>
            </div>
            <div className="border-t border-bg-3" />
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-3">Harga</span>
              <span className="text-[13px] font-bold">
                {formatRupiah(plan.price)}
                <span className="text-text-3 font-normal">/bulan</span>
              </span>
            </div>
            <div className="border-t border-bg-3" />
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-3">Billing</span>
              <span className="text-[13px] font-medium">Monthly</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <p className="text-[12px] font-semibold text-text-3 mb-3">Metode Pembayaran</p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  disabled={submitting}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left ${method === m.id
                    ? "border-primary-1 bg-primary-1/10"
                    : "border-bg-3 hover:border-bg-3/80 hover:bg-bg-1"
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${method === m.id ? "bg-primary-1/20 text-primary-3" : "bg-bg-3 text-text-3"}`}
                  >
                    <m.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[13px] font-semibold">{m.label}</span>
                    <p className="text-[11px] text-text-3">{m.desc}</p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === m.id ? "border-primary-1" : "border-bg-3"}`}
                  >
                    {method === m.id && <div className="w-2 h-2 rounded-full bg-primary-1" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-[12px] text-red-400 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-5 border-t border-bg-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-xl border border-bg-3 text-[13px] font-medium text-text-1 hover:bg-bg-3 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-xl bg-primary-1 text-white text-[13px] font-semibold hover:bg-primary-2 transition-all shadow-lg shadow-primary-1/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              "Lanjut Bayar"
            )}
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ─── VA Number Display ────────────────────────────────────────────────────────
function VANumberDisplay({ vaNumber }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(vaNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = vaNumber;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format VA number with spaces every 4 digits for readability
  const formatted = vaNumber
    ? vaNumber.replace(/\s/g, "").replace(/(\d{4})(?=\d)/g, "$1 ")
    : "-";

  return (
    <div className="w-full">
      {/* Bank icon + label */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Building2 size={20} className="text-blue-400" />
        </div>
        <div>
          <p className="text-[11px] text-text-3 font-semibold uppercase tracking-wide">Virtual Account Number</p>
          <p className="text-[11px] text-text-3">Transfer ke nomor berikut</p>
        </div>
      </div>

      {/* VA Number Box */}
      <div className="relative bg-gradient-to-br from-blue-500/10 to-primary-1/5 border border-blue-500/20 rounded-2xl p-5">
        {/* Decorative dots */}
        <div className="absolute top-3 right-3 flex gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-400/30" />
          <div className="w-2 h-2 rounded-full bg-blue-400/20" />
          <div className="w-2 h-2 rounded-full bg-blue-400/10" />
        </div>

        <p className="text-[11px] text-text-3 font-medium mb-2">Nomor Virtual Account</p>
        <p className="text-[26px] font-bold font-mono tracking-[0.12em] text-text-1 leading-none mb-4">
          {formatted}
        </p>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 active:scale-[0.98] ${copied
            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
            : "bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
            }`}
        >
          {copied ? (
            <>
              <CheckCheck size={14} />
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Salin Nomor VA</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Payment Modal (Step 2) ───────────────────────────────────────────────────
function PaymentModal({ plan, transactionData, onClose }) {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [status, setStatus] = useState("pending");
  const [refreshing, setRefreshing] = useState(false);

  const isQris = transactionData.payment_method === "qris";
  const isVA = transactionData.payment_method === "bank_transfer";

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // Refresh status handler
  const handleRefreshStatus = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);

    try {
      const res = await apiFetch.get(`/transactions/${transactionData.invoice_code}/status`);
      const newStatus = res?.transaction_status || res?.status || "pending";

      if (newStatus === "success" || newStatus === "paid" || newStatus === "completed") {
        setStatus("success");
      } else if (newStatus === "failed" || newStatus === "expired" || newStatus === "cancelled") {
        setStatus("failed");
      } else {
        setStatus("pending");
      }
    } catch {
      // Silently fail, keep current status
    } finally {
      setRefreshing(false);
    }
  }, [transactionData.invoice_code, refreshing]);

  // Status badge config
  const statusConfig = {
    pending: { label: "Menunggu Pembayaran", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    success: { label: "Pembayaran Berhasil", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    failed: { label: "Pembayaran Gagal", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  };
  const currentStatus = statusConfig[status] || statusConfig.pending;

  // Timer label
  const timerExpiredLabel = isVA ? "VA Expired" : "QR Expired";

  // Method label
  const methodLabel = isQris ? "QRIS" : isVA ? "Bank Transfer (VA)" : transactionData.payment_method;

  // Modal header title
  const headerTitle = isVA ? "Pembayaran Virtual Account" : "Pembayaran QRIS";

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-bg-2 border border-bg-3 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-bg-3">
          <div className="flex items-center gap-2.5">
            {isVA ? (
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Building2 size={15} className="text-blue-400" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-lg bg-primary-1/10 flex items-center justify-center">
                <QrCode size={15} className="text-primary-3" />
              </div>
            )}
            <h3 className="text-[16px] font-bold">{headerTitle}</h3>
          </div>
          <button onClick={onClose} className="text-text-3 hover:text-text-1 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col items-center space-y-5">

          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 self-start">
            <div className={`w-2 h-2 rounded-full ${timeLeft > 0 ? "bg-amber-400 animate-pulse" : "bg-red-400"}`} />
            <span className="text-[12px] font-semibold text-amber-400">
              {timeLeft > 0 ? `Berlaku ${minutes}:${seconds}` : timerExpiredLabel}
            </span>
          </div>

          {/* ── Payment Content Area ── */}
          {status === "success" ? (
            <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check size={32} className="text-emerald-400" strokeWidth={3} />
              </div>
              <p className="text-[14px] font-bold text-emerald-400">Pembayaran Berhasil!</p>
              <p className="text-[12px] text-text-3 text-center">Subscription Anda akan segera diaktifkan.</p>
            </div>
          ) : status === "failed" ? (
            <div className="w-full bg-red-500/10 border border-red-500/20 rounded-2xl p-8 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <X size={32} className="text-red-400" strokeWidth={3} />
              </div>
              <p className="text-[14px] font-bold text-red-400">Pembayaran Gagal</p>
              <p className="text-[12px] text-text-3 text-center">Silakan coba lagi atau hubungi support.</p>
            </div>
          ) : isVA ? (
            /* ── VA Number UI ── */
            <VANumberDisplay vaNumber={transactionData.payment_string} />
          ) : (
            /* ── QRIS QR Code ── */
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <img
                src={transactionData.payment_string}
                alt="QRIS Payment"
                width={220}
                height={220}
                className="rounded-lg"
              />
            </div>
          )}

          {/* Status Badge */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${currentStatus.color}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-current" />
            <span className="text-[12px] font-semibold">{currentStatus.label}</span>
          </div>

          {/* Transaction Info */}
          <div className="w-full bg-bg-1 border border-bg-3 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-3">Invoice</span>
              <span className="text-[12px] font-mono font-semibold">{transactionData.invoice_code}</span>
            </div>
            <div className="border-t border-bg-3" />
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-3">Paket</span>
              <span className="text-[13px] font-semibold capitalize">{plan.name}</span>
            </div>
            <div className="border-t border-bg-3" />
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-3">Metode</span>
              <span className="text-[13px] font-medium">{methodLabel}</span>
            </div>
            <div className="border-t border-bg-3" />
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-3">Total</span>
              <span className="text-[14px] font-bold text-primary-3">{formatRupiah(transactionData.amount)}</span>
            </div>
          </div>

          {/* Refresh Status Button */}
          {status === "pending" && (
            <button
              onClick={handleRefreshStatus}
              disabled={refreshing}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary-1/40 text-primary-3 text-[13px] font-semibold hover:bg-primary-1/10 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              <span>{refreshing ? "Memeriksa..." : "Refresh Status Pembayaran"}</span>
            </button>
          )}

          {/* Instructions */}
          {status === "pending" && (
            <div className="w-full space-y-2">
              <p className="text-[11px] font-semibold text-text-3 uppercase tracking-wide">Cara Pembayaran:</p>
              {isVA ? (
                <ol className="text-[11px] text-text-3 space-y-1 list-decimal list-inside leading-relaxed">
                  <li>Buka aplikasi m-banking atau ATM Anda</li>
                  <li>Pilih menu Transfer atau Pembayaran</li>
                  <li>Pilih Virtual Account dan salin nomor di atas</li>
                  <li>Masukkan nomor VA dan konfirmasi jumlah bayar</li>
                  <li>Selesaikan transaksi dan simpan bukti pembayaran</li>
                </ol>
              ) : (
                <ol className="text-[11px] text-text-3 space-y-1 list-decimal list-inside leading-relaxed">
                  <li>Buka aplikasi e-wallet atau m-banking Anda</li>
                  <li>Pilih menu Scan QR atau QRIS</li>
                  <li>Scan kode QR di atas</li>
                  <li>Konfirmasi dan selesaikan pembayaran</li>
                </ol>
              )}
            </div>
          )}

          {/* Success action */}
          {status === "success" && (
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 rounded-xl bg-primary-1 text-white text-[13px] font-semibold hover:bg-primary-2 transition-all shadow-lg shadow-primary-1/20 active:scale-[0.98]"
            >
              Kembali ke Dashboard
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-bg-3">
          <div className="flex items-center gap-2 justify-center text-text-3">
            <ShieldCheck size={14} />
            <span className="text-[11px]">Transaksi aman & terenkripsi</span>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

import SubscriptionHistory from "@/components/organisms/SubscriptionHistory";

// ─── Feature Item ─────────────────────────────────────────────────────────────
function FeatureItem({ text, subtext, detail, tier }) {
  const checkColor =
    tier === "exclusive"
      ? "text-amber-500"
      : tier === "pro"
        ? "text-primary-1 dark:text-primary-3"
        : "text-emerald-500";
  return (
    <div className="group/benefit flex items-start gap-3 py-2.5 px-2 rounded-xl hover:bg-bg-3/20 transition-all duration-300 hover:translate-x-1">
      <div className={`flex-shrink-0 mt-0.5 ${checkColor} transition-transform duration-300 group-hover/benefit:scale-110`}>
        <CheckCircle2 size={16} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-text-2 text-[13px] font-semibold leading-snug group-hover/benefit:text-text-1 transition-colors duration-200">{text}</span>
        {subtext && <span className="text-text-3 text-[11.5px] mt-0.5 leading-relaxed group-hover/benefit:text-text-2 transition-colors duration-200">{subtext}</span>}
        {detail && (
          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-bg-3/60 text-text-3 w-fit">
            {detail}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SubscriptionPage() {
  const { user } = useAuth();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [confirmPlan, setConfirmPlan] = useState(null);       // Plan object for confirm modal
  const [paymentPlan, setPaymentPlan] = useState(null);       // Plan object for payment modal
  const [transactionData, setTransactionData] = useState(null); // Real API response data

  const currentSub = user?.membership?.subscription;
  const currentSubId = currentSub?.id;
  const currentTier = currentSub?.tier || "basic";
  const isBasic = currentTier === "basic";

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await apiFetch.get("/subscriptions");
        const sorted = (res.data || []).sort((a, b) => (TIER_ORDER[a.tier] ?? 99) - (TIER_ORDER[b.tier] ?? 99));
        setPlans(sorted);
        setError(""); // Clear error on success
      } catch (err) {
        console.error("Failed to fetch plans:", err);
        setError("Gagal memuat data paket. Silakan coba lagi.");
        // Set empty plans to prevent crash
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Modal flow
  const handleUpgradeClick = (plan) => setConfirmPlan(plan);

  const handleConfirm = (method, apiResponseData) => {
    setTransactionData(apiResponseData);
    setPaymentPlan(confirmPlan);
    setConfirmPlan(null);
  };

  const handlePaymentClose = () => {
    setPaymentPlan(null);
    setTransactionData(null);
  };

  return (
    <>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-[26px] font-bold mb-1.5">Subscription</h1>
        <p className="text-text-3 text-[13px]">Manage your subscription plan and billing.</p>
      </header>

      {/* Current Plan Overview */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl p-7 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-[22px] font-bold leading-none">{currentSub?.name} Plan</h2>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 leading-none uppercase tracking-wide">
                Active
              </span>
            </div>
            <p className="text-text-3 text-[12px]">
              Billing cycle: Monthly · Next billing: {formatDate(user?.membership?.expired_at)} ·{" "}
              {formatRupiah(currentSub?.price)}/month
            </p>
          </div>

          {/* Only show Change Plan / Cancel if NOT basic tier */}
          {!isBasic && (
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button className="px-5 py-2.5 rounded-lg border border-bg-3 text-text-1 text-[13px] font-medium hover:bg-bg-3 transition-colors">
                Change Plan
              </button>
              <button className="px-5 py-2.5 rounded-lg bg-red-500 text-white text-[13px] font-medium hover:bg-red-600 transition-colors">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Compare Plans */}
      <div className="mb-10">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-1/30 bg-primary-1/10 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-1 dark:bg-primary-3 animate-pulse" />
            <span className="text-[11px] font-semibold text-primary-1 dark:text-primary-3 tracking-widest uppercase">Subscription Plans</span>
          </div>
          <h3 className="text-[28px] font-bold tracking-tight text-text-1 mb-2">Choose Your Plan</h3>
          <p className="text-text-3 text-[13px] max-w-md mx-auto">Unlock the full Synthera experience. Upgrade anytime, cancel anytime.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-primary-1 dark:text-primary-3" />
            <span className="ml-3 text-text-3 text-[13px]">Loading plans...</span>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-red-400 text-[13px] mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-lg border border-bg-3 text-text-1 text-[13px] font-medium hover:bg-bg-3 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Plans Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {plans.map((plan) => {
              const isCurrent = plan.id === currentSubId;
              const style = TIER_STYLES[plan.tier] || TIER_STYLES.basic;
              const currentTierOrder = TIER_ORDER[currentTier] ?? -1;
              const planTierOrder = TIER_ORDER[plan.tier] ?? 0;
              const isUpgrade = planTierOrder > currentTierOrder;

              // Determine button label
              let buttonLabel = plan.tier === "pro" ? "Upgrade to Pro" : plan.tier === "exclusive" ? "Upgrade to Exclusive" : "Current Plan";
              if (isCurrent) buttonLabel = "Current Plan";
              else if (!isUpgrade) buttonLabel = "Downgrade";

              return (
                <div key={plan.id} className={style.wrapperClass}>
                  {/* Glow overlay */}
                  {style.glowClass && <div className={style.glowClass} />}

                  {/* Badge */}
                  {style.badge && (
                    <div className="mb-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${style.badgeColor}`}>
                        <div className="w-1 h-1 rounded-full bg-current" />
                        {style.badge}
                      </span>
                    </div>
                  )}
                  {!style.badge && <div className="mb-5 h-[26px]" />}

                  {/* Plan Name & Description */}
                  <div className="mb-6">
                    <h4 className="text-[20px] font-bold capitalize text-text-1 mb-1.5 tracking-tight">{plan.name || plan.tier}</h4>
                    <p className="text-text-3 text-[12px] leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Divider */}
                  <div className={`w-full h-px mb-6 ${plan.tier === "pro" ? "bg-gradient-to-r from-transparent via-primary-1/40 to-transparent" :
                    plan.tier === "exclusive" ? "bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" :
                      "bg-bg-3/60"
                    }`} />

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="text-[14px] text-text-3 mb-1.5 font-medium">Rp</span>
                      <span className={`text-[46px] leading-none font-black tracking-tight ${style.priceColor}`}>
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-text-3/70 text-[12px] mb-1.5 ml-0.5">/month</span>
                    </div>
                  </div>

                  {/* Divider 2: Pricing to Benefits */}
                  <div className="w-full h-px bg-bg-3/60 mb-6" />

                  {/* Benefits Included section */}
                  <div className="flex-1 flex flex-col mb-6">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-text-3 mb-4">
                      Benefits Included:
                    </h5>

                    <div className="space-y-1.5 flex-1">
                      {plan.features.map((feature) => {
                        const normalizedLabel = feature.label?.toLowerCase().trim();
                        const subtext = FEATURE_DETAILS[normalizedLabel] ?? null;
                        const detail = feature.unlimited
                          ? "Unlimited"
                          : feature.limit_value
                            ? `Up to ${feature.limit_value.toLocaleString("id-ID")}`
                            : null;
                        return (
                          <FeatureItem
                            key={feature.id}
                            text={feature.label}
                            subtext={subtext}
                            detail={detail}
                            tier={plan.tier}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Divider 3: Benefits to Action Button */}
                  <div className="w-full h-px bg-bg-3/60 mb-6" />

                  {/* Action Button */}
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl bg-bg-3/20 border border-bg-3 text-text-3 text-[13px] font-semibold cursor-default"
                    >
                      ✓ Current Plan
                    </button>
                  ) : isUpgrade ? (
                    <button
                      onClick={() => handleUpgradeClick(plan)}
                      className={style.btnClass}
                    >
                      {buttonLabel}
                    </button>
                  ) : (
                    <button className="w-full py-3 rounded-xl border border-bg-3 text-text-3 text-[13px] font-medium hover:bg-bg-3/50 transition-colors">
                      {buttonLabel}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Subscription History */}
      <SubscriptionHistory />

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      {confirmPlan && (
        <ConfirmModal plan={confirmPlan} onConfirm={handleConfirm} onClose={() => setConfirmPlan(null)} />
      )}

      {paymentPlan && transactionData && (
        <PaymentModal plan={paymentPlan} transactionData={transactionData} onClose={handlePaymentClose} />
      )}
    </>
  );
}

