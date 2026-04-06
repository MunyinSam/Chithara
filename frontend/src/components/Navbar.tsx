'use client';

import Link from 'next/link';

export function NavBar() {
	return (
		<nav
			style={{
				fontFamily: "'Times New Roman', Times, serif",
				borderBottom: "2px solid #1a1008",
				backgroundColor: "#f5f0e8",
				color: "#1a1008",
			}}
			className="sticky top-0 z-50 px-8 py-4 flex items-center justify-between"
		>
			<Link href="/" className="text-2xl font-bold tracking-widest uppercase">
				Chithara
			</Link>

			<div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase">
				<Link href="/#features" className="hover:underline underline-offset-4">
					Features
				</Link>
				<Link href="/#how-it-works" className="hover:underline underline-offset-4">
					How It Works
				</Link>
				<Link href="/library" className="hover:underline underline-offset-4">
					Library
				</Link>
				<Link
					href="/generation"
					style={{
						backgroundColor: "#1a1008",
						color: "#f5f0e8",
						border: "2px solid #1a1008",
					}}
					className="px-5 py-2 transition-opacity hover:opacity-80"
				>
					Try Now
				</Link>
			</div>
		</nav>
	);
}
