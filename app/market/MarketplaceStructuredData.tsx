export default function MarketplaceStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "মার্কেটপ্লেস | ভোটমামু",
    "description": "বাংলাদেশের নির্বাচনী ক্যাম্পেইনের জন্য পেশাদার ডিজাইন টেমপ্লেট",
    "url": "https://votemamu.com/market",
    "inLanguage": "bn-BD",
    "isPartOf": {
      "@type": "WebSite",
      "name": "ভোটমামু",
      "url": "https://votemamu.com"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
