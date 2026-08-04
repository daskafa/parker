import type { Metadata } from "next";
import { AdminGuard } from "@/contexts/AdminAuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: {
    absolute: "Admin | Panel | NEWU",
  },
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen flex-col bg-black sm:flex-row">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden px-4 py-8 sm:px-8">{children}</main>
      </div>
    </AdminGuard>
  );
}
