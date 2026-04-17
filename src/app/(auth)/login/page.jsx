"use client";
import Link from "next/link";
import Image from "next/image";
import { FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiFetch from "@/utils/apiFetch";
import { setCookie, getCookie, removeCookie } from "@/utils/cookie";

export default function Login({ searchParams }) {
  const [ButtonGoogleState, setButtonGoogleState] = useState(false);
  const [LoginState, setLoginState] = useState(null);
  const router = useRouter();
  const params = use(searchParams);

  const RedirectGoogle = () => {
    setButtonGoogleState(true);
    window.location.href = "https://api.synthera.id/v1/api/oauth/google";
    return;
  };

  useEffect(() => {
    const token = params.token;
    const status = params.status;

    if (!token || status !== "success") {
      if (status == "failed") {
        setLoginState({ title: "Authentication Failed.", status: 500 });
      }
      setTimeout(() => {
        setLoginState(null);
        router.replace("/login");
      }, 1000);
      return;
    }

    setLoginState({ message: "Verifying your credentials...", title: "Initializing", loading: true });

    (async () => {
      try {
        const test = await fetch("http://localhost:8000/api/auth/verify", {
          method: "POST",
          body: JSON.stringify({ token: 123 }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await test.json();
        console.log(data);
        if (data.success && data.token) {
          console.log("tEST");
          setCookie("userAccessToken", data.token, 1);
          setLoginState({
            title: data.message,
            message: "Redirecting ...",
            status: 200,
            loading: false,
          });
          setTimeout(() => {
            setLoginState(null);
            router.replace("/2fa");
          }, 1000);
        }
      } catch (error) {
        setLoginState({
          title: "Authentication Failed.",
          message: err.message || "Something went wrong.",
          status: 500,
          loading: false,
        });
        setTimeout(() => {
          setLoginState(null);
          router.replace("/login");
        }, 1000);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden font-sans bg-bg-1">
      {/* ── Background Pattern dari Design System ── */}
      {/* Base Center Glow (Penghubung agar tidak ada ruang hitam pekat di tengah) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(128, 62, 233, 0.15) 0%, transparent 80%)",
        }}
      />
      {/* Floating Orb Kiri Bawah (Ukurang 1000px untuk penyebaran yang sangat halus) */}
      <div
        className="absolute w-[1000px] h-[1000px] rounded-full pointer-events-none"
        style={{
          bottom: "-30%",
          left: "-20%",
          background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 35%)",
          filter: "blur(120px)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      {/* Floating Orb Kanan Tengah/Atas */}
      <div
        className="absolute w-[1000px] h-[1000px] rounded-full pointer-events-none"
        style={{
          top: "-25%",
          right: "-10%",
          background: "radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 38%)",
          filter: "blur(120px)",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      />
      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }`}</style>

      {LoginState && (
        <div
          className="w-full max-w-[380px] rounded-2xl p-8 z-10 relative"
          style={{
            background: "rgba(24, 20, 43, 0.88)",
            border: "1px solid rgba(139,92,246,0.2)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex flex-col items-center gap-5 animate-pulse">
            {LoginState?.loading && (
              <div className="w-16 h-16 rounded-full border-6 border-indigo-500/30 border-t-indigo-500 animate-spin" />
            )}
            <div className="text-center">
              <h2
                className={`text-xl font-semibold  mb-1
                   ${LoginState?.status !== 500 && LoginState?.status !== 200 && "text-white"}
                  ${LoginState?.status === 500 && "text-red-400"} 
                  ${LoginState?.status === 200 && "text-green-400"}`}
              >
                {LoginState?.title}
              </h2>
              <p className={`text-sm`}>{LoginState?.message}</p>
            </div>
          </div>
        </div>
      )}
      {/* Card Login */}
      {!LoginState && (
        <div
          className="w-full max-w-[380px] rounded-2xl p-8 z-10 relative"
          style={{
            background: "rgba(24, 20, 43, 0.88)",
            border: "1px solid rgba(139,92,246,0.2)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-7">
            <div className="flex items-center justify-center gap-2 mb-5">
              <Image src="/icon.png" alt="Synthera Logo" width={24} height={24} className="rounded-full" />
              <span className="text-white font-semibold text-[15px]">Synthera</span>
            </div>
            <h2 className="text-[22px] font-bold mb-1.5 text-white">Welcome Back</h2>
            <p className="text-[#94A3B8] text-[13px] font-normal">Sign in to your account</p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <Input icon={<FiMail size={14} />} type="email" placeholder="Email" required />
            <Input icon={<FiLock size={14} />} type="password" placeholder="Password" required />

            {/* Remember & Forgot */}
            <div className="flex justify-between items-center text-[12px]">
              <label className="flex items-center gap-2 text-[#94A3B8] cursor-pointer">
                <input type="checkbox" className="accent-violet-500 w-3.5 h-3.5 rounded" />
                <span>Remember me</span>
              </label>
              {/* <Link href="/forgot-password" className="text-[#94A3B8] hover:text-violet-400 transition-colors">
              Forgot password?
            </Link> */}
            </div>

            <Button type="submit" variant="primary" className="w-full mt-1 py-2.5 text-[13px] rounded-lg">
              Sign In
            </Button>
          </form>

          {/* Divider OR */}
          <div className="flex items-center text-center my-5 text-[11px] text-[#6B7280]">
            <span className="flex-1 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}></span>
            <span className="px-3">Or</span>
            <span className="flex-1 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}></span>
          </div>

          {/* Social Logins */}
          <div className="flex flex-col gap-2.5">
            <Button
              onClick={RedirectGoogle}
              type="button"
              variant="glass"
              disabled={ButtonGoogleState}
              className="disabled:cursor-progress cursor-pointer w-full py-2.5 text-[13px] rounded-lg border-white/10 flex items-center justify-center gap-2.5"
            >
              <FcGoogle size={15} />
              {ButtonGoogleState ? "Redirecting..." : "Continue with Google"}
            </Button>
            <Button
              type="button"
              variant="glass"
              className="cursor-pointer w-full py-2.5 text-[13px] rounded-lg border-white/10 flex items-center justify-center gap-2.5"
            >
              <FaGithub size={15} /> Continue with GitHub
            </Button>
          </div>

          {/* Register Link */}
          <p className="text-center mt-5 text-[12px] text-[#94A3B8]">
            Don't have an account?{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
              Register
            </Link>
          </p>
        </div>
      )}
      {/*  */}
    </div>
  );
}
