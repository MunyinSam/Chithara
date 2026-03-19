'use client';

import Link from 'next/link';

export function NavBar() {
	const linkClasses =
		'text-black/80 transition-colors hover:text-black text-sm font-medium';
	const navBarClass = 'w-full bg-transparent text-black';

	return (
		<nav className={navBarClass}>
			<div className="flex h-14 items-center px-4 md:px-10">
				<div className="flex flex-1 items-center">
					<div className="flex-none flex items-center pr-4 md:pr-10">
						<Link href="/" className="flex items-center space-x-2">
							<span className="font-(family-name:--font-young-serif) text-xl text-black">
								Chitara
							</span>
						</Link>
					</div>

					<nav className="hidden md:flex items-center space-x-6">
						{/* <Link href="/decks/all" className={linkClasses}>
							Your Library
						</Link>
						<Link href="/decks" className={linkClasses}>
							Generate A Song
						</Link> */}
						<Link href="/api-docs" className={linkClasses}>
							API Docs
						</Link>
						{/* <Link href="/decks/create" className={linkClasses}>
							Add
						</Link> */}
					</nav>
				</div>
			</div>
		</nav>
	);
}
