import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Services from '@/components/home/Services';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] selection:bg-blue-500/30 selection:text-blue-200">
      {/* 1. Navigasi Tetap di Atas */}
      <Navbar />

      {/* 2. Konten Utama */}
      <main>
        {/* Bagian Pembuka (Hero) */}
        <Hero />

        {/* Bagian Penjelasan (About) */}
        <About />

        {/* Bagian Layanan (Services) */}
        <Services />

        {/* Anda bisa menambah <Pricing /> atau <Footer /> di sini nanti */}
      </main>

      {/* Footer Sederhana (Opsional sebelum Anda buat filenya) */}
      <footer className="py-12 border-t border-white/5 bg-[#050505] text-center">
        <p className="text-gray-500 text-sm italic">
          &copy; {new Date().getFullYear()} Synthera Labs. All rights reserved.
        </p>
      </footer>
    </div>
  );
}