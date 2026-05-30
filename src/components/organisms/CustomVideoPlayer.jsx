"use client";

import { useEffect, useRef, useState, useCallback, useId } from "react";
import {
  Play, Pause, Volume2, VolumeX,
  Maximize, Minimize, RotateCcw,
} from "lucide-react";

// ─── Extract YouTube video ID ─────────────────────────────────────────────────
function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/embed\/)([^?&\s]+)/,
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?&\s]+)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function fmtTime(s) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ─── Safe player method call ──────────────────────────────────────────────────
function callPlayer(player, method, ...args) {
  if (player && typeof player[method] === "function") {
    return player[method](...args);
  }
}

// ─── YouTube API loader (singleton) ──────────────────────────────────────────
let apiState = "idle"; // "idle" | "loading" | "ready"
let apiQueue = [];

function loadYouTubeApi(cb) {
  if (typeof window === "undefined") return;
  if (apiState === "ready" && window.YT?.Player) { cb(); return; }
  apiQueue.push(cb);
  if (apiState === "loading") return;
  apiState = "loading";
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
  window.onYouTubeIframeAPIReady = () => {
    apiState = "ready";
    apiQueue.forEach((fn) => fn());
    apiQueue = [];
  };
}

// ─── Custom Video Player ──────────────────────────────────────────────────────
export default function CustomVideoPlayer({ videoUrl, title }) {
  const videoId = getYouTubeId(videoUrl);

  // Use a stable unique ID for the YouTube player div
  const uid = useId().replace(/:/g, "");
  const playerId = `yt-player-${uid}`;

  const containerRef = useRef(null);
  const playerRef   = useRef(null);
  const progressRef = useRef(null);
  const tickRef     = useRef(null);
  const hideRef     = useRef(null);
  const builtRef    = useRef(false); // guard against double-init (StrictMode)

  const [ready,      setReady]      = useState(false);
  const [playing,    setPlaying]    = useState(false);
  const [muted,      setMuted]      = useState(false);
  const [volume,     setVolume]     = useState(80);
  const [current,    setCurrent]    = useState(0);
  const [duration,   setDuration]   = useState(0);
  const [buffered,   setBuffered]   = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showCtrl,   setShowCtrl]   = useState(true);

  // ── Build player ──────────────────────────────────────────────────────────
  const buildPlayer = useCallback(() => {
    if (builtRef.current) return;
    if (!window.YT?.Player) return;
    builtRef.current = true;

    playerRef.current = new window.YT.Player(playerId, {
      videoId,
      playerVars: {
        controls:        0,
        disablekb:       1,
        rel:             0,
        modestbranding:  1,
        iv_load_policy:  3,
        showinfo:        0,
        fs:              0,
        enablejsapi:     1,
        origin: typeof window !== "undefined" ? window.location.origin : "",
      },
      events: {
        onReady: (e) => {
          callPlayer(e.target, "setVolume", volume);
          const dur = callPlayer(e.target, "getDuration") ?? 0;
          setDuration(dur);
          setReady(true);
        },
        onStateChange: (e) => {
          const YT = window.YT;
          if (!YT) return;
          if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
          if (e.data === YT.PlayerState.PAUSED)  setPlaying(false);
          if (e.data === YT.PlayerState.ENDED) {
            setPlaying(false);
            setCurrent(0);
          }
        },
      },
    });
  }, [videoId, playerId, volume]);

  // ── Destroy & reset when videoId changes ────────────────────────────────
  useEffect(() => {
    // Reset all state for the new video
    setReady(false);
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
    setBuffered(0);
    setShowCtrl(true);

    // Destroy previous player if exists
    clearInterval(tickRef.current);
    clearTimeout(hideRef.current);
    if (playerRef.current && typeof playerRef.current.destroy === "function") {
      try { playerRef.current.destroy(); } catch (_) {}
      playerRef.current = null;
    }
    builtRef.current = false;

    if (!videoId) return;

    // Build new player after API is ready
    loadYouTubeApi(buildPlayer);

    return () => {
      clearInterval(tickRef.current);
      clearTimeout(hideRef.current);
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }
      builtRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // ── Progress ticker ───────────────────────────────────────────────────────
  useEffect(() => {
    clearInterval(tickRef.current);
    if (playing) {
      tickRef.current = setInterval(() => {
        const p = playerRef.current;
        if (!p) return;
        const cur = callPlayer(p, "getCurrentTime") ?? 0;
        const dur = callPlayer(p, "getDuration")    ?? 0;
        const buf = (callPlayer(p, "getVideoLoadedFraction") ?? 0) * dur;
        setCurrent(cur);
        setDuration(dur);
        setBuffered(buf);
      }, 250);
    }
    return () => clearInterval(tickRef.current);
  }, [playing]);

  // ── Fullscreen listener ───────────────────────────────────────────────────
  useEffect(() => {
    const fn = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);

  // ── Auto-hide controls ────────────────────────────────────────────────────
  const resetHide = useCallback(() => {
    setShowCtrl(true);
    clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => {
      setShowCtrl(false);
    }, 2800);
  }, []);

  useEffect(() => {
    if (!playing) {
      clearTimeout(hideRef.current);
      setShowCtrl(true);
    } else {
      resetHide();
    }
  }, [playing, resetHide]);

  // ── Controls ──────────────────────────────────────────────────────────────
  const togglePlay = () => {
    if (!ready) return;
    if (playing) {
      callPlayer(playerRef.current, "pauseVideo");
    } else {
      callPlayer(playerRef.current, "playVideo");
    }
  };

  const toggleMute = () => {
    if (!ready) return;
    if (muted) {
      callPlayer(playerRef.current, "unMute");
      callPlayer(playerRef.current, "setVolume", volume);
      setMuted(false);
    } else {
      callPlayer(playerRef.current, "mute");
      setMuted(true);
    }
  };

  const handleVolume = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (v === 0) {
      callPlayer(playerRef.current, "mute");
      setMuted(true);
    } else {
      callPlayer(playerRef.current, "unMute");
      callPlayer(playerRef.current, "setVolume", v);
      setMuted(false);
    }
  };

  const handleSeek = (e) => {
    if (!progressRef.current || !ready) return;
    const rect  = progressRef.current.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const seek  = ratio * duration;
    callPlayer(playerRef.current, "seekTo", seek, true);
    setCurrent(seek);
  };

  const replay = () => {
    callPlayer(playerRef.current, "seekTo", 0, true);
    callPlayer(playerRef.current, "playVideo");
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) containerRef.current.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const pct    = duration > 0 ? (current  / duration) * 100 : 0;
  const bufPct = duration > 0 ? (buffered / duration) * 100 : 0;

  if (!videoId) {
    return (
      <div className="w-full aspect-video rounded-2xl bg-bg-3/40 border border-bg-3 flex items-center justify-center text-text-3 text-[13px]">
        Video tidak tersedia.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={() => playing && resetHide()}
      onMouseLeave={() => playing && setShowCtrl(false)}
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black select-none"
      style={{ cursor: showCtrl ? "default" : "none" }}
    >
      {/* ── YouTube player container (API will inject iframe here) ── */}
      <div
        id={playerId}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          // Scale slightly to push YouTube watermark/logo outside visible area
          transform: "scale(1.06)",
          transformOrigin: "center center",
        }}
      />

      {/* ── Transparent click layer (intercepts all clicks from iframe) ── */}
      <div
        className="absolute inset-0 z-10"
        onClick={togglePlay}
      />

      {/* ── Loading overlay ── */}
      {!ready && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 rounded-2xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary-1/30 border-t-primary-3 animate-spin" />
            <span className="text-[11px] text-text-3">Loading player...</span>
          </div>
        </div>
      )}

      {/* ── Center big play button (visible when paused) ── */}
      {ready && !playing && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-primary-1/90 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.5)]">
            <Play size={26} className="text-white ml-1" fill="white" />
          </div>
        </div>
      )}

      {/* ── Custom Controls Bar ── */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ease-in-out ${
          showCtrl ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient backdrop */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none rounded-b-2xl" />

        <div className="relative px-4 pb-3 pt-8">
          {/* ── Progress bar ── */}
          <div
            ref={progressRef}
            onClick={handleSeek}
            className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer relative group/prog"
          >
            {/* Buffered */}
            <div
              className="absolute inset-y-0 left-0 bg-white/20 rounded-full"
              style={{ width: `${bufPct}%` }}
            />
            {/* Played */}
            <div
              className="absolute inset-y-0 left-0 bg-primary-3 rounded-full"
              style={{ width: `${pct}%` }}
            />
            {/* Thumb dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow opacity-0 group-hover/prog:opacity-100 transition-opacity"
              style={{ left: `calc(${pct}% - 6px)` }}
            />
          </div>

          {/* ── Controls row ── */}
          <div className="flex items-center justify-between gap-2">
            {/* Left */}
            <div className="flex items-center gap-1.5">
              <CtrlBtn onClick={replay} title="Replay">
                <RotateCcw size={14} />
              </CtrlBtn>

              <CtrlBtn onClick={togglePlay} title={playing ? "Pause" : "Play"}>
                {playing
                  ? <Pause size={16} fill="currentColor" />
                  : <Play  size={16} fill="currentColor" className="ml-0.5" />}
              </CtrlBtn>

              {/* Volume */}
              <div className="flex items-center gap-1.5 group/vol">
                <CtrlBtn onClick={toggleMute} title={muted ? "Unmute" : "Mute"}>
                  {muted || volume === 0
                    ? <VolumeX size={14} />
                    : <Volume2 size={14} />}
                </CtrlBtn>
                <input
                  type="range" min={0} max={100}
                  value={muted ? 0 : volume}
                  onChange={handleVolume}
                  className="w-0 group-hover/vol:w-16 transition-all duration-300 h-1 accent-primary-3 cursor-pointer opacity-0 group-hover/vol:opacity-100"
                />
              </div>

              {/* Time */}
              <span className="text-[11px] text-white/60 font-mono tabular-nums ml-1">
                {fmtTime(current)}&nbsp;/&nbsp;{fmtTime(duration)}
              </span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5">
              {title && (
                <span className="hidden sm:block text-[11px] text-white/40 truncate max-w-[150px]">
                  {title}
                </span>
              )}
              <CtrlBtn onClick={toggleFullscreen} title="Fullscreen">
                {fullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
              </CtrlBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Control Button ───────────────────────────────────────────────────────────
function CtrlBtn({ onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-150 flex-shrink-0"
    >
      {children}
    </button>
  );
}
