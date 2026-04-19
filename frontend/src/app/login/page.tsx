import { signIn } from '@/auth';

export default function LoginPage() {
	return (
		<div
			className="min-h-screen relative overflow-hidden flex items-center justify-center"
			style={{
				background: 'oklch(0.972 0.012 75)',
				color: 'oklch(0.18 0.015 60)',
			}}
		>
			{/* Paper grain */}
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
				className="fixed inset-0 z-1 pointer-events-none"
				style={{
					background:
						'radial-gradient(ellipse at 50% 0%, oklch(0.98 0.03 var(--accent-h, 35) / 0.35), transparent 60%), radial-gradient(ellipse at 100% 100%, oklch(0.92 0.05 var(--accent-h, 35) / 0.25), transparent 50%)',
				}}
			/>

			<div className="relative z-2 w-full max-w-120 px-9 py-16">
				{/* Section marker */}
				<div
					className="font-serif italic leading-none mb-6"
					style={{
						fontSize: 80,
						color: 'var(--accent-deep, oklch(0.48 0.17 35))',
						lineHeight: 0.8,
					}}
				>
					§
				</div>

				<div
					className="border-b-2 pb-8 mb-10"
					style={{ borderColor: 'oklch(0.18 0.015 60)' }}
				>
					<h1
						className="font-serif font-normal leading-[0.9] tracking-[-0.025em] m-0"
						style={{ fontSize: 'clamp(48px, 8vw, 72px)' }}
					>
						Sign{' '}
						<span
							className="italic"
							style={{
								color: 'var(--accent-deep, oklch(0.48 0.17 35))',
							}}
						>
							in
						</span>
						.
					</h1>
					<p
						className="font-mono text-[11px] tracking-widest uppercase mt-3"
						style={{ color: 'oklch(0.55 0.015 60)' }}
					>
						Chithara · A journal of generated music
					</p>
				</div>

				<form
					action={async () => {
						'use server';
						await signIn('google', { redirectTo: '/' });
					}}
				>
					<button
						type="submit"
						className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 font-mono text-[11px] tracking-[0.14em] uppercase border transition-all hover:bg-[oklch(0.945_0.016_75)]"
						style={{
							borderColor: 'oklch(0.85 0.015 60)',
							color: 'oklch(0.18 0.015 60)',
						}}
					>
						<GoogleIcon />
						Continue with Google
					</button>
				</form>

				<p
					className="font-mono text-[10px] tracking-widest uppercase mt-6 text-center"
					style={{ color: 'oklch(0.55 0.015 60)' }}
				>
					By signing in you agree to our terms of service.
				</p>
			</div>
		</div>
	);
}

function GoogleIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			className="size-4"
		>
			<path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				fill="#4285F4"
			/>
			<path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				fill="#34A853"
			/>
			<path
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
				fill="#FBBC05"
			/>
			<path
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				fill="#EA4335"
			/>
		</svg>
	);
}
