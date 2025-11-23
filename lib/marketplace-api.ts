// Marketplace API Client
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Updated Types matching backend
export interface Creator {
	id: number;
	name: string;
	username: string;
	avatar?: string;
	phone?: string;
	location?: string;
	bio?: string;
	specialties?: string[];
	status: 'pending' | 'active' | 'suspended';
	rating: number; // Computed from products
	total_designs: number; // Computed count
	is_verified: boolean;
	joined_date?: string;
	recent_products?: Product[];
	created_at: string;
	updated_at: string;
}

export interface ProductImage {
	id: number;
	thumbnail_url: string;
	video_url?: string;
	type: 'image' | 'video_preview';
	order: number;
}

export interface ProductFile {
	id: number;
	filename: string;
	size: number;
	formatted_size: string;
	mime_type: string;
	order: number;
}

export interface ProductRating {
	id: number;
	user_name: string;
	rating: number;
	comment?: string;
	created_at: string;
}

export interface Product {
	creators: any;
	id: number;
	uid: string;
	title: string;
	title_en: string;
	description: string;
	description_en?: string;
	category:
		| 'banner'
		| 'logo'
		| 'poster'
		| 'social_media'
		| 'flyer'
		| 'brochure'
		| 'business_card'
		| 'invitation'
		| 'thumbnail'
		| 'ui_design'
		| 'print_design'
		| 'illustration'
		| 'branding'
		| 'other';
	tags: string[];
	price: number;
	status?: 'pending' | 'approved' | 'rejected';
	enable_download: boolean;
	enable_custom_order: boolean;
	views_count: number;
	rating: number; // Computed average
	downloads_count: number; // Computed count
	images: ProductImage[];
	files?: ProductFile[]; // Separate download files
	creator: Creator;
	ratings?: ProductRating[];
	created_at: string;
	updated_at: string;
}

export interface CustomOrder {
	id: number;
	order_number: string;
	product: Product;
	user_name: string;
	phone_number?: string;
	details: string;
	status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
	creator_notes?: string;
	admin_notes?: string;
	completed_at?: string;
	created_at: string;
	updated_at: string;
}

export interface MarketplaceOrder {
	id: number;
	product: Product;
	requirements: string;
	budget: number;
	status: 'pending' | 'accepted' | 'completed' | 'cancelled';
	created_at: string;
	updated_at: string;
}

export interface CreatorDashboardStats {
	total_products: number;
	pending_products: number;
	approved_products: number;
	rejected_products: number;
	total_downloads: number;
	total_views: number;
	pending_orders: number;
	completed_orders: number;
	average_rating: number;
	total_ratings: number;
}

export interface CreatorDashboard {
	creator: Creator;
	stats: CreatorDashboardStats;
}

export interface ApiResponse<T> {
	data: T;
	message?: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	links: {
		first: string;
		last: string;
		prev: string | null;
		next: string | null;
	};
	meta: {
		current_page: number;
		from: number;
		last_page: number;
		path: string;
		per_page: number;
		to: number;
		total: number;
	};
}

class MarketplaceApiClient {
	private baseUrl: string;

	constructor() {
		this.baseUrl = `${API_BASE_URL}/marketplace`;
	}

	private getAuthHeaders(): HeadersInit {
		const token =
			typeof window !== 'undefined'
				? localStorage.getItem('market_token')
				: null;
		return {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		};
	}

	private async fetch<T>(
		endpoint: string,
		options?: RequestInit
	): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;

		const isFormData = options?.body instanceof FormData;
		const headers: any = {
			...this.getAuthHeaders(),
			...options?.headers,
		};

		if (isFormData) {
			delete headers['Content-Type'];
		}

		try {
			const response = await fetch(url, {
				...options,
				headers,
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `HTTP ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Marketplace API error:', error);
			throw error;
		}
	}

	// Product APIs
	async getProducts(params?: {
		category?: string;
		search?: string;
		sort?: 'latest' | 'popular' | 'top_rated';
		page?: number;
		per_page?: number;
	}): Promise<PaginatedResponse<Product>> {
		const query = new URLSearchParams();
		if (params?.category) query.append('category', params.category);
		if (params?.search) query.append('search', params.search);
		if (params?.sort) query.append('sort', params.sort);
		if (params?.page) query.append('page', params.page.toString());
		if (params?.per_page)
			query.append('per_page', params.per_page.toString());

		const queryString = query.toString() ? `?${query.toString()}` : '';
		return this.fetch<PaginatedResponse<Product>>(
			`/products${queryString}`
		);
	}

	async getProduct(uid: string): Promise<ApiResponse<Product>> {
		return this.fetch<ApiResponse<Product>>(`/products/${uid}`);
	}

	async createProduct(data: FormData): Promise<ApiResponse<Product>> {
		const token =
			typeof window !== 'undefined'
				? localStorage.getItem('market_token')
				: null;
		const response = await fetch(`${this.baseUrl}/products`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: data,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `HTTP ${response.status}`);
		}

		return await response.json();
	}

	async updateProduct(
		uid: string,
		data: Partial<Product> | FormData
	): Promise<ApiResponse<Product>> {
		const isFormData = data instanceof FormData;

		if (isFormData) {
			const token =
				typeof window !== 'undefined'
					? localStorage.getItem('market_token')
					: null;
			const response = await fetch(`${this.baseUrl}/products/${uid}`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
				body: data,
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `HTTP ${response.status}`);
			}

			return await response.json();
		}

		return this.fetch<ApiResponse<Product>>(`/products/${uid}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	}

	async deleteProduct(
		uid: string
	): Promise<ApiResponse<{ message: string }>> {
		return this.fetch<ApiResponse<{ message: string }>>(
			`/products/${uid}`,
			{
				method: 'DELETE',
			}
		);
	}

	async downloadProduct(
		uid: string,
		data: { name: string; phone: string }
	): Promise<
		ApiResponse<{
			download_url?: string;
			download_urls?: Array<{
				url: string;
				filename: string;
				size: number;
			}>;
		}>
	> {
		return this.fetch<
			ApiResponse<{
				download_url?: string;
				download_urls?: Array<{
					url: string;
					filename: string;
					size: number;
				}>;
			}>
		>(`/products/${uid}/download`, {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async rateProduct(
		uid: string,
		data: { user_name: string; rating: number; comment?: string }
	): Promise<ApiResponse<ProductRating>> {
		return this.fetch<ApiResponse<ProductRating>>(`/products/${uid}/rate`, {
			method: 'POST',
			body: JSON.stringify({
				name: data.user_name,
				rating: data.rating,
				comment: data.comment,
			}),
		});
	}

	// Creator APIs
	async getCreators(params?: {
		per_page?: number;
		page?: number;
	}): Promise<PaginatedResponse<Creator>> {
		const query = new URLSearchParams();
		if (params?.page) query.append('page', params.page.toString());
		if (params?.per_page)
			query.append('per_page', params.per_page.toString());

		const queryString = query.toString() ? `?${query.toString()}` : '';
		return this.fetch<PaginatedResponse<Creator>>(
			`/creators${queryString}`
		);
	}

	async getCreator(username: string): Promise<ApiResponse<Creator>> {
		return this.fetch<ApiResponse<Creator>>(`/creators/${username}`);
	}

	async getCreatorProducts(
		username: string,
		params?: { per_page?: number; page?: number }
	): Promise<PaginatedResponse<Product>> {
		const query = new URLSearchParams();
		if (params?.page) query.append('page', params.page.toString());
		if (params?.per_page)
			query.append('per_page', params.per_page.toString());

		const queryString = query.toString() ? `?${query.toString()}` : '';
		return this.fetch<PaginatedResponse<Product>>(
			`/creators/${username}/products${queryString}`
		);
	}

	async getCreatorProfile(): Promise<ApiResponse<Creator>> {
		return this.fetch<ApiResponse<Creator>>('/profile');
	}

	async createCreatorProfile(data: {
		name: string;
		username: string;
		bio?: string;
		location?: string;
		specialties?: string[];
	}): Promise<ApiResponse<Creator>> {
		return this.fetch<ApiResponse<Creator>>('/profile', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async updateCreatorProfile(
		username: string,
		data: Partial<Creator> | FormData
	): Promise<ApiResponse<Creator>> {
		const isFormData = data instanceof FormData;
		if (isFormData) {
			data.append('_method', 'PUT');
		}

		return this.fetch<ApiResponse<Creator>>(`/creators/${username}`, {
			method: isFormData ? 'POST' : 'PUT',
			body: isFormData ? data : JSON.stringify(data),
		});
	}

	async getCreatorDashboard(): Promise<ApiResponse<CreatorDashboard>> {
		return this.fetch<ApiResponse<CreatorDashboard>>('/dashboard');
	}

	// Admin Creator Management
	async approveCreator(creatorId: number): Promise<ApiResponse<Creator>> {
		return this.fetch<ApiResponse<Creator>>(
			`/creators/${creatorId}/approve`,
			{
				method: 'POST',
			}
		);
	}

	async rejectCreator(creatorId: number): Promise<ApiResponse<Creator>> {
		return this.fetch<ApiResponse<Creator>>(
			`/creators/${creatorId}/reject`,
			{
				method: 'POST',
			}
		);
	}

	async updateCreatorStatus(
		creatorId: number,
		status: 'pending' | 'active' | 'suspended'
	): Promise<ApiResponse<Creator>> {
		return this.fetch<ApiResponse<Creator>>(
			`/creators/${creatorId}/status`,
			{
				method: 'PUT',
				body: JSON.stringify({ status }),
			}
		);
	}

	// Custom Order APIs
	async createCustomOrder(
		uid: string,
		data: {
			user_name: string;
			phone_number: string;
			details: string;
		}
	): Promise<ApiResponse<CustomOrder>> {
		return this.fetch<ApiResponse<CustomOrder>>(
			`/products/${uid}/custom-order`,
			{
				method: 'POST',
				body: JSON.stringify({
					name: data.user_name,
					phone: data.phone_number,
					details: data.details,
				}),
			}
		);
	}

	async getCustomOrders(): Promise<ApiResponse<CustomOrder[]>> {
		return this.fetch<ApiResponse<CustomOrder[]>>('/custom-order');
	}

	async getCustomOrder(
		orderNumber: string
	): Promise<ApiResponse<CustomOrder>> {
		return this.fetch<ApiResponse<CustomOrder>>(
			`/custom-order/${orderNumber}`
		);
	}

	async updateOrderStatus(
		orderNumber: string,
		data: {
			status: 'in_progress' | 'completed' | 'cancelled';
			creator_notes?: string;
		}
	): Promise<ApiResponse<CustomOrder>> {
		return this.fetch<ApiResponse<CustomOrder>>(
			`/custom-order/${orderNumber}/status`,
			{
				method: 'PUT',
				body: JSON.stringify(data),
			}
		);
	}

	// Creator Dashboard APIs
	async getMyProducts(params?: {
		page?: number;
		per_page?: number;
		status?: string;
		search?: string;
	}): Promise<PaginatedResponse<Product>> {
		const query = new URLSearchParams();
		if (params?.page) query.append('page', params.page.toString());
		if (params?.per_page)
			query.append('per_page', params.per_page.toString());
		if (params?.status) query.append('status', params.status);
		if (params?.search) query.append('search', params.search);

		const queryString = query.toString() ? `?${query.toString()}` : '';
		return this.fetch<PaginatedResponse<Product>>(
			`/my-products${queryString}`
		);
	}

	async getDownloads(params?: {
		page?: number;
		per_page?: number;
	}): Promise<PaginatedResponse<any>> {
		const query = new URLSearchParams();
		if (params?.page) query.append('page', params.page.toString());
		if (params?.per_page)
			query.append('per_page', params.per_page.toString());

		const queryString = query.toString() ? `?${query.toString()}` : '';
		return this.fetch<PaginatedResponse<any>>(`/downloads${queryString}`);
	}
	async getMyOrders(params?: {
		page?: number;
		per_page?: number;
		status?: string;
		search?: string;
	}): Promise<PaginatedResponse<CustomOrder>> {
		const query = new URLSearchParams();
		if (params?.page) query.append('page', params.page.toString());
		if (params?.per_page)
			query.append('per_page', params.per_page.toString());
		if (params?.status) query.append('status', params.status);
		if (params?.search) query.append('search', params.search);

		const queryString = query.toString() ? `?${query.toString()}` : '';
		return this.fetch<PaginatedResponse<CustomOrder>>(
			`/orders${queryString}`
		);
	}

	// Admin APIs
	async getAdminProducts(params?: {
		status?: 'pending' | 'approved' | 'rejected';
		search?: string;
		page?: number;
		per_page?: number;
	}): Promise<PaginatedResponse<Product>> {
		const query = new URLSearchParams();
		if (params?.status) query.append('status', params.status);
		if (params?.search) query.append('search', params.search);
		if (params?.page) query.append('page', params.page.toString());
		if (params?.per_page)
			query.append('per_page', params.per_page.toString());

		const queryString = query.toString() ? `?${query.toString()}` : '';
		return this.fetch<PaginatedResponse<Product>>(
			`/products/manage${queryString}`
		);
	}

	async getAdminStats(): Promise<
		ApiResponse<{
			totalProducts: number;
			totalCreators: number;
			pendingApprovals: number;
			totalRevenue: number;
		}>
	> {
		return this.fetch<
			ApiResponse<{
				totalProducts: number;
				totalCreators: number;
				pendingApprovals: number;
				totalRevenue: number;
			}>
		>('/stats');
	}

	async approveProduct(uid: string): Promise<ApiResponse<Product>> {
		return this.fetch<ApiResponse<Product>>(`/products/${uid}/approve`, {
			method: 'POST',
		});
	}

	async rejectProduct(
		uid: string,
		reason: string
	): Promise<ApiResponse<Product>> {
		return this.fetch<ApiResponse<Product>>(`/products/${uid}/reject`, {
			method: 'POST',
			body: JSON.stringify({ reason }),
		});
	}

	async adminDeleteProduct(
		uid: string
	): Promise<ApiResponse<{ message: string }>> {
		return this.fetch<ApiResponse<{ message: string }>>(
			`/products/${uid}/admin-delete`,
			{
				method: 'DELETE',
			}
		);
	}

	// Auth
	async getMe(): Promise<any> {
		const url = `${API_BASE_URL}/auth/me`;
		const headers = this.getAuthHeaders();

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: headers,
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `HTTP ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Marketplace API error:', error);
			throw error;
		}
	}
}

// Authentication API
class AuthApiClient {
	private baseUrl: string;

	constructor() {
		this.baseUrl = `${API_BASE_URL}/auth`;
	}

	async sendOTP(
		phoneNumber: string,
		name?: string
	): Promise<ApiResponse<{ otp?: string; is_new_user?: boolean }>> {
		const response = await fetch(`${this.baseUrl}/send-otp`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({ phone_number: phoneNumber, name }),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || 'Failed to send OTP');
		}

		return await response.json();
	}
	async verifyOTP(
		phone_number: string,
		otp_code: string,
		name?: string
	): Promise<{
		message: string;
		user: any;
		token: string;
	}> {
		const response = await fetch(`${this.baseUrl}/verify-otp`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				phone_number,
				otp_code,
				...(name ? { name } : {}),
			}),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || 'Invalid OTP');
		}

		return await response.json();
	}

	async getMe(token: string): Promise<any> {
		const response = await fetch(`${this.baseUrl}/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error('Failed to get user');
		}

		return await response.json();
	}

	async logout(token: string): Promise<void> {
		await fetch(`${this.baseUrl}/logout`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
	}
}

// Export singleton instances
export const marketplaceApi = new MarketplaceApiClient();
export const authApi = new AuthApiClient();
