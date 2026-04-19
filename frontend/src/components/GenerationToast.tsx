'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useGeneration } from '@/src/contexts/GenerationContext';

const ink = 'oklch(0.18 0.015 60)';
const mid = 'oklch(0.55 0.015 60)';
const paper = 'oklch(0.972 0.012 75)';
const rule = 'oklch(0.85 0.015 60)';
const accent = 'var(--accent, oklch(0.62 0.17 35))';
const accentDeep = 'var(--accent-deep, oklch(0.48 0.17 35))';

export function GenerationToast() {
	const { status, prompt, result, error, dismiss } = useGeneration();
	const pathname = usePathname();

	// Don't show on the generation page itself — the page has its own UI
	if (pathname === '/generation') return null;
	if (status === 'idle') return null;

	return (
		<div
			className="fixed bottom-6 right-6 z-[100] w-[320px] border shadow-xl"
			style={{ background: paper, borderColor: ink }}
		>
			{/* Header bar */}
			<div
				className="flex items-center justify-between px-4 py-2.5 border-b font-mono text-[9px] tracking-[0.18em] uppercase"
				style={{ borderColor: rule, color: mid }}
			>
				<span className="inline-flex items-center gap-2">
					{(status === 'loading' || status === 'polling') && (
						<span
							className="w-1.5 h-1.5 rounded-full pulse-dot shrink-0"
							style={{ background: accent }}
						/>
					)}
					{status === 'done' && (
						<span
							className="w-1.5 h-1.5 rounded-full shrink-0"
							style={{ background: accentDeep }}
						/>
					)}
					{status === 'error' && (
						<span
							className="w-1.5 h-1.5 rounded-full shrink-0"
							style={{ background: 'oklch(0.55 0.18 25)' }}
						/>
					)}
					{status === 'loading' || status === 'polling'
						? 'Composing your song…'
						: status === 'done'
							? 'Song ready'
							: 'Generation failed'}
				</span>
				<button
					onClick={dismiss}
					className="opacity-50 hover:opacity-100 transition-opacity text-base leading-none"
					aria-label="Dismiss"
					style={{ color: ink }}
				>
					×
				</button>
			</div>

			{/* Body */}
			<div className="px-4 py-3">
				{(status === 'loading' || status === 'polling') && (
					<>
						<p
							className="font-serif italic text-[15px] leading-snug line-clamp-2"
							style={{ color: ink }}
						>
							&ldquo;{prompt}&rdquo;
						</p>
						<p
							className="font-mono text-[9px] tracking-widest uppercase mt-2"
							style={{ color: mid }}
						>
							{status === 'loading' ? 'Submitting…' : 'Please wait · 2–8 minutes'}
						</p>
						{/* Animated bar */}
						<div
							className="mt-3 h-0.5 w-full overflow-hidden rounded-full"
							style={{ background: rule }}
						>
							<div
								className="h-full rounded-full animate-pulse"
								style={{ background: accentDeep, width: '60%' }}
							/>
						</div>
					</>
				)}

				{status === 'done' && result?.song && (
					<>
						<p
							className="font-serif text-[17px] leading-snug"
							style={{ color: ink }}
						>
							{result.song.title}
						</p>
						<p
							className="font-mono text-[9px] tracking-widest uppercase mt-1"
							style={{ color: mid }}
						>
							{result.song.genre || 'Unknown genre'}
						</p>
						<div className="flex gap-2 mt-3">
							<Link
								href="/library"
								onClick={dismiss}
								className="font-mono text-[9px] tracking-widest uppercase px-3 py-2 border transition-colors"
								style={{ background: ink, color: paper, borderColor: ink }}
							>
								Open library →
							</Link>
							<button
								onClick={dismiss}
								className="font-mono text-[9px] tracking-widest uppercase px-3 py-2 border transition-colors"
								style={{ borderColor: rule, color: mid }}
							>
								Dismiss
							</button>
						</div>
					</>
				)}

				{status === 'error' && (
					<>
						<p
							className="font-serif italic text-[14px] leading-snug"
							style={{ color: 'oklch(0.45 0.18 25)' }}
						>
							{error}
						</p>
						<Link
							href="/generation"
							onClick={dismiss}
							className="inline-block font-mono text-[9px] tracking-widest uppercase mt-3 underline"
							style={{ color: ink }}
						>
							Try again →
						</Link>
					</>
				)}
			</div>
		</div>
	);
}
