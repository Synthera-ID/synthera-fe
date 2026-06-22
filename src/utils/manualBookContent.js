/**
 * Manual Book Content Generators for All Sections
 * Contains detailed content matching web page exactly
 */

import { PDF_COLORS } from "./pdfComponents";

/**
 * Generate Dashboard Content
 */
export function generateDashboardContent(doc, y, PW, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Pusat Dashboard Member", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const descText = 
    "Setelah berhasil login, Anda akan masuk ke halaman /dashboard. Halaman ini dirancang untuk " +
    "memberikan informasi ringkas mengenai status keanggotaan dan riwayat pemakaian Anda.";
  const splitDesc = doc.splitTextToSize(descText, PW - ML - MR);
  doc.text(splitDesc, ML, y);
  y += splitDesc.length * 5 + 10;

  // Komponen Informasi Utama
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Komponen Informasi Utama", ML, y);
  y += 8;

  const infoCards = [
    {
      title: "Paket Langganan",
      value: "Pro Membership",
      subtitle: "Aktif s/d 20 Juli 2026"
    },
    {
      title: "Panggilan API Hari Ini",
      value: "1.420 / 5.000",
      subtitle: "28,4% Kuota Terpakai"
    },
    {
      title: "Total Transaksi",
      value: "Rp 49.000",
      subtitle: "1 Transaksi Pembayaran Berhasil"
    }
  ];

  infoCards.forEach(card => {
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(ML, y, PW - ML - MR, 18, 2, 2, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...PDF_COLORS.grayMid);
    doc.text(card.title, ML + 3, y + 5);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...PDF_COLORS.grayDark);
    doc.text(card.value, ML + 3, y + 11);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...PDF_COLORS.grayMid);
    doc.text(card.subtitle, ML + 3, y + 15);
    
    y += 22;
  });

  y += 5;

  // Aksi Cepat (Quick Actions)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Aksi Cepat (Quick Actions)", ML, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const quickText = "Terdapat empat tombol navigasi instan untuk membantu Anda beralih halaman dengan cepat.";
  const splitQuick = doc.splitTextToSize(quickText, PW - ML - MR);
  doc.text(splitQuick, ML, y);
  y += splitQuick.length * 4.5 + 6;

  const quickActions = [
    "- Kelola API Keys",
    "- Upgrade Plan",
    "- Mulai Belajar",
    "- Edit Profil"
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  quickActions.forEach(action => {
    doc.text(action, ML + 3, y);
    y += 5;
  });

  return y;
}

/**
 * Generate Profil & Keamanan Content
 */
export function generateProfilContent(doc, y, PW, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Pengaturan Profil & Keamanan", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const descText = 
    "Buka menu /dashboard/profile untuk menyesuaikan data personal, memperbarui kredensial kata sandi, " +
    "serta menonaktifkan atau mengaktifkan Two-Factor Authentication.";
  const splitDesc = doc.splitTextToSize(descText, PW - ML - MR);
  doc.text(splitDesc, ML, y);
  y += splitDesc.length * 5 + 10;

  // Informasi Profil Personal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Informasi Profil Personal", ML, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const profileText = 
    "Anda dapat memperbarui Nomor HP yang terdaftar. Nama Lengkap, Alamat Email, dan Company Code " +
    "terkunci (Read-Only) untuk menjaga konsistensi database admin.";
  const splitProfile = doc.splitTextToSize(profileText, PW - ML - MR);
  doc.text(splitProfile, ML, y);
  y += splitProfile.length * 4.5 + 8;

  // Pembaruan Password Keamanan
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Pembaruan Password Keamanan", ML, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const passText = 
    "Untuk mengganti password, Anda wajib menginput Password Lama diikuti dengan Password Baru minimal " +
    "8 karakter yang kuat. Pastikan Konfirmasi Password Baru bernilai sama persis.";
  const splitPass = doc.splitTextToSize(passText, PW - ML - MR);
  doc.text(splitPass, ML, y);
  y += splitPass.length * 4.5 + 5;

  return y;
}

/**
 * Generate Subscription Content
 */
export function generateSubscriptionContent(doc, y, PW, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Manajemen Paket & Alur Pembayaran", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const descText = 
    "Synthera memproses transaksi langganan (subscription) secara otomatis. Pilihan paket langganan " +
    "terdiri dari Basic, Pro, dan Exclusive. Kami menerapkan penambahan kode unik 3 digit acak di " +
    "nominal pembayaran untuk validasi instan bank/e-wallet tanpa konfirmasi slip manual.";
  const splitDesc = doc.splitTextToSize(descText, PW - ML - MR);
  doc.text(splitDesc, ML, y);
  y += splitDesc.length * 5 + 10;

  // Perbandingan Paket
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Perbandingan Paket", ML, y);
  y += 8;

  const plans = [
    ["Basic", "Gratis", "1.000 req/hari", "30 req/menit"],
    ["Pro", "Rp 49.000", "5.000 req/hari", "100 req/menit"],
    ["Exclusive", "Rp 99.000", "15.000 req/hari", "300 req/menit"]
  ];

  doc.autoTable({
    startY: y,
    head: [["Paket", "Harga", "Daily Limit", "Rate Limit"]],
    body: plans,
    theme: "plain",
    headStyles: {
      fillColor: PDF_COLORS.navyDarkest,
      textColor: PDF_COLORS.white,
      fontSize: 9,
      fontStyle: "bold",
      cellPadding: { top: 5, bottom: 5, left: 5, right: 5 },
    },
    bodyStyles: {
      textColor: PDF_COLORS.grayMid,
      fontSize: 8,
      cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
    },
    alternateRowStyles: {
      fillColor: PDF_COLORS.grayBg,
    },
    margin: { left: ML, right: MR },
  });

  y = doc.lastAutoTable.finalY + 10;
  
  // Metode Pembayaran
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Metode Pembayaran", ML, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  doc.text("- Scan QRIS (e-wallet)", ML + 3, y);
  y += 5;
  doc.text("- Bank Transfer Virtual Account (dengan kode unik 3 digit)", ML + 3, y);
  y += 10;

  return y;
}

/**
 * Generate API Keys Content
 */
export function generateApiKeysContent(doc, y, PW, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Manajemen Kunci API (API Keys)", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const descText = 
    "Gunakan Kunci API untuk mengautentikasi aplikasi Anda dengan layanan API Synthera. Jangan pernah " +
    "menyebarkan API key Anda ke publik.";
  const splitDesc = doc.splitTextToSize(descText, PW - ML - MR);
  doc.text(splitDesc, ML, y);
  y += splitDesc.length * 5 + 10;

  // Fitur Utama
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Fitur Utama", ML, y);
  y += 7;

  const features = [
    "- Generate API Key baru dengan label custom",
    "- Copy key untuk digunakan di aplikasi Anda",
    "- Revoke key yang tidak terpakai atau kompromis",
    "- Monitor usage per key",
    "- Key format: sk-synth-xxxx-xxxx-xxxx-xxxx"
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  features.forEach(feat => {
    doc.text(feat, ML + 3, y);
    y += 5;
  });

  return y;
}

/**
 * Generate API Usage Content
 */
export function generateApiUsageContent(doc, y, PW, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Monitor Penggunaan API", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const descText = 
    "Halaman /dashboard/api_usage menyuguhkan visualisasi performa request yang terintegrasi secara " +
    "real-time dengan API Gateway. API Usage Monitor akan mencatat setiap request yang dipanggil, " +
    "termasuk request pengambilan data kursus.";
  const splitDesc = doc.splitTextToSize(descText, PW - ML - MR);
  doc.text(splitDesc, ML, y);
  y += splitDesc.length * 5 + 10;

  // Batas Kuota Harian
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("1. Batas Kuota Harian (Rate Limit)", ML, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const limitText = 
    "Progress bar dinamis di bagian atas monitor menunjukkan sisa kuota request harian Anda. " +
    "Limit kuota ini terikat pada paket langganan Anda saat ini:";
  const splitLimit = doc.splitTextToSize(limitText, PW - ML - MR);
  doc.text(splitLimit, ML, y);
  y += splitLimit.length * 4.5 + 6;

  const planLimits = [
    "Basic Plan: 1.000 panggilan / hari",
    "Pro Plan: 5.000 panggilan / hari",
    "Exclusive Plan: 15.000 panggilan / hari"
  ];

  planLimits.forEach(limit => {
    doc.text("- " + limit, ML + 3, y);
    y += 5;
  });

  y += 6;

  // Analisis Endpoint
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("2. Analisis Endpoint Kursus & Anggota", ML, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const endpointText = 
    "Tabel request mencatat latency dan status dari pemanggilan API endpoint. Pengambilan data kursus " +
    "dilakukan dengan melakukan fetch ke endpoint berikut:";
  const splitEndpoint = doc.splitTextToSize(endpointText, PW - ML - MR);
  doc.text(splitEndpoint, ML, y);
  y += splitEndpoint.length * 4.5 + 6;

  const endpoints = [
    { path: "/courses", method: "GET", latency: "115ms", desc: "Mengambil daftar kursus digital (member)" },
    { path: "/courses?category_id=2", method: "GET", latency: "135ms", desc: "Filter kursus berdasarkan kategori" },
    { path: "/auth/verify", method: "POST", latency: "180ms", desc: "Verifikasi login / token" }
  ];

  endpoints.forEach(ep => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.grayDark);
    doc.text(`${ep.method} ${ep.path}`, ML + 3, y);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.grayMid);
    doc.text(`(${ep.latency}) - ${ep.desc}`, ML + 3, y + 4);
    y += 9;
  });

  return y;
}

/**
 * Generate Digital Content (Kursus) Content
 */
export function generateDigitalContentContent(doc, y, PW, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Akses Kelas & Konten Digital", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const descText = 
    "Halaman /dashboard/course membatasi akses video pembelajaran berdasarkan kualifikasi paket " +
    "membership yang aktif. User wajib memiliki tier yang setara atau lebih tinggi.";
  const splitDesc = doc.splitTextToSize(descText, PW - ML - MR);
  doc.text(splitDesc, ML, y);
  y += splitDesc.length * 5 + 10;

  // Lock System
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Sistem Lock Berdasarkan Tier", ML, y);
  y += 8;

  const courses = [
    { title: "HTML & CSS Dasar", tier: "Free/Basic", desc: "Dasar pengembangan web untuk pemula" },
    { title: "React Hooks Master", tier: "Pro", desc: "Menguasai useEffect, useContext & custom hooks" },
    { title: "Arsitektur Kunci API", tier: "Exclusive", desc: "Membangun API gateway berskala korporat" }
  ];

  courses.forEach(course => {
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(ML, y, PW - ML - MR, 18, 2, 2, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...PDF_COLORS.grayDark);
    doc.text(course.title, ML + 3, y + 5);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...PDF_COLORS.navyMid);
    doc.text(`Min. Paket: ${course.tier}`, ML + 3, y + 9);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.grayMid);
    doc.text(course.desc, ML + 3, y + 14);
    
    y += 22;
  });

  return y;
}

/**
 * Generate Halaman Publik Content
 */
export function generateHalamanPublikContent(doc, y, PW, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Halaman Publik & Info Umum", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const descText = 
    "Berikut adalah daftar path rute publik dan terproteksi yang tersedia untuk role Member.";
  const splitDesc = doc.splitTextToSize(descText, PW - ML - MR);
  doc.text(splitDesc, ML, y);
  y += splitDesc.length * 5 + 10;

  const pages = [
    { route: "/", desc: "Landing Page Utama - konsep utama platform, keuntungan keanggotaan, FAQ" },
    { route: "/login", desc: "Halaman Login - Form masuk via email/password, Google OAuth, GitHub OAuth" },
    { route: "/register", desc: "Halaman Register - Pendaftaran member baru dengan password strength meter" },
    { route: "/2fa", desc: "Halaman Setup/Verify 2FA - Verifikasi tambahan dengan 6-digit OTP authenticator" },
    { route: "/privacy-policy", desc: "Kebijakan Privasi - Dokumen resmi syarat privasi data pengguna" },
    { route: "/terms-of-services", desc: "Syarat & Ketentuan Layanan - Regulasi penggunaan layanan" },
    { route: "/dashboard/course", desc: "Daftar Kursus Library - Perpustakaan video pembelajaran premium member" }
  ];

  pages.forEach(page => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.navyMid);
    doc.text(page.route, ML + 3, y);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.grayMid);
    const splitPage = doc.splitTextToSize(page.desc, PW - ML - MR - 6);
    doc.text(splitPage, ML + 3, y + 4);
    y += splitPage.length * 4 + 8;
  });

  return y;
}

/**
 * Generate Admin Users Content
 */
export function generateAdminUsersContent(doc, y, PW, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Manajemen Pengguna (User Management)", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const descText = 
    "Sebagai admin, Anda memiliki kendali penuh atas akun-akun user yang terdaftar di database, termasuk " +
    "mengubah role akses, melakukan pembaruan (update) detail user, mengaktifkan/nonaktifkan akun, atau " +
    "menghapus data.";
  const splitDesc = doc.splitTextToSize(descText, PW - ML - MR);
  doc.text(splitDesc, ML, y);
  y += splitDesc.length * 5 + 10;

  // Fitur Utama
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Fitur Utama", ML, y);
  y += 7;

  const features = [
    "- Lihat daftar semua user (CRUD User Table)",
    "- Tambah user baru dengan role MEMBER atau ADMIN",
    "- Edit/Update data user (nama, email, role)",
    "- Aktifkan/Nonaktifkan akun user",
    "- Reset 2FA user yang kehilangan akses",
    "- Hapus user dari database"
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  features.forEach(feat => {
    doc.text(feat, ML + 3, y);
    y += 5;
  });

  return y;
}

/**
 * Generate Admin Transactions Content
 */
export function generateAdminTransactionsContent(doc, y, PW, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Manajemen Transaksi (Transaction Management)", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const descText = 
    "Kelola invoice transaksi masuk dari membership, perbarui status invoice, lihat audit log detail, " +
    "serta ekspor laporan data transaksi ke berkas CSV.";
  const splitDesc = doc.splitTextToSize(descText, PW - ML - MR);
  doc.text(splitDesc, ML, y);
  y += splitDesc.length * 5 + 10;

  // Fitur Utama
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Fitur Utama", ML, y);
  y += 7;

  const features = [
    "- Monitor transaksi realtime dengan status completed/pending/failed",
    "- Verifikasi pembayaran manual",
    "- Update status transaksi",
    "- Filter by status/date/user",
    "- Export laporan transaksi ke PDF/CSV"
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  features.forEach(feat => {
    doc.text(feat, ML + 3, y);
    y += 5;
  });

  y += 6;

  // Sample Transaction Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Contoh Data Transaksi", ML, y);
  y += 8;

  const transactions = [
    ["INV-10294", "Jessica Wong", "PRO", "Rp 49.000", "Completed"],
    ["INV-10293", "Budi Santoso", "BASIC", "Rp 0", "Completed"],
    ["INV-10292", "Roni Hermansyah", "EXCLUSIVE", "Rp 99.000", "Pending"]
  ];

  doc.autoTable({
    startY: y,
    head: [["Invoice ID", "User", "Plan", "Amount", "Status"]],
    body: transactions,
    theme: "plain",
    headStyles: {
      fillColor: PDF_COLORS.navyDarkest,
      textColor: PDF_COLORS.white,
      fontSize: 8,
      fontStyle: "bold",
      cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
    },
    bodyStyles: {
      textColor: PDF_COLORS.grayMid,
      fontSize: 7,
      cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
    },
    alternateRowStyles: {
      fillColor: PDF_COLORS.grayBg,
    },
    margin: { left: ML, right: MR },
  });

  y = doc.lastAutoTable.finalY + 10;
  return y;
}

/**
 * Generate Admin Reports Content
 */
export function generateAdminReportsContent(doc, y, PW, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Analitik & Laporan (Admin)", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const descText = 
    "Dashboard analitik menyediakan visualisasi data revenue, pertumbuhan user, konversi subscription, " +
    "dan metrik bisnis penting lainnya. Admin dapat generate laporan bulanan, quarterly, atau tahunan.";
  const splitDesc = doc.splitTextToSize(descText, PW - ML - MR);
  doc.text(splitDesc, ML, y);
  y += splitDesc.length * 5 + 10;

  // Fitur Utama
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Fitur Utama", ML, y);
  y += 7;

  const features = [
    "- Revenue chart (monthly/yearly) dengan line graph",
    "- User growth statistics",
    "- Conversion rate subscription",
    "- Active users & churn rate",
    "- Top performing courses",
    "- Filter data berdasarkan tahun"
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  features.forEach(feat => {
    doc.text(feat, ML + 3, y);
    y += 5;
  });

  y += 6;

  // Sample Revenue Data
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Contoh Data Revenue 2026", ML, y);
  y += 7;

  const revenueData = [
    "- Januari: Rp 12,5 juta",
    "- Februari: Rp 18,2 juta",
    "- Maret: Rp 15,4 juta",
    "- April: Rp 24,8 juta",
    "- Mei: Rp 32,1 juta",
    "- Juni: Rp 38,5 juta"
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  revenueData.forEach(data => {
    doc.text(data, ML + 3, y);
    y += 5;
  });

  return y;
}

/**
 * Generate Admin Plans Content
 */
export function generateAdminPlansContent(doc, y, PW, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Manajemen Paket & Fitur (Admin)", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const descText = 
    "Kelola paket membership (Basic, Pro, Exclusive) termasuk harga, fitur, dan limit API. Admin dapat " +
    "membuat paket baru, mengubah benefit, dan mengatur feature flags untuk setiap tier membership.";
  const splitDesc = doc.splitTextToSize(descText, PW - ML - MR);
  doc.text(splitDesc, ML, y);
  y += splitDesc.length * 5 + 10;

  // Fitur Utama
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Fitur Utama", ML, y);
  y += 7;

  const features = [
    "- Edit harga paket membership",
    "- Update API limits (daily limit & rate limit)",
    "- Atur akses course per tier",
    "- Feature flags management",
    "- Create custom plans"
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  features.forEach(feat => {
    doc.text(feat, ML + 3, y);
    y += 5;
  });

  y += 8;

  // Package Details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Detail Paket Membership", ML, y);
  y += 8;

  const packages = [
    {
      name: "Basic Plan",
      price: "Rp 0 / bln",
      daily: "1.000 requests/hari",
      rate: "30 requests/menit",
      courses: "HTML & CSS Dasar, Machine Learning: Konsep & Aplikasi, Prompt Engineering untuk Pemula"
    },
    {
      name: "Pro Plan",
      price: "Rp 49.000 / bln",
      daily: "5.000 requests/hari",
      rate: "100 requests/menit",
      courses: "Semua kelas Basic + Supervised Learning, Neural Networks, Computer Vision"
    },
    {
      name: "Exclusive Plan",
      price: "Rp 99.000 / bln",
      daily: "15.000 requests/hari",
      rate: "300 requests/menit",
      courses: "Semua kelas Pro + Generative AI: Build & Deploy, MLOps: Production Systems"
    }
  ];

  packages.forEach(pkg => {
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(ML, y, PW - ML - MR, 30, 2, 2, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...PDF_COLORS.grayDark);
    doc.text(pkg.name, ML + 3, y + 5);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...PDF_COLORS.navyMid);
    doc.text(pkg.price, ML + 3, y + 10);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...PDF_COLORS.grayMid);
    doc.text(`API: ${pkg.daily} | ${pkg.rate}`, ML + 3, y + 15);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...PDF_COLORS.grayMid);
    const splitCourses = doc.splitTextToSize(pkg.courses, PW - ML - MR - 6);
    doc.text(splitCourses, ML + 3, y + 20);
    
    y += 34;
  });

  return y;
}
