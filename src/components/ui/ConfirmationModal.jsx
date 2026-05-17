"use client";

import { AlertCircle, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "primary", // primary, danger
  isLoading = false,
  icon: Icon = AlertCircle,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  const variantStyles = {
    primary: {
      iconBg: "bg-primary-1/15",
      iconColor: "text-primary-3",
      buttonBg: "bg-primary-1 hover:bg-primary-2 shadow-[0_8px_30px_rgba(139,92,246,0.25)] hover:shadow-[0_8px_40px_rgba(139,92,246,0.4)]",
    },
    danger: {
      iconBg: "bg-rose-500/15",
      iconColor: "text-rose-400",
      buttonBg: "bg-rose-500 hover:bg-rose-400 shadow-[0_8px_30px_rgba(244,63,94,0.25)] hover:shadow-[0_8px_40px_rgba(244,63,94,0.4)]",
    },
  };

  const style = variantStyles[variant] || variantStyles.primary;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onCancel}
      />

      {/* Modal Container */}
      <div 
        className={`relative bg-bg-2 border border-bg-3 rounded-[32px] p-8 w-full max-w-sm shadow-2xl transition-all duration-300 transform ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute right-6 top-6 text-text-3 hover:text-text-1 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          {/* Icon Section */}
          <div className={`w-16 h-16 rounded-2xl ${style.iconBg} flex items-center justify-center mx-auto mb-6`}>
            <Icon size={30} className={style.iconColor} />
          </div>
          
          <h2 className="text-[20px] font-bold mb-2 text-text-1 tracking-tight">{title}</h2>
          <p className="text-text-3 text-[14px] leading-relaxed mb-8 px-2">
            {message}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-2xl border border-bg-3 text-text-3 hover:text-text-1 hover:bg-bg-3 text-[14px] font-bold transition-all active:scale-95"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-2xl ${style.buttonBg} text-white text-[14px] font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95`}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
