'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Phone, Mail, Globe, Building, User } from 'lucide-react';
import CandidateCard from '@/components/CandidateCard';
import { api, type Party, type Candidate } from '@/lib/api';
import { getImageUrl } from '@/lib/admin/api';

export default function PartyDetailsPage() {
	const params = useParams();
	const partyId = params.id as string;
	
	const [party, setParty] = useState<Party | null>(null);
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const [loading, setLoading] = useState(true);
	const [candidatesLoading, setCandidatesLoading] = useState(true);

	useEffect(() => {
		const fetchPartyData = async () => {
			try {
				setLoading(true);
				const res = await api.getParty(parseInt(partyId));
				if (res.success) {
					setParty(res.data);
				}
			} catch (error) {
				console.error('Failed to fetch party:', error);
			} finally {
				setLoading(false);
			}
		};

		const fetchCandidates = async () => {
			try {
				setCandidatesLoading(true);
				const res = await api.getCandidates({ party_id: parseInt(partyId) });
				if (res.success) {
					setCandidates(res.data);
				}
			} catch (error) {
				console.error('Failed to fetch candidates:', error);
			} finally {
				setCandidatesLoading(false);
			}
		};

		if (partyId) {
			fetchPartyData();
			fetchCandidates();
		}
	}, [partyId]);

	if (loading) {
		return (
			<div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="animate-pulse">
						<div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
							<div className="flex flex-col md:flex-row gap-8">
								<div className="w-32 h-32 bg-gray-200 rounded-2xl"></div>
								<div className="flex-1">
									<div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
									<div className="h-4 bg-gray-100 rounded w-1/3 mb-6"></div>
									<div className="grid grid-cols-2 gap-4">
										{[1, 2, 3, 4].map(i => (
											<div key={i} className="h-4 bg-gray-100 rounded"></div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!party) {
		return (
			<div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
				<div className="text-center">
					<p className="text-xl font-semibold text-gray-900">দল খুঁজে পাওয়া যায়নি</p>
				</div>
			</div>
		);
	}

	const symbolData = typeof party.symbol === 'object' && party.symbol ? party.symbol : null;
	const firstLetter = party.name.charAt(0).toUpperCase();

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30">
			{/* Hero Section */}
			<div className="bg-white border-b border-gray-200 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<motion.div 
						className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
					>
						<div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
							{/* Party Logo */}
							<div className="shrink-0">
								{party.logo ? (
									<img 
										src={getImageUrl(party.logo)} 
										alt={party.name}
										className="w-24 h-24 md:w-32 md:h-32 object-contain"
									/>
								) : (
									<div 
										className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-lg"
										style={{ backgroundColor: party.color }}
									>
										{firstLetter}
									</div>
								)}
							</div>

							{/* Party Info */}
							<div className="flex-1">
								<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
									{party.name}
								</h1>
								<p className="text-lg text-gray-600 mb-4">{party.name_en}</p>

								{/* Symbol */}
								{symbolData && (
									<div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
										{symbolData.image && (
											<img 
												src={getImageUrl(symbolData.image)} 
												alt={symbolData.symbol_name}
												className="w-8 h-8 object-contain"
											/>
										)}
										<div>
											<p className="text-xs text-gray-500">নির্বাচনী মার্কা</p>
											<p className="font-bold text-gray-900">{symbolData.symbol_name}</p>
										</div>
									</div>
								)}

								{/* Key Stats */}
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									{party.founded && (
										<div className="flex items-center gap-2 text-gray-700">
											<Calendar className="w-5 h-5 text-gray-400" />
											<div>
												<p className="text-xs text-gray-500">প্রতিষ্ঠা</p>
												<p className="font-semibold">{party.founded}</p>
											</div>
										</div>
									)}
									{party.candidates_count !== undefined && (
										<div className="flex items-center gap-2 text-gray-700">
											<Users className="w-5 h-5 text-gray-400" />
											<div>
												<p className="text-xs text-gray-500">প্রার্থী</p>
												<p className="font-semibold">{party.candidates_count} জন</p>
											</div>
										</div>
									)}
									{(party as any).registration_number && (
										<div className="flex items-center gap-2 text-gray-700">
											<Building className="w-5 h-5 text-gray-400" />
											<div>
												<p className="text-xs text-gray-500">নিবন্ধন নম্বর</p>
												<p className="font-semibold">{(party as any).registration_number}</p>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Details Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
					{/* Contact Information */}
					<motion.div 
						className="lg:col-span-2 bg-white rounded-xl shadow-md p-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1, duration: 0.4 }}
					>
						<h2 className="text-2xl font-bold text-gray-900 mb-4">যোগাযোগের তথ্য</h2>
						<div className="space-y-4">
							{(party as any).chairman && (
								<div className="flex items-start gap-3">
									<User className="w-5 h-5 text-gray-400 mt-0.5" />
									<div>
										<p className="text-sm text-gray-500">সভাপতি</p>
										<p className="font-medium text-gray-900">{(party as any).chairman}</p>
									</div>
								</div>
							)}
							{(party as any).secretary_general && (
								<div className="flex items-start gap-3">
									<User className="w-5 h-5 text-gray-400 mt-0.5" />
									<div>
										<p className="text-sm text-gray-500">মহাসচিব</p>
										<p className="font-medium text-gray-900">{(party as any).secretary_general}</p>
									</div>
								</div>
							)}
							{(party as any).office_address && (
								<div className="flex items-start gap-3">
									<MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
									<div>
										<p className="text-sm text-gray-500">কেন্দ্রীয় কার্যালয়</p>
										<p className="font-medium text-gray-900">{(party as any).office_address}</p>
									</div>
								</div>
							)}
							{(party as any).phone && (
								<div className="flex items-start gap-3">
									<Phone className="w-5 h-5 text-gray-400 mt-0.5" />
									<div>
										<p className="text-sm text-gray-500">ফোন</p>
										<p className="font-medium text-gray-900">{(party as any).phone}</p>
									</div>
								</div>
							)}
							{(party as any).mobile && (
								<div className="flex items-start gap-3">
									<Phone className="w-5 h-5 text-gray-400 mt-0.5" />
									<div>
										<p className="text-sm text-gray-500">মোবাইল</p>
										<p className="font-medium text-gray-900">{(party as any).mobile}</p>
									</div>
								</div>
							)}
							{(party as any).email && (
								<div className="flex items-start gap-3">
									<Mail className="w-5 h-5 text-gray-400 mt-0.5" />
									<div>
										<p className="text-sm text-gray-500">ইমেইল</p>
										<a href={`mailto:${(party as any).email}`} className="font-medium text-blue-600 hover:underline">
											{(party as any).email}
										</a>
									</div>
								</div>
							)}
							{(party as any).website && (
								<div className="flex items-start gap-3">
									<Globe className="w-5 h-5 text-gray-400 mt-0.5" />
									<div>
										<p className="text-sm text-gray-500">ওয়েবসাইট</p>
										<a 
											href={(party as any).website.startsWith('http') ? (party as any).website : `https://${(party as any).website}`} 
											target="_blank" 
											rel="noopener noreferrer"
											className="font-medium text-blue-600 hover:underline"
										>
											{(party as any).website}
										</a>
									</div>
								</div>
							)}
						</div>
					</motion.div>

					{/* Additional Info */}
					<motion.div 
						className="bg-white rounded-xl shadow-md p-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.4 }}
					>
						<h2 className="text-2xl font-bold text-gray-900 mb-4">অতিরিক্ত তথ্য</h2>
						<div className="space-y-4">
							{(party as any).registration_date && (
								<div>
									<p className="text-sm text-gray-500 mb-1">নিবন্ধনের তারিখ</p>
									<p className="font-medium text-gray-900">
										{new Date((party as any).registration_date).toLocaleDateString('bn-BD')}
									</p>
								</div>
							)}
							{(party as any).fax && (
								<div>
									<p className="text-sm text-gray-500 mb-1">ফ্যাক্স</p>
									<p className="font-medium text-gray-900">{(party as any).fax}</p>
								</div>
							)}
						</div>
					</motion.div>
				</div>

				{/* Candidates Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.4 }}
				>
					<h2 className="text-3xl font-bold text-gray-900 mb-6">প্রার্থীবৃন্দ</h2>
					{candidatesLoading ? (
						<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
									<div className="w-12 h-12 bg-gray-200 rounded-full mb-3"></div>
									<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
									<div className="h-3 bg-gray-100 rounded w-1/2"></div>
								</div>
							))}
						</div>
					) : candidates.length > 0 ? (
						<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{candidates.map((candidate) => {
								const seat = candidate.seat;
								const district = seat?.district;
								
								const symbolImage = typeof candidate.symbol === 'object' && candidate.symbol?.image 
									? getImageUrl(candidate.symbol.image) 
									: null;
								const symbolName = typeof candidate.symbol === 'object' 
									? candidate.symbol?.symbol_name 
									: '';
								
								const seatDisplay = seat && district 
									? `${district.name} (${seat.name})`
									: seat?.name || 'N/A';

								return (
									<CandidateCard
										key={candidate.id}
										id={candidate.id.toString()}
										name={candidate.name || candidate.name_en}
										partyName={party.name}
										partySymbol={symbolImage ? { image: candidate.symbol?.image || '', symbol_name: symbolName } : ''}
										partySymbolName={symbolName}
										partyColor={party.color}
										seatName={seatDisplay}
										age={candidate.age}
										education={candidate.education}
										experience={candidate.experience || ''}
										image={''}
									/>
								);
							})}
						</div>
					) : (
						<div className="text-center py-12 bg-white rounded-xl shadow-md">
							<p className="text-gray-500">এই দলের কোন প্রার্থী নেই</p>
						</div>
					)}
				</motion.div>
			</div>
		</div>
	);
}
