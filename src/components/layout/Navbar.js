'use client';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-[100] bg-[#0d0a1a]/80 backdrop-blur-xl border-b border-white/5 py-5">
      <div className="container mx-auto px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#7c5dfa] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(124,93,250,0.4)]">
            <span className="text-white font-black text-lg italic">S</span>
          </div>
          <span className="text-2xl font-black text-white tracking-tighter italic">SYNTHERA</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[13px] font-bold text-gray-400 tracking-widest uppercase">
          <a href="#" className="hover:text-[#7c5dfa] transition-colors">Features</a>
          <a href="#" className="hover:text-[#7c5dfa] transition-colors">Pricing</a>
          <a href="#" className="hover:text-[#7c5dfa] transition-colors">FAQ</a>
        </div>

        <button className="bg-white/5 hover:bg-white/10 text-white px-7 py-2.5 rounded-xl text-sm font-bold border border-white/10 transition-all">
          Login
        </button>
      </div>
    </nav>
  );
}