import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - ভোটমামু",
  description: "Secure admin authentication via WhatsApp OTP",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
