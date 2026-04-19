'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import AudioPlayer from '@/src/components/AudioPlayer';
import Link from 'next/link';
import { songService, type SortOption } from '@/src/services/songService';
import { generationService } from '@/src/services/generationService';
import type { Song } from '@/src/types';

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
	onDelete,
}: {
	song: Song;
	index: number;
	active: boolean;
	onSelect: (song: Song) => void;
	onTogglePrivacy: (song: Song) => void;
	onDelete: (song: Song) => void;
}) {
	const [open, setOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);

	const copyShareLink = (e: React.MouseEvent) => {
		e.stopPropagation();
		const url = `${window.location.origin}/songs/${song.share_token}`;
		navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div
			className="border transition-colors mb-3"
			style={{
				borderColor: open ? ink : rule,
				background: open ? 'oklch(0.955 0.014 75)' : 'oklch(0.968 0.013 75)',
			}}
		>
			{/* Always-visible trigger row */}
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				className="w-full text-left px-7 pt-7 pb-6 flex gap-6 group"
			>
				{/* Index */}
				<span
					className="font-serif italic shrink-0"
					style={{ fontSize: 40, color: accentDeep, lineHeight: 1 }}
				>
					{String(index + 1).padStart(2, '0')}
				</span>

				{/* Main content */}
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-6">
						<div className="min-w-0 flex-1">
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
									className="font-serif text-[28px] leading-tight"
									style={{ color: ink }}
								>
									{song.title}
								</h3>
							</div>
							<p
								className="font-mono text-[10px] tracking-widest uppercase mt-2"
								style={{ color: mid }}
							>
								{song.genre || 'Unknown'} · {formatDate(song.created_at)}
							</p>
							<p
								className="font-serif italic text-[14px] mt-2.5 line-clamp-1"
								style={{ color: ink2 }}
							>
								&ldquo;{song.prompt}&rdquo;
							</p>
						</div>

						{/* Right side */}
						<div className="flex flex-col items-end gap-3 shrink-0 pt-1">
							<span
								className="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border"
								style={{
									borderColor: song.privacy_status === 'PUBLIC' ? accentDeep : rule,
									color: song.privacy_status === 'PUBLIC' ? accentDeep : mid,
								}}
							>
								{song.privacy_status === 'PUBLIC' ? 'Public' : 'Private'}
							</span>
							{/* Expand affordance — styled as a small button */}
							<span
								className="font-mono text-[9px] tracking-[0.16em] uppercase px-3 py-1.5 border flex items-center gap-2 transition-colors"
								style={{
									borderColor: open ? ink : rule,
									color: open ? ink : mid,
									background: open ? 'oklch(0.18 0.015 60 / 0.06)' : 'transparent',
								}}
							>
								{open ? 'Collapse' : 'Expand'}
								<span
									className="inline-block transition-transform duration-300"
									style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
								>
									↓
								</span>
							</span>
						</div>
					</div>
				</div>
			</button>

			{/* Accordion panel */}
			{open && (
				<div
					className="px-7 pb-8 flex flex-col gap-6"
					style={{ borderTop: `1px solid ${rule}` }}
				>
					{/* Full prompt */}
					<div className="pt-6">
						<p
							className="font-mono text-[9px] tracking-[0.2em] uppercase mb-2"
							style={{ color: mid }}
						>
							Full prompt
						</p>
						<p
							className="font-serif italic text-[17px] leading-relaxed"
							style={{ color: ink2 }}
						>
							&ldquo;{song.prompt}&rdquo;
						</p>
					</div>

					{/* Metadata strip */}
					<div
						className="flex flex-wrap gap-x-8 gap-y-2 py-3 border-y font-mono text-[9px] tracking-[0.18em] uppercase"
						style={{ borderColor: rule, color: mid }}
					>
						<span>Genre · <span style={{ color: ink2 }}>{song.genre || '—'}</span></span>
						<span>Added · <span style={{ color: ink2 }}>{formatDate(song.created_at)}</span></span>
						<span>Visibility · <span style={{ color: song.privacy_status === 'PUBLIC' ? accentDeep : ink2 }}>{song.privacy_status}</span></span>
					</div>

					{/* Action buttons — all styled as real buttons */}
					<div
						className="flex items-center gap-3 flex-wrap"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Primary: Play/Stop */}
						<button
							onClick={() => onSelect(song)}
							className="font-mono text-[10px] tracking-[0.16em] uppercase px-6 py-3 border transition-colors"
							style={{ background: ink, color: 'oklch(0.972 0.012 75)', borderColor: ink }}
						>
							{active ? '■  Stop' : '▶  Play'}
						</button>

						{/* Secondary bordered buttons */}
						<a
							href={song.audio_file}
							download
							className="font-mono text-[10px] tracking-[0.16em] uppercase px-5 py-3 border transition-colors"
							style={{ borderColor: rule, color: ink2 }}
						>
							↓ Download
						</a>
						<button
							onClick={() => onTogglePrivacy(song)}
							className="font-mono text-[10px] tracking-[0.16em] uppercase px-5 py-3 border transition-colors"
							style={{ borderColor: rule, color: ink2 }}
						>
							{song.privacy_status === 'PUBLIC' ? 'Make Private' : 'Make Public'}
						</button>
						{song.privacy_status === 'PUBLIC' && song.share_token && (
							<button
								onClick={copyShareLink}
								className="font-mono text-[10px] tracking-[0.16em] uppercase px-5 py-3 border transition-colors"
								style={{ borderColor: accentDeep, color: accentDeep }}
							>
								{copied ? '✓ Copied' : '⎘ Copy Link'}
							</button>
						)}

						{/* Delete — two-step confirm */}
						{!confirmDelete ? (
							<button
								onClick={() => setConfirmDelete(true)}
								className="font-mono text-[10px] tracking-[0.16em] uppercase px-5 py-3 border transition-colors ml-auto"
								style={{ borderColor: rule, color: mid }}
							>
								Delete
							</button>
						) : (
							<span className="ml-auto flex items-center gap-2">
								<span
									className="font-mono text-[9px] tracking-widest uppercase"
									style={{ color: mid }}
								>
									Sure?
								</span>
								<button
									onClick={() => onDelete(song)}
									className="font-mono text-[10px] tracking-[0.16em] uppercase px-4 py-3 border transition-colors"
									style={{ borderColor: 'oklch(0.55 0.18 25)', color: 'oklch(0.45 0.18 25)' }}
								>
									Yes, delete
								</button>
								<button
									onClick={() => setConfirmDelete(false)}
									className="font-mono text-[10px] tracking-[0.16em] uppercase px-4 py-3 border transition-colors"
									style={{ borderColor: rule, color: mid }}
								>
									Cancel
								</button>
							</span>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

const PAGE_SIZE = 4;

export default function LibraryPage() {
	const { data: session, status: sessionStatus } = useSession();
	const [songs, setSongs] = useState<Song[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [filter, setFilter] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');
	const [searchInput, setSearchInput] = useState('');
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState<SortOption>('newest');
	const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [activeSong, setActiveSong] = useState<Song | null>(null);
	const [credits, setCredits] = useState<number | null>(null);

	const totalPages = Math.ceil(totalCount / PAGE_SIZE);

	useEffect(() => {
		if (sessionStatus === 'loading' || !session?.backendToken) return;
		const token = session.backendToken;

		setLoading(true);
		songService.getPage(token, page, filter === 'ALL' ? undefined : filter, search, sort)
			.then((data) => {
				setSongs(data.results);
				setTotalCount(data.count);
				setLoading(false);
			})
			.catch(() => { setError('Failed to load songs.'); setLoading(false); });
	}, [session?.backendToken, sessionStatus, page, filter, search, sort]);

	useEffect(() => {
		if (sessionStatus === 'loading' || !session?.backendToken) return;
		generationService.getCredits(session.backendToken)
			.then((data) => setCredits(data.credits))
			.catch(() => {});
	}, [session?.backendToken, sessionStatus]);

	const changeFilter = (f: 'ALL' | 'PUBLIC' | 'PRIVATE') => {
		setFilter(f);
		setPage(1);
	};

	const handleSearchInput = (value: string) => {
		setSearchInput(value);
		if (searchTimer.current) clearTimeout(searchTimer.current);
		searchTimer.current = setTimeout(() => {
			setSearch(value);
			setPage(1);
		}, 350);
	};

	const handleSort = (value: SortOption) => {
		setSort(value);
		setPage(1);
	};

	const togglePrivacy = async (song: Song) => {
		const next = song.privacy_status === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
		const token = session?.backendToken;
		if (!token) return;
		try {
			const updated = await songService.updatePrivacy(song.id, next, token);
			setSongs((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
			if (activeSong?.id === updated.id) setActiveSong(updated);
		} catch {}
	};

	const deleteSong = async (song: Song) => {
		const token = session?.backendToken;
		if (!token) return;
		try {
			await songService.delete(song.id, token);
			if (activeSong?.id === song.id) setActiveSong(null);
			// Refresh current page (or go back one if it's now empty)
			const newCount = totalCount - 1;
			const newTotalPages = Math.ceil(newCount / PAGE_SIZE);
			const targetPage = page > newTotalPages ? Math.max(1, newTotalPages) : page;
			if (targetPage !== page) {
				setPage(targetPage);
			} else {
				setSongs((prev) => prev.filter((s) => s.id !== song.id));
				setTotalCount(newCount);
			}
		} catch {}
	};

	const selectSong = (song: Song) => {
		setActiveSong((prev) => (prev?.id === song.id ? null : song));
	};

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
										{totalCount} song
										{totalCount !== 1 ? 's' : ''} on file
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

						{/* Filter · Search · Sort toolbar */}
						<div className="flex flex-wrap gap-3 mb-10 items-center">
							{/* Filter tabs */}
							<div
								className="flex gap-0 border w-fit shrink-0"
								style={{ borderColor: rule }}
							>
								{(['ALL', 'PUBLIC', 'PRIVATE'] as const).map((f) => (
									<button
										key={f}
										onClick={() => changeFilter(f)}
										className="font-mono text-[10px] tracking-widest uppercase px-5 py-2.5 transition-colors"
										style={{
											background: filter === f ? ink : 'transparent',
											color: filter === f ? paper : mid,
											borderRight: f !== 'PRIVATE' ? `1px solid ${rule}` : 'none',
										}}
									>
										{f === 'ALL' ? 'All' : f === 'PUBLIC' ? 'Public' : 'Private'}
									</button>
								))}
							</div>

							{/* Search input */}
							<input
								type="text"
								value={searchInput}
								onChange={(e) => handleSearchInput(e.target.value)}
								placeholder="Search by title…"
								className="flex-1 min-w-45 bg-transparent border px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal outline-none"
								style={{ borderColor: rule, color: ink }}
							/>

							{/* Sort select */}
							<select
								value={sort}
								onChange={(e) => handleSort(e.target.value as SortOption)}
								className="bg-transparent border px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase outline-none cursor-pointer"
								style={{ borderColor: rule, color: mid }}
							>
								<option value="newest">Newest first</option>
								<option value="oldest">Oldest first</option>
								<option value="title_asc">Title A–Z</option>
								<option value="title_desc">Title Z–A</option>
							</select>
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
						{!loading && !error && songs.length === 0 && (
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
						{!loading && !error && songs.length > 0 && (
							<div className="flex flex-col">
								{songs.map((song, i) => (
									<SongCard
										key={song.id}
										song={song}
										index={(page - 1) * PAGE_SIZE + i}
										active={activeSong?.id === song.id}
										onSelect={selectSong}
										onTogglePrivacy={togglePrivacy}
										onDelete={deleteSong}
									/>
								))}
							</div>
						)}

						{/* Pagination */}
						{!loading && !error && totalPages > 1 && (
							<div
								className="flex items-center justify-between mt-10 pt-6 border-t font-mono text-[10px] tracking-widest uppercase"
								style={{ borderColor: rule, color: mid }}
							>
								<button
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									disabled={page === 1}
									className="px-5 py-2.5 border transition-colors disabled:opacity-30"
									style={{ borderColor: rule, color: ink }}
								>
									← Prev
								</button>
								<div className="flex items-center gap-1">
									{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
										<button
											key={p}
											onClick={() => setPage(p)}
											className="w-8 h-8 flex items-center justify-center border transition-colors"
											style={{
												background: p === page ? ink : 'transparent',
												color: p === page ? paper : mid,
												borderColor: p === page ? ink : rule,
											}}
										>
											{p}
										</button>
									))}
								</div>
								<button
									onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
									disabled={page === totalPages}
									className="px-5 py-2.5 border transition-colors disabled:opacity-30"
									style={{ borderColor: rule, color: ink }}
								>
									Next →
								</button>
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
