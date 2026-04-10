export default function Card({ children, className = "" }) {
  return (
    <div 
      className={`bg-bg-2 border border-bg-3 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-1/30 hover:shadow-[0_8px_30px_rgba(139,92,246,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}