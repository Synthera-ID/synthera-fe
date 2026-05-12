'use client';

import React, { useState } from 'react';
import { ChevronDown, Play, FileText, Clock } from 'lucide-react';

const CourseAccordion = ({ curriculum }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {curriculum.map((item, index) => (
        <div 
          key={index} 
          className={`border rounded-2xl overflow-hidden transition-all duration-500 ${
            openIndex === index 
              ? 'border-primary-1 bg-bg-2 shadow-[0_10px_30px_-10px_rgba(139,92,246,0.2)]' 
              : 'border-bg-3 bg-bg-2/50 hover:border-primary-1/30 hover:bg-bg-2 shadow-sm'
          }`}
        >
          <button
            onClick={() => toggle(index)}
            className="w-full flex items-center justify-between p-5 text-left focus:outline-none group relative"
          >
            {/* Active Highlight Line */}
            {openIndex === index && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-1 animate-in fade-in duration-700" />
            )}

            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                openIndex === index 
                  ? 'bg-primary-1 text-white scale-110 shadow-lg shadow-primary-1/40' 
                  : 'bg-primary-1/10 text-primary-3 group-hover:bg-primary-1/20'
              }`}>
                {index + 1}
              </div>
              <div>
                <h3 className={`font-semibold transition-all duration-500 ${
                  openIndex === index ? 'text-primary-3 translate-x-1' : 'text-text-1 group-hover:text-primary-3'
                }`}>
                  {item.section}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-text-3">
                  <span className="flex items-center gap-1.5"><Play size={12} className={openIndex === index ? 'text-primary-3' : ''} /> {item.lessons} Pelajaran</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} /> {item.duration}</span>
                </div>
              </div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
              openIndex === index ? 'bg-primary-1/10 text-primary-3' : 'text-text-3 group-hover:bg-primary-1/5'
            }`}>
              <ChevronDown 
                size={18} 
                className={`transition-transform duration-500 ${openIndex === index ? 'rotate-180' : ''}`} 
              />
            </div>
          </button>

          <div 
            className={`transition-all duration-700 ease-in-out overflow-hidden ${
              openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-6 pt-2 bg-gradient-to-b from-transparent to-primary-1/[0.02]">
              <div className="space-y-6 pt-4 border-t border-bg-3">
                {/* Video Placeholder */}
                {item.videoUrl && (
                  <div className="aspect-video w-full rounded-2xl bg-black overflow-hidden relative group/video shadow-xl border border-white/5 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-1/20 to-transparent opacity-30 group-hover/video:opacity-50 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary-1 animate-ping opacity-20" />
                        <div className="w-16 h-16 rounded-full bg-primary-1 flex items-center justify-center text-white shadow-[0_0_30px_rgba(139,92,246,0.6)] transform group-hover/video:scale-110 transition-all duration-500 relative z-10">
                          <Play size={28} fill="currentColor" className="ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                      <div className="text-white text-[11px] font-medium bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                        Preview: {item.section}
                      </div>
                      <div className="text-white/60 text-[10px] font-medium">
                        Klik untuk memutar
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-1/10 flex items-center justify-center text-primary-3">
                      <FileText size={16} />
                    </div>
                    <h4 className="text-[12px] font-bold uppercase tracking-widest text-text-2">Penjelasan Materi</h4>
                  </div>
                  <div className="text-sm text-text-2 leading-relaxed bg-bg-1/50 backdrop-blur-sm p-5 rounded-2xl border border-bg-3 shadow-inner">
                    {item.description || "Kuasai materi ini dengan penjelasan mendalam dan studi kasus nyata."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseAccordion;
