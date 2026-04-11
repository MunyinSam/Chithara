'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Song {
  id: number;
  title: string;
  genre: string;
  audio_file: string;
}

interface AudioPlayerProps {
  song: Song | null;
  onClose: () => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({ song, onClose }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying]       = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]     = useState(0);
  const [speed, setSpeed]           = useState(1);
  const [volume, setVolume]         = useState(1);
  const [muted, setMuted]           = useState(false);
  const [visible, setVisible]       = useState(false);

  // Animate in
  useEffect(() => {
    if (song) {
      setVisible(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [song]);

  // Auto-play when song loads
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) return;
    audio.load();
    audio.play().then(() => setPlaying(true)).catch(() => {});
  }, [song]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else          { audio.play(); setPlaying(true); }
  };

  const skip = (delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const dur = audio.duration;
    if (!isFinite(dur)) return;
    audio.currentTime = Math.max(0, Math.min(dur, audio.currentTime + delta));
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

  const setPlaybackSpeed = (s: number) => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = s;
    setSpeed(s);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) { audioRef.current.volume = v; audioRef.current.muted = false; }
    setMuted(v === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
  };

  const handleClose = () => {
    setVisible(false);
    audioRef.current?.pause();
    setTimeout(onClose, 300);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!song) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      {/* Backdrop blur strip */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-2xl px-6 py-4">

        {/* Progress bar — tall hit area, inner elements non-interactive */}
        <div
          ref={progressRef}
          onClick={seek}
          className="w-full h-4 flex items-center cursor-pointer mb-2 group"
        >
          <div className="w-full h-1.5 bg-gray-200 rounded-full relative pointer-events-none">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 size-3 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">

          {/* Song info */}
          <div className="min-w-0 w-48 shrink-0">
            <p className="font-semibold text-gray-900 truncate text-sm">{song.title}</p>
            <p className="text-xs text-gray-400 truncate">{song.genre}</p>
          </div>

          {/* Time */}
          <div className="text-xs text-gray-400 tabular-nums shrink-0 w-24">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Main controls */}
          <div className="flex items-center gap-3 flex-1 justify-center">

            {/* Rewind 10s */}
            <button
              onClick={() => skip(-10)}
              className="text-gray-500 hover:text-indigo-600 transition-colors"
              title="Back 10s"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                <text x="8" y="15" fontSize="5" fontWeight="bold" fill="currentColor">10</text>
              </svg>
            </button>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="size-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors shadow-md"
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

            {/* Forward 10s */}
            <button
              onClick={() => skip(10)}
              className="text-gray-500 hover:text-indigo-600 transition-colors"
              title="Forward 10s"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
                <text x="8" y="15" fontSize="5" fontWeight="bold" fill="currentColor">10</text>
              </svg>
            </button>
          </div>

          {/* Speed selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={cn(
                  'px-2 py-1 rounded text-xs font-medium transition-colors',
                  speed === s
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                )}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 shrink-0 w-36">
            <button onClick={toggleMute} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
              {muted || volume === 0 ? (
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18l1.73 1.73L21 18.46 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              ) : (
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              )}
            </button>
            <input
              type="range"
              min={0} max={1} step={0.02}
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Close */}
          <button
            onClick={handleClose}
            className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors ml-2"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
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
