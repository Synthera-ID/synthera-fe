"use client";

import { useState } from "react";
import { ChevronDown, Play, FileText, Lock, CheckCircle2 } from "lucide-react";

export default function CourseAccordion({ sections }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {sections.map((section, index) => {
        const isOpen = openIndex === index;
        
        return (
          <div
            key={index}
            className={`bg-[#0D0D12] border transition-all duration-300 rounded-2xl overflow-hidden ${
              isOpen ? "border-primary-1/30 shadow-[0_8px_32px_rgba(139,92,246,0.1)]" : "border-[#1A1A24] hover:border-[#2D2D3A]"
            }`}
          >
            {/* Section Header */}
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isOpen ? "bg-primary-1 text-white" : "bg-[#13131A] text-[#6B7280]"
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className={`font-bold transition-all duration-300 ${isOpen ? "text-white" : "text-[#9CA3AF] group-hover:text-white"}`}>
                    {section.section}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <Play size={10} /> {section.lessons} Pelajaran
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={10} /> {section.duration}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronDown
                size={20}
                className={`text-[#6B7280] transition-transform duration-300 ${isOpen ? "rotate-180 text-primary-3" : ""}`}
              />
            </button>

            {/* Section Content */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-6 pt-2 space-y-2">
                {/* Mocked Lessons within section */}
                {[...Array(section.lessons)].map((_, i) => (
                  <div
                    key={i}
                    className="group/lesson flex items-center justify-between p-3.5 rounded-xl hover:bg-[#13131A] transition-all cursor-pointer border border-transparent hover:border-[#1A1A24]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#13131A] group-hover/lesson:bg-primary-1/10 flex items-center justify-center text-[#6B7280] group-hover/lesson:text-primary-3 transition-all">
                        {i === 0 ? <Play size={14} /> : <Lock size={14} className="opacity-50" />}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[#9CA3AF] group-hover/lesson:text-white transition-all">
                          {i === 0 ? "Introduction & Setup" : `Lesson ${i + 1}: Deep Dive Topic`}
                        </p>
                        <p className="text-[11px] text-[#6B7280]">Video - 12:45</p>
                      </div>
                    </div>
                    {i === 0 ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        PREVIEW
                      </span>
                    ) : (
                      <Lock size={14} className="text-[#6B7280]" />
                    )}
                  </div>
                ))}
                
                {/* Material explanation placeholder */}
                <div className="mt-4 p-4 rounded-xl bg-primary-1/5 border border-primary-1/10">
                  <h4 className="text-[12px] font-bold text-primary-3 uppercase tracking-wider mb-2">Penjelasan Materi</h4>
                  <p className="text-[13px] text-[#9CA3AF] leading-relaxed">
                    Modul ini membahas konsep dasar secara mendalam dengan contoh kasus nyata. Anda akan mempelajari best practices dan cara implementasi yang efisien.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
