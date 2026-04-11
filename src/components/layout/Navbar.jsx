"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("light");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Selalu tampil di paling atas
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scroll ke bawah → sembunyikan
        setIsVisible(false);
      } else {
        // Scroll ke atas → tampilkan lagi
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] bg-transparent py-5 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-10 md:px-20 flex items-center justify-between">
        {/* --- LOGO (Kiri) --- */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/icon.png" alt="Synthera Logo" width={48} height={48} className="rounded-full" />

          <span className="text-xl font-bold tracking-tight text-white">Synthera</span>
        </Link>

        {/* --- GRUP KANAN (Toggle + Menu + Login) --- */}
        <div className="flex items-center gap-6">
          {/* 1. Toggle Tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
          >
            {isDarkMode ? <Moon size={15} /> : <Sun size={15} className="text-yellow-400" />}
          </button>

          {/* 2. Menu Navigasi */}
          <div className="flex items-center gap-7 text-[13px] font-medium text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="/register" className="hover:text-white transition-colors">
              Register
            </Link>
          </div>

          {/* 3. Tombol Login */}
          <Link
            href="/login"
            className="text-[13px] font-medium text-white px-5 py-1.5 rounded-lg border border-white/20 bg-transparent hover:bg-white/5 transition-all"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
