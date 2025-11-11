'use client';

import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminFooter from "@/components/admin/AdminFooter";
import { Toaster } from "@/components/admin/Toaster";
import { AdminProvider } from "@/lib/admin/context";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <AdminProvider>
      <Toaster />
      {!isLoginPage && <AdminNavbar />}
      <main className="min-h-screen">
        <div className={!isLoginPage ? "max-w-7xl mx-auto px-4" : ""}>
          {children}
        </div>
      </main>
      {!isLoginPage && <AdminFooter />}
    </AdminProvider>
  );
}
