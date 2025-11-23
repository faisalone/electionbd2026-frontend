import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { MarketAuthProvider } from "@/lib/market-auth-context";

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://votemamu.com"),
  title: "ভোটমামু | নির্বাচন বিষয়ক সর্বশেষ খবরাখবর | সর্বপ্রথম এআইভিত্তিক সংবাদ",
  description: "বাংলাদেশের জাতীয় নির্বাচন ২০২৬ নিয়ে নানা ধরনের খবর পাবেন আমাদের সাইটে - প্রার্থী, দল, আসন এবং জরিপ লাইভ ফলাফল",
  keywords: "বাংলাদেশ, নির্বাচন, সংবাদ, খবর, কুইজ, জরিপ, পোল, প্রার্থী, দল, ভোট, ইলেকশন, বিএনপি, জামায়াত, এনসিপি",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "https://votemamu.com",
    siteName: "ভোটমামু",
    images: [
      {
        url: "/votemamu-photocard-preview.jpg",
        width: 1200,
        height: 630,
        alt: "ভোটমামু - বাংলাদেশের নির্বাচনী তথ্য",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  other: {
    "google-adsense-account": "ca-pub-7729379301809021",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={notoSansBengali.variable} suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7729379301809021"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <GoogleAnalytics />
        <Toaster position="top-center" richColors />
        <AuthProvider>
          <MarketAuthProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </MarketAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
