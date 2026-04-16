import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: false,
	turbopack: {},
	output: 'standalone',
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
		],
	},
};

export default nextConfig;
