'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
import { buttonVariants } from '@/src/components/ui/button';

export function NavBar() {
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
		<nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
			<div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
				<Link
					href="/"
					className="text-lg font-bold text-gray-900 tracking-tight"
				>
					Chithara
				</Link>

				<div className="hidden md:flex items-center gap-8">
					<Link
						href="/#features"
						className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
					>
						Features
					</Link>
					<Link
						href="/#how-it-works"
						className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
					>
						How It Works
					</Link>
					<Link
						href="/library"
						className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
					>
						Library
					</Link>

					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer transition-opacity hover:opacity-80 active:opacity-60 active:scale-95">
								<Avatar className="">
									<AvatarImage
										src={user.image ?? ''}
										alt={user.name ?? 'User'}
									/>
									<AvatarFallback className="bg-indigo-600 text-white text-xs font-semibold">
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
							href="/login"
							className={cn(
								buttonVariants({ size: 'default' }),
								'bg-indigo-600 hover:bg-indigo-700 text-white'
							)}
						>
							Sign In
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
}
