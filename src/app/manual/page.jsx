"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import {
  BookOpen,
  Search,
  Plus,
  Check,
  AlertCircle,
  Loader2,
  X,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Download,
  User,
  Mail,
  Lock,
  Shield,
  Key,
  TrendingUp,
  Activity,
  CreditCard,
  Printer,
  Menu,
  ChevronRight,
  ChevronDown,
  Zap,
  Crown,
  LockKeyhole,
  QrCode,
  Info,
  Globe,
  Users,
  ArrowUpRight,
  CheckSquare,
  Laptop,
  HelpCircle,
  FileText,
} from "lucide-react";
import Image from "next/image";

// --- TIER METADATA ---
const TIER_META = {
  free: { label: "Free / Guest", bg: "bg-bg-3 text-text-2 border-bg-4", icon: User },
  basic: { label: "Basic Plan", bg: "bg-blue-500/15 text-blue-400 border-blue-500/25", icon: Zap },
  pro: { label: "Pro Plan", bg: "bg-primary-1/15 text-primary-3 border-primary-1/25", icon: Crown },
  exclusive: { label: "Exclusive Plan", bg: "bg-amber-500/15 text-amber-400 border-amber-500/25", icon: Crown },
};

export default function ManualBookPage() {
  const [activeSection, setActiveSection] = useState("pendahuluan");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedText, setCopiedText] = useState(false);

  // --- SIMULATORS STATE ---

  // 1. API Key Simulator
  const [simApiKeys, setSimApiKeys] = useState([
    { id: "sk-synth-a1b2-c3d4-e5f6-7g8h", label: "Aplikasi React Native", created: "10 Mei 2026", status: "active" },
  ]);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const [showKeyDetails, setShowKeyDetails] = useState(false);

  // 2. Course Tier Simulator
  const [selectedUserTier, setSelectedUserTier] = useState("basic");

  // 3. Payment Simulator
  const [paymentPlan, setPaymentPlan] = useState("pro");
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [paymentStep, setPaymentStep] = useState(1); // 1: Choose, 2: Checkout/Scan, 3: Success
  const [uniqueCode] = useState(Math.floor(100 + Math.random() * 900));

  // 4. Admin User Management Simulator (with edit support)
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, name: "Ahmad Rifai", email: "ahmad@synthera.id", role: "ADMIN", status: "active" },
    { id: 2, name: "Jessica Wong", email: "jessica@gmail.com", role: "MEMBER", status: "active" },
    { id: 3, name: "Budi Santoso", email: "budi@yahoo.co.id", role: "MEMBER", status: "inactive" },
  ]);
  const [newUserModal, setNewUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // stores user being edited
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", role: "MEMBER" });

  // 5. Admin Transaction Simulator (with dummy data & export)
  const [adminTransactions, setAdminTransactions] = useState([
    {
      id: "INV-10294",
      user: "Jessica Wong",
      email: "jessica@gmail.com",
      plan: "PRO",
      amount: 49000,
      status: "completed",
      date: "07 Juni 2026",
    },
    {
      id: "INV-10293",
      user: "Budi Santoso",
      email: "budi@yahoo.co.id",
      plan: "BASIC",
      amount: 0,
      status: "completed",
      date: "06 Juni 2026",
    },
    {
      id: "INV-10292",
      user: "Roni Hermansyah",
      email: "roni@gmail.com",
      plan: "EXCLUSIVE",
      amount: 99000,
      status: "pending",
      date: "07 Juni 2026",
    },
    {
      id: "INV-10291",
      user: "Siti Rahma",
      email: "siti@gmail.com",
      plan: "PRO",
      amount: 49000,
      status: "failed",
      date: "05 Juni 2026",
    },
  ]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // 6. Admin Financial Analytics Simulator (Line Chart and dummy stats)
  const [selectedYear, setSelectedYear] = useState("2026");
  const financialData = {
    2026: [
      { month: "Jan", revenue: 12.5 },
      { month: "Feb", revenue: 18.2 },
      { month: "Mar", revenue: 15.4 },
      { month: "Apr", revenue: 24.8 },
      { month: "Mei", revenue: 32.1 },
      { month: "Jun", revenue: 38.5 },
    ],
  };
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // 7. Admin Package & Feature Selector (Basic, Pro, Exclusive)
  const packageFeatures = {
    basic: {
      name: "Basic Plan",
      price: "Rp 0 / bln",
      apiDailyLimit: "1.000 requests/hari",
      apiRateLimit: "30 requests/menit",
      courseAccess: "HTML & CSS Dasar, Machine Learning: Konsep & Aplikasi, Prompt Engineering untuk Pemula",
      extraFeatures: "Standard Support, Masked API Keys",
    },
    pro: {
      name: "Pro Plan",
      price: "Rp 49.000 / bln",
      apiDailyLimit: "5.000 requests/hari",
      apiRateLimit: "100 requests/menit",
      courseAccess:
        "Semua kelas Basic + Supervised Learning, Neural Networks, Computer Vision, Advanced Prompt Engineering",
      extraFeatures: "Priority Support, Access to video player, Custom Webhooks",
    },
    exclusive: {
      name: "Exclusive Plan",
      price: "Rp 99.000 / bln",
      apiDailyLimit: "15.000 requests/hari",
      apiRateLimit: "300 requests/menit",
      courseAccess:
        "Semua kelas Pro + Generative AI: Build & Deploy, MLOps: Production Systems, AI Agent & Multi-Agent Systems",
      extraFeatures: "24/7 Dedicated Support, Unlimited API keys, Early Beta Features access",
    },
  };
  const [selectedPackTab, setSelectedPackTab] = useState("pro");

  const contentRef = useRef(null);

  // Copy helper
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // API Key Generator Handler
  const generateSimKey = () => {
    if (!newKeyLabel.trim()) return;
    const randomHex = () =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    const key = `sk-synth-${randomHex()}-${randomHex()}-${randomHex()}-${randomHex()}`;
    const newKey = {
      id: key,
      label: newKeyLabel,
      created: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      status: "active",
    };
    setSimApiKeys([newKey, ...simApiKeys]);
    setGeneratedKey(key);
    setShowKeyDetails(true);
    setNewKeyLabel("");
  };

  const revokeSimKey = (id) => {
    setSimApiKeys(simApiKeys.map((k) => (k.id === id ? { ...k, status: "revoked" } : k)));
  };

  // User Management (Admin Simulator)
  const handleAddUser = () => {
    if (!newUserForm.name || !newUserForm.email) return;
    setAdminUsers([
      ...adminUsers,
      {
        id: adminUsers.length + 1,
        name: newUserForm.name,
        email: newUserForm.email,
        role: newUserForm.role,
        status: "active",
      },
    ]);
    setNewUserForm({ name: "", email: "", role: "MEMBER" });
    setNewUserModal(false);
  };

  const handleUpdateUser = () => {
    if (!editingUser.name || !editingUser.email) return;
    setAdminUsers(adminUsers.map((u) => (u.id === editingUser.id ? editingUser : u)));
    setEditingUser(null);
  };

  const toggleUserStatus = (id) => {
    setAdminUsers(
      adminUsers.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)),
    );
  };

  const deleteUser = (id) => {
    setAdminUsers(adminUsers.filter((u) => u.id !== id));
  };

  // Transaction Export Handler
  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1500);
  };

  // List of sections for sidebar
  const sections = [
    { id: "pendahuluan", label: "Pendahuluan", category: "UMUM" },
    { id: "instalasi", label: "Panduan Developer", category: "UMUM" },
    { id: "autentikasi", label: "Autentikasi & 2FA", category: "UMUM" },
    { id: "dashboard", label: "Dashboard Utama", category: "MEMBER" },
    { id: "profil", label: "Profil & Keamanan", category: "MEMBER" },
    { id: "subscription", label: "Upgrade Langganan", category: "MEMBER", hasSimulator: true },
    { id: "api-keys", label: "API Keys", category: "MEMBER", hasSimulator: true },
    { id: "api-usage", label: "API Usage Monitor", category: "MEMBER" },
    { id: "digital-content", label: "Kursus Digital", category: "MEMBER", hasSimulator: true },
    { id: "halaman-publik", label: "Halaman Publik & Info", category: "MEMBER" },
    { id: "admin-users", label: "Manajemen User", category: "ADMIN", hasSimulator: true },
    { id: "admin-transactions", label: "Manajemen Transaksi", category: "ADMIN", hasSimulator: true },
    { id: "admin-reports", label: "Analitik & Laporan", category: "ADMIN", hasSimulator: true },
    { id: "admin-plans", label: "Manajemen Paket & Fitur", category: "ADMIN", hasSimulator: true },
    { id: "faq", label: "FAQ & Support", category: "UMUM" },
  ];

  // Search filter
  const filteredSections = sections.filter((sec) => sec.label.toLowerCase().includes(searchQuery.toLowerCase()));

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-bg-1 text-text-1 font-sans flex flex-col md:flex-row relative">
      {/* SIDEBAR */}
      <aside
        className={`
          w-72 bg-bg-2 border-r border-bg-3 shrink-0 fixed md:sticky top-0 h-screen overflow-y-auto z-40 transition-transform duration-300 md:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          print:hidden
        `}
      >
        <div className="p-6 border-b border-bg-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/icon.png" alt="Synthera Logo" width={36} height={36} />
            <div>
              <h2 className="font-bold text-[15px] leading-tight">Synthera</h2>
              <p className="text-[10px] text-text-3 font-semibold uppercase tracking-wider">Manual Book v1.0</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1.5 hover:bg-bg-3 rounded-lg text-text-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-bg-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-3 text-text-3" />
            <input
              type="text"
              placeholder="Cari dokumentasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-bg-3/50 border border-bg-3 rounded-xl text-[12px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors"
            />
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-6">
          {["UMUM", "MEMBER", "ADMIN"].map((cat) => {
            const catSections = filteredSections.filter((s) => s.category === cat);
            if (catSections.length === 0) return null;
            return (
              <div key={cat} className="space-y-1.5">
                <span className="text-[10px] font-bold text-text-3 px-3 uppercase tracking-wider block mb-2">
                  {cat}
                </span>
                {catSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveSection(sec.id);
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full px-3 py-2.5 rounded-xl text-left text-[13px] font-medium flex items-center justify-between transition-all group cursor-pointer
                      ${
                        activeSection === sec.id
                          ? "bg-primary-1 text-white font-bold shadow-md shadow-primary-1/20"
                          : "text-text-2 hover:bg-bg-3/60 hover:text-text-1"
                      }
                    `}
                  >
                    <span className="truncate">{sec.label}</span>
                    {sec.hasSimulator && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${
                          activeSection === sec.id
                            ? "bg-white/20 text-white border-white/10"
                            : "bg-primary-1/10 text-primary-3 border-primary-1/20 group-hover:bg-primary-1/15"
                        }`}
                      >
                        Demo
                      </span>
                    )}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* MOBILE TRIGGER */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-5 right-5 w-12 h-12 rounded-full bg-primary-1 text-white shadow-xl shadow-primary-1/30 flex items-center justify-center md:hidden z-50 print:hidden cursor-pointer"
        >
          <Menu size={20} />
        </button>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* HEADER */}
        <header className="h-16 px-6 md:px-10 border-b border-bg-3 bg-bg-1/80 backdrop-blur sticky top-0 flex items-center justify-between z-30 print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-bg-3 rounded-lg text-text-2 md:hidden"
            >
              <Menu size={18} />
            </button>
            <h1 className="text-[15px] font-bold text-text-1 hidden sm:block">Dokumentasi & Panduan Penggunaan</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerPrint}
              className="p-2.5 rounded-xl border border-bg-3 hover:bg-bg-3/60 text-text-2 hover:text-text-1 transition-all text-[12px] font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} />
              <span>Cetak PDF</span>
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* CONTAINER FOR CONTENT */}
        <div ref={contentRef} className="flex-1 p-6 md:p-12 max-w-4xl w-full mx-auto space-y-12 pb-24 print:p-0">
          {/* SECTION: PENDAHULUAN */}
          {activeSection === "pendahuluan" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-primary-3 uppercase tracking-widest">Pendahuluan</span>
                <h2 className="text-3xl font-extrabold tracking-tight">Selamat Datang di Synthera</h2>
                <p className="text-text-2 text-sm leading-relaxed">
                  Synthera adalah platform inovatif terintegrasi yang dirancang untuk membantu penyedia konten digital
                  dan pengembang API dalam mengelola sistem keanggotaan (membership), distribusi konten premium,
                  autentikasi kunci API (API keys), dan penagihan berbasis langganan secara otomatis.
                </p>
              </div>

              <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6 space-y-4">
                <h3 className="text-md font-bold flex items-center gap-2 text-primary-3">
                  <Info size={16} /> Target Pengguna Manual Book
                </h3>
                <p className="text-text-2 text-xs leading-relaxed">
                  Dokumen ini disusun untuk mendukung dua kategori pengguna utama:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-bg-3/50 border border-bg-3 rounded-xl space-y-2">
                    <h4 className="text-[13px] font-semibold text-text-1 flex items-center gap-1.5">
                      <User size={14} className="text-emerald-400" /> Pengguna Biasa (Member)
                    </h4>
                    <p className="text-text-3 text-[11px]">
                      Membantu proses pendaftaran, mengupgrade paket, memantau riwayat transaksi, membuat API keys untuk
                      proyek pribadi, dan mengakses materi pembelajaran.
                    </p>
                  </div>
                  <div className="p-4 bg-bg-3/50 border border-bg-3 rounded-xl space-y-2">
                    <h4 className="text-[13px] font-semibold text-text-1 flex items-center gap-1.5">
                      <Crown size={14} className="text-amber-400" /> Admin Pengelola
                    </h4>
                    <p className="text-text-3 text-[11px]">
                      Panduan lengkap untuk memantau transaksi masuk, memverifikasi user, menambah/mengurangi paket,
                      melacak analitik keuangan, serta mengunggah kursus digital baru.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">Teknologi Inti Platform</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { title: "Next.js 14", desc: "App Router & SSR", bg: "bg-black/20 border-white/5" },
                    { title: "Tailwind CSS v4", desc: "Sistem Desain Modern", bg: "bg-cyan-500/5 border-cyan-500/10" },
                    {
                      title: "React 19",
                      desc: "State Management & Server Actions",
                      bg: "bg-blue-500/5 border-blue-500/10",
                    },
                    {
                      title: "Lucide Icons",
                      desc: "Antarmuka Vektor Bersih",
                      bg: "bg-purple-500/5 border-purple-500/10",
                    },
                    {
                      title: "API Fetch Wrapper",
                      desc: "Token Cookie & Auto Logout",
                      bg: "bg-emerald-500/5 border-emerald-500/10",
                    },
                    {
                      title: "Two-Factor Auth",
                      desc: "Keamanan Lapisan Ganda",
                      bg: "bg-amber-500/5 border-amber-500/10",
                    },
                  ].map((tech, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${tech.bg} flex flex-col justify-between`}>
                      <h4 className="text-[13px] font-bold text-text-1">{tech.title}</h4>
                      <p className="text-[10px] text-text-3 mt-1">{tech.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: INSTALASI */}
          {activeSection === "instalasi" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-primary-3 uppercase tracking-widest">Setup Lingkungan</span>
                <h2 className="text-3xl font-extrabold tracking-tight">Panduan Setup Developer</h2>
                <p className="text-text-2 text-sm">
                  Ikuti langkah-langkah di bawah ini untuk mengunduh, mengonfigurasi, dan menjalankan kode frontend
                  Synthera di komputer lokal Anda. Platform ini terintegrasi dengan backend API berbasis **Laravel**.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold">1. Prasyarat Sistem</h3>
                <ul className="list-disc list-inside text-text-2 text-xs space-y-1 pl-2">
                  <li>Node.js versi 18.x atau yang terbaru</li>
                  <li>Package manager (npm, yarn, pnpm, atau bun)</li>
                  <li>
                    Akses internet untuk menghubungkan ke API Backend Laravel produksi: <strong>https://api.synthera.id/api</strong>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold">2. Perintah Terminal untuk Instalasi</h3>
                <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden font-mono text-xs">
                  <div className="bg-bg-3 px-5 py-2.5 flex items-center justify-between border-b border-bg-4 text-text-2 text-[10px]">
                    <span>TERMINAL / POWERSHELL</span>
                    <button
                      onClick={() =>
                        handleCopy(
                          "git clone https://github.com/Synthera-ID/synthera-fe\ncd synthera-fe\nnpm install\ncp .env.example .env\nnpm run dev",
                        )
                      }
                      className="hover:text-text-1 flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedText ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedText ? "Tersalin!" : "Salin"}</span>
                    </button>
                  </div>
                  <pre className="p-5 overflow-x-auto text-primary-4 leading-relaxed whitespace-pre-wrap">
                    <code>
                      {`# 1. Clone repositori proyek\n`}
                      <span className="text-text-2">{`git clone https://github.com/Synthera-ID/synthera-fe\ncd synthera-fe\n\n`}</span>
                      {`# 2. Instal semua dependensi\n`}
                      <span className="text-text-2">{`npm install\n\n`}</span>
                      {`# 3. Buat file konfigurasi env\n`}
                      <span className="text-text-2">{`cp .env.example .env\n\n`}</span>
                      {`# 4. Jalankan server lokal\n`}
                      <span className="text-text-2">{`npm run dev`}</span>
                    </code>
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold">3. Konfigurasi Variabel Lingkungan (.env)</h3>
                <p className="text-text-2 text-xs leading-relaxed">
                  Buka file `.env` yang baru saja disalin di root direktori proyek Anda dan isikan konfigurasi API
                  backend Laravel sebagai berikut:
                </p>
                <div className="bg-bg-2 border border-bg-3 rounded-xl p-4 font-mono text-xs text-text-2">
                  <span className="text-text-3"># URL dasar API Backend Laravel Produksi</span>
                  <br />
                  <span className="text-primary-3 font-bold">NEXT_PUBLIC_APP_API_URL</span>=
                  <span className="text-emerald-400">https://api.synthera.id/api</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: AUTENTIKASI */}
          {activeSection === "autentikasi" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-primary-3 uppercase tracking-widest">Keamanan Sistem</span>
                <h2 className="text-3xl font-extrabold tracking-tight">Sistem Autentikasi & 2FA</h2>
                <p className="text-text-2 text-sm leading-relaxed">
                  Synthera menyediakan sistem masuk (login) yang aman, fleksibel, serta mendukung autentikasi pihak
                  ketiga dan verifikasi keamanan ganda.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Registrasi Akun",
                    desc: "Pendaftaran user baru dengan verifikasi password strength bar yang dinamis.",
                  },
                  {
                    title: "OAuth Pihak Ketiga",
                    desc: "Masuk instan menggunakan kredensial Google atau GitHub tanpa input password.",
                  },
                  {
                    title: "Two-Factor Auth",
                    desc: "Mencegah akses ilegal dengan mewajibkan verifikasi OTP Google Authenticator.",
                  },
                ].map((item, i) => (
                  <div key={i} className="p-5 bg-bg-2 border border-bg-3 rounded-2xl space-y-2">
                    <h4 className="text-[13px] font-bold text-text-1">{item.title}</h4>
                    <p className="text-text-3 text-[11px] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6 space-y-4">
                <h3 className="text-md font-bold text-primary-3 flex items-center gap-2">
                  <Shield size={16} /> Alur Registrasi & Setup 2FA
                </h3>
                <ol className="space-y-4 text-xs text-text-2">
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary-1 text-white flex items-center justify-center shrink-0 font-bold">
                      1
                    </span>
                    <div>
                      <h5 className="font-semibold text-text-1">Daftar Akun Baru</h5>
                      <p className="text-text-3 text-[11px] mt-0.5">
                        Buka `/register`, isi Form Nama, Email, dan Password. Perhatikan bar indikator kekuatan
                        password.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary-1 text-white flex items-center justify-center shrink-0 font-bold">
                      2
                    </span>
                    <div>
                      <h5 className="font-semibold text-text-1">Login Pertama & Konfirmasi 2FA</h5>
                      <p className="text-text-3 text-[11px] mt-0.5">
                        Setelah login, user baru akan disambut oleh halaman prompt `/2fa`. Klik tombol "Yes, Enable 2FA"
                        untuk menyiapkan proteksi.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary-1 text-white flex items-center justify-center shrink-0 font-bold">
                      3
                    </span>
                    <div>
                      <h5 className="font-semibold text-text-1">Scan QR Code Authenticator</h5>
                      <p className="text-text-3 text-[11px] mt-0.5">
                        Aplikasi akan menampilkan kode QR dan Key Rahasia. Scan QR code menggunakan aplikasi Google
                        Authenticator di HP Anda.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary-1 text-white flex items-center justify-center shrink-0 font-bold">
                      4
                    </span>
                    <div>
                      <h5 className="font-semibold text-text-1">Masukkan Kode Verifikasi</h5>
                      <p className="text-text-3 text-[11px] mt-0.5">
                        Ketik 6 digit OTP yang muncul di aplikasi Authenticator untuk menguji keselarasan waktu, lalu
                        klik Verifikasi. 2FA kini aktif.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* SECTION: DASHBOARD */}
          {activeSection === "dashboard" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-primary-3 uppercase tracking-widest">Halaman Utama</span>
                <h2 className="text-3xl font-extrabold tracking-tight">Pusat Dashboard Member</h2>
                <p className="text-text-2 text-sm leading-relaxed">
                  Setelah berhasil login, Anda akan masuk ke halaman `/dashboard`. Halaman ini dirancang untuk
                  memberikan informasi ringkas mengenai status keanggotaan dan riwayat pemakaian Anda.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold">Komponen Informasi Utama</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 bg-bg-2 border border-bg-3 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary-1/10 text-primary-3 flex items-center justify-center">
                        <Crown size={16} />
                      </div>
                      <span className="text-xs font-semibold text-text-2">Paket Langganan</span>
                    </div>
                    <div className="mt-4">
                      <span className="text-xl font-bold block">Pro Membership</span>
                      <span className="text-[11px] text-text-3">Aktif s/d 20 Juli 2026</span>
                    </div>
                  </div>
                  <div className="p-5 bg-bg-2 border border-bg-3 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <Activity size={16} />
                      </div>
                      <span className="text-xs font-semibold text-text-2">Panggilan API Hari Ini</span>
                    </div>
                    <div className="mt-4">
                      <span className="text-xl font-bold block">1.420 / 5.000</span>
                      <span className="text-[11px] text-emerald-400 font-semibold">28,4% Kuota Terpakai</span>
                    </div>
                  </div>
                  <div className="p-5 bg-bg-2 border border-bg-3 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                        <CreditCard size={16} />
                      </div>
                      <span className="text-xs font-semibold text-text-2">Total Transaksi</span>
                    </div>
                    <div className="mt-4">
                      <span className="text-xl font-bold block">Rp 49.000</span>
                      <span className="text-[11px] text-text-3">1 Transaksi Pembayaran Berhasil</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6 space-y-4">
                <h3 className="text-md font-bold text-text-1">Aksi Cepat (Quick Actions)</h3>
                <p className="text-text-2 text-xs leading-relaxed">
                  Terdapat empat tombol navigasi instan untuk membantu Anda beralih halaman dengan cepat:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-bg-3/50 border border-bg-3 rounded-xl text-center space-y-1">
                    <div className="mx-auto w-7 h-7 rounded bg-bg-3 flex items-center justify-center text-primary-3">
                      <Key size={14} />
                    </div>
                    <span className="text-[11px] font-semibold text-text-2 block">Kelola API Keys</span>
                  </div>
                  <div className="p-3 bg-bg-3/50 border border-bg-3 rounded-xl text-center space-y-1">
                    <div className="mx-auto w-7 h-7 rounded bg-bg-3 flex items-center justify-center text-emerald-400">
                      <TrendingUp size={14} />
                    </div>
                    <span className="text-[11px] font-semibold text-text-2 block">Upgrade Plan</span>
                  </div>
                  <div className="p-3 bg-bg-3/50 border border-bg-3 rounded-xl text-center space-y-1">
                    <div className="mx-auto w-7 h-7 rounded bg-bg-3 flex items-center justify-center text-blue-400">
                      <BookOpen size={14} />
                    </div>
                    <span className="text-[11px] font-semibold text-text-2 block">Mulai Belajar</span>
                  </div>
                  <div className="p-3 bg-bg-3/50 border border-bg-3 rounded-xl text-center space-y-1">
                    <div className="mx-auto w-7 h-7 rounded bg-bg-3 flex items-center justify-center text-amber-400">
                      <User size={14} />
                    </div>
                    <span className="text-[11px] font-semibold text-text-2 block">Edit Profil</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: PROFIL */}
          {activeSection === "profil" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-primary-3 uppercase tracking-widest">Akun Pengguna</span>
                <h2 className="text-3xl font-extrabold tracking-tight">Pengaturan Profil & Keamanan</h2>
                <p className="text-text-2 text-sm leading-relaxed">
                  Buka menu `/dashboard/profile` untuk menyesuaikan data personal, memperbarui kredensial kata sandi,
                  serta menonaktifkan atau mengaktifkan Two-Factor Authentication.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6 space-y-4">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <User size={16} className="text-primary-3" /> Informasi Profil Personal
                  </h3>
                  <p className="text-text-2 text-xs">
                    Anda dapat memperbarui Nomor HP yang terdaftar. Nama Lengkap, Alamat Email, dan Company Code
                    terkunci (Read-Only) untuk menjaga konsistensi database admin.
                  </p>
                  <div className="bg-bg-3/50 border border-bg-3 rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-text-3 font-semibold block mb-1">NAMA LENGKAP (READONLY)</span>
                        <span className="text-text-2 font-medium">Jessica Wong</span>
                      </div>
                      <div>
                        <span className="text-text-3 font-semibold block mb-1">EMAIL (READONLY)</span>
                        <span className="text-text-2 font-medium">jessica@gmail.com</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6 space-y-4">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Lock size={16} className="text-primary-3" /> Pembaruan Password Keamanan
                  </h3>
                  <p className="text-text-2 text-xs leading-relaxed">
                    Untuk mengganti password, Anda wajib menginput Password Lama diikuti dengan Password Baru minimal 8
                    karakter yang kuat. Pastikan Konfirmasi Password Baru bernilai sama persis.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: SUBSCRIPTION (WITH SIMULATOR) */}
          {activeSection === "subscription" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-primary-3 uppercase tracking-widest">Modul Langganan</span>
                <h2 className="text-3xl font-extrabold tracking-tight">Manajemen Paket & Alur Pembayaran</h2>
                <p className="text-text-2 text-sm leading-relaxed">
                  Synthera memproses transaksi langganan (subscription) secara otomatis. Pilihan paket langganan terdiri
                  dari **Basic**, **Pro**, dan **Exclusive**. Kami menerapkan penambahan kode unik 3 digit acak di
                  nominal pembayaran untuk validasi instan bank/e-wallet tanpa konfirmasi slip manual.
                </p>
              </div>

              {/* SIMULATOR */}
              <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-1/10 rounded-full blur-3xl -z-10" />

                <div className="flex items-center justify-between border-b border-bg-3 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-1 animate-pulse" />
                    <h3 className="text-md font-bold text-text-1">Interactive Demo: Alur Pembayaran Otomatis</h3>
                  </div>
                  <span className="text-[10px] bg-primary-1/10 border border-primary-1/20 text-primary-3 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Simulator
                  </span>
                </div>

                {/* Step 1: Choose Plan */}
                {paymentStep === 1 && (
                  <div className="space-y-5">
                    <p className="text-text-2 text-xs">Pilih paket membership yang ingin Anda simulasikan:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: "basic", title: "Basic Plan", price: 0, desc: "Akses dasar, limit API rendah." },
                        { id: "pro", title: "Pro Plan", price: 49000, desc: "Akses kursus pro, limit API menengah." },
                        {
                          id: "exclusive",
                          title: "Exclusive Plan",
                          price: 99000,
                          desc: "Akses tak terbatas, prioritas API.",
                        },
                      ].map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => setPaymentPlan(plan.id)}
                          className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[140px] ${
                            paymentPlan === plan.id
                              ? "border-primary-1 bg-primary-1/5 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                              : "border-bg-3 bg-bg-2/30 hover:border-bg-4"
                          }`}
                        >
                          <div>
                            <h4 className="text-[13px] font-bold text-text-1">{plan.title}</h4>
                            <p className="text-[10px] text-text-3 mt-1">{plan.desc}</p>
                          </div>
                          <div className="mt-4">
                            <span className="text-sm font-extrabold text-primary-3">
                              Rp {plan.price.toLocaleString("id-ID")}
                            </span>
                            <span className="text-[9px] text-text-3 block">/ bulan</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="text-text-2 text-xs">Pilih metode pembayaran:</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "qris", label: "Scan QRIS", icon: QrCode },
                          { id: "bank_transfer", label: "Bank Transfer Virtual Account", icon: CreditCard },
                        ].map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setPaymentMethod(m.id)}
                            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                              paymentMethod === m.id
                                ? "border-primary-1 bg-primary-1/10 text-primary-3"
                                : "border-bg-3 bg-bg-2/30 text-text-2 hover:border-bg-4"
                            }`}
                          >
                            <m.icon size={14} />
                            <span>{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setPaymentStep(2)}
                      className="w-full py-3 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(139,92,246,0.25)] cursor-pointer"
                    >
                      <span>Bayar Sekarang</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                )}

                {/* Step 2: Checkout */}
                {paymentStep === 2 && (
                  <div className="space-y-5 animate-scaleUp">
                    <div className="bg-bg-3/50 border border-bg-3 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-3 font-semibold">INVOICE ID</span>
                        <span className="text-text-1 font-mono font-bold">
                          INV-SYN-{Math.floor(100000 + Math.random() * 900000)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-3 font-semibold">MEMBERSHIP</span>
                        <span className="text-text-1 font-bold uppercase">{paymentPlan} Plan</span>
                      </div>
                      <div className="border-t border-bg-3 my-2 pt-2 flex items-center justify-between">
                        <div>
                          <span className="text-text-3 text-[10px] font-semibold block uppercase">
                            Total Nominal Transfer
                          </span>
                          <span className="text-xs text-text-3 block">
                            Nominal dasar {paymentPlan !== "basic" && "+ Kode Unik"}
                          </span>
                        </div>
                        <span className="text-base font-extrabold text-amber-400">
                          Rp{" "}
                          {(
                            (paymentPlan === "basic" ? 0 : paymentPlan === "pro" ? 49000 : 99000) +
                            (paymentPlan === "basic" ? 0 : uniqueCode)
                          ).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {paymentMethod === "qris" ? (
                      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-bg-3 max-w-[240px] mx-auto space-y-3 shadow-lg">
                        <span className="text-[10px] font-bold text-blue-900 tracking-wider">QRIS INTERAKTIF</span>
                        <div className="w-36 h-36 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center border border-indigo-200">
                          <QrCode size={110} className="text-indigo-950" />
                        </div>
                        <span className="text-[9px] text-slate-500 font-semibold text-center leading-normal">
                          Pindai menggunakan aplikasi m-banking atau e-wallet Anda.
                        </span>
                      </div>
                    ) : (
                      <div className="p-5 bg-bg-3/30 border border-bg-3 rounded-2xl space-y-3 text-center">
                        <span className="text-[10px] font-bold text-text-3 uppercase block">
                          NOMOR VIRTUAL ACCOUNT (VA)
                        </span>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-base font-mono font-bold text-text-1 tracking-wider">
                            8806 0812 3456 7890
                          </span>
                          <button
                            onClick={() => handleCopy("8806081234567890")}
                            className="text-primary-3 p-1 hover:bg-bg-3 rounded cursor-pointer"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                        <span className="text-[9px] text-text-3 block leading-normal max-w-xs mx-auto">
                          Lakukan pembayaran via Transfer Bank BCA / Mandiri / BNI Virtual Account.
                        </span>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setPaymentStep(1)}
                        className="flex-1 py-3 rounded-xl border border-bg-3 hover:border-bg-4 text-text-2 hover:text-text-1 font-bold text-xs transition-all cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => setPaymentStep(3)}
                        className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(16,185,129,0.2)] cursor-pointer"
                      >
                        <Check size={14} />
                        <span>Simulasi Bayar</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Success */}
                {paymentStep === 3 && (
                  <div className="py-6 text-center space-y-5 animate-scaleUp">
                    <div className="w-14 h-14 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                      <Check size={28} />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-text-1">Pembayaran Terverifikasi!</h4>
                      <p className="text-text-3 text-xs leading-normal max-w-sm mx-auto">
                        Sistem backend Synthera berhasil mendeteksi kode unik transfer Anda. Akun Anda telah di-upgrade
                        ke paket premium secara real-time.
                      </p>
                    </div>
                    <div className="bg-bg-3/30 border border-bg-3 rounded-xl p-4 max-w-xs mx-auto text-xs space-y-1 text-left">
                      <div className="flex justify-between">
                        <span className="text-text-3">Status:</span>
                        <span className="text-emerald-400 font-bold">AKTIF</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-3">Paket:</span>
                        <span className="text-text-2 font-semibold uppercase">{paymentPlan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-3">Limit Harian API:</span>
                        <span className="text-text-2 font-semibold">
                          {paymentPlan === "pro" ? "5.000 req" : paymentPlan === "basic" ? "1.000 req" : "15.000 req"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setPaymentStep(1);
                      }}
                      className="px-6 py-2.5 rounded-xl border border-bg-3 hover:bg-bg-3 text-text-2 hover:text-text-1 font-bold text-xs transition-all cursor-pointer"
                    >
                      Ulangi Simulasi
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION: API KEYS (WITH SIMULATOR) */}
          {activeSection === "api-keys" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-primary-3 uppercase tracking-widest">
                  Integrasi Developer
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight">Manajemen Kunci API (API Keys)</h2>
                <p className="text-text-2 text-sm leading-relaxed">
                  Gunakan Kunci API untuk mengautentikasi aplikasi Anda dengan layanan API Synthera. Jangan pernah
                  menyebarkan API key Anda ke publik.
                </p>
              </div>

              {/* SIMULATOR */}
              <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-1/10 rounded-full blur-3xl -z-10" />

                <div className="flex items-center justify-between border-b border-bg-3 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-1 animate-pulse" />
                    <h3 className="text-md font-bold text-text-1">Interactive Demo: Buat & Revoke API Key</h3>
                  </div>
                  <span className="text-[10px] bg-primary-1/10 border border-primary-1/20 text-primary-3 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Simulator
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-text-2 text-xs">Simulasikan pembuatan API key baru:</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Contoh: Aplikasi Mobile Saya"
                      value={newKeyLabel}
                      onChange={(e) => setNewKeyLabel(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-bg-3/50 border border-bg-3 rounded-xl text-xs text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors"
                    />
                    <button
                      onClick={generateSimKey}
                      disabled={!newKeyLabel.trim()}
                      className="px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(139,92,246,0.25)] cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Buat API Key</span>
                    </button>
                  </div>
                </div>

                {showKeyDetails && generatedKey && (
                  <div className="p-5 bg-emerald-500/5 border border-emerald-500/25 rounded-2xl space-y-3 animate-scaleUp">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check size={16} />
                      <span className="text-xs font-bold">API Key Berhasil Dibuat!</span>
                    </div>
                    <p className="text-[10px] text-text-3 leading-normal">
                      Salin sekarang. Demi keamanan akun, kunci API ini tidak akan ditampilkan kembali secara lengkap
                      setelah Anda me-refresh halaman.
                    </p>
                    <div className="bg-bg-3/50 border border-bg-3 rounded-xl p-3 flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] text-text-2 break-all">{generatedKey}</span>
                      <button
                        onClick={() => handleCopy(generatedKey)}
                        className="text-primary-3 hover:text-primary-4 shrink-0 cursor-pointer"
                      >
                        <Copy size={15} />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowKeyDetails(false)}
                      className="text-[10px] text-text-2 hover:text-text-1 underline cursor-pointer"
                    >
                      Tutup Notifikasi
                    </button>
                  </div>
                )}

                {/* API Key List Table */}
                <div className="border border-bg-3 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-3 gap-4 px-5 py-3 bg-bg-3/30 text-[10px] font-bold text-text-3 uppercase tracking-wider border-b border-bg-3">
                    <span>Label Kunci</span>
                    <span>Created Date</span>
                    <span className="text-right">Aksi</span>
                  </div>
                  <div className="divide-y divide-bg-3">
                    {simApiKeys.length === 0 ? (
                      <div className="p-6 text-center text-text-3 text-xs">Belum ada API key dibuat.</div>
                    ) : (
                      simApiKeys.map((key) => (
                        <div key={key.id} className="grid grid-cols-3 gap-4 px-5 py-4 items-center text-xs">
                          <div className="space-y-1 min-w-0">
                            <span className="font-semibold text-text-1 block truncate">{key.label}</span>
                            <span className="font-mono text-[10px] text-text-3 block truncate">
                              {key.status === "active" ? "sk-synth-xxxx-...xxxx" : "REVOKED"}
                            </span>
                          </div>
                          <span className="text-text-2">{key.created}</span>
                          <div className="text-right">
                            {key.status === "active" ? (
                              <button
                                onClick={() => revokeSimKey(key.id)}
                                className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-[10px] font-semibold transition-all cursor-pointer"
                              >
                                Revoke
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-text-3 uppercase">Dibatalkan</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: API USAGE */}
          {activeSection === "api-usage" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-primary-3 uppercase tracking-widest">
                  Statistik Monitor
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight">Monitor Penggunaan API</h2>
                <p className="text-text-2 text-sm leading-relaxed">
                  Halaman `/dashboard/api_usage` menyuguhkan visualisasi performa request yang terintegrasi secara
                  real-time dengan API Gateway. API Usage Monitor akan mencatat setiap request yang dipanggil, termasuk
                  request pengambilan data kursus.
                </p>
              </div>

              <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold">1. Batas Kuota Harian (Rate Limit)</h3>
                <p className="text-text-2 text-xs leading-relaxed">
                  Progress bar dinamis di bagian atas monitor menunjukkan sisa kuota request harian Anda. Limit kuota
                  ini terikat pada paket langganan Anda saat ini:
                </p>
                <div className="space-y-3 pt-2">
                  {[
                    { label: "Basic Plan", limit: "1.000 panggilan / hari", pct: "75%", color: "bg-blue-500" },
                    { label: "Pro Plan", limit: "5.000 panggilan / hari", pct: "28%", color: "bg-primary-1" },
                    { label: "Exclusive Plan", limit: "15.000 panggilan / hari", pct: "5%", color: "bg-amber-400" },
                  ].map((plan, i) => (
                    <div key={i} className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="font-semibold text-text-1">{plan.label}</span>
                        <span className="text-text-3">{plan.limit}</span>
                      </div>
                      <div className="w-full h-2 bg-bg-3 rounded-full overflow-hidden">
                        <div className={`h-full ${plan.color} rounded-full`} style={{ width: plan.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold">2. Analisis Endpoint Kursus & Anggota</h3>
                <p className="text-text-2 text-xs leading-relaxed">
                  Tabel request mencatat latency dan status dari pemanggilan API endpoint. Pengambilan data kursus
                  dilakukan dengan melakukan fetch ke endpoint berikut:
                </p>
                <div className="border border-bg-3 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-bg-3/30 text-[10px] font-bold text-text-3 uppercase tracking-wider border-b border-bg-3">
                    <span>Endpoint API</span>
                    <span>Method</span>
                    <span>Avg Latency</span>
                    <span className="text-right">Fungsi</span>
                  </div>
                  {[
                    {
                      path: "/courses",
                      method: "GET",
                      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
                      latency: "115ms",
                      desc: "Mengambil daftar kursus digital (member)",
                    },
                    {
                      path: "/courses?category_id=2",
                      method: "GET",
                      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
                      latency: "135ms",
                      desc: "Filter kursus berdasarkan kategori",
                    },
                    {
                      path: "/auth/verify",
                      method: "POST",
                      color: "text-amber-400 bg-amber-500/10 border-amber-500/25",
                      latency: "180ms",
                      desc: "Verifikasi login / token",
                    },
                  ].map((ep, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-4 gap-4 px-4 py-4 items-center border-b border-bg-3/40 last:border-0"
                    >
                      <span className="font-mono text-text-2">{ep.path}</span>
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${ep.color}`}>
                          {ep.method}
                        </span>
                      </div>
                      <span className="text-text-2">{ep.latency}</span>
                      <span className="text-right text-text-3 font-semibold">{ep.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: DIGITAL CONTENT (WITH SIMULATOR) */}
          {activeSection === "digital-content" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-primary-3 uppercase tracking-widest">
                  Modul Pembelajaran
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight">Akses Kelas & Konten Digital</h2>
                <p className="text-text-2 text-sm leading-relaxed">
                  Halaman `/dashboard/course` membatasi akses video pembelajaran berdasarkan kualifikasi paket
                  membership yang aktif. User wajib memiliki tier yang setara atau lebih tinggi.
                </p>
              </div>

              {/* SIMULATOR */}
              <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-1/10 rounded-full blur-3xl -z-10" />

                <div className="flex items-center justify-between border-b border-bg-3 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-1 animate-pulse" />
                    <h3 className="text-md font-bold text-text-1">Interactive Demo: Simulasi Lock System</h3>
                  </div>
                  <span className="text-[10px] bg-primary-1/10 border border-primary-1/20 text-primary-3 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Simulator
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-text-2 text-xs">Pilih tingkat membership simulasi Anda saat ini:</p>
                  <div className="flex flex-wrap gap-2">
                    {["free", "basic", "pro", "exclusive"].map((t) => {
                      const Meta = TIER_META[t];
                      return (
                        <button
                          key={t}
                          onClick={() => setSelectedUserTier(t)}
                          className={`
                            px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer
                            ${
                              selectedUserTier === t
                                ? "bg-primary-1 text-white border-primary-1 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                                : "bg-bg-3/50 text-text-2 border-bg-3 hover:border-bg-4"
                            }
                          `}
                        >
                          <Meta.icon size={13} />
                          <span className="capitalize">{t} Member</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Course Grid Simulator */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "HTML & CSS Dasar",
                      minTier: "free",
                      desc: "Dasar pengembangan web untuk pemula.",
                      gradient: "from-blue-600/20 to-blue-900/10",
                    },
                    {
                      title: "React Hooks Master",
                      minTier: "pro",
                      desc: "Menguasai useEffect, useContext & custom hooks.",
                      gradient: "from-primary-1/20 to-primary-2/10",
                    },
                    {
                      title: "Arsitektur Kunci API",
                      minTier: "exclusive",
                      desc: "Membangun API gateway berskala korporat.",
                      gradient: "from-amber-600/20 to-amber-900/10",
                    },
                  ].map((course, idx) => {
                    const tiers = ["free", "basic", "pro", "exclusive"];
                    const userIdx = tiers.indexOf(selectedUserTier);
                    const reqIdx = tiers.indexOf(course.minTier);
                    const isLocked = userIdx < reqIdx;

                    return (
                      <div
                        key={idx}
                        className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden flex flex-col justify-between min-h-[200px] relative group"
                      >
                        {/* Lock Overlay */}
                        {isLocked && (
                          <div className="absolute inset-0 bg-[#05050a]/90 backdrop-blur-[4px] flex flex-col items-center justify-center p-4 text-center z-10 animate-fadeIn">
                            <div className="w-9 h-9 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full flex items-center justify-center mb-3">
                              <LockKeyhole size={16} />
                            </div>
                            <span className="text-[11px] font-bold text-text-1">Akses Terkunci</span>
                            <span className="text-[9px] text-text-3 mt-1 leading-normal">
                              Wajib paket minimal{" "}
                              <span className="uppercase text-amber-400 font-bold">{course.minTier}</span>
                            </span>
                            <button
                              onClick={() => {
                                setActiveSection("subscription");
                                setPaymentPlan(course.minTier);
                                setPaymentStep(1);
                              }}
                              className="mt-4 px-3 py-1.5 rounded-lg bg-primary-1 hover:bg-primary-2 text-white text-[9px] font-semibold transition-all cursor-pointer"
                            >
                              Upgrade Sekarang
                            </button>
                          </div>
                        )}

                        <div className={`p-5 bg-gradient-to-br ${course.gradient} border-b border-bg-3`}>
                          <h4 className="text-[12px] font-bold text-text-1">{course.title}</h4>
                          <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-text-2 inline-block mt-2 font-semibold">
                            Min. Paket: <span className="uppercase text-amber-300 font-bold">{course.minTier}</span>
                          </span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between bg-bg-2">
                          <p className="text-[10px] text-text-3 leading-normal">{course.desc}</p>
                          <button className="w-full mt-4 py-2 border border-primary-1/20 text-primary-3 font-semibold text-[11px] rounded-xl hover:bg-primary-1/10 transition-all cursor-pointer">
                            Mulai Belajar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: HALAMAN PUBLIK */}
          {/* {activeSection === "halaman-publik" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-primary-3 uppercase tracking-widest">Informasi Umum</span>
                <h2 className="text-3xl font-extrabold tracking-tight">Halaman Publik & Info Umum</h2>
                <p className="text-text-2 text-sm leading-relaxed">
                  Berikut adalah daftar path rute publik dan terproteksi yang tersedia untuk role **Member** (tidak
                  termasuk rute `/course` publik karena katalog kursus sudah dialihkan langsung di dalam dashboard
                  member):
                </p>
              </div>

              <div className="space-y-5">
                {[
                  {
                    route: "/",
                    label: "Landing Page Utama (Publik)",
                    desc: "Menjelaskan konsep utama platform, keuntungan keanggotaan, daftar FAQ umum, testimoni, dan kartu paket harga subscription.",
                  },
                  {
                    route: "/login",
                    label: "Halaman Login (Publik)",
                    desc: "Form masuk akun via email/password, Google OAuth, maupun GitHub OAuth.",
                  },
                  {
                    route: "/register",
                    label: "Halaman Register (Publik)",
                    desc: "Pendaftaran member baru dengan password strength meter terintegrasi.",
                  },
                  {
                    route: "/2fa",
                    label: "Halaman Setup/Verify 2FA (Terproteksi)",
                    desc: "Verifikasi tambahan menggunakan 6-digit OTP authenticator.",
                  },
                  {
                    route: "/privacy-policy",
                    label: "Halaman Kebijakan Privasi (Publik)",
                    desc: "Dokumen resmi syarat privasi data pengguna di platform Synthera.",
                  },
                  {
                    route: "/terms-of-services",
                    label: "Syarat & Ketentuan Layanan (Publik)",
                    desc: "Regulasi penggunaan layanan dan ketentuan subscription.",
                  },
                  {
                    route: "/dashboard/course",
                    label: "Daftar Kursus / Library (Member)",
                    desc: "Perpustakaan video pembelajaran premium khusus member, terproteksi sesuai tingkatan plan.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-bg-2 border border-bg-3 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start"
                  >
                    <div className="px-3 py-1.5 rounded-lg bg-bg-3 border border-bg-4 text-xs font-mono font-bold text-primary-3 shrink-0">
                      {item.route}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-bold text-text-1">{item.label}</h4>
                      <p className="text-text-3 text-[11px] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* SECTION: ADMIN - USER MANAGEMENT (WITH UPDATE & SIMULATOR) */}
          {activeSection === "admin-users" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest">Panel Admin</span>
                <h2 className="text-3xl font-extrabold tracking-tight">Manajemen Pengguna (User Management)</h2>
                <p className="text-text-2 text-sm leading-relaxed">
                  Sebagai admin, Anda memiliki kendali penuh atas akun-akun user yang terdaftar di database, termasuk
                  mengubah role akses, **melakukan pembaruan (update) detail user**, mengaktifkan/nonaktifkan akun, atau
                  menghapus data.
                </p>
              </div>

              {/* SIMULATOR */}
              <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-1/10 rounded-full blur-3xl -z-10" />

                <div className="flex items-center justify-between border-b border-bg-3 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="text-md font-bold text-text-1 font-mono">Interactive Demo: CRUD User Table</h3>
                  </div>
                  <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Admin
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-3 font-semibold">Tabel Kredensial User</span>
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setNewUserModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Tambah User</span>
                  </button>
                </div>

                {/* Create User Form Modal */}
                {newUserModal && (
                  <div className="bg-bg-3/50 border border-bg-3 rounded-2xl p-5 space-y-4 animate-scaleUp">
                    <h4 className="text-xs font-bold text-text-1">Tambah User Baru</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Nama Lengkap"
                        value={newUserForm.name}
                        onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                        className="px-3 py-2 bg-bg-2 border border-bg-3 rounded-lg text-xs text-text-1 outline-none"
                      />
                      <input
                        type="email"
                        placeholder="Alamat Email"
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                        className="px-3 py-2 bg-bg-2 border border-bg-3 rounded-lg text-xs text-text-1 outline-none"
                      />
                      <select
                        value={newUserForm.role}
                        onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                        className="px-3 py-2 bg-bg-2 border border-bg-3 rounded-lg text-xs text-text-1 outline-none cursor-pointer"
                      >
                        <option value="MEMBER">MEMBER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setNewUserModal(false)}
                        className="px-3 py-1.5 border border-bg-3 rounded-lg text-[10px] hover:bg-bg-3 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleAddUser}
                        className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit User Form Modal (Update User) */}
                {editingUser && (
                  <div className="bg-primary-1/5 border border-primary-1/30 rounded-2xl p-5 space-y-4 animate-scaleUp">
                    <h4 className="text-xs font-bold text-primary-3 flex items-center gap-1.5">
                      <Edit3 size={12} /> Update Data User ({editingUser.name})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Nama Lengkap"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        className="px-3 py-2 bg-bg-2 border border-bg-3 rounded-lg text-xs text-text-1 outline-none focus:border-primary-1/50"
                      />
                      <input
                        type="email"
                        placeholder="Alamat Email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        className="px-3 py-2 bg-bg-2 border border-bg-3 rounded-lg text-xs text-text-1 outline-none focus:border-primary-1/50"
                      />
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="px-3 py-2 bg-bg-2 border border-bg-3 rounded-lg text-xs text-text-1 outline-none cursor-pointer focus:border-primary-1/50"
                      >
                        <option value="MEMBER">MEMBER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingUser(null)}
                        className="px-3 py-1.5 border border-bg-3 rounded-lg text-[10px] hover:bg-bg-3 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleUpdateUser}
                        className="px-4 py-1.5 bg-primary-1 hover:bg-primary-2 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Perbarui Data
                      </button>
                    </div>
                  </div>
                )}

                {/* User Table */}
                <div className="border border-bg-3 rounded-2xl overflow-hidden text-xs">
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-4 px-5 py-3 bg-bg-3/30 text-[10px] font-bold text-text-3 uppercase border-b border-bg-3">
                    <span>Nama / Email</span>
                    <span>Role</span>
                    <span>Status Akun</span>
                    <span className="text-right">Aksi</span>
                  </div>
                  <div className="divide-y divide-bg-3">
                    {adminUsers.map((user) => (
                      <div key={user.id} className="grid grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-4 px-5 py-4 items-center">
                        <div className="min-w-0">
                          <span className="font-bold text-text-1 block truncate">{user.name}</span>
                          <span className="text-text-3 text-[10px] block truncate">{user.email}</span>
                        </div>
                        <div>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                              user.role === "ADMIN"
                                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                : "bg-bg-3 text-text-2 border-bg-4"
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <div>
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-all cursor-pointer ${
                              user.status === "active"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-red-500/5 hover:text-red-400 hover:border-red-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-emerald-500/5 hover:text-emerald-400 hover:border-emerald-500/20"
                            }`}
                            title="Klik untuk ubah status"
                          >
                            {user.status === "active" ? "Aktif" : "Nonaktif"}
                          </button>
                        </div>
                        <div className="text-right flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingUser({ ...user })}
                            className="p-1 text-text-3 hover:text-primary-3 rounded cursor-pointer"
                            title="Edit / Update User"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-1 text-text-3 hover:text-red-400 rounded cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ADMIN - TRANSACTION (WITH DUMMY DATA & EXPORT) */}
          {activeSection === "admin-transactions" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest">Panel Admin</span>
                <h2 className="text-3xl font-extrabold tracking-tight">Manajemen Transaksi (Transaction Management)</h2>
                <p className="text-text-2 text-sm leading-relaxed">
                  Kelola invoice transaksi masuk dari membership, perbarui status invoice, lihat audit log detail, serta
                  ekspor laporan data transaksi ke berkas CSV.
                </p>
              </div>

              {/* SIMULATOR */}
              <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-1/10 rounded-full blur-3xl -z-10" />

                <div className="flex items-center justify-between border-b border-bg-3 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="text-md font-bold text-text-1 font-mono">
                      Interactive Demo: Laporan Transaksi & Ekspor
                    </h3>
                  </div>
                  <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Admin
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <span className="text-xs text-text-3 font-semibold">Daftar Transaksi Aktif</span>
                  <button
                    onClick={handleExportCSV}
                    disabled={isExporting}
                    className="px-4 py-2 rounded-xl bg-bg-3 border border-bg-4 hover:border-primary-1/30 text-text-2 hover:text-text-1 font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isExporting ? (
                      <Loader2 size={13} className="animate-spin text-primary-3" />
                    ) : (
                      <Download size={13} />
                    )}
                    <span>{isExporting ? "Memproses..." : "Ekspor Berkas (.CSV)"}</span>
                  </button>
                </div>

                {exportSuccess && (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2 animate-scaleUp">
                    <Check size={14} />
                    <span>
                      Laporan transaksi berhasil diekspor! File `synthera_report_transactions.csv` telah diunduh.
                    </span>
                  </div>
                )}

                {/* Transactions Table with Dummy Data */}
                <div className="border border-bg-3 rounded-2xl overflow-hidden text-xs">
                  <div className="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr] gap-3 px-5 py-3 bg-bg-3/30 text-[10px] font-bold text-text-3 uppercase border-b border-bg-3">
                    <span>ID Invoice</span>
                    <span>User / Email</span>
                    <span>Paket</span>
                    <span>Nominal</span>
                    <span className="text-right">Status</span>
                  </div>
                  <div className="divide-y divide-bg-3">
                    {adminTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr] gap-3 px-5 py-4 items-center"
                      >
                        <span className="font-mono font-bold text-text-1">{tx.id}</span>
                        <div className="min-w-0">
                          <span className="font-semibold text-text-2 block truncate">{tx.user}</span>
                          <span className="text-text-3 text-[10px] block truncate">{tx.email}</span>
                        </div>
                        <span className="font-bold text-[11px] text-primary-3">{tx.plan}</span>
                        <span className="font-mono text-text-2">Rp {tx.amount.toLocaleString("id-ID")}</span>
                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                              tx.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : tx.status === "pending"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ADMIN - REPORTS (WITH CHART & DUMMY STATS) */}
          {activeSection === "admin-reports" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest">Panel Admin</span>
                <h2 className="text-3xl font-extrabold tracking-tight">Analitik & Laporan Keuangan</h2>
                <p className="text-text-2 text-sm leading-relaxed">
                  Halaman `/dashboard/management/reports` menyajikan grafik statistika analitik performa finansial
                  Synthera berdasarkan kurun waktu dan pertumbuhan pendapatan bulanan.
                </p>
              </div>

              {/* SIMULATOR */}
              <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-1/10 rounded-full blur-3xl -z-10" />

                <div className="flex items-center justify-between border-b border-bg-3 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="text-md font-bold text-text-1 font-mono">
                      Interactive Demo: Grafik Pendapatan Harian
                    </h3>
                  </div>
                  <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Admin
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Total Pendapatan", val: "Rp 139,5 Jt", color: "text-emerald-400" },
                    { label: "Transaksi Berhasil", val: "284", color: "text-primary-3" },
                    { label: "Rata-rata Keranjang", val: "Rp 491.190", color: "text-blue-400" },
                    { label: "Tingkat Konversi", val: "92,1%", color: "text-amber-400" },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 bg-bg-3/30 border border-bg-3 rounded-2xl">
                      <span className="text-[9px] font-bold text-text-3 block uppercase">{stat.label}</span>
                      <span className={`text-[15px] font-extrabold block mt-1.5 ${stat.color}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>

                {/* SVG LINE CHART SIMULATOR */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-2 font-semibold">Grafik Historis Pendapatan 2026 (Juta Rupiah)</span>
                    <span className="text-text-3 font-mono">Jan - Jun 2026</span>
                  </div>

                  <div className="bg-bg-3/20 border border-bg-3 rounded-2xl p-6 relative">
                    {/* SVG Chart */}
                    <svg viewBox="0 0 500 200" className="w-full h-48 overflow-visible">
                      {/* Grid Lines */}
                      <line x1="0" y1="180" x2="500" y2="180" stroke="#1A1A2E" strokeWidth="1" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="#1A1A2E" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="60" x2="500" y2="60" stroke="#1A1A2E" strokeWidth="1" strokeDasharray="4 4" />

                      {/* Chart Path */}
                      <path
                        d="M 20 150 Q 100 110, 180 130 T 340 70 T 480 30"
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="drop-shadow-[0_4px_10px_rgba(139,92,246,0.5)]"
                      />

                      {/* Data Points */}
                      {[
                        { x: 20, y: 150, val: "12.5 Jt", month: "Jan" },
                        { x: 110, y: 120, val: "18.2 Jt", month: "Feb" },
                        { x: 200, y: 135, val: "15.4 Jt", month: "Mar" },
                        { x: 290, y: 88, val: "24.8 Jt", month: "Apr" },
                        { x: 380, y: 55, val: "32.1 Jt", month: "Mei" },
                        { x: 470, y: 28, val: "38.5 Jt", month: "Jun" },
                      ].map((pt, i) => (
                        <g key={i}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={hoveredPoint === i ? 6 : 4}
                            fill="#8B5CF6"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                            className="cursor-pointer transition-all duration-150"
                            onMouseEnter={() => setHoveredPoint(i)}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                          <text x={pt.x} y="196" fill="#6B7280" fontSize="9" textAnchor="middle" fontWeight="bold">
                            {pt.month}
                          </text>
                        </g>
                      ))}
                    </svg>

                    {/* Active tooltip box */}
                    {hoveredPoint !== null && (
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-primary-1 text-white text-[10px] font-bold shadow-lg animate-scaleUp">
                        {financialData["2026"][hoveredPoint].month}: Rp {financialData["2026"][hoveredPoint].revenue}{" "}
                        Juta
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ADMIN - PLANS & FEATURES (BASIC, PRO, EXCLUSIVE) */}
          {activeSection === "admin-plans" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest">Panel Admin</span>
                <h2 className="text-3xl font-extrabold tracking-tight">Manajemen Paket & Fitur Layanan</h2>
                <p className="text-text-2 text-sm leading-relaxed">
                  Kelola tingkatan paket subscription di halaman `/management/subscription_management` dan daftarkan
                  pembatasan kuota API per paket di `/management/feature_management`.
                </p>
              </div>

              {/* SIMULATOR */}
              <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-1/10 rounded-full blur-3xl -z-10" />

                <div className="flex items-center justify-between border-b border-bg-3 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="text-md font-bold text-text-1 font-mono">
                      Interactive Demo: Rincian Fitur & Limit Paket
                    </h3>
                  </div>
                  <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Admin
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-text-2 text-xs">Pilih paket untuk melihat daftar konfigurasi fiturnya:</p>
                  <div className="flex gap-2">
                    {["basic", "pro", "exclusive"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedPackTab(p)}
                        className={`
                          px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer capitalize
                          ${
                            selectedPackTab === p
                              ? "bg-primary-1 text-white border-primary-1 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                              : "bg-bg-3/50 text-text-2 border-bg-3 hover:border-bg-4"
                          }
                        `}
                      >
                        {p} Plan
                      </button>
                    ))}
                  </div>
                </div>

                {/* Package Feature Config Card Details */}
                <div className="bg-bg-2 border border-bg-3 rounded-2xl p-5 space-y-4 animate-scaleUp">
                  <div className="flex justify-between items-center border-b border-bg-3/50 pb-3">
                    <span className="text-sm font-extrabold text-text-1 uppercase tracking-wide">
                      {packageFeatures[selectedPackTab].name}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {packageFeatures[selectedPackTab].price}
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="text-text-3 font-semibold block mb-1">BATAS PEMANGGILAN API HARIAN</span>
                      <span className="text-text-2 font-mono font-semibold">
                        {packageFeatures[selectedPackTab].apiDailyLimit}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-3 font-semibold block mb-1">BATAS RATE LIMIT (MENIT)</span>
                      <span className="text-text-2 font-mono font-semibold">
                        {packageFeatures[selectedPackTab].apiRateLimit}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-3 font-semibold block mb-1">AKSES KURSUS DIGITAL</span>
                      <p className="text-text-2 leading-relaxed">{packageFeatures[selectedPackTab].courseAccess}</p>
                    </div>
                    <div>
                      <span className="text-text-3 font-semibold block mb-1">FITUR TAMBAHAN LAIN</span>
                      <span className="text-text-2">{packageFeatures[selectedPackTab].extraFeatures}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: FAQ */}
          {activeSection === "faq" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-primary-3 uppercase tracking-widest">Pusat Bantuan</span>
                <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
                <p className="text-text-2 text-sm">
                  Daftar jawaban atas beberapa pertanyaan umum yang sering diajukan mengenai penggunaan platform
                  Synthera.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "Mengapa invoice upgrade paket saya tidak kunjung terverifikasi?",
                    a: "Pastikan nominal dana yang Anda transfer ke rekening VA/QRIS telah menyertakan 3 digit kode unik acak di nominal ekor secara presisi. Kesalahan input nominal akan membatalkan otomatisasi sistem.",
                  },
                  {
                    q: "Bagaimana jika saya kehilangan ponsel dengan Google Authenticator aktif?",
                    a: "Hubungi admin pengelola sistem melalui saluran Telegram Support/Email. Admin dapat menonaktifkan paksa status 2FA akun Anda melalui panel User Management secara aman.",
                  },
                  {
                    q: "Apakah API Key lama masih dapat digunakan setelah melakukan regenerasi?",
                    a: "Tidak. Proses regenerasi/revoke akan menghapus otorisasi token key lama secara permanen dari server database API gateway demi keamanan integrasi Anda.",
                  },
                ].map((faq, i) => (
                  <div key={i} className="p-6 bg-bg-2 border border-bg-3 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-text-1 flex items-start gap-2">
                      <HelpCircle size={15} className="text-primary-3 shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </h4>
                    <p className="text-text-3 text-[11px] pl-6 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
