'use client';

import { cn } from '@/lib/utils';
import { MiniWave } from './waveform';

const PROMPTS = [
	'a calm lofi beat for studying',
	'cinematic strings over a beating heart',
	'summer convertible, golden hour',
	'a jazz quartet in an empty bar',
	'ambient synth for a long walk home',
	'upbeat pop about first crushes',
	'Sunday morning kitchen light',
	'a lullaby for a restless city',
	'8-bit chiptune boss fight',
	'rainy afternoon in Lisbon',
	'folk guitar, porch at dusk',
	'neon-soaked 80s synthwave',
	'a slow goodbye at the airport',
	'ambient drone for deep focus',
];

function PromptCard({ text, q }: { text: string; q: string }) {
	return (
		<div className="flex-shrink-0 flex items-center gap-3.5 px-5 py-3 border border-[oklch(0.85_0.015_60)] bg-[oklch(0.972_0.012_75)] font-serif italic text-[20px] text-[oklch(0.32_0.015_60)] whitespace-nowrap transition-colors duration-300 hover:bg-[oklch(0.18_0.015_60)] hover:text-[oklch(0.972_0.012_75)] hover:border-[oklch(0.18_0.015_60)]">
			<span
				className="font-mono text-[11px] tracking-wider not-italic"
				style={{ color: 'var(--accent-deep, oklch(0.48 0.17 35))' }}
			>
				{q}
			</span>
			&ldquo;{text}&rdquo;
			<MiniWave count={4} />
		</div>
	);
}

function Row({
	items,
	reverse,
	prefix,
}: {
	items: string[];
	reverse?: boolean;
	prefix: string;
}) {
	const doubled = [...items, ...items];
	return (
		<div className="flex overflow-hidden gap-4">
			<div
				className={cn(
					'flex gap-4 flex-shrink-0 pr-4',
					reverse ? 'marquee-track-reverse' : 'marquee-track'
				)}
			>
				{doubled.map((t, i) => (
					<PromptCard
						key={i}
						text={t}
						q={`${prefix}${String((i % items.length) + 1).padStart(3, '0')}`}
					/>
				))}
			</div>
		</div>
	);
}

export function PromptMarquee() {
	const half = Math.ceil(PROMPTS.length / 2);
	return (
		<section
			id="library"
			className="py-20 bg-[oklch(0.972_0.012_75)] border-y border-[oklch(0.85_0.015_60)] overflow-hidden flex flex-col gap-4 relative"
		>
			<p className="text-center font-mono text-[11px] tracking-[0.2em] uppercase text-[oklch(0.55_0.015_60)] mb-2">
				Recently scored · a glimpse of the library
			</p>
			<Row items={PROMPTS.slice(0, half)} prefix="Q/" />
			<Row items={PROMPTS.slice(half)} reverse prefix="R/" />
		</section>
	);
}
