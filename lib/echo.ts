import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let echo: Echo<any> | null = null;

// Initialize Echo only on client side
if (typeof window !== 'undefined') {
	(window as any).Pusher = Pusher;

	echo = new Echo({
		broadcaster: 'reverb',
		key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || '',
		wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
		wsPort: process.env.NEXT_PUBLIC_REVERB_PORT
			? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT)
			: 8080,
		wssPort: process.env.NEXT_PUBLIC_REVERB_PORT
			? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT)
			: 8080,
		forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http') === 'https',
		enabledTransports: ['ws', 'wss'],
		disableStats: true,
	});
}

export default echo;
