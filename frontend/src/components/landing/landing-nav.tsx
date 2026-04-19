'use client';

import Link from 'next/link';
import { Music } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { buttonVariants } from '@/src/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from '@/src/components/ui/dropdown-menu';
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from '@/src/components/ui/avatar';
import { cn } from '@/lib/utils';

export function LandingNav() {
	const { data: session } = useSession();
	const user = session?.user;
	const router = useRouter();

	const initials = user?.name
		? user.name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()
				.slice(0, 2)
		: '?';

	return (
		<nav
			className="sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-9 py-4 border-b border-[oklch(0.85_0.015_60)] backdrop-blur-md"
			style={{
				background:
					'color-mix(in oklab, oklch(0.972 0.012 75) 85%, transparent)',
			}}
		>
			<div className="flex items-center gap-5">
				<Link
					href="/"
					className="font-serif text-[26px] tracking-tight inline-flex items-center gap-2.5"
				>
					<Music
						className="w-5 h-5"
						style={{ color: 'var(--accent, oklch(0.62 0.17 35))' }}
					/>
					Chithara
				</Link>
				<span className="font-mono text-[10px] tracking-widest uppercase text-[oklch(0.55_0.015_60)] hidden md:inline">
					Vol. 04 / Issue 012 · 2026
				</span>
			</div>
			<div className="font-mono text-[10px] tracking-widest uppercase text-[oklch(0.55_0.015_60)]">
				A journal of generated music
			</div>
			<div className="flex items-center gap-6 justify-end">
				<Link
					href="/#features"
					className="under-link font-mono text-[10px] tracking-widest uppercase text-[oklch(0.32_0.015_60)]"
				>
					Features
				</Link>
				<Link
					href="/library"
					className="under-link font-mono text-[10px] tracking-widest uppercase text-[oklch(0.32_0.015_60)]"
				>
					Library
				</Link>
				<Link
					href="/generation"
					className="under-link font-mono text-[10px] tracking-widest uppercase text-[oklch(0.32_0.015_60)]"
				>
					Generate
				</Link>
				<Link
					href="/#how"
					className="under-link font-mono text-[10px] tracking-widest uppercase text-[oklch(0.32_0.015_60)]"
				>
					How it works
				</Link>
				{user ? (
					<DropdownMenu>
						<DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-(--accent,oklch(0.62_0.17_35)) cursor-pointer transition-opacity hover:opacity-80 active:opacity-60 active:scale-95">
							<Avatar>
								<AvatarImage
									src={user.image ?? ''}
									alt={user.name ?? 'User'}
								/>
								<AvatarFallback
									className="text-xs font-semibold"
									style={{
										background:
											'var(--accent-deep, oklch(0.48 0.17 35))',
										color: 'oklch(0.972 0.012 75)',
									}}
								>
									{initials}
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-52 mt-5">
							<div className="flex flex-col gap-0.5 px-3 py-2">
								<span className="text-sm font-medium text-gray-900 truncate">
									{user.name}
								</span>
								<span className="text-xs text-gray-400 truncate">
									{user.email}
								</span>
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => router.push('/profile')}
							>
								Profile
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant="destructive"
								className="cursor-pointer"
								onClick={() =>
									signOut({ callbackUrl: '/login' })
								}
							>
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Link
						href="/generation"
						className={cn(
							buttonVariants({ size: 'sm' }),
							'font-mono text-[11px] tracking-[0.14em] uppercase rounded-none bg-[oklch(0.18_0.015_60)] text-[oklch(0.972_0.012_75)] hover:bg-(--accent-deep,oklch(0.48_0.17_35))'
						)}
					>
						Start →
					</Link>
				)}
			</div>
		</nav>
	);
}
