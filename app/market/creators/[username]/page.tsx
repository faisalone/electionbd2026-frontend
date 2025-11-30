import type { Metadata } from "next";
import CreatorProfileClient from "./CreatorProfileClient";

type Props = {
  params: Promise<{ username: string }>;
};

// Fetch creator data for metadata generation
async function getCreator(username: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/creators/${username}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch creator for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const creator = await getCreator(resolvedParams.username);

  if (!creator) {
    return {
      title: "ক্রিয়েটর খুঁজে পাওয়া যায়নি | ভোটমামু মার্কেটপ্লেস",
      description: "দুঃখিত, এই ক্রিয়েটরকে খুঁজে পাওয়া যায়নি।",
    };
  }

  const avatarUrl = creator.avatar
    ? `https://api.votemamu.com/storage/${creator.avatar}`
    : "https://votemamu.com/preview/preview-1.jpg";

  const description = creator.bio
    ? creator.bio.slice(0, 160)
    : `${creator.name} - পেশাদার ক্রিয়েটর। ${creator.total_products || 0}+ ডিজাইন টেমপ্লেট এবং ${creator.total_downloads || 0}+ ডাউনলোড সহ অভিজ্ঞ ক্রিয়েটর।`;

  return {
    title: `${creator.name} | পেশাদার ক্রিয়েটর | ভোটমামু মার্কেটপ্লেস`,
    description,
    keywords: `${creator.name}, ${creator.username}, পেশাদার ক্রিয়েটর, নির্বাচনী ডিজাইন, গ্রাফিক ক্রিয়েটর, বাংলাদেশ`,
    openGraph: {
      title: `${creator.name} | ভোটমামু মার্কেটপ্লেস`,
      description,
      type: "profile",
      url: `https://votemamu.com/market/creators/${creator.username}`,
      siteName: "ভোটমামু",
      locale: "bn_BD",
      images: [
        {
          url: avatarUrl,
          width: 400,
          height: 400,
          alt: `${creator.name} - প্রোফাইল ছবি`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${creator.name} | ভোটমামু মার্কেটপ্লেস`,
      description,
      images: [avatarUrl],
    },
    alternates: {
      canonical: `https://votemamu.com/market/creators/${creator.username}`,
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
}

export default function CreatorProfilePage({ params }: Props) {
  return <CreatorProfileClient />;
}
