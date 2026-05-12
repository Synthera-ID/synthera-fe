"use client";

import { useState } from "react";
import { BookOpen, Search, Play, Clock, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const MY_COURSES = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    progress: 45,
    lastAccessed: "2 hours ago",
    thumbnail: "from-primary-2 to-primary-1",
    slug: "fullstack-web-development",
  },
  {
    id: 2,
    title: "UI/UX Design Mastery",
    progress: 12,
    lastAccessed: "1 day ago",
    thumbnail: "from-emerald-600 to-emerald-400",
    slug: "ui-ux-design-mastery",
  },
];

export default function MyCoursesPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <BookOpen className="text-primary-3" size={28} />
          My Courses
        </h1>
        <p className="text-[#9CA3AF] text-sm">Continue your learning journey where you left off.</p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MY_COURSES.map((course) => (
          <div key={course.id} className="bg-[#0D0D12] border border-[#1A1A24] rounded-2xl overflow-hidden group hover:border-primary-1/30 transition-all duration-300 shadow-xl">
            {/* Thumbnail */}
            <div className={`h-32 bg-gradient-to-br ${course.thumbnail} flex items-center justify-center`}>
              <Play size={24} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-white text-[15px] mb-4 group-hover:text-primary-3 transition-colors">
                {course.title}
              </h3>
              
              {/* Progress */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#6B7280]">Course Progress</span>
                  <span className="text-primary-3 font-bold">{course.progress}%</span>
                </div>
                <div className="h-1.5 bg-[#13131A] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-1 rounded-full transition-all duration-500" 
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-[#1A1A24]">
                <span className="text-[11px] text-[#6B7280]">Last seen {course.lastAccessed}</span>
                <Link 
                  href={`/course/${course.slug}`}
                  className="text-primary-3 hover:text-primary-1 font-bold text-[12px] flex items-center gap-1 group/link"
                >
                  Continue <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Browse More Card */}
        <Link 
          href="/course"
          className="bg-[#0D0D12]/50 border-2 border-dashed border-[#1A1A24] rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-primary-1/30 hover:bg-primary-1/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-[#13131A] flex items-center justify-center text-[#6B7280] group-hover:bg-primary-1/20 group-hover:text-primary-3 transition-all">
            <PlusIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Browse More Courses</p>
            <p className="text-[11px] text-[#6B7280] mt-1">Explore our entire library of premium content</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function PlusIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
