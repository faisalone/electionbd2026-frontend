import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let echo: Echo<any> | null = null;

// Initialize Echo only on client side
if (typeof window !== 'undefined') {
	(window as any).Pusher = Pusher;

	const scheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http';
	const port = process.env.NEXT_PUBLIC_REVERB_PORT
		? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT)
		: 8080;

	console.log('🔌 Echo Configuration:', {
		scheme,
		host: process.env.NEXT_PUBLIC_REVERB_HOST,
		port,
		wsPort: scheme === 'https' ? 443 : port,
		wssPort: scheme === 'https' ? 443 : port,
		forceTLS: scheme === 'https',
	});

	echo = new Echo({
		broadcaster: 'reverb',
		key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || '',
		wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
		wsPort: scheme === 'https' ? 443 : port,
		wssPort: scheme === 'https' ? 443 : port,
		forceTLS: scheme === 'https',
		enabledTransports: ['ws', 'wss'],
		disableStats: true,
	});

	// Debug WebSocket connection
	echo.connector.pusher.connection.bind('connected', () => {
		console.log('✅ WebSocket connected successfully!');
	});

	echo.connector.pusher.connection.bind('error', (err: any) => {
		console.error('❌ WebSocket connection error:', err);
	});

	echo.connector.pusher.connection.bind('disconnected', () => {
		console.warn('⚠️ WebSocket disconnected');
	});
}

export default echo;
