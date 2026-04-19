'use client';
import { useEffect, useState } from 'react';

export function Typewriter({
	texts,
	speed = 40,
	pause = 1800,
}: {
	texts: string[];
	speed?: number;
	pause?: number;
}) {
	const [idx, setIdx] = useState(0);
	const [sub, setSub] = useState(0);
	const [del, setDel] = useState(false);

	useEffect(() => {
		const full = texts[idx];
		let t: ReturnType<typeof setTimeout>;
		if (!del && sub < full.length) t = setTimeout(() => setSub(sub + 1), speed);
		else if (!del && sub === full.length) t = setTimeout(() => setDel(true), pause);
		else if (del && sub > 0) t = setTimeout(() => setSub(sub - 1), speed / 2);
		else {
			t = setTimeout(() => {
				setDel(false);
				setIdx((idx + 1) % texts.length);
			}, 0);
		}
		return () => clearTimeout(t);
	}, [sub, del, idx, texts, speed, pause]);

	return (
		<span>
			{texts[idx].slice(0, sub)}
			<span
				className="caret-blink inline-block w-[2px] h-[0.9em] align-middle ml-1"
				style={{ background: 'var(--accent, oklch(0.62 0.17 35))' }}
			/>
		</span>
	);
}
