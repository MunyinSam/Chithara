'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/src/components/ui/button';

interface Song {
  id: number;
  title: string;
  genre: string;
  prompt: string;
  audio_file: string;
  created_at: string;
}

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PublicSongPage() {
  const { token } = useParams<{ token: string }>();
  const audioRef    = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [song, setSong]             = useState<Song | null>(null);
  const [notFound, setNotFound]     = useState(false);
  const [playing, setPlaying]       = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]     = useState(0);

  useEffect(() => {
    fetch(`${API}/songs/public/${token}/`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setSong)
      .catch(() => setNotFound(true));
  }, [token]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else          { audio.play(); setPlaying(true); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    const audio = audioRef.current;
    if (!bar || !audio) return;
    const dur = audio.duration;
    if (!isFinite(dur)) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * dur;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-2xl font-semibold text-gray-700">Song not found</p>
          <p className="text-gray-400">This link may have expired or been made private.</p>
          <a href="/" className={cn(buttonVariants({ variant: 'outline' }))}>Go home</a>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="size-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">

        {/* Branding */}
        <div className="text-center">
          <a href="/" className="text-2xl font-bold text-indigo-600">Chithara</a>
          <p className="text-sm text-gray-400 mt-1">Shared song</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">

          {/* Song info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{song.title}</h1>
            <p className="text-sm text-gray-400 mt-1">{song.genre}</p>
          </div>

          <p className="text-sm text-gray-500 italic border-l-2 border-indigo-200 pl-3">
            &ldquo;{song.prompt}&rdquo;
          </p>

          {/* Progress bar */}
          <div
            ref={progressRef}
            onClick={seek}
            className="w-full h-4 flex items-center cursor-pointer group"
          >
            <div className="w-full h-1.5 bg-gray-200 rounded-full relative pointer-events-none">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${progress}%` }} />
              <div
                className="absolute top-1/2 size-3 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>
          </div>

          {/* Time + controls */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 tabular-nums w-20">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <button
              onClick={togglePlay}
              className="size-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors shadow-md mx-auto"
            >
              {playing ? (
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="size-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <a
              href={song.audio_file}
              download
              className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'w-20 text-center')}
            >
              Download
            </a>
          </div>

        </div>

        <p className="text-center text-xs text-gray-400">
          Generated with <a href="/" className="text-indigo-500 hover:underline">Chithara</a>
        </p>
      </div>

      <audio
        ref={audioRef}
        src={song.audio_file}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}
