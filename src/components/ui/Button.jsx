export default function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    // Tombol Utama: Ungu dengan efek glow
    primary: "bg-primary-1 hover:bg-primary-2 text-text-1 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:-translate-y-0.5",
    
    // Tombol Outline: Transparan dengan garis tepi
    outline: "border border-bg-4 hover:border-primary-1/50 bg-bg-1 hover:bg-bg-3 text-text-1 hover:shadow-[0_0_15px_rgba(139,92,246,0.1)]",
    
    // Tombol Ghost: Hanya teks, muncul background saat di-hover
    ghost: "text-text-2 hover:text-text-1 hover:bg-bg-3",

    // Tombol Glass: Transparan terang untuk social login
    glass: "bg-white/5 border border-white/[0.08] hover:bg-white/10 text-white font-medium shadow-none hover:-translate-y-0"
  };

  return (
    <button 
      className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}