import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Admin | Randevular | NEWU",
  },
};

export default function AppointmentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
