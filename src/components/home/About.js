export default function About() {
  return (
    <section id="about" className="py-24 bg-[#0d0a1a] border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Empowering Your <br/> <span className="text-[#7c5dfa]">Digital Community</span>
            </h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              Synthera menyediakan infrastruktur yang dibutuhkan untuk mengelola membership dan konten eksklusif Anda tanpa hambatan teknis.
            </p>
          </div>
          <div className="p-1 bg-gradient-to-br from-purple-500/20 to-transparent rounded-[2rem]">
            <div className="bg-[#120f26] p-10 rounded-[1.9rem] border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
                <p className="text-white font-medium">Next-gen Management Tools</p>
              </div>
              <p className="text-gray-500 text-sm">Sistem terintegrasi yang memungkinkan Anda fokus sepenuhnya pada pertumbuhan komunitas tanpa pusing soal server.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}