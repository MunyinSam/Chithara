'use client';

export function Ticker() {
	const words = ['Words in', 'Songs out', 'No instruments', 'No studio', 'Just press', 'Generate'];
	const doubled = [...words, ...words, ...words];
	return (
		<div className="border-y border-[oklch(0.18_0.015_60)] bg-[oklch(0.18_0.015_60)] text-[oklch(0.972_0.012_75)] overflow-hidden py-4 flex">
			<div className="ticker-track flex gap-12 whitespace-nowrap font-serif text-[44px] leading-none shrink-0 pr-12">
				{doubled.map((w, i) => (
					<span key={i} className="inline-flex items-center gap-12">
						{i % 3 === 0 ? (
							<span className="italic" style={{ color: 'var(--accent, oklch(0.62 0.17 35))' }}>
								{w}
							</span>
						) : (
							<span>{w}</span>
						)}
						<span style={{ color: 'var(--accent, oklch(0.62 0.17 35))' }}>♫</span>
					</span>
				))}
			</div>
		</div>
	);
}
