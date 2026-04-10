export default function Input({ label, icon, inputClassName = "", ...props }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Label dengan warna teks sekunder */}
      {label && <label className="text-sm font-medium text-text-2">{label}</label>}
      
      <div className="relative">
        {/* Ikon dengan warna teks tertier */}
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3">{icon}</span>}
        
        {/* Input Field */}
        <input 
          className={`w-full bg-bg-3/50 border border-white/[0.08] rounded-xl px-4 py-2.5 text-text-1 text-[13px] placeholder:text-text-3 focus:border-primary-1/60 focus:ring-1 focus:ring-primary-1/30 outline-none transition-all duration-300 ${icon ? 'pl-10' : ''} ${inputClassName}`}
          {...props}
        />
      </div>
    </div>
  );
}