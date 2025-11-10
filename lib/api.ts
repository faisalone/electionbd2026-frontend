// API Configuration
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Type Definitions matching backend Laravel models
export interface Division {
	id: number;
	name: string;
	name_en: string;
	total_seats: number; // Computed from seats count (not stored in DB)
	created_at: string;
	updated_at: string;
	districts_count?: number;
	seats_count?: number; // Available when using withCount('seats')
	districts?: District[];
}

export interface District {
	id: number;
	name_en: string;
	name: string; // Note: Backend uses 'name' not 'name_bn'
	division_id: number;
	total_seats: number; // Computed from seats count (not stored in DB)
	created_at: string;
	updated_at: string;
	seats_count?: number; // Available when using withCount('seats')
	division?: Division;
	seats?: Seat[];
}

export interface Seat {
	id: number;
	name: string; // Bengali name (e.g., ঢাকা-১)
	name_en: string; // English name (e.g., dhaka-1)
	area?: string; // Area description
	district_id: number;
	created_at: string;
	updated_at: string;
	district?: District;
	candidates?: Candidate[];
}

export interface Party {
	id: number;
	name: string; // Bengali name
	name_en: string;
	symbol: string;
	symbol_name: string; // Bengali symbol name
	color: string;
	founded?: string;
	is_independent: boolean;
	created_at: string;
	updated_at: string;
	candidates_count?: number;
	candidates?: Candidate[];
}

export interface Symbol {
	id: number;
	name: string;
	emoji: string;
	is_available: boolean;
	created_at: string;
	updated_at: string;
}

export interface Candidate {
	id: number;
	name: string; // Bengali name
	name_en: string; // English name
	age: number;
	education: string;
	experience?: string;
	image?: string;
	party_id: number;
	seat_id: number;
	symbol_id?: number;
	created_at: string;
	updated_at: string;
	party?: Party;
	seat?: Seat;
	symbol?: Symbol;
}

export interface TimelineEvent {
	id: number;
	title: string;
	status: string;
	date: string;
	description: string;
	order: number;
	created_at: string;
	updated_at: string;
}

export interface Poll {
	id: number;
	uid?: string;
	user_id: number;
	question: string;
	creator_name?: string;
	end_date: string;
	created_at: string;
	updated_at: string;
	options: PollOption[];
	total_votes: number;
	votes_count?: number;
	winner?: {
		phone_number: string;
		voted_at: string;
	} | null;
	user?: {
		id: number;
		name: string;
		phone_number: string;
	};
}

export interface PollOption {
	id: number;
	poll_id: number;
	text: string;
	color?: string;
	created_at: string;
	updated_at: string;
	vote_count: number;
	votes: number; // Alias for vote_count for frontend compatibility
	poll_votes?: PollVote[];
}

export interface PollVote {
	id: number;
	poll_id: number;
	poll_option_id: number;
	user_id: number;
	phone_number: string;
	created_at: string;
	updated_at: string;
}

export interface News {
	id: number;
	uid?: string;
	title: string; // Bengali title
	summary?: string; // Short summary
	content: string; // Full content
	image: string; // Image URL (always provided by backend with fallback)
	date: string; // Bengali date
	category: string;
	is_ai_generated: boolean;
	source_url?: string;
	created_at: string;
	updated_at: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
}

export interface PaginatedResponse<T> {
	success: boolean;
	data: T[];
	pagination: {
		current_page: number;
		total_pages: number;
		total: number;
		per_page: number;
		has_more: boolean;
	};
}

// API Client Class
class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string = API_BASE_URL) {
		this.baseUrl = baseUrl;
	}

	private async fetch<T>(
		endpoint: string,
		options?: RequestInit
	): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;

		try {
			const response = await fetch(url, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					...options?.headers,
				},
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				const errorMessage =
					errorData.message ||
					`HTTP error! status: ${response.status}`;
				throw new Error(errorMessage);
			}

			return await response.json();
		} catch (error) {
			console.error('API request failed:', error);
			throw error;
		}
	} // Division APIs
	async getDivisions(): Promise<ApiResponse<Division[]>> {
		return this.fetch<ApiResponse<Division[]>>('/divisions');
	}

	async getDivision(id: number): Promise<ApiResponse<Division>> {
		return this.fetch<ApiResponse<Division>>(`/divisions/${id}`);
	}

	// District APIs
	async getDistricts(divisionId?: number): Promise<ApiResponse<District[]>> {
		const query = divisionId ? `?division_id=${divisionId}` : '';
		return this.fetch<ApiResponse<District[]>>(`/districts${query}`);
	}

	async getDistrict(id: number): Promise<ApiResponse<District>> {
		return this.fetch<ApiResponse<District>>(`/districts/${id}`);
	}

	// Seat APIs
	async getSeats(params?: {
		district_id?: number;
		division_id?: number;
	}): Promise<ApiResponse<Seat[]>> {
		const query = new URLSearchParams();
		if (params?.district_id)
			query.append('district_id', params.district_id.toString());
		if (params?.division_id)
			query.append('division_id', params.division_id.toString());
		const queryString = query.toString() ? `?${query.toString()}` : '';
		return this.fetch<ApiResponse<Seat[]>>(`/seats${queryString}`);
	}

	async getSeat(id: number): Promise<ApiResponse<Seat>> {
		return this.fetch<ApiResponse<Seat>>(`/seats/${id}`);
	}

	// Candidate APIs
	async getCandidates(params?: {
		seat_id?: number;
		party_id?: number;
		district_id?: number;
		division_id?: number;
		search?: string;
		is_independent?: number;
		per_page?: number;
		page?: number;
	}): Promise<ApiResponse<Candidate[]>> {
		const query = new URLSearchParams();
		if (params?.seat_id) query.append('seat_id', params.seat_id.toString());
		if (params?.party_id)
			query.append('party_id', params.party_id.toString());
		if (params?.district_id)
			query.append('district_id', params.district_id.toString());
		if (params?.division_id)
			query.append('division_id', params.division_id.toString());
		if (params?.search) query.append('search', params.search);
		if (params?.is_independent)
			query.append('is_independent', params.is_independent.toString());
		if (params?.per_page)
			query.append('per_page', params.per_page.toString());
		if (params?.page) query.append('page', params.page.toString());
		const queryString = query.toString() ? `?${query.toString()}` : '';
		return this.fetch<ApiResponse<Candidate[]>>(
			`/candidates${queryString}`
		);
	}

	async getCandidate(id: number): Promise<ApiResponse<Candidate>> {
		return this.fetch<ApiResponse<Candidate>>(`/candidates/${id}`);
	}

	// Party APIs
	async getParties(): Promise<ApiResponse<Party[]>> {
		return this.fetch<ApiResponse<Party[]>>('/parties');
	}

	async getParty(id: number): Promise<ApiResponse<Party>> {
		return this.fetch<ApiResponse<Party>>(`/parties/${id}`);
	}

	// Timeline API
	async getTimeline(): Promise<ApiResponse<TimelineEvent[]>> {
		return this.fetch<ApiResponse<TimelineEvent[]>>('/timeline');
	}

	// News APIs
	async getNews(params?: {
		category?: string;
		ai_only?: boolean;
		page?: number;
		per_page?: number;
	}): Promise<PaginatedResponse<News>> {
		const query = new URLSearchParams();
		if (params?.category) query.append('category', params.category);
		if (params?.ai_only) query.append('ai_only', '1');
		if (params?.page) query.append('page', params.page.toString());
		if (params?.per_page)
			query.append('per_page', params.per_page.toString());
		const queryString = query.toString() ? `?${query.toString()}` : '';
		return this.fetch<PaginatedResponse<News>>(`/news${queryString}`);
	}

	async getNewsArticleByUid(uid: string): Promise<ApiResponse<News>> {
		return this.fetch<ApiResponse<News>>(`/news/${uid}`);
	}

	// Poll APIs
	async getPolls(): Promise<ApiResponse<Poll[]>> {
		return this.fetch<ApiResponse<Poll[]>>('/polls');
	}

	async getPollByUid(uid: string): Promise<ApiResponse<Poll>> {
		return this.fetch<ApiResponse<Poll>>(`/polls/${uid}`);
	}

	async createPoll(data: {
		question: string;
		creator_name?: string;
		end_date: string;
		options: { text: string; color?: string }[];
		phone_number: string;
		otp_code: string;
	}): Promise<ApiResponse<Poll>> {
		return this.fetch<ApiResponse<Poll>>('/polls', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async votePoll(
		pollId: number,
		data: {
			option_id: number;
			phone_number: string;
			otp_code: string;
		}
	): Promise<ApiResponse<{ message: string }>> {
		return this.fetch<ApiResponse<{ message: string }>>(
			`/polls/${pollId}/vote`,
			{
				method: 'POST',
				body: JSON.stringify(data),
			}
		);
	}

	// OTP APIs
	async sendOTP(data: {
		phone_number: string;
		purpose: 'poll_create' | 'poll_vote';
		poll_id?: number;
	}): Promise<ApiResponse<{ message: string }>> {
		return this.fetch<ApiResponse<{ message: string }>>('/otp/send', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async verifyOTP(data: {
		phone_number: string;
		otp_code: string;
		purpose: 'poll_create' | 'poll_vote';
		poll_id?: number;
	}): Promise<ApiResponse<{ message: string }>> {
		return this.fetch<ApiResponse<{ message: string }>>('/otp/verify', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	// Winner Ranking API
	async getWinnerRanking(pollUidOrId: string | number): Promise<
		ApiResponse<{
			winner: {
				phone_number: string;
				voted_at: string;
			} | null;
			winning_option: {
				id: number;
				text: string;
				color: string;
				votes: number;
			};
			winning_option_voters: Array<{
				phone_number: string;
				voted_at: string;
				rank: number;
			}>;
		}>
	> {
		return this.fetch<
			ApiResponse<{
				winner: {
					phone_number: string;
					voted_at: string;
				} | null;
				winning_option: {
					id: number;
					text: string;
					color: string;
					votes: number;
				};
				winning_option_voters: Array<{
					phone_number: string;
					voted_at: string;
					rank: number;
				}>;
			}>
		>(`/polls/${pollUidOrId}/winners`);
	}
}

// Export singleton instance
export const api = new ApiClient();

// Export default
export default api;
