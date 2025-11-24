import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'i.pravatar.cc',
				pathname: '/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8000',
				pathname: '/storage/**',
			},
			{
				protocol: 'https',
				hostname: 'www.votemamu.com',
				pathname: '/storage/**',
			},
			{
				protocol: 'https',
				hostname: 'api.votemamu.com',
				pathname: '/storage/**',
			},
		],
	},
	// Enable compression for JSON files
	compress: true,
	// Add cache headers for static assets
	async headers() {
		return [
			{
				source: '/logo-animation.json',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
					{
						key: 'Content-Type',
						value: 'application/json',
					},
				],
			},
		];
	},
};

export default nextConfig;
