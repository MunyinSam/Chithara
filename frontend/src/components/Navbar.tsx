'use client';

import Link from 'next/link';

export function NavBar() {
	return (
		<nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
			<div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
				<Link href="/" className="text-lg font-bold text-gray-900 tracking-tight">
					Chithara
				</Link>

				<div className="hidden md:flex items-center gap-8">
					<Link href="/#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
						Features
					</Link>
					<Link href="/#how-it-works" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
						How It Works
					</Link>
					<Link href="/library" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
						Library
					</Link>
					<Link
						href="/generation"
						className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
					>
						Try Now
					</Link>
				</div>
			</div>
		</nav>
	);
}
