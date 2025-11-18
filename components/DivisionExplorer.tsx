'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, Filter, Loader2 } from 'lucide-react';
import ReactPaginate from 'react-paginate';
import CandidateCard from './CandidateCard';
import CustomSelect from './CustomSelect';
import { api, type Division, type District, type Seat, type Candidate, type Party, type Symbol } from '@/lib/api';

function DivisionExplorerContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	
	// API Data States
	const [divisions, setDivisions] = useState<Division[]>([]);
	const [districts, setDistricts] = useState<District[]>([]);
	const [seats, setSeats] = useState<Seat[]>([]);
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const [parties, setParties] = useState<Party[]>([]);
	const [symbols, setSymbols] = useState<Symbol[]>([]);
	const [loading, setLoading] = useState(true);
	const [candidatesLoading, setCandidatesLoading] = useState(false);
	
	// Initialize from URL params
	const [selectedDivision, setSelectedDivision] = useState<number | null>(
		searchParams.get('division') ? parseInt(searchParams.get('division')!) : null
	);
	const [selectedDistrict, setSelectedDistrict] = useState<number | null>(
		searchParams.get('district') ? parseInt(searchParams.get('district')!) : null
	);
	const [selectedSeat, setSelectedSeat] = useState<number | null>(
		searchParams.get('seat') ? parseInt(searchParams.get('seat')!) : null
	);
	const [currentPage, setCurrentPage] = useState(
		parseInt(searchParams.get('page') || '1')
	);
	const candidatesPerPage = 9;

	// Fetch initial data on mount
	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				setLoading(true);
				console.log('Fetching divisions and parties from API...');
				const [divisionsRes, partiesRes] = await Promise.all([
					api.getDivisions(),
					api.getParties()
				]);
				
				console.log('Divisions Response:', divisionsRes);
				console.log('Parties Response:', partiesRes);
				
				if (divisionsRes.success) setDivisions(divisionsRes.data);
				if (partiesRes.success) {
					setParties(partiesRes.data);
					// Extract unique symbols from parties
					const uniqueSymbols = new Map<number, Symbol>();
					partiesRes.data.forEach(party => {
						if (party.symbol && party.symbol_id) {
							uniqueSymbols.set(party.symbol_id, party.symbol);
						}
					});
					setSymbols(Array.from(uniqueSymbols.values()));
				}
			} catch (error) {
				console.error('Failed to fetch initial data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchInitialData();
	}, []);

	// Fetch districts when division selected
	useEffect(() => {
		if (selectedDivision) {
			const fetchDistricts = async () => {
				try {
					console.log('Fetching districts for division:', selectedDivision);
					const res = await api.getDistricts(selectedDivision);
					console.log('Districts Response:', res);
					if (res.success) setDistricts(res.data);
				} catch (error) {
					console.error('Failed to fetch districts:', error);
				}
			};
			fetchDistricts();
		} else {
			setDistricts([]);
		}
	}, [selectedDivision]);

	// Fetch seats when district selected
	useEffect(() => {
		if (selectedDistrict) {
			const fetchSeats = async () => {
				try {
					console.log('Fetching seats for district:', selectedDistrict);
					const res = await api.getSeats({ district_id: selectedDistrict });
					console.log('Seats Response:', res);
					if (res.success) setSeats(res.data);
				} catch (error) {
					console.error('Failed to fetch seats:', error);
				}
			};
			fetchSeats();
		} else {
			setSeats([]);
		}
	}, [selectedDistrict]);

	// Search and filter states
	const [searchQuery, setSearchQuery] = useState('');
	const [partyFilter, setPartyFilter] = useState<number | string>('all');
	const [symbolFilter, setSymbolFilter] = useState<number | string>('all');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [totalCandidates, setTotalCandidates] = useState(0);
	const [totalPagesFromServer, setTotalPagesFromServer] = useState(1);

	// Debounce search query (like Google search)
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery);
		}, 300); // Wait 300ms after user stops typing

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Fetch candidates with REAL server-side pagination
	useEffect(() => {
		const fetchCandidates = async () => {
			try {
				setCandidatesLoading(true);
				const params: any = {};
				
				// Check if user has made any selection or filter
				const hasSelection = selectedSeat || selectedDistrict || selectedDivision;
				const hasSearch = debouncedSearch.trim().length > 0;
				const hasFilter = partyFilter !== 'all' || symbolFilter !== 'all';
				
				// Apply location filters if selected
				if (selectedSeat) params.seat_id = selectedSeat;
				else if (selectedDistrict) params.district_id = selectedDistrict;
				else if (selectedDivision) params.division_id = selectedDivision;
				
				// Apply search query
				if (debouncedSearch.trim()) {
					params.search = debouncedSearch.trim();
				}
				
				// Apply party filter
				if (partyFilter !== 'all') {
					if (partyFilter === 'independent') {
						// For independent: filter by null party_id (backend understands this)
						params.party_id = 'null';
					} else {
						params.party_id = partyFilter;
					}
				}
				
				// Apply symbol filter (takes precedence and works independently)
				if (symbolFilter !== 'all' && symbolFilter !== 'independent') {
					params.symbol_id = symbolFilter;
					// When filtering by symbol only, remove party filter to get all with this symbol
					if (partyFilter === 'all') {
						delete params.party_id;
					}
				} else if (symbolFilter === 'independent') {
					// For independent symbols: null party_id
					params.party_id = 'null';
				}
				
				// ALWAYS add pagination parameters - this is server-side pagination!
				params.per_page = candidatesPerPage;
				params.page = currentPage;
				
				console.log('Fetching candidates with params:', params);
				const res = await api.getCandidates(params);
				console.log('Candidates Response:', res);
				
				if (res.success) {
					setCandidates(res.data);
					// Update total pages from server response
					if ((res as any).pagination) {
						setTotalPagesFromServer((res as any).pagination.last_page);
						setTotalCandidates((res as any).pagination.total);
					} else {
						// Fallback if no pagination in response
						setTotalPagesFromServer(1);
						setTotalCandidates(res.data.length);
					}
				}
			} catch (error) {
				console.error('Failed to fetch candidates:', error);
			} finally {
				setCandidatesLoading(false);
			}
		};

		fetchCandidates();
	}, [selectedDivision, selectedDistrict, selectedSeat, debouncedSearch, partyFilter, symbolFilter, currentPage]);

	// Update URL with current state
	const updateURL = (
		division: number | null,
		district: number | null,
		seat: number | null,
		page: number
	) => {
		const params = new URLSearchParams();
		if (division) params.set('division', division.toString());
		if (district) params.set('district', district.toString());
		if (seat) params.set('seat', seat.toString());
		if (page > 1) params.set('page', page.toString());
		
		const queryString = params.toString();
		router.push(queryString ? `/?${queryString}` : '/', {
			scroll: false,
		});
	};

	// Reset selections
	const handleDivisionClick = (divisionId: number) => {
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

	const handleDistrictClick = (districtId: number) => {
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

	const handleSeatClick = (seatId: number) => {
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

	// Helper function to convert English numbers to Bengali
	const toBengaliNumber = (num: number): string => {
		const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
		return num.toString().split('').map(digit => bengaliDigits[parseInt(digit)]).join('');
	};

	// Sync party and symbol filters with intelligent relationship
	const handlePartyChange = (partyId: string) => {
		setPartyFilter(partyId);
		
		if (partyId === 'all') {
			// Show all symbols
			setSymbolFilter('all');
		} else if (partyId === 'independent') {
			// Show only independent symbols (symbols not associated with any party)
			setSymbolFilter('independent');
		} else {
			// Find the party's symbol and auto-select it
			const party = parties.find(p => p.id.toString() === partyId);
			if (party?.symbol_id) {
				setSymbolFilter(party.symbol_id.toString());
			} else {
				setSymbolFilter('all');
			}
		}
	};

	const handleSymbolChange = (symbolId: string) => {
		setSymbolFilter(symbolId);
		
		if (symbolId === 'all') {
			// Reset party filter to all
			setPartyFilter('all');
		} else if (symbolId === 'independent') {
			// Auto-select independent party
			setPartyFilter('independent');
		} else {
			// Find if this symbol belongs to a party
			const party = parties.find(p => p.symbol_id?.toString() === symbolId);
			if (party) {
				// Auto-select the party that owns this symbol
				setPartyFilter(party.id.toString());
			} else {
				// It's an independent symbol
				setPartyFilter('independent');
			}
		}
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchQuery('');
		setPartyFilter('all');
		setSymbolFilter('all');
		setCurrentPage(1);
	};

	// Reset page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearch, partyFilter, symbolFilter]);

	// Get available parties (all parties for filter dropdown)
	const availableParties = parties;

	return (
		<div className="w-full">{/* Full width container */}			{/* Breadcrumb Navigation */}
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
							{divisions.find(d => d.id === selectedDivision)?.name}
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
							{districts.find(d => d.id === selectedDistrict)?.name}
						</button>
					</>
				)}
				{selectedSeat && (
					<>
						<ChevronRight className="w-4 h-4 text-gray-400" />
						<span className="text-gray-900 font-medium">
							{seats.find(s => s.id === selectedSeat)?.name}
						</span>
					</>
				)}
			</div>

			{/* Divisions - Grid */}
			{!selectedDivision && (
				<motion.div
					{...fadeInUp}
					transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
					className="mb-24"
				>
					{loading ? (
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
							{Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
									<div className="h-7 bg-gray-200 rounded mb-2"></div>
									<div className="h-4 bg-gray-100 rounded w-20 mx-auto"></div>
								</div>
							))}
						</div>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
							{divisions.map((division, index) => (
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
									className="group relative bg-white border border-gray-200 rounded-2xl p-6 text-center transition-all duration-200 hover:border-gray-300 hover:shadow-lg active:scale-[0.98]"
								>
									<div className="space-y-2">
										<div className="text-2xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
											{division.name}
										</div>
										<div className="text-sm text-gray-500">
											{toBengaliNumber(division.seats_count || 0)} আসন
										</div>
									</div>
								</motion.button>
							))}
						</div>
					)}
				</motion.div>
			)}

			{/* Districts */}
			<AnimatePresence mode="wait">
				{selectedDivision && !selectedDistrict && districts.length > 0 && (
					<motion.div
						{...fadeInUp}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						className="mb-24"
					>
						<h3 className="text-2xl font-semibold text-gray-900 mb-6">জেলা</h3>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{districts.map((district, index) => (
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
									className="bg-white border border-gray-200 rounded-xl p-5 text-center transition-all duration-200 hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
								>
									<div className="text-lg font-semibold text-gray-900 mb-1">
										{district.name}
									</div>
									<div className="text-sm text-gray-500">
										{toBengaliNumber(district.seats_count || 0)} আসন
									</div>
								</motion.button>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Seats */}
			<AnimatePresence mode="wait">
				{selectedDistrict && !selectedSeat && seats.length > 0 && (
					<motion.div
						{...fadeInUp}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						className="mb-24"
					>
						<h3 className="text-2xl font-semibold text-gray-900 mb-6">আসন</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{seats.map((seat, index) => (
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
									className="bg-white border border-gray-200 rounded-xl p-5 text-center transition-all duration-200 hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
								>
									<div className="text-lg font-semibold text-gray-900 mb-1">
										{seat.name}
									</div>
									{seat.area && (
										<div className="text-sm text-gray-500">
											{seat.area}
										</div>
									)}
								</motion.button>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Candidates Section - Always Show */}
			{candidates.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
					className="mb-24"
				>
					{/* Search and Filter Bar - Premium Design */}
					<div className="relative mb-12" style={{ zIndex: 1 }}>
						{/* Gradient Background Card */}
						<div className="relative bg-linear-to-br from-gray-50 via-white to-gray-50 border border-gray-200/60 rounded-3xl p-8 shadow-xl shadow-gray-100/50 backdrop-blur-sm" style={{ isolation: 'auto' }}>
							{/* Decorative Elements */}
							<div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-30 -z-10"></div>
							<div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-pink-50 to-orange-50 rounded-full blur-3xl opacity-30 -z-10"></div>
							
							{/* Search and Filters - Single Row */}
							<div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center justify-center">
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
										value={partyFilter.toString()}
										onChange={handlePartyChange}
										placeholder="দল"
										options={[
											{ value: 'all', label: 'সকল দল', icon: '🏛️' },
											...availableParties.map(party => ({
												value: party.id.toString(),
												label: party.name,
												icon: party.symbol?.image || party.logo || '🏛️',
											})),
											{ value: 'independent', label: 'স্বতন্ত্র', icon: '👤' }
										]}
									/>
								</div>

								{/* Symbol Filter */}
								<div className="flex-1 md:max-w-[280px]">
									<CustomSelect
										value={symbolFilter.toString()}
										onChange={handleSymbolChange}
										placeholder="মার্কা"
										options={(() => {
											const symbolOptions = [
												{ value: 'all', label: 'সকল মার্কা', icon: '🎯' }
											];
											
											// If independent is selected, show independent option
											if (partyFilter === 'independent') {
												symbolOptions.push({ 
													value: 'independent', 
													label: 'স্বতন্ত্র মার্কা', 
													icon: '👤' 
												});
											} else {
												// Show party symbols
												const addedSymbols = new Set<number>();
												parties.forEach(party => {
													if (party.symbol && party.symbol_id && !addedSymbols.has(party.symbol_id)) {
														addedSymbols.add(party.symbol_id);
														symbolOptions.push({
															value: party.symbol_id.toString(),
															label: party.symbol.symbol_name || party.name,
															icon: party.symbol.image || '🎯',
														});
													}
												});
												
												// Add independent option at the end if not filtering by specific party
												if (partyFilter === 'all') {
													symbolOptions.push({ 
														value: 'independent', 
														label: 'স্বতন্ত্র', 
														icon: '👤' 
													});
												}
											}
											
											return symbolOptions;
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
					{candidatesLoading ? (
						<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300">
									<div className="p-6 animate-pulse">
										{/* Header: Avatar + Name + Seat */}
										<div className="flex items-start gap-4 mb-6 pb-5 border-b border-gray-100">
											<div className="w-16 h-16 rounded-full bg-gray-200 shrink-0"></div>
											<div className="flex-1 min-w-0 pt-1">
												<div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
												<div className="h-4 bg-gray-100 rounded w-full"></div>
											</div>
										</div>

										{/* Symbol Section */}
										<div className="mb-5">
											<div className="rounded-2xl p-8 text-center bg-gray-50 border-2 border-gray-100">
												<div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
												<div className="h-3 bg-gray-100 rounded w-16 mx-auto mb-2"></div>
												<div className="h-5 bg-gray-200 rounded w-32 mx-auto"></div>
											</div>
										</div>

										{/* Party Name */}
										<div className="rounded-xl p-4 text-center bg-gray-50 mb-6">
											<div className="h-3 bg-gray-100 rounded w-12 mx-auto mb-2"></div>
											<div className="h-4 bg-gray-200 rounded w-28 mx-auto"></div>
										</div>

										{/* View Details */}
										<div className="pt-5 border-t border-gray-100">
											<div className="h-6 bg-gray-100 rounded w-32"></div>
										</div>
									</div>
								</div>
							))}
						</div>
					) : candidates.length > 0 ? (
						<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<AnimatePresence mode="popLayout">
								{candidates.map((candidate, index) => {
								const party = candidate.party;
								const seat = candidate.seat;
								const district = seat?.district;
								
								// Display data: handle both party and independent candidates
								const isIndependent = candidate.is_independent || (!candidate.party_id && candidate.symbol_id);
								const displayPartyName = isIndependent ? 'স্বতন্ত্র প্রার্থী' : (party?.name || 'N/A');
								
								// Get symbol: either from party's symbol relationship or candidate's direct symbol
								const effectiveSymbol = party?.symbol || candidate.symbol;
								// Pass the whole symbol object if available, otherwise fallback emoji
								const displaySymbol = effectiveSymbol || '🏛️';
								const displaySymbolName = effectiveSymbol?.symbol_name || 'N/A';
								
								// Format seat name: "১ ঢাকা (ঢাকা-১)" = district_id(Bengali) District_Name (Seat_Name)
								const seatDisplay = seat && district 
									? `${toBengaliNumber(district.id)} ${district.name} (${seat.name})`
									: seat?.name || 'N/A';
								
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
										id={candidate.id.toString()}
										name={candidate.name || candidate.name_en}
										partyName={displayPartyName}
										partySymbol={displaySymbol}
										partySymbolName={displaySymbolName}
										partyColor={party?.color || '#000000'}
										seatName={seatDisplay}
										age={candidate.age}
										education={candidate.education}
										experience={candidate.experience || ''}
										image={candidate.image || ''}
									/>
									</motion.div>
								);
								})}
							</AnimatePresence>
						</div>
					) : !candidatesLoading && candidates.length === 0 ? (
						<div className="text-center py-16">
							<div className="mb-4">
								<svg className="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
							</div>
							<p className="text-lg font-medium text-gray-900 mb-2">কোন প্রার্থী পাওয়া যায়নি</p>
							<p className="text-gray-500 mb-4">অনুগ্রহ করে বিভিন্ন ফিল্টার বা সার্চ শব্দ চেষ্টা করুন</p>
							{(searchQuery || partyFilter !== 'all' || symbolFilter !== 'all') && (
								<button
									onClick={clearFilters}
									className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
									ফিল্টার সাফ করুন
								</button>
							)}
						</div>
					) : null}

					{/* React Paginate Library */}
					{totalPagesFromServer > 1 && candidates.length > 0 && (
						<div className="flex justify-center pt-8">
							<ReactPaginate
								previousLabel={
									<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
									</svg>
								}
								nextLabel={
									<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
								}
								breakLabel="..."
								pageCount={totalPagesFromServer}
								marginPagesDisplayed={1}
								pageRangeDisplayed={2}
								onPageChange={(selected) => handlePageChange(selected.selected + 1)}
								forcePage={currentPage - 1}
								pageLabelBuilder={(page) => toBengaliNumber(page)}
								containerClassName="flex items-center gap-1"
								pageClassName="page-item"
								pageLinkClassName="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-all bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-blue-400"
								previousClassName="page-item"
								previousLinkClassName="min-w-8 h-9 sm:h-10 px-2 sm:px-3 flex items-center justify-center rounded-lg font-medium text-sm transition-all bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
								nextClassName="page-item"
								nextLinkClassName="min-w-8 h-9 sm:h-10 px-2 sm:px-3 flex items-center justify-center rounded-lg font-medium text-sm transition-all bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
								breakClassName="w-9 h-9 flex items-center justify-center text-gray-400"
								breakLinkClassName="w-full h-full flex items-center justify-center"
								activeClassName="active"
								activeLinkClassName="!bg-blue-600 !text-white !border-blue-600 shadow-md"
								disabledClassName="opacity-50 cursor-not-allowed"
								disabledLinkClassName="!cursor-not-allowed hover:!bg-white hover:!border-gray-300"
								renderOnZeroPageCount={null}
							/>
						</div>
					)}
				</motion.div>
			)}
		</div>
	);
}

export default function DivisionExplorer() {
	return (
		<Suspense fallback={
			<div className="flex items-center justify-center py-20">
				<Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
			</div>
		}>
			<DivisionExplorerContent />
		</Suspense>
	);
}
