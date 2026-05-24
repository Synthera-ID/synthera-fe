"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Check, X, QrCode, ShieldCheck, RefreshCw,
  Building2, Copy, CheckCheck,
} from "lucide-react";
import apiFetch from "@/utils/apiFetch";
import { formatRupiah } from "@/utils/format";

// ─── Modal Backdrop ───────────────────────────────────────────────────────────
function ModalBackdrop({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
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
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 active:scale-[0.98] ${
            copied
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

// ─── Payment Modal ────────────────────────────────────────────────────────────
/**
 * PaymentModal
 * @param {object} plan           - { name: string } — nama paket
 * @param {object} transactionData - { invoice_code, payment_method, payment_string, amount }
 * @param {function} onClose      - callback tutup modal
 */
export default function PaymentModal({ plan, transactionData, onClose }) {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [status, setStatus]     = useState("pending");
  const [refreshing, setRefreshing] = useState(false);

  const isQris = transactionData.payment_method === "qris";
  const isVA   = transactionData.payment_method === "bank_transfer";

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
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
      // Silently fail
    } finally {
      setRefreshing(false);
    }
  }, [transactionData.invoice_code, refreshing]);

  // Derived labels
  const statusConfig = {
    pending: { label: "Menunggu Pembayaran", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    success: { label: "Pembayaran Berhasil", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    failed:  { label: "Pembayaran Gagal",   color: "text-red-400 bg-red-500/10 border-red-500/20" },
  };
  const currentStatus       = statusConfig[status] || statusConfig.pending;
  const timerExpiredLabel   = isVA ? "VA Expired" : "QR Expired";
  const methodLabel         = isQris ? "QRIS" : isVA ? "Bank Transfer (VA)" : transactionData.payment_method;
  const headerTitle         = isVA ? "Pembayaran Virtual Account" : "Pembayaran QRIS";

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

          {/* Payment Content */}
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
            <VANumberDisplay vaNumber={transactionData.payment_string} />
          ) : (
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
              <span className="text-[13px] font-semibold capitalize">{plan?.name || "-"}</span>
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

          {/* Refresh Status */}
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
            <span className="text-[11px]">Transaksi aman &amp; terenkripsi</span>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}
