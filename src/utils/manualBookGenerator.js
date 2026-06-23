/**
 * Manual Book PDF Generator
 * Generate Manual Book dengan premium header & footer + preview
 * UPDATED: Support per-section PDF generation with detailed content
 */

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  PDF_COLORS,
  loadLogoBase64,
  drawPremiumHeader,
  drawPremiumFooter,
  openPDFPreview,
} from "./pdfComponents";
import {
  generateDashboardContent,
  generateProfilContent,
  generateSubscriptionContent,
  generateApiKeysContent,
  generateApiUsageContent,
  generateDigitalContentContent,
  generateHalamanPublikContent,
  generateAdminUsersContent,
  generateAdminTransactionsContent,
  generateAdminReportsContent,
  generateAdminPlansContent,
} from "./manualBookContent";

// Section metadata untuk title mapping
const SECTION_METADATA = {
  "pendahuluan": { title: "PENDAHULUAN", subtitle: "Selamat Datang di Synthera", category: "UMUM" },
  "instalasi": { title: "PANDUAN DEVELOPER", subtitle: "Setup & Instalasi", category: "UMUM" },
  "autentikasi": { title: "AUTENTIKASI & 2FA", subtitle: "Sistem Keamanan", category: "UMUM" },
  "dashboard": { title: "DASHBOARD UTAMA", subtitle: "Pusat Kontrol Member", category: "MEMBER" },
  "profil": { title: "PROFIL & KEAMANAN", subtitle: "Kelola Profil Akun", category: "MEMBER" },
  "subscription": { title: "UPGRADE LANGGANAN", subtitle: "Cara Upgrade Paket", category: "MEMBER" },
  "api-keys": { title: "API KEYS", subtitle: "Mengelola API Keys", category: "MEMBER" },
  "api-usage": { title: "API USAGE MONITOR", subtitle: "Monitoring API", category: "MEMBER" },
  "digital-content": { title: "KURSUS DIGITAL", subtitle: "Materi Pembelajaran", category: "MEMBER" },
  "halaman-publik": { title: "HALAMAN PUBLIK", subtitle: "Informasi Platform", category: "MEMBER" },
  "admin-users": { title: "MANAJEMEN USER", subtitle: "Kelola User (Admin)", category: "ADMIN" },
  "admin-transactions": { title: "MANAJEMEN TRANSAKSI", subtitle: "Kelola Transaksi (Admin)", category: "ADMIN" },
  "admin-reports": { title: "ANALITIK & LAPORAN", subtitle: "Dashboard Analitik (Admin)", category: "ADMIN" },
  "admin-plans": { title: "MANAJEMEN PAKET", subtitle: "Kelola Paket (Admin)", category: "ADMIN" },
  "faq": { title: "FAQ & SUPPORT", subtitle: "Bantuan", category: "UMUM" },
};

/**
 * Generate content berdasarkan section
 */
function generateSectionContent(doc, section, y, PW, PH, ML, MR) {
  const contentMap = {
    "pendahuluan": () => generatePendahuluanContent(doc, y, PW, PH, ML, MR),
    "instalasi": () => generateInstalasiContent(doc, y, PW, PH, ML, MR),
    "autentikasi": () => generateAutentikasiContent(doc, y, PW, PH, ML, MR),
    "dashboard": () => generateDashboardContent(doc, y, PW, ML, MR),
    "profil": () => generateProfilContent(doc, y, PW, ML, MR),
    "subscription": () => generateSubscriptionContent(doc, y, PW, ML, MR),
    "api-keys": () => generateApiKeysContent(doc, y, PW, ML, MR),
    "api-usage": () => generateApiUsageContent(doc, y, PW, ML, MR),
    "digital-content": () => generateDigitalContentContent(doc, y, PW, ML, MR),
    "halaman-publik": () => generateHalamanPublikContent(doc, y, PW, ML, MR),
    "admin-users": () => generateAdminUsersContent(doc, y, PW, ML, MR),
    "admin-transactions": () => generateAdminTransactionsContent(doc, y, PW, ML, MR),
    "admin-reports": () => generateAdminReportsContent(doc, y, PW, ML, MR),
    "admin-plans": () => generateAdminPlansContent(doc, y, PW, ML, MR),
    "faq": () => generateFaqContent(doc, y, PW, PH, ML, MR),
  };

  // Jika ada generator khusus, gunakan itu
  if (contentMap[section]) {
    return contentMap[section]();
  }

  // Fallback: generate generic content
  return generateGenericContent(doc, section, y, PW, PH, ML, MR);
}

/**
 * Generate Pendahuluan Content
 */
function generatePendahuluanContent(doc, y, PW, PH, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Selamat Datang di Synthera", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const introText = 
    "Synthera adalah platform inovatif terintegrasi yang dirancang untuk membantu penyedia " +
    "konten digital dan pengembang API dalam mengelola sistem keanggotaan (membership), " +
    "distribusi konten premium, autentikasi kunci API (API keys), dan penagihan berbasis " +
    "langganan secara otomatis.";
  
  const splitIntro = doc.splitTextToSize(introText, PW - ML - MR);
  doc.text(splitIntro, ML, y);
  y += splitIntro.length * 5 + 8;

  // Target Pengguna
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(ML, y - 3, PW - ML - MR, 12, 3, 3, 'F');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Target Pengguna", ML + 3, y + 5);
  y += 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Pengguna Biasa (Member)", ML, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const memberText = 
    "Membantu proses pendaftaran, mengupgrade paket, memantau riwayat transaksi, " +
    "membuat API keys untuk proyek pribadi, dan mengakses materi pembelajaran.";
  const splitMember = doc.splitTextToSize(memberText, PW - ML - MR - 5);
  doc.text(splitMember, ML + 5, y);
  y += splitMember.length * 4.5 + 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Admin Pengelola", ML, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const adminText = 
    "Panduan lengkap untuk memantau transaksi masuk, memverifikasi user, menambah/mengurangi " +
    "paket, melacak analitik keuangan, serta mengunggah kursus digital baru.";
  const splitAdmin = doc.splitTextToSize(adminText, PW - ML - MR - 5);
  doc.text(splitAdmin, ML + 5, y);
  y += splitAdmin.length * 4.5 + 10;

  return y;
}

/**
 * Generate Instalasi Content
 */
function generateInstalasiContent(doc, y, PW, PH, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Panduan Setup Developer", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const descText = 
    "Ikuti langkah-langkah di bawah ini untuk mengunduh, mengonfigurasi, dan menjalankan " +
    "kode frontend Synthera di komputer lokal Anda. Platform ini terintegrasi dengan backend " +
    "API berbasis Laravel.";
  const splitDesc = doc.splitTextToSize(descText, PW - ML - MR);
  doc.text(splitDesc, ML, y);
  y += splitDesc.length * 5 + 10;

  // 1. Prasyarat Sistem
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("1. Prasyarat Sistem", ML, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const requirements = [
    "- Node.js versi 18.x atau yang terbaru",
    "- Package manager (npm, yarn, pnpm, atau bun)",
    "- Akses internet untuk menghubungkan ke API Backend Laravel produksi:",
    "  https://api.synthera.id/api",
  ];
  requirements.forEach(req => {
    doc.text(req, ML + 3, y);
    y += 4.5;
  });

  y += 8;

  // 2. Perintah Terminal untuk Instalasi
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("2. Perintah Terminal untuk Instalasi", ML, y);
  y += 7;

  // Terminal header
  doc.setFillColor(40, 45, 55);
  doc.roundedRect(ML, y, PW - ML - MR, 8, 2, 2, 'F');
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(180, 190, 200);
  doc.text("TERMINAL / POWERSHELL", ML + 3, y + 5);
  y += 8;

  // Code block
  const codeHeight = 42;
  doc.setFillColor(30, 30, 35);
  doc.rect(ML, y, PW - ML - MR, codeHeight, 'F');
  y += 5;

  doc.setFont("courier", "normal");
  doc.setFontSize(7);
  
  // Comment style
  doc.setTextColor(100, 110, 130);
  doc.text("# 1. Clone repositori proyek", ML + 3, y);
  y += 4;
  
  // Command style
  doc.setTextColor(100, 200, 255);
  doc.text("git clone https://github.com/Synthera-ID/synthera-fe", ML + 3, y);
  y += 4;
  doc.text("cd synthera-fe", ML + 3, y);
  y += 5;

  // Comment
  doc.setTextColor(100, 110, 130);
  doc.text("# 2. Instal semua dependensi", ML + 3, y);
  y += 4;
  
  // Command
  doc.setTextColor(100, 200, 255);
  doc.text("npm install", ML + 3, y);
  y += 5;

  // Comment
  doc.setTextColor(100, 110, 130);
  doc.text("# 3. Buat file konfigurasi env", ML + 3, y);
  y += 4;
  
  // Command
  doc.setTextColor(100, 200, 255);
  doc.text("cp .env.example .env", ML + 3, y);
  y += 5;

  // Comment
  doc.setTextColor(100, 110, 130);
  doc.text("# 4. Jalankan server lokal", ML + 3, y);
  y += 4;
  
  // Command
  doc.setTextColor(100, 200, 255);
  doc.text("npm run dev", ML + 3, y);
  y += 10;

  // 3. Konfigurasi Variabel Lingkungan
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("3. Konfigurasi Variabel Lingkungan (.env)", ML, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const envText = 
    "Buka file .env yang baru saja disalin di root direktori proyek Anda dan isikan " +
    "konfigurasi API backend Laravel sebagai berikut:";
  const splitEnv = doc.splitTextToSize(envText, PW - ML - MR);
  doc.text(splitEnv, ML, y);
  y += splitEnv.length * 4.5 + 6;

  // Env config box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(ML, y, PW - ML - MR, 16, 2, 2, 'F');
  y += 5;
  
  doc.setFont("courier", "normal");
  doc.setFontSize(7);
  doc.setTextColor(120, 130, 140);
  doc.text("# URL dasar API Backend Laravel Produksi", ML + 3, y);
  y += 4;
  
  doc.setFont("courier", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("NEXT_PUBLIC_APP_API_URL", ML + 3, y);
  
  doc.setFont("courier", "normal");
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("=", ML + 53, y);
  
  doc.setTextColor(16, 185, 129);
  doc.text("https://api.synthera.id/api", ML + 56, y);
  y += 10;

  return y;
}

/**
 * Generate Autentikasi Content
 */
function generateAutentikasiContent(doc, y, PW, PH, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Sistem Autentikasi & Two-Factor Authentication", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const authText = 
    "Synthera menyediakan sistem masuk (login) yang aman, fleksibel, serta mendukung " +
    "autentikasi pihak ketiga dan verifikasi keamanan ganda.";
  const splitAuth = doc.splitTextToSize(authText, PW - ML - MR);
  doc.text(splitAuth, ML, y);
  y += splitAuth.length * 5 + 10;

  // 3 Feature Cards
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Fitur Keamanan Utama", ML, y);
  y += 8;

  const features = [
    {
      title: "Registrasi Akun",
      desc: "Pendaftaran user baru dengan verifikasi password strength bar yang dinamis."
    },
    {
      title: "OAuth Pihak Ketiga",
      desc: "Masuk instan menggunakan kredensial Google atau GitHub tanpa input password."
    },
    {
      title: "Two-Factor Auth",
      desc: "Mencegah akses ilegal dengan mewajibkan verifikasi OTP Google Authenticator."
    }
  ];

  features.forEach((feature, i) => {
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(ML, y, PW - ML - MR, 18, 2, 2, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...PDF_COLORS.grayDark);
    doc.text(feature.title, ML + 3, y + 5);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.grayMid);
    const splitFeat = doc.splitTextToSize(feature.desc, PW - ML - MR - 6);
    doc.text(splitFeat, ML + 3, y + 10);
    
    y += 22;
  });

  y += 4;

  // Alur Registrasi & Setup 2FA
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_COLORS.navyMid);
  doc.text("Alur Registrasi & Setup 2FA", ML, y);
  y += 8;

  const steps = [
    { 
      title: "Daftar Akun Baru", 
      desc: "Buka /register, isi Form Nama, Email, dan Password. Perhatikan bar indikator kekuatan password."
    },
    { 
      title: "Login Pertama & Konfirmasi 2FA", 
      desc: "Setelah login, user baru akan disambut oleh halaman prompt /2fa. Klik tombol 'Yes, Enable 2FA' untuk menyiapkan proteksi."
    },
    { 
      title: "Scan QR Code Authenticator", 
      desc: "Aplikasi akan menampilkan kode QR dan Key Rahasia. Scan QR code menggunakan aplikasi Google Authenticator di HP Anda."
    },
    { 
      title: "Masukkan Kode Verifikasi", 
      desc: "Ketik 6 digit OTP yang muncul di aplikasi Authenticator untuk menguji keselarasan waktu, lalu klik Verifikasi. 2FA kini aktif."
    }
  ];

  steps.forEach((step, index) => {
    // Number circle
    doc.setFillColor(...PDF_COLORS.royalBlue);
    doc.circle(ML + 3, y + 2, 3, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.white);
    doc.text(String(index + 1), ML + 2.2, y + 3.5);
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...PDF_COLORS.grayDark);
    doc.text(step.title, ML + 8, y + 3);
    y += 6;

    // Description
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.grayMid);
    const splitStep = doc.splitTextToSize(step.desc, PW - ML - MR - 10);
    doc.text(splitStep, ML + 8, y);
    y += splitStep.length * 4 + 6;
  });

  return y;
}

/**
 * Generate FAQ Content
 */
function generateFaqContent(doc, y, PW, PH, ML, MR) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text("Frequently Asked Questions", ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  const introText = 
    "Daftar jawaban atas beberapa pertanyaan umum yang sering diajukan mengenai " +
    "penggunaan platform Synthera.";
  const splitIntro = doc.splitTextToSize(introText, PW - ML - MR);
  doc.text(splitIntro, ML, y);
  y += splitIntro.length * 5 + 10;

  // FAQ Items
  const faqs = [
    {
      q: "Mengapa invoice upgrade paket saya tidak kunjung terverifikasi?",
      a: "Pastikan nominal dana yang Anda transfer ke rekening VA/QRIS telah menyertakan 3 digit kode unik acak di nominal ekor secara presisi. Kesalahan input nominal akan membatalkan otomatisasi sistem."
    },
    {
      q: "Bagaimana jika saya kehilangan ponsel dengan Google Authenticator aktif?",
      a: "Hubungi admin pengelola sistem melalui saluran Telegram Support/Email. Admin dapat menonaktifkan paksa status 2FA akun Anda melalui panel User Management secara aman."
    },
    {
      q: "Apakah API Key lama masih dapat digunakan setelah melakukan regenerasi?",
      a: "Tidak. Proses regenerasi/revoke akan menghapus otorisasi token key lama secara permanen dari server database API gateway demi keamanan integrasi Anda."
    }
  ];

  faqs.forEach((faq, index) => {
    // Check if need new page
    if (y > PH - 70) {
      doc.addPage();
      y = 20;
    }

    // Calculate heights first
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const splitQ = doc.splitTextToSize(faq.q, PW - ML - MR - 12);
    const qHeight = splitQ.length * 4.5;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const splitA = doc.splitTextToSize(faq.a, PW - ML - MR - 12);
    const aHeight = splitA.length * 4;
    
    // Calculate total box height with padding
    const totalBoxHeight = qHeight + aHeight + 12; // 12 = padding (top 4 + middle 4 + bottom 4)
    
    // Draw FAQ Box background
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(ML, y, PW - ML - MR, totalBoxHeight, 3, 3, 'F');
    
    // Question icon (circle with ?)
    doc.setFillColor(...PDF_COLORS.royalBlue);
    doc.circle(ML + 4, y + 6, 2.5, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.white);
    doc.text("?", ML + 3.2, y + 7.5);
    
    // Question text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...PDF_COLORS.grayDark);
    doc.text(splitQ, ML + 8, y + 6);
    
    // Answer text (below question with spacing)
    const answerY = y + 6 + qHeight + 3;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...PDF_COLORS.grayMid);
    doc.text(splitA, ML + 8, answerY);
    
    // Move Y position to after this box + spacing
    y += totalBoxHeight + 6;
  });

  return y;
}

// Wrapper functions untuk sections sisanya menggunakan generic template dengan konten yang lebih baik
function generateGenericContent(doc, section, y, PW, PH, ML, MR) {
  const meta = SECTION_METADATA[section] || { title: "MANUAL BOOK", subtitle: "Panduan Synthera" };
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PDF_COLORS.grayDark);
  doc.text(meta.subtitle, ML, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...PDF_COLORS.grayMid);
  
  const fallbackText = "Konten section ini sedang dalam pengembangan. Silakan hubungi administrator untuk informasi lebih lanjut.";
  const splitText = doc.splitTextToSize(fallbackText, PW - ML - MR);
  doc.text(splitText, ML, y);
  y += splitText.length * 5 + 10;

  return y;
}

/**
 * Generate Manual Book PDF with dynamic height based on content
 */
export async function generateManualBookPDF(activeSection = "pendahuluan") {
  const PW = 210; // A4 width in mm
  const ML = 15;
  const MR = 15;

  const logoBase64 = await loadLogoBase64();

  const today = new Date();
  const docNumber = `#MB-${activeSection.toUpperCase()}-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

  const exportDate = today.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const sectionMeta = SECTION_METADATA[activeSection] || SECTION_METADATA["pendahuluan"];

  // ── PASS 1: Measure content height using a tall temporary doc ──
  const MEASURE_H = 9999;
  const measureDoc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [PW, MEASURE_H],
  });

  const headerEndY = drawPremiumHeader(measureDoc, {
    title: sectionMeta.title,
    documentNumber: docNumber,
    logoBase64,
    pageWidth: PW,
    marginLeft: ML,
    marginRight: MR,
    withGlow: false,
    infoBoxes: {
      box1: { label: "TANGGAL DITERBITKAN", value: exportDate },
      box2: { label: "VERSI", value: "v1.0" },
      box3: { label: "KATEGORI", value: sectionMeta.category },
      box4: { label: "SECTION", value: activeSection.toUpperCase() },
    },
  });

  let measuredY = headerEndY;
  measuredY = generateSectionContent(measureDoc, activeSection, measuredY, PW, MEASURE_H, ML, MR);

  // Footer note height
  measureDoc.setFont("helvetica", "italic");
  measureDoc.setFontSize(8);
  const footerNote =
    "Untuk informasi lebih lengkap, silakan akses manual book interaktif di https://synthera.id/manual " +
    "atau hubungi support@synthera.id untuk bantuan teknis.";
  const splitFooterNote = measureDoc.splitTextToSize(footerNote, PW - ML - MR);
  measuredY += splitFooterNote.length * 4 + 5;

  // Add footer height (35mm) + bottom padding
  const FOOTER_HEIGHT = 35;
  const BOTTOM_PAD = 10;
  const totalHeight = measuredY + FOOTER_HEIGHT + BOTTOM_PAD;

  // ── PASS 2: Render final PDF with correct height ──
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [PW, totalHeight],
  });

  const currentY = drawPremiumHeader(doc, {
    title: sectionMeta.title,
    documentNumber: docNumber,
    logoBase64,
    pageWidth: PW,
    marginLeft: ML,
    marginRight: MR,
    withGlow: false,
    infoBoxes: {
      box1: { label: "TANGGAL DITERBITKAN", value: exportDate },
      box2: { label: "VERSI", value: "v1.0" },
      box3: { label: "KATEGORI", value: sectionMeta.category },
      box4: { label: "SECTION", value: activeSection.toUpperCase() },
    },
  });

  let y = currentY;

  // Generate content
  y = generateSectionContent(doc, activeSection, y, PW, totalHeight, ML, MR);

  // Footer note
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...PDF_COLORS.grayLight);
  doc.text(splitFooterNote, ML, y);
  y += splitFooterNote.length * 4 + 5;

  // Footer — always placed right after content
  drawPremiumFooter(doc, {
    logoBase64,
    pageWidth: PW,
    pageHeight: totalHeight,
    marginLeft: ML,
    marginRight: MR,
    currentY: y,
  });

  return doc;
}

/**
 * Download Manual Book PDF with Preview
 */
export async function downloadManualBookPDF(activeSection = "pendahuluan") {
  try {
    const doc = await generateManualBookPDF(activeSection);
    
    const sectionMeta = SECTION_METADATA[activeSection] || SECTION_METADATA["pendahuluan"];
    const today = new Date();
    const sectionSlug = activeSection.replace(/-/g, '_');
    const filename = `synthera-manual-${sectionSlug}-${today.toISOString().split('T')[0]}.pdf`;
    
    openPDFPreview(doc, filename, `Preview: ${sectionMeta.title}`);
  } catch (error) {
    console.error("Error generating Manual Book PDF:", error);
    alert("Gagal membuat PDF Manual Book. Silakan coba lagi.");
  }
}
