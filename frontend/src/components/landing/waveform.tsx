'use client';

import { useMemo, useEffect, useState } from 'react';

function seededWave(seed: number, count: number): number[] {
	let s = seed;
	const rnd = () => {
		s = (s * 9301 + 49297) % 233280;
		return s / 233280;
	};
	const out: number[] = [];
	for (let i = 0; i < count; i++) {
		const env = Math.sin((i / count) * Math.PI);
		const v = 0.15 + env * 0.7 + (rnd() - 0.5) * 0.35;
		out.push(Math.max(0.06, Math.min(1, v)));
	}
	return out;
}

export function Waveform({
	bars = 80,
	seed = 7,
	playing = true,
	inverse = false,
	height = 80,
	progress,
}: {
	bars?: number;
	seed?: number;
	playing?: boolean;
	inverse?: boolean;
	height?: number;
	progress?: number;
}) {
	const base = useMemo(() => seededWave(seed, bars), [seed, bars]);
	const [tick, setTick] = useState(0);
	const [auto, setAuto] = useState(0);

	useEffect(() => {
		if (!playing) return;
		const id = setInterval(() => setTick((t) => t + 1), 180);
		return () => clearInterval(id);
	}, [playing]);

	useEffect(() => {
		if (progress !== undefined) return;
		const id = setInterval(() => setAuto((a) => (a + 0.008) % 1), 80);
		return () => clearInterval(id);
	}, [progress]);

	const p = progress !== undefined ? progress : auto;
	const playedIdx = Math.floor(p * bars);

	return (
		<div className="flex items-center gap-[2px] w-full" style={{ height }}>
			{base.map((v, i) => {
				const jitter = playing ? Math.sin((tick + i * 0.7) * 0.9) * 0.15 + 0.85 : 1;
				const h = Math.max(2, Math.round(v * jitter * height));
				const played = i < playedIdx;
				return (
					<div
						key={i}
						className="flex-1 transition-[height,background] duration-300"
						style={{
							height: h,
							background: played
								? 'var(--accent-deep, oklch(0.48 0.17 35))'
								: inverse
								? 'oklch(0.972 0.012 75)'
								: 'oklch(0.18 0.015 60)',
							opacity: played ? 1 : inverse ? 0.85 : 0.92,
						}}
					/>
				);
			})}
		</div>
	);
}

export function MiniWave({ count = 5 }: { count?: number }) {
	return (
		<span className="inline-flex items-end gap-[2px] h-[16px]">
			{Array.from({ length: count }).map((_, i) => (
				<span
					key={i}
					className="mini-wave-bar"
					style={{ animationDelay: `${i * 0.12}s`, height: 8 }}
				/>
			))}
		</span>
	);
}
