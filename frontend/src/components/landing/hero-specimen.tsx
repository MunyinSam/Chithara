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
	const [now, setNow] = useState(0);
	const [activeChip, setActiveChip] = useState(0);

	useEffect(() => {
		const id = setInterval(() => setNow((n) => (n + 0.01) % 1), 180);
		return () => clearInterval(id);
	}, []);

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
					style={{ color: 'var(--accent-deep, oklch(0.48 0.17 35))' }}
				>
					<span
						className="w-1.5 h-1.5 rounded-full pulse-dot"
						style={{ background: 'var(--accent, oklch(0.62 0.17 35))' }}
					/>
					Now playing
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
