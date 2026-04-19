'use client';

import Link from 'next/link';
import { Music } from 'lucide-react';
import { buttonVariants } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/src/components/ui/card';
import { Separator } from '@/src/components/ui/separator';
import { cn } from '@/lib/utils';

import {
	FloatingNotes,
	ParticleField,
} from '@/src/components/landing/atmosphere';
import { HeroSpecimen } from '@/src/components/landing/hero-specimen';
import { Ticker } from '@/src/components/landing/ticker';
import { PromptMarquee } from '@/src/components/landing/prompt-marquee';
import {
	StepOneViz,
	StepTwoViz,
	StepThreeViz,
	FeatureTextToMusicViz,
	FeatureLibraryViz,
	FeatureHistoryViz,
} from '@/src/components/landing/vizzes';

const FEATURES = [
	{
		num: '01',
		title: 'Text to',
		em: 'Music',
		body: "Describe any song in plain English. Chithara interprets genre, mood, tempo, and instrumentation — so you don't have to.",
		tag: 'The prompt box',
		Viz: FeatureTextToMusicViz,
	},
	{
		num: '02',
		title: 'Your',
		em: 'Library',
		body: 'Every song is filed under your name. Keep them private, share a link, or press a limited run.',
		tag: 'Personal shelf',
		Viz: FeatureLibraryViz,
	},
	{
		num: '03',
		title: 'Generation',
		em: 'History',
		body: "Every prompt you've tried, every variation you've bookmarked. Revisit a line from last week and remix it tonight.",
		tag: 'A working notebook',
		Viz: FeatureHistoryViz,
	},
];

const STEPS = [
	{
		n: '01',
		label: 'Step one',
		title: 'Write a',
		em: 'line',
		desc: 'Type what you hear in your head. "A calm lofi beat for studying." "Upbeat pop about first love." Anything.',
		Viz: StepOneViz,
	},
	{
		n: '02',
		label: 'Step two',
		title: 'Pick a',
		em: 'style',
		desc: 'Nudge the AI with genre and vibe chips — or skip this step entirely and let Chithara decide.',
		Viz: StepTwoViz,
	},
	{
		n: '03',
		label: 'Step three',
		title: 'Listen,',
		em: 'save, share',
		desc: 'Your song renders in seconds. Save it to your library, send it to a friend, or generate a variation on the spot.',
		Viz: StepThreeViz,
	},
];

export default function Home() {
	return (
		<div className="min-h-screen bg-[oklch(0.972_0.012_75)] text-[oklch(0.18_0.015_60)] font-serif overflow-x-hidden relative">
			{/* Paper grain + warm vignette */}
			<div
				aria-hidden
				className="fixed inset-0 z-[1] pointer-events-none mix-blend-multiply opacity-60"
				style={{
					backgroundImage:
						'radial-gradient(oklch(0.18 0.015 60 / 0.035) 1px, transparent 1px)',
					backgroundSize: '3px 3px',
				}}
			/>
			<div
				aria-hidden
				className="fixed inset-0 z-1 pointer-events-none"
				style={{
					background:
						'radial-gradient(ellipse at 50% 0%, oklch(0.98 0.03 var(--accent-h, 35) / 0.35), transparent 60%), radial-gradient(ellipse at 100% 100%, oklch(0.92 0.05 var(--accent-h, 35) / 0.25), transparent 50%)',
				}}
			/>

			<div className="relative z-2">
				{/* Hero */}
				<section className="relative px-9 pt-8 pb-6 overflow-hidden h-[calc(100dvh-65px)] flex flex-col">
					<ParticleField />

					<div className="grid md:grid-cols-2 gap-10 items-center flex-1 relative z-10 pt-4">
						<div className="relative">
							<FloatingNotes />
							<Badge
								variant="outline"
								className="mb-4 uppercase tracking-[0.16em] border-0 rounded-none p-0 font-mono text-[11px]"
								style={{
									color: 'var(--accent-deep, oklch(0.48 0.17 35))',
								}}
							>
								<span
									className="w-8 h-px inline-block mr-2.5"
									style={{
										background:
											'var(--accent-deep, oklch(0.48 0.17 35))',
									}}
								/>
								A.I. Music Generation · Chapter One
							</Badge>
							<h1
								className="font-serif font-normal leading-[0.88] tracking-[-0.025em] m-0"
								style={{ fontSize: 'clamp(56px, 7vw, 120px)' }}
							>
								Turn your
								<br />
								<span
									className="italic"
									style={{
										color: 'var(--accent-deep, oklch(0.48 0.17 35))',
									}}
								>
									words
								</span>
								<br />
								into{' '}
								<span className="mark-underline">music</span>.
							</h1>
							<p className="font-serif italic text-xl leading-snug text-[oklch(0.32_0.015_60)] max-w-[28ch] mt-5 mb-5">
								Describe a feeling, a moment, a vibe — Chithara
								scores it for you. No instruments, no studio, no
								theory. Just a sentence and a song.
							</p>
							<div className="flex gap-3.5 items-center flex-wrap">
								<Link
									href="/generation"
									className={cn(
										buttonVariants({ size: 'lg' }),
										'font-mono text-[11px] tracking-[0.14em] uppercase rounded-none bg-[oklch(0.18_0.015_60)] text-[oklch(0.972_0.012_75)] hover:bg-[var(--accent-deep,oklch(0.48_0.17_35))] hover:border-[var(--accent-deep,oklch(0.48_0.17_35))] px-6'
									)}
								>
									Generate a song →
								</Link>
								<a
									href="#how"
									className={cn(
										buttonVariants({
											variant: 'outline',
											size: 'lg',
										}),
										'font-mono text-[11px] tracking-[0.14em] uppercase rounded-none border-[oklch(0.18_0.015_60)] text-[oklch(0.18_0.015_60)] bg-transparent hover:bg-[oklch(0.18_0.015_60)] hover:text-[oklch(0.972_0.012_75)] px-6'
									)}
								>
									Read how it works
								</a>
							</div>
							<div className="mt-6 flex items-center gap-6 font-mono text-[10px] tracking-widest uppercase text-[oklch(0.55_0.015_60)]">
								<span className="inline-flex items-center gap-2">
									<span
										className="w-1.5 h-1.5 rounded-full pulse-dot"
										style={{
											background:
												'var(--accent, oklch(0.62 0.17 35))',
										}}
									/>
									X songs scored today
								</span>
								<span className="hidden sm:inline">/</span>
								<span className="hidden sm:inline">
									Average render · Y sec
								</span>
							</div>
						</div>

						<HeroSpecimen />
					</div>
				</section>

				<Ticker />

				{/* Features */}
				<section
					id="features"
					className="relative px-9 py-28 max-w-[1400px] mx-auto"
				>
					<div className="grid md:grid-cols-[1fr_2fr] gap-12 pb-10 border-b-2 border-[oklch(0.18_0.015_60)] mb-14 items-end">
						<div
							className="font-serif italic leading-[0.8] text-[100px]"
							style={{
								color: 'var(--accent-deep, oklch(0.48 0.17 35))',
							}}
						>
							§ 01
						</div>
						<div>
							<h2
								className="font-serif font-normal leading-none tracking-tight m-0"
								style={{ fontSize: 'clamp(44px, 5vw, 72px)' }}
							>
								Everything you need,{' '}
								<span
									className="italic"
									style={{
										color: 'var(--accent-deep, oklch(0.48 0.17 35))',
									}}
								>
									nothing you don&apos;t
								</span>
								.
							</h2>
							<p className="font-mono text-[11px] tracking-widest uppercase text-[oklch(0.55_0.015_60)] mt-3">
								Three tools · one song · zero friction
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 border-t border-[oklch(0.85_0.015_60)]">
						{FEATURES.map((f, i) => (
							<Card
								key={f.num}
								className={cn(
									'p-9 rounded-none border-0 border-b border-[oklch(0.85_0.015_60)] min-h-[440px] flex flex-col overflow-hidden transition-colors duration-300 hover:bg-[oklch(0.945_0.016_75)]',
									i < FEATURES.length - 1 &&
										'md:border-r border-[oklch(0.85_0.015_60)]'
								)}
							>
								<CardHeader className="p-0">
									<p className="font-mono text-[10px] tracking-widest text-[oklch(0.55_0.015_60)] mb-6">
										№ {f.num} / 03
									</p>
									<div className="relative h-35 mb-7 border border-[oklch(0.85_0.015_60)] bg-[oklch(0.945_0.016_75)] overflow-hidden">
										<f.Viz />
									</div>
									<CardTitle className="font-serif font-normal text-[38px] leading-none tracking-tight m-0 mb-3.5">
										{f.title}{' '}
										<span
											className="italic"
											style={{
												color: 'var(--accent-deep, oklch(0.48 0.17 35))',
											}}
										>
											{f.em}
										</span>
									</CardTitle>
								</CardHeader>
								<CardContent className="p-0 flex flex-col flex-1">
									<p className="text-base leading-relaxed text-[oklch(0.32_0.015_60)] max-w-[32ch] mb-5">
										{f.body}
									</p>
									<div
										className="mt-auto font-mono text-[10px] tracking-widest uppercase inline-flex items-center gap-2"
										style={{
											color: 'var(--accent-deep, oklch(0.48 0.17 35))',
										}}
									>
										<span
											className="w-5 h-px"
											style={{
												background:
													'var(--accent-deep, oklch(0.48 0.17 35))',
											}}
										/>
										{f.tag}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<Separator />

				{/* How */}
				<section
					id="how"
					className="relative py-28 px-9 overflow-hidden bg-[oklch(0.18_0.015_60)] text-[oklch(0.972_0.012_75)]"
				>
					<div className="grid md:grid-cols-[1fr_2fr] gap-12 pb-10 border-b-2 border-[oklch(0.972_0.012_75)] mb-14 items-end max-w-[1400px] mx-auto">
						<div
							className="font-serif italic leading-[0.8] text-[100px]"
							style={{
								color: 'var(--accent, oklch(0.62 0.17 35))',
							}}
						>
							§ 02
						</div>
						<div>
							<h2
								className="font-serif font-normal leading-none tracking-tight m-0"
								style={{ fontSize: 'clamp(44px, 5vw, 72px)' }}
							>
								Three steps.{' '}
								<span
									className="italic"
									style={{
										color: 'var(--accent, oklch(0.62 0.17 35))',
									}}
								>
									One song
								</span>
								.
							</h2>
							<p className="font-mono text-[11px] tracking-widest uppercase text-[oklch(0.7_0.02_60)] mt-3">
								Average time from prompt to playback · 7.2
								seconds
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 max-w-[1400px] mx-auto border-t border-[oklch(0.35_0.02_60)]">
						{STEPS.map((s, i) => (
							<div
								key={s.n}
								className={cn(
									'p-10 min-h-[520px] flex flex-col relative',
									i < STEPS.length - 1 &&
										'md:border-r border-[oklch(0.35_0.02_60)]'
								)}
							>
								<div
									className="relative font-serif italic leading-[0.82] tracking-[-0.04em] mb-5"
									style={{
										color: 'var(--accent, oklch(0.62 0.17 35))',
										fontSize: '180px',
									}}
								>
									{s.n}
									<span className="absolute top-3 right-0 font-mono not-italic text-[10px] tracking-widest uppercase text-[oklch(0.7_0.02_60)]">
										{s.label}
									</span>
								</div>
								<h3 className="font-serif font-normal text-[38px] leading-none m-0 mb-3.5">
									{s.title}{' '}
									<span
										className="italic"
										style={{
											color: 'var(--accent, oklch(0.62 0.17 35))',
										}}
									>
										{s.em}
									</span>
								</h3>
								<p className="text-base leading-relaxed m-0 mb-7 max-w-[32ch] text-[oklch(0.78_0.015_60)]">
									{s.desc}
								</p>
								<div className="mt-auto h-[120px] border border-[oklch(0.35_0.02_60)] bg-[oklch(0.22_0.015_60)] relative overflow-hidden">
									<s.Viz />
								</div>
							</div>
						))}
					</div>
				</section>

				<PromptMarquee />

				{/* CTA */}
				<section className="py-36 px-9 text-center relative overflow-hidden">
					<p
						className="font-mono text-[11px] tracking-widest uppercase mb-6"
						style={{
							color: 'var(--accent-deep, oklch(0.48 0.17 35))',
						}}
					>
						<span className="inline-flex items-center gap-2.5">
							<span
								className="w-8 h-px inline-block"
								style={{
									background:
										'var(--accent-deep, oklch(0.48 0.17 35))',
								}}
							/>
							And now · over to you
							<span
								className="w-8 h-px inline-block"
								style={{
									background:
										'var(--accent-deep, oklch(0.48 0.17 35))',
								}}
							/>
						</span>
					</p>
					<h2
						className="font-serif font-normal leading-[0.9] tracking-[-0.025em] m-0 mb-6"
						style={{ fontSize: 'clamp(56px, 8vw, 140px)' }}
					>
						Your first{' '}
						<span
							className="italic"
							style={{
								color: 'var(--accent-deep, oklch(0.48 0.17 35))',
							}}
						>
							song
						</span>
						<br />
						is one <span className="mark-underline">
							sentence
						</span>{' '}
						away.
					</h2>
					<p className="font-serif italic text-2xl text-[oklch(0.32_0.015_60)] m-0 mb-10">
						No instruments. No studio. Just type and listen.
					</p>
					<Link
						href="/generation"
						className={cn(
							buttonVariants({ size: 'lg' }),
							'font-mono text-[11px] tracking-[0.14em] uppercase rounded-none bg-[oklch(0.18_0.015_60)] text-[oklch(0.972_0.012_75)] hover:bg-[var(--accent-deep,oklch(0.48_0.17_35))] px-10'
						)}
					>
						Generate a song — it&apos;s free →
					</Link>
				</section>

				{/* Footer */}
				<footer className="px-9 py-10 border-t-2 border-[oklch(0.18_0.015_60)] grid md:grid-cols-3 gap-8 items-start font-mono text-[11px] tracking-wider uppercase text-[oklch(0.55_0.015_60)]">
					<div>
						<div className="font-serif text-[28px] tracking-tight text-[oklch(0.18_0.015_60)] normal-case inline-flex items-center gap-2.5">
							<Music
								className="w-5 h-5"
								style={{
									color: 'var(--accent, oklch(0.62 0.17 35))',
								}}
							/>
							Chithara
						</div>
						<p className="mt-3 font-mono text-[10px] tracking-widest">
							© 2026 · a journal of generated music
						</p>
					</div>
					<div className="flex flex-wrap gap-4 md:gap-6 justify-start md:justify-center">
						<a className="under-link" href="#">
							Generate
						</a>
						<a className="under-link" href="#">
							Library
						</a>
						<a className="under-link" href="#">
							History
						</a>
						<a className="under-link" href="/api-docs">
							API Docs
						</a>
					</div>
					<div className="md:text-right">
						<span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest">
							<span
								className="w-1.5 h-1.5 rounded-full pulse-dot inline-block"
								style={{
									background:
										'var(--accent, oklch(0.62 0.17 35))',
								}}
							/>
							System nominal · 47 render nodes online
						</span>
					</div>
				</footer>
			</div>
		</div>
	);
}
