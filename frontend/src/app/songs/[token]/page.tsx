'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Song {
	id: number;
	title: string;
	genre: string;
	prompt: string;
	audio_file: string;
	created_at: string;
}

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

const ink = 'oklch(0.18 0.015 60)';
const ink2 = 'oklch(0.32 0.015 60)';
const mid = 'oklch(0.55 0.015 60)';
const rule = 'oklch(0.85 0.015 60)';
const bg = 'oklch(0.972 0.012 75)';
const accent = 'var(--accent, oklch(0.62 0.17 35))';
const accentDeep = 'var(--accent-deep, oklch(0.48 0.17 35))';

function formatTime(seconds: number): string {
	if (!isFinite(seconds)) return '0:00';
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});
}

export default function PublicSongPage() {
	const { token } = useParams<{ token: string }>();
	const audioRef = useRef<HTMLAudioElement>(null);
	const progressRef = useRef<HTMLDivElement>(null);

	const [song, setSong] = useState<Song | null>(null);
	const [notFound, setNotFound] = useState(false);
	const [playing, setPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

	useEffect(() => {
		fetch(`${API}/songs/public/${token}/`)
			.then((r) => {
				if (!r.ok) throw new Error();
				return r.json();
			})
			.then(setSong)
			.catch(() => setNotFound(true));
	}, [token]);

	const togglePlay = () => {
		const audio = audioRef.current;
		if (!audio) return;
		if (playing) {
			audio.pause();
			setPlaying(false);
		} else {
			audio.play();
			setPlaying(true);
		}
	};

	const seek = (e: React.MouseEvent<HTMLDivElement>) => {
		const bar = progressRef.current;
		const audio = audioRef.current;
		if (!bar || !audio || !isFinite(audio.duration)) return;
		const rect = bar.getBoundingClientRect();
		const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		audio.currentTime = ratio * audio.duration;
	};

	const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

	if (notFound) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: bg }}>
				<p
					className="font-serif italic text-[60px] leading-none mb-6"
					style={{ color: rule }}
				>
					—
				</p>
				<p className="font-serif text-[22px] mb-2" style={{ color: ink }}>
					Song not found.
				</p>
				<p className="font-mono text-[10px] tracking-widest uppercase mb-8" style={{ color: mid }}>
					This link may have expired or been made private.
				</p>
				<Link
					href="/"
					className="font-mono text-[10px] tracking-[0.18em] uppercase px-6 py-3 border transition-colors"
					style={{ borderColor: ink, color: ink }}
				>
					← Go home
				</Link>
			</div>
		);
	}

	if (!song) {
		return (
			<div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
				<div
					className="font-serif italic text-[44px] leading-none"
					style={{ color: rule }}
				>
					Loading
					<span className="animate-pulse" style={{ color: accentDeep }}>…</span>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen relative" style={{ background: bg, color: ink }}>
			{/* Paper grain */}
			<div
				aria-hidden
				className="fixed inset-0 pointer-events-none mix-blend-multiply opacity-60"
				style={{
					backgroundImage: 'radial-gradient(oklch(0.18 0.015 60 / 0.035) 1px, transparent 1px)',
					backgroundSize: '3px 3px',
				}}
			/>
			<div
				aria-hidden
				className="fixed inset-0 pointer-events-none"
				style={{
					background: 'radial-gradient(ellipse at 50% 0%, oklch(0.98 0.03 var(--accent-h, 35) / 0.35), transparent 60%)',
				}}
			/>

			{/* Top meta bar */}
			<div
				className="relative z-10 px-9 py-4 border-b flex justify-between font-mono text-[11px] tracking-widest uppercase"
				style={{ borderColor: rule, color: mid }}
			>
				<Link href="/" className="inline-flex items-center gap-2.5">
					<span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: accent }} />
					<span
						style={{
							color: ink,
							fontFamily: '"Instrument Serif", Georgia, serif',
							fontSize: 18,
							textTransform: 'none',
							letterSpacing: '-0.01em',
						}}
					>
						Chithara
					</span>
				</Link>
				<span>Shared Recording</span>
				<Link href="/generation" className="under-link" style={{ color: mid }}>
					Make your own →
				</Link>
			</div>

			{/* Content */}
			<div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-57px)] px-6 py-16">
				<div className="w-full max-w-lg">

					{/* Section label */}
					<p
						className="font-mono text-[10px] tracking-[0.25em] uppercase mb-8 text-center"
						style={{ color: mid }}
					>
						A song from the archive
					</p>

					{/* Main card */}
					<div className="border" style={{ borderColor: rule }}>
						{/* Card header */}
						<div
							className="px-8 py-6 border-b"
							style={{ borderColor: rule, background: 'oklch(0.96 0.012 75)' }}
						>
							<div className="flex items-start justify-between gap-4">
								<div>
									<h1
										className="font-serif text-[28px] leading-tight tracking-tight"
										style={{ color: ink }}
									>
										{song.title}
									</h1>
									<p
										className="font-mono text-[10px] tracking-widest uppercase mt-1.5"
										style={{ color: mid }}
									>
										{song.genre} · {formatDate(song.created_at)}
									</p>
								</div>
								{/* Playing bars */}
								{playing && (
									<span className="flex gap-0.5 items-end h-5 shrink-0 mt-1">
										{[1, 2, 3, 4].map((i) => (
											<span
												key={i}
												className="w-0.5 rounded-full animate-pulse"
												style={{
													height: `${8 + i * 3}px`,
													animationDelay: `${i * 0.12}s`,
													background: accent,
												}}
											/>
										))}
									</span>
								)}
							</div>
						</div>

						{/* Prompt */}
						<div className="px-8 py-5 border-b" style={{ borderColor: rule }}>
							<p className="font-serif italic text-[15px] leading-relaxed" style={{ color: ink2 }}>
								&ldquo;{song.prompt}&rdquo;
							</p>
						</div>

						{/* Player */}
						<div className="px-8 py-6 space-y-5">
							{/* Progress bar */}
							<div
								ref={progressRef}
								onClick={seek}
								className="w-full h-6 flex items-center cursor-pointer group"
							>
								<div
									className="w-full h-px relative"
									style={{ background: rule }}
								>
									<div
										className="h-px absolute left-0 top-0 transition-all"
										style={{ width: `${progress}%`, background: ink }}
									/>
									<div
										className="absolute top-1/2 size-2 border opacity-0 group-hover:opacity-100 transition-opacity"
										style={{
											left: `${progress}%`,
											transform: 'translate(-50%, -50%)',
											background: ink,
											borderColor: ink,
										}}
									/>
								</div>
							</div>

							{/* Controls */}
							<div className="flex items-center gap-5">
								<span
									className="font-mono text-[10px] tabular-nums tracking-wider"
									style={{ color: mid }}
								>
									{formatTime(currentTime)} / {formatTime(duration)}
								</span>

								{/* Play/pause */}
								<button
									onClick={togglePlay}
									className="size-11 border flex items-center justify-center transition-colors"
									style={{ borderColor: ink, background: ink, color: bg }}
									onMouseEnter={(e) => {
										(e.currentTarget as HTMLButtonElement).style.background = accentDeep;
										(e.currentTarget as HTMLButtonElement).style.borderColor = accentDeep;
									}}
									onMouseLeave={(e) => {
										(e.currentTarget as HTMLButtonElement).style.background = ink;
										(e.currentTarget as HTMLButtonElement).style.borderColor = ink;
									}}
								>
									{playing ? (
										<svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
											<rect x="6" y="4" width="4" height="16" rx="0" />
											<rect x="14" y="4" width="4" height="16" rx="0" />
										</svg>
									) : (
										<svg className="size-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
											<path d="M8 5v14l11-7z" />
										</svg>
									)}
								</button>

								<div className="flex-1" />

								{/* Download */}
								<a
									href={song.audio_file}
									download
									className="font-mono text-[10px] tracking-[0.18em] uppercase px-5 py-2.5 border transition-colors"
									style={{ borderColor: rule, color: ink2 }}
								>
									Download
								</a>
							</div>
						</div>
					</div>

					{/* Footer note */}
					<p
						className="font-mono text-[9px] tracking-[0.2em] uppercase text-center mt-8"
						style={{ color: mid }}
					>
						Generated with{' '}
						<Link href="/" className="under-link" style={{ color: accentDeep }}>
							Chithara
						</Link>
					</p>
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
