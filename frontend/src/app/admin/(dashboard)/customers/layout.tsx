import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Admin | Müşteriler | NEWU",
  },
};

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
