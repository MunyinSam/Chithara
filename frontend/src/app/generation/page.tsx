'use client';

/**
 * Drop in at: src/app/generation/page.tsx
 * Editorial / warm theme matching the new landing.
 * Same backend contract as before — POST /generate/, poll /history/:id/.
 */

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Textarea } from '@/src/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Waveform, MiniWave } from '@/src/components/landing/waveform';
import { ParticleField } from '@/src/components/landing/atmosphere';

const STYLES = [
	'Lo-fi',
	'Pop',
	'Hip-hop',
	'R&B',
	'Jazz',
	'Classical',
	'Rock',
	'Electronic',
	'Acoustic',
	'Cinematic',
];

const PROMPT_HINTS = [
	'a calm lo-fi beat for late night studying, melancholic but cozy',
	'cinematic strings over a beating heart',
	'summer convertible driving, golden hour',
	'a jazz quartet in an empty bar at 2am',
];

type Status = 'idle' | 'loading' | 'polling' | 'done' | 'error';

interface GenerationResult {
	history_id: number;
	task_id: string;
	status: string;
}
interface HistoryEntry {
	id: number;
	status: string;
	prompt_used: string;
	created_at: string;
	error_message?: string;
	song?: { id: number; title: string; genre: string; audio_file: string };
}

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

const ink = 'oklch(0.18 0.015 60)';
const ink2 = 'oklch(0.32 0.015 60)';
const mid = 'oklch(0.55 0.015 60)';
const rule = 'oklch(0.85 0.015 60)';
const paper = 'oklch(0.972 0.012 75)';
const paper2 = 'oklch(0.945 0.016 75)';
const accent = 'var(--accent, oklch(0.62 0.17 35))';
const accentDeep = 'var(--accent-deep, oklch(0.48 0.17 35))';

export default function GenerationPage() {
	const { data: session } = useSession();
	const tokenRef = useRef<string | undefined>(undefined);
	tokenRef.current = session?.backendToken;

	const [prompt, setPrompt] = useState('');
	const [style, setStyle] = useState('');
	const [title, setTitle] = useState('');
	const [instrumental, setInstrumental] = useState(false);
	const [status, setStatus] = useState<Status>('idle');
	const [error, setError] = useState('');
	const [result, setResult] = useState<HistoryEntry | null>(null);
	const [hint, setHint] = useState(0);
	const [credits, setCredits] = useState<number | null>(null);
	const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		const id = setInterval(
			() => setHint((h) => (h + 1) % PROMPT_HINTS.length),
			4500
		);
		return () => clearInterval(id);
	}, []);

	useEffect(() => {
		const token = tokenRef.current;
		if (!token) return;
		fetch(`${API}/generate/credits/`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => {
				if (data?.credits != null) setCredits(data.credits);
			})
			.catch(() => {});
	}, [session?.backendToken]);

	const stopPolling = () => {
		if (pollRef.current) clearInterval(pollRef.current);
	};

	const authHeaders = (): HeadersInit => ({
		'Content-Type': 'application/json',
		...(tokenRef.current
			? { Authorization: `Bearer ${tokenRef.current}` }
			: {}),
	});

	const pollHistory = (historyId: number) => {
		setStatus('polling');
		pollRef.current = setInterval(async () => {
			try {
				const res = await fetch(`${API}/history/${historyId}/`, {
					headers: authHeaders(),
				});
				const data: HistoryEntry = await res.json();
				if (data.status === 'COMPLETED') {
					stopPolling();
					setResult(data);
					setStatus('done');
				} else if (data.status === 'FAILED') {
					stopPolling();
					setError(data.error_message ?? 'Generation failed.');
					setStatus('error');
				}
			} catch {
				stopPolling();
				setError('Failed to check generation status.');
				setStatus('error');
			}
		}, 3000);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!prompt.trim() || !style || !title.trim()) return;
		setStatus('loading');
		setError('');
		setResult(null);
		try {
			const res = await fetch(`${API}/generate/`, {
				method: 'POST',
				headers: authHeaders(),
				body: JSON.stringify({ prompt, style, title, instrumental }),
			});
			if (!res.ok) throw new Error('Failed to start generation.');
			const data: GenerationResult = await res.json();
			pollHistory(data.history_id);
		} catch (err: unknown) {
			setError(
				err instanceof Error ? err.message : 'Something went wrong.'
			);
			setStatus('error');
		}
	};

	const isSubmitting = status === 'loading' || status === 'polling';

	const labelCls =
		'block font-mono text-[10px] tracking-[0.16em] uppercase mb-2.5';
	const inputCls =
		'w-full bg-transparent border-0 border-b border-[oklch(0.85_0.015_60)] focus:border-[oklch(0.18_0.015_60)] outline-none px-0 py-3 font-serif text-2xl placeholder:text-[oklch(0.55_0.015_60)] placeholder:italic transition-colors disabled:opacity-50';

	return (
		<div
			className="min-h-screen relative overflow-hidden"
			style={{ background: paper, color: ink }}
		>
			{/* Paper grain + vignette to match landing */}
			<div
				aria-hidden
				className="fixed inset-0 z-1 pointer-events-none mix-blend-multiply opacity-60"
				style={{
					backgroundImage:
						'radial-gradient(oklch(0.18 0.015 60 / 0.035) 1px, transparent 1px)',
					backgroundSize: '3px 3px',
				}}
			/>
			<div
				aria-hidden
				className="fixed inset-0 z-[1] pointer-events-none"
				style={{
					background:
						'radial-gradient(ellipse at 50% 0%, oklch(0.98 0.03 var(--accent-h, 35) / 0.35), transparent 60%)',
				}}
			/>

			<div className="relative z-[2]">
				{/* Top meta bar */}
				<div
					className="px-9 py-4 border-b flex justify-between font-mono text-[11px] tracking-widest uppercase"
					style={{ borderColor: rule, color: mid }}
				>
					<a href="/" className="inline-flex items-center gap-2.5">
						<span
							className="w-1.5 h-1.5 rounded-full pulse-dot"
							style={{ background: accent }}
						/>
						<span
							style={{
								color: ink,
								fontFamily:
									'"Instrument Serif", Georgia, serif',
								fontSize: 18,
								textTransform: 'none',
								letterSpacing: '-0.01em',
							}}
						>
							Chithara
						</span>
					</a>
					<span>The Composition Desk · № 042</span>
					<a href="/library" className="under-link">
						Library →
					</a>
				</div>

				<div className="max-w-[920px] mx-auto px-9 py-16 relative">
					{/* Section header */}
					<div
						className="grid md:grid-cols-[1fr_2fr] gap-10 pb-8 border-b-2 mb-12 items-end"
						style={{ borderColor: ink }}
					>
						<div
							className="font-serif italic leading-[0.8] text-[100px]"
							style={{ color: accentDeep }}
						>
							§ 03
						</div>
						<div>
							<h1
								className="font-serif font-normal leading-[1.1] tracking-[-0.025em] m-0"
								style={{ fontSize: 'clamp(48px, 6vw, 88px)' }}
							>
								Compose a{' '}
								<span
									className="italic"
									style={{ color: accentDeep }}
								>
									song
								</span>
								.
							</h1>
							<p
								className="font-mono text-[11px] tracking-widest uppercase mt-3"
								style={{ color: mid }}
							>
								One sentence in · one song out ·{' '}
								{Math.floor(Math.random() * 6) + 5} sec average
							</p>
						</div>
					</div>

					{/* Form — editorial, no card chrome */}
					<form
						onSubmit={handleSubmit}
						className="space-y-10 relative"
					>
						{/* Title field */}
						<div>
							<label className={labelCls} style={{ color: mid }}>
								I · Working title
							</label>
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Midnight Library"
								className={inputCls}
								disabled={isSubmitting}
							/>
						</div>

						{/* Prompt field */}
						<div>
							<label className={labelCls} style={{ color: mid }}>
								II · The prompt
							</label>
							<div className="relative">
								<Textarea
									value={prompt}
									onChange={(e) => setPrompt(e.target.value)}
									placeholder={PROMPT_HINTS[hint]}
									className="resize-none min-h-32 w-full bg-transparent border border-dashed rounded-none font-serif italic text-[22px] leading-snug px-4 py-4 focus-visible:ring-0 focus-visible:border-solid placeholder:italic"
									style={{ borderColor: rule, color: ink2 }}
									disabled={isSubmitting}
								/>
								<span
									className="absolute -top-2 left-3 px-1.5 font-mono text-[9px] tracking-[0.16em] uppercase not-italic"
									style={{ background: paper, color: mid }}
								>
									Describe a feeling, a moment, a vibe
								</span>
								<div
									className="flex justify-between mt-2 font-mono text-[10px] tracking-widest uppercase"
									style={{ color: mid }}
								>
									<span>{prompt.length} chars</span>
									<span>
										≈{' '}
										{Math.max(
											1,
											Math.ceil(prompt.length / 5)
										)}{' '}
										words
									</span>
								</div>
							</div>
						</div>

						{/* Style chips */}
						<div>
							<label className={labelCls} style={{ color: mid }}>
								III · Style
							</label>
							<div className="flex flex-wrap gap-2">
								{STYLES.map((s) => (
									<button
										key={s}
										type="button"
										onClick={() => setStyle(s)}
										disabled={isSubmitting}
										className={cn(
											'font-mono text-[10px] tracking-wider uppercase px-3 py-2 border rounded-full transition-all',
											style === s
												? 'shadow-sm'
												: 'hover:bg-[oklch(0.945_0.016_75)]'
										)}
										style={{
											background:
												style === s
													? ink
													: 'transparent',
											color: style === s ? paper : ink2,
											borderColor:
												style === s ? ink : rule,
										}}
									>
										{s}
									</button>
								))}
							</div>
						</div>

						{/* Instrumental */}
						<div
							className="flex items-center justify-between border-t border-b py-5"
							style={{ borderColor: rule }}
						>
							<div>
								<div
									className="font-serif italic text-xl"
									style={{ color: ink }}
								>
									Instrumental only
								</div>
								<div
									className="font-mono text-[10px] tracking-widest uppercase mt-1"
									style={{ color: mid }}
								>
									No vocals · score-style render
								</div>
							</div>
							<button
								type="button"
								role="switch"
								aria-checked={instrumental}
								onClick={() => setInstrumental((v) => !v)}
								disabled={isSubmitting}
								className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer border transition-colors disabled:opacity-50"
								style={{
									background: instrumental ? ink : paper2,
									borderColor: instrumental ? ink : rule,
									borderRadius: 999,
								}}
							>
								<span
									className="pointer-events-none inline-block size-5 transform transition-transform"
									style={{
										borderRadius: 999,
										background: instrumental
											? accent
											: ink2,
										transform: instrumental
											? 'translateX(28px) translateY(2px)'
											: 'translateX(2px) translateY(2px)',
									}}
								/>
							</button>
						</div>

						{/* Submit */}
						<div className="flex items-center justify-between gap-6 flex-wrap pt-2">
							<div
								className="font-mono text-[10px] tracking-widest uppercase flex items-center gap-5"
								style={{ color: mid }}
							>
								<span className="inline-flex items-center gap-2">
									<span
										className="w-1.5 h-1.5 rounded-full pulse-dot inline-block"
										style={{ background: accent }}
									/>
									47 render nodes online
								</span>
								{credits !== null && (
									<span className="inline-flex items-center gap-2">
										<span
											className="w-1.5 h-1.5 rounded-full inline-block"
											style={{ background: accentDeep }}
										/>
										{credits} Suno credits left
									</span>
								)}
							</div>
							<button
								type="submit"
								disabled={
									isSubmitting ||
									!prompt.trim() ||
									!style ||
									!title.trim()
								}
								className="inline-flex items-center gap-2.5 px-7 py-3.5 font-mono text-[11px] tracking-[0.14em] uppercase border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
								style={{
									background: ink,
									color: paper,
									borderColor: ink,
								}}
							>
								{status === 'loading'
									? 'Submitting…'
									: status === 'polling'
										? 'Generating…'
										: 'Score this song →'}
							</button>
						</div>
					</form>

					{/* Polling state */}
					{status === 'polling' && (
						<div
							className="mt-12 border p-8 relative overflow-hidden"
							style={{ borderColor: rule, background: paper2 }}
						>
							<ParticleField />
							<div className="relative z-10">
								<div
									className="flex justify-between items-center pb-3 border-b font-mono text-[10px] tracking-widest uppercase mb-5"
									style={{ borderColor: rule, color: mid }}
								>
									<span
										className="inline-flex items-center gap-1.5"
										style={{ color: accentDeep }}
									>
										<span
											className="w-1.5 h-1.5 rounded-full pulse-dot"
											style={{ background: accent }}
										/>
										Rendering
									</span>
									<span>Estimated · 20–60 sec</span>
								</div>
								<div className="font-serif text-[44px] leading-[1.15] mb-2">
									Your song is being{' '}
									<span
										className="italic"
										style={{ color: accentDeep }}
									>
										composed
									</span>
									.
								</div>
								<p
									className="font-serif italic text-lg mb-5"
									style={{ color: ink2 }}
								>
									"{prompt}"
								</p>
								<Waveform
									bars={64}
									seed={Date.now() % 1000}
									playing
									height={70}
								/>
								<div
									className="flex justify-between mt-3 font-mono text-[10px] tracking-widest uppercase"
									style={{ color: mid }}
								>
									<span>STYLE · {style}</span>
									<span className="inline-flex items-center gap-2">
										listening for a melody{' '}
										<MiniWave count={3} />
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Error */}
					{status === 'error' && (
						<div
							className="mt-12 border-2 p-6 relative"
							style={{ borderColor: ink, background: paper }}
						>
							<div
								className="font-mono text-[10px] tracking-widest uppercase mb-2"
								style={{ color: accentDeep }}
							>
								Errata · take two
							</div>
							<div className="font-serif text-3xl leading-tight mb-2">
								Something went{' '}
								<span
									className="italic"
									style={{ color: accentDeep }}
								>
									sideways
								</span>
								.
							</div>
							<p
								className="font-serif italic"
								style={{ color: ink2 }}
							>
								{error}
							</p>
							<button
								onClick={() => setStatus('idle')}
								className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase under-link"
								style={{ color: ink }}
							>
								Try again →
							</button>
						</div>
					)}

					{/* Result */}
					{status === 'done' && result?.song && (
						<div
							className="mt-12 border p-7 relative"
							style={{ borderColor: rule, background: paper2 }}
						>
							<div
								className="flex justify-between items-center pb-3 border-b font-mono text-[10px] tracking-widest uppercase mb-5"
								style={{ borderColor: rule, color: mid }}
							>
								<span>
									Specimen №{' '}
									{String(result.id).padStart(4, '0')}
								</span>
								<span
									className="inline-flex items-center gap-1.5"
									style={{ color: accentDeep }}
								>
									<span
										className="w-1.5 h-1.5 rounded-full pulse-dot"
										style={{ background: accent }}
									/>
									Now playing
								</span>
							</div>
							<div className="font-serif text-[48px] leading-[1.15]">
								{result.song.title
									.split(' ')
									.slice(0, -1)
									.join(' ')}{' '}
								<span
									className="italic"
									style={{ color: accentDeep }}
								>
									{result.song.title.split(' ').slice(-1)[0]}
								</span>
							</div>
							<p
								className="font-serif italic text-lg mt-2"
								style={{ color: ink2 }}
							>
								{result.song.genre}
							</p>

							<div
								className="mt-6 border-t border-b py-5 my-5"
								style={{ borderColor: rule }}
							>
								<audio
									controls
									src={result.song.audio_file}
									className="w-full"
								/>
							</div>

							<div className="flex gap-3 flex-wrap">
								<a
									href={result.song.audio_file}
									download
									className="inline-flex items-center gap-2 px-5 py-3 font-mono text-[11px] tracking-[0.14em] uppercase border transition-all"
									style={{
										background: ink,
										color: paper,
										borderColor: ink,
									}}
								>
									Download →
								</a>
								<a
									href="/library"
									className="inline-flex items-center gap-2 px-5 py-3 font-mono text-[11px] tracking-[0.14em] uppercase border transition-all hover:bg-[oklch(0.945_0.016_75)]"
									style={{ borderColor: ink, color: ink }}
								>
									View library
								</a>
								<button
									type="button"
									onClick={() => {
										setStatus('idle');
										setResult(null);
										setPrompt('');
										setTitle('');
									}}
									className="inline-flex items-center gap-2 px-5 py-3 font-mono text-[11px] tracking-[0.14em] uppercase under-link"
									style={{ color: ink2 }}
								>
									Compose another
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
