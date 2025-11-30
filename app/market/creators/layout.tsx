import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.votemamu.com'),
  title: "পেশাদার ক্রিয়েটর | ভোটমামু মার্কেটপ্লেস",
  description: "বাংলাদেশের সেরা নির্বাচনী ক্রিয়েটরদের সাথে যুক্ত হন। অভিজ্ঞ ক্রিয়েটরদের থেকে পেশাদার ডিজাইন সেবা নিন - ব্যানার, পোস্টার, লোগো এবং আরও অনেক কিছু।",
  keywords: "পেশাদার ক্রিয়েটর, গ্রাফিক ক্রিয়েটর, নির্বাচনী ক্রিয়েটর, ক্রিয়েটর, বাংলাদেশ, ফ্রিল্যান্স ক্রিয়েটর",
  openGraph: {
    title: "পেশাদার ক্রিয়েটর | ভোটমামু মার্কেটপ্লেস",
    description: "বাংলাদেশের সেরা নির্বাচনী ক্রিয়েটরদের সাথে যুক্ত হন। অভিজ্ঞ ক্রিয়েটরদের থেকে পেশাদার ডিজাইন সেবা নিন।",
    type: "website",
    url: "https://www.votemamu.com/market/creators",
    siteName: "ভোটমামু",
    locale: "bn_BD",
    images: [
      {
        url: "/preview/preview-1.jpg",
        width: 1200,
        height: 630,
        alt: "ভোটমামু মার্কেটপ্লেস - পেশাদার ক্রিয়েটর",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "পেশাদার ক্রিয়েটর | ভোটমামু মার্কেটপ্লেস",
    description: "বাংলাদেশের সেরা নির্বাচনী ক্রিয়েটরদের সাথে যুক্ত হন",
    images: ["/preview/preview-1.jpg"],
  },
  alternates: {
    canonical: "https://www.votemamu.com/market/creators",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function CreatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
