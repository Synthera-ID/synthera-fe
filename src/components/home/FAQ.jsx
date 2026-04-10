'use client';
import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Apakah tersedia versi gratis untuk mencoba?",
      a: "Ya, kamu bisa menggunakan Synthera secara gratis sebelum upgrade. Coba berbagai fitur, buat course, dan kelola member tanpa komitmen."
    },
    {
      q: "Metode pembayaran apa saja yang didukung?",
      a: "Kami mendukung berbagai metode pembayaran seperti transfer bank, e-wallet, dan payment gateway populer sesuai wilayah kamu."
    },
    {
      q: "Apakah Synthera bisa diintegrasikan dengan sistem lain?",
      a: "Kami mendukung berbagai metode pembayaran seperti transfer bank, e-wallet, dan payment gateway populer sesuai wilayah kamu."
    },
    {
      q: "Bagaimana cara kerja sistem membership di Synthera?",
      a: "Kamu bisa membuat berbagai jenis paket membership dan mengatur akses konten atau course berdasarkan paket yang dipilih oleh member."
    },
    {
      q: "Apakah saya bisa membatalkan langganan kapan saja?",
      a: "Ya, kamu bisa membatalkan langganan kapan saja. Akses akan tetap aktif hingga masa langganan berakhir."
    }
  ];

  return (
    <section id="faq" className="py-24 relative z-10">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-text-1 tracking-tight">
          Pertanyaan yang Sering Diajukan
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="bg-bg-2 border border-bg-3 rounded-xl overflow-hidden transition-colors duration-300 hover:border-primary-1/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full px-5 py-4 flex justify-between items-center text-left focus:outline-none"
              >
                <span className="font-medium text-text-1 text-[13px] md:text-sm">
                  {faq.q}
                </span>
                
                <svg 
                  className={`w-4 h-4 text-text-2 flex-shrink-0 ml-4 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-5 pb-4 text-text-2 text-[13px] leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}