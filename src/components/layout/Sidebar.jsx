import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-bg-1 border-r border-bg-3 p-6 hidden lg:flex flex-col sticky top-0 z-40">
      
      {/* Brand / Logo Section */}
      <Link href="/" className="flex items-center gap-3 mb-10 group w-fit">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-3 to-primary-1 flex items-center justify-center text-text-1 font-bold text-lg group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all">
           S
        </div>
        <span className="text-xl font-bold tracking-wide text-text-1">
          Synthera
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2">
        {/* Active Link (Contoh: Dashboard) */}
        <Link 
          href="/dashboard" 
          className="p-3 bg-primary-1/10 rounded-xl text-primary-3 font-semibold border border-primary-1/20 transition-all"
        >
          Dashboard
        </Link>
        
        {/* Inactive Links */}
        <Link 
          href="/courses" 
          className="p-3 text-text-2 font-medium hover:text-text-1 hover:bg-bg-3 rounded-xl transition-all"
        >
          Courses
        </Link>
        
        <Link 
          href="/members" 
          className="p-3 text-text-2 font-medium hover:text-text-1 hover:bg-bg-3 rounded-xl transition-all"
        >
          Members
        </Link>
        
        <Link 
          href="/settings" 
          className="p-3 text-text-2 font-medium hover:text-text-1 hover:bg-bg-3 rounded-xl transition-all mt-auto"
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
}