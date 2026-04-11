// Synthera - Terms of Service Page
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const EFFECTIVE_DATE = "11 April 2026";

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        <p className="text-sm text-zinc-500 mb-12">
          Berlaku efektif sejak {EFFECTIVE_DATE} &mdash; Terakhir diperbarui {EFFECTIVE_DATE}
        </p>

        {/* Intro */}
        <div className="bg-violet-500/[0.07] border border-violet-500/15 rounded-xl px-6 py-5 mb-10">
          <p className="text-violet-300 text-[15px] leading-relaxed">
            Dengan mengakses dan menggunakan platform Synthera, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan
            ini. Jika Anda tidak setuju dengan ketentuan ini, mohon untuk tidak menggunakan layanan kami.
          </p>
        </div>

        {/* 1 */}
        <Section number="1" title="Definisi">
          <BulletList
            items={[
              <>
                <B>&quot;Synthera&quot;</B> atau <B>&quot;Kami&quot;</B> merujuk pada platform e-course dan membership
                Synthera beserta pengelolanya.
              </>,
              <>
                <B>&quot;Pengguna&quot;</B> atau <B>&quot;Anda&quot;</B> merujuk pada setiap individu yang mengakses
                atau menggunakan layanan Synthera.
              </>,
              <>
                <B>&quot;Konten&quot;</B> mencakup seluruh materi kursus termasuk video, teks, gambar, kuis, tugas, dan
                materi pendukung lainnya.
              </>,
              <>
                <B>&quot;Membership&quot;</B> merujuk pada paket langganan berbayar yang memberikan akses ke konten
                premium.
              </>,
            ]}
          />
        </Section>

        {/* 2 */}
        <Section number="2" title="Pendaftaran Akun">
          <BulletList
            items={[
              "Anda harus berusia minimal 17 tahun atau memiliki izin dari orang tua/wali untuk menggunakan platform ini.",
              "Anda bertanggung jawab untuk memberikan informasi yang akurat dan terkini saat mendaftar.",
              "Anda bertanggung jawab penuh atas keamanan akun dan kata sandi Anda.",
              "Satu akun hanya boleh digunakan oleh satu orang. Berbagi akun dilarang keras.",
              "Kami berhak menangguhkan atau menghapus akun yang melanggar ketentuan ini.",
            ]}
          />
        </Section>

        {/* 3 */}
        <Section number="3" title="Layanan & Konten">
          <p className="text-zinc-400 text-[15px] leading-relaxed mb-3">
            Synthera menyediakan platform pembelajaran online berupa kursus digital dengan sistem membership. Dengan ini
            Anda memahami bahwa:
          </p>
          <BulletList
            items={[
              'Konten kursus disediakan "sebagaimana adanya" untuk tujuan edukasi.',
              "Kami tidak menjamin bahwa konten selalu terbaru, lengkap, atau bebas dari kesalahan.",
              "Kami berhak menambah, mengubah, atau menghapus konten tanpa pemberitahuan sebelumnya.",
              "Ketersediaan fitur tertentu dapat berbeda berdasarkan paket membership Anda.",
              "Kami tidak menjamin hasil tertentu dari penggunaan materi kursus.",
            ]}
          />
        </Section>

        {/* 4 */}
        <Section number="4" title="Pembayaran & Langganan">
          <BulletList
            items={[
              "Harga membership dan kursus tertera di platform dan dapat berubah sewaktu-waktu.",
              "Pembayaran diproses melalui payment gateway pihak ketiga yang terpercaya.",
              "Langganan membership akan diperpanjang secara otomatis kecuali Anda membatalkannya sebelum periode berikutnya.",
              "Anda bertanggung jawab untuk membatalkan langganan jika tidak ingin melanjutkan.",
            ]}
          />
        </Section>

        {/* 5 */}
        <Section number="5" title="Kebijakan Pengembalian Dana">
          <BulletList
            items={[
              <>
                {" "}
                Pengembalian dana dapat diajukan dalam waktu <B>7 hari</B> setelah pembelian, dengan syarat Anda belum
                mengakses lebih dari 20% konten kursus.
              </>,
              "Pengembalian dana untuk membership bulanan hanya berlaku untuk bulan berjalan.",
              "Promo, diskon, atau penawaran khusus mungkin memiliki kebijakan pengembalian yang berbeda.",
              "Proses pengembalian dana memerlukan waktu 7–14 hari kerja.",
              "Keputusan pengembalian dana sepenuhnya menjadi hak Synthera.",
            ]}
          />
        </Section>

        {/* 6 */}
        <Section number="6" title="Hak Kekayaan Intelektual">
          <BulletList
            items={[
              "Seluruh konten di platform Synthera dilindungi oleh hak cipta dan hak kekayaan intelektual yang berlaku.",
              "Anda diberikan lisensi terbatas, non-eksklusif, dan tidak dapat dipindahtangankan untuk mengakses konten sesuai paket Anda.",
              <>
                Anda <B>dilarang</B> untuk menyalin, merekam, mendistribusikan, menjual, atau membagikan konten kursus
                dalam bentuk apapun.
              </>,
              "Pelanggaran hak kekayaan intelektual akan ditindak sesuai hukum yang berlaku.",
            ]}
          />
        </Section>

        {/* 7 */}
        <Section number="7" title="Perilaku Pengguna">
          <p className="text-zinc-400 text-[15px] leading-relaxed mb-3">
            Saat menggunakan Synthera, Anda setuju untuk tidak:
          </p>
          <BulletList
            items={[
              "Menyalahgunakan platform untuk tujuan ilegal atau tidak sah.",
              "Mengirim spam, konten berbahaya, atau melakukan harassment di forum/diskusi.",
              "Menggunakan bot, scraper, atau alat otomatis untuk mengakses konten.",
              "Berupaya mengakses akun pengguna lain tanpa izin.",
              "Mengganggu atau merusak infrastruktur teknis platform.",
              "Membagikan atau mempublikasikan materi kursus di luar platform.",
            ]}
          />
        </Section>

        {/* 8 */}
        <Section number="8" title="Batasan Tanggung Jawab">
          <BulletList
            items={[
              "Synthera tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan platform.",
              "Kami tidak bertanggung jawab atas gangguan layanan yang disebabkan oleh faktor di luar kendali kami (force majeure).",
              "Total tanggung jawab kami tidak akan melebihi jumlah yang Anda bayarkan dalam 12 bulan terakhir.",
            ]}
          />
        </Section>

        {/* 9 */}
        <Section number="9" title="Penghentian Layanan">
          <BulletList
            items={[
              "Kami berhak menangguhkan atau menghentikan akses Anda jika terjadi pelanggaran terhadap ketentuan ini.",
              "Anda dapat menghentikan penggunaan layanan dan menutup akun kapan saja.",
              "Setelah penghentian, akses Anda ke konten berbayar akan dicabut.",
              "Ketentuan yang secara wajar harus bertahan setelah penghentian akan tetap berlaku (termasuk hak kekayaan intelektual dan batasan tanggung jawab).",
            ]}
          />
        </Section>

        {/* 10 */}
        <Section number="10" title="Hukum yang Berlaku">
          <p className="text-zinc-400 text-[15px] leading-relaxed">
            Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa
            yang timbul akan diselesaikan melalui musyawarah mufakat terlebih dahulu. Jika tidak tercapai kesepakatan,
            sengketa akan diselesaikan melalui pengadilan yang berwenang di Indonesia.
          </p>
        </Section>

        {/* 11 */}
        <Section number="11" title="Perubahan Ketentuan">
          <p className="text-zinc-400 text-[15px] leading-relaxed">
            Kami berhak memperbarui Syarat dan Ketentuan ini sewaktu-waktu. Perubahan material akan diberitahukan
            melalui email atau notifikasi di platform minimal 14 hari sebelum berlaku. Penggunaan berkelanjutan setelah
            perubahan berlaku dianggap sebagai persetujuan Anda.
          </p>
        </Section>

        {/* Contact */}
        <ContactCard
          email="support@synthera.id"
          description="Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami:"
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
