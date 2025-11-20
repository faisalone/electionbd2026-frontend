import { Product, Creator, ProductRating } from './api';

// Mock ratings data
const sampleRatings: ProductRating[] = [
	{
		id: 1,
		user_name: 'আবদুল্লাহ',
		rating: 5,
		comment: 'অসাধারণ ডিজাইন! খুবই পেশাদার এবং আকর্ষণীয়।',
		created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
	},
	{
		id: 2,
		user_name: 'রহিমা খাতুন',
		rating: 4,
		comment: 'ভালো মানের ডিজাইন। কাস্টমাইজেশন সেবাও চমৎকার।',
		created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
	},
	{
		id: 3,
		user_name: 'করিম মিয়া',
		rating: 5,
		comment: 'দ্রুত ডাউনলোড এবং উচ্চ মানের ফাইল। সুপারিশ করছি।',
		created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
	},
];

// Mock creators data
export const mockCreators: Creator[] = [
	{
		id: 1,
		name: 'রাকিব হোসেন',
		username: 'rakibhossain',
		avatar: 'https://i.pravatar.cc/150?img=1',
		phone: '০১৭১২৩৪৫৬৭৮',
		location: 'ঢাকা, বাংলাদেশ',
		bio: 'পেশাদার গ্রাফিক ডিজাইনার, ৫+ বছরের অভিজ্ঞতা নির্বাচনী প্রচারণা ডিজাইনে',
		specialties: ['ব্যানার', 'পোস্টার', 'বিলবোর্ড'],
		total_designs: 42,
		rating: 4.8,
		joined_date: '২০১৯',
	},
	{
		id: 2,
		name: 'ফাতিমা আক্তার',
		username: 'fatimaakter',
		avatar: 'https://i.pravatar.cc/150?img=5',
		phone: '০১৮১২৩৪৫৬৭৮',
		location: 'চট্টগ্রাম, বাংলাদেশ',
		bio: 'প্রিন্ট মিডিয়া বিশেষজ্ঞ, লিফলেট এবং প্যামফলেট ডিজাইনে দক্ষ',
		specialties: ['লিফলেট', 'হ্যান্ডবিল', 'প্যামফলেট'],
		total_designs: 67,
		rating: 4.9,
		joined_date: '২০১৮',
	},
	{
		id: 3,
		name: 'মাহমুদ হাসান',
		username: 'mahmudhasan',
		avatar: 'https://i.pravatar.cc/150?img=12',
		phone: '০১৯১২৩৪৫৬৭৮',
		location: 'সিলেট, বাংলাদেশ',
		bio: 'ক্রিয়েটিভ ডিজাইনার, আধুনিক এবং ঐতিহ্যবাহী ডিজাইনের মিশ্রণে পারদর্শী',
		specialties: ['পোস্টার', 'ব্যানার', 'সোশ্যাল মিডিয়া'],
		total_designs: 38,
		rating: 4.7,
		joined_date: '২০২০',
	},
	{
		id: 4,
		name: 'সাদিয়া খানম',
		username: 'sadiakhanom',
		avatar: 'https://i.pravatar.cc/150?img=9',
		phone: '০১৬১২৩৪৫৬৭৮',
		location: 'রাজশাহী, বাংলাদেশ',
		bio: 'বড় ফরম্যাট ডিজাইন বিশেষজ্ঞ, ফেস্টুন এবং বিলবোর্ডে অভিজ্ঞ',
		specialties: ['ফেস্টুন', 'বিলবোর্ড', 'ব্যানার'],
		total_designs: 29,
		rating: 5.0,
		joined_date: '২০২১',
	},
	{
		id: 5,
		name: 'তানভীর আহমেদ',
		username: 'tanvirahmed',
		avatar: 'https://i.pravatar.cc/150?img=13',
		phone: '০১৫১২৩৪৫৬৭৮',
		location: 'খুলনা, বাংলাদেশ',
		bio: 'মাল্টিমিডিয়া ডিজাইনার, ভিডিও এবং এনিমেশনে বিশেষজ্ঞ',
		specialties: ['ভিডিও', 'এনিমেশন', 'সোশ্যাল মিডিয়া'],
		total_designs: 51,
		rating: 4.9,
		joined_date: '২০১৭',
	},
	{
		id: 6,
		name: 'নাজমুল ইসলাম',
		username: 'nazmulislam',
		avatar: 'https://i.pravatar.cc/150?img=15',
		phone: '০১৪১২৩৪৫৬৭৮',
		location: 'বরিশাল, বাংলাদেশ',
		bio: 'দ্রুত এবং সাশ্রয়ী ডিজাইন সেবা প্রদানকারী',
		specialties: ['হ্যান্ডবিল', 'লিফলেট', 'পোস্টার'],
		total_designs: 89,
		rating: 4.6,
		joined_date: '২০১৬',
	},
	{
		id: 7,
		name: 'রুমানা পারভীন',
		username: 'rumanaparveen',
		avatar: 'https://i.pravatar.cc/150?img=20',
		phone: '০১৩১২৩৪৫৬৭৮',
		location: 'ময়মনসিংহ, বাংলাদেশ',
		bio: 'বহিরঙ্গন বিজ্ঞাপন ডিজাইনে অভিজ্ঞ পেশাদার',
		specialties: ['বিলবোর্ড', 'ফেস্টুন', 'বহিরঙ্গন'],
		total_designs: 34,
		rating: 4.8,
		joined_date: '২০১৯',
	},
	{
		id: 8,
		name: 'আরিফ হোসেন',
		username: 'arifhossain',
		avatar: 'https://i.pravatar.cc/150?img=33',
		phone: '০১২১২৩৪৫৬৭৮',
		location: 'রংপুর, বাংলাদেশ',
		bio: 'ডিজিটাল মার্কেটিং এবং সোশ্যাল মিডিয়া ডিজাইন বিশেষজ্ঞ',
		specialties: ['সোশ্যাল মিডিয়া', 'ডিজিটাল', 'ভিডিও'],
		total_designs: 76,
		rating: 4.9,
		joined_date: '২০১৮',
	},
];

// Mock products data for marketplace
export const mockProducts: Product[] = [
	{
		id: 1,
		uid: 'election-banner-design-2026',
		title: 'নির্বাচনী ব্যানার ডিজাইন',
		title_en: 'Election Banner Design',
		description:
			'পেশাদার নির্বাচনী ব্যানার ডিজাইন। উচ্চ মানের প্রিন্ট রেডি ফাইল সহ। কাস্টমাইজেশন সুবিধা উপলব্ধ।',
		category: 'banner',
		images: ['/products/posters/poster 1 mockup.png'],
		creator: mockCreators[0],
		tags: ['ব্যানার', 'নির্বাচন', 'প্রচারণা'],
		rating: 4.8,
		ratings: sampleRatings,
		downloads_count: 234,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 2,
		uid: 'leaflet-design-package-premium',
		title: 'লিফলেট ডিজাইন প্যাকেজ',
		title_en: 'Leaflet Design Package',
		description:
			'আকর্ষণীয় নির্বাচনী লিফলেট ডিজাইন। A4 এবং A5 সাইজে উপলব্ধ। দ্রুত ডেলিভারি নিশ্চিত।',
		category: 'leaflet',
		images: [
			'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
		],
		creator: mockCreators[1],
		tags: ['লিফলেট', 'প্যামফলেট', 'প্রচারণা'],
		rating: 4.9,
		downloads_count: 456,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 3,
		uid: 'poster-design-series-election',
		title: 'পোস্টার ডিজাইন সিরিজ',
		title_en: 'Poster Design Series',
		description:
			'নির্বাচনী পোস্টার ডিজাইনের সেট। বিভিন্ন সাইজে প্রিন্ট রেডি। সম্পূর্ণ কাস্টমাইজেবল।',
		category: 'poster',
		images: [
			'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
			'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800',
		],
		creator: mockCreators[2],
		tags: ['পোস্টার', 'ওয়াল পোস্টার', 'প্রিন্ট'],
		rating: 4.7,
		downloads_count: 189,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 4,
		uid: 'premium-festoon-design-outdoor',
		title: 'ফেস্টুন ডিজাইন প্রিমিয়াম',
		title_en: 'Premium Festoon Design',
		description:
			'বড় সাইজের ফেস্টুন ডিজাইন। রঙিন এবং আকর্ষণীয়। দীর্ঘস্থায়ী ম্যাটেরিয়াল রিকমেন্ডেশন সহ।',
		category: 'festoon',
		images: [
			'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
		],
		creator: mockCreators[3],
		tags: ['ফেস্টুন', 'ব্যানার', 'বড় প্রিন্ট'],
		rating: 5.0,
		downloads_count: 123,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 5,
		uid: 'election-campaign-video-promo',
		title: 'নির্বাচনী প্রচার ভিডিও',
		title_en: 'Election Campaign Video',
		description:
			'পেশাদার প্রচার ভিডিও প্রোডাকশন। এনিমেশন এবং গ্রাফিক্স সহ। সোশ্যাল মিডিয়া ফরম্যাটে।',
		category: 'video',
		images: [
			'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
		],
		creator: mockCreators[4],
		tags: ['ভিডিও', 'এনিমেশন', 'প্রমোশনাল'],
		rating: 4.9,
		downloads_count: 287,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 6,
		uid: 'handbill-design-compact',
		title: 'হ্যান্ডবিল ডিজাইন',
		title_en: 'Handbill Design',
		description:
			'ছোট সাইজের হ্যান্ডবিল ডিজাইন। দ্রুত বিতরণের জন্য আদর্শ। সাশ্রয়ী মূল্যে উচ্চ মান।',
		category: 'handbill',
		images: [
			'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
		],
		creator: mockCreators[5],
		tags: ['হ্যান্ডবিল', 'ছোট প্রিন্ট', 'বিতরণ'],
		rating: 4.6,
		downloads_count: 542,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 7,
		uid: 'billboard-design-outdoor',
		title: 'বিলবোর্ড ডিজাইন',
		title_en: 'Billboard Design',
		description:
			'বড় বিলবোর্ডের জন্য হাই রেজোলিউশন ডিজাইন। প্রভাবশালী এবং চোখ ধাঁধানো। সব সাইজে উপলব্ধ।',
		category: 'billboard',
		images: [
			'https://images.unsplash.com/photo-1551817958-20d90a602d7f?w=800',
			'https://images.unsplash.com/photo-1563906267088-b029e7101114?w=800',
		],
		creator: mockCreators[6],
		tags: ['বিলবোর্ড', 'বহিরঙ্গন', 'বড় ডিসপ্লে'],
		rating: 4.8,
		downloads_count: 156,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 8,
		uid: 'social-media-post-pack',
		title: 'সোশ্যাল মিডিয়া পোস্ট প্যাক',
		title_en: 'Social Media Post Pack',
		description:
			'ফেসবুক, ইনস্টাগ্রাম এবং টুইটারের জন্য ডিজাইন প্যাক। ১০টি ইউনিক ডিজাইন সহ। সব সাইজে অপটিমাইজড।',
		category: 'social-media',
		images: ['/products/social/social media post 1 mockup.png'],
		creator: mockCreators[7],
		tags: ['সোশ্যাল মিডিয়া', 'ফেসবুক', 'ডিজিটাল'],
		rating: 4.9,
		downloads_count: 678,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 9,
		uid: 'professional-banner-template',
		title: 'পেশাদার ব্যানার টেমপ্লেট',
		title_en: 'Professional Banner Template',
		description:
			'উচ্চ মানের পেশাদার ব্যানার টেমপ্লেট। সম্পূর্ণ কাস্টমাইজেবল এবং প্রিন্ট রেডি।',
		category: 'banner',
		images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'],
		creator: mockCreators[0],
		tags: ['ব্যানার', 'টেমপ্লেট', 'পেশাদার'],
		rating: 4.7,
		downloads_count: 421,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 10,
		uid: 'election-poster-modern',
		title: 'আধুনিক নির্বাচনী পোস্টার',
		title_en: 'Modern Election Poster',
		description:
			'আধুনিক এবং আকর্ষণীয় নির্বাচনী পোস্টার ডিজাইন। A3 এবং A4 উভয় সাইজে উপলব্ধ।',
		category: 'poster',
		images: ['https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800'],
		creator: mockCreators[2],
		tags: ['পোস্টার', 'আধুনিক', 'নির্বাচন'],
		rating: 4.8,
		downloads_count: 512,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 11,
		uid: 'campaign-leaflet-design',
		title: 'ক্যাম্পেইন লিফলেট ডিজাইন',
		title_en: 'Campaign Leaflet Design',
		description:
			'প্রভাবশালী ক্যাম্পেইন লিফলেট ডিজাইন। দ্রুত প্রিন্ট সেবা সহ উপলব্ধ।',
		category: 'leaflet',
		images: ['https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800'],
		creator: mockCreators[1],
		tags: ['লিফলেট', 'ক্যাম্পেইন', 'প্রচারণা'],
		rating: 4.6,
		downloads_count: 389,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 12,
		uid: 'outdoor-festoon-mega',
		title: 'মেগা আউটডোর ফেস্টুন',
		title_en: 'Mega Outdoor Festoon',
		description:
			'অতি বড় সাইজের আউটডোর ফেস্টুন ডিজাইন। দূর থেকে দৃশ্যমান এবং প্রভাবশালী।',
		category: 'festoon',
		images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'],
		creator: mockCreators[3],
		tags: ['ফেস্টুন', 'আউটডোর', 'মেগা'],
		rating: 4.9,
		downloads_count: 267,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 13,
		uid: 'social-media-campaign-kit',
		title: 'সোশ্যাল মিডিয়া ক্যাম্পেইন কিট',
		title_en: 'Social Media Campaign Kit',
		description:
			'সম্পূর্ণ সোশ্যাল মিডিয়া ক্যাম্পেইন কিট। ২০+ ডিজাইন টেমপ্লেট সহ।',
		category: 'social-media',
		images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800'],
		creator: mockCreators[7],
		tags: ['সোশ্যাল মিডিয়া', 'ক্যাম্পেইন', 'কিট'],
		rating: 4.8,
		downloads_count: 891,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 14,
		uid: 'handbill-distribution-pack',
		title: 'হ্যান্ডবিল বিতরণ প্যাক',
		title_en: 'Handbill Distribution Pack',
		description:
			'গণ বিতরণের জন্য হ্যান্ডবিল ডিজাইন প্যাক। ১০০০+ পিস অর্ডারে ছাড়।',
		category: 'handbill',
		images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800'],
		creator: mockCreators[5],
		tags: ['হ্যান্ডবিল', 'বিতরণ', 'প্যাক'],
		rating: 4.5,
		downloads_count: 734,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 15,
		uid: 'billboard-highway-design',
		title: 'হাইওয়ে বিলবোর্ড ডিজাইন',
		title_en: 'Highway Billboard Design',
		description:
			'হাইওয়ের জন্য বিশেষভাবে ডিজাইন করা বিলবোর্ড। দূর থেকে পঠনযোগ্য।',
		category: 'billboard',
		images: ['https://images.unsplash.com/photo-1551817958-20d90a602d7f?w=800'],
		creator: mockCreators[6],
		tags: ['বিলবোর্ড', 'হাইওয়ে', 'বহিরঙ্গন'],
		rating: 4.7,
		downloads_count: 198,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 16,
		uid: 'campaign-video-short',
		title: 'সংক্ষিপ্ত ক্যাম্পেইন ভিডিও',
		title_en: 'Short Campaign Video',
		description:
			'৩০ সেকেন্ডের সংক্ষিপ্ত ক্যাম্পেইন ভিডিও। সোশ্যাল মিডিয়ার জন্য অপটিমাইজড।',
		category: 'video',
		images: ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800'],
		creator: mockCreators[4],
		tags: ['ভিডিও', 'সংক্ষিপ্ত', 'ক্যাম্পেইন'],
		rating: 4.9,
		downloads_count: 445,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 17,
		uid: 'election-banner-economy',
		title: 'সাশ্রয়ী নির্বাচনী ব্যানার',
		title_en: 'Economy Election Banner',
		description:
			'সাশ্রয়ী মূল্যে মানসম্মত নির্বাচনী ব্যানার। স্থানীয় প্রচারণার জন্য আদর্শ।',
		category: 'banner',
		images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'],
		creator: mockCreators[0],
		tags: ['ব্যানার', 'সাশ্রয়ী', 'স্থানীয়'],
		rating: 4.4,
		downloads_count: 623,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 18,
		uid: 'poster-wall-mounting',
		title: 'ওয়াল মাউন্টিং পোস্টার',
		title_en: 'Wall Mounting Poster',
		description:
			'দেয়ালে সাঁটানোর জন্য বিশেষ পোস্টার ডিজাইন। দীর্ঘস্থায়ী ম্যাটেরিয়াল।',
		category: 'poster',
		images: ['https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800'],
		creator: mockCreators[2],
		tags: ['পোস্টার', 'ওয়াল', 'দীর্ঘস্থায়ী'],
		rating: 4.6,
		downloads_count: 356,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 19,
		uid: 'leaflet-door-to-door',
		title: 'ডোর টু ডোর লিফলেট',
		title_en: 'Door to Door Leaflet',
		description:
			'ঘরে ঘরে বিতরণের জন্য লিফলেট ডিজাইন। সহজ এবং কার্যকর মেসেজিং।',
		category: 'leaflet',
		images: ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800'],
		creator: mockCreators[1],
		tags: ['লিফলেট', 'ডোর টু ডোর', 'বিতরণ'],
		rating: 4.7,
		downloads_count: 567,
		customization_available: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
	{
		id: 20,
		uid: 'festoon-rally-design',
		title: 'র্যালি ফেস্টুন ডিজাইন',
		title_en: 'Rally Festoon Design',
		description:
			'র্যালি এবং মিছিলের জন্য ফেস্টুন ডিজাইন। হালকা এবং বহনযোগ্য।',
		category: 'festoon',
		images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
		creator: mockCreators[3],
		tags: ['ফেস্টুন', 'র্যালি', 'মিছিল'],
		rating: 4.8,
		downloads_count: 289,
		customization_available: true,
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

// Get product by UID
export function getProductByUid(uid: string): Product | undefined {
	return mockProducts.find((product) => product.uid === uid);
}

// Get creator by ID
export function getCreatorById(id: number): Creator | undefined {
	return mockCreators.find((creator) => creator.id === id);
}

// Get creator by username
export function getCreatorByUsername(username: string): Creator | undefined {
	return mockCreators.find((creator) => creator.username === username);
}

// Get products by creator ID
export function getProductsByCreator(creatorId: number): Product[] {
	return mockProducts.filter((product) => product.creator.id === creatorId);
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

// Convert number to Bengali numerals
export function toBengaliNumber(num: number | string): string {
	const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
	return String(num).replace(
		/\d/g,
		(digit) => bengaliDigits[parseInt(digit)]
	);
}
