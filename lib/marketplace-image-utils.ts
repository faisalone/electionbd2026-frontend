/**
 * Unified image URL utility for marketplace
 * Handles both product images and creator avatars
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const BASE_URL = API_BASE_URL.replace('/api/v1', '');

export function getMarketplaceImageUrl(
	path: string | null | undefined
): string | null {
	if (!path || typeof path !== 'string') return null;

	// Already a full URL
	if (path.startsWith('http://') || path.startsWith('https://')) return path;

	// Data URL (base64)
	if (path.startsWith('data:')) return path;

	// Path already includes /storage/
	if (path.startsWith('/storage/')) {
		return `${BASE_URL}${path}`;
	}

	// Relative path - add /storage/ prefix
	return `${BASE_URL}/storage/${path}`;
}

/**
 * Get image URL with fallback
 * @param path - Image path from API
 * @param fallback - Fallback image URL if path is invalid
 */
export function getMarketplaceImageUrlWithFallback(
	path: string | null | undefined,
	fallback: string = '/placeholder-product.jpg'
): string {
	return getMarketplaceImageUrl(path) || fallback;
}
