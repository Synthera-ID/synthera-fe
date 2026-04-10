'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function PasswordStrengthBar({ password }) {
  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', labelColor: '', colors: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)'] };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: 1, label: 'Weak',   labelColor: '#ef4444', colors: ['#ef4444',  'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)'] };
    if (score === 2) return { level: 2, label: 'Fair',   labelColor: '#f97316', colors: ['#f97316',  '#f97316',               'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)'] };
    if (score === 3) return { level: 3, label: 'Medium', labelColor: '#eab308', colors: ['#eab308',  '#eab308',               '#eab308',               'rgba(255,255,255,0.1)'] };
    return              { level: 4, label: 'Strong',  labelColor: '#22c55e', colors: ['#22c55e',  '#22c55e',               '#22c55e',               '#22c55e'] };
  };

  const strength = getStrength(password);

  return (
    <div className="mt-1.5">
      <div className="flex gap-1.5">
        {strength.colors.map((color, i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: color }} />
        ))}
      </div>
      {strength.label && (
        <p className="text-[11px] mt-1 font-medium" style={{ color: strength.labelColor }}>
          Strength: {strength.label}
        </p>
      )}
    </div>
  );
}

export default function Register() {
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden font-sans bg-bg-1">

      {/* ── Background Pattern dari Design System ── */}
      {/* Base Center Glow (Penghubung agar tidak ada ruang hitam pekat di tengah) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(107, 48, 202, 0.15) 0%, transparent 80%)'
        }}
      />
      {/* Floating Orb Kiri Bawah (Ukurang 1000px untuk penyebaran yang sangat halus) */}
      <div 
        className="absolute w-[1000px] h-[1000px] rounded-full pointer-events-none" 
        style={{
          bottom: '-30%', 
          left: '-20%', 
          background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 35%)', 
          filter: 'blur(120px)', 
          animation: 'float 8s ease-in-out infinite'
        }} 
      />
      {/* Floating Orb Kanan Tengah/Atas */}
      <div 
        className="absolute w-[1000px] h-[1000px] rounded-full pointer-events-none" 
        style={{
          top: '-25%', 
          right: '-10%', 
          background: 'radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 38%)', 
          filter: 'blur(120px)', 
          animation: 'float 10s ease-in-out infinite reverse'
        }} 
      />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-20px); }
        }
      `}</style>

      {/* ── Card ── */}
      <div
        className="w-full max-w-[420px] rounded-2xl p-8 z-10 relative"
        style={{
          background: 'rgba(24, 20, 43, 0.88)',
          border: '1px solid rgba(139,92,246,0.2)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-7">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Image src="/icon.png" alt="Synthera Logo" width={22} height={22} className="rounded-full" />
            <span className="text-white font-semibold text-[15px]">Synthera</span>
          </div>
          <h2 className="text-[22px] font-bold mb-1.5 text-white">Create Account</h2>
          <p className="text-[#94A3B8] text-[13px]">Start your journey with Synthera</p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
          <Input icon={<FiUser size={14} />}  type="text"     placeholder="Full Name"        required />
          <Input icon={<FiMail size={14} />}  type="email"    placeholder="Email Address"    required />

          <div className="flex gap-3">
            <Input
              icon={<FiLock size={14} />}
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input icon={<FiLock size={14} />} type="password" placeholder="Confirm Password" required />
          </div>

          <PasswordStrengthBar password={password} />

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer mt-1">
            <input type="checkbox" required className="accent-violet-500 w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span className="text-[12px] text-[#94A3B8] leading-relaxed">
              I agree to the{' '}
              <Link href="/terms"   className="text-violet-400 hover:text-violet-300 transition-colors">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-violet-400 hover:text-violet-300 transition-colors">Privacy Policy</Link>
            </span>
          </label>

          <Button type="submit" variant="primary" className="w-full mt-1 py-2.5 text-[13px] rounded-lg">
            Create Account
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5 text-[11px] text-[#6B7280]">
          <span className="flex-1 border-b border-white/[0.08]" />
          <span className="px-3">OR sign up with</span>
          <span className="flex-1 border-b border-white/[0.08]" />
        </div>

        {/* Social */}
        <div className="flex gap-3">
          <Button type="button" variant="glass" className="flex-1 py-2.5 text-[13px] border-white/10 rounded-lg flex items-center justify-center gap-2">
            <FcGoogle size={15} /> Google
          </Button>
          <Button type="button" variant="glass" className="flex-1 py-2.5 text-[13px] border-white/10 rounded-lg flex items-center justify-center gap-2">
            <FaGithub size={15} /> GitHub
          </Button>
        </div>

        <p className="text-center mt-5 text-[12px] text-[#94A3B8]">
          Already have an account?{' '}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
