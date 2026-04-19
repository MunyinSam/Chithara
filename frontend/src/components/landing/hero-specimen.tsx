'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Waveform } from './waveform';
import { Typewriter } from './typewriter';

const PROMPT_ROTATION = [
	'a calm lofi beat for studying at 2 a.m.',
	'cinematic strings over a beating heart',
	'summer convertible driving, golden hour',
	'a jazz quartet in an empty bar',
	'ambient synth for a long walk home',
	'upbeat pop about first crushes',
];

const STYLE_CHIPS = [
	'Lofi', 'Cinematic', 'Pop', 'Ambient', 'Jazz', 'Folk', 'Synth', 'Orchestral',
];

export function HeroSpecimen() {
	const [now, setNow] = useState(0.38);
	const [activeChip, setActiveChip] = useState(0);
	const [isPlaying, setIsPlaying] = useState(true);
	const [volume, setVolume] = useState(72);

	useEffect(() => {
		if (!isPlaying) return;
		const id = setInterval(() => setNow((n) => (n + 0.01) % 1), 180);
		return () => clearInterval(id);
	}, [isPlaying]);

	const mm = (p: number) => {
		const total = 3 * 60 + 24;
		const s = Math.floor(total * p);
		return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
	};

	return (
		<div className="relative border border-[oklch(0.85_0.015_60)] bg-[oklch(0.945_0.016_75)] p-6 flex flex-col h-full">
			<div className="flex justify-between items-center pb-3.5 border-b border-[oklch(0.85_0.015_60)] font-mono text-[10px] tracking-widest uppercase text-[oklch(0.55_0.015_60)]">
				<span>Specimen № 0042</span>
				<span
					className="inline-flex items-center gap-1.5"
					style={{ color: isPlaying ? 'var(--accent-deep, oklch(0.48 0.17 35))' : 'oklch(0.55 0.015 60)' }}
				>
					<span
						className={cn('w-1.5 h-1.5 rounded-full', isPlaying && 'pulse-dot')}
						style={{ background: isPlaying ? 'var(--accent, oklch(0.62 0.17 35))' : 'oklch(0.75 0.015 60)' }}
					/>
					{isPlaying ? 'Now playing' : 'Paused'}
				</span>
			</div>

			<div className="py-5 flex flex-col gap-1 border-b border-[oklch(0.85_0.015_60)]">
				<p className="font-mono text-[10px] tracking-widest uppercase text-[oklch(0.55_0.015_60)]">
					Generated · 2m ago
				</p>
				<div className="font-serif text-[44px] leading-none text-[oklch(0.18_0.015_60)]">
					Midnight{' '}
					<span className="italic" style={{ color: 'var(--accent-deep, oklch(0.48 0.17 35))' }}>
						Library
					</span>
				</div>
				<p className="font-serif italic text-lg text-[oklch(0.32_0.015_60)]">by a prompt, no. 042</p>
			</div>

			<div className="mt-[18px] px-4 py-3.5 border border-dashed border-[oklch(0.85_0.015_60)] font-serif italic text-[19px] text-[oklch(0.32_0.015_60)] relative min-h-[62px] flex items-center">
				<span className="absolute -top-2 left-3.5 bg-[oklch(0.945_0.016_75)] px-1.5 font-mono text-[9px] tracking-widest text-[oklch(0.55_0.015_60)] not-italic">
					PROMPT
				</span>
				<Typewriter texts={PROMPT_ROTATION} />
			</div>

			<div className="mt-5 flex flex-col gap-3.5 flex-1 min-h-[180px]">
				<div className="flex justify-between items-center font-mono text-[10px] tracking-wider text-[oklch(0.55_0.015_60)]">
					<span className="text-[oklch(0.18_0.015_60)] font-medium tabular-nums">{mm(now)}</span>
					<span>↔ STEREO · 44.1kHz</span>
					<span className="tabular-nums">03:24</span>
				</div>
				<Waveform bars={84} seed={42} playing height={70} progress={now} />
				<div className="flex justify-between items-center font-mono text-[10px] tracking-wider text-[oklch(0.55_0.015_60)]">
					<span>KEY · A♭ MINOR</span>
					<span>BPM · 76</span>
					<span>MOOD · CONTEMPLATIVE</span>
				</div>
			</div>

			{/* Transport controls */}
			<div className="mt-4 pt-4 border-t border-[oklch(0.85_0.015_60)] flex items-center gap-3">
				{/* Skip back */}
				<button
					type="button"
					onClick={() => setNow((n) => Math.max(0, n - 0.08))}
					className="size-8 border flex items-center justify-center transition-colors hover:bg-[oklch(0.18_0.015_60)] hover:text-[oklch(0.972_0.012_75)] group"
					style={{ borderColor: 'oklch(0.85 0.015 60)', color: 'oklch(0.32 0.015 60)' }}
					title="Skip back"
				>
					<svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
						<path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
					</svg>
				</button>

				{/* Play / Pause */}
				<button
					type="button"
					onClick={() => setIsPlaying((p) => !p)}
					className="size-10 border flex items-center justify-center transition-colors"
					style={{
						background: 'oklch(0.18 0.015 60)',
						borderColor: 'oklch(0.18 0.015 60)',
						color: 'oklch(0.972 0.012 75)',
					}}
					title={isPlaying ? 'Pause' : 'Play'}
				>
					{isPlaying ? (
						<svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
							<rect x="6" y="4" width="4" height="16" />
							<rect x="14" y="4" width="4" height="16" />
						</svg>
					) : (
						<svg className="size-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
							<path d="M8 5v14l11-7z" />
						</svg>
					)}
				</button>

				{/* Skip forward */}
				<button
					type="button"
					onClick={() => setNow((n) => Math.min(0.99, n + 0.08))}
					className="size-8 border flex items-center justify-center transition-colors hover:bg-[oklch(0.18_0.015_60)] hover:text-[oklch(0.972_0.012_75)]"
					style={{ borderColor: 'oklch(0.85 0.015 60)', color: 'oklch(0.32 0.015 60)' }}
					title="Skip forward"
				>
					<svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
						<path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
					</svg>
				</button>

				{/* Divider */}
				<div className="w-px h-5 mx-1" style={{ background: 'oklch(0.85 0.015 60)' }} />

				{/* Volume icon */}
				<svg
					className="size-3.5 shrink-0"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					style={{ color: 'oklch(0.55 0.015 60)' }}
				>
					<path d="M11 5 6 9H2v6h4l5 4V5z" />
					<path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
				</svg>

				{/* Volume track */}
				<div className="flex-1 relative h-px" style={{ background: 'oklch(0.85 0.015 60)' }}>
					<div
						className="absolute left-0 top-0 h-px"
						style={{ width: `${volume}%`, background: 'oklch(0.18 0.015 60)' }}
					/>
					<div
						className="absolute top-1/2 size-2 border -translate-y-1/2 cursor-pointer"
						style={{
							left: `${volume}%`,
							transform: 'translate(-50%, -50%)',
							background: 'oklch(0.18 0.015 60)',
							borderColor: 'oklch(0.18 0.015 60)',
						}}
						onMouseDown={(e) => {
							const track = e.currentTarget.parentElement!;
							const move = (mv: MouseEvent) => {
								const rect = track.getBoundingClientRect();
								setVolume(Math.round(Math.max(0, Math.min(100, ((mv.clientX - rect.left) / rect.width) * 100))));
							};
							window.addEventListener('mousemove', move);
							window.addEventListener('mouseup', () => window.removeEventListener('mousemove', move), { once: true });
						}}
					/>
				</div>

				<span className="font-mono text-[9px] tabular-nums" style={{ color: 'oklch(0.55 0.015 60)' }}>
					{volume}
				</span>
			</div>

			{/* Style chips — clickable */}
			<div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-[oklch(0.85_0.015_60)]">
				{STYLE_CHIPS.map((c, i) => (
					<button
						key={c}
						type="button"
						onClick={() => setActiveChip(i)}
						className={cn(
							'font-mono text-[10px] tracking-wider uppercase px-2.5 py-1.5 border rounded-full transition-all',
							activeChip === i
								? 'bg-[oklch(0.18_0.015_60)] text-[oklch(0.972_0.012_75)] border-[oklch(0.18_0.015_60)]'
								: 'bg-[oklch(0.972_0.012_75)] text-[oklch(0.32_0.015_60)] border-[oklch(0.85_0.015_60)] hover:border-[oklch(0.55_0.015_60)]'
						)}
					>
						{c}
					</button>
				))}
			</div>

			{/* CTA */}
			<div className="mt-4 pt-4 border-t border-[oklch(0.85_0.015_60)] flex items-center justify-between">
				<p className="font-mono text-[9px] tracking-widest uppercase text-[oklch(0.55_0.015_60)]">
					Style ·{' '}
					<span style={{ color: 'var(--accent-deep, oklch(0.48 0.17 35))' }}>
						{STYLE_CHIPS[activeChip]}
					</span>
				</p>
				<Link
					href="/generation"
					className="inline-flex items-center gap-2 px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase border transition-all hover:bg-(--accent-deep,oklch(0.48_0.17_35)) hover:text-[oklch(0.972_0.012_75)] hover:border-(--accent-deep,oklch(0.48_0.17_35))"
					style={{
						background: 'oklch(0.18 0.015 60)',
						color: 'oklch(0.972 0.012 75)',
						borderColor: 'oklch(0.18 0.015 60)',
					}}
				>
					Generate this →
				</Link>
			</div>
		</div>
	);
}
