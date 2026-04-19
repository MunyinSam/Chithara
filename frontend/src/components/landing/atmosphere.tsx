'use client';

export function FloatingNotes() {
	const notes = ['♪', '♫', '♬', '𝄞'];
	const items = Array.from({ length: 14 }).map((_, i) => ({
		left: `${(i * 7.3) % 100}%`,
		delay: `${(i * 0.9) % 12}s`,
		size: 14 + (i % 4) * 6,
		ch: notes[i % notes.length],
		color: i % 3 === 0 ? 'var(--accent-deep, oklch(0.48 0.17 35))' : 'oklch(0.55 0.015 60)',
	}));
	return (
		<div className="absolute inset-0 pointer-events-none overflow-hidden">
			{items.map((n, i) => (
				<span
					key={i}
					className="float-note font-serif italic"
					style={{
						left: n.left,
						bottom: 0,
						fontSize: n.size,
						animationDelay: n.delay,
						color: n.color,
					}}
				>
					{n.ch}
				</span>
			))}
		</div>
	);
}

export function ParticleField() {
	const words = [
		'andante', 'fortissimo', 'rubato', 'legato', 'staccato',
		'pp', 'ƒƒ', 'crescendo', 'tempo', '♩', '♪',
	];
	const items = Array.from({ length: 18 }).map((_, i) => ({
		left: `${(i * 11 + 3) % 100}%`,
		top: `${100 + ((i * 13) % 20)}%`,
		delay: `${(i * 1.3) % 18}s`,
		size: 12 + (i % 5) * 3,
		rotate: ((i * 23) % 30) - 15,
		word: words[i % words.length],
	}));
	return (
		<div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
			{items.map((p, i) => (
				<span
					key={i}
					className="particle"
					style={{
						left: p.left,
						top: p.top,
						fontSize: p.size,
						animationDelay: p.delay,
						transform: `rotate(${p.rotate}deg)`,
					}}
				>
					{p.word}
				</span>
			))}
		</div>
	);
}
