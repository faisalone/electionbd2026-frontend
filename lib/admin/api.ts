// API Configuration
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const ADMIN_API_BASE = API_BASE_URL.replace('/v1', '/admin');
const BACKEND_URL =
	process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Helper function to get full image URL
export const getImageUrl = (path: string | null | undefined): string => {
	if (!path) return '/news-placeholder.svg';
	if (path.startsWith('http')) return path;
	return `${BACKEND_URL}${path}`;
};

// Auth functions
export const sendOTP = async (phoneNumber: string) => {
	const response = await fetch(`${ADMIN_API_BASE}/auth/send-otp`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ phone_number: phoneNumber }),
	});
	return response.json();
};

export const verifyOTP = async (phoneNumber: string, otpCode: string) => {
	const response = await fetch(`${ADMIN_API_BASE}/auth/verify-otp`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ phone_number: phoneNumber, otp_code: otpCode }),
	});
	return response.json();
};

export const getAdminProfile = async (token: string) => {
	const response = await fetch(`${ADMIN_API_BASE}/auth/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	});
	return response.json();
};

export const logout = async (token: string) => {
	const response = await fetch(`${ADMIN_API_BASE}/auth/logout`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	});
	return response.json();
};

// Generic CRUD functions
const createAuthHeaders = (token: string, isFormData: boolean = false) => {
	const headers: any = {
		Authorization: `Bearer ${token}`,
	};
	if (!isFormData) {
		headers['Content-Type'] = 'application/json';
	}
	return headers;
};

export const getAll = async (
	resource: string,
	token: string,
	params?: Record<string, any>
) => {
	const query = params ? '?' + new URLSearchParams(params).toString() : '';
	const response = await fetch(`${ADMIN_API_BASE}/${resource}${query}`, {
		headers: createAuthHeaders(token),
	});
	return response.json();
};

export const getOne = async (resource: string, id: number, token: string) => {
	const response = await fetch(`${ADMIN_API_BASE}/${resource}/${id}`, {
		headers: createAuthHeaders(token),
	});
	return response.json();
};

export const create = async (
	resource: string,
	data: any,
	token: string,
	isFormData: boolean = false
) => {
	const body = isFormData ? data : JSON.stringify(data);
	const response = await fetch(`${ADMIN_API_BASE}/${resource}`, {
		method: 'POST',
		headers: createAuthHeaders(token, isFormData),
		body,
	});
	return response.json();
};

export const update = async (
	resource: string,
	id: number,
	data: any,
	token: string,
	isFormData: boolean = false
) => {
	// Laravel doesn't handle FormData properly with PUT, so use POST with _method
	if (isFormData) {
		data.append('_method', 'PUT');
	}
	const body = isFormData ? data : JSON.stringify(data);
	const response = await fetch(`${ADMIN_API_BASE}/${resource}/${id}`, {
		method: isFormData ? 'POST' : 'PUT',
		headers: createAuthHeaders(token, isFormData),
		body,
	});
	return response.json();
};

export const remove = async (resource: string, id: number, token: string) => {
	const response = await fetch(`${ADMIN_API_BASE}/${resource}/${id}`, {
		method: 'DELETE',
		headers: createAuthHeaders(token),
	});
	return response.json();
};

// Poll specific
export const getPollVotes = async (pollId: number, token: string) => {
	const response = await fetch(`${ADMIN_API_BASE}/polls/${pollId}/votes`, {
		headers: createAuthHeaders(token),
	});
	return response.json();
};

export const selectPollWinner = async (
	pollId: number,
	count: number,
	token: string
) => {
	const response = await fetch(
		`${ADMIN_API_BASE}/polls/${pollId}/select-winner`,
		{
			method: 'POST',
			headers: createAuthHeaders(token),
			body: JSON.stringify({ count }),
		}
	);
	return response.json();
};

export const endPoll = async (pollId: number, token: string) => {
	const response = await fetch(`${ADMIN_API_BASE}/polls/${pollId}/end`, {
		method: 'POST',
		headers: createAuthHeaders(token),
	});
	return response.json();
};

// News specific
export const generateNews = async (
	topic: string,
	count: number,
	token: string
) => {
	const response = await fetch(`${ADMIN_API_BASE}/news/generate`, {
		method: 'POST',
		headers: createAuthHeaders(token),
		body: JSON.stringify({ topic, count }),
	});
	return response.json();
};

export const runNewsCronjob = async (token: string) => {
	const response = await fetch(`${ADMIN_API_BASE}/news/run-cronjob`, {
		method: 'POST',
		headers: createAuthHeaders(token),
	});
	return response.json();
};

// WhatsApp Messages
export const getWhatsAppConversations = async (token: string) => {
	const response = await fetch(`${ADMIN_API_BASE}/whatsapp/conversations`, {
		headers: createAuthHeaders(token),
	});
	return response.json();
};

export const getWhatsAppMessages = async (
	phoneNumber: string,
	token: string
) => {
	const response = await fetch(
		`${ADMIN_API_BASE}/whatsapp/conversations/${phoneNumber}`,
		{
			headers: createAuthHeaders(token),
		}
	);
	return response.json();
};

export const sendWhatsAppReply = async (
	phoneNumber: string,
	message: string,
	token: string
) => {
	const response = await fetch(`${ADMIN_API_BASE}/whatsapp/reply`, {
		method: 'POST',
		headers: createAuthHeaders(token),
		body: JSON.stringify({ phone_number: phoneNumber, message }),
	});
	return response.json();
};

export const searchWhatsAppUsers = async (query: string, token: string) => {
	const params = new URLSearchParams();
	if (query.trim()) {
		params.set('q', query.trim());
	}
	const response = await fetch(
		`${ADMIN_API_BASE}/whatsapp/users${
			params.toString() ? `?${params.toString()}` : ''
		}`,
		{
			headers: createAuthHeaders(token),
		}
	);
	return response.json();
};

export const markWhatsAppAsRead = async (
	phoneNumber: string,
	token: string
) => {
	const response = await fetch(
		`${ADMIN_API_BASE}/whatsapp/conversations/${phoneNumber}/mark-read`,
		{
			method: 'POST',
			headers: createAuthHeaders(token),
		}
	);
	return response.json();
};

export const getWhatsAppUnreadCount = async (token: string) => {
	const response = await fetch(`${ADMIN_API_BASE}/whatsapp/unread-count`, {
		headers: createAuthHeaders(token),
	});
	return response.json();
};

export const deleteWhatsAppMessage = async (id: number, token: string) => {
	const response = await fetch(`${ADMIN_API_BASE}/whatsapp/messages/${id}`, {
		method: 'DELETE',
		headers: createAuthHeaders(token),
	});
	return response.json();
};

export const startWhatsAppConversation = async (
	phoneNumber: string,
	token: string
) => {
	const response = await fetch(
		`${ADMIN_API_BASE}/whatsapp/start-conversation`,
		{
			method: 'POST',
			headers: createAuthHeaders(token),
			body: JSON.stringify({ phone_number: phoneNumber }),
		}
	);
	return response.json();
};
