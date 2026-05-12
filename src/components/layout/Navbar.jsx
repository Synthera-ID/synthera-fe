"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted ? theme === "dark" : true;

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

  const navBg = isDarkMode ? "bg-transparent" : "bg-white/90 shadow-sm shadow-slate-200/60";
  const navText = isDarkMode ? "text-white" : "text-slate-950";
  const navLink = isDarkMode ? "text-gray-400 hover:text-white" : "text-slate-600 hover:text-slate-900";
  const buttonStyles = isDarkMode
    ? "border-white/10 bg-white/5 text-gray-400 hover:text-white"
    : "border-slate-300 bg-slate-100 text-slate-700 hover:text-slate-900";
  const loginButtonStyles = isDarkMode
    ? "text-white border border-white/20 bg-transparent hover:bg-white/5"
    : "text-slate-950 border border-slate-200 bg-white hover:bg-slate-100";
  const mobileMenuBg = isDarkMode ? "bg-slate-950/95" : "bg-white/95";
  const mobileLink = isDarkMode ? "text-gray-300 hover:text-white" : "text-slate-700 hover:text-slate-950";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] py-5 transition-transform duration-300 backdrop-blur-xl ${navBg} ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-10 md:px-20 flex items-center justify-between">
        {/* --- LOGO (Kiri) --- */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/icon.png" alt="Synthera Logo" width={48} height={48} className="rounded-full" />

          <span className={`text-xl font-bold tracking-tight ${navText}`}>Synthera</span>
        </Link>

        {/* --- GRUP KANAN (Toggle + Menu + Login) --- */}
        <div className="flex items-center gap-6">
          {/* 1. Toggle Tema */}
          <ThemeToggle />

          {/* 2. Tombol Hamburger / Menu Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg border ${buttonStyles} transition-all`}
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* 3. Menu Navigasi Desktop */}
          <div className="hidden md:flex items-center gap-7 text-[13px] font-medium"
            >
            <Link href="#features" className={`${navLink} transition-colors`}>
              Features
            </Link>
            <Link href="#pricing" className={`${navLink} transition-colors`}>
              Pricing
            </Link>
            <Link href="#faq" className={`${navLink} transition-colors`}>
              FAQ
            </Link>
            <Link href="/register" className={`${navLink} transition-colors`}>
              Register
            </Link>
          </div>

          {/* 4. Tombol Login */}
          <Link
            href="/login"
            className={`hidden md:inline-block text-[13px] font-medium px-5 py-1.5 rounded-lg transition-all ${loginButtonStyles}`}
          >
            Login
          </Link>
        </div>
      </div>

      {/* Menu Mobile */}
      <div
        className={`md:hidden ${mobileMenuBg} backdrop-blur-xl transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-[420px] py-5" : "max-h-0"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-10 md:px-20 flex flex-col gap-4">
          <Link
            href="#features"
            onClick={() => setIsMenuOpen(false)}
            className={`text-sm font-medium ${mobileLink} transition-colors`}
          >
            Features
          </Link>
          <Link
            href="#pricing"
            onClick={() => setIsMenuOpen(false)}
            className={`text-sm font-medium ${mobileLink} transition-colors`}
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            onClick={() => setIsMenuOpen(false)}
            className={`text-sm font-medium ${mobileLink} transition-colors`}
          >
            FAQ
          </Link>
          <Link
            href="/register"
            onClick={() => setIsMenuOpen(false)}
            className={`text-sm font-medium ${mobileLink} transition-colors`}
          >
            Register
          </Link>
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className={`text-sm font-medium px-5 py-2 rounded-lg border transition-all ${
              isDarkMode
                ? "text-white border-white/20 bg-white/5 hover:bg-white/10"
                : "text-slate-950 border-slate-200 bg-white hover:bg-slate-100"
            }`}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
