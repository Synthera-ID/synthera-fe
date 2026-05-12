"use client";

import { useState } from "react";
import { ChevronDown, Play, FileText, Clock, CheckCircle2 } from "lucide-react";

export default function CourseAccordion({ sections }) {
  const [openSections, setOpenSections] = useState([0]); // Open first section by default

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const isOpen = openSections.includes(idx);
        return (
          <div 
            key={idx} 
            className={`border border-[#1A1A24] rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-[#13131A]/50 border-primary-1/30" : "bg-[#0D0D12] hover:border-[#2D2D3A]"}`}
          >
            {/* Header */}
            <button
              onClick={() => toggleSection(idx)}
              className="w-full px-6 py-5 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold transition-colors ${isOpen ? "bg-primary-1 text-white" : "bg-[#13131A] text-[#6B7280] group-hover:text-white"}`}>
                  {idx + 1}
                </div>
                <div className="text-left">
                  <h3 className={`text-[14px] font-bold transition-colors ${isOpen ? "text-white" : "text-[#9CA3AF] group-hover:text-white"}`}>
                    {section.section}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-[#6B7280]">
                    <span className="flex items-center gap-1"><Clock size={12} /> {section.duration}</span>
                    <span className="flex items-center gap-1"><Play size={12} /> {section.lessons} Lessons</span>
                  </div>
                </div>
              </div>
              <ChevronDown size={18} className={`text-[#6B7280] transition-transform duration-300 ${isOpen ? "rotate-180 text-primary-3" : ""}`} />
            </button>

            {/* Content */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="px-6 pb-6 pt-2 space-y-4">
                <div className="h-[1px] bg-[#1A1A24] w-full mb-4" />
                
                {/* Mock Lessons */}
                {[1, 2].map((lesson) => (
                  <div key={lesson} className="flex flex-col gap-3 p-4 rounded-xl bg-[#0D0D12] border border-[#1A1A24] hover:border-primary-1/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-1/10 flex items-center justify-center text-primary-3">
                          <Play size={14} fill="currentColor" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-white">Lesson {lesson}: Introduction to the Topic</p>
                          <p className="text-[11px] text-[#6B7280]">Video Content • 12:45 mins</p>
                        </div>
                      </div>
                      <CheckCircle2 size={16} className="text-[#1A1A24]" />
                    </div>
                    
                    <div className="pl-11 border-l border-[#1A1A24] ml-4 mt-1">
                      <p className="text-[12px] text-[#9CA3AF] leading-relaxed">
                        In this lesson, we will cover the fundamental concepts and prepare the environment for the upcoming modules.
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <button className="text-[11px] font-bold text-primary-3 hover:text-primary-1 flex items-center gap-1.5 transition-colors">
                          <FileText size={12} /> View Resources
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
