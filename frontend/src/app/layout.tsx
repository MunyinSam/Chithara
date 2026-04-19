import type { Metadata } from 'next';
import { Geist_Mono, Young_Serif } from 'next/font/google';
import './globals.css';
import { NavWrapper } from '../components/nav-wrapper';
import { SessionProvider } from '../components/SessionProvider';
import { GenerationProvider } from '../contexts/GenerationContext';
import { GenerationToast } from '../components/GenerationToast';

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const youngSerif = Young_Serif({
	weight: '400',
	variable: '--font-young-serif',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Chithara — A Journal of Generated Music',
	description:
		'Turn your words into music. Describe a feeling, a moment, a vibe — Chithara scores it for you.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${youngSerif.variable} ${geistMono.variable} font-(family-name:--font-young-serif) antialiased`}
			>
				<SessionProvider>
					<GenerationProvider>
						<NavWrapper />
						{children}
						<GenerationToast />
					</GenerationProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
