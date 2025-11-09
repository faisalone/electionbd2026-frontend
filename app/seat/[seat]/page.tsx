import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { seatsData, candidatesData, partiesData } from '@/lib/mockData';
import SectionWrapper from '@/components/SectionWrapper';
import CandidateCard from '@/components/CandidateCard';

export default function SeatPage({ params }: { params: { seat: string } }) {
  const seat = seatsData.find((s) => s.id === params.seat);
  const candidates = candidatesData.filter((c) => c.seatId === params.seat);

  if (!seat) {
    return (
      <SectionWrapper>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            আসন খুঁজে পাওয়া যায়নি
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
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#C8102E]">হোম</Link>
        <ArrowRight className="w-4 h-4" />
        <Link href={`/district/${seat.districtId}`} className="hover:text-[#C8102E]">
          জেলা
        </Link>
        <ArrowRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{seat.name}</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          {seat.name}
        </h1>
        <p className="text-xl text-gray-600">
          {seat.area}
        </p>
        <p className="text-lg text-gray-500 mt-2">
          মোট {candidates.length} জন প্রার্থী প্রতিদ্বন্দ্বিতা করছেন
        </p>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.length > 0 ? (
          candidates.map((candidate) => {
            const party = partiesData.find((p) => p.id === candidate.partyId);
            return (
              <CandidateCard
                key={candidate.id}
                id={candidate.id}
                name={candidate.name}
                partyName={party?.name || 'স্বতন্ত্র'}
                partySymbol={party?.symbol || '⭐'}
                partyColor={party?.color || '#666666'}
                seatName={seat.name}
                age={candidate.age}
                education={candidate.education}
                experience={candidate.experience}
                image={candidate.image}
              />
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">
              এই আসনের জন্য এখনও প্রার্থীর তথ্য যুক্ত করা হয়নি
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
