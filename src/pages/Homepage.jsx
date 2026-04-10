'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : 'py-6'}`}>
      <div className="container flex items-center justify-between px-6 mx-auto">
        <div className="flex items-center gap-2 cursor-pointer">
          <img src="/icon.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold tracking-tight text-white">Synthera</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="btn-ghost">Features</a>
          <a href="#pricing" className="btn-ghost">Pricing</a>
          <a href="#faq" className="btn-ghost">FAQ</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white">Login</Link>
          <Link href="/register" className="btn-primary">Register</Link>
        </div>
      </div>
    </header>
  );
}