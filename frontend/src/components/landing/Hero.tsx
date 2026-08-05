import Image from "next/image";
import { Container } from "./Container";
import { DeadLink } from "./DeadLink";
import { HeroArt } from "./HeroArt";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Viewport sağ kenarına yaslı glow — Container dışında */}
      <div
        className="pointer-events-none absolute top-0 right-0 z-0 h-[min(100%,720px)] w-[min(100%,640px)] sm:w-[min(70%,720px)] lg:w-[min(55%,760px)]"
        aria-hidden
      >
        <Image
          src="/rectangle.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 55vw, 70vw"
          className="object-cover object-right-top"
          priority
        />
      </div>

      <Container className="relative z-10 grid items-start gap-10 pt-[129px] pb-14 sm:pb-20 lg:grid-cols-2 lg:gap-16 lg:pb-28">
        <div>
          <h1 className="text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Developer
            <br />
            Resources
          </h1>
          <p className="mt-6 max-w-xs text-sm text-[#C4C4C4] sm:text-base">
            A manual for joining the Solana ecosystem. By builders for builders.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <DeadLink className="cursor-pointer rounded-full bg-[#14F195] px-6 py-3 text-sm text-black transition hover:bg-white hover:text-[#14F195]">
              BUILD NOW
            </DeadLink>
            <DeadLink className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-sm text-white transition hover:border-white hover:bg-white hover:text-black">
              STACK EXCHANGE
              <Image src="/stock-exchange-icon.png" alt="" width={15} height={19} />
            </DeadLink>
          </div>
        </div>

        <HeroArt />
      </Container>
    </section>
  );
}
