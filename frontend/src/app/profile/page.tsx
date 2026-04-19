'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Stats {
	total_songs: number;
	public_songs: number;
	total_generations: number;
}

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

const ink = 'oklch(0.18 0.015 60)';
const mid = 'oklch(0.55 0.015 60)';
const rule = 'oklch(0.85 0.015 60)';
const bg = 'oklch(0.972 0.012 75)';
const accent = 'var(--accent, oklch(0.62 0.17 35))';
const accentDeep = 'var(--accent-deep, oklch(0.48 0.17 35))';

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});
}

function StatBlock({ label, value }: { label: string; value: number | string }) {
	return (
		<div
			className="flex flex-col gap-1 px-6 py-5 border-r last:border-r-0"
			style={{ borderColor: rule }}
		>
			<span className="font-serif text-[36px] leading-none" style={{ color: ink }}>
				{value}
			</span>
			<span
				className="font-mono text-[9px] tracking-[0.2em] uppercase"
				style={{ color: mid }}
			>
				{label}
			</span>
		</div>
	);
}

export default function ProfilePage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [stats, setStats] = useState<Stats | null>(null);

	const backendUser = session?.backendUser;
	const googleUser = session?.user;

	useEffect(() => {
		if (status === 'unauthenticated') router.replace('/login');
	}, [status, router]);

	useEffect(() => {
		if (!backendUser?.id) return;
		fetch(`${API}/users/${backendUser.id}/stats/`)
			.then((r) => r.json())
			.then(setStats)
			.catch(() => {});
	}, [backendUser?.id]);

	if (status === 'loading' || !backendUser) {
		return (
			<div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
				<div
					className="size-5 rounded-full border-2 border-t-transparent animate-spin"
					style={{ borderColor: `${accentDeep} transparent ${accentDeep} ${accentDeep}` }}
				/>
			</div>
		);
	}

	const displayName =
		[backendUser.first_name, backendUser.last_name].filter(Boolean).join(' ') ||
		backendUser.username;

	return (
		<div className="min-h-screen" style={{ background: bg }}>
			{/* Top meta bar */}
			<div
				className="px-9 py-4 border-b flex justify-between font-mono text-[11px] tracking-widest uppercase"
				style={{ borderColor: rule, color: mid }}
			>
				<Link href="/" className="inline-flex items-center gap-2.5">
					<span
						className="w-1.5 h-1.5 rounded-full pulse-dot"
						style={{ background: accent }}
					/>
					<span
						style={{
							color: ink,
							fontFamily: '"Instrument Serif", Georgia, serif',
							fontSize: 18,
							textTransform: 'none',
							letterSpacing: '-0.01em',
						}}
					>
						Chithara
					</span>
				</Link>
				<span>The Composer&apos;s Account · № 001</span>
				<Link href="/library" className="under-link" style={{ color: mid }}>
					Library →
				</Link>
			</div>

			<div className="max-w-205 mx-auto px-9 py-16">
				{/* Page heading */}
				<div
					className="grid md:grid-cols-[1fr_2fr] gap-10 pb-8 border-b-2 mb-12 items-end"
					style={{ borderColor: ink }}
				>
					<div>
						<p
							className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2"
							style={{ color: accent }}
						>
							Account · Profile
						</p>
						<h1
							className="font-serif text-[48px] leading-[0.95] tracking-tight"
							style={{ color: ink }}
						>
							Your
							<br />
							<em>Profile</em>
						</h1>
					</div>
					<p
						className="font-serif italic text-[18px] leading-relaxed pb-1"
						style={{ color: mid }}
					>
						Review your archive and keep tabs on your output.
					</p>
				</div>

				{/* Identity */}
				<div
					className="border mb-0 grid md:grid-cols-[auto_1fr] overflow-hidden"
					style={{ borderColor: rule }}
				>
					<div
						className="flex items-center justify-center p-8 border-r"
						style={{ borderColor: rule, background: 'oklch(0.96 0.012 75)' }}
					>
						<div
							className="relative size-20 overflow-hidden border"
							style={{ borderColor: rule }}
						>
							{googleUser?.image ? (
								<Image
									src={googleUser.image}
									alt={displayName}
									fill
									className="object-cover"
								/>
							) : (
								<div
									className="size-full flex items-center justify-center font-serif text-2xl"
									style={{ background: accentDeep, color: bg }}
								>
									{displayName.slice(0, 2).toUpperCase()}
								</div>
							)}
						</div>
					</div>
					<div className="p-8 flex flex-col justify-center gap-2">
						<p className="font-serif text-[22px] tracking-tight" style={{ color: ink }}>
							{displayName}
						</p>
						<p className="font-mono text-[11px] tracking-wider" style={{ color: mid }}>
							{backendUser.email}
						</p>
						<p
							className="font-mono text-[10px] tracking-wider mt-1"
							style={{ color: 'oklch(0.7 0.015 60)' }}
						>
							Member since {formatDate(backendUser.date_joined)}
						</p>
					</div>
				</div>

				{/* Stats */}
				<div
					className="border border-t-0 mb-12 grid grid-cols-3"
					style={{ borderColor: rule }}
				>
					<StatBlock label="Songs generated" value={stats?.total_songs ?? '—'} />
					<StatBlock label="Public songs" value={stats?.public_songs ?? '—'} />
					<StatBlock label="Total prompts" value={stats?.total_generations ?? '—'} />
				</div>

				{/* Quick links */}
				<div className="pt-8 border-t flex gap-4" style={{ borderColor: rule }}>
					<Link
						href="/library"
						className="font-mono text-[10px] tracking-[0.18em] uppercase px-6 py-3 border transition-colors"
						style={{ borderColor: rule, color: ink }}
					>
						Your Library →
					</Link>
					<Link
						href="/generation"
						className="font-mono text-[10px] tracking-[0.18em] uppercase px-6 py-3 border transition-colors"
						style={{ background: ink, color: bg, borderColor: ink }}
					>
						+ New Song
					</Link>
				</div>
			</div>
		</div>
	);
}
