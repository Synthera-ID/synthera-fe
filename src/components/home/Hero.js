export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0d0a1a] overflow-hidden">
      {/* Background Glow - Synthera Purple */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7c5dfa]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-tight">
          Unlock the Power <br/> 
          <span className="text-[#7c5dfa]">of Synthera</span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          The ultimate platform for creators to manage and scale their digital ecosystem with next-gen neural tools.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <button className="px-10 py-4 bg-[#7c5dfa] hover:bg-[#6a4df4] text-white rounded-2xl font-bold transition-all shadow-[0_10px_30px_rgba(124,93,250,0.3)]">
            Get Started
          </button>
          <button className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-semibold transition-all backdrop-blur-sm">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}