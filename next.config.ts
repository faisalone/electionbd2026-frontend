import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	images: {
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
		],
	},
};

export default nextConfig;
