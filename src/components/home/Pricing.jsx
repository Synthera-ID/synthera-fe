'use client';
import { useState } from 'react';

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: "Starter",
      price: 0,
      features: [
        { text: "Basic platform access", included: true },
        { text: "Community support", included: true },
        { text: "Advanced analytics", included: false },
        { text: "Custom integrations", included: false },
        { text: "Priority support", included: false }
      ],
      button: "Get Started for Free",
      isPopular: false
    },
    {
      name: "Pro",
      price: 1.99,
      features: [
        { text: "All Starter features", included: true },
        { text: "Advanced analytics", included: true },
        { text: "API access", included: true },
        { text: "Email support", included: true }
      ],
      button: "Start Pro Trial",
      isPopular: true
    },
    {
      name: "Exclusive",
      price: 5,
      features: [
        { text: "All Pro features", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "SLA support", included: true },
        { text: "On-premise deployment", included: true },
        { text: "Custom training", included: true }
      ],
      button: "Contact Sales",
      isPopular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">

        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-1 tracking-tight">
          Mulai Gratis, Upgrade Kapan Saja
        </h2>
        <p className="text-text-2 mb-10 text-sm md:text-base max-w-2xl mx-auto">
          Mulai dari gratis tanpa biaya tersembunyi. Cocok untuk creator, mentor, dan bisnis digital.
        </p>

        {/* Toggle — visual only, harga tidak berubah */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-text-1' : 'text-text-3'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-7 bg-bg-3 border border-bg-4 rounded-full p-1 transition-all relative flex items-center"
          >
            <div className={`w-5 h-5 bg-primary-1 rounded-full transition-all duration-300 shadow-md ${isYearly ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-text-1' : 'text-text-3'}`}>
            Yearly (Save 20%)
          </span>
        </div>

        {/* Grid Kartu Harga */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`bg-bg-2 rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all duration-300 h-full
                ${plan.isPopular
                  ? 'border border-primary-1/50 shadow-[0_0_40px_rgba(139,92,246,0.15)] md:-translate-y-4'
                  : 'border border-bg-3 hover:border-bg-4'
                }`}
            >
              {/* Ribbon POPULAR */}
              {plan.isPopular && (
                <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none rounded-tr-2xl">
                  <div className="absolute top-[24px] right-[-34px] w-[140px] bg-primary-1 text-center py-1 text-[10px] font-bold text-white tracking-wider uppercase rotate-45 shadow-lg">
                    Popular
                  </div>
                </div>
              )}

              {/* Nama & Harga */}
              <h3 className="text-xl font-bold mb-4 text-text-1">{plan.name}</h3>
              <div className="mb-8 flex items-end justify-center gap-1">
                <span className={`text-5xl font-extrabold ${plan.isPopular ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#c4b5fd] to-[#8b5cf6]' : 'text-text-1'}`}>
                  ${plan.price}
                </span>
                <span className="text-text-2 font-medium mb-1">/mo</span>
              </div>

              {/* Fitur */}
              <ul className="text-left w-full space-y-4 mb-8 flex-grow">
                {plan.features.map((feat, fi) => (
                  <li key={fi} className={`flex items-center gap-3 text-sm ${feat.included ? 'text-text-2' : 'text-text-3 opacity-60'}`}>
                    {feat.included ? (
                      /* Centang — warna hijau (success) */
                      <svg className="w-4 h-4 flex-shrink-0 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      /* Silang — abu-abu, TANPA strikethrough */
                      <svg className="w-4 h-4 flex-shrink-0 text-text-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {/* Tidak ada line-through — hanya opacity yang dikurangi */}
                    <span>{feat.text}</span>
                  </li>
                ))}
              </ul>

              {/* Tombol CTA */}
              <button
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all mt-auto
                  ${plan.isPopular
                    ? 'bg-primary-1 text-white hover:bg-primary-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5'
                    : plan.name === "Exclusive"
                      ? 'bg-transparent border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10'
                      : 'bg-bg-1 border border-bg-3 text-text-1 hover:bg-bg-3'
                  }`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}