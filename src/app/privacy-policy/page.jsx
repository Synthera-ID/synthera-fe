import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// ============================================================
// Synthera - Privacy Policy Page
// Usage: import PrivacyPolicy from './PrivacyPolicy';
//        <PrivacyPolicy />
// ============================================================

const EFFECTIVE_DATE = "11 April 2026";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-200 font-['Inter',system-ui,sans-serif] leading-relaxed">
      {/* Background Glow */}
      <div className="fixed -top-52 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(139,92,246,0.12)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-violet-500/10">
        <div className="max-w-[900px] mx-auto px-6 py-5 flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/icon.png" alt="Synthera Logo" width={48} height={48} className="rounded-full" />
            <span className="text-xl font-bold tracking-tight text-white">Synthera</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-[900px] mx-auto px-6 pt-12 pb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white via-white to-violet-300 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-sm text-zinc-500 mb-12">
          Berlaku efektif sejak {EFFECTIVE_DATE} &mdash; Terakhir diperbarui {EFFECTIVE_DATE}
        </p>

        {/* Intro */}
        <div className="bg-violet-500/[0.07] border border-violet-500/15 rounded-xl px-6 py-5 mb-10">
          <p className="text-violet-300 text-[15px] leading-relaxed">
            Synthera berkomitmen untuk melindungi privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan,
            menggunakan, dan melindungi informasi pribadi Anda saat menggunakan platform e-course dan membership kami.
          </p>
        </div>

        {/* 1 */}
        <Section number="1" title="Informasi yang Kami Kumpulkan">
          <p className="text-zinc-400 text-[15px] leading-relaxed mb-3">
            Kami mengumpulkan informasi yang Anda berikan secara langsung maupun otomatis saat menggunakan layanan
            Synthera:
          </p>
          <BulletList
            items={[
              <>
                <B>Informasi Akun:</B> Nama lengkap, alamat email, nomor telepon, dan foto profil saat Anda mendaftar
                atau memperbarui akun.
              </>,
              <>
                <B>Informasi Pembayaran:</B> Detail transaksi, metode pembayaran, dan riwayat pembelian kursus atau
                langganan membership.
              </>,
              <>
                <B>Data Penggunaan:</B> Riwayat kursus yang diakses, progress belajar, waktu akses, dan interaksi dengan
                konten platform.
              </>,
              <>
                <B>Informasi Teknis:</B> Alamat IP, jenis browser, sistem operasi, jenis perangkat, dan data cookies.
              </>,
              <>
                <B>Komunikasi:</B> Pesan yang Anda kirim melalui fitur diskusi, forum, atau dukungan pelanggan.
              </>,
            ]}
          />
        </Section>

        {/* 2 */}
        <Section number="2" title="Penggunaan Informasi">
          <p className="text-zinc-400 text-[15px] leading-relaxed mb-3">
            Informasi yang kami kumpulkan digunakan untuk:
          </p>
          <BulletList
            items={[
              "Menyediakan, mengelola, dan meningkatkan layanan e-course dan membership Synthera.",
              "Memproses pembayaran dan mengelola langganan Anda.",
              "Mengirim notifikasi terkait kursus, pembaruan konten, dan informasi penting akun.",
              "Menyesuaikan pengalaman belajar dan memberikan rekomendasi kursus yang relevan.",
              "Menganalisis penggunaan platform untuk peningkatan kualitas layanan.",
              "Mencegah penipuan, penyalahgunaan, dan menjaga keamanan platform.",
              "Memenuhi kewajiban hukum yang berlaku.",
            ]}
          />
        </Section>

        {/* 3 */}
        <Section number="3" title="Penyimpanan & Keamanan Data">
          <p className="text-zinc-400 text-[15px] leading-relaxed mb-3">
            Kami menyimpan data pribadi Anda selama akun Anda aktif atau selama diperlukan untuk menyediakan layanan.
            Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar, termasuk:
          </p>
          <BulletList
            items={[
              "Enkripsi data saat transmisi (SSL/TLS) dan penyimpanan.",
              "Akses terbatas terhadap data pribadi hanya kepada personel yang berwenang.",
              "Monitoring keamanan berkala dan audit sistem.",
              "Penyimpanan kata sandi menggunakan hashing yang aman.",
            ]}
          />
          <p className="text-zinc-400 text-[15px] leading-relaxed mt-3">
            Meskipun kami berupaya maksimal, tidak ada sistem yang sepenuhnya aman. Kami tidak dapat menjamin keamanan
            absolut atas data Anda.
          </p>
        </Section>

        {/* 4 */}
        <Section number="4" title="Berbagi Informasi dengan Pihak Ketiga">
          <p className="text-zinc-400 text-[15px] leading-relaxed mb-3">
            Kami <B>tidak menjual</B> data pribadi Anda. Kami hanya membagikan informasi dalam situasi berikut:
          </p>
          <BulletList
            items={[
              <>
                <B>Penyedia Layanan:</B> Penyedia layanan pembayaran (payment gateway), hosting, dan analitik yang
                membantu operasional platform.
              </>,
              <>
                <B>Instruktur/Mentor:</B> Data terbatas seperti nama dan progress kepada instruktur kursus yang Anda
                ikuti.
              </>,
              <>
                <B>Kewajiban Hukum:</B> Jika diwajibkan oleh hukum, proses hukum, atau permintaan pemerintah yang sah.
              </>,
              <>
                <B>Perlindungan Hak:</B> Untuk melindungi hak, properti, atau keselamatan Synthera, pengguna, atau
                publik.
              </>,
            ]}
          />
        </Section>

        {/* 5 */}
        <Section number="5" title="Cookies & Teknologi Pelacakan">
          <p className="text-zinc-400 text-[15px] leading-relaxed mb-3">
            Synthera menggunakan cookies dan teknologi serupa untuk:
          </p>
          <BulletList
            items={[
              "Menjaga sesi login dan preferensi Anda.",
              "Menganalisis traffic dan pola penggunaan platform.",
              "Menyediakan konten dan iklan yang dipersonalisasi.",
            ]}
          />
          <p className="text-zinc-400 text-[15px] leading-relaxed mt-3">
            Anda dapat mengatur preferensi cookies melalui pengaturan browser Anda. Menonaktifkan cookies tertentu dapat
            mempengaruhi fungsionalitas platform.
          </p>
        </Section>

        {/* 6 */}
        <Section number="6" title="Hak-Hak Anda">
          <p className="text-zinc-400 text-[15px] leading-relaxed mb-3">Sebagai pengguna, Anda memiliki hak untuk:</p>
          <BulletList
            items={[
              "Mengakses dan memperoleh salinan data pribadi Anda.",
              "Memperbarui atau memperbaiki informasi yang tidak akurat.",
              "Meminta penghapusan data pribadi Anda (dengan batasan tertentu).",
              "Menarik persetujuan atas pemrosesan data tertentu.",
              "Mengajukan keluhan kepada otoritas perlindungan data yang berwenang.",
            ]}
          />
          <p className="text-zinc-400 text-[15px] leading-relaxed mt-3">
            Untuk menggunakan hak-hak ini, silakan hubungi kami melalui informasi kontak di bawah.
          </p>
        </Section>

        {/* 7 */}
        <Section number="7" title="Perubahan Kebijakan Privasi">
          <p className="text-zinc-400 text-[15px] leading-relaxed">
            Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui
            email atau notifikasi di platform. Penggunaan berkelanjutan setelah perubahan dianggap sebagai persetujuan
            Anda terhadap kebijakan yang diperbarui.
          </p>
        </Section>

        {/* Contact */}
        <ContactCard
          email="support@synthera.id"
          description="Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami:"
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// ── Shared sub-components ──────────────────────────────────

function B({ children }) {
  return <span className="text-zinc-200 font-semibold">{children}</span>;
}

function Section({ number, title, children }) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/25 text-xs font-bold text-violet-300 shrink-0">
          {number}
        </span>
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2 mt-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="relative pl-6 text-zinc-400 text-[15px] leading-relaxed before:content-[''] before:absolute before:left-0 before:top-[10px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-violet-500 before:shadow-[0_0_6px_rgba(139,92,246,0.4)]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function ContactCard({ email, description }) {
  return (
    <div className="bg-gradient-to-br from-violet-500/[0.07] to-zinc-800/30 border border-violet-500/15 rounded-2xl p-8 mt-12">
      <h3 className="text-lg font-bold text-zinc-100 mb-3">📬 Hubungi Kami</h3>
      <p className="text-zinc-400 text-sm">{description}</p>
      <p className="text-sm mt-3">
        <span className="text-zinc-200 font-semibold">Email:</span>{" "}
        <a href={`mailto:${email}`} className="text-violet-400 hover:text-violet-300 transition-colors">
          {email}
        </a>
      </p>
      <p className="text-sm text-zinc-400">
        <span className="text-zinc-200 font-semibold">Website:</span>{" "}
        <a
          href="https://synthera.id"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400 hover:text-violet-300 transition-colors"
        >
          synthera.id
        </a>
      </p>
    </div>
  );
}
