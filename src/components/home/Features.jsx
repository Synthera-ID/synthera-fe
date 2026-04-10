'use client';
import { Link, BarChart3, Shield, Zap, Users, FileText } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Link className="text-primary-3 group-hover:text-primary-1 transition-colors duration-300" size={32} />,
      title: "Integrasi Mudah",
      desc: "Hubungkan dengan berbagai tools, payment gateway, dan sistem lainnya tanpa ribet."
    },
    {
      icon: <BarChart3 className="text-primary-3 group-hover:text-primary-1 transition-colors duration-300" size={32} />,
      title: "Analitik Member & Kursus",
      desc: "Pantau aktivitas, performa, dan tingkat engagement secara real-time."
    },
    {
      icon: <Shield className="text-primary-3 group-hover:text-primary-1 transition-colors duration-300" size={32} />,
      title: "Keamanan Data Terjamin",
      desc: "Lindungi data member dan konten digital dengan sistem keamanan tingkat tinggi."
    },
    {
      icon: <Zap className="text-primary-3 group-hover:text-primary-1 transition-colors duration-300" size={32} />,
      title: "API Cepat & Stabil",
      desc: "Bangun integrasi custom dengan performa tinggi dan uptime maksimal."
    },
    {
      icon: <Users className="text-primary-3 group-hover:text-primary-1 transition-colors duration-300" size={32} />,
      title: "Manajemen Tim",
      desc: "Kelola admin, instruktur, dan tim dengan sistem role & permission yang fleksibel."
    },
    {
      icon: <FileText className="text-primary-3 group-hover:text-primary-1 transition-colors duration-300" size={32} />,
      title: "Digital Content Manajemen Konten & Membership",
      desc: "Atur akses konten berdasarkan paket membership dan distribusikan course dengan mudah."
    }
  ];

  return (
    <section id="features" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-1 tracking-tight">
            Fitur yang bisa kamu dapatkan
          </h2>
          <p className="text-text-2 text-sm md:text-base leading-relaxed">
            Segala yang Anda butuhkan untuk membangun, mengelola, dan mengembangkan bisnis berlangganan Anda.
          </p>
        </div>

        {/* GRID FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center bg-bg-2 border border-bg-3 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary-1/40 hover:shadow-[0_8px_30px_rgba(139,92,246,0.08)] group"
            >
              {/* Icon Container (Tanpa background kotak agar sesuai gambar) */}
              <div className="mb-6">
                {item.icon}
              </div>
              
              <h3 className="text-lg font-bold text-text-1 mb-3">
                {item.title}
              </h3>
              
              <p className="text-text-2 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}