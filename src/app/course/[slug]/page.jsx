'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Clock, Users, Star, BookOpen, Play, ChevronRight,
  CheckCircle, BarChart3, Shield, Zap, Award, ArrowLeft
} from 'lucide-react';
import CourseAccordion from '@/components/organisms/CourseAccordion';

const courses = [
  {
    slug: 'fullstack-web-development',
    title: 'Full-Stack Web Development',
    category: 'Programming',
    level: 'Intermediate',
    duration: '48 jam',
    students: '12.4K',
    rating: 4.9,
    reviews: 1243,
    price: 599000,
    originalPrice: 999000,
    icon: <BarChart3 size={40} className="text-white" />,
    color: 'from-primary-2 to-primary-1',
    badge: 'Bestseller',
    badgeColor: 'bg-amber-500/20 text-amber-400',
    instructor: 'Ahmad Rifai',
    instructorTitle: 'Senior Software Engineer @ Tokopedia',
    tags: ['React', 'Node.js', 'MongoDB'],
    description: 'Kuasai full-stack development dari dasar hingga deploy menggunakan React, Node.js, dan MongoDB.',
    longDescription: 'Kursus ini dirancang untuk membawa kamu dari pemula menjadi full-stack developer yang siap kerja. Kamu akan mempelajari React untuk frontend, Node.js & Express untuk backend, serta MongoDB sebagai database. Materi disusun secara sistematis dengan project nyata di setiap modul.',
    whatYouLearn: [
      'Membangun UI dinamis dengan React & Hooks',
      'REST API dengan Express.js & Node.js',
      'Database design dengan MongoDB & Mongoose',
      'Authentication & JWT Security',
      'Deploy ke cloud (Vercel & Railway)',
      'State management dengan Redux Toolkit',
    ],
    curriculum: [
      { 
        section: 'Modul 1: Fondasi JavaScript Modern', 
        lessons: 8, 
        duration: '6 jam',
        videoUrl: '#',
        description: 'Pelajari dasar-dasar JavaScript modern mulai dari variable, data types, hingga arrow functions dan ES6+ features.'
      },
      { 
        section: 'Modul 2: React dari Dasar hingga Advanced', 
        lessons: 14, 
        duration: '12 jam',
        videoUrl: '#',
        description: 'Membangun UI yang interaktif menggunakan React Hooks, Context API, dan best practices dalam pengembangan frontend.'
      },
      { 
        section: 'Modul 3: Backend dengan Node.js & Express', 
        lessons: 10, 
        duration: '10 jam',
        videoUrl: '#',
        description: 'Belajar membuat RESTful API yang aman dan scalable menggunakan Express.js dan Node.js.'
      },
      { 
        section: 'Modul 4: MongoDB & Mongoose', 
        lessons: 8, 
        duration: '8 jam',
        videoUrl: '#',
        description: 'Manajemen database NoSQL dengan MongoDB dan Mongoose untuk menyimpan data aplikasi secara efisien.'
      },
      { 
        section: 'Modul 5: Authentication & Security', 
        lessons: 6, 
        duration: '6 jam',
        videoUrl: '#',
        description: 'Implementasi JWT Authentication, hashing password, dan pengamanan API dari serangan umum.'
      },
      { 
        section: 'Modul 6: Deploy & CI/CD', 
        lessons: 6, 
        duration: '6 jam',
        videoUrl: '#',
        description: 'Proses deployment aplikasi ke cloud service seperti Vercel and Railway dengan CI/CD pipeline.'
      },
    ],
  },
  {
    slug: 'ui-ux-design-mastery',
    title: 'UI/UX Design Mastery',
    category: 'Design',
    level: 'Beginner',
    duration: '32 jam',
    students: '8.7K',
    rating: 4.8,
    reviews: 876,
    price: 449000,
    originalPrice: 799000,
    icon: <Zap size={40} className="text-white" />,
    color: 'from-emerald-600 to-emerald-400',
    badge: 'New',
    badgeColor: 'bg-emerald-500/20 text-emerald-400',
    instructor: 'Sari Dewi',
    instructorTitle: 'Lead UI/UX Designer @ Gojek',
    tags: ['Figma', 'Prototyping', 'Research'],
    description: 'Pelajari prinsip desain modern, user research, dan prototyping profesional dengan Figma.',
    longDescription: 'Mulai karier desainmu dari nol. Kursus ini mengajarkan seluruh proses desain produk digital: dari riset pengguna, wireframing, hingga prototyping dan handoff ke developer menggunakan Figma.',
    whatYouLearn: [
      'Prinsip dasar UI & UX design',
      'User research & persona creation',
      'Wireframing & information architecture',
      'Prototyping interaktif di Figma',
      'Design system & komponen reusable',
      'Usability testing & iterasi',
    ],
    curriculum: [
      { 
        section: 'Modul 1: Dasar-dasar UX Design', 
        lessons: 6, 
        duration: '4 jam',
        videoUrl: '#',
        description: 'Memahami dasar-dasar User Experience dan mengapa itu sangat penting dalam produk digital.'
      },
      { 
        section: 'Modul 2: User Research & Personas', 
        lessons: 8, 
        duration: '6 jam',
        videoUrl: '#',
        description: 'Teknik melakukan riset pengguna dan membuat user persona yang akurat.'
      },
      { 
        section: 'Modul 3: Wireframing & Lo-fi Prototyping', 
        lessons: 8, 
        duration: '7 jam',
        videoUrl: '#',
        description: 'Membuat kerangka aplikasi (wireframe) dan prototype dengan fidelitas rendah.'
      },
      { 
        section: 'Modul 4: UI Design dengan Figma', 
        lessons: 10, 
        duration: '9 jam',
        videoUrl: '#',
        description: 'Implementasi visual design, typography, dan color theory menggunakan Figma.'
      },
      { 
        section: 'Modul 5: Usability Testing', 
        lessons: 6, 
        duration: '6 jam',
        videoUrl: '#',
        description: 'Menguji hasil desain ke pengguna nyata dan melakukan iterasi berdasarkan feedback.'
      },
    ],
  },
  {
    slug: 'machine-learning-fundamentals',
    title: 'Machine Learning Fundamentals',
    category: 'Data Science',
    level: 'Advanced',
    duration: '60 jam',
    students: '5.2K',
    rating: 4.9,
    reviews: 621,
    price: 799000,
    originalPrice: 1299000,
    icon: <Shield size={40} className="text-white" />,
    color: 'from-blue-600 to-blue-400',
    badge: 'Hot',
    badgeColor: 'bg-rose-500/20 text-rose-400',
    instructor: 'Dr. Budi Santoso',
    instructorTitle: 'AI Researcher @ BRIN',
    tags: ['Python', 'TensorFlow', 'Pandas'],
    description: 'Mulai perjalanan AI kamu dengan machine learning, neural networks, dan implementasi model nyata.',
    longDescription: 'Kursus komprehensif yang mencakup teori dan praktik machine learning dari regresi linier hingga deep learning. Cocok untuk siapa saja yang ingin berkarier di bidang AI/ML dengan pendekatan hands-on menggunakan Python dan TensorFlow.',
    whatYouLearn: [
      'Matematika dasar untuk ML (Linear Algebra & Statistics)',
      'Supervised & Unsupervised Learning',
      'Neural Networks & Deep Learning',
      'Computer Vision dengan CNN',
      'NLP & Text Classification',
      'Model deployment dengan FastAPI',
    ],
    curriculum: [
      { 
        section: 'Modul 1: Python untuk Data Science', 
        lessons: 8, 
        duration: '8 jam',
        videoUrl: '#',
        description: 'Pengenalan Python, NumPy, dan Pandas untuk manipulasi data.'
      },
      { 
        section: 'Modul 2: Statistik & Eksplorasi Data', 
        lessons: 8, 
        duration: '8 jam',
        videoUrl: '#',
        description: 'Dasar statistik dan Exploratory Data Analysis (EDA) untuk memahami data.'
      },
      { 
        section: 'Modul 3: Supervised Learning', 
        lessons: 10, 
        duration: '12 jam',
        videoUrl: '#',
        description: 'Implementasi algoritma regresi dan klasifikasi.'
      },
      { 
        section: 'Modul 4: Neural Networks', 
        lessons: 10, 
        duration: '14 jam',
        videoUrl: '#',
        description: 'Membangun arsitektur neural network dasar menggunakan TensorFlow.'
      },
      { 
        section: 'Modul 5: Deep Learning Projects', 
        lessons: 8, 
        duration: '10 jam',
        videoUrl: '#',
        description: 'Studi kasus pengenalan gambar dan klasifikasi teks.'
      },
      { 
        section: 'Modul 6: Deployment', 
        lessons: 6, 
        duration: '8 jam',
        videoUrl: '#',
        description: 'Cara deploy model ML ke production menggunakan FastAPI.'
      },
    ],
  },
  {
    slug: 'digital-marketing-pro',
    title: 'Digital Marketing Pro',
    category: 'Marketing',
    level: 'Beginner',
    duration: '24 jam',
    students: '15.1K',
    rating: 4.7,
    reviews: 1876,
    price: 349000,
    originalPrice: 599000,
    icon: <Users size={40} className="text-white" />,
    color: 'from-amber-600 to-amber-400',
    badge: 'Bestseller',
    badgeColor: 'bg-amber-500/20 text-amber-400',
    instructor: 'Nina Kartika',
    instructorTitle: 'Digital Marketing Lead @ Shopee',
    tags: ['SEO', 'Social Media', 'Ads'],
    description: 'Strategi pemasaran digital terlengkap: SEO, SEM, social media ads, dan content marketing.',
    longDescription: 'Pelajari semua strategi digital marketing yang digunakan brand-brand besar. Dari SEO organik hingga paid ads, kamu akan belajar cara membuat campaign yang efektif dan mengukur hasilnya.',
    whatYouLearn: [
      'Strategi SEO on-page & off-page',
      'Google Ads & Meta Ads',
      'Content marketing & copywriting',
      'Email marketing automation',
      'Social media management',
      'Analytics & reporting dengan GA4',
    ],
    curriculum: [
      { 
        section: 'Modul 1: Fondasi Digital Marketing', 
        lessons: 6, 
        duration: '4 jam',
        videoUrl: '#',
        description: 'Memahami ekosistem digital marketing dan customer journey.'
      },
      { 
        section: 'Modul 2: SEO & Content Strategy', 
        lessons: 8, 
        duration: '6 jam',
        videoUrl: '#',
        description: 'Optimasi mesin pencari dan pembuatan konten yang menjual.'
      },
      { 
        section: 'Modul 3: Paid Advertising', 
        lessons: 8, 
        duration: '7 jam',
        videoUrl: '#',
        description: 'Beriklan secara efektif di Google Ads dan Facebook/Instagram Ads.'
      },
      { 
        section: 'Modul 4: Social Media Marketing', 
        lessons: 6, 
        duration: '5 jam',
        videoUrl: '#',
        description: 'Manajemen brand di berbagai platform media sosial.'
      },
      { 
        section: 'Modul 5: Analytics & Optimization', 
        lessons: 4, 
        duration: '2 jam',
        videoUrl: '#',
        description: 'Membaca data analitik untuk meningkatkan performa campaign.'
      },
    ],
  },
  {
    slug: 'mobile-app-flutter',
    title: 'Mobile App dengan Flutter',
    category: 'Programming',
    level: 'Intermediate',
    duration: '40 jam',
    students: '6.8K',
    rating: 4.8,
    reviews: 754,
    price: 549000,
    originalPrice: 899000,
    icon: <BookOpen size={40} className="text-white" />,
    color: 'from-cyan-600 to-cyan-400',
    badge: 'Popular',
    badgeColor: 'bg-cyan-500/20 text-cyan-400',
    instructor: 'Reza Kurniawan',
    instructorTitle: 'Mobile Engineer @ Traveloka',
    tags: ['Flutter', 'Dart', 'Firebase'],
    description: 'Bangun aplikasi mobile cross-platform (Android & iOS) menggunakan Flutter dan Firebase.',
    longDescription: 'Flutter memungkinkan kamu membangun aplikasi Android dan iOS sekaligus dari satu codebase. Kursus ini mengajarkan Dart, widget system Flutter, state management, and integrasi Firebase untuk backend.',
    whatYouLearn: [
      'Dasar-dasar bahasa Dart',
      'Widget tree & layout system Flutter',
      'State management dengan Provider & Riverpod',
      'Navigasi & routing',
      'Integrasi Firebase (Auth, Firestore, Storage)',
      'Publish ke Play Store & App Store',
    ],
    curriculum: [
      { 
        section: 'Modul 1: Dart Programming', 
        lessons: 8, 
        duration: '6 jam',
        videoUrl: '#',
        description: 'Dasar-dasar bahasa pemrograman Dart untuk Flutter.'
      },
      { 
        section: 'Modul 2: Flutter Widgets & Layout', 
        lessons: 10, 
        duration: '10 jam',
        videoUrl: '#',
        description: 'Memahami widget tree dan cara membangun layout yang responsif.'
      },
      { 
        section: 'Modul 3: State Management', 
        lessons: 8, 
        duration: '8 jam',
        videoUrl: '#',
        description: 'Mengelola state aplikasi dengan Provider atau Riverpod.'
      },
      { 
        section: 'Modul 4: Firebase Integration', 
        lessons: 8, 
        duration: '8 jam',
        videoUrl: '#',
        description: 'Koneksi ke backend Firebase untuk database dan auth.'
      },
      { 
        section: 'Modul 5: Publishing', 
        lessons: 4, 
        duration: '4 jam',
        videoUrl: '#',
        description: 'Langkah-langkah merilis aplikasi ke Play Store dan App Store.'
      },
    ],
  },
  {
    slug: 'cybersecurity-essentials',
    title: 'Cybersecurity Essentials',
    category: 'Security',
    level: 'Intermediate',
    duration: '36 jam',
    students: '3.9K',
    rating: 4.9,
    reviews: 432,
    price: 699000,
    originalPrice: 1199000,
    icon: <Shield size={40} className="text-white" />,
    color: 'from-rose-600 to-rose-400',
    badge: 'New',
    badgeColor: 'bg-emerald-500/20 text-emerald-400',
    instructor: 'Fajar Nugroho',
    instructorTitle: 'Security Engineer @ BCA Digital',
    tags: ['Ethical Hacking', 'Network', 'Linux'],
    description: 'Lindungi sistem dengan keahlian cybersecurity: penetration testing, network security, dan forensik digital.',
    longDescription: 'Pelajari cybersecurity dari sudut pandang offensive dan defensive. Kamu akan mempraktikkan ethical hacking, analisis vulnerability, network security, dan digital forensics menggunakan tools industri nyata.',
    whatYouLearn: [
      'Dasar jaringan & protokol (TCP/IP, HTTP)',
      'Linux command line untuk security',
      'Vulnerability scanning & assessment',
      'Web application penetration testing',
      'Network security & firewall',
      'Incident response & forensics',
    ],
    curriculum: [
      { 
        section: 'Modul 1: Fondasi Networking & Linux', 
        lessons: 8, 
        duration: '6 jam',
        videoUrl: '#',
        description: 'Pemahaman mendalam tentang jaringan dan sistem operasi Linux.'
      },
      { 
        section: 'Modul 2: Recon & OSINT', 
        lessons: 6, 
        duration: '5 jam',
        videoUrl: '#',
        description: 'Teknik pengumpulan informasi dan intelijen sumber terbuka.'
      },
      { 
        section: 'Modul 3: Web App Pentesting', 
        lessons: 10, 
        duration: '10 jam',
        videoUrl: '#',
        description: 'Mencari celah keamanan pada aplikasi berbasis web.'
      },
      { 
        section: 'Modul 4: Network Security', 
        lessons: 8, 
        duration: '8 jam',
        videoUrl: '#',
        description: 'Mengamankan infrastruktur jaringan dari berbagai ancaman.'
      },
      { 
        section: 'Modul 5: Forensics & Incident Response', 
        lessons: 6, 
        duration: '7 jam',
        videoUrl: '#',
        description: 'Analisis serangan dan langkah penanganan insiden keamanan.'
      },
    ],
  },
];

function formatPrice(price) {
  return `Rp ${price.toLocaleString('id-ID')}`;
}

export default function CourseDetailPage({ params }) {
  const { slug } = use(params);
  const course = courses.find((c) => c.slug === slug);

  if (!course) return notFound();

  const totalLessons = course.curriculum.reduce((sum, s) => sum + s.lessons, 0);
  const discount = Math.round((1 - course.price / course.originalPrice) * 100);

  return (
    <main className="min-h-screen bg-bg-1 text-text-1 font-sans overflow-x-hidden">
      <Navbar />

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section className={`relative pt-28 pb-16 bg-gradient-to-br ${course.color} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-1 via-transparent to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-[12px] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/course" className="hover:text-white transition-colors">Course</Link>
            <ChevronRight size={12} />
            <span className="text-white/90 truncate max-w-[200px]">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left: Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/15 text-white px-3 py-1 rounded-full border border-white/20">
                  {course.category}
                </span>
                {course.badge && (
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${course.badgeColor}`}>
                    {course.badge}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                {course.title}
              </h1>

              <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-2xl">
                {course.longDescription}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-5 text-[13px] text-white/70 mb-6">
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{course.rating}</span>
                  <span>({course.reviews.toLocaleString()} ulasan)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={14} />
                  <span>{course.students} siswa</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen size={14} />
                  <span>{totalLessons} pelajaran</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award size={14} />
                  <span>Level: {course.level}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm border border-white/30">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{course.instructor}</p>
                  <p className="text-white/60 text-[11px]">{course.instructorTitle}</p>
                </div>
              </div>
            </div>

            {/* Right: Pricing card (desktop) */}
            <div className="hidden lg:block">
              <div className="bg-bg-2/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-24">
                <div className="mb-5">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl font-extrabold text-primary-3">{formatPrice(course.price)}</span>
                    <span className="text-sm text-text-3 line-through">{formatPrice(course.originalPrice)}</span>
                  </div>
                  <span className="text-[12px] font-semibold text-emerald-400">Hemat {discount}% — Penawaran terbatas!</span>
                </div>

                <button className="w-full py-3.5 bg-primary-1 hover:bg-primary-2 text-white font-semibold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.02] mb-3 flex items-center justify-center gap-2">
                  <Play size={16} />
                  Beli Course Sekarang
                </button>
                <Link
                  href="/register"
                  className="w-full py-3 border border-primary-1/30 text-primary-3 font-medium text-sm rounded-xl transition-all hover:bg-primary-1/10 flex items-center justify-center gap-2"
                >
                  Coba dengan Membership
                </Link>

                <ul className="mt-5 space-y-2.5 text-[12px] text-text-2">
                  {[
                    `${totalLessons} pelajaran video`,
                    `${course.duration} konten on-demand`,
                    'Akses seumur hidup',
                    'Sertifikat kelulusan',
                    'Download materi & source code',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BODY ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-10">

          {/* What you'll learn */}
          <div className="bg-bg-2 border border-bg-3 rounded-2xl p-7">
            <h2 className="text-lg font-bold text-text-1 mb-5">Apa yang akan kamu pelajari</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.whatYouLearn.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-text-2">
                  <CheckCircle size={15} className="text-primary-3 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div>
            <h2 className="text-lg font-bold text-text-1 mb-5">Kurikulum</h2>
            <CourseAccordion curriculum={course.curriculum} />
          </div>

          {/* Tags */}
          <div>
            <h2 className="text-lg font-bold text-text-1 mb-4">Topik yang diajarkan</h2>
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span key={tag} className="text-sm px-4 py-1.5 rounded-lg bg-primary-1/10 text-primary-3 border border-primary-1/20 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing card mobile & sticky desktop */}
        <div className="lg:hidden">
          <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6">
            <div className="mb-5">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-2xl font-extrabold text-primary-3">{formatPrice(course.price)}</span>
                <span className="text-sm text-text-3 line-through">{formatPrice(course.originalPrice)}</span>
              </div>
              <span className="text-[12px] font-semibold text-emerald-400">Hemat {discount}%</span>
            </div>
            <button className="w-full py-3.5 bg-primary-1 hover:bg-primary-2 text-white font-semibold text-sm rounded-xl transition-all mb-3 flex items-center justify-center gap-2">
              <Play size={16} />
              Beli Course Sekarang
            </button>
            <Link
              href="/register"
              className="w-full py-3 border border-primary-1/30 text-primary-3 font-medium text-sm rounded-xl transition-all hover:bg-primary-1/10 flex items-center justify-center gap-2"
            >
              Coba dengan Membership
            </Link>
          </div>
        </div>

        {/* Back button */}
        <div className="lg:col-span-2">
          <Link
            href="/course"
            className="inline-flex items-center gap-2 text-sm text-text-2 hover:text-primary-3 transition-colors"
          >
            <ArrowLeft size={15} />
            Kembali ke semua course
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
