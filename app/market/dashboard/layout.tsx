'use client';

import MarketAdminNavbar from '@/components/market/MarketAdminNavbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MarketAdminNavbar />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
          {children}
        </div>
      </main>
    </div>
  );
}
