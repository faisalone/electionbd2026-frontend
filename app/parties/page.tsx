'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PartyCard from '@/components/PartyCard';
import { api, type Party } from '@/lib/api';

export default function PartiesPage() {
	const [parties, setParties] = useState<Party[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		const fetchParties = async () => {
			try {
				setLoading(true);
				const res = await api.getParties();
				if (res.success) {
					setParties(res.data);
				}
			} catch (error) {
				console.error('Failed to fetch parties:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchParties();
	}, []);

	// Filter parties based on search
	const filteredParties = parties.filter(party => 
		party.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		party.name_en.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-gray-900 mb-3">
							রাজনৈতিক দলসমূহ
						</h1>
						<p className="text-lg text-gray-600">
							বাংলাদেশের সকল নিবন্ধিত রাজনৈতিক দল
						</p>
					</div>

					{/* Search Bar */}
					<div className="max-w-2xl mx-auto">
						<div className="relative">
							<input
								type="text"
								placeholder="দলের নাম অনুসন্ধান করুন..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full px-5 py-3 pl-12 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
							/>
							<svg 
								className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{loading ? (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
								<div className="p-4 animate-pulse">
									<div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-3"></div>
									<div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
									<div className="h-3 bg-gray-100 rounded w-1/2 mx-auto"></div>
								</div>
							</div>
						))}
					</div>
				) : filteredParties.length > 0 ? (
					<>
						{/* Results count */}
						<div className="mb-6 text-center">
							<p className="text-gray-600">
								মোট <span className="font-bold text-gray-900">{filteredParties.length}</span> টি দল পাওয়া গেছে
							</p>
						</div>

						{/* Parties Grid */}
						<motion.div 
							className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3 }}
						>
							{filteredParties.map((party, index) => (
								<motion.div
									key={party.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.02, duration: 0.3 }}
								>
									<PartyCard
										id={party.id}
										name={party.name}
										symbol={party.symbol}
										logo={party.logo}
										color={party.color}
										founded={party.founded || '১৯৭১'}
										candidatesCount={party.candidates_count}
									/>
								</motion.div>
							))}
						</motion.div>
					</>
				) : (
					<div className="text-center py-16">
						<div className="mb-4">
							<svg className="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<p className="text-lg font-medium text-gray-900 mb-2">কোন দল পাওয়া যায়নি</p>
						<p className="text-gray-500 mb-4">অনুগ্রহ করে ভিন্ন কীওয়ার্ড দিয়ে চেষ্টা করুন</p>
						{searchQuery && (
							<button
								onClick={() => setSearchQuery('')}
								className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
								সার্চ রিসেট করুন
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
