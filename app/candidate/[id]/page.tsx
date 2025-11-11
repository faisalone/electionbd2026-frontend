import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, User, GraduationCap, Briefcase, Calendar } from 'lucide-react';
import { candidatesData, partiesData, seatsData } from '@/lib/mockData';
import SectionWrapper from '@/components/SectionWrapper';

export default async function CandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const candidate = candidatesData.find((c) => c.id === id);
  const party = candidate ? partiesData.find((p) => p.id === candidate.partyId) : null;
  const seat = candidate ? seatsData.find((s) => s.id === candidate.seatId) : null;

  if (!candidate || !party || !seat) {
    return (
      <SectionWrapper>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            প্রার্থী খুঁজে পাওয়া যায়নি
          </h1>
          <Link href="/" className="text-[#C8102E] hover:underline">
            হোমে ফিরে যান
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      {/* Back Button */}
      <Link
        href={`/seat/${seat.id}`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#C8102E] mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>ফিরে যান</span>
      </Link>

      {/* Candidate Profile Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
        {/* Party Color Header */}
        <div className="h-6" style={{ backgroundColor: party.color }} />

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Profile Image */}
            <div className="md:col-span-1">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-200 shadow-xl">
                <Image
                  src={candidate.image}
                  alt={candidate.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Party Info */}
              <div
                className="mt-6 p-6 rounded-2xl text-white text-center"
                style={{ backgroundColor: party.color }}
              >
                <div className="text-6xl mb-3">{party.symbol}</div>
                <h3 className="text-xl font-bold">{party.name}</h3>
              </div>
            </div>

            {/* Right: Details */}
            <div className="md:col-span-2">
              {/* Name and Basic Info */}
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {candidate.name}
                </h1>
                <p className="text-xl text-gray-600 mb-2">
                  {candidate.nameEn}
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span>বয়স: {candidate.age} বছর</span>
                </div>
              </div>

              {/* Seat Info */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-[#C8102E] shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">নির্বাচনী এলাকা</p>
                    <p className="text-2xl font-bold text-gray-900">{seat.name}</p>
                    <p className="text-gray-600 mt-1">{seat.area}</p>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-6 h-6 text-[#C8102E] shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">শিক্ষাগত যোগ্যতা</p>
                    <p className="text-lg font-bold text-gray-900">
                      {candidate.education}
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-6 h-6 text-[#C8102E] shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">পেশাগত অভিজ্ঞতা</p>
                    <p className="text-lg font-bold text-gray-900">
                      {candidate.experience}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-12 pt-8 border-t-2 border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              নির্বাচনী ইশতেহার
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                {candidate.name} {seat.name} আসন থেকে {party.name} এর পক্ষে প্রতিদ্বন্দ্বিতা করছেন।
                তিনি এলাকার উন্নয়ন, শিক্ষা ব্যবস্থার উন্নতি, স্বাস্থ্যসেবা সম্প্রসারণ এবং
                কর্মসংস্থান সৃষ্টির জন্য প্রতিশ্রুতিবদ্ধ।
              </p>
              <p className="mt-4 text-gray-600 text-sm">
                * এটি একটি ডেমো তথ্য। প্রকৃত তথ্য পরবর্তীতে আপডেট করা হবে।
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
