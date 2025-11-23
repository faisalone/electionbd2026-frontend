import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

type Props = {
  params: Promise<{ uid: string }>;
};

// Fetch product data for metadata generation
async function getProduct(uid: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/marketplace/products/${uid}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch product for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.uid);

  if (!product) {
    return {
      title: "পণ্য খুঁজে পাওয়া যায়নি | ভোটমামু মার্কেটপ্লেস",
      description: "দুঃখিত, এই পণ্যটি খুঁজে পাওয়া যায়নি।",
    };
  }

  const imageUrl = product.images?.[0]?.thumbnail_url
    ? product.images[0].thumbnail_url
    : "https://votemamu.com/votemamu-photocard-preview.jpg";

  const categoryLabels: Record<string, string> = {
    banner: "ব্যানার",
    logo: "লোগো",
    poster: "পোস্টার",
    social_media: "সোশ্যাল মিডিয়া",
    flyer: "ফ্লায়ার",
    brochure: "ব্রোশার",
    business_card: "বিজনেস কার্ড",
    other: "অন্যান্য",
  };

  const category = categoryLabels[product.category] || product.category;
  const description = product.description
    ? product.description.slice(0, 160)
    : `${product.title} - ${category} ডিজাইন টেমপ্লেট। ${product.creator?.name || "পেশাদার ডিজাইনার"} দ্বারা তৈরি।`;

  return {
    title: `${product.title} | ভোটমামু মার্কেটপ্লেস`,
    description,
    keywords: `${product.title}, ${category}, নির্বাচনী ডিজাইন, ${product.creator?.name || ""}${product.tags ? ", " + product.tags.join(", ") : ""}`,
    openGraph: {
      title: `${product.title} | ভোটমামু মার্কেটপ্লেস`,
      description,
      type: "website",
      url: `https://votemamu.com/market/${product.uid}`,
      siteName: "ভোটমামু",
      locale: "bn_BD",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | ভোটমামু মার্কেটপ্লেস`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://votemamu.com/market/${product.uid}`,
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

export default function ProductDetailPage({ params }: Props) {
  return <ProductDetailClient />;
}
