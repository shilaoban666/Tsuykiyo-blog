"use client";

import { useEffect, useRef, useState } from "react";
import {
  CaretDown,
  CaretUp,
  ListBullets,
  Pause,
  Play,
  Repeat,
  RepeatOnce,
  SpeakerHigh,
  SpeakerSlash,
  SkipBack,
  SkipForward,
  X,
} from "@phosphor-icons/react";
import type { MusicTrack } from "@/lib/music";
import type { Messages } from "@/i18n/messages";
import type { Locale } from "@/i18n/config";
import { displayAuthor } from "@/i18n/content";

const STORAGE_KEY = "tsukiyo-music";
type LoopMode = "off" | "all" | "one";
type Stored = {
  trackId?: string;
  volume?: number;
  loop?: LoopMode;
  positions?: Record<string, number>;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function MusicPlayer({ tracks, messages, locale }: { tracks: MusicTrack[]; messages: Messages; locale: Locale }) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.62);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loop, setLoop] = useState<LoopMode>("all");
  const audioRef = useRef<HTMLAudioElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const playIntent = useRef(false);
  const positions = useRef<Record<string, number>>({});
  const lastSaved = useRef(0);
  const hydrated = useRef(false);

  const track = tracks[index] ?? tracks[0];
  const trackTitle = (item: MusicTrack) => (item.title === "月光环境音" ? messages["music.demoTitle"] : item.title);
  const trackArtist = (item: MusicTrack) =>
    item.artist === "月白" ? displayAuthor(locale, "月白") : item.artist || messages["music.unknownArtist"];

  useEffect(() => {
    if (!tracks.length || hydrated.current) return;
    hydrated.current = true;
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Stored;
      if (typeof stored.volume === "number") {
        setVolume(Math.min(1, Math.max(0, stored.volume)));
        setMuted(stored.volume === 0);
      }
      if (stored.loop) setLoop(stored.loop);
      positions.current = stored.positions ?? {};
      if (stored.trackId) {
        const found = tracks.findIndex((item) => item.id === stored.trackId);
        if (found >= 0) setIndex(found);
      }
      const activeId = stored.trackId ?? tracks[0]?.id;
      if (activeId) {
        window.requestAnimationFrame(() => applySavedPosition(activeId));
      }
    } catch {
      // ignore malformed storage
    }
  }, [tracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    if (playIntent.current) {
      audio.play().catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (!expanded) return;
    function onClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setExpanded(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setExpanded(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  useEffect(() => {
    function save() {
      persist();
    }
    function onVisibility() {
      if (document.visibilityState === "hidden") save();
    }
    window.addEventListener("pagehide", save);
    window.addEventListener("beforeunload", save);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", save);
      window.removeEventListener("beforeunload", save);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.id, volume, muted, loop]);

  useEffect(() => {
    return () => {
      persist(audioRef.current?.currentTime ?? 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, track?.id]);

  if (!tracks.length || !track) return null;

  function persist(currentTime?: number) {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Stored;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...stored,
          trackId: track.id,
          volume: muted ? 0 : volume,
          loop,
          positions: {
            ...positions.current,
            [track.id]: currentTime ?? audioRef.current?.currentTime ?? 0,
          },
        } satisfies Stored),
      );
    } catch {
      // storage is a nice-to-have
    }
  }

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      playIntent.current = true;
      try {
        await audio.play();
      } catch {
        setPlaying(false);
        playIntent.current = false;
      }
    } else {
      playIntent.current = false;
      audio.pause();
    }
  }

  function selectTrack(next: number, autoplay = true) {
    const wrapped = (next + tracks.length) % tracks.length;
    playIntent.current = autoplay;
    setProgress(0);
    setDuration(0);
    if (wrapped === index) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        if (autoplay) void audio.play().catch(() => setPlaying(false));
      }
    } else {
      setIndex(wrapped);
    }
  }

  function step(direction: 1 | -1) {
    selectTrack(index + direction, playing);
  }

  function applySavedPosition(trackId: string) {
    const audio = audioRef.current;
    if (!audio || audio.readyState < 1) return;
    const saved = positions.current[trackId] ?? 0;
    const total = audio.duration || 0;
    if (saved > 2 && total > 0 && saved < total - 3) {
      audio.currentTime = saved;
      setProgress(saved);
    }
  }

  function onLoadedMetadata() {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration || 0);
    applySavedPosition(track.id);
    audio.volume = muted ? 0 : volume;
  }

  function onTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(audio.currentTime);
    if (audio.currentTime - lastSaved.current > 2) {
      lastSaved.current = audio.currentTime;
      persist(audio.currentTime);
    }
  }

  function onEnded() {
    const audio = audioRef.current;
    if (loop === "one" && audio) {
      audio.currentTime = 0;
      void audio.play();
      return;
    }
    if (index < tracks.length - 1) {
      selectTrack(index + 1, true);
    } else if (loop === "all") {
      selectTrack(0, true);
    } else {
      setPlaying(false);
      playIntent.current = false;
    }
  }

  function cycleLoop() {
    setLoop((current) => (current === "all" ? "one" : current === "one" ? "off" : "all"));
  }

  function changeVolume(next: number) {
    setVolume(next);
    setMuted(next === 0);
    if (audioRef.current) audioRef.current.volume = next;
  }

  const ratio = duration > 0 ? Math.min(1, progress / duration) : 0;
  const circumference = 2 * Math.PI * 20;

  return (
    <div ref={rootRef} className="music-player fixed bottom-5 right-4 z-[45] sm:bottom-6 sm:right-6">
      {expanded ? (
        <div
          ref={panelRef}
          className="absolute bottom-[calc(100%+12px)] right-0 w-[min(calc(100vw-2rem),360px)] overflow-hidden rounded-2xl border border-line bg-[color-mix(in_srgb,var(--bg-elev)_92%,transparent)] shadow-[0_30px_80px_-20px_rgba(0,0,0,.7)] backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-display text-[9px] tracking-[0.26em] text-faint">{messages["music.nowPlaying"]}</p>
            <button type="button" onClick={() => setExpanded(false)} className="grid size-7 place-items-center rounded-full text-faint transition-colors hover:text-ink" aria-label={messages["music.collapse"]}>
              <X size={15} />
            </button>
          </div>

          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="music-disc relative size-14 shrink-0 overflow-hidden rounded-full border border-line" data-playing={playing}>
                {track.coverUrl ? <img src={track.coverUrl} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center bg-surface-2 text-faint"><ListBullets size={18} /></div>}
                <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-serif-cn text-base text-ink">{trackTitle(track)}</p>
                <p className="mt-0.5 truncate text-[10px] text-faint">{trackArtist(track)}{track.album ? ` · ${track.album}` : ""}</p>
              </div>
            </div>

            <div className="mt-4">
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(progress, duration || 0)}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setProgress(value);
                  if (audioRef.current) audioRef.current.currentTime = value;
                }}
                className="music-range w-full"
                style={{ "--range-progress": `${ratio * 100}%` } as React.CSSProperties}
                aria-label={messages["music.progress"]}
              />
              <div className="mt-1 flex justify-between font-display text-[10px] text-faint">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <button type="button" onClick={cycleLoop} className={`grid size-8 place-items-center rounded-full transition-colors ${loop === "off" ? "text-faint hover:text-muted" : "text-accent"}`} aria-label={`${messages["music.playlist"]} · ${loop === "all" ? messages["music.loopAll"] : loop === "one" ? messages["music.loopOne"] : messages["music.loopOff"]}`}>
                {loop === "one" ? <RepeatOnce size={16} /> : <Repeat size={16} />}
              </button>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => step(-1)} className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:text-ink" aria-label={messages["music.previous"]}>
                  <SkipBack size={17} weight="fill" />
                </button>
                <button type="button" onClick={togglePlay} className="grid size-11 place-items-center rounded-full bg-accent text-[var(--accent-ink)] shadow-[0_0_24px_var(--glow)] transition-transform active:scale-95" aria-label={playing ? messages["music.pause"] : messages["music.play"]}>
                  {playing ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" className="ml-0.5" />}
                </button>
                <button type="button" onClick={() => step(1)} className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:text-ink" aria-label={messages["music.next"]}>
                  <SkipForward size={17} weight="fill" />
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setMuted((value) => !value)} className="grid size-8 place-items-center rounded-full text-faint transition-colors hover:text-muted" aria-label={messages["music.mute"]}>
                  {muted || volume === 0 ? <SpeakerSlash size={15} /> : <SpeakerHigh size={15} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(event) => changeVolume(Number(event.target.value))}
                  className="music-range w-14"
                  style={{ "--range-progress": `${(muted ? 0 : volume) * 100}%` } as React.CSSProperties}
                  aria-label="Volume"
                />
              </div>
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto border-t border-line px-2 py-2">
            {tracks.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectTrack(itemIndex, true)}
                className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${itemIndex === index ? "bg-accent/10" : "hover:bg-ink/5"}`}
              >
                <span className={`w-4 shrink-0 font-display text-[10px] ${itemIndex === index ? "text-accent" : "text-faint"}`}>
                  {itemIndex === index && playing ? "♪" : String(itemIndex + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-xs ${itemIndex === index ? "text-accent" : "text-muted"}`}>{trackTitle(item)}</span>
                  <span className="block truncate text-[9px] text-faint">{trackArtist(item)}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="border-t border-line px-4 py-2.5 text-[9px] leading-4 text-faint">{messages["music.credit"]}</p>
        </div>
      ) : null}

      <div className="flex items-center gap-1 rounded-full border border-line bg-[color-mix(in_srgb,var(--bg-elev)_86%,transparent)] p-1.5 pl-2 shadow-[0_18px_50px_-20px_rgba(0,0,0,.8)] backdrop-blur-2xl">
        <button type="button" onClick={() => setExpanded((value) => !value)} className="group flex items-center gap-2.5 rounded-full pr-1 text-left" aria-label={expanded ? messages["music.collapse"] : messages["music.expand"]}>
          <span className="relative grid size-10 place-items-center rounded-full">
            <svg className="absolute inset-0 size-10 -rotate-90" viewBox="0 0 44 44" aria-hidden>
              <circle cx="22" cy="22" r="20" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
              <circle cx="22" cy="22" r="20" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - ratio)} className="transition-[stroke-dashoffset] duration-300" />
            </svg>
            <span className="music-disc relative size-8 overflow-hidden rounded-full border border-line" data-playing={playing}>
              {track.coverUrl ? <img src={track.coverUrl} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full w-full place-items-center bg-surface-2 text-faint"><ListBullets size={13} /></span>}
            </span>
          </span>
          <span className="hidden max-w-[130px] sm:block">
            <span className="block truncate text-[11px] text-ink">{trackTitle(track)}</span>
            <span className="block truncate text-[9px] text-faint">{playing ? messages["music.playing"] : messages["music.playlist"]}</span>
          </span>
          {expanded ? <CaretDown size={12} className="hidden text-faint sm:block" /> : <CaretUp size={12} className="hidden text-faint sm:block" />}
        </button>
        <button type="button" onClick={togglePlay} className="grid size-9 shrink-0 place-items-center rounded-full bg-ink/5 text-ink transition-colors hover:bg-accent hover:text-[var(--accent-ink)]" aria-label={playing ? messages["music.pause"] : messages["music.play"]}>
          {playing ? <Pause size={15} weight="fill" /> : <Play size={15} weight="fill" className="ml-0.5" />}
        </button>
      </div>

      <audio
        ref={audioRef}
        src={track.audioUrl}
        preload="metadata"
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false);
          persist();
        }}
        onEnded={onEnded}
        onError={() => setPlaying(false)}
      />
    </div>
  );
}