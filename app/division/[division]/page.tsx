import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { divisionsData, districtsData } from '@/lib/mockData';
import SectionWrapper from '@/components/SectionWrapper';

export default function DivisionPage({ params }: { params: { division: string } }) {
  const division = divisionsData.find((d) => d.id === params.division);

  if (!division) {
    return (
      <SectionWrapper>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            বিভাগ খুঁজে পাওয়া যায়নি
          </h1>
          <Link
            href="/"
            className="text-[#C8102E] hover:underline"
          >
            হোমে ফিরে যান
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Link href="/" className="hover:text-[#C8102E]">হোম</Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{division.name}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          {division.name} বিভাগ
        </h1>
        <p className="text-xl text-gray-600">
          মোট {division.seats} টি সংসদীয় আসন
        </p>
      </div>

      {/* Districts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {districtsData
          .filter((d) => d.divisionId === params.division)
          .map((district) => (
            <div
              key={district.id}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-2xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {district.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{district.seats} টি আসন</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                {district.name} জেলার সকল নির্বাচনী এলাকার তথ্য দেখুন
              </p>
              <Link href={`/district/${district.id}`}>
                <button className="w-full bg-[#C8102E] text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  জেলা দেখুন
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ))}
      </div>
    </SectionWrapper>
  );
}
