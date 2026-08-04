"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const NAV_ITEMS = [
  { href: "/admin/subscribers", label: "Kayıtlı E-postalar" },
  { href: "/admin/appointments", label: "Randevular" },
  { href: "/admin/customers", label: "Müşteriler" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuth();

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-zinc-900 bg-[#0a090d] sm:h-screen sm:w-60 sm:border-b-0 sm:border-r">
      <div className="flex items-center gap-2 px-6 py-5">
        <Image src="/logo.png" alt="NEWU" width={646} height={96} className="h-6 w-auto" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-[#18151c] text-white" : "text-zinc-400 hover:bg-[#18151c] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-900 px-6 py-4">
        {user && <p className="mb-2 truncate text-xs text-zinc-500">{user.email}</p>}
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-medium text-zinc-400 transition hover:text-white"
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
