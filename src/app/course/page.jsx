'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Search, Clock, Users, Star, BookOpen, Zap, Shield, BarChart3, Play, ChevronRight } from 'lucide-react';

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
    thumbnail: null,
    icon: <BarChart3 size={28} className="text-primary-3" />,
    color: 'from-primary-2 to-primary-1',
    badge: 'Bestseller',
    badgeColor: 'bg-amber-500/20 text-amber-400',
    instructor: 'Ahmad Rifai',
    tags: ['React', 'Node.js', 'MongoDB'],
    description: 'Kuasai full-stack development dari dasar hingga deploy menggunakan React, Node.js, dan MongoDB.',
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
    thumbnail: null,
    icon: <Zap size={28} className="text-emerald-400" />,
    color: 'from-emerald-600 to-emerald-400',
    badge: 'New',
    badgeColor: 'bg-emerald-500/20 text-emerald-400',
    instructor: 'Sari Dewi',
    tags: ['Figma', 'Prototyping', 'Research'],
    description: 'Pelajari prinsip desain modern, user research, dan prototyping profesional dengan Figma.',
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
    thumbnail: null,
    icon: <Shield size={28} className="text-blue-400" />,
    color: 'from-blue-600 to-blue-400',
    badge: 'Hot',
    badgeColor: 'bg-rose-500/20 text-rose-400',
    instructor: 'Dr. Budi Santoso',
    tags: ['Python', 'TensorFlow', 'Pandas'],
    description: 'Mulai perjalanan AI kamu dengan machine learning, neural networks, dan implementasi model nyata.',
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
    thumbnail: null,
    icon: <Users size={28} className="text-amber-400" />,
    color: 'from-amber-600 to-amber-400',
    badge: 'Bestseller',
    badgeColor: 'bg-amber-500/20 text-amber-400',
    instructor: 'Nina Kartika',
    tags: ['SEO', 'Social Media', 'Ads'],
    description: 'Strategi pemasaran digital terlengkap: SEO, SEM, social media ads, dan content marketing.',
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
    thumbnail: null,
    icon: <BookOpen size={28} className="text-cyan-400" />,
    color: 'from-cyan-600 to-cyan-400',
    badge: 'Popular',
    badgeColor: 'bg-cyan-500/20 text-cyan-400',
    instructor: 'Reza Kurniawan',
    tags: ['Flutter', 'Dart', 'Firebase'],
    description: 'Bangun aplikasi mobile cross-platform (Android & iOS) menggunakan Flutter dan Firebase.',
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
    thumbnail: null,
    icon: <Shield size={28} className="text-rose-400" />,
    color: 'from-rose-600 to-rose-400',
    badge: 'New',
    badgeColor: 'bg-emerald-500/20 text-emerald-400',
    instructor: 'Fajar Nugroho',
    tags: ['Ethical Hacking', 'Network', 'Linux'],
    description: 'Lindungi sistem dengan keahlian cybersecurity: penetration testing, network security, dan forensik digital.',
  },
];

const categories = ['Semua', 'Programming', 'Design', 'Data Science', 'Marketing', 'Security'];
const levels = ['Semua Level', 'Beginner', 'Intermediate', 'Advanced'];

function formatPrice(price) {
  return `Rp ${price.toLocaleString('id-ID')}`;
}

function CourseCard({ course }) {
  return (
    <Link
      href={`/course/${course.slug}`}
      className="group block bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden hover:border-primary-1/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(139,92,246,0.12)] transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className={`relative h-44 bg-gradient-to-br ${course.color} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
          {course.icon}
        </div>
        {/* Badge */}
        {course.badge && (
          <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${course.badgeColor} backdrop-blur-sm`}>
            {course.badge}
          </span>
        )}
        {/* Level */}
        <span className="absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-full bg-black/30 text-white backdrop-blur-sm">
          {course.level}
        </span>
        {/* Play button hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <Play size={18} className="text-white ml-1" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-primary-3 uppercase tracking-wider">
            {course.category}
          </span>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-[12px] font-semibold text-text-1">{course.rating}</span>
            <span className="text-[11px] text-text-3">({course.reviews.toLocaleString()})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-text-1 mb-2 leading-snug group-hover:text-primary-3 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-text-2 text-[12px] leading-relaxed mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {course.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-bg-3 text-text-2 font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-[11px] text-text-3 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={11} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={11} />
            <span>{course.students} siswa</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-bg-3 pt-4 flex items-center justify-between">
          <div>
            <span className="text-[17px] font-bold text-primary-3">{formatPrice(course.price)}</span>
            <span className="text-[11px] text-text-3 line-through ml-2">{formatPrice(course.originalPrice)}</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-400">
            Hemat {Math.round((1 - course.price / course.originalPrice) * 100)}%
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function CoursePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeLevel, setActiveLevel] = useState('Semua Level');

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'Semua' || c.category === activeCategory;
    const matchLevel = activeLevel === 'Semua Level' || c.level === activeLevel;
    return matchSearch && matchCategory && matchLevel;
  });

  return (
    <main className="min-h-screen bg-bg-1 text-text-1 font-sans overflow-x-hidden relative">
      <Navbar />

      {/* ─── HERO SECTION ─────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Orb background */}
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-[120px]">
          <div className="relative left-1/2 -translate-x-1/2 w-[800px] aspect-video bg-gradient-to-tr from-primary-2 to-primary-4 opacity-15 rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-primary-3 bg-primary-1/10 border border-primary-1/20 px-4 py-1.5 rounded-full mb-6">
            <BookOpen size={13} />
            {courses.length} Course Tersedia
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-1 mb-5 leading-tight">
            Tingkatkan Skill dengan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-4 via-primary-1 to-primary-3">
              Kursus Premium
            </span>
          </h1>
          <p className="text-text-2 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-10">
            Belajar dari instruktur terbaik Indonesia. Kuasai skill yang relevan dengan kebutuhan industri dan mulai karier impianmu sekarang.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" />
            <input
              id="course-search"
              type="text"
              placeholder="Cari course yang kamu butuhkan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 bg-bg-2 border border-bg-3 rounded-xl text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus:border-primary-1/50 focus:ring-1 focus:ring-primary-1/30 transition-all"
            />
          </div>
        </div>
      </section>

      {/* ─── FILTER SECTION ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[12px] font-medium px-4 py-1.5 rounded-lg transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary-1 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                    : 'bg-bg-2 border border-bg-3 text-text-2 hover:border-primary-1/30 hover:text-text-1'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level filter */}
          <div className="sm:ml-auto">
            <select
              value={activeLevel}
              onChange={(e) => setActiveLevel(e.target.value)}
              className="text-[12px] font-medium px-4 py-2 rounded-lg bg-bg-2 border border-bg-3 text-text-2 focus:outline-none focus:border-primary-1/40 cursor-pointer transition-all"
            >
              {levels.map((l) => (
                <option key={l} value={l} className="bg-bg-2">
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count */}
        <p className="text-text-3 text-[12px] mt-4">
          Menampilkan <span className="text-text-1 font-semibold">{filtered.length}</span> course
        </p>
      </section>

      {/* ─── COURSE GRID ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pb-24">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-bg-2 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-bg-3">
              <Search size={24} className="text-text-3" />
            </div>
            <h3 className="text-text-1 font-semibold mb-2">Tidak ada course ditemukan</h3>
            <p className="text-text-3 text-sm">Coba ubah kata kunci atau filter yang kamu pilih.</p>
          </div>
        )}
      </section>

      {/* ─── CTA SECTION ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <div className="relative bg-gradient-to-br from-primary-2/20 to-primary-4/10 border border-primary-1/20 rounded-3xl p-10 md:p-14 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-2/10 to-transparent rounded-3xl -z-0" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-text-1 mb-3">
              Belum menemukan course yang cocok?
            </h2>
            <p className="text-text-2 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
              Daftar sekarang dan dapatkan akses ke semua course premium Synthera dengan membership bulanan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-7 py-3 bg-primary-1 text-white text-sm font-semibold rounded-xl hover:bg-primary-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                Mulai Membership
                <ChevronRight size={16} />
              </Link>
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 px-7 py-3 bg-transparent border border-bg-3 text-text-2 text-sm font-medium rounded-xl hover:border-primary-1/30 hover:text-text-1 transition-all"
              >
                Lihat Harga
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
