"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Loader2, X, QrCode, ShieldCheck, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import apiFetch from "@/utils/apiFetch";
import { formatPrice, formatRupiah, formatDate } from "@/utils/format";

// ─── Constants ────────────────────────────────────────────────────────────────
const TIER_ORDER = { basic: 0, pro: 1, exclusive: 2 };

const TIER_STYLES = {
  basic: {
    ribbon: null,
    card: "bg-bg-2 border border-bg-3",
    priceColor: "",
  },
  pro: {
    ribbon: "POPULAR",
    card: "bg-primary-1/5 border border-primary-1 shadow-[0_0_20px_rgba(139,92,246,0.1)]",
    priceColor: "text-primary-3",
  },
  exclusive: {
    ribbon: "BEST VALUE",
    card: "bg-amber-500/5 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.08)]",
    priceColor: "text-amber-400",
  },
};

const PAYMENT_METHODS = [
  { id: "qris", code: "SP", label: "QRIS", icon: QrCode, desc: "Scan & bayar via e-wallet / m-banking" },
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left ${
                    method === m.id
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

// ─── Payment Modal (Step 2) ───────────────────────────────────────────────────
function PaymentModal({ plan, transactionData, onClose }) {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [status, setStatus] = useState("pending");
  const [refreshing, setRefreshing] = useState(false);

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
      console.log(res)
      const newStatus = res?.transaction_status || res?.status || "pending";
      setStatus(newStatus);

      if (newStatus === "success" || newStatus === "paid" || newStatus === "completed") {
        setStatus("success");
      } else if (newStatus === "failed" || newStatus === "expired" || newStatus === "cancelled") {
        setStatus("failed");
      }
    } catch {
      // Silently fail, keep current status
    } finally {
      setRefreshing(false);
    }
  }, [transactionData.invoice_code, refreshing]);

  // Status badge
  const statusConfig = {
    pending: { label: "Menunggu Pembayaran", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    success: { label: "Pembayaran Berhasil", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    failed: { label: "Pembayaran Gagal", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  };

  const currentStatus = statusConfig[status] || statusConfig.pending;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-bg-2 border border-bg-3 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-bg-3">
          <h3 className="text-[16px] font-bold">Pembayaran QRIS</h3>
          <button onClick={onClose} className="text-text-3 hover:text-text-1 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col items-center space-y-5">
          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className={`w-2 h-2 rounded-full ${timeLeft > 0 ? "bg-amber-400 animate-pulse" : "bg-red-400"}`} />
            <span className="text-[12px] font-semibold text-amber-400">
              {timeLeft > 0 ? `Berlaku ${minutes}:${seconds}` : "QR Expired"}
            </span>
          </div>

          {/* QR Code from real payment_url */}
          {status === "success" ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check size={32} className="text-emerald-400" strokeWidth={3} />
              </div>
              <p className="text-[14px] font-bold text-emerald-400">Pembayaran Berhasil!</p>
              <p className="text-[12px] text-text-3 text-center">Subscription Anda akan segera diaktifkan.</p>
            </div>
          ) : status === "failed" ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <X size={32} className="text-red-400" strokeWidth={3} />
              </div>
              <p className="text-[14px] font-bold text-red-400">Pembayaran Gagal</p>
              <p className="text-[12px] text-text-3 text-center">Silakan coba lagi atau hubungi support.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <img
                src={transactionData.payment_url}
                alt="QRIS Payment"
                width={220}
                height={220}
                className="rounded-lg"
              />
            </div>
          )}

          {/* Status Badge */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${currentStatus.color}`}>
            <span className="text-[12px] font-semibold">{currentStatus.label}</span>
          </div>

          {/* Info */}
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
              <span className="text-[13px] font-medium">{transactionData.payment_method === "SP" ? "QRIS" : transactionData.payment_method}</span>
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
              <p className="text-[11px] font-semibold text-text-3">Cara Pembayaran:</p>
              <ol className="text-[11px] text-text-3 space-y-1 list-decimal list-inside leading-relaxed">
                <li>Buka aplikasi e-wallet atau m-banking Anda</li>
                <li>Pilih menu Scan QR atau QRIS</li>
                <li>Scan kode QR di atas</li>
                <li>Konfirmasi dan selesaikan pembayaran</li>
              </ol>
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
function FeatureItem({ text, detail, isLast }) {
  return (
    <div className={`flex items-start gap-3 pb-3.5 mt-4 ${!isLast ? "border-b border-bg-3/60" : ""}`}>
      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5 flex-shrink-0">
        <Check size={12} className="text-emerald-400" strokeWidth={3} />
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-text-2 text-[13px] font-medium">{text}</span>
        {detail && <span className="text-text-3 text-[11px] mt-0.5">{detail}</span>}
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
      } catch (err) {
        setError("Gagal memuat data paket. Silakan coba lagi.");
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
      <div className="mb-6">
        <h3 className="text-[17px] font-bold mb-8">Compare Plans</h3>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-primary-3" />
            <span className="ml-3 text-text-3 text-[13px]">Memuat paket...</span>
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
              Coba Lagi
            </button>
          </div>
        )}

        {/* Plans Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrent = plan.id === currentSubId;
              const style = TIER_STYLES[plan.tier] || TIER_STYLES.basic;
              const currentTierOrder = TIER_ORDER[currentTier] ?? -1;
              const planTierOrder = TIER_ORDER[plan.tier] ?? 0;
              const isUpgrade = planTierOrder > currentTierOrder;

              // Determine button label
              let buttonLabel = "Upgrade";
              if (isCurrent) buttonLabel = "Current Plan";
              else if (!isUpgrade) buttonLabel = "Downgrade";

              return (
                <div key={plan.id} className={`relative overflow-hidden rounded-2xl p-8 flex flex-col ${style.card}`}>
                  {/* Ribbon */}
                  {style.ribbon && (
                    <div
                      className={`absolute right-[-40px] top-[24px] w-[150px] rotate-45 text-center py-1.5 text-[9px] font-bold text-white tracking-widest shadow-md ${
                        plan.tier === "exclusive" ? "bg-amber-500" : "bg-primary-1"
                      }`}
                    >
                      {style.ribbon}
                    </div>
                  )}

                  {/* Plan Name */}
                  <h4 className="text-[17px] font-bold text-center mb-2 capitalize">{plan.tier}</h4>
                  <p className="text-text-3 text-[11px] text-center mb-8 leading-relaxed">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8 text-center">
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-[13px] text-text-3 mb-1.5 mr-0.5">Rp</span>
                      <span className={`text-[40px] leading-none font-bold ${style.priceColor}`}>
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-text-3 text-[14px] mb-1">/mo</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8 flex-1 space-y-0">
                    {plan.features.map((feature, idx) => (
                      <FeatureItem
                        key={feature.id}
                        text={feature.label}
                        detail={
                          feature.unlimited
                            ? "Unlimited"
                            : feature.limit_value
                              ? `Limit: ${feature.limit_value.toLocaleString("id-ID")}`
                              : null
                        }
                        isLast={idx === plan.features.length - 1}
                      />
                    ))}
                  </div>

                  {/* Action Button */}
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-[10px] px-5 rounded-lg bg-primary-1 text-white text-[13px] font-medium text-center shadow-lg shadow-primary-1/20 cursor-default opacity-90"
                    >
                      Current Plan
                    </button>
                  ) : isUpgrade ? (
                    <button
                      onClick={() => handleUpgradeClick(plan)}
                      className="w-full py-[10px] px-5 rounded-lg text-[13px] font-semibold text-center transition-all duration-200 border border-primary-1/40 text-primary-3 hover:bg-primary-1/10 active:scale-[0.98]"
                    >
                      {buttonLabel}
                    </button>
                  ) : (
                    <button className="w-full py-[10px] px-5 rounded-lg text-[13px] font-medium text-center border border-bg-3 text-text-3 hover:bg-bg-3 transition-colors">
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

