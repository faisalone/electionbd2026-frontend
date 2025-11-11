import Link from 'next/link';
import { ArrowRight, MapPin, Users } from 'lucide-react';
import { districtsData, seatsData } from '@/lib/mockData';
import SectionWrapper from '@/components/SectionWrapper';

export default async function DistrictPage({ params }: { params: Promise<{ district: string }> }) {
  const { district: districtId } = await params;
  const district = districtsData.find((d) => d.id === districtId);
  const seats = seatsData.filter((s) => s.districtId === districtId);

  if (!district) {
    return (
      <SectionWrapper>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            জেলা খুঁজে পাওয়া যায়নি
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
      <div className="flex items-center gap-2 text-gray-600 mb-6">
        <Link href="/" className="hover:text-[#C8102E]">হোম</Link>
        <ArrowRight className="w-4 h-4" />
        <Link href={`/division/${district.divisionId}`} className="hover:text-[#C8102E]">
          বিভাগ
        </Link>
        <ArrowRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{district.name}</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          {district.name} জেলা
        </h1>
        <p className="text-xl text-gray-600">
          মোট {district.seats} টি সংসদীয় আসন
        </p>
      </div>

      {/* Seats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seats.length > 0 ? (
          seats.map((seat) => (
            <div
              key={seat.id}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-2xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {seat.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{seat.area}</span>
                  </div>
                </div>
              </div>
              <Link href={`/seat/${seat.id}`}>
                <button className="w-full bg-[#C8102E] text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  প্রার্থী দেখুন
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">
              এই জেলার জন্য এখনও আসনের তথ্য যুক্ত করা হয়নি
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
