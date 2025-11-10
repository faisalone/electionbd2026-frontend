'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import HeroTimeline from "@/components/HeroTimeline";
import AiSearchBar from "@/components/AiSearchBar";
import PollCard from "@/components/PollCard";
import NewsCard from "@/components/NewsCard";
import PartyCard from "@/components/PartyCard";
import SectionWrapper from "@/components/SectionWrapper";
import DivisionExplorer from "@/components/DivisionExplorer";
import CreatePollButton from "@/components/CreatePollButton";
import { api, type Poll, type News, type Party } from "@/lib/api";

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [pollsLoading, setPollsLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [partiesLoading, setPartiesLoading] = useState(true);
  const [showPollTerms, setShowPollTerms] = useState(false);

  useEffect(() => {
    // Fetch polls
    const fetchPolls = async () => {
      try {
        const pollsRes = await api.getPolls();
        if (pollsRes.success) setPolls(pollsRes.data);
      } catch (error) {
        console.error('Failed to fetch polls:', error);
      } finally {
        setPollsLoading(false);
      }
    };

    // Fetch news - Get only last 4
    const fetchNews = async () => {
      try {
        const newsRes = await api.getNews({ page: 1, per_page: 4 });
        if (newsRes.success) setNews(newsRes.data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setNewsLoading(false);
      }
    };

    // Fetch parties
    const fetchParties = async () => {
      try {
        const partiesRes = await api.getParties();
        if (partiesRes.success) setParties(partiesRes.data);
      } catch (error) {
        console.error('Failed to fetch parties:', error);
      } finally {
        setPartiesLoading(false);
      }
    };

    fetchPolls();
    fetchNews();
    fetchParties();
  }, []);
  return (
	<div className="w-full">
	  {/* Hero Section with AI Search */}
	  <SectionWrapper className="">
		<AiSearchBar />
		<HeroTimeline />
	  </SectionWrapper>

	  {/* Polls Section */}
	  <SectionWrapper
		id="poll"
		title="অনলাইন জরিপ"
		subtitle="আপনার মতামত জানান এবং অন্যদের মতামত দেখুন"
		className=""
		headerAction={<CreatePollButton />}
	  >
		{pollsLoading ? (
		  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{[1, 2].map((i) => (
			  <div key={i} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
				<div className="animate-pulse">
				  {/* Countdown Timer Header - Centered */}
				  <div className="flex items-center justify-center gap-2 mb-5 pb-4 border-b border-gray-100">
					{[1, 2, 3, 4].map((j) => (
					  <div key={j} className="flex flex-col items-center bg-gray-200 rounded-lg px-2.5 py-1.5 min-w-12 h-14"></div>
					))}
				  </div>

				  {/* Poll Question with Icon */}
				  <div className="mb-6 flex items-start gap-2">
					<div className="w-4 h-4 bg-gray-200 rounded-full mt-1 shrink-0"></div>
					<div className="flex-1 space-y-2">
					  <div className="h-5 bg-gray-200 rounded w-full"></div>
					  <div className="h-5 bg-gray-200 rounded w-4/5"></div>
					</div>
				  </div>

				  {/* Poll Options */}
				  <div className="space-y-3">
					{[1, 2, 3].map((j) => (
					  <div key={j} className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
						<div className="py-4 px-4 flex items-center justify-between">
						  <div className="flex items-center gap-3 flex-1">
							{/* Radio indicator */}
							<div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0"></div>
							{/* Option text */}
							<div className="h-4 bg-gray-200 rounded flex-1"></div>
						  </div>
						</div>
					  </div>
					))}
				  </div>

				  {/* Share buttons skeleton */}
				  <div className="mt-6 flex items-center justify-center gap-2">
					{[1, 2, 3, 4, 5].map((j) => (
					  <div key={j} className="w-8 h-8 bg-gray-200 rounded"></div>
					))}
				  </div>
				</div>
			  </div>
			))}
		  </div>
		) : polls.length > 0 ? (
		  <div className="relative px-4 sm:px-8 md:px-12 lg:px-16 py-8">
			<Swiper
			  modules={[Navigation]}
			  spaceBetween={30}
			  slidesPerView={1}
			  navigation={{
				prevEl: '.poll-swiper-button-prev',
				nextEl: '.poll-swiper-button-next',
			  }}
			  loop={polls.length > 2}
			  breakpoints={{
				640: {
				  slidesPerView: 1,
				  spaceBetween: 20,
				},
				768: {
				  slidesPerView: 2,
				  spaceBetween: 24,
				},
				1024: {
				  slidesPerView: 2,
				  spaceBetween: 30,
				},
			  }}
			>
			  {polls.map((poll) => {
				const now = new Date();
				const endDate = new Date(poll.end_date);
				const isPollEnded = now > endDate;
				const totalVotes = poll.options?.reduce((sum, opt) => sum + (opt.vote_count || 0), 0) || 0;

				return (
				  <SwiperSlide key={poll.id}>
					<PollCard
					  pollId={poll.id}
					  pollUid={poll.uid}
					  question={poll.question}
					  creatorName={poll.user?.name || poll.creator_name}
					  options={poll.options?.map(opt => ({
						id: opt.id.toString(),
						text: opt.text,
						votes: opt.vote_count || 0,
						color: opt.color || '#666666'
					  })) || []}
					  totalVotes={totalVotes}
					  endDate={poll.end_date}
					  status={isPollEnded ? 'ended' : 'upcoming'}
					  winner={poll.winner}
					/>
				  </SwiperSlide>
				);
			  })}
			</Swiper>
			
			{/* Custom Navigation Buttons - Only show if more than 2 polls */}
			{polls.length > 2 && (
			  <>
				<button className="poll-swiper-button-prev absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-xl hidden md:flex items-center justify-center hover:bg-gray-50 transition-all disabled:opacity-0 disabled:pointer-events-none">
				  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
				  </svg>
				</button>
				<button className="poll-swiper-button-next absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-xl hidden md:flex items-center justify-center hover:bg-gray-50 transition-all disabled:opacity-0 disabled:pointer-events-none">
				  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
				  </svg>
				</button>
			  </>
			)}
		  </div>
		) : (
		  <div className="text-center py-12 text-gray-500">
			কোন পোল পাওয়া যায়নি
		  </div>
		)}

		{/* Poll Terms & Conditions - Collapsible */}
		{!pollsLoading && (
		<div className="mt-16 max-w-4xl mx-auto">
		  <button 
			onClick={() => setShowPollTerms(!showPollTerms)}
			className="w-full flex items-center justify-between p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200"
		  >
			<div className="flex items-center gap-3">
			  <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
				<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			  </div>
			  <h3 className="text-xl font-bold text-gray-900">জরিপ নীতিমালা</h3>
			</div>
			<svg 
			  className={`w-6 h-6 text-gray-500 transition-transform ${showPollTerms ? 'rotate-180' : ''}`} 
			  fill="none" 
			  stroke="currentColor" 
			  viewBox="0 0 24 24"
			>
			  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
			</svg>
		  </button>
		  
		  {showPollTerms && (
			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top duration-300">
			<div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
			  <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
				<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
				</svg>
			  </div>
			  <div>
				<h4 className="font-bold text-gray-900 mb-1">একক ভোট</h4>
				<p className="text-sm text-gray-600 leading-relaxed">একটি হোয়াটসঅ্যাপ নাম্বার দিয়ে একবার ভোট দিতে পারবেন</p>
			  </div>
			</div>

			<div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
			  <div className="shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
				<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			  </div>
			  <div>
				<h4 className="font-bold text-gray-900 mb-1">স্বয়ংক্রিয় নির্বাচন</h4>
				<p className="text-sm text-gray-600 leading-relaxed">জরিপ শেষে প্রোগ্রামেটিক্যালি বিজয়ী সিলেক্ট হবে বিজয়ী অপশনের ইউজারদের থেকে</p>
			  </div>
			</div>

			<div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
			  <div className="shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
				<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
			  </div>
			  <div>
				<h4 className="font-bold text-gray-900 mb-1">একাধিক অংশগ্রহণ</h4>
				<p className="text-sm text-gray-600 leading-relaxed">একজন ইউজার আলাদা আলাদা জরিপে অংশগ্রহণ করতে পারবেন</p>
			  </div>
			</div>

			<div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
			  <div className="shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
				<svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
				</svg>
			  </div>
			  <div>
				<h4 className="font-bold text-gray-900 mb-1">পুরস্কার প্রকাশ</h4>
				<p className="text-sm text-gray-600 leading-relaxed">বিজয়ীর পুরস্কার সোশ্যাল মিডিয়াতে প্রকাশ করা হবে</p>
			  </div>
			</div>
		  </div>
		  )}
		</div>
		)}
	  </SectionWrapper>

	  {/* News Section */}
	  <SectionWrapper
		id="news"
		title="সর্বশেষ খবর"
		subtitle="নির্বাচন সম্পর্কিত সর্বশেষ আপডেট এবং সংবাদ"
		className=""
		headerAction={
		  <a href="/news" className="text-[#C8102E] hover:text-[#A00D27] font-medium flex items-center gap-2 transition-colors">
			সব খবর দেখুন
			<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
			</svg>
		  </a>
		}
	  >
		{newsLoading ? (
		  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{[1, 2, 3, 4].map((i) => (
			  <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
				<div className="animate-pulse">
				  {/* Image Container */}
				  <div className="relative h-52 bg-gray-200 overflow-hidden">
					{/* Category Badge */}
					<div className="absolute top-4 right-4 w-20 h-6 bg-gray-300 rounded-full"></div>
				  </div>
				  
				  {/* Content Section */}
				  <div className="p-6">
					{/* Date Line */}
					<div className="flex items-center gap-2 mb-3">
					  <div className="w-4 h-4 bg-gray-200 rounded"></div>
					  <div className="h-4 w-24 bg-gray-200 rounded"></div>
					</div>
					
					{/* Title */}
					<div className="space-y-2 mb-3">
					  <div className="h-6 bg-gray-200 rounded w-full"></div>
					  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
					</div>
					
					{/* Summary */}
					<div className="space-y-2 mb-4">
					  <div className="h-4 bg-gray-200 rounded w-full"></div>
					  <div className="h-4 bg-gray-200 rounded w-full"></div>
					  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
					</div>
					
					{/* Button */}
					<div className="h-10 bg-gray-200 rounded-lg w-32"></div>
				  </div>
				</div>
			  </div>
			))}
		  </div>
		) : (
		  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{news.map((article) => (
			  <NewsCard
				key={article.id}
				id={article.id}
				uid={article.uid}
				title={article.title}
				summary={article.summary || article.content?.substring(0, 150) + '...' || ''}
				image={article.image}
				date={article.date}
				category={article.category}
			  />
			))}
		  </div>
		)}
	  </SectionWrapper>

	  {/* Division Explorer Section */}
	  <SectionWrapper
		id="divisions"
		className=""
	  >
		<DivisionExplorer />
	  </SectionWrapper>

	  {/* Political Parties Section */}
	  <SectionWrapper
		id="parties"
		title="রাজনৈতিক দলসমূহ"
		subtitle="প্রধান রাজনৈতিক দল এবং তাদের তথ্য"
		className=""
	  >
		{partiesLoading ? (
		  <div className="text-center py-12">
			<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8102E] mx-auto"></div>
		  </div>
		) : (
		  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{parties.filter(p => !p.is_independent).map((party) => (
			  <PartyCard
				key={party.id}
				name={party.name_bn}
				symbol={party.symbol}
				color={party.color}
				founded="১৯৭১" // Default, can be added to backend later
				candidatesCount={party.candidates_count}
			  />
			))}
		  </div>
		)}
	  </SectionWrapper>
	</div>
  );
}