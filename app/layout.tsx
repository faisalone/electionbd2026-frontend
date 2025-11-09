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
  title: "বাংলা নির্বাচন পোর্টাল ২০২৬ | Bangladesh Election Portal",
  description: "বাংলাদেশের সবচেয়ে বিশ্বস্ত নির্বাচন তথ্য পোর্টাল - প্রার্থী, দল, আসন এবং লাইভ ফলাফল",
  keywords: "বাংলাদেশ নির্বাচন, election, প্রার্থী, দল, ভোট",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={notoSansBengali.variable} suppressHydrationWarning>
      <body className="antialiased bg-gray-50" suppressHydrationWarning>
        <Navbar />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
