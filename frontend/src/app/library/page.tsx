'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import AudioPlayer from '@/src/components/AudioPlayer';
import Link from 'next/link';

interface Song {
	id: number;
	title: string;
	genre: string;
	prompt: string;
	audio_file: string;
	created_at: string;
	privacy_status: 'PUBLIC' | 'PRIVATE';
	share_token: string | null;
}

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

const ink = 'oklch(0.18 0.015 60)';
const ink2 = 'oklch(0.32 0.015 60)';
const mid = 'oklch(0.55 0.015 60)';
const rule = 'oklch(0.85 0.015 60)';
const paper = 'oklch(0.972 0.012 75)';
const accent = 'var(--accent, oklch(0.62 0.17 35))';
const accentDeep = 'var(--accent-deep, oklch(0.48 0.17 35))';

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

function SongCard({
	song,
	index,
	active,
	onSelect,
	onTogglePrivacy,
}: {
	song: Song;
	index: number;
	active: boolean;
	onSelect: (song: Song) => void;
	onTogglePrivacy: (song: Song) => void;
}) {
	const [copied, setCopied] = useState(false);

	const copyShareLink = (e: React.MouseEvent) => {
		e.stopPropagation();
		const url = `${window.location.origin}/songs/${song.share_token}`;
		navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div
			onClick={() => onSelect(song)}
			className="group cursor-pointer border-b py-7 transition-colors hover:bg-[oklch(0.955_0.014_75)]"
			style={{ borderColor: rule }}
		>
			<div className="flex items-start justify-between gap-6">
				{/* Index + title block */}
				<div className="flex items-start gap-5 min-w-0 flex-1">
					<span
						className="font-serif italic leading-none shrink-0 mt-1"
						style={{
							fontSize: 32,
							color: accentDeep,
							lineHeight: 1,
						}}
					>
						{String(index + 1).padStart(2, '0')}
					</span>
					<div className="min-w-0">
						<div className="flex items-center gap-3 flex-wrap">
							{active && (
								<span className="flex gap-0.5 items-end h-4 shrink-0">
									{[1, 2, 3].map((i) => (
										<span
											key={i}
											className="w-0.5 rounded-full animate-pulse"
											style={{
												height: `${8 + i * 4}px`,
												animationDelay: `${i * 0.15}s`,
												background: accent,
											}}
										/>
									))}
								</span>
							)}
							<h3
								className="font-serif text-[22px] leading-tight truncate"
								style={{ color: ink }}
							>
								{song.title}
							</h3>
						</div>
						<p
							className="font-mono text-[10px] tracking-widest uppercase mt-1"
							style={{ color: mid }}
						>
							{song.genre} · {formatDate(song.created_at)}
						</p>
						<p
							className="font-serif italic text-sm mt-2 line-clamp-1"
							style={{ color: ink2 }}
						>
							&ldquo;{song.prompt}&rdquo;
						</p>
					</div>
				</div>

				{/* Status + actions */}
				<div
					className="flex flex-col items-end gap-3 shrink-0"
					onClick={(e) => e.stopPropagation()}
				>
					<span
						className="font-mono text-[9px] tracking-widest uppercase px-2 py-1 border"
						style={{
							borderColor:
								song.privacy_status === 'PUBLIC'
									? accentDeep
									: rule,
							color:
								song.privacy_status === 'PUBLIC'
									? accentDeep
									: mid,
						}}
					>
						{song.privacy_status === 'PUBLIC'
							? 'Public'
							: 'Private'}
					</span>
					<div className="flex gap-3 flex-wrap justify-end">
						<a
							href={song.audio_file}
							download
							className="font-mono text-[10px] tracking-widest uppercase under-link"
							style={{ color: ink2 }}
						>
							Download
						</a>
						<button
							onClick={() => onTogglePrivacy(song)}
							className="font-mono text-[10px] tracking-widest uppercase under-link"
							style={{ color: ink2 }}
						>
							{song.privacy_status === 'PUBLIC'
								? 'Make Private'
								: 'Make Public'}
						</button>
						{song.privacy_status === 'PUBLIC' &&
							song.share_token && (
								<button
									onClick={copyShareLink}
									className="font-mono text-[10px] tracking-widest uppercase under-link"
									style={{ color: accentDeep }}
								>
									{copied ? 'Copied ✓' : 'Copy Link'}
								</button>
							)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default function LibraryPage() {
	const { data: session, status: sessionStatus } = useSession();
	const [songs, setSongs] = useState<Song[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [filter, setFilter] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');
	const [activeSong, setActiveSong] = useState<Song | null>(null);
	const [credits, setCredits] = useState<number | null>(null);

	const authHeaders = (): HeadersInit => ({
		'Content-Type': 'application/json',
		...(session?.backendToken
			? { Authorization: `Bearer ${session.backendToken}` }
			: {}),
	});

	useEffect(() => {
		if (sessionStatus === 'loading' || !session?.backendToken) return;
		const token = session.backendToken;

		fetch(`${API}/songs/`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((r) => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`);
				return r.json();
			})
			.then((data) => {
				setSongs(Array.isArray(data) ? data : (data.results ?? []));
				setLoading(false);
			})
			.catch(() => {
				setError('Failed to load songs.');
				setLoading(false);
			});

		fetch(`${API}/generate/credits/`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => {
				if (data?.credits != null) setCredits(data.credits);
			})
			.catch(() => {});
	}, [session?.backendToken, sessionStatus]);

	const togglePrivacy = async (song: Song) => {
		const next = song.privacy_status === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
		const res = await fetch(`${API}/songs/${song.id}/`, {
			method: 'PATCH',
			headers: authHeaders(),
			body: JSON.stringify({ privacy_status: next }),
		});
		if (res.ok) {
			const updated: Song = await res.json();
			setSongs((prev) =>
				prev.map((s) => (s.id === updated.id ? updated : s))
			);
			if (activeSong?.id === updated.id) setActiveSong(updated);
		}
	};

	const selectSong = (song: Song) => {
		setActiveSong((prev) => (prev?.id === song.id ? null : song));
	};

	const filtered =
		filter === 'ALL'
			? songs
			: songs.filter((s) => s.privacy_status === filter);

	return (
		<>
			<div
				className={cn(
					'min-h-screen relative overflow-hidden transition-all',
					activeSong && 'pb-32'
				)}
				style={{ background: paper, color: ink }}
			>
				{/* Paper grain */}
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
						<Link
							href="/"
							className="inline-flex items-center gap-2.5"
						>
							<span
								className="w-1.5 h-1.5 rounded-full pulse-dot"
								style={{ background: accent }}
							/>
							<span
								className="font-serif normal-case tracking-tight"
								style={{ color: ink, fontSize: 18 }}
							>
								Chithara
							</span>
						</Link>
						<span>The Archive · № 042</span>
						<Link href="/generation" className="under-link">
							+ New Song
						</Link>
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
								§ 02
							</div>
							<div>
								<h1
									className="font-serif font-normal leading-[1.1] tracking-[-0.025em] m-0"
									style={{
										fontSize: 'clamp(48px, 6vw, 88px)',
									}}
								>
									Your{' '}
									<span
										className="italic"
										style={{ color: accentDeep }}
									>
										library
									</span>
									.
								</h1>
								<div
									className="flex items-center gap-5 font-mono text-[11px] tracking-widest uppercase mt-3 flex-wrap"
									style={{ color: mid }}
								>
									<span>
										{songs.length} song
										{songs.length !== 1 ? 's' : ''} on file
									</span>
									{credits !== null && (
										<span
											className="inline-flex items-center gap-2"
											style={{ color: accentDeep }}
										>
											<span
												className="w-1.5 h-1.5 rounded-full inline-block"
												style={{
													background: accentDeep,
												}}
											/>
											{credits} Suno credits left
										</span>
									)}
								</div>
							</div>
						</div>

						{/* Filter tabs */}
						<div
							className="flex gap-0 border mb-10 w-fit"
							style={{ borderColor: rule }}
						>
							{(['ALL', 'PUBLIC', 'PRIVATE'] as const).map(
								(f) => (
									<button
										key={f}
										onClick={() => setFilter(f)}
										className="font-mono text-[10px] tracking-widest uppercase px-5 py-2.5 transition-colors"
										style={{
											background:
												filter === f
													? ink
													: 'transparent',
											color: filter === f ? paper : mid,
											borderRight:
												f !== 'PRIVATE'
													? `1px solid ${rule}`
													: 'none',
										}}
									>
										{f === 'ALL'
											? 'All'
											: f === 'PUBLIC'
												? 'Public'
												: 'Private'}
									</button>
								)
							)}
						</div>

						{/* Loading */}
						{(loading || sessionStatus === 'loading') && (
							<div className="py-20 flex flex-col items-center gap-4">
								<div
									className="font-serif italic text-[44px] leading-none"
									style={{ color: rule }}
								>
									Loading
									<span
										className="animate-pulse"
										style={{ color: accentDeep }}
									>
										…
									</span>
								</div>
								<p
									className="font-mono text-[10px] tracking-widest uppercase"
									style={{ color: mid }}
								>
									Fetching your archive
								</p>
							</div>
						)}

						{/* Session error */}
						{sessionStatus !== 'loading' &&
							!session?.backendToken && (
								<div
									className="border-2 p-6"
									style={{ borderColor: ink }}
								>
									<p
										className="font-serif italic text-xl"
										style={{ color: accentDeep }}
									>
										Session expired — please sign out and
										sign back in.
									</p>
								</div>
							)}

						{/* Fetch error */}
						{error && (
							<div
								className="border-2 p-6"
								style={{ borderColor: accentDeep }}
							>
								<p
									className="font-serif italic text-xl"
									style={{ color: accentDeep }}
								>
									{error}
								</p>
							</div>
						)}

						{/* Empty state */}
						{!loading && !error && filtered.length === 0 && (
							<div className="py-20 text-center">
								<div
									className="font-serif italic text-[60px] leading-none mb-4"
									style={{ color: rule }}
								>
									—
								</div>
								<p
									className="font-serif italic text-xl mb-6"
									style={{ color: ink2 }}
								>
									No songs here yet.
								</p>
								<Link
									href="/generation"
									className="inline-flex items-center gap-2 px-6 py-3 font-mono text-[11px] tracking-[0.14em] uppercase border transition-all"
									style={{
										background: ink,
										color: paper,
										borderColor: ink,
									}}
								>
									Generate your first song →
								</Link>
							</div>
						)}

						{/* Song list */}
						{!loading && !error && filtered.length > 0 && (
							<div
								className="border-t"
								style={{ borderColor: rule }}
							>
								{filtered.map((song, i) => (
									<SongCard
										key={song.id}
										song={song}
										index={i}
										active={activeSong?.id === song.id}
										onSelect={selectSong}
										onTogglePrivacy={togglePrivacy}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			<AudioPlayer
				song={activeSong}
				onClose={() => setActiveSong(null)}
			/>
		</>
	);
}
