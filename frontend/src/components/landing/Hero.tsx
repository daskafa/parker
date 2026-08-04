import Image from "next/image";
import { Container } from "./Container";
import { HeroArt } from "./HeroArt";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black">
      <Container className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Developer
            <br />
            Resources
          </h1>
          <p className="mt-6 max-w-xs text-sm text-zinc-400 sm:text-base">
            A manual for joining the Solana ecosystem. By builders for builders.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="cursor-pointer rounded-full bg-[#14F195] px-6 py-3 text-sm font-semibold text-black transition hover:bg-white hover:text-[#14F195]"
            >
              BUILD NOW
            </a>
            <a
              href="#"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-black"
            >
              STACK EXCHANGE
              <Image src="/stock-exchange-icon.png" alt="" width={15} height={19} />
            </a>
          </div>
        </div>

        <HeroArt />
      </Container>
    </section>
  );
}
