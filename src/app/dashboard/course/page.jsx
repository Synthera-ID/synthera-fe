"use client";

import { BookOpen, Search, Filter, Play } from "lucide-react";
import Image from "next/image";

const COURSES = [
  {
    id: 1,
    title: "Modern Web Development with Next.js",
    description: "Learn how to build high-performance web applications using Next.js and TailwindCSS.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    category: "Development",
    status: "In Progress",
    progress: 65,
  },
  {
    id: 2,
    title: "AI Engineering Fundamentals",
    description: "A comprehensive guide to integrating LLMs and building AI-powered tools.",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
    category: "AI",
    status: "Not Started",
    progress: 0,
  },
  {
    id: 3,
    title: "UI/UX Design for SaaS",
    description: "Master the art of creating beautiful and functional interfaces for modern software.",
    thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&auto=format&fit=crop&q=60",
    category: "Design",
    status: "Completed",
    progress: 100,
  },
];

export default function CoursePage() {
  return (
    <>
      <header className="mb-10">
        <h1 className="text-[28px] font-bold mb-2">Courses</h1>
        <p className="text-text-2 text-sm">Expand your knowledge with our curated learning paths.</p>
      </header>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3 group-focus-within:text-primary-1 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="w-full bg-bg-2 border border-bg-3 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary-1/50 focus:ring-4 focus:ring-primary-1/5 transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-bg-2 border border-bg-3 rounded-2xl text-sm font-medium hover:border-primary-1/40 hover:bg-primary-1/5 transition-all">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
}

function CourseCard({ course }) {
  return (
    <div className="bg-bg-2 border border-bg-3 rounded-3xl overflow-hidden group hover:border-primary-1/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
          <button className="w-14 h-14 bg-primary-1 text-white rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
            <Play size={24} fill="currentColor" className="ml-1" />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-bg-1/90 backdrop-blur-md border border-white/10 rounded-xl text-[11px] font-bold text-text-1 uppercase tracking-wider">
            {course.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-text-1 mb-2 group-hover:text-primary-1 transition-colors">{course.title}</h3>
        <p className="text-text-3 text-[13px] leading-relaxed mb-6 line-clamp-2">{course.description}</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
            <span className={course.status === 'Completed' ? 'text-emerald-500' : 'text-primary-1'}>
              {course.status}
            </span>
            <span className="text-text-3">{course.progress}%</span>
          </div>
          <div className="h-2 bg-bg-3 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${course.status === 'Completed' ? 'bg-emerald-500' : 'bg-primary-1'}`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
