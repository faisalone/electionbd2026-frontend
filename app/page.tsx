import HeroTimeline from "@/components/HeroTimeline";
import AiSearchBar from "@/components/AiSearchBar";
import PollCard from "@/components/PollCard";
import NewsCard from "@/components/NewsCard";
import PartyCard from "@/components/PartyCard";
import SectionWrapper from "@/components/SectionWrapper";
import DivisionExplorer from "@/components/DivisionExplorer";
import CreatePollButton from "@/components/CreatePollButton";
import { pollsData, newsData, partiesData } from "@/lib/mockData";

export default function Home() {
  return (
	<div className="w-full">
	  {/* Hero Section with AI Search */}
	  <SectionWrapper className="bg-linear-to-b from-white to-gray-50">
		<AiSearchBar />
		<HeroTimeline />
	  </SectionWrapper>

	  {/* Division Explorer Section */}
	  <SectionWrapper
		id="divisions"
		className="bg-white"
	  >
		<DivisionExplorer />
	  </SectionWrapper>

	  {/* Polls Section */}
	  <SectionWrapper
		id="poll"
		title="অনলাইন জরিপ"
		subtitle="আপনার মতামত জানান এবং অন্যদের মতামত দেখুন"
		className="bg-gray-50"
		headerAction={<CreatePollButton />}
	  >
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		  {pollsData.map((poll) => (
			<PollCard
			  key={poll.id}
			  pollId={poll.id}
			  question={poll.question}
			  creatorName={(poll as any).creatorName}
			  options={poll.options}
			  totalVotes={poll.totalVotes}
			  endDate={poll.endDate}
			  status={poll.status as 'upcoming' | 'ended'}
			  winnerPhone={(poll as any).winnerPhone}
			/>
		  ))}
		</div>

		{/* Poll Terms & Conditions */}
		<div className="mt-16 max-w-4xl mx-auto">
		  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
			<div className="flex-1 text-center md:text-left">
			  <h3 className="text-2xl font-bold text-gray-900 mb-2">জরিপ নীতিমালা</h3>
			  <div className="w-20 h-1 bg-blue-600 mx-auto md:mx-0 rounded-full"></div>
			</div>
		  </div>
		  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
		</div>
	  </SectionWrapper>

	  {/* Political Parties Section */}
	  <SectionWrapper
		id="parties"
		title="রাজনৈতিক দলসমূহ"
		subtitle="প্রধান রাজনৈতিক দল এবং তাদের তথ্য"
		className="bg-white"
	  >
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		  {partiesData.map((party) => (
			<PartyCard
			  key={party.id}
			  name={party.name}
			  symbol={party.symbol}
			  color={party.color}
			  founded={party.founded}
			/>
		  ))}
		</div>
	  </SectionWrapper>

	  {/* News Section */}
	  <SectionWrapper
		id="news"
		title="সর্বশেষ খবর"
		subtitle="নির্বাচন সম্পর্কিত সর্বশেষ আপডেট এবং সংবাদ"
		className="bg-gray-50"
	  >
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		  {newsData.map((news) => (
			<NewsCard
			  key={news.id}
			  title={news.title}
			  summary={news.summary}
			  image={news.image}
			  date={news.date}
			  category={news.category}
			/>
		  ))}
		</div>
	  </SectionWrapper>
	</div>
  );
}