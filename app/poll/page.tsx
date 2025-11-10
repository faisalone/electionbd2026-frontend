import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'সকল পোল | ভোটমামু',
  description: 'সকল জরিপ এবং পোল দেখুন',
};

async function PollList() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/polls`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">জরিপ লোড করতে সমস্যা হয়েছে</p>
      </div>
    );
  }

  const result = await response.json();
  const polls = result.data || [];

  if (polls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">কোনো জরিপ পাওয়া যায়নি</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {polls.map((poll: any) => (
        <Link key={poll.id} href={`/poll/${poll.uid || poll.id}`}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-xl font-bold mb-2">{poll.question}</h3>
            <p className="text-gray-600 mb-4">মোট ভোট: {poll.total_votes}</p>
            <div className="text-blue-600 font-medium">বিস্তারিত দেখুন →</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function PollPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">সকল জরিপ</h1>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
          }
        >
          <PollList />
        </Suspense>
      </div>
    </div>
  );
}
