import { Product } from './api';

// Mock products data for marketplace
export const mockProducts: Product[] = [
	{
		id: 1,
		title: 'নির্বাচনী ব্যানার ডিজাইন',
		title_en: 'Election Banner Design',
		description:
			'পেশাদার নির্বাচনী ব্যানার ডিজাইন। উচ্চ মানের প্রিন্ট রেডি ফাইল সহ। কাস্টমাইজেশন সুবিধা উপলব্ধ।',
		category: 'banner',
		price: 2500,
		images: [
			'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
			'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
		],
		owner: {
			id: 1,
			name: 'রাকিব হোসেন',
			avatar: 'https://i.pravatar.cc/150?img=1',
			phone: '০১৭১২৩৪৫৬৭৮',
			location: 'ঢাকা, বাংলাদেশ',
		},
		tags: ['ব্যানার', 'নির্বাচন', 'প্রচারণা'],
		rating: 4.8,
		reviews_count: 24,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 2,
		title: 'লিফলেট ডিজাইন প্যাকেজ',
		title_en: 'Leaflet Design Package',
		description:
			'আকর্ষণীয় নির্বাচনী লিফলেট ডিজাইন। A4 এবং A5 সাইজে উপলব্ধ। দ্রুত ডেলিভারি নিশ্চিত।',
		category: 'leaflet',
		price: 1500,
		images: [
			'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
		],
		owner: {
			id: 2,
			name: 'ফাতিমা আক্তার',
			avatar: 'https://i.pravatar.cc/150?img=5',
			phone: '০১৮১২৩৪৫৬৭৮',
			location: 'চট্টগ্রাম, বাংলাদেশ',
		},
		tags: ['লিফলেট', 'প্যামফলেট', 'প্রচারণা'],
		rating: 4.9,
		reviews_count: 36,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 3,
		title: 'পোস্টার ডিজাইন সিরিজ',
		title_en: 'Poster Design Series',
		description:
			'নির্বাচনী পোস্টার ডিজাইনের সেট। বিভিন্ন সাইজে প্রিন্ট রেডি। সম্পূর্ণ কাস্টমাইজেবল।',
		category: 'poster',
		price: 3000,
		images: [
			'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
			'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800',
		],
		owner: {
			id: 3,
			name: 'মাহমুদ হাসান',
			avatar: 'https://i.pravatar.cc/150?img=12',
			phone: '০১৯১২৩৪৫৬৭৮',
			location: 'সিলেট, বাংলাদেশ',
		},
		tags: ['পোস্টার', 'ওয়াল পোস্টার', 'প্রিন্ট'],
		rating: 4.7,
		reviews_count: 18,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 4,
		title: 'ফেস্টুন ডিজাইন প্রিমিয়াম',
		title_en: 'Premium Festoon Design',
		description:
			'বড় সাইজের ফেস্টুন ডিজাইন। রঙিন এবং আকর্ষণীয়। দীর্ঘস্থায়ী ম্যাটেরিয়াল রিকমেন্ডেশন সহ।',
		category: 'festoon',
		price: 4500,
		images: [
			'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
		],
		owner: {
			id: 4,
			name: 'সাদিয়া খানম',
			avatar: 'https://i.pravatar.cc/150?img=9',
			phone: '০১৬১২৩৪৫৬৭৮',
			location: 'রাজশাহী, বাংলাদেশ',
		},
		tags: ['ফেস্টুন', 'ব্যানার', 'বড় প্রিন্ট'],
		rating: 5.0,
		reviews_count: 12,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 5,
		title: 'নির্বাচনী প্রচার ভিডিও',
		title_en: 'Election Campaign Video',
		description:
			'পেশাদার প্রচার ভিডিও প্রোডাকশন। এনিমেশন এবং গ্রাফিক্স সহ। সোশ্যাল মিডিয়া ফরম্যাটে।',
		category: 'video',
		price: 15000,
		images: [
			'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
		],
		owner: {
			id: 5,
			name: 'তানভীর আহমেদ',
			avatar: 'https://i.pravatar.cc/150?img=13',
			phone: '০১৫১২৩৪৫৬৭৮',
			location: 'খুলনা, বাংলাদেশ',
		},
		tags: ['ভিডিও', 'এনিমেশন', 'প্রমোশনাল'],
		rating: 4.9,
		reviews_count: 28,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 6,
		title: 'হ্যান্ডবিল ডিজাইন',
		title_en: 'Handbill Design',
		description:
			'ছোট সাইজের হ্যান্ডবিল ডিজাইন। দ্রুত বিতরণের জন্য আদর্শ। সাশ্রয়ী মূল্যে উচ্চ মান।',
		category: 'handbill',
		price: 800,
		images: [
			'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
		],
		owner: {
			id: 6,
			name: 'নাজমুল ইসলাম',
			avatar: 'https://i.pravatar.cc/150?img=15',
			phone: '০১৪১২৩৪৫৬৭৮',
			location: 'বরিশাল, বাংলাদেশ',
		},
		tags: ['হ্যান্ডবিল', 'ছোট প্রিন্ট', 'বিতরণ'],
		rating: 4.6,
		reviews_count: 42,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 7,
		title: 'বিলবোর্ড ডিজাইন',
		title_en: 'Billboard Design',
		description:
			'বড় বিলবোর্ডের জন্য হাই রেজোলিউশন ডিজাইন। প্রভাবশালী এবং চোখ ধাঁধানো। সব সাইজে উপলব্ধ।',
		category: 'billboard',
		price: 8000,
		images: [
			'https://images.unsplash.com/photo-1551817958-20d90a602d7f?w=800',
			'https://images.unsplash.com/photo-1563906267088-b029e7101114?w=800',
		],
		owner: {
			id: 7,
			name: 'রুমানা পারভীন',
			avatar: 'https://i.pravatar.cc/150?img=20',
			phone: '০১৩১২৩৪৫৬৭৮',
			location: 'ময়মনসিংহ, বাংলাদেশ',
		},
		tags: ['বিলবোর্ড', 'বহিরঙ্গন', 'বড় ডিসপ্লে'],
		rating: 4.8,
		reviews_count: 15,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 8,
		title: 'সোশ্যাল মিডিয়া পোস্ট প্যাক',
		title_en: 'Social Media Post Pack',
		description:
			'ফেসবুক, ইনস্টাগ্রাম এবং টুইটারের জন্য ডিজাইন প্যাক। ১০টি ইউনিক ডিজাইন সহ। সব সাইজে অপটিমাইজড।',
		category: 'social-media',
		price: 3500,
		images: [
			'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800',
		],
		owner: {
			id: 8,
			name: 'আরিফ হোসেন',
			avatar: 'https://i.pravatar.cc/150?img=33',
			phone: '০১২১২৩৪৫৬৭৮',
			location: 'রংপুর, বাংলাদেশ',
		},
		tags: ['সোশ্যাল মিডিয়া', 'ফেসবুক', 'ডিজিটাল'],
		rating: 4.9,
		reviews_count: 56,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
];

// Category labels in Bengali
export const categoryLabels: Record<string, string> = {
	banner: 'ব্যানার',
	leaflet: 'লিফলেট',
	poster: 'পোস্টার',
	festoon: 'ফেস্টুন',
	video: 'ভিডিও/এভি',
	handbill: 'হ্যান্ডবিল',
	billboard: 'বিলবোর্ড',
	'social-media': 'সোশ্যাল মিডিয়া',
};

// Filter products by category
export function getProductsByCategory(category?: string): Product[] {
	if (!category || category === 'all') {
		return mockProducts;
	}
	return mockProducts.filter((product) => product.category === category);
}

// Get product by ID
export function getProductById(id: number): Product | undefined {
	return mockProducts.find((product) => product.id === id);
}

// Search products
export function searchProducts(query: string): Product[] {
	const lowerQuery = query.toLowerCase();
	return mockProducts.filter(
		(product) =>
			product.title.toLowerCase().includes(lowerQuery) ||
			product.title_en.toLowerCase().includes(lowerQuery) ||
			product.description.toLowerCase().includes(lowerQuery) ||
			product.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
	);
}
