import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "sonner";

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ভোটমামু এআই এজেন্ট | নির্বাচন বিষয়ক খবরাখবর - আনঅফিসিয়াল",
  description: "বাংলাদেশের জাতীয় নির্বাচন ২০২৬ নিয়ে নানা ধরনের খবর পাবেন আমাদের সাইটে - প্রার্থী, দল, আসন এবং লাইভ ফলাফল",
  keywords: "বাংলাদেশ, নির্বাচন, সংবাদ, খবর, কুইজ, পোল, প্রার্থী, দল, ভোট",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
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
        <CartProvider>
          <Toaster position="top-center" richColors />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
