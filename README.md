<div align="center">

<img src="./public/icon.png" alt="Synthera Logo" width="80" height="80" style="border-radius: 50%;" />

# Synthera

**Platform manajemen membership, konten digital, dan API berbasis langganan**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/Lisensi-Private-red?style=flat-square)](./LICENSE)

[📖 Manual Book](#-panduan-penggunaan) · [🚀 Mulai Cepat](#-memulai) · [⚙️ Konfigurasi](#️-konfigurasi-environment) · [🗂️ Struktur Folder](#️-struktur-folder)

</div>

---

## 📋 Tentang Synthera

**Synthera** adalah platform web modern yang dirancang untuk mengelola membership, konten digital, API keys, dan laporan transaksi secara terpusat. Dibangun dengan Next.js 16 dan React 19, Synthera menawarkan pengalaman pengguna yang premium dengan antarmuka dark mode yang elegan.

### ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🔐 **Autentikasi Multi-Metode** | Login email/password, Google OAuth, GitHub OAuth, dan Two-Factor Authentication (2FA) |
| 📊 **Dashboard Analitik** | Ringkasan statistik transaksi, grafik 7 hari, dan akses cepat ke semua fitur |
| 💳 **Manajemen Subscription** | Pilih paket Basic, Pro, atau Exclusive dengan pembayaran QRIS & Virtual Account |
| 🔑 **API Keys** | Buat, lihat, salin, regenerasi, dan cabut API keys untuk integrasi |
| 📡 **API Usage Monitor** | Pantau penggunaan API, rate limit, latency, dan breakdown per endpoint |
| 📦 **Konten Digital** | Akses perpustakaan konten premium (tutorial, e-book, video, template) |
| 👥 **Manajemen User** | Admin dapat menambah, mengedit, mengaktifkan/nonaktifkan, dan menghapus user |
| 📈 **Laporan & Transaksi** | Laporan keuangan dan riwayat transaksi lengkap |
| ⚙️ **Profil & Keamanan** | Ubah nomor telepon, ganti password, dan kelola 2FA |

---

## 🚀 Memulai

### Persyaratan Sistem

- **Node.js** versi 18 atau lebih baru
- **npm** versi 9+ (atau yarn / pnpm / bun)
- Koneksi internet (untuk API backend)

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/your-org/synthera-fe.git
cd synthera-fe

# 2. Install dependensi
npm install

# 3. Salin file environment
cp .env.example .env

# 4. Isi konfigurasi di .env (lihat bagian Konfigurasi)

# 5. Jalankan server development
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### Skrip yang Tersedia

| Perintah | Deskripsi |
|----------|-----------|
| `npm run dev` | Menjalankan server development dengan hot-reload |
| `npm run build` | Membuat build produksi |
| `npm run start` | Menjalankan build produksi |
| `npm run lint` | Memeriksa kualitas kode dengan ESLint |

---

## ⚙️ Konfigurasi Environment

Buat file `.env` di root project dan isi variabel berikut:

```env
# URL API Backend Laravel Produksi
NEXT_PUBLIC_APP_API_URL=https://api.synthera.id/api
```

---

## 🗂️ Struktur Folder

```
synthera-fe/
├── public/                  # Aset statis (ikon, gambar)
├── src/
│   ├── app/                 # Halaman & routing (Next.js App Router)
│   │   ├── (auth)/          # Halaman autentikasi
│   │   │   ├── login/       # Halaman login
│   │   │   ├── register/    # Halaman registrasi
│   │   │   └── 2fa/         # Verifikasi Two-Factor Authentication
│   │   ├── dashboard/       # Halaman dashboard (dilindungi auth)
│   │   │   ├── page.jsx             # Halaman utama dashboard
│   │   │   ├── profile/             # Pengaturan profil
│   │   │   ├── api_keys/            # Manajemen API keys
│   │   │   ├── api_usage/           # Monitor penggunaan API
│   │   │   ├── digital_content/     # Perpustakaan konten digital
│   │   │   ├── subscription/        # Manajemen subscription
│   │   │   ├── general_information/ # Informasi umum
│   │   │   ├── course/              # Daftar kursus
│   │   │   └── management/          # Panel admin
│   │   │       ├── user_management/
│   │   │       ├── subscription_management/
│   │   │       ├── transaction_management/
│   │   │       ├── digital_content_management/
│   │   │       ├── membership_management/
│   │   │       ├── feature_management/
│   │   │       ├── payment_management/
│   │   │       └── reports/
│   │   ├── course/          # Halaman publik kursus
│   │   ├── privacy-policy/  # Halaman kebijakan privasi
│   │   └── terms-of-services/ # Halaman syarat penggunaan
│   ├── components/          # Komponen React yang dapat digunakan ulang
│   │   ├── atoms/           # Komponen dasar (Button, Input, dll.)
│   │   ├── organisms/       # Komponen kompleks (Sidebar, Navbar, dll.)
│   │   ├── layout/          # Komponen layout
│   │   ├── home/            # Komponen halaman beranda
│   │   └── ui/              # Komponen UI umum
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.js       # Hook autentikasi
│   ├── utils/               # Fungsi utilitas
│   │   ├── apiFetch.js      # Wrapper HTTP client
│   │   ├── cookie.js        # Utilitas cookie
│   │   └── format.js        # Formatter angka & tanggal
│   └── pages/               # API routes & halaman tambahan
├── .env                     # Variabel environment (tidak di-commit)
├── next.config.mjs          # Konfigurasi Next.js
├── tailwind.config.js       # Konfigurasi TailwindCSS
└── package.json             # Dependensi & skrip
```

---

## 📖 Panduan Penggunaan

### 1. Autentikasi

#### Login
1. Buka halaman `/login`
2. Masukkan **Email** dan **Password** lalu klik **Sign In**
3. Atau gunakan **Continue with Google** / **Continue with GitHub**

#### Registrasi
1. Buka halaman `/register`
2. Isi nama lengkap, email, dan password
3. Klik **Register**

#### Two-Factor Authentication (2FA)
- Jika 2FA diaktifkan, Anda akan diarahkan ke halaman `/2fa/verify` setelah login
- Masukkan kode OTP dari aplikasi autentikator Anda

---

### 2. Dashboard

Halaman dashboard (`/dashboard`) menampilkan:
- **Statistik Akun**: Paket aktif, transaksi hari ini, transaksi selesai, tanggal penagihan berikutnya
- **Grafik Aktivitas 7 Hari**: Visualisasi transaksi dalam 7 hari terakhir
- **Quick Actions**: Tombol cepat menuju API Keys, Subscription, Konten, dan Laporan

---

### 3. Subscription

Kelola paket berlangganan Anda di `/dashboard/subscription`:

| Paket | Keterangan |
|-------|------------|
| **Basic** | Paket dasar, gratis atau harga terjangkau |
| **Pro** ⭐ | Paket populer dengan fitur lengkap |
| **Exclusive** 💎 | Paket terbaik dengan akses penuh & unlimited |

**Cara Upgrade:**
1. Pilih paket yang diinginkan → klik **Upgrade**
2. Pilih metode pembayaran: **QRIS** atau **Bank Transfer (VA)**
3. Klik **Lanjut Bayar** → selesaikan pembayaran
4. Klik **Refresh Status Pembayaran** untuk memverifikasi

---

### 4. API Keys

Kelola API keys di `/dashboard/api_keys`:
- **Tampilkan/Sembunyikan Key**: Klik ikon mata untuk toggle visibilitas
- **Salin Key**: Klik tombol **Copy** untuk menyalin key ke clipboard
- **Regenerasi Key**: Klik **Regenerate Key** untuk membuat key baru
- **Cabut Key**: Klik **Revoke** untuk menonaktifkan key secara permanen
- **Riwayat Key**: Lihat semua key yang pernah dibuat beserta statusnya

---

### 5. API Usage

Monitor penggunaan API di `/dashboard/api_usage`:
- **Statistik Harian**: Jumlah call hari ini, bulan ini, dan rata-rata latency
- **Rate Limit**: Progress bar penggunaan kuota API
- **Grafik Bulanan**: Visualisasi tren penggunaan selama 12 bulan
- **Breakdown Endpoint**: Detail per endpoint (method, jumlah call, latency, error rate)

---

### 6. Konten Digital

Akses perpustakaan konten di `/dashboard/digital_content`:
- **Cari Konten**: Gunakan kotak pencarian untuk menemukan konten
- **Filter Kategori**: Tutorial, Template, E-Book, Video
- **Filter Akses**: Free, Pro, Enterprise
- **Unduh/Akses**: Klik tombol **Access** pada konten yang tersedia

---

### 7. Profil & Keamanan

Kelola akun Anda di `/dashboard/profile`:

**Informasi Profil:**
- Lihat nama lengkap, email, dan kode perusahaan (read-only)
- Edit **nomor telepon** (format: `08xx` atau `+628xx`)
- Klik **Save Changes** untuk menyimpan

**Ganti Password:**
1. Isi **Current Password**, **New Password**, dan **Confirm New Password**
2. Password baru minimal 8 karakter
3. Klik **Update Password**

**Two-Factor Authentication:**
- Toggle switch untuk mengaktifkan/menonaktifkan 2FA

---

### 8. Panel Admin (Management)

> ⚠️ Fitur ini hanya tersedia untuk pengguna dengan role **Admin**

| Halaman | Fungsi |
|---------|--------|
| **User Management** | Tambah, edit, nonaktifkan, hapus user |
| **Subscription Management** | Kelola paket subscription |
| **Transaction Management** | Lihat & kelola semua transaksi |
| **Digital Content Management** | Upload & kelola konten digital |
| **Membership Management** | Kelola keanggotaan user |
| **Feature Management** | Kelola fitur per paket |
| **Payment Management** | Manajemen metode pembayaran |
| **Reports** | Laporan keuangan & statistik |

#### Cara Mengelola User (Admin):
1. Buka `/dashboard/management/user_management`
2. Gunakan **Search** untuk mencari user berdasarkan nama atau email
3. Filter berdasarkan **Role** (All/Admin/Member) dan **Status** (All/Active/Inactive)
4. Klik **⋯** pada baris user untuk membuka menu aksi:
   - **Edit User**: Ubah data user
   - **Activate/Deactivate**: Ubah status user
   - **Delete User**: Hapus user (tidak dapat dibatalkan)
5. Klik **Add User** untuk menambah user baru

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| [Next.js](https://nextjs.org/) | 16.1.6 | Framework React dengan App Router |
| [React](https://react.dev/) | 19.2.3 | Library UI |
| [TailwindCSS](https://tailwindcss.com/) | 4 | Styling utility-first |
| [Lucide React](https://lucide.dev/) | 1.14.0 | Icon library |
| [React Icons](https://react-icons.github.io/) | 5.6.0 | Icon tambahan (Google, GitHub, dll.) |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4.6 | Dark/Light mode |
| [jsPDF](https://github.com/parallax/jsPDF) | 2.5.2 | Ekspor PDF |
| [JSZip](https://stuk.github.io/jszip/) | 3.10.1 | Kompresi & arsip file |
| [file-saver](https://github.com/eligrey/FileSaver.js/) | 2.0.5 | Download file di browser |

---

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch fitur baru: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m 'Tambah fitur: nama-fitur'`
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buka Pull Request

---

## 📄 Lisensi

Project ini bersifat **private** dan hak cipta dimiliki oleh tim Synthera. Dilarang mendistribusikan atau menggunakan kode ini tanpa izin tertulis.

---

<div align="center">
  <p>Dibuat dengan ❤️ oleh <strong>Tim Synthera</strong></p>
</div>
