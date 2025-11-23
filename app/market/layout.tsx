import { MarketAuthProvider } from '@/lib/market-auth-context';

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketAuthProvider>
      {children}
    </MarketAuthProvider>
  );
}
