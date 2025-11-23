import type { Metadata } from "next";
import { MarketAuthProvider } from '@/lib/market-auth-context';
import MarketplaceStructuredData from './MarketplaceStructuredData';

export const metadata: Metadata = {
  title: "মার্কেটপ্লেস | ভোটমামু | নির্বাচনী ডিজাইন ও টেমপ্লেট",
  description: "বাংলাদেশের নির্বাচনী ক্যাম্পেইনের জন্য পেশাদার ডিজাইন টেমপ্লেট - ব্যানার, পোস্টার, লোগো, ফ্লায়ার এবং আরও অনেক কিছু। দক্ষ ডিজাইনারদের থেকে সরাসরি কিনুন।",
  keywords: "নির্বাচনী ডিজাইন, ব্যানার, পোস্টার, লোগো, ফ্লায়ার, সোশ্যাল মিডিয়া পোস্ট, রাজনৈতিক ক্যাম্পেইন, প্রচারণা ডিজাইন, বাংলাদেশ",
  openGraph: {
    title: "মার্কেটপ্লেস | ভোটমামু",
    description: "বাংলাদেশের নির্বাচনী ক্যাম্পেইনের জন্য পেশাদার ডিজাইন টেমপ্লেট - ব্যানার, পোস্টার, লোগো, ফ্লায়ার এবং আরও অনেক কিছু।",
    type: "website",
    url: "https://votemamu.com/market",
    siteName: "ভোটমামু",
    locale: "bn_BD",
    images: [
      {
        url: "/votemamu-preview.jpg",
        width: 1200,
        height: 630,
        alt: "ভোটমামু মার্কেটপ্লেস - নির্বাচনী ডিজাইন ও টেমপ্লেট",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "মার্কেটপ্লেস | ভোটমামু",
    description: "বাংলাদেশের নির্বাচনী ক্যাম্পেইনের জন্য পেশাদার ডিজাইন টেমপ্লেট",
    images: ["/votemamu-preview.jpg"],
  },
  alternates: {
    canonical: "https://votemamu.com/market",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketAuthProvider>
      <MarketplaceStructuredData />
      {children}
    </MarketAuthProvider>
  );
}
