'use client';

import { useEffect, useState } from 'react';
import { Waveform } from './waveform';

// ——— How-it-works step vizzes ———

export function StepOneViz() {
	const texts = ['a calm lofi beat', 'cinematic strings', 'golden hour drive'];
	const [i, setI] = useState(0);
	const [sub, setSub] = useState(0);
	const [del, setDel] = useState(false);
	useEffect(() => {
		const full = texts[i];
		let t: ReturnType<typeof setTimeout>;
		if (!del && sub < full.length) t = setTimeout(() => setSub(sub + 1), 70);
		else if (!del && sub === full.length) t = setTimeout(() => setDel(true), 1500);
		else if (del && sub > 0) t = setTimeout(() => setSub(sub - 1), 35);
		else {
			setDel(false);
			setI((i + 1) % texts.length);
		}
		return () => clearTimeout(t);
	}, [sub, del, i]);
	return (
		<div
			className="absolute inset-0 flex items-center px-4 font-serif italic text-base"
			style={{ color: 'oklch(0.85 0.015 60)' }}
		>
			<span>
				&gt; {texts[i].slice(0, sub)}
				<span
					className="caret-blink inline-block w-[2px] h-[1em] align-middle ml-1"
					style={{ background: 'var(--accent, oklch(0.62 0.17 35))' }}
				/>
			</span>
		</div>
	);
}

export function StepTwoViz() {
	const chips = ['Lofi', 'Jazz', 'Pop', 'Ambient', 'Cinematic', 'Folk'];
	const [active, setActive] = useState(0);
	useEffect(() => {
		const id = setInterval(() => setActive((a) => (a + 1) % chips.length), 900);
		return () => clearInterval(id);
	}, []);
	return (
		<div className="absolute inset-0 p-4 flex flex-wrap gap-1.5 items-center justify-center content-center">
			{chips.map((c, i) => (
				<span
					key={c}
					className="font-mono text-[9px] tracking-wider uppercase px-2 py-1 border rounded-full transition-all duration-300"
					style={{
						background: i === active ? 'var(--accent, oklch(0.62 0.17 35))' : 'transparent',
						borderColor: i === active ? 'var(--accent, oklch(0.62 0.17 35))' : 'oklch(0.5 0.02 60)',
						color: i === active ? 'oklch(0.18 0.015 60)' : 'oklch(0.78 0.015 60)',
						transform: i === active ? 'scale(1.1)' : 'scale(1)',
					}}
				>
					{c}
				</span>
			))}
		</div>
	);
}

export function StepThreeViz() {
	const [now, setNow] = useState(0);
	useEffect(() => {
		const id = setInterval(() => setNow((n) => (n + 0.012) % 1), 120);
		return () => clearInterval(id);
	}, []);
	return (
		<div className="absolute inset-0 flex items-center px-3">
			<Waveform bars={48} seed={123} playing inverse height={60} progress={now} />
		</div>
	);
}

// ——— Feature vizzes ———

export function FeatureTextToMusicViz() {
	return (
		<div className="absolute inset-0 p-4 flex flex-col justify-between">
			<p className="font-mono text-[9px] tracking-widest text-[oklch(0.55_0.015_60)]">INPUT</p>
			<p className="font-serif italic text-[14px] text-[oklch(0.32_0.015_60)] leading-tight">
				"a rainy afternoon in Lisbon, vinyl crackle"
			</p>
			<div className="flex justify-between items-center">
				<p
					className="font-mono text-[9px] tracking-widest"
					style={{ color: 'var(--accent-deep, oklch(0.48 0.17 35))' }}
				>
					→ OUTPUT
				</p>
				<div className="flex items-end gap-[2px] h-4">
					{[4, 8, 12, 10, 14, 8, 12, 6, 10, 14].map((h, i) => (
						<div
							key={i}
							className="mini-wave-bar"
							style={{ height: h, animationDelay: `${i * 0.1}s` }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export function FeatureLibraryViz() {
	const items = [
		{ title: 'Ocean floor', meta: '02:41 · ambient', offset: 0 },
		{ title: 'A slow goodbye', meta: '03:12 · strings', offset: 10 },
		{ title: 'Summer st.', meta: '02:05 · indie pop', offset: 20 },
	];
	return (
		<div className="absolute inset-0 p-4 flex flex-col gap-1.5 justify-center">
			{items.map((it, i) => (
				<div
					key={i}
					className="border border-[oklch(0.85_0.015_60)] bg-[oklch(0.972_0.012_75)] px-3 py-2 flex items-center justify-between"
					style={{ marginLeft: it.offset, transform: `rotate(${(i - 1) * 0.3}deg)` }}
				>
					<div className="flex items-center gap-2">
						<div className="w-6 h-6 flex items-center justify-center border border-[oklch(0.85_0.015_60)] font-mono text-[8px] text-[oklch(0.55_0.015_60)]">
							{String(i + 1).padStart(2, '0')}
						</div>
						<div>
							<div className="font-serif italic text-sm leading-none text-[oklch(0.18_0.015_60)]">
								{it.title}
							</div>
							<div className="font-mono text-[8px] tracking-wider text-[oklch(0.55_0.015_60)] mt-0.5">
								{it.meta}
							</div>
						</div>
					</div>
					<span className="font-mono text-[9px] text-[oklch(0.55_0.015_60)]">♥</span>
				</div>
			))}
		</div>
	);
}

export function FeatureHistoryViz() {
	const nodes = [8, 14, 22, 18, 28, 24, 34];
	return (
		<div className="absolute inset-0 p-4 flex items-end justify-between gap-1">
			{nodes.map((h, i) => (
				<div key={i} className="flex-1 flex flex-col items-center gap-1.5">
					<div className="w-full border-b border-[oklch(0.85_0.015_60)] h-0 mb-1" />
					<div
						className="w-full"
						style={{
							height: h * 2,
							background:
								i === nodes.length - 1
									? 'var(--accent-deep, oklch(0.48 0.17 35))'
									: 'oklch(0.18 0.015 60)',
							opacity: 0.4 + (i / nodes.length) * 0.6,
						}}
					/>
					<div className="font-mono text-[7px] text-[oklch(0.55_0.015_60)]">
						{String(i + 1).padStart(2, '0')}
					</div>
				</div>
			))}
		</div>
	);
}
