"use client";

import { LogOut, X } from "lucide-react";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-sm bg-[#0D0D12] border border-[#1A1A24] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="p-8 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
            <LogOut size={28} />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">Sign Out?</h2>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-8">
            Are you sure you want to end your session? You will need to login again to access your account.
          </p>
          
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onConfirm}
              className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-500/20 active:scale-95"
            >
              Sign Out
            </button>
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-[#13131A] border border-[#1A1A24] text-[#9CA3AF] font-bold rounded-2xl hover:bg-[#1A1A24] hover:text-white transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B7280] hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
