import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ভোটমামু এআই এজেন্ট | নির্বাচন বিষয়ক খবরাখবর - আনঅফিসিয়াল",
  description: "বাংলাদেশের জাতীয় নির্বাচন ২০২৬ নিয়ে নানা ধরনের খবর পাবেন আমাদের সাইটে - প্রার্থী, দল, আসন এবং লাইভ ফলাফল",
  keywords: "বাংলাদেশ, নির্বাচন, সংবাদ, খবর, কুইজ, পোল, প্রার্থী, দল, ভোট",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={notoSansBengali.variable} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
