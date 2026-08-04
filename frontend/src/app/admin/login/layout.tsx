import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Admin | Giriş | NEWU",
  },
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
