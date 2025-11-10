'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, Filter } from 'lucide-react';
import CandidateCard from './CandidateCard';
import CustomSelect from './CustomSelect';
import {
	divisionsData,
	districtsData,
	seatsData,
	candidatesData,
	partiesData,
	independentSymbols,
} from '@/lib/mockData';

export default function DivisionExplorer() {
	const router = useRouter();
	const searchParams = useSearchParams();
	
	// Initialize from URL params
	const [selectedDivision, setSelectedDivision] = useState<string | null>(
		searchParams.get('division')
	);
	const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
		searchParams.get('district')
	);
	const [selectedSeat, setSelectedSeat] = useState<string | null>(
		searchParams.get('seat')
	);
	const [currentPage, setCurrentPage] = useState(
		parseInt(searchParams.get('page') || '1')
	);
	const candidatesPerPage = 9;

	// Get filtered data based on selection
	const filteredDistricts = selectedDivision
		? districtsData.filter((d) => d.divisionId === selectedDivision)
		: [];

	const filteredSeats = selectedDistrict
		? seatsData.filter((s) => s.districtId === selectedDistrict)
		: [];

	// Smart filtering: Filter candidates based on the most specific selection
	const filteredCandidates = (() => {
		if (selectedSeat) {
			// If seat is selected, show only that seat's candidates
			return candidatesData.filter((c) => c.seatId === selectedSeat);
		} else if (selectedDistrict) {
			// If district is selected, show all candidates from seats in that district
			const districtSeats = seatsData
				.filter((s) => s.districtId === selectedDistrict)
				.map((s) => s.id);
			return candidatesData.filter((c) => districtSeats.includes(c.seatId));
		} else if (selectedDivision) {
			// If division is selected, show all candidates from districts in that division
			const divisionDistricts = districtsData
				.filter((d) => d.divisionId === selectedDivision)
				.map((d) => d.id);
			const divisionSeats = seatsData
				.filter((s) => divisionDistricts.includes(s.districtId))
				.map((s) => s.id);
			return candidatesData.filter((c) => divisionSeats.includes(c.seatId));
		} else {
			// No selection, show all candidates
			return candidatesData;
		}
	})();

	// Pagination
	const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
	const startIndex = (currentPage - 1) * candidatesPerPage;
	const endIndex = startIndex + candidatesPerPage;
	const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

	// Get party info for candidate
	const getPartyInfo = (partyId: string) => {
		return partiesData.find((p) => p.id === partyId) || partiesData[0];
	};

	// Get seat info for candidate
	const getSeatInfo = (seatId: string) => {
		return seatsData.find((s) => s.id === seatId);
	};

	// Update URL with current state
	const updateURL = (
		division: string | null,
		district: string | null,
		seat: string | null,
		page: number
	) => {
		const params = new URLSearchParams();
		if (division) params.set('division', division);
		if (district) params.set('district', district);
		if (seat) params.set('seat', seat);
		if (page > 1) params.set('page', page.toString());
		
		const queryString = params.toString();
		router.push(queryString ? `/?${queryString}` : '/', {
			scroll: false,
		});
	};

	// Reset selections
	const handleDivisionClick = (divisionId: string) => {
		if (selectedDivision === divisionId) {
			setSelectedDivision(null);
			setSelectedDistrict(null);
			setSelectedSeat(null);
			updateURL(null, null, null, 1);
		} else {
			setSelectedDivision(divisionId);
			setSelectedDistrict(null);
			setSelectedSeat(null);
			updateURL(divisionId, null, null, 1);
		}
		setCurrentPage(1);
	};

	const handleDistrictClick = (districtId: string) => {
		if (selectedDistrict === districtId) {
			setSelectedDistrict(null);
			setSelectedSeat(null);
			updateURL(selectedDivision, null, null, 1);
		} else {
			setSelectedDistrict(districtId);
			setSelectedSeat(null);
			updateURL(selectedDivision, districtId, null, 1);
		}
		setCurrentPage(1);
	};

	const handleSeatClick = (seatId: string) => {
		if (selectedSeat === seatId) {
			setSelectedSeat(null);
			updateURL(selectedDivision, selectedDistrict, null, 1);
		} else {
			setSelectedSeat(seatId);
			updateURL(selectedDivision, selectedDistrict, seatId, 1);
		}
		setCurrentPage(1);
	};

	// Update page and URL
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		updateURL(selectedDivision, selectedDistrict, selectedSeat, page);
	};

	const fadeInUp = {
		initial: { opacity: 0, y: 24 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -24 }
	};

	// Search and filter states
	const [searchQuery, setSearchQuery] = useState('');
	const [partyFilter, setPartyFilter] = useState<string>('all');
	const [symbolFilter, setSymbolFilter] = useState<string>('all');

	// Sync party and symbol filters
	const handlePartyChange = (partyId: string) => {
		setPartyFilter(partyId);
		setSymbolFilter(partyId === 'independent' ? 'all' : partyId);
	};

	const handleSymbolChange = (symbolId: string) => {
		setSymbolFilter(symbolId);
		setPartyFilter(symbolId.startsWith('ind-') ? 'independent' : symbolId);
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchQuery('');
		setPartyFilter('all');
		setSymbolFilter('all');
	};

	// Apply all filters to candidates
	const searchFilteredCandidates = filteredCandidates.filter((candidate) => {
		const query = searchQuery.toLowerCase();
		const party = getPartyInfo(candidate.partyId);
		const seat = getSeatInfo(candidate.seatId);
		
		// Search matches name, party, seat, education, or experience
		const matchesSearch = !query || 
			candidate.name.toLowerCase().includes(query) ||
			candidate.nameEn.toLowerCase().includes(query) ||
			seat?.name.toLowerCase().includes(query) ||
			party?.name.toLowerCase().includes(query) ||
			candidate.education.toLowerCase().includes(query) ||
			candidate.experience.toLowerCase().includes(query);

		// Party filter matches
		const matchesParty = partyFilter === 'all' || candidate.partyId === partyFilter;

		// Symbol filter matches (independent symbols or party symbols)
		const matchesSymbol = symbolFilter === 'all' || 
			candidate.symbolId === symbolFilter || 
			candidate.partyId === symbolFilter;

		return matchesSearch && matchesParty && matchesSymbol;
	});

	// Reset page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, partyFilter, symbolFilter]);

	// Pagination for filtered results
	const totalPagesFiltered = Math.ceil(searchFilteredCandidates.length / candidatesPerPage);
	const paginatedFilteredCandidates = searchFilteredCandidates.slice(startIndex, endIndex);

	// Get available parties and symbols from filtered candidates
	const availableParties = partiesData.filter(party => 
		party.id !== 'independent' && 
		filteredCandidates.some(c => c.partyId === party.id)
	);
	
	const hasIndependentCandidates = filteredCandidates.some(c => c.partyId === 'independent');

	return (
		<div className="w-full max-w-7xl mx-auto">
			{/* Header - Minimal and Clean */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
				className="text-center mb-16"
			>
				<h2 className="text-[56px] font-semibold tracking-tight text-gray-900 mb-4">
					প্রার্থী অনুসন্ধান
				</h2>
				<p className="text-xl text-gray-600 font-normal max-w-2xl mx-auto leading-relaxed">
					আপনার এলাকার প্রার্থীদের খুঁজুন
				</p>
			</motion.div>

			{/* Breadcrumb Navigation */}
			<div className="flex items-center gap-2 mb-8 text-sm">
				<button
					onClick={() => {
						setSelectedDivision(null);
						setSelectedDistrict(null);
						setSelectedSeat(null);
						updateURL(null, null, null, 1);
					}}
					className="text-gray-600 hover:text-gray-900 transition-colors"
				>
					সকল বিভাগ
				</button>
				{selectedDivision && (
					<>
						<ChevronRight className="w-4 h-4 text-gray-400" />
						<button
							onClick={() => {
								setSelectedDistrict(null);
								setSelectedSeat(null);
								updateURL(selectedDivision, null, null, 1);
							}}
							className="text-gray-600 hover:text-gray-900 transition-colors"
						>
							{divisionsData.find(d => d.id === selectedDivision)?.name}
						</button>
					</>
				)}
				{selectedDistrict && (
					<>
						<ChevronRight className="w-4 h-4 text-gray-400" />
						<button
							onClick={() => {
								setSelectedSeat(null);
								updateURL(selectedDivision, selectedDistrict, null, 1);
							}}
							className="text-gray-600 hover:text-gray-900 transition-colors"
						>
							{districtsData.find(d => d.id === selectedDistrict)?.name}
						</button>
					</>
				)}
				{selectedSeat && (
					<>
						<ChevronRight className="w-4 h-4 text-gray-400" />
						<span className="text-gray-900 font-medium">
							{seatsData.find(s => s.id === selectedSeat)?.name}
						</span>
					</>
				)}
			</div>

			{/* Divisions - Horizontal Scroll on Mobile, Grid on Desktop */}
			{!selectedDivision && (
				<motion.div
					{...fadeInUp}
					transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
					className="mb-24"
				>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-4xl mx-auto">
						{divisionsData.map((division, index) => (
							<motion.button
								key={division.id}
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ 
									delay: index * 0.05,
									duration: 0.4,
									ease: [0.16, 1, 0.3, 1]
								}}
								whileTap={{ scale: 0.98 }}
								onClick={() => handleDivisionClick(division.id)}
								className="group relative bg-white border border-gray-200 rounded-2xl p-6 text-left transition-all duration-200 hover:border-gray-300 hover:shadow-lg active:scale-[0.98]"
							>
								<div className="space-y-2">
									<div className="text-2xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
										{division.name}
									</div>
									<div className="text-sm text-gray-500">
										{division.seats} আসন
									</div>
								</div>
							</motion.button>
						))}
					</div>
				</motion.div>
			)}

			{/* Districts */}
			<AnimatePresence mode="wait">
				{selectedDivision && !selectedDistrict && filteredDistricts.length > 0 && (
					<motion.div
						{...fadeInUp}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						className="mb-24"
					>
						<h3 className="text-2xl font-semibold text-gray-900 mb-6">জেলা</h3>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{filteredDistricts.map((district, index) => (
								<motion.button
									key={district.id}
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ 
										delay: index * 0.04,
										duration: 0.3,
										ease: [0.16, 1, 0.3, 1]
									}}
									whileTap={{ scale: 0.98 }}
									onClick={() => handleDistrictClick(district.id)}
									className="bg-white border border-gray-200 rounded-xl p-5 text-left transition-all duration-200 hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
								>
									<div className="text-lg font-semibold text-gray-900 mb-1">
										{district.name}
									</div>
									<div className="text-sm text-gray-500">
										{district.seats} আসন
									</div>
								</motion.button>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Seats */}
			<AnimatePresence mode="wait">
				{selectedDistrict && !selectedSeat && filteredSeats.length > 0 && (
					<motion.div
						{...fadeInUp}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						className="mb-24"
					>
						<h3 className="text-2xl font-semibold text-gray-900 mb-6">আসন</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{filteredSeats.map((seat, index) => (
								<motion.button
									key={seat.id}
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ 
										delay: index * 0.04,
										duration: 0.3,
										ease: [0.16, 1, 0.3, 1]
									}}
									whileTap={{ scale: 0.98 }}
									onClick={() => handleSeatClick(seat.id)}
									className="bg-white border border-gray-200 rounded-xl p-5 text-left transition-all duration-200 hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
								>
									<div className="text-lg font-semibold text-gray-900 mb-1">
										{seat.name}
									</div>
									<div className="text-sm text-gray-500">
										{seat.area}
									</div>
								</motion.button>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Candidates Section - Always Show */}
			{filteredCandidates.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
					className="space-y-8 pt-12"
				>
					{/* Candidates Header */}
					<div className="pb-6 border-b border-gray-200">
						<h3 className="text-2xl font-bold text-gray-900 mb-1">
							প্রার্থীবৃন্দ
						</h3>
						<p className="text-sm text-gray-600">
							মোট <span className="font-semibold text-gray-900">{searchFilteredCandidates.length}</span> জন প্রার্থী পাওয়া গেছে
						</p>
					</div>

					{/* Search and Filter Bar - Premium Design */}
					<div className="relative" style={{ zIndex: 1 }}>
						{/* Gradient Background Card */}
						<div className="relative bg-linear-to-br from-gray-50 via-white to-gray-50 border border-gray-200/60 rounded-3xl p-8 shadow-xl shadow-gray-100/50 backdrop-blur-sm" style={{ isolation: 'auto' }}>
							{/* Decorative Elements */}
							<div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-30 -z-10"></div>
							<div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-pink-50 to-orange-50 rounded-full blur-3xl opacity-30 -z-10"></div>
							
							{/* Search and Filters - Single Row */}
							<div className="flex flex-col md:flex-row gap-2 items-stretch">
								{/* Search Input */}
								<div className="relative flex-1 md:max-w-xs">
									<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
									<input
										type="text"
										placeholder="অনুসন্ধান করুন..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-sm"
									/>
								</div>

								{/* Party Filter */}
								<div className="flex-1 md:max-w-[280px]">
									<CustomSelect
										value={partyFilter}
										onChange={handlePartyChange}
										placeholder="দল"
										options={[
											{ value: 'all', label: 'সকল দল', icon: '🏛️' },
											...availableParties.map(party => ({
												value: party.id,
												label: party.name,
												icon: party.symbol,
											})),
											...(hasIndependentCandidates ? [{ value: 'independent', label: 'স্বতন্ত্র', icon: '👤' }] : [])
										]}
									/>
								</div>

								{/* Symbol Filter */}
								<div className="flex-1 md:max-w-[280px]">
									<CustomSelect
										value={symbolFilter}
										onChange={handleSymbolChange}
										placeholder="মার্কা"
										options={(() => {
											const allOption = { value: 'all', label: 'সকল মার্কা', icon: '🎯' };
											
											if (partyFilter === 'independent') {
												return [allOption, ...independentSymbols.map(sym => ({
													value: sym.id,
													label: sym.symbolName,
													icon: sym.symbol,
												}))];
											}
											
											if (partyFilter !== 'all') {
												const party = availableParties.find(p => p.id === partyFilter);
												return party ? [allOption, {
													value: party.id,
													label: party.symbolName || party.name,
													icon: party.symbol,
												}] : [allOption];
											}
											
											return [
												allOption,
												...availableParties.map(party => ({
													value: party.id,
													label: party.symbolName || party.name,
													icon: party.symbol,
												})),
												...(hasIndependentCandidates ? independentSymbols.map(sym => ({
													value: sym.id,
													label: sym.symbolName,
													icon: sym.symbol,
												})) : [])
											];
										})()}
									/>
								</div>

								{/* Reset Button - Icon Only */}
								<motion.button
									onClick={clearFilters}
									disabled={!searchQuery && partyFilter === 'all' && symbolFilter === 'all'}
									whileHover={searchQuery || partyFilter !== 'all' || symbolFilter !== 'all' ? { scale: 1.05 } : {}}
									whileTap={searchQuery || partyFilter !== 'all' || symbolFilter !== 'all' ? { scale: 0.95 } : {}}
									className={`shrink-0 w-full md:w-11 h-11 flex items-center justify-center rounded-lg transition-all ${
										searchQuery || partyFilter !== 'all' || symbolFilter !== 'all'
											? 'bg-red-500 text-white hover:bg-red-600'
											: 'bg-gray-200 text-gray-400 cursor-not-allowed'
									}`}
									title="রিসেট করুন"
								>
									<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</motion.button>
							</div>
						</div>
					</div>

					{/* Candidates Grid */}
					{paginatedFilteredCandidates.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<AnimatePresence mode="popLayout">
								{paginatedFilteredCandidates.map((candidate, index) => {
								const party = getPartyInfo(candidate.partyId);
								const seat = getSeatInfo(candidate.seatId);
								const indSymbol = (candidate as any).symbolId ? 
									independentSymbols.find(s => s.id === (candidate as any).symbolId) : null;
								
								// Display data based on party type
								const isIndependent = candidate.partyId === 'independent' && indSymbol;
								const displayName = isIndependent ? 'স্বতন্ত্র প্রার্থী' : party.name;
								const displaySymbol = isIndependent ? indSymbol.symbol : party.symbol;
								const displaySymbolName = isIndependent ? indSymbol.symbolName : (party.symbolName || party.name);
								
								return (
									<motion.div
										key={candidate.id}
										initial={{ opacity: 0, y: 12 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -12 }}
										transition={{ 
											delay: index * 0.03,
											duration: 0.3,
											ease: [0.16, 1, 0.3, 1]
										}}
									>
									<CandidateCard
										id={candidate.id}
										name={candidate.name}
										partyName={displayName}
										partySymbol={displaySymbol}
										partySymbolName={displaySymbolName}
										partyColor={party.color}
										seatName={seat?.name || 'N/A'}
										age={candidate.age}
										education={candidate.education}
										experience={candidate.experience}
										image={candidate.image}
									/>
									</motion.div>
								);
								})}
							</AnimatePresence>
						</div>
					) : (
						<div className="text-center py-12">
							<div className="text-gray-500 mb-2">কোন প্রার্থী পাওয়া যায়নি</div>
							<button
								onClick={() => {
									setSearchQuery('');
									setPartyFilter('all');
									setSymbolFilter('all');
								}}
								className="text-sm text-gray-900 underline hover:no-underline"
							>
								ফিল্টার সাফ করুন
							</button>
						</div>
					)}

					{/* Pagination */}
					{totalPagesFiltered > 1 && paginatedFilteredCandidates.length > 0 && (
						<div className="flex items-center justify-center gap-2 pt-8">
							<button
								onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
								disabled={currentPage === 1}
								className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
							>
								পূর্ববর্তী
							</button>
							
							<div className="flex gap-2">
								{Array.from({ length: Math.min(totalPagesFiltered, 5) }, (_, i) => {
									let page: number;
									if (totalPagesFiltered <= 5) {
										page = i + 1;
									} else if (currentPage <= 3) {
										page = i + 1;
									} else if (currentPage >= totalPagesFiltered - 2) {
										page = totalPagesFiltered - 4 + i;
									} else {
										page = currentPage - 2 + i;
									}
									
									return (
										<button
											key={page}
											onClick={() => handlePageChange(page)}
											className={`w-10 h-10 text-sm font-medium rounded-lg transition-all active:scale-95 ${
												currentPage === page
													? 'bg-gray-900 text-white'
													: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
											}`}
										>
											{page}
										</button>
									);
								})}
							</div>

							<button
								onClick={() => handlePageChange(Math.min(totalPagesFiltered, currentPage + 1))}
								disabled={currentPage === totalPagesFiltered}
								className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
							>
								পরবর্তী
							</button>
						</div>
					)}
				</motion.div>
			)}
		</div>
	);
}
