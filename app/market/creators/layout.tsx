import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "পেশাদার ডিজাইনার | ভোটমামু মার্কেটপ্লেস",
  description: "বাংলাদেশের সেরা নির্বাচনী ডিজাইনারদের সাথে যুক্ত হন। অভিজ্ঞ ক্রিয়েটরদের থেকে পেশাদার ডিজাইন সেবা নিন - ব্যানার, পোস্টার, লোগো এবং আরও অনেক কিছু।",
  keywords: "পেশাদার ডিজাইনার, গ্রাফিক ডিজাইনার, নির্বাচনী ডিজাইনার, ক্রিয়েটর, বাংলাদেশ, ফ্রিল্যান্স ডিজাইনার",
  openGraph: {
    title: "পেশাদার ডিজাইনার | ভোটমামু মার্কেটপ্লেস",
    description: "বাংলাদেশের সেরা নির্বাচনী ডিজাইনারদের সাথে যুক্ত হন। অভিজ্ঞ ক্রিয়েটরদের থেকে পেশাদার ডিজাইন সেবা নিন।",
    type: "website",
    url: "https://votemamu.com/market/creators",
    siteName: "ভোটমামু",
    locale: "bn_BD",
    images: [
      {
        url: "/votemamu-preview.jpg",
        width: 1200,
        height: 630,
        alt: "ভোটমামু মার্কেটপ্লেস - পেশাদার ডিজাইনার",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "পেশাদার ডিজাইনার | ভোটমামু মার্কেটপ্লেস",
    description: "বাংলাদেশের সেরা নির্বাচনী ডিজাইনারদের সাথে যুক্ত হন",
    images: ["/votemamu-preview.jpg"],
  },
  alternates: {
    canonical: "https://votemamu.com/market/creators",
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
