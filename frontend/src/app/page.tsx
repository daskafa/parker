import type { Metadata } from "next";
import { Changelog } from "@/components/landing/Changelog";
import { CtaSection } from "@/components/landing/CtaSection";
import { DigDeeper } from "@/components/landing/DigDeeper";
import { Footer } from "@/components/landing/Footer";
import { GetStarted } from "@/components/landing/GetStarted";
import { GoToSource } from "@/components/landing/GoToSource";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { TopBanner } from "@/components/landing/TopBanner";

export const metadata: Metadata = {
  title: "Ana Sayfa",
};

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background text-foreground">
      <TopBanner />
      <Header />
      <main className="flex-1">
        <Hero />
        <GetStarted />
        <DigDeeper />
        <div className="bg-[linear-gradient(to_bottom,#19161C_0%,#000000_42%)]">
          <GoToSource />
          <Changelog />
        </div>
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
