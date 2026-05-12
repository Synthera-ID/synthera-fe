"use client";

import { BookOpen, Play, Clock, Star, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

const ENROLLED_COURSES = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    progress: 65,
    lastLesson: "React Hooks Deep Dive",
    thumbnail: "bg-gradient-to-br from-primary-2 to-primary-1",
    slug: "fullstack-web-development",
  },
  {
    id: 2,
    title: "UI/UX Design Mastery",
    progress: 30,
    lastLesson: "Prototyping in Figma",
    thumbnail: "bg-gradient-to-br from-emerald-600 to-emerald-400",
    slug: "ui-ux-design-mastery",
  },
];

export default function DashboardCoursePage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <BookOpen className="text-primary-3" size={28} />
          My Courses
        </h1>
        <p className="text-[#9CA3AF] text-sm">Continue your learning journey and track your progress.</p>
      </header>

      {/* Enrolled Courses */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">Enrolled Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ENROLLED_COURSES.map((course) => (
            <div key={course.id} className="bg-[#0D0D12] border border-[#1A1A24] rounded-2xl overflow-hidden hover:border-primary-1/30 transition-all group">
              <div className={`h-32 ${course.thumbnail} relative`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-3 left-4 text-white font-bold drop-shadow-md">
                  {course.title}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] text-[#9CA3AF]">Progress: {course.progress}%</span>
                  <span className="text-[11px] font-bold text-primary-3">In Progress</span>
                </div>
                <div className="w-full h-1.5 bg-[#13131A] rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-primary-1 rounded-full transition-all duration-500" 
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <div className="text-[12px] text-[#6B7280] mb-5">
                  Last lesson: <span className="text-white font-medium">{course.lastLesson}</span>
                </div>
                <Link 
                  href={`/course/${course.slug}`}
                  className="w-full py-2.5 bg-primary-1/10 border border-primary-1/20 text-primary-3 font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 hover:bg-primary-1/20 transition-all"
                >
                  <Play size={14} /> Continue Learning
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended for You */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Recommended for You</h2>
          <Link href="/course" className="text-primary-3 text-sm font-bold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#0D0D12] border border-[#1A1A24] p-4 rounded-2xl hover:border-bg-4 transition-all group">
              <div className="w-full aspect-video bg-[#13131A] rounded-xl mb-4 flex items-center justify-center">
                 <Trophy size={24} className="text-[#2D2D3A] group-hover:text-primary-3 transition-colors" />
              </div>
              <h3 className="font-bold text-white text-[14px] mb-2 line-clamp-1">Advanced AI Strategies</h3>
              <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
                <span className="flex items-center gap-1"><Clock size={12} /> 12h 45m</span>
                <span className="flex items-center gap-1 text-amber-400"><Star size={12} className="fill-amber-400" /> 4.9</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
