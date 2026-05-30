"use client";

import { useState, useMemo } from "react";
import { Search, Lock, CheckCircle, Play, Clock, Layers, BookOpen, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import DUMMY_COURSES from "./dummyCourses";
import CustomVideoPlayer from "@/components/organisms/CustomVideoPlayer";

// ─── Tier config ──────────────────────────────────────────────────────────────
const TIER_ORDER = { basic: 0, pro: 1, exclusive: 2 };

const TIER_BADGE = {
  basic:     { label: "Basic",     bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  pro:       { label: "Pro",       bg: "bg-primary-1/10",   text: "text-primary-3",   border: "border-primary-1/20" },
  exclusive: { label: "Exclusive", bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20" },
};

// ─── Helper: apakah user boleh akses course ini? ──────────────────────────────
function canAccess(userTier, courseMinTier) {
  const u = TIER_ORDER[userTier?.toLowerCase()] ?? 0;
  const c = TIER_ORDER[courseMinTier?.toLowerCase()] ?? 0;
  return u >= c;
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────
const FILTERS = ["All", "Basic", "Pro", "Exclusive"];

// ─── Category color map ───────────────────────────────────────────────────────
const CAT_COLORS = {
  "AI Fundamentals":  { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20" },
  "Machine Learning": { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20" },
  "Prompt Engineering": { bg: "bg-cyan-500/10",  text: "text-cyan-400",    border: "border-cyan-500/20" },
  "Computer Vision":  { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/20" },
  "Generative AI":    { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20" },
};

function getCatStyle(name) {
  return CAT_COLORS[name] ?? { bg: "bg-bg-3", text: "text-text-3", border: "border-bg-3" };
}

// ─── Video embed URL helper ───────────────────────────────────────────────────
function toEmbedUrl(url) {
  if (!url) return null;
  // Sudah embed URL
  if (url.includes("embed")) return url;
  // YouTube watch URL
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return url;
}

// ─── Course Card (compact horizontal) ────────────────────────────────────────
function CourseCard({ course, userTier, isSelected, onClick }) {
  const accessible = canAccess(userTier, course.min_tier);
  const tierBadge  = TIER_BADGE[course.min_tier] ?? TIER_BADGE.basic;
  const catStyle   = getCatStyle(course.category?.name);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border transition-all duration-200 overflow-hidden group flex items-stretch ${
        isSelected
          ? "border-primary-1/50 bg-primary-1/5 shadow-[0_0_16px_rgba(139,92,246,0.12)]"
          : "border-bg-3 bg-bg-2 hover:border-primary-1/25"
      }`}
    >
      {/* ── Square thumbnail (left) ── */}
      <div className="relative w-[88px] min-h-[88px] flex-shrink-0 overflow-hidden rounded-l-2xl">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-primary-1/10 flex items-center justify-center">
            <BookOpen size={22} className="text-primary-3 opacity-40" />
          </div>
        )}

        {/* Lock overlay */}
        {!accessible && (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex items-center justify-center">
            <Lock size={16} className="text-white/80" />
          </div>
        )}

        {/* Playing indicator */}
        {isSelected && accessible && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-primary-1/90 flex items-center justify-center shadow">
              <Play size={11} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
        )}

        {/* Active left accent line */}
        {isSelected && (
          <div className="absolute inset-y-0 left-0 w-[3px] bg-primary-3" />
        )}
      </div>

      {/* ── Content (right) ── */}
      <div className="flex-1 min-w-0 px-3.5 py-3 flex flex-col justify-between">
        {/* Badges */}
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-[2px] rounded border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
            {course.category?.name}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-[2px] rounded border ${tierBadge.bg} ${tierBadge.text} ${tierBadge.border}`}>
            {tierBadge.label}
          </span>
        </div>

        {/* Title */}
        <h3 className={`text-[12px] font-bold leading-snug line-clamp-2 mb-2 ${
          isSelected ? "text-primary-3" : "text-text-1"
        }`}>
          {course.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-2.5 text-[10px] text-text-3">
          <span className="flex items-center gap-1"><Layers size={9} /> {course.total_sections} sesi</span>
          <span className="flex items-center gap-1"><Clock size={9} /> {course.duration}</span>
        </div>
      </div>
    </button>
  );
}

// ─── Video Player ─────────────────────────────────────────────────────────────
function VideoPlayer({ course, accessible }) {
  if (!accessible) {
    const tierBadge = TIER_BADGE[course.min_tier] ?? TIER_BADGE.pro;
    return (
      <div className="w-full aspect-video rounded-2xl bg-bg-3/50 border border-bg-3 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-bg-4 flex items-center justify-center">
          <Lock size={28} className="text-text-3" />
        </div>
        <div className="text-center px-6">
          <p className="text-[15px] font-bold mb-1.5">Content Locked</p>
          <p className="text-[12px] text-text-3 leading-relaxed">
            Kursus ini membutuhkan plan{" "}
            <span className={`font-bold ${tierBadge.text}`}>{tierBadge.label}</span>{" "}
            atau lebih tinggi untuk diakses.
          </p>
        </div>
        <a
          href="/dashboard/subscription"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white text-[12px] font-semibold transition-all shadow-[0_4px_16px_rgba(139,92,246,0.3)]"
        >
          Upgrade Plan <ChevronRight size={13} />
        </a>
      </div>
    );
  }

  return <CustomVideoPlayer videoUrl={course.video_url} title={course.title} />;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CoursePage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("All");
  const [selected, setSelected] = useState(DUMMY_COURSES[0]);

  // Tier user dari membership
  const userTier = user?.membership?.subscription?.tier?.toLowerCase() ?? "basic";

  // Filter + search
  const filtered = useMemo(() => {
    return DUMMY_COURSES.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.tag?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchTier =
        filterTier === "All" || c.min_tier === filterTier.toLowerCase();

      return matchSearch && matchTier;
    });
  }, [search, filterTier]);

  const accessible = canAccess(userTier, selected?.min_tier);

  // Stats
  const accessibleCount = DUMMY_COURSES.filter((c) => canAccess(userTier, c.min_tier)).length;
  const totalCount = DUMMY_COURSES.length;

  return (
    <>
      {/* ── Header ── */}
      <header className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <h1 className="text-[26px] font-bold mb-1.5">Course Library</h1>
            <p className="text-text-3 text-[13px]">
              Kamu dapat mengakses{" "}
              <span className="text-primary-3 font-semibold">{accessibleCount} dari {totalCount}</span>{" "}
              kursus dengan plan <span className="text-primary-3 font-semibold capitalize">{userTier}</span>.
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
            <input
              type="text"
              placeholder="Cari kursus..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-bg-2 border border-bg-3 rounded-xl text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-primary-1/50 transition-colors w-[200px]"
            />
          </div>
        </div>

        {/* Tier filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilterTier(f)}
              className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold border transition-all duration-150 ${
                filterTier === f
                  ? "bg-primary-1/20 text-primary-3 border-primary-1/30"
                  : "bg-transparent text-text-3 border-bg-3 hover:border-primary-1/20 hover:text-text-2"
              }`}
            >
              {f}
              {f !== "All" && (
                <span className="ml-1.5 text-[10px] opacity-60">
                  ({DUMMY_COURSES.filter((c) => c.min_tier === f.toLowerCase()).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* ── Layout: List + Detail ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">

        {/* ── Course List ── */}
        <div className="flex flex-col gap-2 h-[calc(100vh-230px)] overflow-y-auto custom-scrollbar pr-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-text-3">
              <BookOpen size={28} className="opacity-30" />
              <p className="text-[13px]">Tidak ada kursus yang cocok.</p>
            </div>
          ) : (
            filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                userTier={userTier}
                isSelected={selected?.id === course.id}
                onClick={() => setSelected(course)}
              />
            ))
          )}
        </div>

        {/* ── Course Detail ── */}
        {selected && (
          <div className="flex flex-col gap-5">

            {/* Video Player */}
            <VideoPlayer key={selected.id} course={selected} accessible={accessible} />

            {/* Info Card */}
            <div className="bg-bg-2 border border-bg-3 rounded-2xl p-6">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {(() => {
                  const cat = getCatStyle(selected.category?.name);
                  return (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${cat.bg} ${cat.text} ${cat.border}`}>
                      {selected.category?.name}
                    </span>
                  );
                })()}
                {(() => {
                  const tb = TIER_BADGE[selected.min_tier] ?? TIER_BADGE.basic;
                  return (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${tb.bg} ${tb.text} ${tb.border}`}>
                      {tb.label}+
                    </span>
                  );
                })()}
                {accessible ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    <CheckCircle size={10} /> Accessible
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                    <Lock size={10} /> Locked
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h2 className="text-[20px] font-bold mb-2 leading-snug">{selected.title}</h2>
              <p className="text-[13px] text-text-2 leading-relaxed mb-5">{selected.description}</p>

              {/* Meta grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: "Instructor", value: selected.instructor ?? "—" },
                  { label: "Duration",   value: selected.duration ?? "—" },
                  { label: "Sections",   value: `${selected.total_sections ?? "—"} sections` },
                  { label: "Min Plan",   value: (TIER_BADGE[selected.min_tier]?.label ?? selected.min_tier) + "+" },
                ].map((m) => (
                  <div key={m.label} className="bg-bg-3/40 rounded-xl p-3">
                    <p className="text-[10px] text-text-3 uppercase tracking-wider font-semibold mb-0.5">{m.label}</p>
                    <p className="text-[12px] font-bold truncate">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {selected.tag && selected.tag.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selected.tag.map((t) => (
                    <span key={t} className="text-[11px] text-text-3 bg-bg-3/60 px-3 py-1 rounded-full border border-bg-3">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </>
  );
}
