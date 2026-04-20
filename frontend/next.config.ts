import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: false,
	turbopack: {},
	output: 'standalone',
	typescript: {
		ignoreBuildErrors: false,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8000',
			},
			{
				protocol: 'https',
				hostname: '*.ngrok-free.app',
			},
			{
				protocol: 'https',
				hostname: '*.ngrok-free.dev',
			},
		],
	},
};

export default nextConfig;
