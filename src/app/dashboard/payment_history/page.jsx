"use client";

import { useState } from "react";
import { Search, Download, ChevronDown } from "lucide-react";

const TRANSACTIONS = [
  { id: "INV-2026-0015", date: "Feb 15, 2026", description: "Pro Plan - Monthly", amount: "$29.00", status: "Paid" },
  { id: "INV-2026-0014", date: "Jan 15, 2026", description: "Pro Plan - Monthly", amount: "$29.00", status: "Paid" },
  { id: "INV-2025-0013", date: "Dec 15, 2025", description: "Pro Plan - Monthly", amount: "$29.00", status: "Paid" },
];

export default function PaymentHistoryPage() {
  const [search, setSearch] = useState("");

  return (
    <>
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold mb-1.5">Payment History</h1>
          <p className="text-text-3 text-[13px]">Track your subscription payments and invoices.</p>
        </div>
      </header>

      {/* Table */}
      <div className="bg-bg-2 border border-bg-3 rounded-[20px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-bg-3 bg-bg-3/20">
                <th className="px-6 py-4 font-bold text-text-1">Invoice ID</th>
                <th className="px-6 py-4 font-bold text-text-1">Date</th>
                <th className="px-6 py-4 font-bold text-text-1">Description</th>
                <th className="px-6 py-4 font-bold text-text-1">Amount</th>
                <th className="px-6 py-4 font-bold text-text-1">Status</th>
                <th className="px-6 py-4 font-bold text-text-1 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-3">
              {TRANSACTIONS.map((t) => (
                <tr key={t.id} className="hover:bg-bg-3/10 transition-colors">
                  <td className="px-6 py-4 text-text-1 font-medium">{t.id}</td>
                  <td className="px-6 py-4 text-text-2">{t.date}</td>
                  <td className="px-6 py-4 text-text-2">{t.description}</td>
                  <td className="px-6 py-4 text-text-1 font-bold">{t.amount}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary-3 hover:text-primary-1 transition-colors">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
