import Image from "next/image";
import { Container } from "./Container";
import { DeadLink } from "./DeadLink";

const DOCS = [
  {
    title: "Solana Docs",
    description: "Learn how Solana works and get a high-level understanding of Solana's architecture.",
  },
  {
    title: "Metaplex Docs",
    description: "Learn what you build with Metaplex, make the process of creating and launching NFTs easier.",
  },
];

export function GoToSource() {
  return (
    <section>
      <Container className="py-16 sm:py-20">
        <h2 className="text-3xl font-normal text-white sm:text-4xl">Go to the source.</h2>
        <p className="mt-2 text-sm text-[#C4C4C4] sm:text-base">Read the documentation for Solana and popular tools.</p>

        <div className="mt-8 grid gap-10 sm:grid-cols-2 sm:gap-16">
          {DOCS.map((doc) => (
            <div key={doc.title}>
              <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <h3 className="text-[32px] font-normal leading-tight text-white">{doc.title}</h3>
                <DeadLink className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border !border-white px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-white hover:text-black">
                  VIEW ALL
                  <Image src="/top-right-arrow.svg" alt="" width={11} height={11} />
                </DeadLink>
              </div>
              <p className="mt-4 text-base text-white">{doc.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
