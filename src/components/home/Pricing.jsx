'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/utils/cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:8000/api";

// Tier styling config
const TIER_STYLES = {
  basic:     { isPopular: false, buttonStyle: 'default' },
  pro:       { isPopular: true,  buttonStyle: 'primary' },
  exclusive: { isPopular: false, buttonStyle: 'danger' },
};

function formatCurrency(amount) {
  if (!amount || amount === 0) return "Free";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("userAccessToken");
    setIsLoggedIn(!!token);
  }, []);

  function handleChoosePlan() {
    if (isLoggedIn) {
      router.push('/dashboard/subscription');
    } else {
      router.push('/login');
    }
  }

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch(`${API_BASE_URL}/subscriptions`);
        if (!res.ok) throw new Error("Failed to fetch plans");
        const json = await res.json();
        // The public API uses SubscriptionResource::collection which wraps in { data: [...] }
        const data = json.data || json;
        setPlans(data);
      } catch (err) {
        console.error("Failed to fetch subscription plans:", err);
        setError("Gagal memuat paket langganan.");
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  return (
    <section id="pricing" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">

        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-1 tracking-tight">
          Mulai Gratis, Upgrade Kapan Saja
        </h2>
        <p className="text-text-2 mb-16 text-sm md:text-base max-w-2xl mx-auto">
          Mulai dari gratis tanpa biaya tersembunyi. Cocok untuk creator, mentor, dan bisnis digital.
        </p>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 size={24} className="animate-spin text-primary-3" />
            <span className="text-text-3 text-[14px]">Memuat paket langganan...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-3">
            <p className="text-[14px]">{error}</p>
          </div>
        )}

        {/* Grid Kartu Harga */}
        {!loading && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => {
              const tierKey = plan.tier?.toLowerCase() || 'basic';
              const tierStyle = TIER_STYLES[tierKey] || TIER_STYLES.basic;
              const isFree = !plan.price || plan.price === 0;
              const features = plan.features || [];

              return (
                <div
                  key={plan.id}
                  className={`bg-bg-2 rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all duration-300 h-full
                    ${tierStyle.isPopular
                      ? 'border border-primary-1/50 shadow-[0_0_40px_rgba(139,92,246,0.15)] md:-translate-y-4'
                      : 'border border-bg-3 hover:border-bg-4'
                    }`}
                >
                  {/* Ribbon POPULAR */}
                  {tierStyle.isPopular && (
                    <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none rounded-tr-2xl">
                      <div className="absolute top-[24px] right-[-34px] w-[140px] bg-primary-1 text-center py-1 text-[10px] font-bold text-white tracking-wider uppercase rotate-45 shadow-lg">
                        Popular
                      </div>
                    </div>
                  )}

                  {/* Nama & Harga */}
                  <h3 className="text-xl font-bold mb-2 text-text-1">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-[13px] text-text-3 mb-4 line-clamp-2">{plan.description}</p>
                  )}
                  <div className="mb-8 flex items-end justify-center gap-1">
                    <span className={`text-4xl font-extrabold ${tierStyle.isPopular ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#c4b5fd] to-[#8b5cf6]' : 'text-text-1'}`}>
                      {isFree ? "Free" : formatCurrency(plan.price)}
                    </span>
                    {!isFree && <span className="text-text-2 font-medium mb-1">/mo</span>}
                  </div>

                  {/* Fitur */}
                  <ul className="text-left w-full space-y-4 mb-8 flex-grow">
                    {features.map((feat) => (
                      <li key={feat.id} className="flex items-center gap-3 text-sm text-text-2">
                        <svg className="w-4 h-4 flex-shrink-0 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>
                          {feat.label}
                          {feat.unlimited ? " (Unlimited)" : feat.limit_value ? ` (${feat.limit_value})` : ""}
                        </span>
                      </li>
                    ))}
                    {features.length === 0 && (
                      <li className="text-sm text-text-3 opacity-60 text-center">No features listed</li>
                    )}
                  </ul>

                  {/* Tombol CTA */}
                  <button
                    onClick={handleChoosePlan}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all mt-auto
                      ${tierStyle.buttonStyle === 'primary'
                        ? 'bg-primary-1 text-white hover:bg-primary-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5'
                        : tierStyle.buttonStyle === 'danger'
                          ? 'bg-transparent border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10'
                          : 'bg-bg-1 border border-bg-3 text-text-1 hover:bg-bg-3'
                      }`}
                  >
                    {isFree ? "Get Started for Free" : tierKey === 'exclusive' ? "Contact Sales" : `Start ${plan.name} Trial`}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && plans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-3">
            <p className="text-[14px]">Belum ada paket langganan tersedia.</p>
          </div>
        )}
      </div>
    </section>
  );
}