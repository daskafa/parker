import Image from "next/image";
import { Container } from "./Container";
import { DeadLink } from "./DeadLink";

export function Changelog() {
  return (
    <section>
      <Container className="grid items-center gap-10 pb-16 sm:pb-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-2xl font-normal text-white sm:text-3xl">Solana Changelog</h2>
          <p className="mt-4 max-w-md text-base text-white">
            Some more Solana changes from Jacob &amp; Joe. Subscribe to the newsletter:
            https://solana.us17.list-manage.com/s... Proposal - Priced Compute Units: ...
          </p>
          <DeadLink className="mt-6 inline-flex w-fit cursor-pointer items-center rounded-full border !border-white px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-white hover:text-black">
            LATEST EPISODE
          </DeadLink>
        </div>

        <div className="relative mx-auto aspect-[1152/658] w-full max-w-md" aria-hidden>
          <Image src="/footer-changelog.png" alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-contain" />
        </div>
      </Container>
    </section>
  );
}
