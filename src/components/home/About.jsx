'use client';

export default function About() {
  const testimonials = [
    { 
      name: "Sarah K.", 
      role: "Creator, 5K members", 
      text: "Sekarang saya bisa jual course dan kelola member dalam satu platform. Semuanya jadi lebih rapi dan efisien.", 
      initial: "S" 
    },
    { 
      name: "Michael R.", 
      role: "CTO, TechStart Inc.", 
      text: "Integrasi API berjalan cepat dan stabil. Sangat membantu untuk kebutuhan sistem yang lebih kompleks.", 
      initial: "M" 
    },
    { 
      name: "Emily L.", 
      role: "Educator, Online Academy", 
      text: "Fitur membership sangat fleksibel. Saya bisa mengatur akses konten premium dengan mudah.", 
      initial: "E" 
    }
  ];

  return (
    <section id="about" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-text-1 tracking-tight">
          Apa Kata Pengguna Kami
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div 
              key={i} 
              className="bg-bg-2 border border-bg-3 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:border-primary-1/40 hover:shadow-[0_8px_30px_rgba(139,92,246,0.08)]"
            >
              {/* Avatar Bulat Ungu */}
              <div className="mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-1 flex items-center justify-center text-text-1 font-bold text-lg">
                  {t.initial}
                </div>
              </div>
              
              {/* Quote Text */}
              <p className="italic text-text-2 text-sm leading-relaxed mb-6">
                "{t.text}"
              </p>
              
              {/* User Meta (Nama dan Role) */}
              <div className="mt-auto">
                <h4 className="text-text-1 font-bold text-sm mb-1">
                  — {t.name}
                </h4>
                {/* Baris ke-3: Menggunakan class font-normal agar tidak bold */}
                <p className="text-text-3 text-xs font-normal">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}