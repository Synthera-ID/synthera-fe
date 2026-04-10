export default function Hero() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 bg-bg-1 min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* EFEK CAHAYA LATAR (ORB EFECTS) */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-[160px] sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-primary-1 to-primary-4 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]"></div>
      </div>

      <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 relative z-10">
        <div className="text-center">
          {/* JUDUL: Sesuai Typography (56px) & Black Weight */}
          <h1 className="text-3xl font-extrabold tracking-tight text-text-1 sm:text-[40px] leading-[1.2]">
            Upgrade Skillmu, Mulai <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-4 via-primary-1 to-primary-3">
              Perjalanan Digitalmu
            </span> <br />
            Hari Ini
          </h1>
          
          {/* DESKRIPSI: Sesuai Typography (14px) */}
          <p className="mt-6 text-[13px] font-normal text-text-2 sm:text-[14px] leading-relaxed max-w-[480px] mx-auto opacity-80">
            Gabung di Synthera sekarang! Nikmati e-course premium dan membership eksklusif untuk meningkatkan skill dan peluang kariermu. memberships with next-gen tools.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button className="rounded-xl bg-primary-1 px-8 py-3 text-[13px] font-medium text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:bg-primary-2 hover:scale-105 transition-all tracking-wide">
              Mulai Belajar Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* CAHAYA BAWAH */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-[160px] sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-primary-2 to-primary-4 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72rem]"></div>
      </div>
    </div>
  );
}